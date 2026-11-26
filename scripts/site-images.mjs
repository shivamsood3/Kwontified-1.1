// Responsive images: phones get an 800px WebP instead of the full 1,400-1,600px JPEG.
//
// Runs after site-seo.mjs and before site-tags.mjs, on the files in public/_kq. For every
// photo an <img> uses from /assets that is wider than 900px, it writes <name>-800.webp next to
// it (generated, like the rest of public/assets) and gives the <img> a srcset with both files.
// sizes="100vw" means a browser never picks a file narrower than the space it fills, so no
// image gets softer than before; desktops keep the original, phones save most of the bytes.
// Lighthouse measured 0.8-2 MB of avoidable image weight per page on mobile before this.
//
// Uses sharp, which Next.js installs for its own image handling. If sharp is not available the
// step leaves the pages unchanged and says so; the site works the same, only heavier.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const KQ = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const W = 800, MIN = 900;

let sharp;
try { sharp = (await import("sharp")).default; } catch { console.log("site-images: sharp not available; images left as they are"); process.exit(0); }

const pages = fs.readdirSync(KQ).filter((f) => f.endsWith(".html"));
const IMG = /<img\b[^>]*\ssrc="\/assets\/([^"/]+)\.(jpe?g|png)"[^>]*>/g;
const wanted = new Set();
for (const f of pages) for (const m of fs.readFileSync(path.join(KQ, f), "utf8").matchAll(IMG)) if (!m[0].includes("srcset=")) wanted.add(`${m[1]}.${m[2]}`);

const width = {};
let made = 0;
await Promise.all([...wanted].map(async (file) => {
  const src = path.join(ASSETS, file);
  if (!fs.existsSync(src)) return;
  const meta = await sharp(src).metadata();
  if (meta.width <= MIN) return;
  width[file] = meta.width;
  const out = path.join(ASSETS, file.replace(/\.\w+$/, `-${W}.webp`));
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) return;
  await sharp(src).resize({ width: W }).webp({ quality: 72 }).toFile(out);
  made++;
}));

let tagged = 0;
for (const f of pages) {
  const p = path.join(KQ, f);
  const h = fs.readFileSync(p, "utf8");
  const n = h.replace(IMG, (tag, name, ext) => {
    const file = `${name}.${ext}`;
    if (tag.includes("srcset=") || !width[file]) return tag;
    tagged++;
    return tag.replace(/\ssrc="/, () => ` srcset="/assets/${name}-${W}.webp ${W}w, /assets/${file} ${width[file]}w" sizes="100vw" src="`);
  });
  if (n !== h) fs.writeFileSync(p, n);
}
console.log(`site-images: ${Object.keys(width).length} photos have an ${W}px WebP (${made} made this run), srcset on ${tagged} images`);
