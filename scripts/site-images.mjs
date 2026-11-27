// Responsive images: every photo is served as WebP at the size its slot needs.
//
// Runs after site-seo.mjs and before site-tags.mjs, on the files in public/_kq. Images that later
// steps insert (site-logos, site-perspectives) are not seen here; those steps size their own.
//
// For every <img> that shows a JPEG or PNG from /assets and has no srcset of its own:
//  - writes WebP copies at 400, 800, 1200 and 1600 px wide (only widths below the original) plus
//    one at the original width, and for a slot of fixed width N px also at 2N and 3N (so a 112 px
//    thumbnail gets 224 and 336), as <name>-<width>.webp next to it in public/assets (generated,
//    like the rest of that folder; an existing copy newer than its original is reused);
//  - lists only the WebP files in srcset; the JPEG or PNG stays as src, the fallback for browsers
//    without srcset or WebP;
//  - sets sizes from the slot the image sits in (SLOTS below), so a 400 px card gets a 400 or
//    800 px file instead of the full-size original; heroes stay 100vw;
//  - writes width and height (the file's own size) so the browser can reserve the box, with
//    height: auto inline where the inline style sets a width but no height, so the box keeps
//    its CSS shape;
//  - preloads the page's hero (fetchpriority="high") with imagesrcset and imagesizes.
// Every <img> below the first section of <main> (photos, logos, the footer mark) that does not
// say how to load gets loading="lazy" and decoding="async".
//
// Needs sharp (in package.json dependencies; Next.js uses it too). Without it the step fails;
// SKIP_IMAGES=1 skips the step on purpose, which ships the full-size JPEGs.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const KQ = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { console.error("site-images: " + m); process.exit(1); };

if (process.env.SKIP_IMAGES === "1") {
  console.log("site-images: SKIPPED because SKIP_IMAGES=1. Pages ship full-size JPEGs with no srcset, sizes or dimensions; do not deploy this build.");
  process.exit(0);
}
let sharp;
try { sharp = (await import("sharp")).default; } catch (e) {
  fail(`cannot load sharp (${e.code || e.message}). Run npm install (sharp is a dependency in package.json), or set SKIP_IMAGES=1 to build without responsive images.`);
}

const LADDER = [400, 800, 1200, 1600];
const QUALITY = 72;

// ---------------------------------------------------------------------------------------------
// Slot sizes. Three bands match the site's breakpoints: phones (up to 760 px), tablets and small
// laptops (761 to 1180 px) and desktops. Each value is the widest the slot is drawn in that band,
// measured with Playwright at 320 to 2560 px (rounded up), so no image is ever softer than its box.
// On phones nearly every slot is the page width less the side margins (at least 20 px each).
const PHONE = "calc(100vw - 40px)";
const px = (v) => (typeof v === "number" ? `${v}px` : v);
const sized = (desk, mid = desk, phone = PHONE) => `(max-width: 760px) ${px(phone)}, (max-width: 1180px) ${px(mid)}, ${px(desk)}`;
// [what the slot is, test on the context string (see context() below), sizes]
const SLOTS = [
  ["full-bleed hero", /^img\.[^ ]*\bkq-(?:hero-img|art-hero)\b|< figure\.kq-break\b|^img < section\.kq-eh\b/, "100vw"],
  ["home capability cards", /< article < div\.kq-hm-caps\b/, sized(405, 385, "70vw")],
  ["home channel picture", /< div\.kq-hm-chpic\b/, sized(575, "90vw")],
  ["home featured article", /< article\{1\.5 1 440px\}/, sized(710, 810)],
  ["work index cards", /< a\.kq-ccard < div\.kq-cgrid\b/, sized(480, 700)],
  ["gallery wide tiles", /< figure\.kq-wide < div\.kq-ggrid\b/, sized(710, 940)],
  ["gallery tiles", /< figure < div\.kq-ggrid\b/, sized(350, 460)],
  ["channel index tiles", /< span\.kq-pic < span < a\.kq-tile\b/, sized(260, 310)],
  ["Perspectives index cards", /< article < div\.kq-pgx\b/, sized(420, 450)],
  // between 761 and 1180 px this picture wraps under its text and takes its width from the
  // picture's own width (sizes), so that band must stay at the full width
  ["Perspectives featured card", /< figure\.kq-vis\b/, sized(490, "100vw")],
  ["capabilities index cards", /< a\.kq-cc-capmain\b/, sized(540, 700)],
  ["About office photos", /< ul\.kq-ab-offices\b/, sized(430, 400)],
  ["Creative Studio masonry", /< figure < div\(4 260px\)/, sized(350, 340)],
  ["contact side picture", /^img\.[^ ]*\bkq-cr-img\b/, "440px"],
  ["channel results row", /< div\{1 1 300px\} </, sized(410, "92vw")],
  ["sign-in picture", /< div\{1 1 380px\} < div\[mw1040\]/, sized(500, 700)],
  ["half-width still life", /< div\{1 1 520px\} </, sized(520)],
];

