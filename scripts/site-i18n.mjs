// Translated pages. The last step of the site build.
//
// For every language in site-i18n/config.json and every page that has a translation file
// (site-i18n/<language>/pages/<page>.json), this writes a translated copy of the finished
// English page to public/_kq/<language>--<page>.html, served at /<language>/<the same address>.
// The copy is the English page with its words replaced: layout, pictures, menus, search and
// forms are the same code, so a change to the site reaches every language on the next build.
//
// What a translated page gets besides its words:
//   - <html lang>, its own canonical address, and hreflang links to the other languages;
//   - links that stay in the visitor's language where the target page is translated, and go
//     to the English page where it is not;
//   - a language menu in the footer, in the phone menu and (on wide screens) in the header;
//   - structured data in that language (headline, description, inLanguage, address);
//   - on the Perspectives index: only the items that exist in that language, and only the tabs
//     and filter choices that lead to them; the pager's "1–9 of 12" in that language;
//   - language links that keep the visitor's filter (?…) and section (#…);
//   - the share image's alt text in that language;
//   - title and description lengths checked like the English pages (" | Kwontified" dropped past
//     60 characters; titles 30-60, descriptions 70-160), so a long translation stops the build.
//
// A language marked "live": false in the config is a PREVIEW: its pages are built and can be
// opened, but they carry noindex, are left out of the sitemap, and the English pages do not
// link to them. Set "live": true when the translations have been reviewed.
//
// Entries that have no translation yet stay in English. The build fails if a translation has
// lost a placeholder, a figure or a protected name (the same checks as `i18n.mjs check`).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { read, write, segments, apply, problems, memory, config, siteRoutes, leaveFor, key, tagHooks, hooks, runtimeStrings, DIR, ROOT, englishPages } from "./i18n-lib.mjs";

const fail = (m) => { throw new Error("site-i18n: " + m); };
const cfg = config();
const BASE = "https://kwontified.com";
const ASSETS = path.join(ROOT, "public/assets");
const routes = siteRoutes();
const fileOfRoute = new Map(routes.map((r) => [r.route, path.basename(r.file)]));
for (const l of cfg.languages) if (!/^[a-z]{2}(-[a-z]{2})?$/.test(l.code) || l.code === "en") fail(`language code "${l.code}" must be two letters (optionally a region, as in pt-br) and not "en"`);
for (const l of cfg.languages) if (l.tag && !/^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(l.tag)) fail(`language tag "${l.tag}" is not a valid language tag (examples: zh-Hans, pt-BR)`);
const out = (lang, file) => `${lang}--${file}`;
const loc = (lang, route) => `/${lang}${route === "/" ? "" : route}`;
const norm = (s) => s.replace(/\s+/g, " ").trim();

