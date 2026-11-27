// Navigation improvements from the navigation review of 2026-11-27. Runs after
// site-perspectives.mjs and before site-effects.mjs, on every built page.
//
//   1. Header menus: Capabilities, Channels, Work and About each open a panel listing their
//      pages (the label is still a link to the section; a small arrow button opens the panel,
//      and it opens on hover with a mouse). Before this the 21 pages below those four were
//      reachable only from the section page or the footer.
//   2. The full header shows from 1180px wide (it collapsed to "Menu" below 1340px, so a
//      1280px laptop got the phone menu).
//   3. Phone and tablet menu: each section can be expanded to its pages; the panel scrolls
//      when it is taller than the screen (the last items were cut off on small phones); it
//      closes on Escape and on a tap outside.
//   4. Site search also finds the Perspectives archive: the titles load from a separate file
//      the first time search is opened. "/" opens search, like Ctrl or Cmd + K.
//   5. Capability and channel pages end with previous / next links to their sibling pages.
//   6. The Perspectives and Work lists remember their page when the visitor comes back with
//      the Back button and the browser has not kept the page in memory.
//   7. Small things: search hands a query to /perspectives?q=term (read by
//      site-perspectives-ux.mjs); the footer
//      lists the creative gallery; the header button is marked as the current page on /contact.
//
// One list (NAV, below) feeds the header panels, the phone menu and the previous / next
// links, so they cannot drift apart. The build fails if a page in that list is not a route,
// if a header does not have the shape this step expects, or if the search script changes.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { throw new Error("site-nav: " + m); };
const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => r.route));

// ---------------------------------------------------------------- the one list
const NAV = [
  { href: "/capabilities", label: "Capabilities", id: "cap", one: "capability", all: "All capabilities", items: [
    ["/capabilities/retail-media", "Retail Media and Advertising"],
    ["/capabilities/creative-studio", "Creative Studio"],
    ["/capabilities/marketplace-operations", "Marketplace Operations"],
    ["/capabilities/analytics-forecasting", "Analytics and Forecasting"],
    ["/capabilities/agentic-commerce", "Agentic Commerce"],
    ["/capabilities/revenue-recovery", "Revenue Recovery"],
  ] },
  { href: "/channels", label: "Channels", id: "ch", one: "channel", all: "All channels", cols: 2, items: [
    ["/channels/amazon", "Amazon"],
    ["/channels/amazon/brand-programs", "Amazon brand programs"],
    ["/channels/walmart", "Walmart"],
    ["/channels/target-plus", "Target Plus"],
    ["/channels/temu", "Temu"],
    ["/channels/international", "International"],
    ["/channels/zalando", "Zalando"],
    ["/channels/mercado-libre", "Mercado Libre"],
    ["/channels/tiktok-shop", "TikTok Shop"],
    ["/channels/instagram-shop", "Instagram Shop"],
  ] },
  { href: "/work", label: "Work", id: "work", items: [
    ["/work", "Case studies"],
    ["/work/creative", "Creative gallery"],
  ] },
  { href: "/about", label: "About", id: "about", items: [
    ["/about", "About Kwontified"],
    ["/about/leadership", "Leadership"],
    ["/about/careers", "Careers"],
  ] },
];
for (const g of NAV) for (const [h] of [[g.href], ...g.items]) if (!routes.has(h)) fail(`${h} is in the menu but is not a page`);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const CHEVRON = `<svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M1.5 3.5 5 7l3.5-3.5"/></svg>`;
const ARROW = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M2 8h11M9 4l4 4-4 4"/></svg>`;
const cur = (href, route) => (href === route ? ' aria-current="page"' : "");

