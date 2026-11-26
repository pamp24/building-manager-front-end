import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { parseTemplate, BindingPipe, LiteralPrimitive } from '@angular/compiler';

const languages = ['gr', 'en', 'fr', 'cn', 'de', 'es', 'he'];
const dictionaries = Object.fromEntries(
  languages.map((language) => [language, JSON.parse(fs.readFileSync('src/assets/i18n/' + language + '.json', 'utf8'))])
);
const keys = Object.keys(dictionaries.en).sort();
const parameters = (text) => [...new Set([...text.matchAll(/{{\s*(p\d+)\s*}}/g)].map((match) => match[1]))].sort();
for (const language of languages) {
  const dictionary = dictionaries[language];
  assert.deepEqual(Object.keys(dictionary).sort(), keys, language + ': dictionary coverage differs');
  for (const key of keys) {
    assert.ok(typeof dictionary[key] === 'string' && dictionary[key].trim(), language + '/' + key + ': empty translation');
    assert.deepEqual(parameters(dictionary[key]), parameters(dictionaries.en[key]), language + '/' + key + ': interpolation differs');
  }
  if (language !== 'gr') {
    for (const [key, text] of Object.entries(dictionary))
      assert.ok(!/[Α-Ωα-ω]/.test(text), language + '/' + key + ': untranslated Greek text');
  }
  assert.ok(!dictionary.UI, language + ': opaque translation identifiers remain');
  assert.ok(!dictionary.Romanian, language + ': removed language remains');
}
const references = new Set();
function template(text, file) {
  const parsed = parseTemplate(text, file);
  assert.ok(!parsed.errors?.length, file + ': invalid template');
  const seen = new WeakSet();
  function visit(node) {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (
      node instanceof BindingPipe &&
      node.name === 'translate' &&
      node.exp instanceof LiteralPrimitive &&
      typeof node.exp.value === 'string'
    ) {
      references.add(node.exp.value);
    }
    for (const [name, value] of Object.entries(node)) {
      if (['sourceSpan', 'nameSpan', 'keySpan', 'valueSpan', 'handlerSpan', 'file', 'parent'].includes(name)) continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object') visit(value);
    }
  }
  parsed.nodes.forEach(visit);
}
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (/\.(ts|html)$/.test(file) && !file.endsWith('.spec.ts')) {
      const text = fs.readFileSync(file, 'utf8');
      assert.ok(!/UI\.t[0-9a-f]{14}/.test(text), file + ': opaque identifier remains');
      if (file.endsWith('.html')) template(text, file);
      else {
        const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
        function visit(node) {
          if (
            ts.isPropertyAssignment(node) &&
            node.name.getText(ast) === 'template' &&
            ts.isNoSubstitutionTemplateLiteral(node.initializer)
          ) {
            template(node.initializer.text, file);
          }
          if (
            ts.isCallExpression(node) &&
            /(?:uiLocale\.text|translate\.instant)$/.test(node.expression.getText(ast)) &&
            ts.isStringLiteral(node.arguments[0])
          ) {
            references.add(node.arguments[0].text);
          }
          ts.forEachChild(node, visit);
        }
        visit(ast);
      }
    }
  }
}
scan('src/app');
for (const key of references) assert.ok(Object.hasOwn(dictionaries.en, key), 'Undefined translation: ' + key);
assert.ok(!fs.existsSync('src/assets/i18n/source.json'), 'source.json must not be required');
assert.ok(!fs.existsSync('src/assets/i18n/ro.json'), 'Romanian dictionary remains');
console.log(
  'PASS: ' +
    languages.length +
    ' flat dictionaries, ' +
    keys.length +
    ' readable keys and ' +
    references.size +
    ' referenced English texts; interpolation complete.'
);