const GLOBE = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>`;
const CHEVRON = `<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M1.5 3.5 5 7l3.5-3.5"/></svg>`;
const CSS = `<style data-kq-i18n>
.kq-lang{display:inline-flex;align-items:center;gap:0 14px;color:#C9D4DF}
.kq-lang svg{flex:none}
.kq-lang a{color:#C9D4DF;padding:12px 0}
.kq-lang a[aria-current]{color:#F8F6F1;text-decoration:none;font-weight:500}
.kq-ddb.kq-ddb-lang{width:auto;min-width:44px;justify-content:center;margin:0;padding:0 2px;gap:6px;font:inherit;font-size:14px;letter-spacing:.04em}
.kq-dd-lang .kq-ddp{left:auto;right:-14px;min-width:190px;transform-origin:top right}
.kq-head .kq-links>.kq-dd.kq-dd-lang,.kq-hh .kq-hact>.kq-dd.kq-dd-lang{display:none!important}
@media (min-width:1280px){.kq-head .kq-links>.kq-dd.kq-dd-lang{display:inline-flex!important}}
@media (min-width:1536px){.kq-hh .kq-hact>.kq-dd.kq-dd-lang{display:inline-flex!important}}
.kq-mlang{display:flex;flex-wrap:wrap;align-items:center;gap:0 16px;align-self:stretch;margin:6px 0 2px;padding-top:10px;border-top:1px solid #E3E8ED;color:#626366}
.kq-navpanel .kq-mlang>a,.kq-menu .kq-mlang>a{display:inline-block;padding:9px 0!important;font-size:15px!important;color:#262524!important}
.kq-navpanel .kq-mlang>a[aria-current],.kq-menu .kq-mlang>a[aria-current]{color:#102A4C!important;font-weight:500;text-decoration:none}
.kq-lang-vh{position:absolute!important;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
</style>`;
// Switching language keeps the visitor's place: the filter in the address (?topic=…) and the
// section they were reading (#…). Read at the moment of the click, since filters change the address.
const KEEP_PLACE_JS = `<script>/* language links keep the query and the #section */
(function(){var M='.kq-lang,.kq-dd-lang,.kq-mlang',Q0=location.search,used=false;
/* runs in <head>, before the page's filter script may drop a filter this language's page does not
   offer (?topic=Operations): until the visitor changes something, the address they arrived with is kept */
['input','change'].forEach(function(t){document.addEventListener(t,function(e){if(e.isTrusted)used=true;},true);});
function fix(a){var base=a.getAttribute('href').split(/[?#]/)[0];a.setAttribute('href',base+(location.search||(used?'':Q0))+location.hash);}
function keep(e){var a=e.target&&e.target.closest&&e.target.closest('a[hreflang]');if(a&&a.closest(M))fix(a);}
/* on load and when the address changes, so the links are right before anyone reaches them */
function all(){[].forEach.call(document.querySelectorAll('a[hreflang]'),function(a){if(a.closest(M))fix(a);});}
['pointerdown','focusin','click'].forEach(function(t){document.addEventListener(t,keep,true);});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',all);else all();
window.addEventListener('popstate',all);window.addEventListener('hashchange',all);})();</script>`;

// The language menu, three times: header (wide screens), phone menu, footer.
// The header button shows the language code; its accessible name starts with that code
// (WCAG 2.5.3) and adds the language's name in a visually hidden span.
function switcher(html, here, versions) {
  if (versions.length < 2) return html;
  const cur = versions.find((v) => v.code === here);
  const links = (cls) => versions.map((v) => `<a${cls ? ` class="${cls}"` : ""} href="${v.href}" lang="${v.tag}" hreflang="${v.tag}"${v.code === here ? ' aria-current="true"' : ""}>${v.name}</a>`).join("");
  const word = here === "en" ? "Language" : cfg.languages.find((l) => l.code === here).language || fail(`site-i18n/config.json: give ${here} a "language" (the word for "Language")`);
  const head = `<span class="kq-dd kq-dd-lang"><button type="button" class="kq-ddb kq-ddb-lang" aria-expanded="false" aria-controls="kq-dd-lang">${here.toUpperCase()}<span class="kq-lang-vh"> (${word}: ${cur.name})</span>${CHEVRON}</button><div class="kq-ddp" id="kq-dd-lang">${links("")}</div></span>`;
  const a = html.indexOf("<header"), b = html.indexOf("</header>", a);
  let h = html.slice(a, b);
  const menu = h.match(/<details class="kq-(navd|menu)"[\s\S]*?<\/details>/);
  if (menu) {
    // phone menu: a row above the client sign-in link; header: before the same link
    const sign = /<a\b(?=[^>]*\shref="(?:\/[a-z-]{2,5})?\/client-sign-in")/;
    const m2 = menu[0].replace(sign, (x) => `<div class="kq-mlang">${GLOBE}${links("")}</div>` + x);
    h = h.replace(menu[0], "\u0000").replace(sign, (x) => head + x).replace("\u0000", () => m2);
  }
  html = html.slice(0, a) + h + html.slice(b);
  const cookie = '<button type="button" data-kq-ck-open="footer"';
  if (html.split(cookie).length === 2) html = html.replace(cookie, () => `<span class="kq-lang">${GLOBE}${links("")}</span> ` + cookie);
  if (html.split("</body>").length !== 2) fail("expected one </body>");
  return html.replace("</head>", () => CSS + "</head>").replace("</head>", () => KEEP_PLACE_JS + "</head>");
}
const hreflang = (versions, enHref) => versions.map((v) => `<link rel="alternate" hreflang="${v.tag}" href="${BASE}${v.href === "/" ? "" : v.href}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${BASE}${enHref === "/" ? "" : enHref}">`;

// The site's two shared scripts, with their hooks pointed at the English values kept on the page.
// One copy serves every language.
const neutralDone = new Set();
function neutral(name) {
  const out = `${name}.i18n.js`;
  if (!neutralDone.has(out)) { neutralDone.add(out); fs.writeFileSync(path.join(ASSETS, out), hooks(fs.readFileSync(path.join(ASSETS, name + ".js"), "utf8"))); }
  return out;
}
for (const f of fs.readdirSync(ASSETS)) if (/^kq-(fx|nav|px)-[0-9a-f]{12}\.i18n\.js$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));
const runtime = runtimeStrings();

