// Shared by scripts/site-i18n.mjs (the build step) and scripts/i18n.mjs (the translator's tool).
//
// A page is cut into SEGMENTS: the smallest block of text a translator can treat as one
// thought (a heading, a paragraph, a list item, a button, a label), plus the attributes a
// visitor reads or hears (alt, title, aria-label, placeholder, the meta descriptions).
// Inline markup inside a segment (links, bold, line breaks, icons) is replaced with numbered
// placeholders such as <1>…</1> and <2/>, so a translator moves them with the words and
// never sees or edits the site's markup:
//
//     Read <1>the case study</1> or <2>request a review</2>.
//
// Each segment is stored under a key made from its English text. The same English text gets
// the same key on every page, so a menu label or an article title is translated once.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const ROOT = process.cwd();
export const DIR = path.join(ROOT, "public/_kq");
export const STORE = path.join(ROOT, "site-i18n");
export const config = () => JSON.parse(fs.readFileSync(path.join(STORE, "config.json"), "utf8"));
export const siteRoutes = () => JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
export const fileOf = (route) => path.basename(siteRoutes().find((r) => r.route === route)?.file || "");
export const key = (src) => crypto.createHash("sha1").update(src).digest("hex").slice(0, 10);

// ---------------------------------------------------------------- reading the page
const RAW = "script|style|svg|noscript|template|textarea|pre";
const VOID = new Set("img br input meta link hr source wbr area base col embed track".split(" "));
const BLOCK = new Set(("html head body div section article main header footer nav aside ul ol li p h1 h2 h3 h4 h5 h6 table thead tbody tfoot tr td th " +
  "dl dt dd figure figcaption blockquote form fieldset legend details summary dialog select option optgroup label button address title").split(" "));
const TOKEN = new RegExp(`<!--[\\s\\S]*?-->|<!doctype[^>]*>|<(${RAW})\\b(?:[^>"']|"[^"]*"|'[^']*')*>[\\s\\S]*?<\\/\\1\\s*>|<\\/([a-zA-Z][\\w:-]*)\\s*>|<([a-zA-Z][\\w:-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|<`, "gi");

// A light tree: enough to know what is inside what. write(read(html)) === html, always.
export function read(html) {
  const root = { type: "el", tag: "#root", open: "", close: "", kids: [] };
  const stack = [root];
  for (const m of html.matchAll(TOKEN)) {
    const top = stack[stack.length - 1];
    if (m[3]) {
      const tag = m[3].toLowerCase();
      const node = { type: "el", tag, open: m[0], close: "", kids: [], up: top };
      top.kids.push(node);
      if (!VOID.has(tag) && !/\/\s*>$/.test(m[0])) stack.push(node);
    } else if (m[2]) {
      const tag = m[2].toLowerCase();
      let i = stack.length - 1;
      while (i > 0 && stack[i].tag !== tag) i--;
      if (i > 0) { stack[i].close = m[0]; stack.length = i; } else top.kids.push({ type: "raw", html: m[0] });
    } else if (m[1] || m[0].startsWith("<")) top.kids.push({ type: "raw", html: m[0], svg: (m[1] || "").toLowerCase() === "svg" });
    else top.kids.push({ type: "text", text: m[0] });
  }
  return root;
}
export const write = (n) => (n.type === "text" ? n.text : n.type === "raw" ? n.html : n.open + n.kids.map(write).join("") + n.close);
export const attr = (open, name) => { const m = open.match(new RegExp(`\\s${name}="([^"]*)"`, "i")); return m ? m[1] : null; };
export const setAttr = (open, name, value) => (attr(open, name) === null ? open.replace(/\s*\/?>$/, (e) => ` ${name}="${value}"${e.trim() === "/>" ? " />" : ">"}`) : open.replace(new RegExp(`(\\s${name}=")[^"]*"`, "i"), (_, a) => a + value + '"'));