// ---------------------------------------------------------------- styles
const EASE = "var(--ease-out,cubic-bezier(.22,1,.36,1))";
const CSS = `<style data-kq-nav>
/* header menus */
.kq-dd{position:relative;display:inline-flex;align-items:center;gap:0}
.kq-ddb{flex:none;width:24px;height:44px;margin:0 -6px 0 -1px;padding:0;border:0;background:none;color:#F8F6F1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.kq-dd>a[aria-current]+.kq-ddb{color:#DCBF85}
.kq-ddb svg{transition:transform 240ms ${EASE}}
.kq-dd.is-open>.kq-ddb svg{transform:rotate(180deg)}
.kq-dd>a:hover,.kq-ddb:hover{color:#DCBF85!important}
.kq-ddp{display:none;position:absolute;left:-18px;top:calc(100% + 6px);z-index:30;box-sizing:border-box;min-width:264px;padding:10px;background:#FDFCFA;color:#262524;border-radius:14px;corner-shape:squircle;box-shadow:0 16px 40px rgba(10,28,54,.22),0 2px 6px rgba(10,28,54,.08);font-size:15px;line-height:1.3;text-align:left;transform-origin:top left}
.kq-ddp::before{content:"";position:absolute;left:0;right:0;top:-14px;height:14px}
.kq-ddp[data-cols="2"]{min-width:440px;grid-template-columns:1fr 1fr;column-gap:4px}
.kq-dd.is-open>.kq-ddp,html:not(.kq-nav-js) .kq-dd:hover>.kq-ddp,html:not(.kq-nav-js) .kq-dd:focus-within>.kq-ddp{display:grid}
.kq-head .kq-ddp a,.kq-hh .kq-ddp a,.kq-hh.is-stuck .kq-ddp a{display:block;padding:11px 14px!important;border-radius:10px;color:#262524!important;text-decoration:none;white-space:nowrap;transition:background-color 180ms ease,color 180ms ease}
.kq-head .kq-ddp a:hover,.kq-hh .kq-ddp a:hover,.kq-hh.is-stuck .kq-ddp a:hover{background:#E1E9F1;color:#102A4C!important}
.kq-head .kq-ddp a[aria-current],.kq-hh .kq-ddp a[aria-current]{color:#102A4C!important;font-weight:500;background:#F1F4F8}
.kq-head .kq-ddp a.kq-dd-all,.kq-hh .kq-ddp a.kq-dd-all,.kq-hh.is-stuck .kq-ddp a.kq-dd-all{grid-column:1/-1;margin-top:6px;padding-top:14px!important;border-top:1px solid #E3E8ED;border-radius:0 0 10px 10px;color:#102A4C!important;display:flex;align-items:center;gap:8px}
.kq-ddp :focus-visible{outline:3px solid #00618D!important;outline-offset:-2px}
/* the full header from 1180px (it collapsed to "Menu" below 1340px) */
@media (min-width:1180px) and (max-width:1339px){
.kq-head .kq-links>:not(.kq-btn){display:inline-flex!important;align-items:center}
.kq-head .kq-navd{display:none!important}
.kq-head .kq-links{margin-left:0;flex-wrap:nowrap!important;gap:8px 16px!important}
.kq-head .kq-links>a,.kq-head .kq-dd>a{white-space:nowrap}
.kq-hh nav[aria-label="Primary"]{display:flex!important;flex-wrap:nowrap!important}
.kq-hh .kq-menu{display:none!important}
.kq-hh .kq-hact{margin-left:0;order:0;flex-wrap:nowrap!important}
.kq-hh .kq-hact>:not([href="/contact"]){display:inline-flex!important;align-items:center;white-space:nowrap}
.kq-hh nav[aria-label="Primary"] a,.kq-hh .kq-hact>a{white-space:nowrap}
}
@media (min-width:1180px) and (max-width:1279px){
.kq-head .kq-links>[data-cmdk],.kq-hh .kq-hact>[data-cmdk]{font-size:0!important;gap:0!important;min-width:24px;justify-content:center}
.kq-hh>div{padding-left:40px!important;padding-right:40px!important}
}
@media (max-width:1179px){.kq-dd{display:none!important}}
/* phone and tablet menu: sections expand to their pages; the panel scrolls when it is tall */
.kq-navpanel,.kq-menu[open]>div{box-sizing:border-box;min-width:288px!important;max-width:calc(100vw - 24px);max-height:calc(100vh - 84px);max-height:calc(100dvh - 84px);overflow-y:auto;overscroll-behavior:contain}
.kq-mrow{display:flex;align-items:center;justify-content:space-between;align-self:stretch;gap:8px}
.kq-mrow>a{flex:1 1 auto;display:block;padding:10px 0;font-size:18px;text-decoration:none}
.kq-mx{flex:none;width:44px;height:44px;margin-right:-10px;padding:0;border:0;border-radius:50%;background:none;color:#262524!important;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.kq-mx svg{width:12px;height:12px;transition:transform 240ms ${EASE}}
.kq-mx[aria-expanded="true"] svg{transform:rotate(180deg)}
.kq-mx:hover{background:#E1E9F1}
.kq-msub{display:flex;flex-direction:column;align-self:stretch;margin:0 0 8px 2px;padding:0 0 0 14px;border-left:1px solid #D3D9DF}
.kq-msub[hidden]{display:none}
.kq-navpanel .kq-msub>a,.kq-menu .kq-msub>a{display:block;padding:9px 0!important;font-size:16px!important;color:#262524!important;text-decoration:none;min-height:0}
.kq-navpanel .kq-msub>a[aria-current],.kq-menu .kq-msub>a[aria-current]{color:#102A4C!important;font-weight:500}
.kq-hh.is-stuck .kq-menu>div .kq-mx{color:#262524!important}
/* previous / next between sibling pages */
.kq-sib{background:#FDFCFA;border-top:1px solid #E3E8ED;padding:0 clamp(20px,4.4vw,64px)}
.kq-sib>div{max-width:1312px;margin:0 auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:stretch;gap:0 32px}
.kq-sib a{color:#262524;text-decoration:none}
.kq-sib-a{display:flex;flex-direction:column;gap:6px;padding:36px 0;min-width:0;transition:color 180ms ease}
.kq-sib-a>span{font-size:15px;color:#626366}
.kq-sib-a>strong{font-size:clamp(18px,1.6vw,22px);line-height:1.25;font-weight:500;color:#102A4C;display:inline-flex;align-items:center;gap:10px}
.kq-sib-a svg{flex:none;transition:transform 240ms ${EASE}}
.kq-sib-prev{align-items:flex-start!important;text-align:left}
.kq-sib-prev svg{transform:rotate(180deg)}
.kq-sib-next{text-align:right;align-items:flex-end!important}
.kq-sib-all{align-self:center;font-size:15px;color:#102A4C!important;text-decoration:underline!important;text-underline-offset:4px;text-decoration-thickness:1px;padding:12px 0;white-space:nowrap}
.kq-sib :focus-visible{outline:3px solid #00618D;outline-offset:4px}
.kq-sib-art .kq-sib-a>strong{font-size:clamp(17px,1.35vw,20px);max-width:24em}
.kq-sib-art .kq-sib-next>strong{text-align:right}
@media (hover:hover){
.kq-sib-a:hover>strong{color:#00618D}
.kq-sib-next:hover svg{transform:translateX(4px)}
.kq-sib-prev:hover svg{transform:rotate(180deg) translateX(4px)}
.kq-sib-all:hover{color:#00618D!important}
}
@media (max-width:700px){
.kq-sib>div{grid-template-columns:1fr 1fr;gap:0 20px}
.kq-sib-all{grid-column:1/-1;grid-row:2;justify-self:center;padding:0 0 28px}
.kq-sib-a{padding:28px 0 20px}
}
/* search: the row that hands a query on to the Perspectives archive */
.kq-cmdk .kq-cmdk-more{display:none;padding:12px 18px;border-top:1px solid #E3E8ED;font-size:15px;color:#102A4C;text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}
.kq-cmdk .kq-cmdk-more.is-on{display:block}
@media screen and (prefers-reduced-motion:no-preference){
.kq-dd.is-open>.kq-ddp{animation:kq-dd-in 200ms ${EASE}}
@keyframes kq-dd-in{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
}
@media (prefers-reduced-motion:reduce){.kq-ddb svg,.kq-mx svg,.kq-sib-a svg{transition:none}.kq-sib-next:hover svg{transform:none}.kq-sib-prev:hover svg{transform:rotate(180deg)}}
@media print{.kq-sib,.kq-ddp,.kq-ddb{display:none!important}}
</style>`;

