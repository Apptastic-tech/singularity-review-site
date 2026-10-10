import assert from 'node:assert/strict';
import { parseDocument } from 'htmlparser2';

// Strict well-formedness checks before parsing in XML mode. No external entities,
// DTDs, network, subprocesses or additional dependencies are used.
export function parseXml(source, label = 'XML') {
  const xml = source.replace(/^\uFEFF/, '');
  const tokens = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[[\s\S]*?\]\]>|<\/[A-Za-z_][\w:.-]*\s*>|<[A-Za-z_][\w:.-]*(?:\s+[A-Za-z_][\w:.-]*\s*=\s*(?:"[^"<]*"|'[^'<]*'))*\s*\/?>|[^<]+/gy;
  const stack = [], scopes = [{ xml: 'http://www.w3.org/XML/1998/namespace' }];
  let cursor = 0, roots = 0;
  const entities = text => {
    assert.doesNotMatch(text, /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)/, `${label}: invalid or undeclared entity`);
    for (const [, decimal, hex] of text.matchAll(/&#(?:(\d+)|x([\da-fA-F]+));/g)) {
      const value = decimal ? Number(decimal) : parseInt(hex, 16);
      assert.ok([9, 10, 13].includes(value) || value >= 0x20 && value <= 0xD7FF || value >= 0xE000 && value <= 0xFFFD || value >= 0x10000 && value <= 0x10FFFF, `${label}: invalid XML character entity`);
    }
  };
  assert.doesNotMatch(xml, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/, `${label}: invalid XML character`);
  while (cursor < xml.length) {
    tokens.lastIndex = cursor;
    const match = tokens.exec(xml);
    assert.ok(match, `${label}: malformed XML at offset ${cursor}`);
    const token = match[0];
    cursor = tokens.lastIndex;
    if (token.startsWith('<?')) {
      assert.ok(token.startsWith('<?xml ') && match.index === 0, `${label}: unexpected processing instruction`);
      assert.match(token, /^<\?xml version="1\.0" encoding="utf-8"\?>$/i);
    } else if (token.startsWith('<!--')) assert.ok(!token.slice(4, -3).includes('--'), `${label}: invalid XML comment`);
    else if (token.startsWith('<![CDATA[')) assert.ok(stack.length, `${label}: CDATA outside root`);
    else if (token.startsWith('</')) {
      const name = token.match(/^<\/([^\s>]+)/)[1];
      assert.equal(stack.pop(), name, `${label}: mismatched closing tag`);
      scopes.pop();
    } else if (token.startsWith('<')) {
      const name = token.match(/^<([^\s/>]+)/)[1];
      if (!stack.length) roots++;
      const attributes = [...token.matchAll(/\s+([A-Za-z_][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)];
      const names = attributes.map(item => item[1]);
      assert.equal(new Set(names).size, names.length, `${label}: duplicate attribute`);
      const scope = { ...scopes.at(-1) };
      for (const [, key, double, single] of attributes) {
        const value = double ?? single;
        entities(value);
        if (key.startsWith('xmlns:')) scope[key.slice(6)] = value;
      }
      for (const key of [name, ...names.filter(key => !key.startsWith('xmlns:'))]) if (key.includes(':')) assert.ok(scope[key.split(':')[0]], `${label}: unbound namespace prefix`);
      if (!token.endsWith('/>')) { stack.push(name); scopes.push(scope); }
    } else {
      entities(token);
      assert.doesNotMatch(token, /\]\]>/, `${label}: CDATA terminator outside CDATA`);
      if (!stack.length) assert.equal(token.trim(), '', `${label}: text outside root`);
    }
  }
  assert.equal(stack.length, 0, `${label}: unclosed XML element`);
  assert.equal(roots, 1, `${label}: exactly one XML root`);
  return parseDocument(xml, { xmlMode: true, decodeEntities: true });
}
