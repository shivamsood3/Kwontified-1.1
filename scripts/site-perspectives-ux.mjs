// Perspectives: reading time, better filters, and moving between pieces and types.
// Added after the Perspectives review of 2026-11-27. Runs before site-perspectives.mjs,
// while the index still holds every card, so the cards it moves to the "more" file carry
// the reading time too.
//
// On every article, news item and press release:
//   - articles get the "4-minute read." the news items already had in their byline
//     (same rule as the import: words / 220, at least 1), and their structured data gets
//     wordCount and timeRequired;
//   - the line above the headline ("Article. Event playbooks. Amazon") becomes links to that
//     type, topic and channel on the index, and "News" / "Press releases" in the breadcrumb
//     become links too (they were plain words);
//   - previous / next links to the older and newer piece of the same type, placed before the
//     closing section.
//
// On the Perspectives index:
//   - each article and news card shows its reading time;
//   - tabs for All, Articles, News and Press releases replace the Type list;
//   - Year and Month replace the 108-line Month list (a year alone is enough to filter);
//   - every choice shows how many pieces it has (the numbers are in data-n and the script
//     shows them, so the page's words do not change each time an article is published);
//   - active filters appear as chips that remove themselves, with the result count;
//   - the filters live in the address (/perspectives?type=news&topic=Retail%20media&year=2026),
//     so a filtered view can be shared, bookmarked and returned to with the Back button.
//
// The export's own filter script is not edited: the new controls drive its fields (which
// stay in the page, hidden) and a second pass adds the year filter, the chips and the address.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { throw new Error("site-perspectives-ux: " + m); };
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const lastmod = JSON.parse(fs.readFileSync(path.join(ROOT, "site-lastmod.json"), "utf8"));
const text = (s) => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const ARROW = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M2 8h11M9 4l4 4-4 4"/></svg>`;

const TYPES = {
  article: { slug: "articles", option: "Articles", one: "article", all: "All articles", kicker: "Article" },
  news: { slug: "news", option: "News", one: "news item", all: "All news", kicker: "News", crumb: "News" },
  press: { slug: "press", option: "Press releases", one: "press release", all: "All press releases", kicker: "Press release", crumb: "Press releases" },
};
const typeOf = (route) => (/^\/perspectives\/news\//.test(route) ? "news" : /^\/perspectives\/press-releases\//.test(route) ? "press" : "article");
const typeUrl = (t) => `/perspectives?type=${TYPES[t].slug}`;
// the archive hub pages (site-archive.mjs) list pieces; they are not pieces themselves
const HUB = /^\/perspectives\/(news|press-releases|\d{4})$/;

// ---------------------------------------------------------------- every piece: words, title, date
const pieces = [];
for (const { route, file } of routes) {
  if (!/^\/perspectives\/./.test(route) || HUB.test(route)) continue;
  const f = path.join(ROOT, "public", file), html = fs.readFileSync(f, "utf8");
  const body = html.match(/<article\b[^>]*data-art="body"[^>]*>([\s\S]*?)<\/article>/);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  if (!body || !h1) fail(`${route}: no article body or headline`);
  if (!lastmod[route]) fail(`${route}: no publication date in site-lastmod.json`);
  const words = text(body[1]).split(" ").length;
  pieces.push({ route, f, html, type: typeOf(route), words, minutes: Math.max(1, Math.round(words / 220)), title: text(h1[1]), date: lastmod[route] });
}
if (pieces.length < 1000) fail(`expected the whole archive, found ${pieces.length} pieces`);
const byRoute = new Map(pieces.map((p) => [p.route, p]));
const read = (p) => `${p.minutes}-minute read`;

// oldest first within each type, so [i - 1] is the previous piece and [i + 1] the next
const order = {};
for (const t of Object.keys(TYPES)) order[t] = pieces.filter((p) => p.type === t).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.route < b.route ? -1 : 1));