const hasBlock = (n) => (n._hb ??= n.kids.some((c) => c.type === "el" && (BLOCK.has(c.tag) || hasBlock(c))));
const letters = (s) => /\p{L}{2}/u.test(s.replace(/<\/?\d+\/?>/g, "").replace(/&[a-z#0-9]+;/gi, " "));
const norm = (s) => s.replace(/\s+/g, " ").trim();
const closest = (n, test) => { for (let x = n; x; x = x.up) if (test(x)) return x; return null; };

// What a visitor reads or hears from an attribute.
const ATTRS = ["alt", "title", "aria-label", "placeholder"];
// (the share image's alt text is the hero picture's alt, so it reads in the page's language too)
const META = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)$/;

// A run of inline content as text with numbered placeholders; `map` remembers what each stands for.
function flatten(nodes, map) {
  let out = "";
  for (const n of nodes) {
    if (n.type === "text") out += n.text;
    else if (n.type === "raw" || (n.type === "el" && VOID.has(n.tag))) { map.push({ node: n }); out += `<${map.length}/>`; }
    else { map.push({ node: n }); const i = map.length; out += `<${i}>${flatten(n.kids, map)}</${i}>`; }
  }
  return out;
}

// Every translatable thing on the page, in reading order. Each item can put a translation back.
export function segments(root, o = {}) {
  const keep = new Set(o.keep || []), out = [];
  const skipText = (s) => !letters(s) || keep.has(norm(s.replace(/<\/?\d+\/?>/g, ""))) || /^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(norm(s)) || /^https?:\/\//.test(norm(s));
  const zone = (n) => (closest(n, (x) => x.tag === "head") ? "head" : closest(n, (x) => x.tag === "main") ? "main" : "site");

  function attrsOf(n) {
    if (n.type !== "el") return;
    for (const a of ATTRS) {
      const v = attr(n.open, a);
      if (v && !skipText(v)) out.push({ kind: "attr", zone: zone(n), src: norm(v), put: (t) => { n.open = setAttr(n.open, a, t.replace(/"/g, "&quot;")); } });
    }
    if (n.tag === "meta" && META.test(attr(n.open, "name") || attr(n.open, "property") || "")) {
      const v = attr(n.open, "content");
      // "Title | Kwontified": the part before the bar is the page's own title
      if (v) for (const part of v.split(" | ")) if (!skipText(part)) out.push({ kind: "attr", zone: "head", src: norm(part), put: (t) => { n.open = setAttr(n.open, "content", attr(n.open, "content").split(" | ").map((p) => (norm(p) === norm(part) ? t.replace(/"/g, "&quot;") : p)).join(" | ")); } });
    }
    if (n.tag === "input" && /^(submit|button)$/.test(attr(n.open, "type") || "") && attr(n.open, "value") && !skipText(attr(n.open, "value"))) out.push({ kind: "attr", zone: zone(n), src: norm(attr(n.open, "value")), put: (t) => { n.open = setAttr(n.open, "value", t); } });
  }

  function run(parent, from, to) {
    let nodes = parent.kids.slice(from, to), host = parent, a = from;
    // peel wrappers that enclose the whole run, so "<a><span>Work</span></a>" is just "Work"
    for (;;) {
      const real = nodes.filter((n) => !(n.type === "text" && !n.text.trim()));
      if (real.length !== 1 || real[0].type !== "el" || VOID.has(real[0].tag)) break;
      host = real[0]; nodes = host.kids; a = 0;
    }
    if (!nodes.length) return;
    const map = [], flat = flatten(nodes, map);
    if (skipText(flat)) return;
    const lead = flat.match(/^\s*/)[0], tail = flat.match(/\s*$/)[0];
    out.push({ kind: "text", zone: zone(host), src: norm(flat), tags: map.length, put(t) {
      const html = t.replace(/<(\/?)(\d+)(\/?)>/g, (all, close, i, self) => { const n = map[+i - 1]?.node; if (!n) return all; return self ? write(n) : close ? n.close : n.open; });
      host.kids.splice(a, nodes.length, { type: "raw", html: lead + html + tail });
    } });
  }

  (function walk(n) {
    if (n.type !== "el") return;
    if (attr(n.open, "translate") === "no" || /\bnotranslate\b/.test(attr(n.open, "class") || "")) return;
    if (o.leave && o.leave(n)) return;
    // an <option> keeps its English value, which the page's filters compare against
    if (n.tag === "option" && attr(n.open, "value") === null) n.open = setAttr(n.open, "value", norm(n.kids.map(write).join("")));
    if (n.tag === "title") {
      const t = n.kids.map(write).join("");
      for (const part of t.split(" | ")) if (!skipText(part)) out.push({ kind: "text", zone: "head", src: norm(part), tags: 0, put: (tr) => { n.kids = [{ type: "raw", html: n.kids.map(write).join("").split(" | ").map((p) => (norm(p) === norm(part) ? tr : p)).join(" | ") }]; } });
      return;
    }
    attrsOf(n);
    // attributes of inline children are listed after the run that contains them: translations
    // go in from the end of the page backwards, so the attribute is in place when the run is rebuilt
    const deep = (x) => { if (x.type === "el") { attrsOf(x); x.kids.forEach(deep); } };
    // a row of separate items with no words between them (menu links, icon links) is one segment
    // per item, so "Creative Studio" is the same entry wherever it appears
    const each = (from, to) => {
      const part = n.kids.slice(from, to), real = part.filter((c) => !(c.type === "text" && !c.text.trim()));
      if (real.length > 1 && real.every((c) => c.type !== "text")) part.forEach((c, i) => { if (c.type === "el") run(n, from + i, from + i + 1); });
      else run(n, from, to);
    };
    if (!hasBlock(n)) { const kids = n.kids.slice(); if (n.tag !== "#root") each(0, kids.length); kids.forEach(deep); return; }
    // mixed content: each stretch of inline content between blocks is its own segment
    let start = -1; const kids = n.kids.slice(), jobs = [];
    kids.forEach((c, i) => {
      const inline = c.type !== "el" ? !(c.type === "raw" && !c.svg) : !BLOCK.has(c.tag) && !hasBlock(c);
      if (inline) { if (start < 0) start = i; } else { if (start >= 0) jobs.push({ at: start, to: i }); start = -1; jobs.push({ at: i, el: c.type === "el" ? c : null }); }
    });
    if (start >= 0) jobs.push({ at: start, to: kids.length });
    for (const j of jobs) {
      if (j.el) walk(j.el);
      else if (j.to !== undefined) { each(j.at, j.to); kids.slice(j.at, j.to).forEach(deep); }
    }
  })(root);
  for (const s of out) s.k = key(s.src);
  return out;
}

// Put translations in. Runs are replaced from the end of the page backwards so that the
// positions earlier runs remember are still right.
export function apply(segs, lookup) {
  let done = 0, missing = 0;
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], t = lookup(s);
    if (t === undefined || t === null || t === "") { missing++; continue; }
    s.put(t); done++;
  }
  return { done, missing };
}

// ---------------------------------------------------------------- checks on a translation
export function problems(src, t, keep = []) {
  const out = [];
  const tags = (s) => (s.match(/<\/?\d+\/?>/g) || []).slice().sort().join(" ");
  if (tags(src) !== tags(t)) out.push(`placeholders differ: source has [${tags(src)}], translation has [${tags(t)}]`);
  // nesting: every <n> closes, in order
  const stack = [];
  for (const m of t.matchAll(/<(\/?)(\d+)(\/?)>/g)) { if (m[3]) continue; if (!m[1]) stack.push(m[2]); else if (stack.pop() !== m[2]) { out.push("placeholders are not nested the way the source nests them"); break; } }
  if (/<(?!\/?\d+\/?>)[a-zA-Z!/]/.test(t)) out.push("contains markup; use only the numbered placeholders");
  // figures: every number in the source appears in the translation (separators may change with the language)
  const nums = (s) => (s.replace(/<\/?\d+\/?>/g, " ").match(/\d[\d.,]*\d|\d/g) || []).map((x) => x.replace(/[.,]/g, ""));
  const have = nums(t);
  for (const n of nums(src)) { const i = have.indexOf(n); if (i < 0) { out.push(`the figure ${n} is missing`); break; } have.splice(i, 1); }
  for (const term of keep) if (src.includes(term) && !t.includes(term)) out.push(`"${term}" must stay as written`);
  return out;
}

// ---------------------------------------------------------------- the stored translations
export function memory(lang) {
  const dir = path.join(STORE, lang), map = new Map(), files = [];
  if (!fs.existsSync(dir)) return { map, files, dir };
  const add = (f) => { const j = JSON.parse(fs.readFileSync(f, "utf8")); files.push({ file: f, json: j }); for (const s of j.segments || []) if (s.t) map.set(s.k, s.t); };
  if (fs.existsSync(path.join(dir, "_site.json"))) add(path.join(dir, "_site.json"));
  const pages = path.join(dir, "pages");
  if (fs.existsSync(pages)) for (const f of fs.readdirSync(pages).sort()) if (f.endsWith(".json")) add(path.join(pages, f));
  return { map, files, dir };
}
export const pageStore = (lang, htmlFile) => path.join(STORE, lang, "pages", htmlFile.replace(/\.html$/, ".json"));
export const englishPages = () => fs.readdirSync(DIR).filter((f) => f.endsWith(".html") && !/^[a-z]{2}(-[a-z]{2})?--/.test(f));

// A card or row in the body of a page that opens an article or case study not available in
// this language keeps its English words: the page it opens is in English.
export const leaveFor = (available) => (n) => {
  const inMain = (x) => { for (; x; x = x.up) if (x.tag === "main") return true; return false; };
  if (!inMain(n.up)) return false;
  const row = /\sdata-kq-row[\s=>]/.test(n.open), card = n.tag === "a" && n.kids.some((c) => c.type === "el" && /^(p|h[1-6]|div)$/.test(c.tag));
  if (!row && !card) return false;
  const find = (x) => { for (const c of x.kids) { if (c.type !== "el") continue; if (c.tag === "a" && /\bkq-sl\b/.test(attr(c.open, "class") || "")) return attr(c.open, "href"); const d = find(c); if (d) return d; } return null; };
  const href = ((card ? attr(n.open, "href") : find(n)) || "").split(/[#?]/)[0];
  return /^\/(perspectives|work)\/./.test(href) && !available.has(href);
};

// Scripts and styles find some elements by their aria-label ('form[aria-label="Search Perspectives"]').
// Before a page is translated every labelled element also gets the English label as data-kq-label,
// and hooks() points those scripts and styles at it, so translating a label never breaks the page.
export function tagHooks(root) {
  (function walk(n) {
    if (n.type !== "el") return;
    const v = attr(n.open, "aria-label"); if (v !== null && attr(n.open, "data-kq-label") === null) n.open = setAttr(n.open, "data-kq-label", v);
    // the same for links found by their address ('a[href="/contact"]'), which changes when the link is translated
    const h = n.tag === "a" ? attr(n.open, "href") : null; if (h && h.startsWith("/") && attr(n.open, "data-kq-href") === null) n.open = setAttr(n.open, "data-kq-href", h);
    n.kids.forEach(walk);
  })(root);
}
export const hooks = (code) => code.replace(/\[aria-label(?=[*^$~|]?=)/g, "[data-kq-label").replace(/\[href(?=[*^$~|]?=\\?["']\/)/g, "[data-kq-href");

// Words the site's own scripts show a visitor (a button that says "Sending…"). They are written
// T('…') in the scripts; the build hands each translated page a small dictionary for them.
// Also the Perspectives pager's words, which an inline script writes and site-i18n.mjs rewrites.
export const PAGER_STRINGS = ["{a}\u2013{b} of {n}", "No results"];
export function runtimeStrings() {
  const out = new Set(PAGER_STRINGS), dir = path.join(ROOT, "public/assets");
  for (const f of fs.readdirSync(dir)) if (/^kq-(fx|nav|px)-[0-9a-f]{12}\.js$/.test(f)) for (const m of fs.readFileSync(path.join(dir, f), "utf8").matchAll(/\bT\('((?:[^'\\]|\\.)*)'\)/g)) out.add(JSON.parse('"' + m[1].replace(/\\'/g, "'").replace(/"/g, '\\"') + '"'));
  return [...out];
}