// ---------------------------------------------------------------- script
const JS = `/* Kwontified: navigation (see scripts/site-nav.mjs) */
(function(){'use strict';
var d=document,w=window,html=d.documentElement;html.classList.add('kq-nav-js');
/* words shown to the visitor; a translated page supplies its own in window.kqT */
function T(s){return (w.kqT&&w.kqT[s])||s;}

/* header menus: open on hover (mouse), on the arrow button, and with the keyboard */
(function(){var dds=[].slice.call(d.querySelectorAll('.kq-dd')),openDd=null,tIn=0,tOut=0;if(!dds.length)return;
function set(dd,on){if(on&&openDd&&openDd!==dd)set(openDd,false);dd.classList.toggle('is-open',on);
dd.querySelector('.kq-ddb').setAttribute('aria-expanded',on?'true':'false');if(on)openDd=dd;else if(openDd===dd)openDd=null;}
dds.forEach(function(dd){var b=dd.querySelector('.kq-ddb'),p=dd.querySelector('.kq-ddp');
dd.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse')return;clearTimeout(tOut);clearTimeout(tIn);tIn=setTimeout(function(){set(dd,true);},90);});
dd.addEventListener('pointerleave',function(e){if(e.pointerType!=='mouse')return;clearTimeout(tIn);tOut=setTimeout(function(){set(dd,false);},220);});
b.addEventListener('click',function(){clearTimeout(tIn);clearTimeout(tOut);set(dd,!dd.classList.contains('is-open'));});
dd.addEventListener('keydown',function(e){var links=[].slice.call(p.querySelectorAll('a')),i=links.indexOf(d.activeElement);
if(e.key==='Escape'&&dd.classList.contains('is-open')){e.stopPropagation();set(dd,false);b.focus();}
else if(e.key==='ArrowDown'){e.preventDefault();if(!dd.classList.contains('is-open'))set(dd,true);(links[i+1]||links[0]).focus();}
else if(e.key==='ArrowUp'&&i>=0){e.preventDefault();(links[i-1]||b).focus();}});
dd.addEventListener('focusout',function(e){if(!e.relatedTarget||!dd.contains(e.relatedTarget))set(dd,false);});});
d.addEventListener('pointerdown',function(e){if(openDd&&!openDd.contains(e.target))set(openDd,false);});
})();

/* phone and tablet menu: sections expand; Escape or a tap outside closes it */
(function(){var det=d.querySelector('header details');if(!det)return;var sum=det.querySelector('summary');
[].slice.call(det.querySelectorAll('.kq-mx')).forEach(function(b){var sub=d.getElementById(b.getAttribute('aria-controls'));if(!sub)return;
b.addEventListener('click',function(e){e.preventDefault();var on=sub.hidden;sub.hidden=!on;b.setAttribute('aria-expanded',on?'true':'false');});});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&det.open){det.open=false;sum.focus();}});
d.addEventListener('pointerdown',function(e){if(det.open&&!det.contains(e.target))det.open=false;});
})();

/* search: "/" opens it; the Perspectives archive joins the results the first time it is opened */
(function(){var dlg=d.getElementById('kq-cmdk');if(!dlg)return;var input=dlg.querySelector('input'),opener=d.querySelector('[data-cmdk]'),more=dlg.querySelector('.kq-cmdk-more'),got=0;
d.addEventListener('keydown',function(e){if(e.key!=='/'||e.metaKey||e.ctrlKey||e.altKey||dlg.open)return;var t=e.target;
if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;if(opener){e.preventDefault();opener.click();}});
function hint(){if(!more)return;var q=input.value.trim();more.classList.toggle('is-on',q.length>1);more.href='/perspectives?q='+encodeURIComponent(q);more.textContent=T('Search Perspectives for')+' \\u201c'+q+'\\u201d';}
input.addEventListener('input',hint);
function load(){if(got||!w.kqSearch||!dlg.getAttribute('data-kq-articles'))return;got=1;
fetch(dlg.getAttribute('data-kq-articles')).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(rows){
var G=[T('Article'),T('News'),T('Press release')];rows.forEach(function(r){w.kqSearch.push({t:r[0],g:G[r[2]]||G[0],h:r[1],k:''});});
if(dlg.open&&input.value)input.dispatchEvent(new Event('input',{bubbles:true}));}).catch(function(){got=0;});}
if('MutationObserver' in w)new MutationObserver(function(){if(dlg.open){load();hint();}}).observe(dlg,{attributes:true,attributeFilter:['open']});
})();

/* lists with a pager: come back to the same page with the Back button when the browser has not kept the page in memory */
(function(){var grids=[].slice.call(d.querySelectorAll('[data-pg-size][id]'));if(!grids.length)return;var KEY='kq-pg:'+location.pathname;
function ctl(g){return d.querySelector('[data-pg-for="'+g.id+'"]');}
function page(g){var c=ctl(g),n=c&&c.querySelector('[data-pg-count]'),m=n&&/^(\\d+)/.exec(n.textContent),size=+g.getAttribute('data-pg-size')||9;return m?Math.round((+m[1]-1)/size):0;}
function save(){var o={};grids.forEach(function(g){var p=page(g);if(p>0)o[g.id]=p;});try{sessionStorage.setItem(KEY,JSON.stringify(o));}catch(_){}}
d.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-pg-prev],[data-pg-next]'))setTimeout(save,60);});
d.addEventListener('input',function(){setTimeout(save,400);});d.addEventListener('change',function(){setTimeout(save,400);});
var nav=w.performance&&performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(!nav||nav.type!=='back_forward')return;
var want={};try{want=JSON.parse(sessionStorage.getItem(KEY)||'{}');}catch(_){}
if(!Object.keys(want).length)return;
function apply(){grids.forEach(function(g){var n=want[g.id]|0,c=ctl(g),x=c&&c.querySelector('[data-pg-next]');if(!n||!x||page(g)!==0)return;
var keep=g.scrollIntoView;g.scrollIntoView=function(){};for(var i=0;i<n&&!x.disabled;i++)x.click();g.scrollIntoView=keep;});}
w.addEventListener('load',function(){var main=d.querySelector('main[data-kq-more]');
/* the browser puts the visitor's search and filter choices back in the fields; apply them before turning the pages */
var f=d.querySelector('form[aria-label="Search Perspectives"]');
if(f&&[].some.call(f.elements,function(el){return el.tagName==='SELECT'?el.selectedIndex>0:(el.type==='search'||el.type==='text')&&!!el.value;}))f.dispatchEvent(new Event('change',{bubbles:true}));
if(!main){apply();return;}
/* the rest of the archive has to be in the page first; ask for it the way a visitor's first touch does */
new MutationObserver(function(rs,o){if(!main.hasAttribute('data-kq-more')){o.disconnect();setTimeout(apply,0);}}).observe(main,{attributes:true,attributeFilter:['data-kq-more']});
var c=d.querySelector('[data-pg-for]');if(c)c.dispatchEvent(new Event('pointerdown',{bubbles:true}));});
})();
})();
`;