// ---------------------------------------------------------------- the index's filter values
const indexFile = path.join(DIR, "perspectives.html");
let index = fs.readFileSync(indexFile, "utf8");
if (index.includes("data-kq-px")) fail("already applied; run the whole build");
const options = (id) => { const s = index.match(new RegExp(`<select id="${id}">([\\s\\S]*?)</select>`)); if (!s) fail(`the index has no #${id} list`); return [...s[1].matchAll(/<option(?: value="([^"]*)")?>([^<]*)<\/option>/g)].map((m) => ({ value: m[1], label: m[2] })); };
const topics = new Set(options("ps-t").slice(1).map((o) => o.label)), channels = new Set(options("ps-c").slice(1).map((o) => o.label));

// ---------------------------------------------------------------- article pages
let linked = 0, timed = 0;
for (const p of pieces) {
  let h = p.html;
  const T = TYPES[p.type];
  // reading time in the byline (news items already have it; press releases are a minute and say so nowhere)
  if (p.type === "article") {
    const by = /(<p\b[^>]*data-art="byline"[^>]*>[\s\S]*?Published [^<]*?\d{4}\.)(<\/p>)/;
    if (!by.test(h)) fail(`${p.route}: byline not in the expected form`);
    h = h.replace(by, (_, a, z) => `${a} ${read(p)}.${z}`); timed++;
  }
  // the line above the headline: type, topic and channel become links to that list
  const kick = /(<p\b[^>]*data-art="kicker"[^>]*>)([^<]*)(<\/p>)/;
  const k = h.match(kick);
  if (!k) fail(`${p.route}: no line above the headline`);
  const parts = k[2].split(". ").map((s) => s.trim());
  if (parts[0] !== T.kicker) fail(`${p.route}: expected the line above the headline to start with "${T.kicker}", found "${parts[0]}"`);
  const A = 'style="color: inherit; text-decoration-thickness: 1px; text-underline-offset: 3px"';
  const out = parts.map((s, i) => {
    if (i === 0) return `<a href="${typeUrl(p.type)}" ${A}>${s}</a>`;
    if (topics.has(s)) return `<a href="/perspectives?topic=${encodeURIComponent(s)}" ${A}>${s}</a>`;
    if (channels.has(s)) return `<a href="/perspectives?channel=${encodeURIComponent(s)}" ${A}>${s}</a>`;
    return s;
  });
  h = h.replace(kick, (_, a, _b, z) => a + out.join(". ") + z); linked++;
  // breadcrumb: "News" and "Press releases" were plain words
  if (T.crumb) {
    const cr = new RegExp(`(<nav aria-label="Breadcrumb"[^>]*>[\\s\\S]*?</a> / )${T.crumb}( / <span aria-current="page")`);
    if (!cr.test(h)) fail(`${p.route}: breadcrumb has no "${T.crumb}" step`);
    h = h.replace(cr, (_, a, z) => `${a}<a href="${typeUrl(p.type)}" style="color: #626366">${T.crumb}</a>${z}`);
  }
  // previous (older) and next (newer) piece of the same type
  const list = order[p.type], i = list.indexOf(p), prev = list[i - 1], next = list[i + 1];
  const side = (q, cls, label, arrowFirst) => (q
    ? `<a class="kq-sib-a ${cls}" href="${q.route}"><span>${label}</span><strong>${arrowFirst ? ARROW : ""}${esc(q.title)}${arrowFirst ? "" : ARROW}</strong></a>`
    : `<span class="kq-sib-a ${cls}" aria-hidden="true"></span>`);
  const strip = `<nav class="kq-sib kq-sib-art" aria-label="More ${T.option.toLowerCase()}"><div>${side(prev, "kq-sib-prev", `Previous ${T.one}`, true)}<a class="kq-sib-all" href="${typeUrl(p.type)}">${T.all}</a>${side(next, "kq-sib-next", `Next ${T.one}`, false)}</div></nav>`;
  if ((h.match(/<section id="review"/g) || []).length !== 1) fail(`${p.route}: expected one closing section (id="review")`);
  h = h.replace('<section id="review"', () => strip + '<section id="review"');
  // structured data: length and reading time
  let ld = 0;
  h = h.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, a, body, z) => {
    let j; try { j = JSON.parse(body); } catch { return all; }
    for (const node of j["@graph"] || [j]) if (/^(BlogPosting|NewsArticle|Article)$/.test(node["@type"])) { node.wordCount = p.words; node.timeRequired = `PT${p.minutes}M`; ld++; }
    return a + JSON.stringify(j) + z;
  });
  if (ld !== 1) fail(`${p.route}: expected one article in the structured data, found ${ld}`);
  fs.writeFileSync(p.f, h);
}

