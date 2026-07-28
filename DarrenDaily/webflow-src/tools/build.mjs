#!/usr/bin/env node
// Build a DarrenDaily page bundle from its clean source files.
//
//   <page>/behavior.js  (optional DD_COVERS map + `__BODY__` marker + runtime)
//   <page>/body.html    (the page markup — where all copy lives)
//        │
//        ▼  build.mjs <page>
//   <page>/dist/dd-<page>.js   (the single bundle the Webflow embed loads)
//
// Usage:  node webflow-src/tools/build.mjs <home|welcome|expired>
// Prints the built file's md5 + byte size (needed for the deploy step).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const page = process.argv[2];
if (!page) { console.error('usage: node build.mjs <home|welcome|expired>'); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', page);
if (!existsSync(join(dir, 'behavior.js'))) { console.error(`no source at webflow-src/${page}/`); process.exit(1); }

const behavior = readFileSync(join(dir, 'behavior.js'), 'utf8');
const body = readFileSync(join(dir, 'body.html'), 'utf8');
if (!behavior.includes('__BODY__')) { console.error('behavior.js is missing the __BODY__ marker'); process.exit(1); }

// The runtime sets #dd-app's innerHTML to the page markup, then runs.
// JSON.stringify yields a safe, correctly-escaped JS string literal.
const bundle = behavior.replace('__BODY__', JSON.stringify(body));

const outPath = join(dir, 'dist', `dd-${page}.js`);
writeFileSync(outPath, bundle);
console.log('built:', outPath);
console.log('bytes:', Buffer.byteLength(bundle));
console.log('md5  :', createHash('md5').update(bundle).digest('hex'));