// ---------------------------------------------------------------- search file: the archive's titles
function searchFile() {
  const index = fs.readFileSync(path.join(DIR, "perspectives.html"), "utf8");
  const moreName = (index.match(/data-kq-more="\/assets\/([^"]+)"/) || [])[1];
  if (!moreName) fail("the Perspectives index has no data-kq-more; run site-perspectives.mjs first");
  const more = JSON.parse(fs.readFileSync(path.join(ASSETS, moreName), "utf8"));
  const items = [...index.matchAll(/<(article|li)\b[^>]*data-date="[^"]*"[\s\S]*?<\/\1>/g)].map((m) => m[0]).concat(...Object.values(more));
  const text = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "’").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  const seen = new Set(), rows = [];
  for (const it of items) {
    const href = (it.match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*href="([^"]+)"/) || it.match(/<a\b[^>]*href="(\/perspectives\/[^"]+)"[^>]*class="[^"]*\bkq-sl\b/) || [])[1];
    const title = text((it.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/) || it.match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*>([\s\S]*?)<\/a>/) || [])[1] || "");
    const date = (it.match(/data-date="([^"]*)"/) || [])[1] || "";
    if (!href || !title || seen.has(href)) continue;
    if (!routes.has(href)) fail(`search file: ${href} is on the Perspectives index but is not a page`);
    seen.add(href);
    rows.push([title, href, /^\/perspectives\/news\//.test(href) ? 1 : /^\/perspectives\/press-releases\//.test(href) ? 2 : 0, date]);
  }
  if (rows.length < 1000) fail(`search file: expected the whole archive, found ${rows.length} items`);
  rows.sort((a, b) => (a[3] < b[3] ? 1 : a[3] > b[3] ? -1 : 0));
  const json = JSON.stringify(rows.map(([t, h, k]) => [t, h, k]));
  const name = `kq-search-${crypto.createHash("sha256").update(json).digest("hex").slice(0, 12)}.json`;
  for (const f of fs.readdirSync(ASSETS)) if (/^kq-search-[0-9a-f]{12}\.json$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));
  fs.writeFileSync(path.join(ASSETS, name), json);
  return { name, count: rows.length, kb: Math.round(json.length / 1024) };
}