// Words in another language are often longer. If the header no longer fits on one line, it
// tightens in steps and finally falls back to the Menu button, as it does on narrow screens.
const FIT_CSS = `<style data-kq-fit>
.kq-fit1 .kq-head .kq-links{gap:8px 14px!important}.kq-fit1 .kq-hh nav[aria-label="Primary"]{gap:0 14px!important}.kq-fit1 .kq-hh .kq-hact{gap:8px 12px!important}.kq-fit1 .kq-hh>div{gap:8px 16px!important}
.kq-fit2 .kq-head .kq-links>a[href="/client-sign-in"],.kq-fit2 .kq-hh .kq-hact>a[href="/client-sign-in"]{display:none!important}
.kq-fit3 .kq-head .kq-links>[data-cmdk],.kq-fit3 .kq-hh .kq-hact>[data-cmdk]{font-size:0!important;gap:0!important;min-width:24px;justify-content:center}
.kq-fit4 .kq-head .kq-links>:not(.kq-btn){display:none!important}.kq-fit4 .kq-head .kq-navd{display:block!important}.kq-fit4 .kq-head .kq-links{margin-left:auto}
.kq-fit4 .kq-hh nav[aria-label="Primary"]{display:none!important}.kq-fit4 .kq-hh .kq-hact>:not([href="/contact"]){display:none!important}.kq-fit4 .kq-hh .kq-hact{margin-left:auto;order:2}
.kq-fit4 .kq-hh .kq-menu{display:block!important;order:3;margin-left:0;position:relative}
.kq-head>nav,.kq-hh>div{flex-wrap:nowrap!important}.kq-head .kq-links,.kq-hh nav[aria-label="Primary"],.kq-hh .kq-hact{flex-wrap:nowrap!important;white-space:nowrap}
@media (max-width:600px){.kq-fit1 .kq-head.is-stuck .kq-links>.kq-btn,.kq-fit1 .kq-hh.is-stuck .kq-hact>a[href="/contact"]{padding:8px 10px!important;font-size:13px!important}.kq-fit2 .kq-head.is-stuck .kq-links,.kq-fit2 .kq-hh.is-stuck .kq-hact{display:none!important}}
</style>`;
// The Perspectives pager writes "1–9 of 12" and "No results" in English; on a translated page
// they are rewritten in the page's language (window.kqT, from the shared text in site-i18n/<lang>/_site.json).
const PAGER_JS = `<script>/* pager text in this language */
(function(){var T=window.kqT||{},R=T['{a}–{b} of {n}'],N=T['No results'];if(!R&&!N)return;
function fix(el){var s=el.textContent,m=/^([\\d.,]+)\\u2013([\\d.,]+) of ([\\d.,]+)$/.exec(s);
if(m&&R){var t=R.replace('{a}',m[1]).replace('{b}',m[2]).replace('{n}',m[3]);if(t!==s)el.textContent=t;}else if(s==='No results'&&N&&N!==s)el.textContent=N;}
var els=[].slice.call(document.querySelectorAll('[data-pg-count]'));if(!els.length||!window.MutationObserver)return;
var mo=new MutationObserver(function(list){list.forEach(function(r){var el=r.target.nodeType===1?r.target:r.target.parentNode;if(el&&el.hasAttribute&&el.hasAttribute('data-pg-count'))fix(el);});});
els.forEach(function(el){fix(el);mo.observe(el,{childList:true,characterData:true,subtree:true});});})();</script>`;
// a translated index may list only a few items; keep them card-sized
const FEW_CSS = `<style data-kq-few>#latest-grid{grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))!important}</style>`;
const FIT_JS = `<script>/* translated pages: keep the header on one line; tighten in steps, then use the Menu button */
(function(){var d=document,html=d.documentElement,head=d.querySelector('header'),row=head&&head.firstElementChild;if(!row)return;
var S=['kq-fit1','kq-fit2','kq-fit3','kq-fit4'];
function fits(){return row.scrollWidth<=row.clientWidth+1;}
function run(){S.forEach(function(c){html.classList.remove(c);});for(var i=0;i<S.length&&!fits();i++)html.classList.add(S[i]);}
run();addEventListener('resize',run);addEventListener('load',run);if(d.fonts&&d.fonts.ready)d.fonts.ready.then(run);
if('MutationObserver' in window){var was=head.classList.contains('is-stuck');new MutationObserver(function(){var now=head.classList.contains('is-stuck');if(now!==was){was=now;run();}}).observe(head,{attributes:true,attributeFilter:['class']});}})();</script>`;

