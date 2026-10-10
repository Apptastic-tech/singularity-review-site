// Eleventy configuration for Singularity Review.
// Content lives in src/articles (one markdown file per article).

import site from "./src/_data/site.js";
import { insertArticleAds } from "./src/_lib/ads.js";
import Image from "@11ty/eleventy-img";
import { createRequire } from "node:module";
import path from "node:path";
import { access } from "node:fs/promises";
import { sentenceTitle } from "./src/_lib/editorial.js";
import { articleSection } from "./src/_lib/sections.js";
import { pageMetadata, pageGraph, json, latestModified } from "./src/_lib/seo.js";

// Cache busting: {{ "/css/style.css" | asset }} -> /css/style.css?v=<content hash>
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
const assetHashes = new Map();
const assetUrl = (url) => {
  const clean = String(url).split("?")[0];
  if (!assetHashes.has(clean)) {
    let hash = "dev";
    try {
      hash = createHash("sha256").update(readFileSync("src" + clean)).digest("hex").slice(0, 10);
    } catch {
      hash = Date.now().toString(36);
    }
    assetHashes.set(clean, hash);
  }
  return `${clean}?v=${assetHashes.get(clean)}`;
};


let outputDirectory = "_site";
const imageJobs = new Map();
const cardSizes = "(min-width: 1312px) 1248px, (min-width: 640px) calc(100vw - 64px), 100vw";
const brandJobs = new Map();
const inlineImageJobs = new Map();
// Reuse eleventy-img's Sharp runtime, avoiding two libvips versions in one process.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("@11ty/eleventy-img"))("sharp");