// ---------------------------------------------------------------- header markup
function panel(g, route) {
  const links = g.items.map(([h, l]) => `<a href="${h}"${cur(h, route)}>${esc(l)}</a>`).join("");
  const all = g.all ? `<a class="kq-dd-all" href="${g.href}"${cur(g.href, route)}>${esc(g.all)} ${ARROW}</a>` : "";
  return `<div class="kq-ddp" id="kq-dd-${g.id}"${g.cols ? ` data-cols="${g.cols}"` : ""}>${links}${all}</div>`;
}
// the label link, the arrow button and the panel, in place of the label link alone
function desktop(part, route, where) {
  for (const g of NAV) {
    const re = new RegExp(`<a href="${g.href}"([^>]*)>${g.label}</a>`, "g");
    if ((part.match(re) || []).length !== 1) fail(`${where}: expected one "${g.label}" link in the header menu`);
    part = part.replace(re, (a) => `<span class="kq-dd">${a}<button type="button" class="kq-ddb" aria-expanded="false" aria-controls="kq-dd-${g.id}" aria-label="${g.label}: show pages">${CHEVRON}</button>${panel(g, route)}</span>`);
  }
  return part;
}
// the same list inside the phone and tablet menu, as sections that expand
function mobile(part, route, where) {
  for (const g of NAV) {
    const re = new RegExp(`<a href="${g.href}"([^>]*)>${g.label}</a>`, "g");
    if ((part.match(re) || []).length !== 1) fail(`${where}: expected one "${g.label}" link in the phone menu`);
    const here = g.items.some(([h]) => h === route) || route.startsWith(g.href + "/");
    const subs = g.items.filter(([h]) => h !== g.href).map(([h, l]) => `<a href="${h}"${cur(h, route)}>${esc(l)}</a>`).join("");
    part = part.replace(re, (a) => `<div class="kq-mrow">${a}<button type="button" class="kq-mx" aria-expanded="${here}" aria-controls="kq-m-${g.id}" aria-label="${g.label}: show pages">${CHEVRON}</button></div><div class="kq-msub" id="kq-m-${g.id}"${here ? "" : " hidden"}>${subs}</div>`);
  }
  return part;
}
function header(html, route, f) {
  const a = html.indexOf("<header"), b = html.indexOf("</header>", a);
  if (a < 0 || b < 0) fail(`${f}: no header`);
  let head = html.slice(a, b);
  const m = head.match(/<details class="kq-(navd|menu)"[\s\S]*?<\/details>/);
  if (!m) fail(`${f}: the header has no phone menu`);
  const menu = m[0], rest = head.replace(menu, "\u0000");
  if (rest.split("\u0000").length !== 2) fail(`${f}: expected one phone menu`);
  head = desktop(rest, route, f).replace("\u0000", () => mobile(menu, route, f));
  // the header button is the current page on the contact page
  if (route === "/contact") head = head.replace(/<a (class="kq-btn" )?href="\/contact"/g, (x) => x.replace("<a ", '<a aria-current="page" '));
  return html.slice(0, a) + head + html.slice(b);
}

