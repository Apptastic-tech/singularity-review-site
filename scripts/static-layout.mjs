// A deliberately limited CSS oracle for reserved layout, never a browser substitute.
import assert from 'node:assert/strict';

export function cssRules(css, media = '') {
  const rules = [];
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let start = 0;
  while (start < css.length) {
    const open = css.indexOf('{', start);
    if (open < 0) break;
    let depth = 1, end = open + 1;
    while (end < css.length && depth) { if (css[end] === '{') depth++; if (css[end] === '}') depth--; end++; }
    assert.equal(depth, 0, 'CSS blocks balance');
    const selector = css.slice(start, open).trim(), body = css.slice(open + 1, end - 1);
    if (selector.startsWith('@media')) rules.push(...cssRules(body, selector.slice(6).trim()));
    else if (!selector.startsWith('@')) {
      const declarations = Object.fromEntries(body.split(';').filter(x => x.includes(':')).map(x => {
        const at = x.indexOf(':'); return [x.slice(0, at).trim(), x.slice(at + 1).trim()];
      }));
      for (const part of selector.split(',')) rules.push({ selector: part.trim(), declarations, media });
    }
    start = end;
  }
  return rules;
}
export function styleAt(rules, selector, width, height) {
  const result = {};
  for (const rule of rules) {
    if (rule.selector !== selector || /prefers-reduced-motion|hover:/.test(rule.media)) continue;
    const matches = [...rule.media.matchAll(/(min|max)-(width|height):\s*(\d+)px/g)];
    if (matches.some(([, bound, axis, value]) => bound === 'min' ? (axis === 'width' ? width : height) < +value : (axis === 'width' ? width : height) > +value)) continue;
    Object.assign(result, rule.declarations);
  }
  return result;
}
export function length(value, width, height, percent = width, variables = {}) {
  assert.ok(value != null, 'Required CSS length exists');
  value = value.replace(/var\((--[\w-]+)\)/g, (_, name) => `(${length(variables[name], width, height, percent, variables)})`);
  const tokens = value.match(/clamp|min|max|calc|[\d.]+(?:px|vw|vh|svh|dvh|%)?|[()+*/,-]/g) || [];
  let index = 0;
  function atom() {
    const token = tokens[index++];
    if (['clamp', 'min', 'max', 'calc'].includes(token)) {
      assert.equal(tokens[index++], '(');
      const args = [expression()];
      while (tokens[index] === ',') { index++; args.push(expression()); }
      assert.equal(tokens[index++], ')');
      return token === 'clamp' ? Math.max(args[0], Math.min(args[2], args[1])) : token === 'min' ? Math.min(...args) : token === 'max' ? Math.max(...args) : args[0];
    }
    if (token === '(') { const result = expression(); assert.equal(tokens[index++], ')'); return result; }
    if (token === '-') return -atom();
    assert.match(token || '', /^[\d.]+(?:px|vw|vh|svh|dvh|%)?$/);
    const number = parseFloat(token);
    return number * (token.endsWith('vw') ? width / 100 : /(?:s|d)?vh$/.test(token) ? height / 100 : token.endsWith('%') ? percent / 100 : 1);
  }
  function product() { let result = atom(); while (['*', '/'].includes(tokens[index])) { const op = tokens[index++], next = atom(); result = op === '*' ? result * next : result / next; } return result; }
  function expression() { let result = product(); while (['+', '-'].includes(tokens[index])) { const op = tokens[index++], next = product(); result = op === '+' ? result + next : result - next; } return result; }
  const result = expression(); assert.equal(index, tokens.length, `All CSS length tokens consumed: ${value}`); assert.ok(Number.isFinite(result)); return result;
}
export function fontAt(style, width, height) {
  const [, size, leading] = style.font?.match(/(clamp\([^)]*\)|[\d.]+px)\/([\d.]+)/) || [];
  assert.ok(size && leading, 'Explicit font size and line height');
  const fontSize = length(style['font-size'] || size, width, height);
  return { fontSize, lineHeight: fontSize * +leading, italic: style.font.includes('italic'), weight: +(style.font.match(/\b[1-9]00\b/)?.[0] || 400) };
}
export function coverLayout(css, width, height) {
  const rules = cssRules(css), get = selector => styleAt(rules, selector, width, height);
  const cover = get('.night-cover'), variables = { ...get(':root'), ...cover };
  const bandHeight = length(cover.height, width, height);
  const diskWidth = length(variables['--disk-width'], width, height, width, variables);
  const disk = { left: length(variables['--disk-left'], width, height, width, variables), top: length(variables['--disk-top'], width, height), width: diskWidth, height: diskWidth * 9 / 16 };
  const hero = get('.hero-statement'), inset = length(hero['inset-inline'], width, height);
  const statementWidth = Math.min(width - inset * 2, length(hero['max-width'], width, height));
  const statement = { left: (width - statementWidth) / 2, top: length(hero.top, width, height), width: statementWidth };
  const body = get('.card--lead .card-body'), paddingTop = length(body.padding.split(' ')[0], width, height);
  const category = get('.category-link');
  const mastheadHeight = length(get('.header-inner').height, width, height);
  const leadY = mastheadHeight + bandHeight + paddingTop + length(category['min-height'], width, height);
  return { rules, get, bandHeight, disk, statement, mastheadHeight, leadY };
}