async function heroImages(src, article = src) {
  if (!/^\/images\/articles\/[a-z0-9-]+\.jpg$/.test(src || "")) {
    throw new Error(`Invalid hero for article "${article}": expected /images/articles/<slug>.jpg, received "${src}".`);
  }
  const input = path.resolve("src", src.slice(1));
  try { await access(input); } catch {
    throw new Error(`Missing hero for article "${article}": ${input}. Add the JPG referenced by hero.`);
  }
  if (!imageJobs.has(input)) {
    imageJobs.set(input, Image(input, {
      widths: [480, 800, 1280],
      formats: ["avif", "webp", "jpeg"],
      outputDir: path.join(outputDirectory, "img"),
      urlPath: "/img/",
      sharpOptions: { animated: false },
      sharpAvifOptions: { quality: 50, effort: 4 },
      sharpWebpOptions: { quality: 78 },
      sharpJpegOptions: { quality: 82, progressive: true, mozjpeg: true },
    }));
  }
  return imageJobs.get(input);
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const escapeXml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default function (eleventyConfig) {
  const sitemapPages = new Map();
  eleventyConfig.on("eleventy.before", ({ directories }) => { outputDirectory = directories.output; sitemapPages.clear(); });
  eleventyConfig.addFilter("seoMetadata", pageMetadata);
  eleventyConfig.addFilter("latestModified", latestModified);
  eleventyConfig.addNunjucksAsyncShortcode("seoGraph", async function () {
    const data = this.ctx;
    const images = data.hero ? await heroImages(data.hero, data.title) : undefined;
    const image = images?.jpeg.find(item => item.width >= 1200)?.url || data.hero;
    return json(pageGraph(data, image));
  });
  // Collect current rendered pages, including pages excluded from article collections.
  // Dates come only from explicit updates or the articles included on a page.
  eleventyConfig.addTransform("collectSitemapPages", (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html") || /<meta name="robots" content="noindex/.test(content)) return content;
    const graph = JSON.parse(content.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])["@graph"];
    const page = graph.find(item => item["@id"].endsWith("#webpage"));
    sitemapPages.set(page.url, page.dateModified);
    return content;
  });
  eleventyConfig.on("eleventy.after", () => {
    if (!site.adsense.client && !site.adsense.preview) rmSync(path.join(outputDirectory, "js/ads.js"), { force: true });
    const entries = [...sitemapPages].sort(([a], [b]) => a.localeCompare(b)).map(([url, date]) =>
      `  <url><loc>${escapeXml(url)}</loc>${date ? `<lastmod>${date.slice(0, 10)}</lastmod>` : ""}</url>`);
    writeFileSync(path.join(outputDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`);
  });
  eleventyConfig.addFilter("articleAds", insertArticleAds);
  eleventyConfig.addFilter("asset", assetUrl);
  eleventyConfig.addFilter("sentenceTitle", sentenceTitle);
  eleventyConfig.on("eleventy.before", () => assetHashes.clear());
  eleventyConfig.on("eleventy.before", () => imageJobs.clear());
  eleventyConfig.on("eleventy.before", () => brandJobs.clear());
  eleventyConfig.on("eleventy.before", () => inlineImageJobs.clear());
  // Reserve local Markdown image slots without changing editor-owned article files.
  eleventyConfig.addTransform("reserveLocalImageGeometry", async (content, outputPath) => {
    if (typeof outputPath !== "string" || !outputPath.endsWith(".html")) return content;
    for (const [tag] of [...content.matchAll(/<img\b[^>]*>/g)]) {
      const hasWidth = /\bwidth="\d+"/.test(tag), hasHeight = /\bheight="\d+"/.test(tag);
      if (hasWidth && hasHeight) continue;
      const src = tag.match(/\bsrc="(\/images\/[^"?#]+)"/)?.[1];
      if (!src) continue;
      const input = path.resolve("src", src.slice(1));
      if (!input.startsWith(path.resolve("src/images") + path.sep)) throw new Error("Image path leaves the source image directory");
      if (!inlineImageJobs.has(input)) inlineImageJobs.set(input, sharp(input).metadata());
      const metadata = await inlineImageJobs.get(input);
      if (!metadata.width || !metadata.height) throw new Error(`Image dimensions unavailable: ${src}`);
      const width = hasWidth ? Number(tag.match(/\bwidth="(\d+)"/)[1]) : hasHeight ? Math.round(Number(tag.match(/\bheight="(\d+)"/)[1]) * metadata.width / metadata.height) : metadata.width;
      const height = hasHeight ? Number(tag.match(/\bheight="(\d+)"/)[1]) : Math.round(width * metadata.height / metadata.width);
      const attributes = `${hasWidth ? "" : ` width="${width}"`}${hasHeight ? "" : ` height="${height}"`}${/\bloading=/.test(tag) ? "" : ' loading="lazy"'}${/\bdecoding=/.test(tag) ? "" : ' decoding="async"'}`;
      content = content.replace(tag, tag.replace(/\s*\/?>(?=$)/, attributes + ">"));
    }
    return content;
  });
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-32.png": "favicon-32.png", "src/favicon-48.png": "favicon-48.png" });
  eleventyConfig.addPassthroughCopy(Object.fromEntries(readdirSync("src/js")
    .filter(file => file.endsWith(".js") && (file !== "ads.js" || site.adsense.client || site.adsense.preview))
    .map(file => ["src/js/" + file, "js/" + file])));
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2": "fonts/newsreader-latin-wght-normal.woff2",
    "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2": "fonts/newsreader-latin-wght-italic.woff2",
    "node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2": "fonts/inter-tight-latin-wght-normal.woff2",
  });

  eleventyConfig.addNunjucksAsyncShortcode("picture", async function (src, alt, sizes = cardSizes, loading = "lazy", fetchpriority = "auto", classes = "", article = src) {
    const metadata = await heroImages(src, article);
    return Image.generateHTML(metadata, { alt, sizes, loading, fetchpriority, class: classes, decoding: "async" });
  });
  eleventyConfig.addNunjucksAsyncShortcode("preloadHero", async function (src, sizes = cardSizes, article = src) {
    const metadata = await heroImages(src, article);
    const variants = metadata.avif;
    return `<link rel="preload" as="image" type="image/avif" href="${variants.at(-1).url}" imagesrcset="${variants.map(image => image.srcset).join(", ")}" imagesizes="${escapeXml(sizes)}" fetchpriority="high">`;
  });
  eleventyConfig.addNunjucksAsyncShortcode("brandPicture", async function (name, sizes = "100vw", classes = "", priority = "auto") {
    if (!["skyline-kittpeak", "blackhole-wide"].includes(name)) throw new Error(`Unknown brand image: ${name}`);
    if (!brandJobs.has(name)) brandJobs.set(name, Image(`src/images/brand/${name}.jpg`, {
      widths: name === "skyline-kittpeak" ? [1440, 1920, 2880, 3840] : [480, 800, 1280], formats: ["avif", "webp", "jpeg"],
      outputDir: path.join(outputDirectory, "img/brand"), urlPath: "/img/brand/",
      sharpAvifOptions: { quality: 65, effort: 5 }, sharpWebpOptions: { quality: 88 },
      sharpJpegOptions: { quality: 82, progressive: true, chromaSubsampling: "4:4:4" },
    }));
    const html = Image.generateHTML(await brandJobs.get(name), {
      alt: "", sizes, loading: "eager", fetchpriority: priority, decoding: "async", class: classes,
    });
    if (name !== "skyline-kittpeak") return html;
    // Art direction keeps the dome below and left of the mobile photon ring.
    // Lossless source extraction, then eleventy-img encodes each responsive format.
    if (!brandJobs.has("skyline-mobile")) brandJobs.set("skyline-mobile", (async () => {
      const crop = await sharp("src/images/brand/skyline-kittpeak.jpg")
        .extract({ left: 2100, top: 500, width: 2800, height: 2800 }).png().toBuffer();
      return Image(crop, {
        widths: [1280, 1920, 2560], formats: ["avif", "webp", "jpeg"],
        outputDir: "./_site/img/brand/", urlPath: "/img/brand/",
        sharpAvifOptions: { quality: 65, effort: 5 }, sharpWebpOptions: { quality: 88 },
        sharpJpegOptions: { quality: 82, progressive: true, chromaSubsampling: "4:4:4" },
      });
    })());
    const mobile = await brandJobs.get("skyline-mobile");
    const sources = ["avif", "webp", "jpeg"].map(format =>
      `<source media="(max-width: 639px)" type="${mobile[format][0].sourceType}" srcset="${mobile[format].map(image => image.srcset).join(", ")}" sizes="640px">`).join("");
    return html.replace("<picture>", `<picture>${sources}`);
  });

  // Articles: newest first
  eleventyConfig.addCollection("articles", (api) =>
    api
      .getFilteredByGlob("src/articles/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  for (const [name, section] of [['headlines', 'news'], ['featured', 'featured']]) {
    eleventyConfig.addCollection(name, (api) => api.getFilteredByGlob('src/articles/*.md')
      .filter(item => !item.data.draft && articleSection(item.data) === section)
      .sort((a, b) => b.date - a.date));
  }

  eleventyConfig.addFilter('navigationSection', (url, author, defaultAuthor) => {
    url = String(url || '/');
    if (url === '/about/') return 'about';
    if (url === '/what-is-singularity/') return 'singularity';
    if (url === '/featured/' || url.startsWith('/authors/')) return 'featured';
    if (url.startsWith('/articles/') && author && author !== defaultAuthor) return 'featured';
    return 'news';
  });


  // Categories: [{ name, slug, articles: [...] }], sorted by most recent article
  // Named (non-house) authors: [{ name, slug, articles }], newest article first.
  // An article has a named author when frontmatter `author` is set and differs from site.defaultAuthor.
  eleventyConfig.addCollection("authors", (api) => {
    const map = new Map();
    const articles = api
      .getFilteredByGlob("src/articles/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date);
    for (const item of articles) {
      const name = item.data.author;
      if (!name || name === item.data.site?.defaultAuthor) continue;
      const slug = slugify(name);
      if (!map.has(slug)) {
        const profile = item.data.authorProfiles?.find(profile => profile.slug === slug || profile.name === name) || {};
        map.set(slug, { ...profile, name, slug, articles: [] });
      }
      map.get(slug).articles.push(item);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addCollection("categories", (api) => {
    const articles = api
      .getFilteredByGlob("src/articles/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date);
    const map = new Map();
    for (const item of articles) {
      const name = item.data.category || "News";
      const slug = slugify(name);
      if (!map.has(slug)) map.set(slug, { name, slug, articles: [] });
      map.get(slug).articles.push(item);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("slugify", slugify);
  eleventyConfig.addFilter("xmlEscape", escapeXml);

  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try {
      return new URL(path || "/", base).href;
    } catch {
      return path;
    }
  });

  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("shortDate", (date) =>
    new Date(date).toISOString().slice(0, 10)
  );
  eleventyConfig.addFilter("rfc822", (date) => new Date(date).toUTCString());

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = String(content || "")
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 230));
  });

  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("exclude", (arr, url) =>
    (arr || []).filter((item) => item.url !== url)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