// ---------------------------------------------------------------- previous / next on sibling pages
function siblings(html, route, f) {
  const g = NAV.find((x) => x.one && x.items.some(([h]) => h === route));
  if (!g) return html;
  const i = g.items.findIndex(([h]) => h === route), n = g.items.length;
  const prev = g.items[(i + n - 1) % n], next = g.items[(i + 1) % n];
  const strip = `<nav class="kq-sib" aria-label="More ${g.label.toLowerCase()}"><div>` +
    `<a class="kq-sib-a kq-sib-prev" href="${prev[0]}"><span>Previous ${g.one}</span><strong>${ARROW}${esc(prev[1])}</strong></a>` +
    `<a class="kq-sib-all" href="${g.href}">${esc(g.all)}</a>` +
    `<a class="kq-sib-a kq-sib-next" href="${next[0]}"><span>Next ${g.one}</span><strong>${esc(next[1])}${ARROW}</strong></a></div></nav>`;
  if ((html.match(/<section id="review"/g) || []).length !== 1) fail(`${f}: expected one closing section (id="review") to place the previous / next links before`);
  return html.replace('<section id="review"', () => strip + '<section id="review"');
}

// ---------------------------------------------------------------- every page
const search = searchFile();
const jsName = `kq-nav-${crypto.createHash("sha256").update(JS).digest("hex").slice(0, 12)}.js`;
for (const f of fs.readdirSync(ASSETS)) if (/^kq-nav-[0-9a-f]{12}\.js$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));
fs.writeFileSync(path.join(ASSETS, jsName), JS);

