// Defaults applied to every article in src/articles.
const authorSlug = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// A named author is any `author` value other than the house name (site.defaultAuthor).
const isPerson = (data) => Boolean(data.author) && data.author !== data.site.defaultAuthor;
// URL: /articles/<slug>/ where <slug> is the filename without the YYYY-MM-DD- prefix.
export default {
  layout: "layouts/article.njk",
  ogType: "article",
  eleventyComputed: {
    permalink: (data) =>
      data.draft ? false : `/articles/${data.page.fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "")}/`,
    author: (data) => data.author || data.site.defaultAuthor,
    authorUrl: (data) => (isPerson(data) ? `/authors/${authorSlug(data.author)}/` : ""),
  },
};
