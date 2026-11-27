// Builds the static site: runs every step in scripts/ once, in order, and stops at the first
// failure. `npm run build:site`, `npm run build` and `npm run dev` all call this file, so the
// order lives here and nowhere else.
//
// To add a step, add one line to STEPS at the place it must run (a file in scripts/, optionally
// followed by its arguments). Each line runs as `node scripts/<line>` from the repository root.
//
// Usage: node scripts/build-all.mjs           run all steps
//        node scripts/build-all.mjs --list    print the steps
import { spawnSync } from "node:child_process";
import path from "node:path";

const STEPS = [
  "build-site.mjs", //            pages from site-src into public/_kq, assets into public/assets
  "site-fixes.mjs",
  "site-content.mjs",
  "site-archive.mjs",
  "site-errors.mjs",
  "site-contact.mjs",
  "site-about.mjs",
  "site-capchan.mjs",
  "site-channel-content.mjs",
  "site-filters.mjs",
  "site-home.mjs",
  "site-charts.mjs",
  "site-seo.mjs",
  "site-images.mjs", //           WebP sizes, srcset, sizes, width and height (needs sharp)
  "site-tags.mjs",
  "site-logos.mjs",
  "site-perspectives-ux.mjs",
  "site-perspectives.mjs",
  "site-nav.mjs",
  "site-effects.mjs",
  "site-i18n.mjs",
  "site-capchan.mjs --check", //  final checks on the finished pages
  "site-llms.mjs", //            llms.txt and feed.xml from the finished pages; structured-data and description gates
  "site-bundle.mjs", //          LAST: shared CSS and JS into cached files, script hashes for the CSP (site-csp.json)
];

if (process.argv.includes("--list")) {
  STEPS.forEach((s, i) => console.log(`${String(i + 1).padStart(2)}. ${s}`));
  process.exit(0);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const times = [];
const t0 = Date.now();
for (const [i, step] of STEPS.entries()) {
  const [file, ...args] = step.split(/\s+/);
  const label = `[${i + 1}/${STEPS.length}] ${step}`;
  console.log(`\n${label}`);
  const t = Date.now();
  const r = spawnSync(process.execPath, [path.join("scripts", file), ...args], { cwd: ROOT, stdio: "inherit" });
  const s = (Date.now() - t) / 1000;
  times.push([step, s]);
  if (r.status !== 0) {
    console.error(`\nbuild-all: ${label} failed (${r.error ? r.error.message : r.signal ? `signal ${r.signal}` : `exit ${r.status}`}) after ${s.toFixed(1)} s; later steps not run.`);
    process.exit(r.status || 1);
  }
}
console.log(`\nbuild-all: ${STEPS.length} steps in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
for (const [step, s] of times) console.log(`  ${s.toFixed(1).padStart(6)} s  ${step}`);
