// Keeps the Perspectives index fast. With the archive the page held about 1,000 cards
// and rows (1.2 MB of HTML, 7,400 elements), and laying them out cost more than a second
// on a phone. This step leaves the first page of each list in the HTML (nine articles,
// twelve news items; the ten press releases stay as they are) and moves the rest into a
// JSON file the page fetches when the lists come near the screen, when someone reaches
// for the search, the filters or the pager, or a few seconds after load. The cards are moved as they are, markup unchanged.
//
// Search engines and AI crawlers still find every item: the sitemap and llms.txt list
// all of them, and each article links to related ones.
//
// Runs last, after site-images.mjs and site-tags.mjs, so the moved cards carry their
// srcset. The JSON file name is a content hash because /assets is cached as immutable.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const PAGE = path.join(ROOT, "public/_kq/perspectives.html");
const fail = (m) => { throw new Error("site-perspectives: " + m); };
let html = fs.readFileSync(PAGE, "utf8");
if (html.includes("data-kq-more")) fail("already applied; run the whole build");

const KEEP = { "latest-grid": 9, "news-list": 12 };
// card images sit in a grid of about 400 px columns, full width on phones
const CARD_SIZES = "(max-width: 760px) calc(100vw - 48px), 420px";

// The items of one list: a contiguous run of <tag ... data-pg-item ...>...</tag> after id="<id>".
function split(id, tag, endMarker) {
  const from = html.indexOf(`id="${id}"`);
  if (from < 0) fail(`#${id} not found`);
  const to = html.indexOf(endMarker, from);
  if (to < 0) fail(`end of #${id} not found`);
  const part = html.slice(from, to);
  const re = new RegExp(`<${tag}\\b[^>]*data-pg-item[\\s\\S]*?</${tag}>`, "g");
  const spans = [...part.matchAll(re)].map((m) => [m.index, m.index + m[0].length]);
  if (spans.length <= KEEP[id]) fail(`#${id}: only ${spans.length} items`);
  for (let i = 1; i < spans.length; i++) if (part.slice(spans[i - 1][1], spans[i][0]).trim()) fail(`#${id}: items are not contiguous`);
  const items = spans.map(([a, b]) => part.slice(a, b));
  const kept = items.slice(0, KEEP[id]), moved = items.slice(KEEP[id]);
  const out = part.slice(0, spans[0][0]) + kept.join("") + part.slice(spans[spans.length - 1][1]);
  html = html.slice(0, from) + out + html.slice(to);
  return { total: items.length, moved };
}

const articles = split("latest-grid", "article", 'data-ptype="News"');
const news = split("news-list", "li", "</ul>");
const cards = (list) => list.map((a) => a.replace(/ sizes="100vw"/, () => ` sizes="${CARD_SIZES}"`));
html = html.replace(/(<article\b[^>]*data-pg-item[\s\S]*?<\/article>)/g, (a) => cards([a])[0]);
const data = { "latest-grid": cards(articles.moved), "news-list": news.moved };
for (const list of Object.values(data)) for (const item of list) if (/<img\b(?![^>]*loading="lazy")/.test(item)) fail("a moved card image is not lazy-loaded");

// Every item on the index must open its page from anywhere on the card or row: picture, title,
// summary and date line. That works through one link per item whose click area covers the item
// (data-kq-row on the item, class kq-sl on its link; see site-fixes.mjs).
{
  const inPage = [...html.matchAll(/<(article|li)\b[^>]*data-date=[\s\S]*?<\/\1>/g)].map((m) => m[0]);
  const all = inPage.concat(...Object.values(data));
  const bad = all.filter((x) => !/^<(article|li)\b[^>]*data-kq-row/.test(x) || (x.match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*href="\/perspectives\//g) || x.match(/<a\b[^>]*href="\/perspectives\/[^>]*class="[^"]*\bkq-sl\b/g) || []).length !== 1);
  if (bad.length) fail(`${bad.length} of ${all.length} index items are not clickable as a whole, for example: ${bad[0].replace(/<[^>]+>/g, " ").trim().slice(0, 80)}`);
  console.log(`site-perspectives: all ${all.length} index items open their page from picture, title, summary or date line`);
}
const json = JSON.stringify(data);
const name = `perspectives-more-${crypto.createHash("sha256").update(json).digest("hex").slice(0, 12)}.json`;
for (const f of fs.readdirSync(path.join(ROOT, "public/assets"))) if (/^perspectives-more-.*\.json$/.test(f)) fs.unlinkSync(path.join(ROOT, "public/assets", f));
fs.writeFileSync(path.join(ROOT, "public/assets", name), json);

