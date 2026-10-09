// Eleventy configuration for Singularity Review.
// Content lives in src/articles (one markdown file per article).

import Image from "@11ty/eleventy-img";
import path from "node:path";
import { access } from "node:fs/promises";

// Cache busting: {{ "/css/style.css" | asset }} -> /css/style.css?v=<content hash>
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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


const imageJobs = new Map();
const cardSizes = "(min-width: 776px) 760px, calc(100vw - 16px)";

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
      outputDir: "./_site/img/",
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
  eleventyConfig.addFilter("asset", assetUrl);
  eleventyConfig.on("eleventy.before", () => assetHashes.clear());
  eleventyConfig.on("eleventy.before", () => imageJobs.clear());
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
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

  // Articles: newest first
  eleventyConfig.addCollection("articles", (api) =>
    api
      .getFilteredByGlob("src/articles/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  // Categories: [{ name, slug, articles: [...] }], sorted by most recent article
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