// The open elements around each <img>, read with a small tokenizer (the pages are generated, so
// they are well formed; script and style bodies are skipped).
const VOID = new Set("area base br col embed hr img input link meta source track wbr".split(" "));
const TOK = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
const attr = (s, n) => (s.match(new RegExp(`\\s${n}="([^"]*)"`)) || [])[1];
const prop = (style, n) => (style.match(new RegExp(`(?:^|;)\\s*${n}:\\s*([^;]+)`)) || [])[1]?.trim();

function imagesIn(html) {
  const out = [], stack = [];
  for (const m of html.matchAll(TOK)) {
    if (m[2]) { const i = stack.map((x) => x.tag).lastIndexOf(m[2].toLowerCase()); if (i >= 0) stack.length = i; continue; }
    if (!m[3]) continue;
    const tag = m[3].toLowerCase(), a = m[4] || "";
    if (tag === "img") { out.push({ at: m.index, tag: m[0], anc: stack.slice().reverse() }); continue; }
    if (VOID.has(tag) || /\/\s*$/.test(a)) continue;
    const parent = stack[stack.length - 1];
    let fold = parent ? parent.fold : "above";
    if (tag === "main") fold = "main";
    else if (parent?.fold === "main") fold = parent.seen++ ? "below" : "above"; // first child of <main> is the first screen
    if (tag === "footer") fold = "below";
    stack.push({ tag, id: attr(a, "id") || "", cls: attr(a, "class") || "", style: attr(a, "style") || "", fold, seen: 0 });
  }
  return out;
}

// One line per image: the image (class, fixed width) and its six nearest ancestors with class,
// id, flex, max-width and columns, e.g. "img < figure < div.kq-ggrid(repeat(...)) < div[mw1312]".
function context(img) {
  const cls = attr(img.tag, "class"), w = prop(attr(img.tag, "style") || "", "width")?.match(/^(\d+)px$/)?.[1];
  const anc = img.anc.slice(0, 6).map((x) => {
    const fl = prop(x.style, "flex"), mw = x.style.match(/max-width:\s*(\d+)px/)?.[1], cols = prop(x.style, "columns");
    return x.tag + (x.cls ? "." + x.cls.trim().split(/\s+/).join(".") : "") + (x.id ? "#" + x.id : "") + (fl ? `{${fl}}` : "") + (mw ? `[mw${mw}]` : "") + (cols ? `(${cols})` : "");
  });
  return (cls ? "img." + cls.trim().split(/\s+/).join(".") : "img") + (w ? `[w${w}]` : "") + " < " + anc.join(" < ");
}

