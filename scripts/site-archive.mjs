// Adds the imported archive (site-src/archive/index.json, written by
// scripts/import-archive.py) to the Perspectives index page.
//
// Runs after build-site.mjs, site-fixes.mjs and site-content.mjs. The article pages
// themselves are made by build-site.mjs; this step only lists them:
//   - Articles: cards added to the "Latest" grid, newest first (the page already
//     shows nine at a time with previous and next buttons)
//   - News: rows added to the list, which now pages twelve at a time the same way
//   - Press releases: rows added; an item that was listed without a page gets its link
//   - the Topic, Channel and Month filters gain the values the archive brings
// An article's card uses its own image once public/assets/archive-<ID>.jpg exists.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX = path.join(ROOT, "site-src/archive/index.json");
const PAGE = path.join(ROOT, "public/_kq/perspectives.html");
const fail = (m) => { throw new Error("site-archive: " + m); };
if (!fs.existsSync(INDEX)) { console.log("site-archive: no archive data, nothing to add"); process.exit(0); }

const items = JSON.parse(fs.readFileSync(INDEX, "utf8"));
let html = fs.readFileSync(PAGE, "utf8");
if (html.includes('id="news-list"')) fail("perspectives.html already has the archive; run build-site.mjs first");

const MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const MONTHS = "January February March April May June July August September October November December".split(" ");
const fdate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${MON[m - 1]} ${d}, ${y}`; };
const attr = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;").replace(/"/g, "&quot;");
const img = (id) => (fs.existsSync(path.join(ROOT, "public/assets", `archive-${id}.jpg`)) ? `/assets/archive-${id}.jpg` : "/assets/kq-archive-fallback.svg");
const dateOf = (block) => (block.match(/data-date="([^"]*)"/) || [])[1] || "";
const byDateDesc = (a, b) => (dateOf(a) < dateOf(b) ? 1 : dateOf(a) > dateOf(b) ? -1 : 0);

// an imported item that an existing row already links to is not listed twice
const fresh = (old, list) => list.filter((x) => !old.some((b) => b.includes(`href="${x.url}"`)));

// One section of the page: from its data-ptype marker to the next one (or </main>).
function section(name) {
  const start = html.indexOf(`data-ptype="${name}"`);
  if (start < 0) fail(`no ${name} section`);
  const next = html.slice(start + 1).search(/data-ptype="|<\/main>/);
  return { start, end: start + 1 + next };
}
// Replace the run of <tag ...data-date...>...</tag> blocks in a section with `build(existing blocks)`.
function relist(name, tag, build) {
  const { start, end } = section(name);
  const part = html.slice(start, end);
  const re = new RegExp(`<${tag}\\b[^>]*data-date=[\\s\\S]*?</${tag}>`, "g");
  const blocks = part.match(re) || [];
  if (!blocks.length) fail(`${name}: no existing items found`);
  const first = part.indexOf(blocks[0]);
  const lastBlock = blocks[blocks.length - 1];
  const last = part.lastIndexOf(lastBlock) + lastBlock.length;
  const out = build(blocks).sort(byDateDesc).join("");
  html = html.slice(0, start) + part.slice(0, first) + out + part.slice(last) + html.slice(end);
  return { had: blocks.length };
}

// ---- Articles ----
const articles = items.filter((x) => x.kind === "Article");
relist("Articles", "article", (old) => old.concat(fresh(old, articles).map((x) =>
  `<article data-kq-row data-pg-item data-date="${x.date}" data-topic="${attr(x.topic)}" data-channel="${attr(x.channel)}" data-author="${attr(x.author)}"><div style="margin-bottom: 18px"><img loading="lazy" decoding="async" src="${img(x.id)}" alt="" style="width: 100%; aspect-ratio: 3 / 2; display: block; border-radius: 2px; object-fit: cover"></div><p style="margin: 0; font-size: 15px; color: #626366">Article. ${x.topic}. ${x.channel}. ${x.author}. ${fdate(x.date)}</p><h3 style="margin: 10px 0 0; font-weight: 500; font-size: 22px; line-height: 1.3"><a class="kq-sl" href="${x.url}" data-archive-id="${x.id}" style="color: #262524; text-decoration: none">${x.title}</a></h3><p style="margin: 10px 0 0; font-size: 18px">${x.desc}</p></article>`)));

// ---- News and Press releases share one row layout ----
const LI = 'style="padding: 22px 0; border-top: 1px solid #C5CCD3; display: flex; flex-wrap: wrap; gap: 6px 40px; align-items: baseline"';
const row = (x, label) =>
  `<li data-kq-row data-pg-item data-date="${x.date}" data-topic="${attr(x.topic)}" data-channel="${attr(x.channel)}" data-author="Kwontified" ${LI}><span style="flex: 0 0 200px; font-size: 15px; color: #626366">${fdate(x.date)}</span><span style="flex: 1 1 520px; min-width: 0"><span style="display: block; font-size: 22px; font-weight: 500; line-height: 1.3; color: #102A4C"><a class="kq-il kq-sl" href="${x.url}">${x.title}</a></span><span style="display: block; margin-top: 6px; font-size: 15px; color: #626366">${label}</span></span></li>`;
const plain = (s) => s.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/[^A-Za-z0-9]+/g, " ").trim().toLowerCase();
const titled = new Set(items.map((x) => plain(x.title)));
// an existing row without a link, whose title now has a page, is dropped in favour of the linked row
const keep = (old) => old.filter((b) => /<a\b/.test(b) || ![...titled].some((t) => plain(b).includes(t)));

const news = items.filter((x) => x.kind === "News");
relist("News", "li", (old) => keep(old).map((b) => (b.includes("data-pg-item") ? b : b.replace("<li", "<li data-pg-item"))).concat(fresh(old, news).map((x) => row(x, `News. ${x.topic}. ${x.channel}`))));
const press = items.filter((x) => x.kind === "Press release");
relist("Press releases", "li", (old) => keep(old).concat(fresh(old, press).map((x) => row(x, "Press release").replace(" data-pg-item", ""))));

// News pages twelve at a time, using the pager the Articles grid already has
{
  const { start, end } = section("News");
  let part = html.slice(start, end);
  const ul = part.match(/<ul style="flex: 999 1 640px;[^"]*"/);
  const pager = html.match(/<div class="kq-pg" data-pg-for="latest-grid">[\s\S]*?<\/div>/);
  if (!ul || !pager) fail("News list or pager control not found");
  const control = pager[0].replace('data-pg-for="latest-grid"', 'data-pg-for="news-list" style="margin-top: 28px"').replace("Previous nine articles", "Previous twelve news items").replace("Next nine articles", "Next twelve news items");
  part = part.replace(ul[0], `<div style="flex: 999 1 640px; min-width: 0"><ul id="news-list" class="kq-pgx" data-pg-size="12" style="margin: 0; padding: 0; list-style: none"`);
  const close = part.lastIndexOf("</ul>");
  part = part.slice(0, close) + "</ul>" + control + "</div>" + part.slice(close + 5);
  html = html.slice(0, start) + part + html.slice(end);
}

// ---- filters ----
function options(id, wanted, make) {
  const re = new RegExp(`(<select id="${id}">)([\\s\\S]*?)(</select>)`);
  const m = html.match(re);
  if (!m) fail(`filter ${id} not found`);
  html = html.replace(re, (_, a, body, c) => a + make(body, wanted) + c);
}
const values = (k) => [...new Set((html.match(new RegExp(`data-${k}="([^"]+)"`, "g")) || []).map((s) => s.slice(k.length + 7, -1)))];
const addMissing = (body, wanted) => {
  const have = new Set((body.match(/<option[^>]*>([^<]*)/g) || []).map((s) => s.replace(/<option[^>]*>/, "")));
  return body + wanted.filter((v) => !have.has(v)).sort().map((v) => `<option>${v}</option>`).join("");
};
options("ps-t", values("topic"), addMissing);
options("ps-c", values("channel"), addMissing);
options("ps-m", [...new Set(values("date").map((d) => d.slice(0, 7)))].sort().reverse(), (body, months) =>
  '<option value="">Any month</option>' + months.map((m) => `<option value="${m}">${MONTHS[+m.slice(5) - 1]} ${m.slice(0, 4)}</option>`).join(""));

fs.writeFileSync(PAGE, html);
console.log(`site-archive: ${articles.length} articles, ${news.length} news items and ${press.length} press releases added to the Perspectives index (${Math.round(html.length / 1024)} KB)`);