// Korean, Chinese and Japanese: the site's typeface has no glyphs for them, so name the system
// faces to use (in the order Apple, Windows, Android / Linux), and undo the settings that only
// suit Latin type: tightened letter-spacing and very tight heading line-height.
const SCRIPT = {
  ko: { faces: "'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR','Noto Sans CJK KR'", wrap: "word-break:keep-all;overflow-wrap:anywhere" },
  zh: { faces: "'PingFang SC','Microsoft YaHei','Noto Sans SC','Noto Sans CJK SC','Hiragino Sans GB'", wrap: "line-break:strict" },
  ja: { faces: "'Hiragino Sans','Yu Gothic','Meiryo','Noto Sans JP','Noto Sans CJK JP'", wrap: "line-break:strict" },
};
function scriptCss(lang) {
  const s = SCRIPT[lang.slice(0, 2)];
  if (!s) return "";
  return `<style data-kq-script>
html,body,body *{font-family:'Neue Haas Grotesk Display Pro','Neue Haas Grotesk Text Pro','Helvetica Neue',Helvetica,Arial,${s.faces},sans-serif!important}
body{${s.wrap}}
h1,h2,h3,h4,blockquote,[style*="letter-spacing: -"],[style*="letter-spacing:-"]{letter-spacing:0!important}
h1,h2,h3{line-height:1.3!important}
article[data-art="body"] p,article[data-art="body"] li{line-height:1.8!important}
</style>`;
}

const built = [];           // every translated page: { lang, route, en, file, live }
const versionsOf = new Map(); // English route -> [{ code, name, href, live }]
let checked = 0;

