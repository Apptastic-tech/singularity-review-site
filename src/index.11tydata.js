// Homepage structured data: WebSite plus Organization, both carrying the site description.
export default {
  eleventyComputed: {
    jsonld: (data) => {
      if (!data.site || data.pagination?.pageNumber) return undefined;
      const { site } = data;
      return JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${site.url}/#website`,
            name: site.title,
            url: `${site.url}/`,
            description: site.description,
            inLanguage: site.language,
            publisher: { "@id": `${site.url}/#organization` },
          },
          {
            "@type": "Organization",
            "@id": `${site.url}/#organization`,
            name: site.title,
            url: `${site.url}/`,
            description: site.description,
            logo: { "@type": "ImageObject", url: `${site.url}/images/brand/apple-touch-icon.png` },
            sameAs: [site.facebook, site.instagram],
          },
        ],
      }).replace(/</g, "\\u003c");
    },
  },
};
