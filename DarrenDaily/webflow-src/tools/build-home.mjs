#!/usr/bin/env node
// Build the DarrenDaily HOME bundle from clean source files.
//
//   behavior.js  (DD_COVERS map + `__BODY__` marker + runtime)
//   body.html    (the page markup — where all copy lives)
//        │
//        ▼  build-home.mjs   (injects body into the marker)
//   dist/dd-home.js   (the single bundle the Webflow embed loads)
//
// Usage:  node webflow-src/tools/build-home.mjs
// Prints the built file's md5 + byte size (needed for the deploy step).

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const home = join(here, '..', 'home');

const behavior = readFileSync(join(home, 'behavior.js'), 'utf8');
const body = readFileSync(join(home, 'body.html'), 'utf8');

if (!behavior.includes('__BODY__')) {
  console.error('ERROR: behavior.js is missing the __BODY__ injection marker.');
  process.exit(1);
}

// The runtime sets #dd-app's innerHTML to the page markup, then runs.
// JSON.stringify produces a safe, correctly-escaped JS string literal.
const bundle = behavior.replace('__BODY__', JSON.stringify(body));

const outPath = join(home, 'dist', 'dd-home.js');
writeFileSync(outPath, bundle);

const md5 = createHash('md5').update(bundle).digest('hex');
console.log('built:', outPath);
console.log('bytes:', Buffer.byteLength(bundle));
console.log('md5  :', md5);