const fileRoute = new Map(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => [path.basename(r.file), r.route]));
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
const PLAIN = new Set(["client-sign-in.html"]);
let sib = 0;
for (const f of files) {
  const file = path.join(DIR, f);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("data-kq-nav")) fail(`${f}: already applied; run the whole build`);
  const route = fileRoute.get(f) || (f === "404.html" ? "/404" : f === "403.html" ? "/403" : fail(`${f}: not in site-routes.json`));
  // the client sign-in page has its own plain header (logo and a way back), by design
  const plain = PLAIN.has(f);
  if (!plain) html = header(html, route, f);
  const before = html.length;
  html = siblings(html, route, f);
  if (html.length !== before) sib++;
  // footer: the creative gallery sits under Work
  const fa = html.indexOf("<footer"), fb = html.indexOf("</footer>", fa);
  if (fa < 0) fail(`${f}: no footer`);
  let foot = html.slice(fa, fb);
  const work = /(<a href="\/work" style="([^"]*)">Work<\/a>)/;
  if ((foot.match(new RegExp(work.source, "g")) || []).length !== 1) fail(`${f}: expected one Work link in the footer`);
  foot = foot.replace(work, (_, a, st) => `${a}<a href="/work/creative" style="${st}">Creative gallery</a>`);
  html = html.slice(0, fa) + foot + html.slice(fb);
  // search: let the shared script add the archive to the list the page's own search uses
  const hook = "var data=JSON.parse(d.getElementById('kq-cmdk-data').textContent)";
  if (html.split(hook).length !== 2) fail(`${f}: the site search script changed, cannot find its list`);
  html = html.replace(hook, () => "var data=window.kqSearch=JSON.parse(d.getElementById('kq-cmdk-data').textContent)");
  const was = "Search pages, case studies and dashboards";
  if (html.split(was).length !== 3) fail(`${f}: expected the search prompt twice`);
  html = html.split(was).join("Search pages, case studies and articles");
  html = html.replace(/<dialog class="kq-cmdk" id="kq-cmdk"/, (x) => `${x} data-kq-articles="/assets/${search.name}"`);
  const footRow = '<div class="kq-foot">';
  if (html.split(footRow).length !== 2) fail(`${f}: the search dialog changed shape`);
  html = html.replace(footRow, () => '<a class="kq-cmdk-more" href="/perspectives"></a>' + footRow);
  if (html.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
  html = html.replace("</head>", () => CSS + "</head>");
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => `<script defer src="/assets/${jsName}"></script></body>`);
  fs.writeFileSync(file, html);
}
if (sib !== 16) fail(`expected previous / next links on 16 capability and channel pages, placed ${sib}`);
console.log(`site-nav: ${files.length} pages (header menus for ${NAV.length} sections, full header from 1180px, phone menu sections, search with ${search.count} archive titles in /assets/${search.name}, ${search.kb} KB); previous / next on ${sib} pages; script /assets/${jsName} (${(JS.length / 1024).toFixed(1)} KB)`);
