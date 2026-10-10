import { parseDocument } from 'htmlparser2';
import { findAll, textContent } from 'domutils';
import { sentenceTitle } from './editorial.js';

export const slugify = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const absolute = (url, site) => new URL(url || '/', site.url).href;
export const isoDate = date => new Date(date).toISOString();
export const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
export const modified = item => item.data.updated || item.date;
export const latestModified = items => items?.length ? isoDate(new Date(Math.max(...items.map(item => new Date(modified(item)).getTime())))) : undefined;

export function pageMetadata(data) {
  const { site, page, pagination, cat, person } = data;
  const number = (pagination?.pageNumber || 0) + 1;
  let title = `${sentenceTitle(data.title)} | ${site.title}`;
  let description = data.seoDescription || data.description;
  let type = 'WebPage';
  let updated = data.updated ? isoDate(data.updated) : undefined;
  if (data.homeFeed) {
    title = number === 1 ? 'Singularity Review: AI news, research, and analysis' : `News: Page ${number} | ${site.title}`;
    description = number === 1
      ? 'AI news, research, and analysis covering models, agents, policy and the technological singularity, with links to reporting and research.'
      : `Page ${number} of AI news from Singularity Review, covering model releases, agents, research findings and the policy decisions shaping their use.`;
    type = 'CollectionPage';
    updated = latestModified(number === 1 ? data.collections?.articles : data.feedItems);
  } else if (cat) {
    const descriptions = {
      Agents: 'News and analysis on AI agents, their use of tools and public websites, coordination between systems, and the risks of unintended actions.',
      Models: 'Coverage of AI model releases, open weights, performance claims and independent testing, including the choices facing developers and institutions.',
      Policy: 'Reporting on AI policy, government oversight, national security and how public institutions respond to the risks of advanced AI systems.',
    };
    description = descriptions[cat.name] || `${cat.name} articles from Singularity Review, covering developments in this topic and linking to the reporting and research behind each story.`;
    type = 'CollectionPage';
    updated = latestModified(cat.articles);
  } else if (person) {
    title = `${person.name} | ${site.title}`;
    description = `Articles by ${person.name} for Singularity Review, including personal perspectives and analysis on AI agents and the technological singularity.`;
    type = 'ProfilePage';
    updated = latestModified(person.articles);
  } else if (page.url === '/featured/') {
    type = 'CollectionPage';
    updated = latestModified(data.collections?.featured);
  } else if (['/about/', '/editorial-standards/'].includes(page.url)) type = 'AboutPage';
  return { title, description, type, updated, canonical: absolute(page.url, site) };
}

export function personEntity(person, site) {
  const url = absolute(`/authors/${person.slug}/`, site);
  return {
    '@type': 'Person', '@id': `${url}#person`, name: person.name, url,
    worksFor: { '@id': `${site.url}/#organization` },
    ...(person.bio ? { description: person.bio } : {}),
    ...(person.sameAs?.length ? { sameAs: person.sameAs } : {}),
  };
}

export function articleWordCount(content) {
  const dom = parseDocument(content || '');
  const body = findAll(node => (node.attribs?.class || '').split(/\s+/).includes('article-body'), dom.children)[0];
  return textContent(body || dom).trim().split(/\s+/u).filter(Boolean).length;
}

export function pageGraph(data, image) {
  const { site, page, cat, person } = data;
  const meta = pageMetadata(data), url = meta.canonical;
  const orgId = `${site.url}/#organization`, websiteId = `${site.url}/#website`;
  const ref = id => ({ '@id': id });
  const organization = {
    '@type': 'Organization', '@id': orgId, name: site.title, url: `${site.url}/`,
    logo: { '@type': 'ImageObject', '@id': `${site.url}/#logo`, url: absolute('/images/brand/social-avatar.png', site), width: 512, height: 512 },
    sameAs: [site.facebook, site.instagram].filter(Boolean),
  };
  const graph = [organization, {
    '@type': 'WebSite', '@id': websiteId, name: site.title, url: `${site.url}/`,
    publisher: ref(orgId), inLanguage: 'en',
  }];
  const trail = [{ name: 'Home', url: `${site.url}/` }];
  if (data.ogType === 'article') trail.push({ name: data.category, url: absolute(`/category/${slugify(data.category)}/`, site) });
  if (page.url !== '/') trail.push({ name: data.homeFeed ? `News: Page ${(data.pagination?.pageNumber || 0) + 1}` : person?.name || sentenceTitle(data.title), url });
  const breadcrumbId = `${url}#breadcrumb`;
  graph.push({
    '@type': 'BreadcrumbList', '@id': breadcrumbId,
    itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url })),
  });
  const webPage = {
    '@type': meta.type, '@id': `${url}#webpage`, url, name: meta.title,
    description: meta.description, isPartOf: ref(websiteId), breadcrumb: ref(breadcrumbId), inLanguage: 'en',
    ...(meta.updated ? { dateModified: meta.updated } : {}),
  };
  if (meta.type === 'AboutPage') webPage.about = ref(orgId);
  graph.push(webPage);
  if (person) {
    const entity = personEntity(person, site);
    webPage.mainEntity = ref(entity['@id']);
    graph.push(entity);
  }
  if (data.ogType === 'article') {
    let author = ref(orgId);
    if (data.author && data.author !== site.defaultAuthor) {
      const slug = slugify(data.author);
      const profile = data.authorProfiles?.find(item => item.slug === slug || item.name === data.author) || {};
      const entity = personEntity({ ...profile, name: data.author, slug }, site);
      graph.push(entity);
      author = ref(entity['@id']);
    }
    const newsId = `${url}#article`;
    webPage.mainEntity = ref(newsId);
    graph.push({
      '@type': 'NewsArticle', '@id': newsId, headline: sentenceTitle(data.title), description: meta.description,
      image: [absolute(image || data.hero, site)],
      datePublished: isoDate(page.date), dateModified: isoDate(data.updated || page.date),
      author, publisher: ref(orgId), mainEntityOfPage: ref(webPage['@id']),
      articleSection: data.category, keywords: data.tags || [], inLanguage: 'en', isAccessibleForFree: true,
      wordCount: articleWordCount(data.content),
      citation: (data.sources || []).map(source => ({
        '@type': 'CreativeWork', url: source.url, name: source.title,
        ...(source.publisher ? { publisher: { '@type': 'Organization', name: source.publisher } } : {}),
        ...(source.date ? { datePublished: source.date } : {}),
      })),
    });
  }
  if (page.url === '/what-is-singularity/') {
    webPage.hasPart = ref(`${url}#faq`);
    graph.push({
      '@type': 'FAQPage', '@id': `${url}#faq`, url: `${url}#frequently-asked-questions`,
      isPartOf: ref(webPage['@id']), inLanguage: 'en',
      mainEntity: data.singularityFaq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
