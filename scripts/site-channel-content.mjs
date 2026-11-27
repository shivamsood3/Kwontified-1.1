// Channel and capability content: the facts a buyer needs, proof beside the work, current reading.
//
// Reviewed 2026-11-27 after site-capchan.mjs (plan scored Capabilities 69/100 and Channels 60/100
// on a content rubric; seven channel pages were thin). site-capchan.mjs already links the case
// cards, folds "Problems we solve" into the first section and caps the capability questions. This
// step adds what those pages still lacked:
//
//   six thin channels   "How <channel> works": the marketplace's own model, markets, requirements,
//                       fulfillment and advertising, each fact checked against the marketplace's
//                       pages (sources below, never shown on the page)
//   brand programs      "What Amazon requires": Brand Registry and Vine
//   seven thin channels "How we work" rewritten as the path from launch to running the account,
//                       with a linked result beside the step it proves, and questions that answer
//                       what to have ready, how long it takes and which options exist
//   17 pages            "Related reading": the newest Perspectives articles for the channel or
//                       topic, chosen at build time from the archive, never older than two years
//   three capabilities  "How we measure it" (Marketplace Operations, Analytics and Forecasting,
//                       Revenue Recovery), in the words the pages already use
//   accuracy            Mercado Libre no longer implies Mercado Envios and Mercado Pago run in all
//                       18 countries; Zalando is "25 markets" everywhere (Zalando's own figure);
//                       Instagram: checkout on your own website, Stories not named for product tags
//
// Owner decisions applied (2026-11-27): Zalando "25 markets"; nothing on whether Temu's fully
// managed model is open to US brands; Instagram "plan for checkout on your own website" and no
// Stories for product tags; Revenue Recovery's window now the owner's one sentence (2026-11-27, QA F063:
// about 30 days for new shortages, two years through a settlement claim; in RevenueRecovery.html and
// CaseStudy.html); "From you" and
// "We report" lines only in wording the site already used; reading chosen by date, never stale.
//
// Sources, all checked 2026-11-27 through search results quoting the official pages (the pages
// themselves could not be fetched from the build environment). Recheck when a fact is edited.
//   Zalando   partner.zalando.com/university/pp/discover-partner-program (marketplace model: partners
//             keep stock, set prices, ship; selective) · .../article/zalando-partner-program-markets
//             (25 markets) · .../article/introduction-to-zalando-fulfillment-solutions (ZFS in 23
//             markets) · .../article/country-specific-onboarding-requirements (KYC; OSS or local VAT
//             per country; ZFS needs a German VAT number) · .../article/onboarding-stage-1-and-2-
//             access-and-master-data and .../onboarding-stage-5-final-revision (staged onboarding in
//             zDirect to a final review and go-live)
//   Mercado   sec.gov/Archives/edgar/data/1099590/000109959025000007/meli-20241231.htm and
//   Libre     .../000109959025000044/meli-20250630.htm (marketplace in 18 countries; Mercado Pago in
//             AR, BR, MX, CL, CO, PE, UY, EC) · developers.mercadolibre.com.ar/es_ar/es_ar/envios-
//             fulfillment (Full in AR, BR, MX, CL, CO) · vendedores.mercadolibre.com.mx/nota/mercado-
//             envios-full-seguridad-y-velocidad-en-tus-entregas/ (Full stores, packs, ships; selling
//             fee plus daily storage) · global-selling.mercadolibre.com/learning-center/news/start-
//             selling-in-latin-america-with-global-selling (MX, BR, CL, CO from one account, in
//             English) · global-selling.mercadolibre.com/help/how-full-works_33647 (Full for Global
//             Selling sellers)
//   Temu      temu.com/about_temu/temu-gold-stevie-award-local-seller-program.html (no registration
//             fee) · seller.temu.com registration help (business type, EIN, registered address,
//             owner identity)
//   TikTok    newsroom.tiktok.com/tiktok-shop-expands-across-europe?lang=en-150 (from 15 June 2026
//   Shop      AT, BE, NL, PL alongside FR, DE, IE, IT, ES, UK) · seller-us.tiktok.com/university/
//             essay?knowledge_id=8644984183162670 (FBT) · ...knowledge_id=2960632903649066 (3-day
//             delivery badge) · ...knowledge_id=3460256793413390 (US registration documents) ·
//             ...knowledge_id=5982454398175018 (referral fee per order, by category) ·
//             ads.tiktok.com/help/article/set-up-tiktok-shopping and .../gmv-max-migration-tiktok-
//             shop-ads (GMV Max the only TikTok Shop ads campaign type from July 2025)
//   Instagram facebook.com/business/help/2296757057080455 (setup requirements) · .../1205792533104321
//             (catalog of physical goods) · .../1627591223954487 (own domain, supported market) ·
//             help.instagram.com/1135563777270082 (products reviewed against Commerce Policies) ·
//             help.instagram.com/772817050237551 (ads with product tags)
//   Target    plus.target.com (invitation-only; US business with W-9, EIN and DUNS; reply within 30
//   Plus      days; 3 to 6 weeks before onboarding) · plus.target.com/pdfs/Eligibility%20Checklist.pdf
//             (75% of agreed items within 75 days of signing; US fulfillment; 24-hour lead time; no
//             competitors' fulfillment services) · corporate.target.com/press/release/2025/11/guests-
//             can-shop-cyber-monday-savings-at-target-like-never-before-using-ai-and-new-digital-
//             features (partner count more than doubled in a year)
//   Amazon    sell.amazon.com/programs/vine (Vine eligibility, countries, exclusions) ·
//             brandservices.amazon.com/brandregistry/eligibility (active or pending trademark)
// Left out because they could not be confirmed: marketplace fee rates (Zalando, Temu, TikTok,
// Target Plus, Vine), Premium Beauty and Creator Connections eligibility, TikTok Shop markets
// outside the US and Europe, Mercado Libre official store eligibility.
//
// Runs right after site-capchan.mjs and before site-filters.mjs: it finds that step's output by
// exact strings and fails if it has changed, so a new export is read before this edits it.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const fail = (m) => { throw new Error("site-channel-content: " + m); };
const ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const routes = new Set(ROUTES.map((r) => r.route));
const fileOf = (route) => { const r = ROUTES.find((x) => x.route === route); if (!r) fail(`${route} is not a page on the site`); return path.basename(r.file); };
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const count = (s, find) => s.split(find).length - 1;
const once = (s, find, put, what) => { const n = count(s, find); if (n !== 1) fail(`${what}: expected once, found ${n} times`); return s.replace(find, () => put); };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&rsquo;/g, "’").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const text = (h) => decode(h.replace(/<\/?(a|span|strong|em|b|i)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const esc = (s) => s.replace(/&(?!amp;|#\d+;|[a-z]+;)/g, "&amp;");
const ARROW = '<span aria-hidden="true">→</span>';
const H2 = "margin: 0; font-weight: 400; font-size: clamp(30px, 2.8vw, 40px); line-height: 1.06; letter-spacing: -0.025em";
const PAD = "padding: clamp(80px, 9vw, 144px) clamp(20px, 4.4vw, 64px) clamp(80px, 9vw, 144px)";

// ------------------------------------------------------------------ a page as its top-level sections
function open(route) {
  const file = fileOf(route), html = read(file);
  if (!html.includes("data-kq-capchan")) fail(`${file}: site-capchan.mjs has not run on it`);
  if (html.includes("data-kq-chcontent")) fail(`${file}: already applied; run the whole build`);
  const a = html.indexOf("<main"), b = html.indexOf("</main>");
  if (a < 0 || b < 0) fail(`${file}: no <main>`);
  const start = html.indexOf(">", a) + 1, main = html.slice(start, b);
  const parts = [];
  let depth = 0, at = 0, from = 0, m;
  const re = /<(\/?)(section|nav)\b[^>]*>/g;
  while ((m = re.exec(main))) {
    if (!m[1]) { if (depth === 0) { if (m.index > from) parts.push(main.slice(from, m.index)); at = m.index; } depth++; }
    else if (--depth === 0) { parts.push(main.slice(at, m.index + m[0].length)); from = m.index + m[0].length; }
  }
  if (from < main.length) parts.push(main.slice(from));
  return { route, file, head: html.slice(0, start), tail: html.slice(b), parts: parts.filter((s) => s.trim()) };
}
const at = (P, needle, what) => {
  const hits = P.parts.map((s, i) => (/^<(section|nav)/.test(s) && s.includes(needle) ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) fail(`${P.file}: ${what || needle}: expected one section, found ${hits.length}`);
  return hits[0];
};
const edit = (P, i, find, put, what) => { P.parts[i] = once(P.parts[i], find, put, `${P.file}: ${what}`); };
const h3s = (s) => [...s.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
const same = (got, want, what) => { if (got.join(" | ") !== want.join(" | ")) fail(`${what} changed.\n   expected: ${want.join(" | ")}\n   found:    ${got.join(" | ")}`); };
const caseLink = (route) => { if (!routes.has(route)) fail(`${route} is not a case study`); return ` <a class="kq-cn-case" href="${route}">Read the case study</a>`; };

// ------------------------------------------------------------------ questions and their structured data
// as in site-capchan.mjs: a closing link-only line stays on the page, not in the structured answer (QA F055)
const answerOf = (h) => text(h.replace(/\s*<a\b[^>]*>[^<.]*<\/a>(\s*<\/p>\s*)$/, "$1"));
function faqOf(html) {
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  return [...main.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({ "@type": "Question", name: text(m[1]), acceptedAnswer: { "@type": "Answer", text: answerOf(m[2]) } }));
}
function faqData(html, file) {
  const qa = faqOf(html);
  let n = 0;
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (all, body) => {
    let j; try { j = JSON.parse(body); } catch { return all; }
    if (j["@type"] !== "FAQPage") return all;
    n++; j.mainEntity = qa;
    return `<script type="application/ld+json">${JSON.stringify(j)}</script>`;
  });
  if (n !== 1) fail(`${file}: expected one FAQPage block, found ${n}`);
  return html;
}
// questions: remove, replace, rewrite an answer, add; the page keeps eight or fewer
function questions(P, { drop = [], answer = {}, add = [] }) {
  const i = at(P, 'id="faq-title"', "the questions");
  let sec = P.parts[i];
  const items = sec.match(/<details\b[\s\S]*?<\/details>/g) || fail(`${P.file}: no questions`);
  const q = (d) => text((d.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || "");
  const find = (name) => { const hit = items.filter((d) => q(d) === name); if (hit.length !== 1) fail(`${P.file}: the question "${name}" was expected once, found ${hit.length}`); return hit[0]; };
  const tpl = items.find((d) => !/^<details open/.test(d)) || fail(`${P.file}: no closed question to copy`);
  const make = (name, a) => tpl.replace(/(<summary\b[^>]*>)[\s\S]*?(<\/summary>)/, (_, o, c) => `${o}${esc(name)}${c}`).replace(/(<\/summary>\s*<p\b[^>]*>)[\s\S]*?(<\/p>\s*<\/details>)$/, (_, o, c) => `${o}${esc(a)}${c}`);
  for (const name of drop) sec = sec.replace(find(name), "");
  for (const [name, [was, now]] of Object.entries(answer)) {
    const d = find(name);
    sec = sec.replace(d, once(d, was, now, `${P.file}: the answer to "${name}"`));
  }
  const last = sec.lastIndexOf("</details>") + "</details>".length;
  sec = sec.slice(0, last) + add.map(([n, a]) => make(n, a)).join("") + sec.slice(last);
  const n = count(sec, "<details");
  if (n > 8 || n < 4) fail(`${P.file}: ${n} questions, expected 4 to 8`);
  for (const [n2] of add) if (count(text(sec), n2) !== 1) fail(`${P.file}: the new question "${n2}" is not there once`);
  P.parts[i] = sec;
  return n;
}

// ------------------------------------------------------------------ "How <channel> works"
const facts = (title, lead, rows) => `<section class="kq-cn-facts" aria-labelledby="facts-title" style="${PAD}"><div style="max-width: 1312px; margin: 0 auto"><h2 id="facts-title" style="${H2}; max-width: 18em">${title}</h2><p class="kq-cn-lead">${esc(lead)}</p><dl class="kq-cn-dl">${rows.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("")}</dl></div></section>`;
function addFacts(P, firstHeading, html) {
  const i = at(P, `>${firstHeading}</h2>`, `the section "${firstHeading}"`);
  if (i !== 1) fail(`${P.file}: "${firstHeading}" is no longer the first section after the introduction`);
  P.parts.splice(i + 1, 0, html);
}
// "How we work": four steps, rewritten; the section goes back to the tinted ground now that the
// white facts section sits between it and the first section
function steps(P, was, now) {
  const i = at(P, 'id="steps-title"', "How we work");
  let sec = P.parts[i];
  same(h3s(sec), was, `${P.file}: the steps under "How we work"`);
  const li = '<li style="background: #E1E9F1; padding: 32px">';
  if (count(sec, li) !== 4 || !sec.startsWith(`<section style="${PAD}">`)) fail(`${P.file}: "How we work" is not laid out as site-capchan.mjs left it`);
  const o = sec.indexOf("<ol "), c = sec.indexOf("</ol>");
  const items = now.map(([h, p]) => `<li style="background: #FDFCFA; padding: 32px"><h3 style="margin: 0; font-weight: 500; font-size: 22px">${esc(h)}</h3><p style="margin: 10px 0 0; font-size: 18px">${p}</p></li>`).join("");
  sec = sec.slice(0, sec.indexOf(">", o) + 1) + items + sec.slice(c);
  report.steps++;
  P.parts[i] = sec.replace(`<section style="${PAD}">`, `<section style="${PAD}; background: #E1E9F1">`);
}

// =====================================================================================
// The Perspectives archive, as site-archive.mjs wrote it into the index page
// =====================================================================================
const ARCHIVE = [];
{
  const html = read(fileOf("/perspectives"));
  for (const m of html.matchAll(/<article data-kq-row[^>]*?data-date="(\d{4}-\d{2}-\d{2})" data-topic="([^"]*)" data-channel="([^"]*)"[^>]*>([\s\S]*?)<\/article>/g)) {
    const a = m[4].match(/<h[23]\b[^>]*>\s*<a\b[^>]*href="(\/perspectives\/[^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h[23]>/) || fail(`an article dated ${m[1]} has no linked title`);
    if (!routes.has(a[1])) fail(`the article ${a[1]} is not a page`);
    if (!ARCHIVE.some((x) => x.url === a[1])) ARCHIVE.push({ date: m[1], topic: decode(m[2]), channel: decode(m[3]), url: a[1], title: a[2].trim() });
  }
  if (ARCHIVE.length < 850) fail(`expected the Perspectives index to hold about 875 articles, found ${ARCHIVE.length}`);
  ARCHIVE.sort((x, y) => y.date.localeCompare(x.date));
}
// "current" is measured from the newest article, so the build gives the same result on any day
const NEWEST = ARCHIVE[0].date;
const OLDEST = `${+NEWEST.slice(0, 4) - 2}${NEWEST.slice(4)}`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fdate = (d) => `${MONTHS[+d.slice(5, 7) - 1]} ${+d.slice(8)}, ${d.slice(0, 4)}`;
// newest first, skipping a piece whose title shares three words in a row with one already chosen
// (three pieces on the same sales event read as one)
const trigrams = (t) => { const w = text(t).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean); return new Set(w.slice(2).map((_, k) => w.slice(k, k + 3).join(" "))); };
const pick = (test, n = 4) => {
  const out = [];
  for (const x of ARCHIVE) {
    if (out.length === n || x.date < OLDEST) break;
    if (!test(x)) continue;
    const g = trigrams(x.title);
    if (out.some((y) => [...trigrams(y.title)].some((t) => g.has(t)))) continue;
    out.push(x);
  }
  return out;
};
const ch = (...names) => (x) => names.includes(x.channel);
const titled = (re, ...channels) => (x) => re.test(text(x.title)) && (!channels.length || channels.includes(x.channel));
const any = (...tests) => (x) => tests.some((t) => t(x));
const READING = {
  "/channels/amazon": ch("Amazon"),
  "/channels/amazon/brand-programs": titled(/Brand Store|creator|Vine|Premium Beauty|Luxury Stores|Brand Registry/i, "Amazon", "All channels"),
  "/channels/walmart": any(ch("Walmart"), titled(/Walmart/)),
  "/channels/target-plus": any(ch("Target Plus"), titled(/Target Plus|Roundel/)),
  "/channels/international": titled(/Europe|Latin America|de minimis|cross-border|international/i, "Multiple channels", "All channels", "Zalando", "Mercado Libre", "Amazon"),
  "/channels/zalando": any(ch("Zalando"), titled(/Zalando/)),
  "/channels/mercado-libre": any(ch("Mercado Libre"), titled(/Mercado Libre|Latin America/)),
  "/channels/temu": any(ch("Temu"), titled(/\bTemu\b|de minimis/i, "Temu", "All channels")),
  "/channels/tiktok-shop": any(ch("TikTok Shop"), titled(/TikTok/)),
  "/channels/instagram-shop": any(ch("Instagram Shop"), titled(/Instagram/)),
  "/capabilities/retail-media": (x) => x.topic === "Retail media",
  "/capabilities/creative-studio": any((x) => x.topic === "Creative and conversion", titled(/visual search|video|images/i)),
  "/capabilities/marketplace-operations": (x) => x.topic === "Operations",
  "/capabilities/analytics-forecasting": any((x) => x.topic === "Analytics", titled(/forecast|incrementality|the \d{4} plan|CFO/i)),
  "/capabilities/revenue-recovery": any(ch("Amazon Vendor Central"), titled(/shortage|chargeback|reimburse|1P or 3P/i)),
};
const reading = (title, items, dark) => `<div class="kq-rr${dark ? " kq-rr-dark" : ""}"><h3>${title}</h3><ul>${items.map((x) => `<li><span class="kq-rr-d">${fdate(x.date)}</span><a href="${x.url}">${x.title}</a></li>`).join("")}</ul><p>All articles in <a href="/perspectives">Perspectives</a> ${ARROW}</p></div>`;
function addReading(P, test, title = "Related reading") {
  const items = pick(test);
  if (items.length < 3) { report.noReading.push(P.route); return 0; }
  const i = P.parts.findIndex((s) => /^<section/.test(s) && /id="(chres|cases)-title"/.test(s) && !s.includes("Related reading"));
  const j = P.parts.findIndex((s, k) => k > i && /^<section/.test(s) && /id="(chres|cases)-title"/.test(s));
  if (i < 0) fail(`${P.file}: no results section to hold the reading`);
  // the last results section on the page ("More results" where there are two)
  const k = j > 0 ? j : i;
  const sec = P.parts[k], end = sec.lastIndexOf("</div></section>");
  if (end < 0) fail(`${P.file}: the results section does not end as expected`);
  P.parts[k] = sec.slice(0, end) + reading(title, items, /^<section style="[^"]*background: #102A4C/.test(sec)) + sec.slice(end);
  report.reading += items.length;
  report.readingPages++;
  return items.length;
}

// "How we measure it", in the form Retail Media and Agentic Commerce use
const measures = (lead, items) => `<section style="${PAD}; background: #E1E9F1"><div style="max-width: 1312px; margin: 0 auto"><div style="display: flex; flex-wrap: wrap; gap: 40px 80px"><div style="flex: 1 1 360px; min-width: 0"><h2 id="measure-title" style="${H2}">How we measure it</h2><p style="margin: 24px 0 0; max-width: 26em">${esc(lead)}</p></div><ul style="flex: 999 1 560px; min-width: 0; margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr)); gap: 12px; font-size: 22px; line-height: 1.4">${items.map((x) => `<li style="background: #FDFCFA; padding: 20px 24px">${esc(x)}</li>`).join("")}</ul></div></div></section>`;

const CSS = `<style data-kq-chcontent>
/* Channel and capability content (scripts/site-channel-content.mjs) */
.kq-cn-lead{margin:24px 0 0;max-width:34em;font-size:18px;line-height:1.5}
.kq-cn-dl{margin:40px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr));gap:0 64px}
.kq-cn-dl>div{border-top:1px solid #C5CCD3;padding:22px 0 26px}
.kq-cn-dl dt{font-size:17px;font-weight:500;line-height:1.3;color:#102A4C}
.kq-cn-dl dd{margin:8px 0 0;font-size:18px;line-height:1.5;max-width:36em}
.kq-cn-case{display:inline-flex;align-items:center;min-height:44px;color:#102A4C;text-underline-offset:4px}
.kq-rr{margin-top:56px;padding-top:28px;border-top:1px solid rgba(16,42,76,.18);text-align:left}
.kq-rr h3{margin:0;font-weight:500;font-size:22px;line-height:1.3}
.kq-rr ul{margin:18px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 40px;font-size:18px;line-height:1.4}
.kq-rr li{min-width:0}
.kq-rr-d{display:block;font-size:15px;color:#626366}
.kq-rr li a{display:inline-flex;align-items:center;min-height:44px;color:#102A4C;text-underline-offset:4px}
.kq-rr p{margin:18px 0 0;font-size:18px}
.kq-rr p a{display:inline-flex;align-items:center;min-height:44px;color:#102A4C}
.kq-rr-dark{border-top-color:rgba(248,246,241,.3)}
.kq-rr-dark .kq-rr-d{color:#C9D4DF}
.kq-rr-dark li a,.kq-rr-dark p a{color:#F8F6F1}
</style>`;

const report = { facts: 0, steps: 0, questions: [], reading: 0, readingPages: 0, noReading: [], measures: 0 };
const PAGES = new Map();
const page = (route) => { if (!PAGES.has(route)) PAGES.set(route, open(route)); return PAGES.get(route); };

// =====================================================================================
// Zalando
// =====================================================================================
{
  const P = page("/channels/zalando");
  addFacts(P, "Zalando across every market and season", facts("How Zalando works", "The Partner Program in brief, as Zalando describes it to its partners.", [
    ["The model", "The Partner Program is Zalando’s marketplace. You keep ownership of your stock, set your own prices and sell directly to Zalando’s customers. Zalando chooses which brands join."],
    ["Markets", "25 European markets."],
    ["Fulfillment", "Ship from your own warehouse, or use Zalando Fulfillment Solutions (ZFS), which stores, ships and handles returns through Zalando’s network. ZFS covers 23 of the 25 markets."],
    ["What Zalando checks", "A know-your-customer review before onboarding and from time to time after it, and a VAT number for each country you sell into, or a registration under the EU’s One-Stop Shop scheme. Using ZFS also needs a German VAT number."],
    ["Getting live", "Onboarding runs in stages in zDirect, Zalando’s partner portal: account access and master data, then product data, then a final review before go-live."],
    ["Advertising", "Bought through Zalando Marketing Services (ZMS)."],
  ]));
  steps(P, ["Pass Zalando’s checks", "Fit every market", "Plan by fashion season", "Cut returns at the source"], [
    ["Choose markets and fulfillment", "We rank Zalando’s 25 markets for your range and decide whether to start from your own warehouse or add Zalando Fulfillment Solutions. From you: your European goals and how you fulfill today."],
    ["Pass Zalando’s checks", "Know-your-customer documents, VAT details for each market and zDirect access, then product data, feed configuration and attribute mapping checked before Zalando’s final review. VAT registrations and the product data to rebuild decide how long this takes."],
    ["Fit every market", "Attributes, size guides and copy for each market and language, reviewed by native speakers, so shoppers order the right size the first time. A US denim brand reached €820K in net sales in its first six months with size data built for European shoppers." + caseLink("/work/eur-820k-net-sales-in-its-first-six-months-on-zalando")],
    ["Plan by season, cut returns", "Imagery, Zalando Marketing Services and stock planned around the European fashion seasons, and the causes of returns fixed in the content that set the wrong expectation. We report sell-through and return rates by product, size and market with your other channels."],
  ]);
  report.questions.push(["Zalando", questions(P, {
    drop: ["What does Kwontified manage on Zalando?"],
    add: [
      ["What do we need before we can sell on Zalando?", "Acceptance into the Partner Program, which is selective; a business that passes Zalando’s know-your-customer review; and VAT registration for each country you sell into, or an EU One-Stop Shop registration. ZFS also needs a German VAT number. We prepare product data, imagery and size mapping while those are in progress."],
      ["Which markets can we sell in?", "Any of Zalando’s 25 markets. We usually recommend starting where your range already sells or your price position is strongest, then adding markets as returns and sell-through prove out. ZFS covers 23 of the 25."],
    ],
  })]);
}

// =====================================================================================
// Mercado Libre
// =====================================================================================
{
  const P = page("/channels/mercado-libre");
  const HERO_WAS = "We run seller accounts across Mercado Libre’s 18 Latin American countries, including Brazil, Mexico, Argentina, Colombia and Chile, and manage listings, advertising, Mercado Envios and Mercado Pago pricing together because they affect each other.";
  const HERO_NOW = "We run seller accounts across Mercado Libre’s Latin American markets, including Brazil, Mexico, Argentina, Colombia and Chile, and manage listings, advertising, shipping and installment pricing together because they affect each other.";
  P.parts[0] = once(P.parts[0], HERO_WAS, HERO_NOW, `${P.file}: the introduction`);
  P.head = P.head.split(HERO_WAS).join(HERO_NOW);
  P.tail = P.tail.split(HERO_WAS).join(HERO_NOW);
  const f = at(P, ">What we manage in each country</h2>");
  edit(P, f, "Registration, tax, payment, shipping and compliance are configured for each country as part of setup, across the 18 where Mercado Libre operates.", "Registration, tax, payment, shipping and compliance are configured for each country you sell in, as part of setup.", "the country setup row");
  addFacts(P, "What we manage in each country", facts("How Mercado Libre works", "The facts that shape a Mercado Libre plan, from Mercado Libre’s own filings and seller pages.", [
    ["Countries", "The marketplace runs in 18 Latin American countries. Mercado Pago, its payments business, runs in eight of them: Argentina, Brazil, Mexico, Chile, Colombia, Peru, Uruguay and Ecuador."],
    ["Two routes in", "A local account in each country, or Global Selling, Mercado Libre’s cross-border program, which lets brands outside Latin America sell in Mexico, Brazil, Chile and Colombia from one account managed in English."],
    ["Listing types", "Clásica or Premium. Premium lets buyers pay in interest-free installments and carries a higher selling fee."],
    ["Fulfillment", "Mercado Envios handles shipping. With Full, you send stock to Mercado Libre’s warehouses and it stores, packs and ships each order; you pay the normal selling fee plus a daily storage charge per unit. Full runs in Argentina, Brazil, Mexico, Chile and Colombia."],
  ]));
  steps(P, ["Set up each country", "Price for installments", "Write for each country", "Advertise by country"], [
    ["Choose the route in", "Global Selling to test demand in Mexico, Brazil, Chile and Colombia from one account, or a local account in each country where you are ready to register and hold stock. From you: your target countries."],
    ["Set up each country", "Registration, tax, payments and shipping configured one country at a time, with Spanish and Portuguese listings written from each country’s search terms."],
    ["Price for installments", "Clásica or Premium listing type and the installment plan chosen per product, so the price shoppers see still clears your margin after fees and financing costs. A personal care brand nearly doubled its margin from 9% this way." + caseLink("/work/mercado-libre-margin-nearly-doubled")],
    ["Stock and advertise by country", "Full where it is available and volume supports its storage charge, Mercado Envios elsewhere, and Mercado Ads budgeted by country and category. We report sales, fees and margin country by country."],
  ]);
  report.questions.push(["Mercado Libre", questions(P, {
    drop: ["Do you write listings in Spanish and Portuguese?"],
    answer: {
      "Which countries do you manage?": ["All 18 countries where Mercado Libre operates, including Brazil, Mexico, Argentina, Colombia and Chile, with setup, tax, payment and shipping configured for each.", "Any of the 18 countries where Mercado Libre operates, including Brazil, Mexico, Argentina, Colombia and Chile. Payments, shipping and tax differ by country: Mercado Pago runs in eight of them and Full in five, so we set each country up on its own."],
      "Do you use Mercado Envios?": ["inventory positioning and delivery performance in each country.", "inventory positioning and delivery performance in each country. Where Full is available, we decide product by product whether holding stock in Mercado Libre’s warehouses pays for its storage charge."],
    },
    add: [["Do we need a company or stock in each country?", "Not to start. Global Selling lets brands outside Latin America sell in Mexico, Brazil, Chile and Colombia from one account. Once a country proves itself, Full lets you hold stock in Mercado Libre’s warehouses there."]],
  })]);
}

// =====================================================================================
// Temu
// =====================================================================================
{
  const P = page("/channels/temu");
  P.parts[0] = once(P.parts[0], "We choose the model with you and run the account so you gain volume without eroding margin elsewhere. Temu runs two seller models: fully managed, where Temu sets the retail price, and a local seller program, where you ship from your own inventory and set price within Temu’s rules.", "We choose Temu’s seller model with you and run the account so you gain volume without eroding margin elsewhere.", `${P.file}: the introduction`);
  addFacts(P, "Temu, run on your brand’s terms", facts("How Temu works", "The two ways to sell on Temu, and what registration asks for.", [
    ["Fully managed", "You supply stock, and Temu sets the retail price and runs much of the operation."],
    ["Local seller program", "You list, ship from your own inventory and set the price within Temu’s rules."],
    ["Registration", "Temu charges no registration fee. Sellers register with business details, including an EIN and a registered business address, and identity details for owners or representatives."],
  ]));
  steps(P, ["Decide what belongs on Temu", "Set prices and floors", "Qualify and list", "Join flash sales on your terms"], [
    ["Decide what belongs on Temu", "The seller model, fully managed or local seller program, and the products that should and should not go on Temu, agreed with you before anything is listed. From you: your catalog and price position."],
    ["Set prices and floors", "Margin floors on the local seller program, or supply prices that hold your margin at Temu’s retail price on fully managed, so Temu does not undercut your other channels. Price floors tied to Amazon kept a kitchen tools brand’s Amazon featured offer." + caseLink("/work/selling-on-temu-without-losing-the-amazon-buy-box")],
    ["Qualify and list", "Registration, category qualification, policy compliance, payment and tax, then listings built so the product and its value are clear in the first image."],
    ["Join flash sales on your terms", "Flash sales joined only when stock and price are confirmed, with seller standing and margin tracked through each one. We report margin at Temu’s prices beside your other channels."],
  ]);
  report.questions.push(["Temu", questions(P, {
    drop: ["Will Temu hurt our brand’s positioning?", "Will selling on Temu undercut our pricing elsewhere?"],
    add: [
      ["Will Temu hurt our brand or our prices elsewhere?", "It can if it is not planned. Before launch we decide which products belong on Temu and which stay off it, and listings follow your brand guidelines. On the local seller program we set margin floors before launch; on fully managed, supply prices that hold your margin at Temu’s retail price, so Temu does not undercut the channels that carry the brand."],
      ["What do we need to register on Temu?", "Your business details, including your EIN and registered business address, and identity details for owners or representatives. Temu charges no registration fee. We handle category qualification, policy compliance, payment and tax setup from there."],
    ],
  })]);
}

// =====================================================================================
// TikTok Shop
// =====================================================================================
{
  const P = page("/channels/tiktok-shop");
  addFacts(P, "Your TikTok Shop, creators and ads", facts("How TikTok Shop works", "Where the shop runs, who can sell and how orders and ads work, from TikTok’s own pages.", [
    ["Where it runs", "In the US and ten European markets, including the UK, Germany, France, Italy and Spain. Austria, Belgium, the Netherlands and Poland joined in June 2026."],
    ["Who can sell in the US", "US businesses and residents. Registration needs a US photo ID and proof of address and, for a company, an IRS notice showing its EIN."],
    ["Fees", "A referral fee on each order, set by category."],
    ["Fulfillment", "Ship orders yourself, or use Fulfilled by TikTok (FBT): stock goes to TikTok’s US fulfillment centers, and TikTok stores, picks, packs, ships and handles returns. Eligible FBT items can show a free 3-day delivery badge."],
    ["Advertising", "Since July 2025 GMV Max has been the only campaign type for TikTok Shop ads, in Product GMV Max and LIVE GMV Max versions."],
  ]));
  steps(P, ["Open the shop", "Build a creator bench", "Make and scale what sells", "Judge on Shop sales"], [
    ["Open the shop and choose fulfillment", "Registration, verification, category approval, payment and catalog integration, so products can be tagged in videos and LIVE streams, and a decision on Fulfilled by TikTok weighed against your own fulfillment cost."],
    ["Build a creator bench", "Creators chosen for audience fit, briefed and seeded with product through TikTok Shop’s affiliate program, with commissions set against your margin. A skincare brand grew affiliate sales from $380K in the first half of one year to $2.3M in the first half of the next." + caseLink("/work/affiliate-sales-from-380k-to-2-3m-in-a-year")],
    ["Make and scale what sells", "Shoppable video from the Creative Studio alongside creator posts, with the posts that sell amplified through Spark Ads and GMV Max, and stock planned for the spikes. A drinkware brand sold 66,800 tumblers in 12 weeks without running out." + caseLink("/work/in-stock-through-a-viral-spike")],
    ["Judge on Shop sales", "Results by campaign, creator and LIVE event, with GMV Max return on ad spend and creator commissions counted, so budget follows what earns."],
  ]);
  report.questions.push(["TikTok Shop", questions(P, {
    drop: ["How do you run TikTok Shop ads?", "Can you produce the video?"],
    answer: { "What kind of video works on TikTok Shop?": ["Heavily produced spots often underperform there.", "Heavily produced spots often underperform there. The Creative Studio produces it, including AI video where it fits the brand, alongside creator content."] },
    add: [["Should we use Fulfilled by TikTok?", "Often, once volume is steady. FBT stores, packs and ships orders from TikTok’s US fulfillment centers, and eligible items can show a free 3-day delivery badge. We compare its fees with your current fulfillment cost and plan stock for demand spikes before moving inventory."]],
  })]);
}

// =====================================================================================
// Instagram Shop
// =====================================================================================
{
  const P = page("/channels/instagram-shop");
  P.parts[0] = once(P.parts[0], "Instagram sells through product tags in posts, Stories and Reels, and through the shop on your profile, with checkout on your own website.", "Instagram sells through product tags in posts and Reels, and through the shop on your profile, with checkout on your own website.", `${P.file}: the introduction`);
  const D_WAS = "so each post, Story and Reel can lead to a sale through product tags and your shop.";
  if (!P.head.includes(D_WAS)) fail(`${P.file}: the page description changed`);
  P.head = P.head.split(D_WAS).join("so each post and Reel can lead to a sale through product tags and your shop.");
  addFacts(P, "Your Instagram Shop, run as one program", facts("How Instagram Shop works", "What Meta asks for before a shop can sell, and where the sale happens.", [
    ["What you need", "An Instagram professional account, a catalog of physical products in Meta Commerce Manager, product pages on a website domain you own, and a business located in a market Meta supports."],
    ["Review", "Meta reviews the shop and each product against its Commerce Policies before products can be tagged."],
    ["Where shoppers find products", "Product tags in posts and Reels, the shop on your profile, and ads with product tags."],
    ["Where the sale happens", "Tags and the shop link to product pages on your own website, so that is where checkout, and its measurement, happen."],
  ]));
  steps(P, ["Connect the shop", "Plan shoppable content", "Run Meta advertising", "Prove what sells"], [
    ["Connect the shop", "Meta Commerce Manager, a catalog synced to your stock and price, product tags, and the Meta pixel and Conversions API on your site, so every sale from Instagram can be measured. From you: your catalog and current Meta setup. A jewelry brand grew Instagram-referred revenue 45% after its catalog and tags were rebuilt." + caseLink("/work/instagram-referred-revenue-up-45-after-rebuilding-its-catalog")],
    ["Plan shoppable content", "One calendar for feed posts, Reels and creator posts, with products tagged in posts and Reels and the Creative Studio producing the assets."],
    ["Run Meta advertising", "Advantage+ sales campaigns, Advantage+ catalog ads and ads with product tags, aimed at site visitors, engaged followers and lookalikes, with existing customers excluded from prospecting."],
    ["Prove what sells", "Purchases on your site attributed to Instagram and read beside your site analytics, so you can see which posts, creators and ads drive sales. A pet food brand raised 90-day revenue per new customer from $64 to $88." + caseLink("/work/90-day-revenue-per-new-customer-from-64-to-88")],
  ]);
  report.questions.push(["Instagram Shop", questions(P, {
    answer: { "Can customers check out inside Instagram?": ["No. Product tags in feed posts, Stories, Reels and the shop on your profile send shoppers to checkout on your own website. Meta has phased out native checkout for Shops.", "Plan for checkout on your own website. Product tags and the shop on your profile link to product pages on your site, so that is where the sale happens and where it has to be measured."] },
    add: [["What do we need to open an Instagram Shop?", "An Instagram professional account, a product catalog in Meta Commerce Manager, product pages on a domain you own, and a business in a market Meta supports. Meta reviews the shop and products before tags go live. We set up the catalog and the Meta pixel and Conversions API at the same time, so sales can be measured from the first post."]],
  })]);
}

// =====================================================================================
// Target Plus
// =====================================================================================
{
  const P = page("/channels/target-plus");
  addFacts(P, "Target Plus, from onboarding to Roundel", facts("How Target Plus works", "What Target asks of its marketplace partners, from Target’s own seller pages.", [
    ["Access", "Invitation-only. Target chooses partners whose products complement its own assortment. It aims to reply to applicants within 30 days, and its selection process typically takes three to six weeks before onboarding begins."],
    ["Who qualifies", "A US-based business registered under US law, able to provide a W-9, an EIN and a DUNS number."],
    ["Onboarding", "Partners commit to bringing 75% of their agreed items live within 75 days of signing the Target Plus contract."],
    ["Fulfillment", "Orders ship from your own US fulfillment with a 24-hour lead time. Fulfillment services run by Target’s competitors cannot be used."],
    ["Advertising", "Target Product Ads in Roundel Media Studio, shown on Target.com and in the Target app."],
    ["Momentum", "Target says it more than doubled its number of Target Plus partners in the year to November 2025."],
  ]));
  steps(P, ["Launch on the first submission", "Build to Target’s standards", "Protect partner standing", "Grow with Roundel"], [
    ["Commit to the right items", "Once Target invites you, we help choose the items to commit to in your contract, because Target expects 75% of them live within 75 days of signing."],
    ["Launch on the first submission", "Catalog integration, product data, taxonomy and imagery built to Target’s specifications and checked before the first submission. A bedding brand took 1,140 items live in nine weeks, with 97% approved first time." + caseLink("/work/live-on-target-plus-in-9-weeks")],
    ["Protect partner standing", "Inventory, the 24-hour lead time, fulfillment, pricing and price-match commitments monitored against the standards in your partner agreement, with gaps fixed before Target flags them."],
    ["Grow with Roundel", "Target Product Ads in Roundel Media Studio, reaching guests on Target.com and the Target app, with results in your Target Plus dashboard. A clean skincare brand raised always-on Roundel ROAS from 2.4x to 3.9x." + caseLink("/work/always-on-roundel-roas-from-2-4x-to-3-9x")],
  ]);
  report.questions.push(["Target Plus", questions(P, {
    drop: ["What content does Target Plus require?"],
    answer: { "Can you help us get invited to Target Plus?": ["Target Plus is invitation-only, and Target decides which brands join.", "Target Plus is invitation-only, and Target decides which brands join. Target aims to reply to applicants within 30 days, and its selection process typically takes three to six weeks."] },
    add: [["How long does onboarding take?", "Target asks partners to bring 75% of their agreed items live within 75 days of signing. With catalog data built to Target’s specifications before submission, a bedding brand took 1,140 items live in nine weeks."]],
  })]);
}

// =====================================================================================
// Amazon brand programs
// =====================================================================================
{
  const P = page("/channels/amazon/brand-programs");
  addFacts(P, "The four programs", facts("What Amazon requires", "Two requirements every brand program plan starts from, from Amazon’s own seller pages.", [
    ["Brand Registry", "Vine and most of Amazon’s brand tools need Brand Registry, which requires an active or pending trademark shown on the product or its packaging."],
    ["Amazon Vine", "A Professional selling account and Brand Registry, products fulfilled by Amazon (FBA) with fewer than 30 reviews, and for a new product a customer-ready FBA listing with a launch date. Adult, digital and bundled products are excluded. Vine runs in the US, Canada, the UK, France, Germany, Italy, Spain, Australia and Japan."],
  ]));
  steps(P, ["Check eligibility", "Model the return", "Prepare for Amazon’s review", "Keep what pays back"], [
    ["Check eligibility", "Brand Registry first, since Vine and most brand tools need it, then your brand and catalog against what Vine, Premium Beauty, Luxury Stores and Creator Connections each look for, so you know which are open now and which need preparation."],
    ["Model the return", "Vine units against the expected conversion lift, Creator Connections commission against your margin, and the Storefront and content investment a luxury program needs, before you commit."],
    ["Prepare for Amazon’s review", "Storefront, A+ Content and catalog presentation brought up to each program’s standard, with onboarding managed once you are accepted. A clinical skincare brand was accepted into Premium Beauty 11 weeks after it applied." + caseLink("/work/sales-up-64-after-entering-premium-beauty")],
    ["Keep what pays back", "Reviews, conversion and creator sales tracked program by program, with enrollment and creator campaigns timed to launches and advertising, so you keep only the programs that earn their cost. A fine jewelry brand raised Luxury Stores conversion from 3.4% to 5.1%." + caseLink("/work/luxury-stores-conversion-from-3-4-to-5-1")],
  ]);
  report.questions.push(["Brand programs", questions(P, {
    // the full requirements are in "What Amazon requires" above; the answer points there rather
    // than repeating the paragraph word for word (QA F058)
    add: [["What does Amazon Vine require?", 'In short: Brand Registry, FBA, and fewer than 30 reviews on the product. The full list, including the countries where Vine runs, is under <a href="#facts-title">What Amazon requires</a>, above. We model the cost of the units against the expected conversion lift before you enroll.']],
  })]);
}

// =====================================================================================
// International: Zalando's own count
// =====================================================================================
{
  const P = page("/channels/international");
  const i = at(P, ">Where we sell for you</h2>");
  edit(P, i, '<span>Zalando</span><span class="kq-mn">27 countries</span>', '<span>Zalando</span><span class="kq-mn">25 markets</span>', "the Zalando map button");
  const j = at(P, "Choosing the route into each market");
  edit(P, j, "<td>More than 25 European markets</td>", "<td>25 European markets</td>", "the Zalando row of the route table");
}

// =====================================================================================
// Capabilities: how we measure it
// =====================================================================================
const MEASURES = {
  "/capabilities/marketplace-operations": [">Marketplace operations we own end to end</h2>", "The measures every operations report starts with, so issues show before they reach revenue.", ["Weeks of cover against target", "Suppressed listings and compliance flags", "Account health and Buy Box ownership", "Fill rate, chargebacks and shortage claims on Vendor Central", "Inventory age against Amazon’s aged inventory thresholds"]],
  "/capabilities/analytics-forecasting": [">What we build</h2>", "Dashboards and forecasts run on the same numbers, and are read against the same measures.", ["Sales and contribution margin against the plan, by scenario", "Incremental sales from lift studies", "Acquisition cost against lifetime value", "Cover and order-by dates per SKU", "TACoS and ROAS in one cross-channel view"]],
  "/capabilities/revenue-recovery": [">What we recover and prevent</h2>", "Recovery is reported by claim type, so you can see what came back and what stopped recurring.", ["Value recovered, by claim type", "What is still recoverable, by claim type", "Claims filed inside Amazon’s windows", "Shortages and chargebacks by type and root cause", "Reversed reimbursements tracked"]],
};
for (const [route, [after, lead, items]] of Object.entries(MEASURES)) {
  const P = page(route);
  if (P.parts.some((s) => s.includes(">How we measure it</h2>"))) fail(`${P.file}: already has "How we measure it"`);
  const i = at(P, after);
  if (!/background: #102A4C/.test(P.parts[i + 1].slice(0, 300)) || !P.parts[i + 1].includes('id="proof-title"')) fail(`${P.file}: the featured case no longer follows "${text(after)}"`);
  P.parts.splice(i + 1, 0, measures(lead, items));
  report.measures++;
}

// =====================================================================================
// Related reading on 16 pages; channel comparisons on /channels
// =====================================================================================
for (const [route, test] of Object.entries(READING)) addReading(page(route), test);
{
  const P = page("/channels"), i = at(P, 'aria-label="Where we operate"');
  const items = pick(ch("Multiple channels"), 5);
  if (items.length < 3) fail(`${P.file}: fewer than three channel comparisons in Perspectives`);
  const sec = P.parts[i], end = sec.lastIndexOf("</div></section>");
  P.parts[i] = sec.slice(0, end) + reading("Choosing between channels", items, false) + sec.slice(end);
  report.reading += items.length;
  report.readingPages++;
}
// Agentic Commerce keeps its own block; it must still be there
if (!page("/capabilities/agentic-commerce").parts.some((s) => s.includes(">Related reading</h3>"))) fail("Agentic Commerce lost its related reading");

// =====================================================================================
// Write, and check what was written
// =====================================================================================
for (const P of PAGES.values()) {
  let html = P.head + "\n" + P.parts.join("\n") + "\n" + P.tail;
  html = once(html, "</head>", CSS + "</head>", `${P.file}: </head>`);
  html = faqData(html, P.file);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, k) => ids.indexOf(x) !== k);
  if (dup.length) fail(`${P.file}: an id is used twice: ${[...new Set(dup)].join(", ")}`);
  for (const m of main.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const [p, hash] = m[1].split("#");
    if (p.startsWith("/") && !p.startsWith("/assets/") && !routes.has(p.split("?")[0])) fail(`${P.file}: a link points to ${p}, which is not a page`);
    if (hash && !p && !ids.includes(hash)) fail(`${P.file}: a link points to #${hash}, which is not on the page`);
  }
  const t = text(main);
  for (const bad of ["Meta has phased out native checkout", "27 countries", "More than 25 European markets", "posts, Stories and Reels", "across the 18 where Mercado Libre operates"]) if (t.includes(bad)) fail(`${P.file}: "${bad}" is still on the page`);
  fs.writeFileSync(path.join(DIR, P.file), html);
  if (P.parts.some((s) => s.includes("kq-cn-facts"))) report.facts++;
}
console.log(`site-channel-content: marketplace facts on ${report.facts} channel pages; "How we work" rewritten on ${report.steps} with linked results; questions now ${report.questions.map(([n, k]) => `${n} ${k}`).join(", ")}; "How we measure it" on ${report.measures} capability pages; ${report.reading} Perspectives articles linked on ${report.readingPages} pages (newest ${NEWEST}, none before ${OLDEST})${report.noReading.length ? `; no current reading for ${report.noReading.join(", ")}` : ""}; Zalando 25 markets on International`);
