// Shared styles and scripts out of the pages into cached files, and the script hashes for the
// Content-Security-Policy. The VERY LAST step of the site build (after site-llms.mjs): it only
// moves code, so no later step can put code back inline or miss a hash.
//
// Every earlier step writes its CSS and JavaScript into the pages inline, which keeps each step
// self-contained and lets the next one find and check what the last one wrote. Served that way,
// each page carried about 80 KB of CSS and JavaScript that every other page also carried, and a
// browser cached none of it between pages (QA F038). This step:
//
//   1. CSS. The <style> blocks in each page's <head> become <link rel="stylesheet"> to
//      content-hashed files, /assets/kq-css-<hash>.css (immutable cache, next.config.ts).
//      Neighbouring blocks that are nearly always on the same pages (JOIN below) share one file,
//      so an article loads two files instead of nine (other pages three to eight, most of them
//      shared), and pages that share code share files.
//      Order is kept: a file replaces the first block of its group, at the same place, and blocks
//      are only grouped across markup that carries no styles or scripts (meta, link, JSON). A
//      group under MIN_CSS bytes stays inline. <style> blocks in <body> (a few small ones on the
//      Work and Perspectives pages) stay where they are.
//   2. JavaScript. Every inline classic script that is on more than one page, or is MIN_JS
//      bytes or more, becomes <script src="/assets/kq-js-<hash>.js"> at the same place, without
//      defer or async, so it runs at the same moment and in the same order as before
//      (document.currentScript still points at it). JSON, JSON-LD and speculation rules stay.
//   3. site-csp.json (git-ignored, read by next.config.ts): the sha256 of every script still
//      inline on any page (small single-page scripts and the speculation rules), for the
//      script-src of the Content-Security-Policy. See "Security headers" in HANDOVER.md.
//
// Checks (the build stops): a page with an inline event handler (onclick=...) or a
// javascript: link, which a policy without 'unsafe-inline' would block; a page whose inline
// CSS and JS still add up to MAX_INLINE or more; a page whose text or markup changed in any way
// other than the moved blocks (each page is rebuilt from its files and compared).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
// smaller code stays inline: a request costs more than it saves
const MIN_CSS = 1024;
const MIN_JS = 1024;
const JOIN = 0.9; // two neighbouring <style> blocks share a file when the pages they are on overlap this much (Jaccard)
const MAX_INLINE = 10 * 1024;
const fail = (m) => { console.error(`site-bundle: ${m}`); process.exit(1); };

const sha = (s, enc = "hex") => crypto.createHash("sha256").update(s).digest(enc);
const name = (kind, body) => `kq-${kind}-${sha(body).slice(0, 12)}.${kind}`;

