// Normalize display headings while editors own article frontmatter.
// Preserve publication vocabulary and proper nouns, including possessives.
export const properWords = new Set(['Claude', 'OpenAI', 'Wikimedia', 'Wikipedia', 'Europe', 'Washington', 'Mistral', 'Anthropic', 'Singularity', 'Review']);
export function sentenceTitle(value) {
  const title = String(value || '');
  return (title.charAt(0).toUpperCase() + title.slice(1)).replace(/\b[A-Z][a-z]+\b/g, (word, offset) => offset === 0 || properWords.has(word) ? word : word.toLowerCase());
}