// ---------------------------------------------------------------- the index: reading time on cards
let carded = 0;
const counts = { type: { Articles: 0, News: 0, "Press releases": 0 }, topic: {}, channel: {}, author: {}, year: {}, month: {} };
const seenForCounts = new Set();
index = index.replace(/<(article|li)\b([^>]*data-date="[^"]*"[^>]*)>([\s\S]*?)<\/\1>/g, (all, tag, attrs, inner) => {
  const href = (inner.match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*href="([^"#?]+)/) || inner.match(/<a\b[^>]*href="(\/perspectives\/[^"#?]+)"[^>]*class="[^"]*\bkq-sl\b/) || [])[1];
  const p = href && byRoute.get(href);
  if (!p) fail(`an index card opens ${href}, which is not a piece`);
  if (!seenForCounts.has(href)) { // the featured article is also in the list; count each piece once
    seenForCounts.add(href);
    const a = (k) => (attrs.match(new RegExp(`data-${k}="([^"]*)"`)) || [])[1] || "";
    counts.type[TYPES[p.type].option]++;
    for (const [k, v] of [["topic", a("topic")], ["channel", a("channel")], ["author", a("author")], ["year", a("date").slice(0, 4)], ["month", a("date").slice(0, 7)]]) if (v) counts[k][v] = (counts[k][v] || 0) + 1;
  }
  if (p.type === "press") return all;
  // the small line that starts "Article." or "News."
  const meta = new RegExp(`(<(p|span)\\b[^>]*>)(${TYPES[p.type].kicker}\\.[^<]*)(</\\2>)`);
  if (!meta.test(inner)) fail(`the index card for ${href} has no "${TYPES[p.type].kicker}." line`);
  carded++;
  return `<${tag}${attrs}>${inner.replace(meta, (_, a, _t, t, z) => `${a}${t}. ${read(p)}${z}`)}</${tag}>`;
});
if (seenForCounts.size !== pieces.length) fail(`the index lists ${seenForCounts.size} pieces but the site has ${pieces.length}`);

// ---------------------------------------------------------------- the index: tabs, year and month, counts, chips
const withCounts = (id, key) => {
  const opts = options(id);
  const html = `<select id="${id}">` + opts.map((o, i) => (i === 0 ? `<option value="${esc(o.label)}">${o.label}</option>` : `<option value="${esc(o.label)}" data-n="${counts[key][o.label] || 0}">${o.label}</option>`)).join("") + "</select>";
  index = index.replace(new RegExp(`<select id="${id}">[\\s\\S]*?</select>`), () => html);
};
withCounts("ps-t", "topic"); withCounts("ps-c", "channel"); withCounts("ps-a", "author");

const months = options("ps-m").slice(1);
if (!months.length || months.some((o) => !/^\d{4}-\d\d$/.test(o.value || ""))) fail("the Month list is not in the YYYY-MM form this step expects");
const years = [...new Set(months.map((o) => o.value.slice(0, 4)))].sort().reverse();
const MONTHS = "January February March April May June July August September October November December".split(" ");
const hideField = (id) => {
  const re = new RegExp(`<div class="kq-psf-f">(<label for="${id}">)`);
  if (!re.test(index)) fail(`the index has no field for #${id}`);
  index = index.replace(re, (_, a) => `<div class="kq-psf-f" hidden>${a}`);
};
hideField("ps-ty"); hideField("ps-m");
const yearMonth = `<div class="kq-psf-f"><label for="ps-y">Year</label><select id="ps-y"><option value="">All years</option>${years.map((y) => `<option value="${y}" data-n="${counts.year[y] || 0}">${y}</option>`).join("")}</select></div>` +
  `<div class="kq-psf-f"><label for="ps-mo">Month</label><select id="ps-mo"><option value="">Any month</option>${MONTHS.map((m, i) => `<option value="${String(i + 1).padStart(2, "0")}">${m}</option>`).join("")}</select></div>`;