const ruleCount = {};
const bump = (k) => (ruleCount[k] = (ruleCount[k] || 0) + 1);
const unbounded = new Map();
function sizesFor(img, ctx) {
  const fixed = ctx.match(/^img[^ ]*\[w(\d+)\]/);
  if (fixed) return bump("fixed width"), `${fixed[1]}px`;
  // Home work strip: each figure's width follows its --r ratio (desktop 278 px, tablet 240 px per unit).
  const work = img.anc[0]?.tag === "figure" && img.anc[1]?.cls.split(/\s+/).includes("kq-hm-work") && img.anc[0].style.match(/--r:\s*([\d.]+)/);
  if (work) return bump("home work strip"), `(max-width: 1180px) ${Math.ceil(240 * work[1])}px, ${Math.ceil(278 * work[1])}px`;
  for (const [name, re, sizes] of SLOTS) if (re.test(ctx)) return bump(name), sizes;
  // Anything else: the narrowest fixed bound around it (a flex item that cannot grow, or a
  // max-width), else the page container, else the full width. Never smaller than the box.
  let cap = Infinity;
  for (const x of img.anc) {
    if (x.tag === "section" || x.tag === "main") break;
    const fl = prop(x.style, "flex")?.match(/^0\s+\d*\.?\d+\s+(\d+)px$/);
    if (fl) cap = Math.min(cap, +fl[1]);
    const mw = x.style.match(/max-width:\s*(\d+)px/);
    if (mw) cap = Math.min(cap, +mw[1]);
  }
  if (cap < Infinity) return bump("inline bound"), `(max-width: ${cap + 40}px) ${PHONE}, ${cap}px`;
  unbounded.set(ctx, (unbounded.get(ctx) || 0) + 1);
  return bump("no bound found (100vw)"), "100vw";
}

// ---------------------------------------------------------------------------------------------
const pages = fs.readdirSync(KQ).filter((f) => f.endsWith(".html"));
const RASTER = /^\/assets\/([^"/]+)\.(jpe?g|png)$/;
const parsed = new Map();
const wanted = new Map(); // file -> extra widths its fixed-width slots ask for
for (const f of pages) {
  const html = fs.readFileSync(path.join(KQ, f), "utf8");
  const imgs = imagesIn(html);
  parsed.set(f, { html, imgs });
  for (const im of imgs) {
    const s = attr(im.tag, "src") || "";
    if (!RASTER.test(s) || /\ssrcset=/.test(im.tag)) continue;
    im.file = s.slice(8);
    im.sizes = sizesFor(im, context(im));
    if (!wanted.has(im.file)) wanted.set(im.file, new Set());
    const fixed = im.sizes.match(/^(\d+)px$/);
    if (fixed) for (const k of [2, 3]) wanted.get(im.file).add(k * fixed[1]);
  }
}

// Sizes of every original, and its WebP widths.
const info = {};
let made = 0;
const files = [...wanted.keys()];
const missing = files.filter((f) => !fs.existsSync(path.join(ASSETS, f)));
if (missing.length) fail(`${missing.length} images used by pages are not in public/assets, e.g. ${missing[0]}`);
const queue = files.slice();
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let file; (file = queue.shift()); ) {
    const src = path.join(ASSETS, file);
    const meta = await sharp(src).metadata();
    const W = meta.width, H = meta.height;
    if (!W || !H) fail(`cannot read the size of ${file}`);
    const widths = [...new Set([...LADDER, ...wanted.get(file)])].filter((w) => w <= W * 0.9).sort((a, b) => a - b).concat(W);
    info[file] = { W, H, widths };
    const base = sharp(src);
    const srcTime = fs.statSync(src).mtimeMs;
    await Promise.all(widths.map(async (w) => {
      const out = path.join(ASSETS, file.replace(/\.\w+$/, `-${w}.webp`));
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= srcTime) return;
      await base.clone().resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
      made++;
    }));
  }
}));