// The site script reads the lists once at start-up; let it re-read them, and re-page when items arrive.
function patch(from, to) {
  if (html.split(from).length !== 2) fail(`site script changed, cannot find: ${from.slice(0, 60)}`);
  html = html.replace(from, () => to);
}
patch("var ok=items.filter(shown);", "items=[].slice.call(grid.querySelectorAll('[data-pg-item]'));var ok=items.filter(shown);");
patch(".observe(grid,{subtree:true,attributes:true,attributeFilter:['hidden']});", ".observe(grid,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});");
patch("items.forEach(function(el){var ok=(!q||", "items=[].slice.call(d.querySelectorAll('main [data-date]'));items.forEach(function(el){var ok=(!q||");

// While the rest is on its way the pager counts are not yet right, so they stay invisible (space kept).
const CSS = "<style>main[data-kq-more] [data-pg-for]{visibility:hidden}</style>";
const LOADER = `<script>/* Perspectives: the rest of the archive, loaded when idle or on first use */
(function(){var d=document,m=d.querySelector('main[data-kq-more]');if(!m)return;var url=m.getAttribute('data-kq-more'),started=0;
function finish(){m.removeAttribute('data-kq-more');var f=d.querySelector('form[aria-label="Search Perspectives"]');if(f)f.dispatchEvent(new Event('change'));}
function go(){if(started)return;started=1;
fetch(url).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(data){
var jobs=[],frags=[];Object.keys(data).forEach(function(id){var box=d.getElementById(id);if(!box)return;var fr=d.createDocumentFragment();frags.push([box,fr]);
for(var i=0;i<data[id].length;i+=25)jobs.push([fr,data[id].slice(i,i+25)]);});
(function step(){var j=jobs.shift();if(!j){frags.forEach(function(x){x[0].appendChild(x[1]);});finish();return;}
var t=d.createElement('template');t.innerHTML=j[1].join('');j[0].appendChild(t.content);setTimeout(step,0);})();
}).catch(function(){m.removeAttribute('data-kq-more');});}
function near(e){if(e.target.closest&&e.target.closest('form[aria-label="Search Perspectives"],[data-pg-for]'))go();}
d.addEventListener('focusin',near);d.addEventListener('pointerdown',near);
var form=d.querySelector('form[aria-label="Search Perspectives"]');if(form)['input','change','submit'].forEach(function(t){form.addEventListener(t,function(){go();setTimeout(function(){var c=d.getElementById('ps-count');if(m.hasAttribute('data-kq-more')&&c&&c.textContent)c.textContent='Searching the full archive\\u2026';},0);});});
/* start when the lists come near the screen; otherwise a few seconds after load, when the page is quiet */
var grid=d.getElementById('latest-grid');if(grid&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es.some(function(e){return e.isIntersecting;})){io.disconnect();go();}},{rootMargin:'800px 0px'});io.observe(grid);}
function idle(){setTimeout(function(){(window.requestIdleCallback||function(f){f();})(go,{timeout:2000});},4000);}
if(d.readyState==='complete')idle();else addEventListener('load',idle);})();</script>`;

if (html.split("<main").length !== 2) fail("expected one <main>");
html = html.replace(/<main\b/, () => `<main data-kq-more="/assets/${name}"`);
html = html.replace("</head>", () => CSS + "</head>");
html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => LOADER + "</body>");

fs.writeFileSync(PAGE, html);
console.log(`site-perspectives: kept ${KEEP["latest-grid"]} of ${articles.total} articles and ${KEEP["news-list"]} of ${news.total} news items in the page (${Math.round(html.length / 1024)} KB); the rest load from /assets/${name} (${Math.round(json.length / 1024)} KB)`);
