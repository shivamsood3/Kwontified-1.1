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
import { fillLatest } from "./latest-cards.mjs";

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


// ---- hub pages: the whole archive in plain links ----
// Crawlers that do not run script (most AI crawlers) see only the first page of each list on the
// index. These pages list every piece with a plain link, so each one is at most four clicks from
// the home page (home, Perspectives, a hub, the piece):
//   /perspectives/news, /perspectives/press-releases, and one page per year (/perspectives/2018 ...)
// They are served by the /perspectives/:slug rewrite like any article (no next.config change) and are
// registered in site-routes.json here, at step 4, so every later step treats them as pages: site-seo
// gives them structured data and a breadcrumb, the header and footer are added, the sitemap lists them.
// The index links to them under the article pager and beside the news and press lists.
const ROUTES = path.join(ROOT, "site-routes.json");
const routes = JSON.parse(fs.readFileSync(ROUTES, "utf8"));
const routeSet = new Set(routes.map((r) => r.route));
const once = (s, from, to, what) => { if (s.split(from).length !== 2) fail(`${what}: expected one match`); return s.replace(from, () => to); };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const text = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const KIND = (href) => (/^\/perspectives\/news\//.test(href) ? "News" : /^\/perspectives\/press-releases\//.test(href) ? "Press release" : "Article");
const all = [];
{
  const seen = new Set();
  for (const m of html.matchAll(/<(article|li)\b([^>]*data-date="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g)) {
    const href = (m[4].match(/<a\b[^>]*class="[^"]*\bkq-sl\b[^"]*"[^>]*href="([^"#?]+)"/) || m[4].match(/<a\b[^>]*href="(\/perspectives\/[^"#?]+)"[^>]*class="[^"]*\bkq-sl\b/) || [])[1];
    if (!href || seen.has(href)) continue;
    seen.add(href);
    const title = (m[4].match(/<a\b[^>]*\bkq-sl\b[^>]*>([\s\S]*?)<\/a>/) || [])[1];
    if (!title) fail(`no title for ${href}`);
    all.push({ href, date: m[3], title: text(title), topic: (m[2].match(/data-topic="([^"]*)"/) || [])[1] || "", kind: KIND(href) });
  }
  const pieces = routes.filter((r) => /^\/perspectives\/./.test(r.route)).length;
  if (all.length !== pieces) fail(`the index lists ${all.length} pieces but the site has ${pieces}`);
  all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.href < b.href ? -1 : 1));
}
const years = [...new Set(all.map((x) => x.date.slice(0, 4)))].sort().reverse();
const HUBS = [
  { route: "/perspectives/news", name: "News", title: "Marketplace news, by year", h1: "News", items: all.filter((x) => x.kind === "News"), by: "year",
    intro: "Every news item we have published on marketplace and retail media changes, newest first, with what each one means for brands.",
    desc: "Every Kwontified news item on marketplace and retail media changes, newest first, grouped by year." },
  { route: "/perspectives/press-releases", name: "Press releases", title: "Press releases and announcements", h1: "Press releases", items: all.filter((x) => x.kind === "Press release"), by: "year",
    intro: "Company announcements from Kwontified, newest first. Press inquiries: <a href=\"mailto:press@kwontified.com\">press@kwontified.com</a>.",
    desc: "Company announcements from Kwontified, newest first." },
  ...years.map((y) => ({ route: `/perspectives/${y}`, name: y, title: `Perspectives from ${y}: articles, news and releases`, h1: `Perspectives from ${y}`, items: all.filter((x) => x.date.startsWith(y)), by: "month",
    intro: `Everything we published in ${y}: articles, news and press releases, newest first.`,
    desc: `Kwontified articles, news and press releases published in ${y}, newest first, grouped by month.` })),
];
for (const h of HUBS) if (routeSet.has(h.route)) fail(`${h.route} is already a page; hub pages cannot share an address with an article`);

const CRUMB = (name) => `<nav aria-label="Breadcrumb" style="font-size: 15px; color: #626366; margin-bottom: 40px"><a href="/" style="color: #626366">Home</a> / <a href="/perspectives" style="color: #626366">Perspectives</a> / <span aria-current="page">${esc(name)}</span></nav>`;
// links to every hub: on the index under the article pager, and at the top of each hub
const browse = (current) => `<nav class="kq-hubnav" aria-label="Browse the archive"><p>Browse the full archive</p><ul>` +
  [["/perspectives/news", "All news"], ["/perspectives/press-releases", "All press releases"], ...years.map((y) => [`/perspectives/${y}`, y])]
    .map(([href, label]) => `<li><a href="${href}"${href === current ? ' aria-current="page"' : ""}>${label}</a></li>`).join("") + `</ul></nav>`;
const HUB_CSS = `<style data-kq-hub>
.kq-hubnav{margin-top:40px}
.kq-hubnav p{margin:0 0 12px;font-size:15px;color:#626366}
.kq-hubnav ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.kq-hubnav a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid #9FB0C3;border-radius:999px;color:#102A4C;text-decoration:none;font-size:16px}
.kq-hubnav a:hover{border-color:#102A4C}
.kq-hubnav a[aria-current]{background:#102A4C;border-color:#102A4C;color:#F8F6F1;font-weight:500}
.kq-hubnav a:focus-visible{outline:3px solid #00618D;outline-offset:2px}
</style>`;
const HUB_LI = 'style="padding: 22px 0; border-top: 1px solid #C5CCD3; display: flex; flex-wrap: wrap; gap: 6px 40px; align-items: baseline"';
const hubRow = (x) => `<li data-kq-row ${HUB_LI}><span style="flex: 0 0 200px; font-size: 15px; color: #626366">${fdate(x.date)}</span><span style="flex: 1 1 520px; min-width: 0"><span style="display: block; font-size: 22px; font-weight: 500; line-height: 1.3; color: #102A4C"><a class="kq-il kq-sl" href="${x.href}">${esc(x.title)}</a></span><span style="display: block; margin-top: 6px; font-size: 15px; color: #626366">${x.kind}${x.topic ? `. ${esc(x.topic)}` : ""}</span></span></li>`;

function hubPage(hub, template) {
  let h = template;
  const groups = new Map();
  for (const x of hub.items) { const k = hub.by === "year" ? x.date.slice(0, 4) : x.date.slice(0, 7); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(x); }
  const label = (k) => (hub.by === "year" ? k : `${MONTHS[+k.slice(5) - 1]} ${k.slice(0, 4)}`);
  const lists = [...groups].map(([k, xs]) => `<h2 id="g-${k}" style="margin: 56px 0 8px; font-weight: 400; font-size: clamp(26px, 2.2vw, 34px); line-height: 1.15; letter-spacing: -0.02em">${label(k)} <span style="font-size: 16px; color: #626366; letter-spacing: 0">(${xs.length})</span></h2><ul style="margin: 0; padding: 0; list-style: none">${xs.map(hubRow).join("")}</ul>`).join("");
  const mainOpen = (h.match(/<main\b[^>]*>/) || fail("the index has no <main>"))[0];   // later steps add its id
  const main = `${mainOpen}
<section aria-label="Introduction" style="padding: clamp(40px, 5vw, 72px) clamp(20px, 4.4vw, 64px) 8px"><div style="max-width: 1312px; margin: 0 auto">${CRUMB(hub.name)}<h1 id="page-title" style="margin: 0; font-weight: 400; font-size: clamp(38px, 3.9vw, 56px); line-height: 1.06; letter-spacing: -0.025em">${esc(hub.h1)}</h1><p style="margin: 24px 0 0; font-size: clamp(18px, 1.53vw, 22px); line-height: 1.45; max-width: 34em">${hub.intro} ${hub.items.length.toLocaleString("en-US")} ${hub.items.length === 1 ? "piece" : "pieces"}.</p>${browse(hub.route)}</div></section>
<section aria-labelledby="page-title" style="padding: 8px clamp(20px, 4.4vw, 64px) clamp(80px, 9vw, 144px)"><div style="max-width: 1312px; margin: 0 auto">${lists}</div></section>
</main>`;
  const a = h.indexOf("<main"), z = h.indexOf("</main>");
  if (a < 0 || z < 0 || h.split("<main").length !== 2) fail("the index has no single <main>");
  h = h.slice(0, a) + main + h.slice(z + "</main>".length);
  const url = `https://kwontified.com${hub.route}`;
  const meta = (re, value, what) => { const m = h.match(re); if (!m || h.split(m[0]).length !== 2) fail(`${hub.route}: ${what} not found once`); h = h.replace(m[0], () => m[0].replace(/(content|href)="[^"]*"/, (_, k) => `${k}="${esc(value)}"`)); };
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(hub.title)} | Kwontified</title>`);
  meta(/<meta name="description" content="[^"]*">/, hub.desc, "description");
  meta(/<meta property="og:description" content="[^"]*">/, hub.desc, "og:description");
  meta(/<meta name="twitter:description" content="[^"]*">/, hub.desc, "twitter:description");
  meta(/<meta property="og:title" content="[^"]*">/, `${hub.title} | Kwontified`, "og:title");
  meta(/<meta name="twitter:title" content="[^"]*">/, `${hub.title} | Kwontified`, "twitter:title");
  meta(/<link rel="canonical" href="[^"]*">/, url, "canonical");
  meta(/<meta property="og:url" content="[^"]*">/, url, "og:url");
  // structured data comes from scripts/site-seo.mjs (step 13), as on every page: a WebPage and the
  // BreadcrumbList read from the visible trail above. The index's own (its FAQ) does not belong here.
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, "");
  h = once(h, "</head>", HUB_CSS + "</head>", `${hub.route} head`);
  if (/data-pg-size|id="latest-grid"|form[^>]*Search Perspectives/.test(h.slice(h.indexOf("<main"), h.indexOf("</main>")))) fail(`${hub.route}: index lists left in the hub`);
  return h;
}
const hubTemplate = html;   // the index with the whole archive listed; each hub keeps the page around its own list
let hubLinks = 0;
for (const hub of HUBS) {
  const file = `perspectives--${hub.route.slice("/perspectives/".length)}.html`;
  const out = hubPage(hub, hubTemplate);
  hubLinks += hub.items.length;
  fs.writeFileSync(path.join(ROOT, "public/_kq", file), out);
  routes.push({ route: hub.route, file: `/_kq/${file}`, source: "site-archive.mjs (archive hub)" });
}
fs.writeFileSync(ROUTES, JSON.stringify(routes, null, 2));
{
  // every piece is on its year page, and every news item and press release on its type page
  const onYear = new Set(HUBS.filter((h) => h.by === "month").flatMap((h) => h.items.map((x) => x.href)));
  if (onYear.size !== all.length) fail(`year pages list ${onYear.size} of ${all.length} pieces`);
}
// the index links to the hubs, under the article pager, and the news and press lists name theirs
html = once(html, "</head>", HUB_CSS + "</head>", "index head");
{
  // after the row that holds the bottom pager (the pager, then the row's own closing tag)
  const bottom = html.match(/<div class="kq-pg" data-pg-for="latest-grid" data-pg-bottom>[\s\S]*?<\/div><\/div>/);
  if (!bottom) fail("no bottom pager under the article grid");
  html = once(html, bottom[0], bottom[0] + browse(""), "article pager");
  const news = html.match(/<div class="kq-pg" data-pg-for="news-list"[^>]*>[\s\S]*?<\/div>/);
  if (!news) fail("no news pager");
  html = once(html, news[0], news[0] + `<p style="margin: 20px 0 0; font-size: 16px"><a href="/perspectives/news" style="color: #102A4C">All news, by year</a></p>`, "news pager");
  const press = '<p style="margin: 20px 0 0; max-width: 24em">Company announcements. Press inquiries: <a href="mailto:press@kwontified.com">press@kwontified.com</a>.</p>';
  html = once(html, press, press + `<p style="margin: 12px 0 0"><a href="/perspectives/press-releases" style="color: #102A4C">All press releases</a></p>`, "press intro");
}
console.log(`site-archive: ${HUBS.length} archive hub pages (news, press releases, ${years.length} years) with ${hubLinks} plain links; the index links to each`);

fs.writeFileSync(PAGE, html);

// ---- the pieces themselves: closing band, search title, and checks ----
// Every article and news item ends with the same navy band. Its sentence is neutral; holiday and
// fourth-quarter pieces (marked "closep" in the archive data by scripts/import-archive.py) keep the
// fourth-quarter wording. A piece whose headline runs past 65 characters has a shorter "seo_title"
// for the <title>; its H1, og:title and structured data keep the full headline.
{
  const CLOSE_P = "Tell us where you sell and what you want to grow. A member of our team will reply within one business day.";
  const entries = {};
  for (const f of ["Post", "PostNews", "PostPressRelease"]) {
    const tpl = fs.readFileSync(path.join(ROOT, "site-src/pages", `${f}.html`), "utf8");
    const own = JSON.parse(tpl.match(/<script type="application\/json" id="kq-articles">([\s\S]*?)<\/script>/)[1]);
    const extra = path.join(ROOT, "site-src/archive", `${f}.json`);
    entries[`${f}.html`] = { ...(fs.existsSync(extra) ? JSON.parse(fs.readFileSync(extra, "utf8")) : {}), ...own };
  }
  const decode = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let banded = 0, q4 = 0, short = 0, pieces = 0;
  const bad = [];
  for (const r of routes) {
    const m = /^(Post|PostNews|PostPressRelease)\.html#(\w+)$/.exec(r.source || "");
    if (!m) continue;
    const e = entries[`${m[1]}.html`][m[2]];
    if (!e) fail(`${r.route}: no archive entry ${r.source}`);
    const file = path.join(ROOT, "public", r.file);
    let h = fs.readFileSync(file, "utf8");
    pieces++;
    if (m[1] !== "PostPressRelease") {
      const n = h.split(CLOSE_P).length - 1;
      if (n !== 1) fail(`${r.route}: expected the closing band sentence once, found ${n}`);
      if (e.closep) { h = h.replace(CLOSE_P, () => e.closep); q4++; }
      banded++;
    }
    if (e.seo_title) {
      if (e.seo_title.length > 60) fail(`${r.route}: seo_title is ${e.seo_title.length} characters (at most 60)`);
      if (h.split("<title>").length !== 2) fail(`${r.route}: expected one <title>`);
      h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escText(e.seo_title)}</title>`);
      short++;
    }
    // checks: no description cut off mid-sentence, no headline-length <title>
    const desc = decode((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
    if (!desc) bad.push(`${r.route}: no description`);
    else if (/(…|\.\.\.| \.)$/.test(desc)) bad.push(`${r.route}: description ends "${desc.slice(-24)}"`);
    const title = decode((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "").replace(/ \| Kwontified$/, "");
    if (title.length > 65) bad.push(`${r.route}: <title> is ${title.length} characters`);
    fs.writeFileSync(file, h);
  }
  if (bad.length) fail(`${bad.length} archive pages fail the description or title check:\n  ${bad.slice(0, 12).join("\n  ")}`);
  if (pieces < 1000) fail(`expected the whole archive, found ${pieces} pieces`);
  console.log(`site-archive: closing band on ${banded} pieces (fourth-quarter wording on ${q4}), shorter search titles on ${short}; every description ends on a full sentence and every <title> is 65 characters or fewer`);
}
// the newsletter confirmation page shows the three newest articles, now that the archive is listed
{
  const CONFIRM = path.join(ROOT, "public/_kq/subscribe--thank-you.html");
  if (fs.existsSync(CONFIRM)) fs.writeFileSync(CONFIRM, fillLatest(fs.readFileSync(CONFIRM, "utf8"), html));
}
console.log(`site-archive: ${articles.length} articles, ${news.length} news items and ${press.length} press releases added to the Perspectives index (${Math.round(html.length / 1024)} KB)`);