// ---------------------------------------------------------------------------------------------
let tagged = 0, dimmed = 0, lazied = 0, preloaded = 0;
for (const f of pages) {
  const { html, imgs } = parsed.get(f);
  let out = "", last = 0, preload = null;
  for (const im of imgs) {
    let tag = im.tag;
    const { file, sizes } = im;
    const own = file ? info[file] : null;
    if (own) {
      const srcset = own.widths.map((w) => `/assets/${file.replace(/\.\w+$/, `-${w}.webp`)} ${w}w`).join(", ");
      tag = tag.replace(/\ssrc="/, () => ` srcset="${srcset}" sizes="${sizes}" src="`);
      tagged++;
      if (/\sfetchpriority="high"/.test(tag)) {
        if (preload) fail(`${f}: two images ask for fetchpriority="high"`);
        preload = `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${sizes}" fetchpriority="high">`;
      }
      if (!/\swidth="/.test(tag) && !/\sheight="/.test(tag)) {
        tag = tag.replace(/^<img\b/, `<img width="${own.W}" height="${own.H}"`);
        // The height attribute would otherwise set the height of an image whose inline style sizes
        // only its width. Images sized by a stylesheet (no inline width) keep that stylesheet's height.
        const style = attr(tag, "style") || "";
        if (prop(style, "width") && !prop(style, "height")) tag = tag.replace(/\sstyle="([^"]*)"/, (_, s) => ` style="${s.replace(/;?\s*$/, "")}; height: auto"`);
        dimmed++;
      }
    }
    const inHeader = im.anc.some((x) => x.tag === "header");
    const below = !inHeader && (im.anc[0]?.fold === "below");
    if (below && !/\sloading="/.test(tag) && !/\sfetchpriority="high"/.test(tag)) {
      tag = tag.replace(/^<img\b/, /\sdecoding="/.test(tag) ? '<img loading="lazy"' : '<img loading="lazy" decoding="async"');
      lazied++;
    }
    out += html.slice(last, im.at) + tag;
    last = im.at + im.tag.length;
  }
  out += html.slice(last);
  if (preload) {
    if (out.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
    out = out.replace("</head>", () => preload + "</head>");
    preloaded++;
  }
  if (out !== html) fs.writeFileSync(path.join(KQ, f), out);
}

// ---- checks ----------------------------------------------------------------------------------
const problems = [];
for (const f of pages) {
  const h = fs.readFileSync(path.join(KQ, f), "utf8");
  for (const im of imagesIn(h)) {
    const s = attr(im.tag, "src") || "";
    if (!RASTER.test(s)) continue;
    const set = attr(im.tag, "srcset");
    if (set) for (const c of set.split(",")) { const u = c.trim().split(/\s+/)[0]; if (!fs.existsSync(path.join(ROOT, "public", u))) problems.push(`${f}: srcset file missing ${u}`); }
    if (set && /\.(jpe?g|png)\s/.test(set) && info[s.slice(8)]) problems.push(`${f}: a JPEG or PNG in srcset for ${s}`);
    if (!/\swidth="/.test(im.tag) || !/\sheight="/.test(im.tag)) { if (info[s.slice(8)]) problems.push(`${f}: ${s} has no width and height`); }
  }
}
if (problems.length) fail(`${problems.length} problems, e.g.\n  ${problems.slice(0, 8).join("\n  ")}`);

console.log(`site-images: ${Object.keys(info).length} photos, ${made} WebP files made this run; srcset on ${tagged} images, width and height on ${dimmed}, lazy loading on ${lazied} more, hero preloaded on ${preloaded} pages`);
console.log("site-images: sizes by slot: " + Object.entries(ruleCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", "));
if (unbounded.size) {
  console.log(`site-images: ${[...unbounded.values()].reduce((a, b) => a + b, 0)} images have no known slot and get sizes="100vw" (sharp but heavy). Add a line to SLOTS for them:`);
  for (const [k, v] of unbounded) console.log(`  ${v}x ${k}`);
}
