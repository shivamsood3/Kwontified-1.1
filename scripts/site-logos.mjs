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

// The same two lists on any other page that asks for them: an earlier step (site-about.mjs,
// site-capchan.mjs) leaves a marker where a list goes, because the logo files do not exist
// until this step has written them. Every page is looked at, so a new step only has to leave
// the marker; a marker this step does not know stops the build.
// On phones those bands use the home page's rule (QA F009, 2026-11-27): three logos to a row, each
// at its own drawn size and only shrunk to fit its column. The About, capability and channel
// styles capped every logo at 24px tall, so square marks shrank to 24px and wide wordmarks to
// 10px, half their size on the home page. This step runs after those steps, so its rule wins.
const EVEN = `<style data-kq-logos>@media (max-width:760px){
div.kq-ab-logowrap.kq-logos>ul{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px 14px!important}
div.kq-ab-logowrap.kq-logos>ul>li{min-width:0;min-height:48px!important;flex:none!important}
div.kq-ab-logowrap.kq-logos>ul>li>img{max-width:100%!important;max-height:none!important;height:auto!important}
/* press wordmarks are wide: two to a row on phones so the widest (WSJ, LA Times) stay legible (QA visual-14) */
div.kq-ab-logowrap.kq-logos>ul[aria-label^="Publications"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}</style>`;
const MARKS = { "<!--kq-logos:clients-->": "Selected clients", "<!--kq-logos:press-->": "Publications that have featured Kwontified" };
let placed = 0;
const on = [];
for (const f of fs.readdirSync(path.join(ROOT, "public/_kq")).filter((x) => x.endsWith(".html")).sort()) {
  const file = path.join(ROOT, "public/_kq", f);
  let page = fs.readFileSync(file, "utf8");
  if (!page.includes("<!--kq-logos:")) continue;
  for (const [mark, label] of Object.entries(MARKS)) {
    const n = page.split(mark).length - 1;
    if (!n) continue;
    page = page.split(mark).join(`<div class="kq-ab-logowrap kq-logos">${lists[label]}</div>`);
    placed += n;
  }
  if (page.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
  page = page.replace("</head>", () => EVEN + "</head>");
  if (page.includes("<!--kq-logos:")) fail(`${f}: a logo marker was not filled`);
  fs.writeFileSync(file, page);
  on.push(f);
}
console.log(`site-logos: ${moved} home page logos moved to their own files (${Math.round(saved / 1024)} KB out of the HTML; page now ${Math.round(html.length / 1024)} KB); the lists also placed ${placed} times on ${on.length} other pages`);
