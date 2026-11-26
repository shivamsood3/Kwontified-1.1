// Builds the public site from the client's Figma Make HTML exports.
//
// The exports in site-src/pages are the source of truth for design, content
// and behaviour. This script changes as little as possible so every page
// renders exactly as exported:
//   1. each export is served at the route named by its own <link rel="canonical">
//   2. links between exports ("About.html", "Post.html#A0998") become routes
//   3. "assets/..." becomes "/assets/..." so nested routes resolve
//   4. Post, PostNews and PostPressRelease hold an archive that the page swaps in
//      by URL hash; each archive entry is prerendered at its own canonical route
//      by applying the same edits the page's show() function makes in the browser
//   5. a small capture-phase listener forwards form submissions to /api/contact
//      and /api/subscribe (the export's own handler calls its redirect "a stand-in
//      for the live form endpoint"); nothing visible changes
//
// Output: public/_kq/*.html, public/assets/*, site-routes.json

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC_PAGES = path.join(ROOT, "site-src/pages");
const SRC_ASSETS = path.join(ROOT, "site-src/assets");
const OUT_PAGES = path.join(ROOT, "public/_kq");
const OUT_ASSETS = path.join(ROOT, "public/assets");

// Routes the canonical tag cannot give us.
const ROUTE_OVERRIDES = {
  "ClientSignIn.html": "/client-sign-in", // canonical points at the external portal
};
const ARCHIVE_PAGES = ["Post.html", "PostNews.html", "PostPressRelease.html"];

const read = (f) => fs.readFileSync(f, "utf8");
const pages = fs.readdirSync(SRC_PAGES).filter((f) => f.endsWith(".html")).sort();

function canonicalOf(html) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!m) return null;
  return m[1].replace(/^https:\/\/kwontified\.com/, "") || "/";
}

// ---- 1. routes -----------------------------------------------------------
const pageRoute = {}; // "About.html" -> "/about"
const archives = {}; // "Post.html" -> { A0999: entry, ... }
const archiveDefault = {}; // "Post.html" -> "A0999"

for (const f of pages) {
  const html = read(path.join(SRC_PAGES, f));
  if (ARCHIVE_PAGES.includes(f)) {
    const m = html.match(/<script type="application\/json" id="kq-articles">([\s\S]*?)<\/script>/);
    archives[f] = JSON.parse(m[1]);
    // Articles imported from the content archive (scripts/import-archive.py) join the
    // ones embedded in the template. An article's own image is used once the file
    // site-src/assets/archive-<ID>.jpg exists; until then it shows the plain panel.
    const extra = path.join(ROOT, "site-src/archive", f.replace(".html", ".json"));
    if (fs.existsSync(extra)) {
      for (const [id, a] of Object.entries(JSON.parse(read(extra)))) {
        if (archives[f][id]) continue;
        const own = `archive-${id}.jpg`;
        archives[f][id] = fs.existsSync(path.join(SRC_ASSETS, own)) ? { ...a, img: `assets/${own}` } : a;
      }
    }
    archiveDefault[f] = html.match(/data-art="body" data-archive-id="(A\d{4})"/)[1];
    continue;
  }
  const r = ROUTE_OVERRIDES[f] ?? canonicalOf(html);
  if (!r || r.startsWith("http")) throw new Error(`no route for ${f}`);
  pageRoute[f] = r;
}
const archiveRoute = (f, id) => {
  const a = archives[f][id];
  if (!a) throw new Error(`unknown archive id ${f}#${id}`);
  return a.canon.replace(/^https:\/\/kwontified\.com/, "");
};
for (const f of ARCHIVE_PAGES) pageRoute[f] = archiveRoute(f, archiveDefault[f]);

