// Moves the home page's client and press logos out of the HTML.
//
// The export draws each logo as an inline SVG (about 380 KB of path data for 30 logos),
// which made the home page three times the size of any other page and slowed its first
// paint on phones. This step writes each logo to its own content-hashed file in
// public/assets and puts an <img> in its place: same size, same colour (the lists set
// color: #262524 and the logos fill with currentColor, so that colour is written into
// the file), the brand name as alt text, loaded as the strip scrolls into view.
//
// Runs after site-tags.mjs. Fails the build if the lists or their colour change, so a
// new export cannot silently lose a logo or show it in the wrong colour.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const FILE = path.join(ROOT, "public/_kq/index.html");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { throw new Error("site-logos: " + m); };
const LISTS = { "Selected clients": 15, "Publications that have featured Kwontified": 15 };
const COLOUR = "#262524";

let html = fs.readFileSync(FILE, "utf8");
let moved = 0, saved = 0;
const lists = {};
for (const [label, expected] of Object.entries(LISTS)) {
  const start = html.indexOf(`<ul aria-label="${label}"`);
  if (start < 0) fail(`list "${label}" not found`);
  const end = html.indexOf("</ul>", start);
  const open = html.slice(start, html.indexOf(">", start));
  if (!open.includes(`color: ${COLOUR}`)) fail(`list "${label}" no longer sets color: ${COLOUR}`);
  let list = html.slice(start, end), n = 0;
  list = list.replace(/<svg([^>]*)\brole="img"([^>]*)>([\s\S]*?)<\/svg>/g, (all, a1, a2, inner) => {
    const attrs = a1 + a2;
    const name = (attrs.match(/aria-label="([^"]*)"/) || [])[1];
    const w = (attrs.match(/\bwidth="([\d.]+)"/) || [])[1], h = (attrs.match(/\bheight="([\d.]+)"/) || [])[1];
    const vb = (attrs.match(/viewBox="([^"]*)"/) || [])[1];
    if (!name || !w || !h || !vb) fail(`a logo in "${label}" is missing its name, size or viewBox`);
    if (/var\(|class="/.test(inner)) fail(`${name}: the logo uses styles that a separate file cannot inherit`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}">${inner.replace(/currentColor/g, COLOUR)}</svg>`;
    const file = `logo-${crypto.createHash("sha256").update(svg).digest("hex").slice(0, 12)}.svg`;
    fs.writeFileSync(path.join(ASSETS, file), svg);
    n++; saved += all.length;
    return `<img src="/assets/${file}" alt="${name}" width="${Math.round(w)}" height="${Math.round(h)}" loading="lazy" decoding="async" style="width: ${w}px; height: ${h}px; display: inline-block">`;
  });
  if (n !== expected) fail(`list "${label}": expected ${expected} logos, found ${n}`);
  if (/<svg\b/.test(list)) fail(`list "${label}" still has an inline drawing`);
  html = html.slice(0, start) + list + html.slice(end);
  lists[label] = list + "</ul>";
  moved += n;
}
fs.writeFileSync(FILE, html);

// The same two lists on About and Why Kwontified: site-about.mjs leaves a marker where each
// goes, because the logo files do not exist until this step has written them.
const MARKS = { "<!--kq-logos:clients-->": "Selected clients", "<!--kq-logos:press-->": "Publications that have featured Kwontified" };
let placed = 0;
for (const f of ["about.html", "why-kwontified.html"]) {
  const file = path.join(ROOT, "public/_kq", f);
  if (!fs.existsSync(file)) continue;
  let page = fs.readFileSync(file, "utf8");
  for (const [mark, label] of Object.entries(MARKS)) {
    const n = page.split(mark).length - 1;
    if (!n) continue;
    page = page.split(mark).join(`<div class="kq-ab-logowrap">${lists[label]}</div>`);
    placed += n;
  }
  if (page.includes("<!--kq-logos:")) fail(`${f}: a logo marker was not filled`);
  fs.writeFileSync(file, page);
}
console.log(`site-logos: ${moved} home page logos moved to their own files (${Math.round(saved / 1024)} KB out of the HTML; page now ${Math.round(html.length / 1024)} KB); the lists also placed ${placed} times on About and Why Kwontified`);
