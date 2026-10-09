// Defaults applied to every article in src/articles.
// URL: /articles/<slug>/ where <slug> is the filename without the YYYY-MM-DD- prefix.
export default {
  layout: "layouts/article.njk",
  ogType: "article",
  eleventyComputed: {
    permalink: (data) =>
      data.draft ? false : `/articles/${data.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "")}/`,
    author: (data) => data.author || data.site.defaultAuthor,
    jsonld: (data) =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: data.title,
        description: data.description,
        image: [new URL(data.hero || data.site.defaultImage, data.site.url).href],
        datePublished: new Date(data.page.date).toISOString(),
        dateModified: new Date(data.updated || data.page.date).toISOString(),
        articleSection: data.category,
        author: { "@type": "Organization", name: data.author || data.site.defaultAuthor },
        publisher: {
          "@type": "Organization",
          name: data.site.title,
          logo: { "@type": "ImageObject", url: `${data.site.url}/images/brand/apple-touch-icon.png` },
        },
        mainEntityOfPage: `${data.site.url}${data.page.url || ""}`,
      }).replace(/</g, "\\u003c"),
  },
};