// markup a <style> group may span: whitespace, comments, meta, title, non-stylesheet links, JSON
const INERT = /^(?:\s|<!--[\s\S]*?-->|<meta\b[^>]*>|<title>[\s\S]*?<\/title>|<link\b(?![^>]*\brel="?stylesheet)[^>]*>|<script\b[^>]*\btype="application\/(?:ld\+)?json"[^>]*>[\s\S]*?<\/script>)*$/i;
const BLOCK = /<(style|script)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const typeOf = (attrs) => ((attrs.match(/\btype\s*=\s*"([^"]*)"/i) || [])[1] || "").toLowerCase();
const inlineScript = (attrs) => !/\bsrc\s*=/i.test(attrs);
// a classic script runs where it stands, so it can move into a file at the same place
const classic = (attrs) => inlineScript(attrs) && ["", "text/javascript", "application/javascript"].includes(typeOf(attrs));
// what script-src governs: classic and module scripts and speculation rules (not JSON data)
const executable = (attrs) => inlineScript(attrs) && ["", "text/javascript", "application/javascript", "module", "speculationrules"].includes(typeOf(attrs));

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort();
if (files.length < 1000) fail(`expected the whole site in public/_kq, found ${files.length} pages`);
// the step moves code once: run on pages it already changed, it would leave them pointing at deleted files
for (const f of files) if (/\/assets\/kq-(?:css|js)-[0-9a-f]{12}\./.test(fs.readFileSync(path.join(DIR, f), "utf8"))) fail(`${f} was already bundled; run the whole build (node scripts/build-all.mjs)`);
for (const f of fs.readdirSync(ASSETS)) if (/^kq-(css|js)-[0-9a-f]{12}\.(css|js)$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));

// ---------------------------------------------------------------- read every page once
const pages = [];
const cssPages = new Map(); // style body -> pages it is in the head of
const jsPages = new Map(); //  script body -> pages
const handlers = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(DIR, f), "utf8");
  const headEnd = html.indexOf("</head>");
  if (headEnd < 0) fail(`${f}: no </head>`);
  const outside = html.replace(BLOCK, "");
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(outside)) handlers.push(`${f}: inline event handler`);
  if (/\b(?:href|src|action)\s*=\s*["']?\s*javascript:/i.test(outside)) handlers.push(`${f}: javascript: link`);
  const blocks = [];
  for (const m of html.matchAll(BLOCK)) {
    const [all, tag, attrs, body] = m;
    const b = { tag: tag.toLowerCase(), attrs, body, start: m.index, end: m.index + all.length, inHead: m.index < headEnd };
    if (b.tag === "style" && b.inHead) {
      if (/\bmedia\s*=/i.test(attrs)) fail(`${f}: a <style media> block; teach this step to keep its media query`);
      (cssPages.get(body) || cssPages.set(body, new Set()).get(body)).add(f);
    }
    if (b.tag === "script" && classic(attrs)) (jsPages.get(body) || jsPages.set(body, new Set()).get(body)).add(f);
    blocks.push(b);
  }
  pages.push({ f, html, blocks });
}
if (handlers.length) fail(`a Content-Security-Policy without 'unsafe-inline' would block these; move them into a script:\n  ${handlers.slice(0, 10).join("\n  ")}`);

const jaccard = (a, b) => {
  const A = cssPages.get(a), B = cssPages.get(b);
  let n = 0;
  for (const x of A) if (B.has(x)) n++;
  return n / (A.size + B.size - n);
};

// a page without its code, and its code in document order (files read back in place)
const FILE = /<link rel="stylesheet" href="\/assets\/(kq-css-[0-9a-f]{12}\.css)">|<script src="\/assets\/(kq-js-[0-9a-f]{12}\.js)"><\/script>/g;
const isCode = (tag, attrs) => tag.toLowerCase() === "style" || classic(attrs);
const markup = (h) => h.replace(BLOCK, (all, tag, attrs) => (isCode(tag, attrs) ? "" : all)).replace(FILE, "");
const code = (h) => {
  const out = [];
  const read = h.replace(FILE, (_, css, js) => (css ? `<style>${written.get(css)}</style>` : `<script>${written.get(js)}</script>`));
  for (const m of read.matchAll(BLOCK)) if (isCode(m[1], m[2])) out.push(m[3]);
  return out.join("\n");
};

// ---------------------------------------------------------------- rewrite
const written = new Map(); // file name -> body
const write = (kind, body) => {
  const n = name(kind, body);
  if (!written.has(n)) { written.set(n, body); fs.writeFileSync(path.join(ASSETS, n), body); }
  return `/assets/${n}`;
};
const inlineHashes = new Map(); // 'sha256-...' -> { pages, sample }
const stats = { css: 0, js: 0, keptCss: 0, keptJs: 0, before: 0, after: 0, maxInline: [0, ""] };
const inlineSize = (h) => {
  let n = 0;
  for (const m of h.matchAll(BLOCK)) if (isCode(m[1], m[2])) n += m[3].length;
  return n;
};

for (const p of pages) {
  const { html, blocks } = p;
  // groups of head <style> blocks: neighbours across inert markup, overlapping page sets
  const groups = [];
  let prev = null;
  for (const b of blocks) {
    if (b.tag !== "style" || !b.inHead) { prev = null; continue; }
    const g = groups[groups.length - 1];
    if (prev && INERT.test(html.slice(prev.end, b.start)) && jaccard(prev.body, b.body) >= JOIN) g.push(b);
    else groups.push([b]);
    prev = b;
  }
  const edits = []; // [start, end, replacement]
  for (const g of groups) {
    const body = g.map((b) => b.body).join("\n");
    if (body.length < MIN_CSS) { stats.keptCss += g.length; continue; }
    edits.push([g[0].start, g[0].end, `<link rel="stylesheet" href="${write("css", body)}">`]);
    for (const b of g.slice(1)) edits.push([b.start, b.end, ""]);
    stats.css += g.length;
  }
  for (const b of blocks) {
    if (b.tag !== "script") continue;
    if (classic(b.attrs) && (jsPages.get(b.body).size > 1 || b.body.length >= MIN_JS)) {
      edits.push([b.start, b.end, `<script src="${write("js", b.body)}"></script>`]);
      stats.js++;
    } else if (executable(b.attrs)) {
      const h = `sha256-${sha(b.body, "base64")}`;
      const e = inlineHashes.get(h) || inlineHashes.set(h, { pages: 0, sample: `${p.f}: ${b.body.trim().slice(0, 60)}` }).get(h);
      e.pages++;
      if (classic(b.attrs)) stats.keptJs++;
    }
  }
  edits.sort((a, b) => b[0] - a[0]);
  let out = html;
  for (const [s, e, r] of edits) out = out.slice(0, s) + r + out.slice(e);

  // the page must be the same page: the same markup once code is taken out, and the same code
  // in the same order once each file is read back in place of its <link> or <script src>
  if (markup(out) !== markup(html)) fail(`${p.f}: the page's markup changed while moving its code`);
  if (code(out) !== code(html)) { const a = code(out), b = code(html); let i = 0; while (a[i] === b[i]) i++; fail(`${p.f}: the page's code changed or moved out of order at ${i}: …${JSON.stringify(b.slice(i - 80, i + 80))} vs …${JSON.stringify(a.slice(i - 80, i + 80))}`); }

  const inline = inlineSize(out);
  if (inline > stats.maxInline[0]) stats.maxInline = [inline, p.f];
  if (inline >= MAX_INLINE) fail(`${p.f}: ${(inline / 1024).toFixed(1)} KB of CSS and JS is still inline (limit ${MAX_INLINE / 1024} KB); lower MIN_CSS or MIN_JS, or move the page's code into a file`);
  stats.before += html.length;
  stats.after += out.length;
  fs.writeFileSync(path.join(DIR, p.f), out);
}

// ---------------------------------------------------------------- site-csp.json
const hashes = [...inlineHashes.keys()].sort();
fs.writeFileSync(
  path.join(ROOT, "site-csp.json"),
  JSON.stringify({
    _note: "Written by scripts/site-bundle.mjs: sha256 of every script left inline on any page (script-src). Do not edit.",
    scriptHashes: hashes,
    inline: hashes.map((h) => ({ hash: h, pages: inlineHashes.get(h).pages, sample: inlineHashes.get(h).sample })),
  }, null, 2) + "\n",
);

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const cssFiles = [...written.keys()].filter((n) => n.endsWith(".css")).length;
console.log(
  `site-bundle: ${stats.css} style blocks into ${cssFiles} CSS files and ${stats.js} scripts into ${written.size - cssFiles} JS files (${kb([...written.values()].reduce((n, b) => n + b.length, 0))}), ` +
  `${stats.keptCss} small style blocks and ${stats.keptJs} small scripts left inline; pages ${kb(stats.before / pages.length)} -> ${kb(stats.after / pages.length)} on average; ` +
  `most inline CSS+JS left on a page: ${kb(stats.maxInline[0])} (${stats.maxInline[1]}); site-csp.json: ${hashes.length} script hashes`,
);
