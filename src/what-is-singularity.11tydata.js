export default {
  eleventyComputed: {
    jsonld: data => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.title,
      description: data.description,
      url: new URL('/what-is-singularity/', data.site.url).href,
      inLanguage: data.site.language,
      isPartOf: { '@type': 'WebSite', name: data.site.title, url: data.site.url },
    }).replace(/</g, '\\u003c'),
  },
};
