import { parseDocument } from 'htmlparser2';

// Rendered article-body HTML only. Nested paragraphs never count as top level.
export function insertArticleAds(content, adsense, articleA, articleB) {
  if (!adsense?.client && !adsense?.preview) return content;
  const dom = parseDocument(content, { withEndIndices: true });
  const paragraphs = dom.children.filter(node => node.type === 'tag' && node.name === 'p');
  const insertions = [[3, articleA], [7, articleB]].filter(([count]) => paragraphs.length > count)
    .map(([count, slot]) => ({ at: paragraphs[count - 1].endIndex + 1, slot }));
  for (const { at, slot } of insertions.reverse()) content = content.slice(0, at) + '\n' + slot + content.slice(at);
  return content;
}