for (const L of cfg.languages) {
  const lang = L.code, tag = L.tag || lang, mem = memory(lang);
  const pages = mem.files.filter((f) => f.json.route).map((f) => f.json.route);
  for (const r of pages) if (!fileOfRoute.has(r)) fail(`${lang}: ${r} has a translation file but is not a page any more`);
  const available = new Set(pages);
  // the same checks as `i18n.mjs check`, so a bad entry stops the build and not a visitor
  for (const f of mem.files) for (const s of f.json.segments) if (s.t) { checked++; const p = problems(s.src, s.t, cfg.keep); if (p.length) fail(`${path.relative(ROOT, f.file)} [${s.k}]: ${p[0]}\n   EN: ${s.src.slice(0, 160)}\n   ${lang.toUpperCase()}: ${s.t.slice(0, 160)}`); }
  const tr = (s) => mem.map.get(key(norm(s)));

  for (const route of pages) {
    const file = fileOfRoute.get(route);
    let html = fs.readFileSync(path.join(DIR, file), "utf8");
    let more = null;
    if (route === "/perspectives") {
      // the index lists only what exists in this language
      const keepItem = (it) => { const h = (it.match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*href="([^"#?]+)/) || it.match(/<a\b[^>]*href="(\/perspectives\/[^"#?]+)"[^>]*class="[^"]*\bkq-sl\b/) || [])[1]; return h && available.has(h); };
      html = html.replace(/<(article|li)\b[^>]*data-date="[^"]*"[\s\S]*?<\/\1>/g, (it) => (keepItem(it) ? it : ""));
      // the counts on the tabs and filters are the English archive's; a partly translated index shows none
      html = html.replace(/ data-n="\d+"/g, "");
      const name = (html.match(/data-kq-more="\/assets\/([^"]+)"/) || [])[1];
      if (name) { const j = JSON.parse(fs.readFileSync(path.join(ASSETS, name), "utf8")); more = {}; for (const [id, list] of Object.entries(j)) more[id] = list.filter(keepItem); }
      // a list with nothing in this language is not shown
      html = html.replace(/<section\b[^>]*data-ptype="[^"]*"[^>]*>[\s\S]*?<\/section>/g, (sec) => { const id = (sec.match(/id="(latest-grid|news-list)"/) || [])[1]; const extra = more && id ? more[id].length : 0; return /data-date="/.test(sec) || extra ? sec : sec.replace(/^<section\b/, '<section hidden="hidden"'); });
      // tabs and filter choices that would only lead to "no results" in this language are not offered
      const shownTypes = new Set([...html.matchAll(/<section\b(?![^>]*\shidden)[^>]*data-ptype="([^"]*)"/g)].map((m) => m[1]));
      const items = [html, ...(more ? Object.values(more).flat() : [])].join("\n");
      const vals = (a) => new Set([...items.matchAll(new RegExp(`<(?:article|li)\\b[^>]*\\s${a}="([^"]*)"`, "g"))].map((m) => m[1]));
      const dates = [...vals("data-date")], topics = vals("data-topic"), channels = vals("data-channel"), authors = vals("data-author");
      const offered = { "ps-ty": (v) => shownTypes.has(v), "ps-t": (v) => topics.has(v), "ps-c": (v) => channels.has(v), "ps-a": (v) => authors.has(v),
        "ps-m": (v) => dates.some((d) => d.startsWith(v + "-")), "ps-y": (v) => dates.some((d) => d.startsWith(v + "-")), "ps-mo": (v) => dates.some((d) => d.slice(5, 7) === v) };
      for (const [id, ok] of Object.entries(offered)) {
        const n = html.split(`<select id="${id}"`).length - 1;
        if (n !== 1) fail(`${file}: expected one <select id="${id}">, found ${n}`);
        html = html.replace(new RegExp(`(<select id="${id}"[^>]*>)([\\s\\S]*?)(</select>)`), (_, a, body, z) => {
          let first = true;
          // an option's value is its value attribute, or its text when it has none
          return a + body.replace(/<option\b([^>]*)>([\s\S]*?)<\/option>\s*/g, (opt, at, label) => { const v = (at.match(/\svalue="([^"]*)"/) || [null, label.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()])[1]; if (first) { first = false; return opt; } if (!v || ok(v)) return opt; return ""; }) + z;
        });
      }
      const tabs = html.split("data-kq-type=").length - 1;
      // a type with nothing on this page gets no tab (a tab that can only show "no results")
      html = html.replace(/<button\b[^>]*\sdata-kq-type="([^"]+)"[^>]*>[\s\S]*?<\/button>/g, (b, t) => (shownTypes.has(t) ? b : ""));
      if (!tabs) fail(`${file}: expected the type tabs (data-kq-type)`);
      html = html.replace("</head>", () => `<style>.kq-ptabs [hidden]{display:none!important}</style></head>`);
      // the pager's "1–9 of 12" and "No results", which the page's script writes in English
      html = html.replace("</body>", () => PAGER_JS + "</body>");
    }
    const tree = read(html);
    tagHooks(tree);
    const segs = segments(tree, { keep: cfg.keep, leave: leaveFor(available) });
    const res = apply(segs, (s) => mem.map.get(s.k));
    html = write(tree);

    if (more) {
      // the rest of the list, translated the same way, in its own file
      for (const id of Object.keys(more)) more[id] = more[id].map((card) => { const t = read(`<main>${card}</main>`); apply(segments(t, { keep: cfg.keep, leave: leaveFor(available) }), (s) => mem.map.get(s.k)); return write(t).slice(6, -7).replace(/href="(\/perspectives\/[^"#?]+)/g, (m, h) => (available.has(h) ? `href="${loc(lang, h)}` : m)); });
      const json = JSON.stringify(more), n = `perspectives-more-${lang}-${crypto.createHash("sha256").update(json).digest("hex").slice(0, 12)}.json`;
      for (const f of fs.readdirSync(ASSETS)) if (new RegExp(`^perspectives-more-${lang}-.*\\.json$`).test(f)) fs.unlinkSync(path.join(ASSETS, f));
      fs.writeFileSync(path.join(ASSETS, n), json);
      html = html.replace(/data-kq-more="\/assets\/[^"]+"/, `data-kq-more="/assets/${n}"`);
    }

    // language, address, links
    if (!/<html lang="en">/.test(html)) fail(`${file}: expected <html lang="en">`);
    html = html.replace('<html lang="en">', `<html lang="${tag}">`);
    const enUrl = BASE + (route === "/" ? "" : route), myUrl = BASE + loc(lang, route);
    html = html.replace(/(<link rel="canonical" href=")[^"]*/, (_, a) => a + myUrl).replace(/(<meta property="og:url" content=")[^"]*/, (_, a) => a + myUrl);
    html = html.replace(/(<a\b[^>]*\shref=")(\/[^"#?]*)/g, (m, a, h) => (available.has(h) ? a + loc(lang, h) : m));
    if (!L.live && !/<meta name="robots" content="noindex/.test(html)) html = html.replace(/<meta charset="utf-8">/, (x) => x + '\n<meta name="robots" content="noindex">');
    // structured data: the page's own address, its headline and description, and its language
    html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, a, body, z) => {
      let j; try { j = JSON.parse(body); } catch { return all; }
      (function walk(o) {
        if (Array.isArray(o)) return o.forEach(walk);
        if (!o || typeof o !== "object") return;
        const own = typeof o["@id"] === "string" && o["@id"].split("#")[0] === enUrl || o.url === enUrl;
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === "string") {
            if (v === enUrl || v.startsWith(enUrl + "#")) o[k] = myUrl + v.slice(enUrl.length);
            else if (/^(headline|name|description|text|alternativeHeadline)$/.test(k) && tr(v)) o[k] = tr(v).replace(/<\/?\d+\/?>/g, "");
          } else walk(v);
        }
        if (own && /^(BlogPosting|NewsArticle|Article|WebPage|CollectionPage|AboutPage|ContactPage)$/.test(String(o["@type"]))) o.inLanguage = tag;
      })(j);
      return a + JSON.stringify(j) + z;
    });
    // title and description lengths, as for the English pages: " | Kwontified" goes when the title
    // would pass 60 characters; a title must be 30-60 characters and a description 70-160
    // (shorten or lengthen the translation in site-i18n/<lang>/pages/<page>.json)
    const plain = (s) => s.replace(/&(amp|quot|apos|#39|lt|gt|rsquo|nbsp);/g, (m, e) => ({ amp: "&", quot: '"', apos: "'", "#39": "'", lt: "<", gt: ">", rsquo: "’", nbsp: " " })[e]);
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || fail(`${out(lang, file)}: no <title>`))[1];
    if (plain(title).length > 60 && title.endsWith(" | Kwontified")) html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title.slice(0, -" | Kwontified".length)}</title>`);
    const tLen = plain(html.match(/<title>([\s\S]*?)<\/title>/)[1]).length, desc = plain((html.match(/<meta name="description" content="([^"]*)"/) || ["", ""])[1]);
    if (tLen < 30 || tLen > 60) fail(`${out(lang, file)}: title is ${tLen} characters (30-60): ${plain(html.match(/<title>([\s\S]*?)<\/title>/)[1])}`);
    if (desc.length < 70 || desc.length > 160) fail(`${out(lang, file)}: meta description is ${desc.length} characters (70-160): ${desc}`);
    // styles and scripts find elements by the English label or address kept in data-kq-label / data-kq-href
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, hooks)
      .replace(/<script\b(?![^>]*\b(?:src=|type="application\/(?:ld\+)?json"|type="speculationrules"))[^>]*>[\s\S]*?<\/script>/g, hooks)
      .replace(/(<script defer src="\/assets\/)(kq-(?:fx|nav|px)-[0-9a-f]{12})\.js(")/g, (_, a, name, z) => a + neutral(name) + z);
    // the words the site's scripts show, in this language
    const dict = Object.fromEntries(runtime.map((str) => [str, mem.map.get(key(str))]).filter(([, t]) => t));
    html = html.replace("</head>", () => `<script>window.kqT=${JSON.stringify(dict).replace(/</g, "\\u003c")}</script>` + hooks(FIT_CSS) + FEW_CSS + scriptCss(lang) + "</head>");
    if (html.split("</header>").length !== 2) fail(`${file}: expected one header`);
    html = html.replace("</header>", () => "</header>" + FIT_JS);
    fs.writeFileSync(path.join(DIR, out(lang, file)), html);
    built.push({ lang, tag, route: loc(lang, route), en: route, file: "/_kq/" + out(lang, file), live: !!L.live, done: res.done, missing: res.missing });
    if (!versionsOf.has(route)) versionsOf.set(route, [{ code: "en", tag: "en", name: "English", href: route, live: true }]);
    versionsOf.get(route).push({ code: lang, tag, name: L.name, href: loc(lang, route), live: !!L.live });
  }
}

// second pass: now that every version of a page is known, add the language menu and hreflang
let english = 0;
for (const [route, all] of versionsOf) {
  const live = all.filter((v) => v.live);
  for (const v of all) {
    // a preview page shows every version (so a reviewer can switch); a live page shows live ones
    const show = v.live ? live : all.filter((x) => x.live || x.code === v.code);
    if (v.code === "en" && live.length < 2) continue; // English pages change only when a language is live
    const file = path.join(DIR, v.code === "en" ? fileOfRoute.get(route) : `${v.code}--${fileOfRoute.get(route)}`);
    let html = fs.readFileSync(file, "utf8");
    if (html.includes("data-kq-i18n")) fail(`${path.basename(file)}: already applied; run the whole build`);
    html = switcher(html, v.code, show);
    if (v.code === "en") { html = html.replace("</head>", () => FIT_CSS + "</head>"); if (html.split("</header>").length !== 2) fail(`${path.basename(file)}: expected one header`); html = html.replace("</header>", () => "</header>" + FIT_JS); }
    if (live.length > 1 && v.live) html = html.replace("</head>", () => hreflang(live, route) + "</head>");
    fs.writeFileSync(file, html);
    if (v.code === "en") english++;
  }
}

fs.writeFileSync(path.join(ROOT, "site-i18n-routes.json"), JSON.stringify(built.map(({ lang, tag, route, en, file, live }) => ({ lang, tag, route, en, file, live })), null, 1) + "\n");
if (englishPages().length < 1000) fail("the English pages are missing; run the whole build");
const by = {}; for (const b of built) (by[b.lang] ||= []).push(b);
console.log(`site-i18n: ${built.length} translated page${built.length === 1 ? "" : "s"}` + Object.entries(by).map(([l, p]) => ` | ${l}${cfg.languages.find((x) => x.code === l).live ? "" : " (preview)"}: ${p.length} pages, ${p.reduce((n, x) => n + x.done, 0)} entries translated, ${p.reduce((n, x) => n + x.missing, 0)} still in English`).join("") + ` | ${checked} translations checked | language menu added to ${english} English pages`);