const grid = /(<div class="kq-psf-grid">[\s\S]*?)(<\/div><div class="kq-psf-foot">)/;
if (!grid.test(index)) fail("the search panel changed shape");
index = index.replace(grid, (_, a, z) => a + yearMonth + z);

const total = pieces.length;
const tabs = `<div class="kq-ptabs" role="group" aria-label="Show">` +
  `<button type="button" data-kq-type="" data-n="${total}" aria-pressed="true">All</button>` +
  Object.values(TYPES).map((t) => `<button type="button" data-kq-type="${t.option}" data-kq-slug="${t.slug}" data-n="${counts.type[t.option]}" aria-pressed="false">${t.option}</button>`).join("") + `</div>`;
const formOpen = '<form class="kq-psf" role="search" aria-label="Search Perspectives">';
if (index.split(formOpen).length !== 2) fail("the search form changed");
index = index.replace(formOpen, () => formOpen.replace("<form ", "<form data-kq-px ") + tabs);
const foot = '<div class="kq-psf-foot">';
if (index.split(foot).length !== 2) fail("the search panel has no footer row");
index = index.replace(foot, () => `<ul class="kq-pchips" aria-label="Active filters"></ul>` + foot);

const CSS = `<style data-kq-px>
.kq-psf-f[hidden]{display:none!important}
.kq-ptabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:4px}
.kq-ptabs button{font:inherit;font-size:16px;min-height:44px;padding:0 18px;border:1px solid #9FB0C3;border-radius:999px;background:#FDFCFA;color:#262524;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background-color 180ms ease,color 180ms ease,border-color 180ms ease}
.kq-ptabs button span{font-size:14px;color:#626366;font-variant-numeric:tabular-nums}
.kq-ptabs button:hover{border-color:#102A4C;color:#102A4C}
.kq-ptabs button[aria-pressed="true"]{background:#102A4C;border-color:#102A4C;color:#F8F6F1;font-weight:500}
.kq-ptabs button[aria-pressed="true"] span{color:#C9D4DF}
.kq-ptabs button:focus-visible{outline:3px solid #00618D;outline-offset:2px}
.kq-psf select:disabled{opacity:.55;cursor:not-allowed}
.kq-pchips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.kq-pchips:empty{display:none}
.kq-pchips button{font:inherit;font-size:15px;min-height:36px;padding:0 10px 0 14px;border:0;border-radius:999px;background:#FDFCFA;color:#102A4C;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background-color 180ms ease}
.kq-pchips button:hover{background:#FFFFFF;box-shadow:inset 0 0 0 1px #102A4C}
.kq-pchips button svg{flex:none}
.kq-pchips button:focus-visible{outline:3px solid #00618D;outline-offset:2px}
section[aria-label="Featured"][hidden]{display:none!important}
@media (max-width:600px){.kq-ptabs button{padding:0 14px;font-size:15px}}
@media (prefers-reduced-motion:reduce){.kq-ptabs button,.kq-pchips button{transition:none}}
</style>`;