// ---- 2/3. link + asset rewriting ------------------------------------------
const unknownLinks = new Set();
function rewriteLinks(html) {
  // X.html, X.html#frag — in attributes, inline JS strings and JSON alike. Internal
  // links are always a bare file name right after a quote, so file names inside
  // external URLs (".../warning-for-brands.html") are never touched.
  html = html.replace(/(?<=["'])([A-Za-z]+)\.html(#[A-Za-z0-9=_-]*)?/g, (all, name, hash = "") => {
    const file = `${name}.html`;
    if (ARCHIVE_PAGES.includes(file) && /^#A\d{4}$/.test(hash)) return archiveRoute(file, hash.slice(1));
    if (!(file in pageRoute)) {
      unknownLinks.add(all);
      return all;
    }
    return pageRoute[file] + hash;
  });
  // assets/x -> /assets/x (attributes, url(), JSON, srcset)
  html = html.replace(/(["'(=\s,])assets\//g, "$1/assets/");
  return html;
}

// ---- 4. archive prerender (server-side replay of show()) -------------------
const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source"]);

function openTagAt(html, attr) {
  const at = html.indexOf(attr);
  if (at < 0) return null;
  const start = html.lastIndexOf("<", at);
  // end of the opening tag, skipping quoted attribute values
  let i = start, q = null;
  for (; i < html.length; i++) {
    const c = html[i];
    if (q) { if (c === q) q = null; }
    else if (c === '"' || c === "'") q = c;
    else if (c === ">") break;
  }
  const tag = html.slice(start + 1).match(/^([a-zA-Z0-9]+)/)[1].toLowerCase();
  return { start, openEnd: i + 1, tag };
}

function innerRange(html, attr) {
  const t = openTagAt(html, attr);
  if (!t) return null;
  if (VOID.has(t.tag)) throw new Error(`${attr} is a void <${t.tag}>`);
  const re = new RegExp(`<(/?)${t.tag}\\b[^>]*>`, "gi");
  re.lastIndex = t.openEnd;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    if (m[1]) depth--;
    else if (!m[0].endsWith("/>")) depth++;
    if (depth === 0) return { ...t, innerStart: t.openEnd, innerEnd: m.index };
  }
  throw new Error(`unbalanced <${t.tag}> for ${attr}`);
}

function setInner(html, name, value) {
  const r = innerRange(html, `data-art="${name}"`);
  if (!r) return html;
  return html.slice(0, r.innerStart) + value + html.slice(r.innerEnd);
}

function setOpenAttr(html, name, attrName, value) {
  const t = openTagAt(html, `data-art="${name}"`);
  if (!t) return html;
  let open = html.slice(t.start, t.openEnd);
  const re = new RegExp(`\\s${attrName}="[^"]*"`);
  // function replacers: the value is inserted literally (a string replacement would read "$1", "$&" etc. in it)
  open = re.test(open) ? open.replace(re, () => ` ${attrName}="${value}"`) : open.replace(/>$/, () => ` ${attrName}="${value}">`);
  return html.slice(0, t.start) + open + html.slice(t.openEnd);
}

const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escText(s).replace(/"/g, "&quot;");

function setMeta(html, sel, attr, value) {
  const re = new RegExp(`(<${sel}[^>]*\\s${attr}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta not found: ${sel}`);
  return html.replace(re, (_, a, b) => a + value + b);
}

function renderArchive(template, a) {
  let h = template;
  // document metadata — mirrors show(): desc is HTML text (decoded by the browser
  // when parsed), ttag is literal text
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escText(a.ttag)}</title>`);
  h = setMeta(h, 'meta name="description"', "content", a.desc);
  h = setMeta(h, 'meta property="og:description"', "content", a.desc);
  h = setMeta(h, 'meta name="twitter:description"', "content", a.desc);
  h = setMeta(h, 'meta property="og:title"', "content", escAttr(a.ttag));
  h = setMeta(h, 'meta name="twitter:title"', "content", escAttr(a.ttag));
  h = setMeta(h, 'link rel="canonical"', "href", a.canon);
  h = setMeta(h, 'meta property="og:url"', "content", a.canon);
  // page regions
  for (const k of ["crumb", "kicker", "title", "byline"]) h = setInner(h, k, a[k]);
  if (h.includes('data-art="img"')) {
    h = setOpenAttr(h, "img", "src", a.img);
    h = setOpenAttr(h, "img", "alt", a.alt);
  }
  h = setInner(h, "body", a.body);
  h = setOpenAttr(h, "body", "data-archive-id", a.id);
  h = setInner(h, "author", a.author);
  h = setOpenAttr(h, "authlink", "href", a.authhref);
  h = setInner(h, "authlink", a.authtext);
  h = setInner(h, "related", a.related);
  if (a.glance !== undefined && h.includes('data-art="glance"')) h = setInner(h, "glance", a.glance);
  h = setInner(h, "closeh", a.closeh);
  h = setInner(h, "closebtn", a.closebtn);
  // the archive only exists to swap entries by hash; each entry now has its own URL
  h = h.replace(/<script type="application\/json" id="kq-articles">[\s\S]*?<\/script>\s*/, "");
  return h;
}

// ---- 5. form endpoints -------------------------------------------------------
// Contact: the fields go to /api/contact and the export's own handler then opens
// the Thank-you page, exactly as designed.
// Newsletter: the export does nothing visible on submit, so the form is
// replaced by a one-line confirmation at the form's own height (no layout shift),
// in the footer's cream text with a gold check. If the request fails, a short
// note appears under the form and the form stays.
const FORM_HOOK = `<script>/* live form endpoints */
document.addEventListener('submit',function(e){
var f=e.target;if(!f||!f.getAttribute)return;var k=f.getAttribute('data-kq-form');
if(f.checkValidity&&!f.checkValidity())return;
if(k==='contact'){try{navigator.sendBeacon('/api/contact',new FormData(f));}catch(_){}return;}
if(k!=='newsletter')return;
e.preventDefault();e.stopImmediatePropagation();
var b=f.querySelector('button[type="submit"],button:not([type])');if(b)b.disabled=true;
var old=f.parentNode.querySelector('[data-kq-nl-error]');if(old)old.remove();
fetch('/api/subscribe',{method:'POST',body:new FormData(f)}).then(function(r){if(!r.ok)throw 0;
var p=document.createElement('p');p.setAttribute('role','status');
p.style.cssText='margin:6px 0 0;min-height:'+f.offsetHeight+'px;display:flex;align-items:center;gap:10px;font-size:16px;line-height:1.4;color:#F8F6F1';
p.innerHTML='<span aria-hidden="true" style="color:#DCBF85;font-size:18px">\\u2713</span><span>Thank you. The next briefing will come to your inbox.</span>';
f.replaceWith(p);
}).catch(function(){if(b)b.disabled=false;
var p=document.createElement('p');p.setAttribute('role','alert');p.setAttribute('data-kq-nl-error','');
p.style.cssText='margin:10px 0 0;font-size:14px;color:#F8F6F1';p.textContent='That didn\\u2019t go through. Please try again.';
f.insertAdjacentElement('afterend',p);});
},true);</script>`;

function finalize(html) {
  html = rewriteLinks(html);
  if (!html.includes("</body>")) throw new Error("no </body>");
  return html.replace(/<\/body>(?![\s\S]*<\/body>)/, FORM_HOOK + "</body>");
}

// ---- build ---------------------------------------------------------------------
fs.rmSync(OUT_PAGES, { recursive: true, force: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });
fs.mkdirSync(OUT_ASSETS, { recursive: true });

const routes = [];
const fileFor = (route) => (route === "/" ? "index" : route.slice(1).replace(/\//g, "--")) + ".html";
const emit = (route, html, source) => {
  if (routes.some((r) => r.route === route)) throw new Error(`duplicate route ${route}`);
  const file = fileFor(route);
  fs.writeFileSync(path.join(OUT_PAGES, file), finalize(html));
  routes.push({ route, file: `/_kq/${file}`, source });
};

for (const f of pages) {
  const html = read(path.join(SRC_PAGES, f));
  if (ARCHIVE_PAGES.includes(f)) {
    for (const [id, a] of Object.entries(archives[f])) {
      emit(archiveRoute(f, id), renderArchive(html, a), `${f}#${id}`);
    }
  } else {
    emit(pageRoute[f], html, f);
  }
}

// 404: the design has none, so it reuses the Thank-you page's layout and styles
// with only the words changed. Not a route; app/not-found.tsx renders it.
{
  let h = read(path.join(SRC_PAGES, "ThankYou.html"));
  const swap = (from, to) => {
    if (!h.includes(from)) throw new Error(`404 template: "${from.slice(0, 40)}" not found`);
    h = h.split(from).join(to); // every occurrence: the meta tags repeat the page text
  };
  swap(/<title>[\s\S]*?<\/title>/.exec(h)[0], "<title>Page not found | Kwontified</title>");
  h = h.replace(/<link rel="canonical"[^>]*>\s*/, "").replace(/<meta property="og:url"[^>]*>\s*/, "");
  swap('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">');
  swap('aria-label="Confirmation"', 'aria-label="Page not found"');
  swap(">Thank you.</h1>", ">Page not found.</h1>");
  swap(
    "Your request has reached us. A member of our team will read it and reply within one business day to suggest times for a discovery call.",
    "The page you were looking for has moved or no longer exists.",
  );
  swap(
    "On the call we ask about your channels, your goals and your constraints. Afterwards we send a short written note on where we see the growth and what it would take. Nothing more is needed from you now.",
    "Use Search in the menu to find a page, or start from our work or the homepage.",
  );
  swap("If something changes before we speak, write to ", "If a link brought you here, let us know at ");
  fs.writeFileSync(path.join(OUT_PAGES, "404.html"), finalize(h));
}

let copied = 0;
for (const a of fs.readdirSync(SRC_ASSETS)) {
  const dst = path.join(OUT_ASSETS, a);
  const src = path.join(SRC_ASSETS, a);
  if (!fs.existsSync(dst) || fs.statSync(dst).size !== fs.statSync(src).size) {
    fs.copyFileSync(src, dst);
    copied++;
  }
}

routes.sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(path.join(ROOT, "site-routes.json"), JSON.stringify(routes, null, 2) + "\n");

// llms.txt: a plain index of the site for AI answer engines, taken from each
// page's own title and description
{
  const unescape = (s) =>
    s.replace(/&rsquo;|&#x27;|&#39;/g, "’").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const groups = [
    ["Capabilities", (r) => r.startsWith("/capabilities")],
    ["Channels", (r) => r.startsWith("/channels")],
    ["Work", (r) => r.startsWith("/work")],
    ["Articles", (r) => /^\/perspectives\/(?!news\/|press-releases\/)./.test(r)],
    ["News", (r) => r.startsWith("/perspectives/news/")],
    ["Press releases", (r) => r.startsWith("/perspectives/press-releases/")],
    ["Company", (r) => /^\/(about|why-kwontified|perspectives$|contact$|privacy|terms)/.test(r)],
  ];
  const home = read(path.join(OUT_PAGES, "index.html"));
  const homeDesc = unescape(home.match(/<meta name="description" content="([^"]*)"/)[1]);
  let out = `# Kwontified\n\n> ${homeDesc}\n\nKwontified LLC. Offices: Atlanta (headquarters), New York, Seattle. Contact: contact@kwontified.com, 404.873.9148.\n`;
  for (const [name, test] of groups) {
    const items = routes.filter((r) => r.route !== "/" && test(r.route));
    if (!items.length) continue;
    out += `\n## ${name}\n`;
    for (const r of items) {
      const h = read(path.join(ROOT, "public", r.file));
      const title = unescape(h.match(/<title>([\s\S]*?)<\/title>/)[1]).replace(/\s*\|\s*Kwontified$/, "");
      const desc = unescape(h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
      out += `- [${title}](https://kwontified.com${r.route})${desc ? `: ${desc}` : ""}\n`;
    }
  }
  fs.writeFileSync(path.join(ROOT, "public/llms.txt"), out);
}

// ---- checks ----------------------------------------------------------------------
const problems = [];
if (unknownLinks.size) problems.push(`unmapped .html links: ${[...unknownLinks].join(", ")}`);
const known = new Set(routes.map((r) => r.route));
const assetSet = new Set(fs.readdirSync(OUT_ASSETS));
for (const r of routes) {
  const h = read(path.join(ROOT, "public", r.file));
  for (const m of h.matchAll(/["'(]\/assets\/([^"')\s]+)/g)) if (!assetSet.has(m[1])) problems.push(`${r.route}: missing asset ${m[1]}`);
  for (const m of h.matchAll(/href=\\?"(\/[a-z0-9\-/]*)(#[^"\\]*)?\\?"/g)) {
    if (m[1].startsWith("/assets/") || m[1].startsWith("/api/")) continue;
    if (!known.has(m[1])) problems.push(`${r.route}: link to unknown route ${m[1]}`);
  }
  if (/[^/]assets\/[0-9a-f]{12}\./.test(h.replace(/\/assets\//g, ""))) problems.push(`${r.route}: unrewritten asset path`);
}
const uniq = [...new Set(problems)];
console.log(`pages: ${routes.length} (${pages.length} exports, ${Object.values(archives).reduce((n, a) => n + Object.keys(a).length, 0)} archive entries) · assets copied: ${copied}/${assetSet.size}`);
if (uniq.length) {
  console.error(uniq.slice(0, 40).join("\n"));
  process.exit(1);
}
