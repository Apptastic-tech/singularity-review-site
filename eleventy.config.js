// Eleventy configuration for Singularity Review.
// Content lives in src/articles (one markdown file per article).

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
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

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