const JS = `/* Kwontified: Perspectives filters (see scripts/site-perspectives-ux.mjs) */
(function(){'use strict';
var d=document,w=window,f=d.querySelector('form[data-kq-px]');if(!f)return;
function T(s){return (w.kqT&&w.kqT[s])||s;}
function $(id){return d.getElementById(id);}
var q=$('ps-q'),ty=$('ps-ty'),t=$('ps-t'),c=$('ps-c'),a=$('ps-a'),m=$('ps-m'),y=$('ps-y'),mo=$('ps-mo'),cnt=$('ps-count');
if(!q||!ty||!t||!c||!a||!m||!y||!mo||!cnt||!('MutationObserver' in w))return;
var clr=f.querySelector('.kq-psf-clear'),chips=f.querySelector('.kq-pchips'),tabs=[].slice.call(f.querySelectorAll('.kq-ptabs button'));
var feat=d.querySelector('main section[aria-label="Featured"]'),secs=[].slice.call(d.querySelectorAll('main [data-ptype]'));
var have={};[].forEach.call(m.options,function(o){if(o.value)have[o.value]=1;});
var SLUG={},BACK={};tabs.forEach(function(b){var v=b.getAttribute('data-kq-type'),s=b.getAttribute('data-kq-slug');if(v){SLUG[v]=s;BACK[s]=v;}});
function fire(){f.dispatchEvent(new Event('change',{bubbles:true}));}
/* how many pieces each choice has (kept in data-n so the page's words stay the same from build to build) */
[].forEach.call(f.querySelectorAll('option[data-n]'),function(o){o.textContent=o.textContent+' ('+(+o.getAttribute('data-n')).toLocaleString()+')';});
tabs.forEach(function(b){var k=b.getAttribute('data-n');if(!k)return;var s=d.createElement('span');s.textContent=(+k).toLocaleString();b.appendChild(d.createTextNode(' '));b.appendChild(s);});
function label(sel){var o=sel.options[sel.selectedIndex];return o?o.textContent.replace(/\\s*\\(\\d[\\d,.]*\\)\\s*$/,''):'';}

/* Year and Month drive the export's own Month field; a year alone is filtered in pass() */
function months(){mo.disabled=!y.value;[].forEach.call(mo.options,function(o){if(!o.value)return;var ok=!!y.value&&!!have[y.value+'-'+o.value];o.disabled=!ok;o.hidden=!ok;});
if(mo.selectedIndex>0&&mo.options[mo.selectedIndex].disabled)mo.selectedIndex=0;
var v=y.value&&mo.value?y.value+'-'+mo.value:'';if(m.value!==v)m.value=v;}
y.addEventListener('change',months);mo.addEventListener('change',months);

tabs.forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-kq-type');if(v)ty.value=v;else ty.selectedIndex=0;fire();});});

function chip(text,name,undo){var li=d.createElement('li'),b=d.createElement('button');b.type='button';b.textContent=text+' ';
b.setAttribute('aria-label',T('Remove filter')+': '+name);
b.insertAdjacentHTML('beforeend','<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7"/></svg>');
b.addEventListener('click',function(){refocus=[].indexOf.call(chips.querySelectorAll('button'),b);undo();months();fire();});li.appendChild(b);chips.appendChild(li);}
/* the chips are redrawn after every change, so keyboard focus is put back once they are: on the chip that took
   the removed one's place (or the one before it), or on the search field when none is left, and after
   "Clear filters" on the search field (WCAG 2.4.3; before, focus fell to the top of the page) */
var refocus=null;if(clr)clr.addEventListener('click',function(){refocus=-1;});
function restore(){if(refocus===null)return;var bs=chips.querySelectorAll('button'),t=refocus>=0&&bs.length?bs[Math.min(refocus,bs.length-1)]:q;refocus=null;t.focus();}

/* runs after the export's filter: the year filter, the count, the chips, the tabs and the address */
function pass(){var yr=y.value,term=q.value.trim();
if(yr&&!mo.value)[].forEach.call(d.querySelectorAll('main [data-date]'),function(el){if(!el.hidden&&el.getAttribute('data-date').slice(0,4)!==yr)el.hidden=true;});
var active=!!(term||ty.selectedIndex>0||t.selectedIndex>0||c.selectedIndex>0||a.selectedIndex>0||yr),n=0;
secs.forEach(function(s){var ok=ty.selectedIndex<1||s.getAttribute('data-ptype')===ty.value,vis=[].filter.call(s.querySelectorAll('[data-date]'),function(x){return !x.hidden;}).length;
s.hidden=!(ok&&(vis||!active));if(!s.hidden)n+=vis;});
/* the featured article is a result like any other: it stays when it matches, and counts */
var fi=feat&&feat.querySelector('[data-date]'),fok=!!fi&&!fi.hidden&&(ty.selectedIndex<1||ty.value===BACK.articles);
if(feat)feat.hidden=active&&!fok;if(active&&fok)n++;
cnt.textContent=active&&d.querySelector('main[data-kq-more]')?T('Searching the full archive\\u2026'):active?(n?(n===1?T('{n} result'):T('{n} results')).replace('{n}',n.toLocaleString()):T('No results. Try fewer filters or a different keyword.')):'';
if(clr)clr.hidden=!active;
tabs.forEach(function(b){b.setAttribute('aria-pressed',(b.getAttribute('data-kq-type')||'')===(ty.selectedIndex>0?ty.value:'')?'true':'false');});
chips.textContent='';
if(term)chip('\\u201c'+term+'\\u201d',T('Search')+', '+term,function(){q.value='';});
if(t.selectedIndex>0)chip(label(t),T('Topic')+', '+label(t),function(){t.selectedIndex=0;});
if(c.selectedIndex>0)chip(label(c),T('Channel')+', '+label(c),function(){c.selectedIndex=0;});
if(a.selectedIndex>0)chip(label(a),T('Author')+', '+label(a),function(){a.selectedIndex=0;});
if(yr){var when=(mo.value?label(mo)+' ':'')+yr;chip(when,T('Date')+', '+when,function(){y.selectedIndex=0;mo.selectedIndex=0;});}
restore();
var p=[];function add(k,v){if(v)p.push(k+'='+encodeURIComponent(v));}
add('q',term);add('type',ty.selectedIndex>0?SLUG[ty.value]:'');add('topic',t.selectedIndex>0?t.value:'');add('channel',c.selectedIndex>0?c.value:'');add('author',a.selectedIndex>0?a.value:'');add('year',yr);add('month',yr?mo.value:'');
try{var url=location.pathname+(p.length?'?'+p.join('&'):'')+location.hash;if(url!==location.pathname+location.search+location.hash)history.replaceState(history.state,'',url);}catch(_){}}
/* the export's filter writes the count every time it runs, whatever set it off (a field, the Clear
   button, the rest of the archive arriving); that write is the cue for this second pass */
var obs=new MutationObserver(function(){later();}),due=0;
obs.observe(cnt,{childList:true,characterData:true,subtree:true});
/* two turns later, not one: the pager ignores changes until the turn after its own redraw, and it has to see the year filter */
function later(){if(due)return;due=setTimeout(function(){setTimeout(function(){due=0;pass();obs.takeRecords();},0);},0);}
['change','input','submit'].forEach(function(e){f.addEventListener(e,later);});
f.addEventListener('reset',function(){setTimeout(function(){months();later();},0);});

/* open with the filters named in the address */
function pick(sel,v){if(!v)return;for(var i=0;i<sel.options.length;i++)if(sel.options[i].value===v){sel.selectedIndex=i;return true;}}
var P;try{P=new URLSearchParams(location.search);}catch(_){P=null;}
var any=false;
if(P){var v;
if((v=P.get('q'))){q.value=v.slice(0,80);any=true;}
if((v=P.get('type'))&&BACK[v]){ty.value=BACK[v];any=true;}
if(pick(t,P.get('topic')))any=true;if(pick(c,P.get('channel')))any=true;if(pick(a,P.get('author')))any=true;
if(pick(y,P.get('year'))){any=true;months();pick(mo,P.get('month'));}}
months();
if(any){fire();w.addEventListener('load',function(){if(w.scrollY>40)return;var top=f.getBoundingClientRect().top+w.scrollY-96;w.scrollTo({top:Math.max(0,top),behavior:'auto'});});}
else pass();
})();
`;
const jsName = `kq-px-${crypto.createHash("sha256").update(JS).digest("hex").slice(0, 12)}.js`;
for (const f of fs.readdirSync(ASSETS)) if (/^kq-px-[0-9a-f]{12}\.js$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));
fs.writeFileSync(path.join(ASSETS, jsName), JS);
if (index.split("</head>").length !== 2) fail("expected one </head> on the index");
index = index.replace("</head>", () => CSS + "</head>");
index = index.replace(/<\/body>(?![\s\S]*<\/body>)/, () => `<script defer src="/assets/${jsName}"></script></body>`);
fs.writeFileSync(indexFile, index);

console.log(`site-perspectives-ux: reading time added to ${timed} articles and ${carded} index cards; type, topic and channel linked on ${linked} pieces; previous / next on ${pieces.length}; index has tabs (${Object.entries(counts.type).map(([k, v]) => `${k} ${v}`).join(", ")}), ${years.length} years, counts and chips; script /assets/${jsName} (${(JS.length / 1024).toFixed(1)} KB)`);
