#!/usr/bin/env node
// Fails the build if square-bracket copy placeholders (e.g. "[Name]",
// "[Skincare brand]") appear in any prerendered HTML. (fix 3)
//
// Scans the prerendered HTML Next emits under .next/server/app.

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = ".next/server/app";
// A capitalised bracketed token: "[Name]", "[Title]", "[Skincare brand]".
const PLACEHOLDER = /\[[A-Z][a-z]+[^\]]*\]/g;

async function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const files = await walk(ROOT);
if (files.length === 0) {
  console.warn(`check-placeholders: no prerendered HTML found under ${ROOT} (skipping).`);
  process.exit(0);
}

const hits = [];
for (const f of files) {
  const html = await readFile(f, "utf8");
  const matches = html.match(PLACEHOLDER);
  if (matches) hits.push({ f, matches: [...new Set(matches)] });
}

if (hits.length) {
  console.error("\n✗ check-placeholders: bracket placeholders found in rendered HTML:\n");
  for (const h of hits) console.error(`  ${h.f}\n    ${h.matches.join(", ")}`);
  console.error("\nReplace them with real copy or hide the block before shipping.\n");
  process.exit(1);
}

console.log(`✓ check-placeholders: no bracket placeholders in ${files.length} prerendered pages.`);
