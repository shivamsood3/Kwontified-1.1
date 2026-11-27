#!/usr/bin/env node
// The translator's tool. Run `npm run build:site` first: it reads the built English pages.
//
//   node scripts/i18n.mjs extract es /perspectives/some-article /about ...
//       Writes site-i18n/es/pages/<page>.json (and adds anything new to site-i18n/es/_site.json,
//       the header, footer and other text every page shares). Each entry has the English
//       ("src") and an empty translation ("t"), already filled in where the same English has
//       been translated before.
//   node scripts/i18n.mjs extract es --newest 25        the 25 newest Perspectives items not yet started
//   node scripts/i18n.mjs status es                     what is translated, what is missing, what changed in English
//   node scripts/i18n.mjs check es                      placeholders, figures and protected names in every translation
//
// Fill in the "t" values (by hand, with a translation service, or by asking Claude in a
// session: "translate the empty entries in site-i18n/es into Spanish"), run `check`, then
// build. A page appears at /es/... once its file exists; untranslated entries stay in English.
import fs from "node:fs";
import path from "node:path";
import { read, segments, problems, memory, pageStore, englishPages, config, siteRoutes, leaveFor, runtimeStrings, key, DIR, STORE } from "./i18n-lib.mjs";

const [cmd, lang, ...rest] = process.argv.slice(2);
const cfg = config();
const die = (m) => { console.error(m); process.exit(1); };
if (!cmd || !lang) die("usage: node scripts/i18n.mjs <extract|status|check> <language code> [routes | --newest N]");
if (!cfg.languages.some((l) => l.code === lang)) die(`"${lang}" is not in site-i18n/config.json; add it there first`);
if (!fs.existsSync(DIR) || englishPages().length < 1000) die("build the site first: npm run build:site");

const routes = siteRoutes();
const fileOfRoute = new Map(routes.map((r) => [r.route, path.basename(r.file)]));
const routeOfFile = new Map(routes.map((r) => [path.basename(r.file), r.route]));
const mem = memory(lang);
const started = () => new Set(fs.existsSync(path.join(STORE, lang, "pages")) ? fs.readdirSync(path.join(STORE, lang, "pages")).map((f) => routeOfFile.get(f.replace(/\.json$/, ".html"))) : []);

function pageSegments(file, available) {
  const tree = read(fs.readFileSync(path.join(DIR, file), "utf8"));
  return segments(tree, { keep: cfg.keep, leave: leaveFor(available) });
}
const uniq = (segs) => { const seen = new Set(); return segs.filter((s) => !seen.has(s.k) && seen.add(s.k)); };
const save = (file, json) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(json, null, 1) + "\n"); };

if (cmd === "extract") {
  let want = rest.filter((r) => r.startsWith("/"));
  const i = rest.indexOf("--newest");
  if (i >= 0) {
    const n = +rest[i + 1] || 10, done = started();
    const lastmod = JSON.parse(fs.readFileSync(path.join(process.cwd(), "site-lastmod.json"), "utf8"));
    want = want.concat(Object.entries(lastmod).filter(([r]) => /^\/perspectives\/./.test(r) && !done.has(r)).sort((a, b) => (a[1] < b[1] ? 1 : -1)).slice(0, n).map(([r]) => r));
  }
  if (!want.length) die("name the pages to start, for example /perspectives/some-article, or use --newest 10");
  for (const r of want) if (!fileOfRoute.has(r)) die(`${r} is not a page on the site`);
  const available = new Set([...started(), ...want]);
  const site = fs.existsSync(path.join(mem.dir, "_site.json")) ? JSON.parse(fs.readFileSync(path.join(mem.dir, "_site.json"), "utf8")) : { lang, about: "Text every page shares: header, menus, footer, search, cookie notice.", segments: [] };
  const siteKeys = new Set(site.segments.map((s) => s.k));
  let words = 0;
  for (const r of want) {
    const file = fileOfRoute.get(r), segs = pageSegments(file, available), store = pageStore(lang, file);
    const old = fs.existsSync(store) ? new Map(JSON.parse(fs.readFileSync(store, "utf8")).segments.map((s) => [s.k, s.t])) : new Map();
    for (const s of uniq(segs.filter((x) => x.zone === "site"))) if (!siteKeys.has(s.k)) { siteKeys.add(s.k); site.segments.push({ k: s.k, src: s.src, t: mem.map.get(s.k) || "" }); }
    const own = uniq(segs.filter((x) => x.zone !== "site")).map((s) => ({ k: s.k, src: s.src, t: old.get(s.k) || mem.map.get(s.k) || "" }));
    save(store, { lang, route: r, segments: own });
    const todo = own.filter((s) => !s.t);
    words += todo.reduce((n, s) => n + s.src.replace(/<[^>]+>/g, "").split(/\s+/).length, 0);
    console.log(`${r}: ${own.length} entries, ${todo.length} to translate -> ${path.relative(process.cwd(), store)}`);
  }
  // words the site's scripts show (button states, form messages)
  for (const str of runtimeStrings()) { const k = key(str); if (!siteKeys.has(k)) { siteKeys.add(k); site.segments.push({ k, src: str, t: mem.map.get(k) || "" }); } }
  save(path.join(mem.dir, "_site.json"), site);
  console.log(`shared text: ${site.segments.length} entries, ${site.segments.filter((s) => !s.t).length} to translate -> site-i18n/${lang}/_site.json`);
  console.log(`about ${words} words to translate on these pages`);
} else if (cmd === "status" || cmd === "check") {
  const available = started();
  let bad = 0, total = 0, done = 0;
  for (const f of mem.files) {
    const j = f.json, name = path.relative(process.cwd(), f.file);
    const now = j.route ? new Set(pageSegments(fileOfRoute.get(j.route), available).filter((s) => s.zone !== "site").map((s) => s.k)) : null;
    const missing = j.segments.filter((s) => !s.t).length, stale = now ? j.segments.filter((s) => !now.has(s.k)).length : 0;
    const fresh = now ? [...now].filter((k) => !j.segments.some((s) => s.k === k) && !mem.map.has(k)).length : 0;
    total += j.segments.length; done += j.segments.length - missing;
    if (cmd === "status") console.log(`${(j.route || "(shared text)").padEnd(62)} ${String(j.segments.length - missing).padStart(4)}/${String(j.segments.length).padEnd(4)}${stale ? `  ${stale} no longer on the page` : ""}${fresh ? `  ${fresh} new in English (run extract again)` : ""}`);
    for (const s of j.segments) if (s.t) for (const p of problems(s.src, s.t, cfg.keep)) { bad++; if (cmd === "check" || bad < 6) console.log(`  ${name} [${s.k}] ${p}\n     EN: ${s.src.slice(0, 140)}\n     ${lang.toUpperCase()}: ${s.t.slice(0, 140)}`); }
  }
  console.log(`${lang}: ${done} of ${total} entries translated in ${mem.files.length} files; ${bad} problem${bad === 1 ? "" : "s"}`);
  if (cmd === "check" && bad) process.exit(1);
} else die(`unknown command "${cmd}"`);
