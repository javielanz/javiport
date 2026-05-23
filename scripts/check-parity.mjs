#!/usr/bin/env node
// Parity check for src/content/* collections and UI strings.
// Fails CI when an EN file lacks an ES counterpart (or vice versa),
// when filenames don't follow slug.lang.md, or when UI strings JSON
// shapes diverge between EN and ES.

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const CONTENT_ROOT = join(root, 'src', 'content');
const COLLECTIONS = ['work', 'experience', 'education'];
const LANGS = ['en', 'es'];

const errors = [];
const warnings = [];

async function checkCollection(name) {
  const dir = join(CONTENT_ROOT, name);
  if (!existsSync(dir)) {
    errors.push(`Collection directory missing: src/content/${name}`);
    return;
  }
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const slugs = new Set();
  for (const file of files) {
    const match = file.match(/^(.+)\.(en|es)\.md$/);
    if (!match) {
      errors.push(`Invalid filename (expected slug.lang.md): ${name}/${file}`);
      continue;
    }
    slugs.add(match[1]);
  }
  for (const slug of slugs) {
    for (const lang of LANGS) {
      const expected = `${slug}.${lang}.md`;
      if (!files.includes(expected)) {
        errors.push(`Missing translation: ${name}/${expected}`);
      }
    }
  }
  if (slugs.size === 0) {
    warnings.push(`Collection ${name} is empty.`);
  }
}

function diffKeys(a, b, prefix) {
  const out = [];
  const tA = typeof a;
  const tB = typeof b;
  if (tA !== tB) {
    out.push(`${prefix || '<root>'} (type differs: ${tA} vs ${tB})`);
    return out;
  }
  if (a === null || b === null || tA !== 'object') return out;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      out.push(`${prefix} (array vs object)`);
    } else if (a.length !== b.length) {
      out.push(`${prefix} (array length differs: ${a.length} vs ${b.length})`);
    } else {
      for (let i = 0; i < a.length; i++) {
        out.push(...diffKeys(a[i], b[i], `${prefix}[${i}]`));
      }
    }
    return out;
  }
  const aKeys = new Set(Object.keys(a));
  const bKeys = new Set(Object.keys(b));
  for (const k of aKeys) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (!bKeys.has(k)) {
      out.push(`${path} (in EN only)`);
    } else {
      out.push(...diffKeys(a[k], b[k], path));
    }
  }
  for (const k of bKeys) {
    if (!aKeys.has(k)) {
      const path = prefix ? `${prefix}.${k}` : k;
      out.push(`${path} (in ES only)`);
    }
  }
  return out;
}

async function checkUiStrings() {
  const uiDir = join(CONTENT_ROOT, 'ui');
  const data = {};
  for (const lang of LANGS) {
    const path = join(uiDir, `strings.${lang}.json`);
    if (!existsSync(path)) {
      errors.push(`Missing UI strings file: src/content/ui/strings.${lang}.json`);
      continue;
    }
    try {
      data[lang] = JSON.parse(await readFile(path, 'utf8'));
    } catch (e) {
      errors.push(`Invalid JSON in src/content/ui/strings.${lang}.json: ${e.message}`);
    }
  }
  if (data.en && data.es) {
    const diff = diffKeys(data.en, data.es, '');
    for (const path of diff) {
      errors.push(`UI strings key mismatch: ${path}`);
    }
  }
}

(async () => {
  for (const c of COLLECTIONS) await checkCollection(c);
  await checkUiStrings();
  if (errors.length) {
    console.error('check:parity FAILED:');
    for (const e of errors) console.error('  ✗', e);
    if (warnings.length) {
      console.warn('warnings:');
      for (const w of warnings) console.warn('  !', w);
    }
    process.exit(1);
  }
  if (warnings.length) {
    console.warn('check:parity warnings:');
    for (const w of warnings) console.warn('  !', w);
  }
  console.info('check:parity OK — all collections have EN+ES parity, UI strings shape matches.');
  process.exit(0);
})();
