// Capabilities and Channels: proof that opens, one home for each thing, onward paths.
//
// Reviewed 2026-11-27 (Capabilities 58/100, Channels 59/100) and approved by Jordan. In the
// export 33 of the 36 case study cards on these 18 pages opened the Work index and two opened
// the wrong case study; the review button sat below the first screen on every phone; the two
// AI assistants were described in full on three pages each; seven channel pages said the same
// thing twice ("Problems we solve" restated the first section); and nothing on a capability
// page said which channels it runs on. This step:
//
//   all 18 pages      every case study card opens its own case study (matched by title to the
//                     case study pages); the review button is on a phone's first screen; hero
//                     figures link to their case study; capability links use the house names
//   capability pages  "Where this applies" (the channels whose own page describes the
//                     capability), a hero figure, a featured case on all six, at most eight
//                     questions with the structured data in step, client logos
//   /capabilities     each card's figure says what it measures and opens its case study; a
//                     capability-by-channel table built from the channel pages
//   /channels         each channel's hero figure on its card; Temu is a marketplace; the two
//                     questions copied from the home page are gone; client logos
//   Amazon, Walmart   the assistant sections become a summary that points to Agentic Commerce
//   seven channels    "Problems we solve" folded into the first section as problem and answer
//
// The capability-by-channel truth is read from the channel pages' own "How each capability
// works on ..." blocks, never typed here. Client logos are left as <!--kq-logos:clients-->
// markers that site-logos.mjs fills once it has written the logo files.
//
// Runs after site-about.mjs and before site-seo.mjs. Fails if the markup or the copy it
// rewrites has changed, so a new export is looked at before this rearranges it.
//   node scripts/site-capchan.mjs --check   runs at the end of the build: every matched card
//   still opens its case study, logos are in place, questions and structured data agree.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const CHECK = process.argv.includes("--check");
const fail = (m) => { throw new Error("site-capchan: " + m); };
const ROUTES = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const routes = new Set(ROUTES.map((r) => r.route));
const fileOf = (route) => { const r = ROUTES.find((x) => x.route === route); if (!r) fail(`${route} is not a page on the site`); return path.basename(r.file); };
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const count = (s, find) => s.split(find).length - 1;
const once = (s, find, put, what) => { const n = count(s, find); if (n !== 1) fail(`${what}: expected once, found ${n} times`); return s.replace(find, () => put); };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&rsquo;/g, "’").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
// text as a browser reads it: inline tags join, block tags separate
const text = (h) => decode(h.replace(/<\/?(a|span|strong|em|b|i)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const norm = (s) => text(s).toLowerCase().replace(/€/g, "eur ").replace(/[^a-z0-9]+/g, " ").trim();
const esc = (s) => s.replace(/&(?!amp;)/g, "&amp;");

// ------------------------------------------------------------------ the pages
const CAPS = [
  { route: "/capabilities/retail-media", name: "Retail Media and Advertising", fig: "6.8x", label: "Omnichannel ROAS from Walmart display for a baby food supplier, with 62% of attributed sales in stores.", work: "/work/6-8x-omnichannel-roas-from-walmart-display" },
  { route: "/capabilities/creative-studio", name: "Creative Studio", fig: "+64%", label: "Sales for a clinical skincare brand after its rebuilt pages and Storefront helped it enter Premium Beauty.", work: "/work/sales-up-64-after-entering-premium-beauty" },
  { route: "/capabilities/marketplace-operations", name: "Marketplace Operations", fig: "71%", label: "Of a cashmere label’s first-season Amazon allocation sold at full price.", work: "/work/71-of-its-first-season-amazon-allocation-sold-at-full-price" },
  { route: "/capabilities/analytics-forecasting", name: "Analytics and Forecasting", fig: "7 weeks", label: "To break-even ad cost for an oral care launch, against a plan of 12 weeks.", work: "/work/break-even-ad-cost-in-7-weeks-not-12" },
  { route: "/capabilities/agentic-commerce", name: "Agentic Commerce", fig: "23 of 40", label: "Tracked Alexa for Shopping answers that include a sleep brand, up from 6.", work: "/work/from-6-to-23-of-40-alexa-for-shopping-answers" },
  { route: "/capabilities/revenue-recovery", name: "Revenue Recovery", fig: "$781K", label: "Shortage claims recovered for a kitchen appliance vendor on Vendor Central.", work: "/work/shortage-claims" },
];
// channel pages, in the order the site lists them once Temu sits with the marketplaces
const CHANNELS = [
  { route: "/channels/amazon", name: "Amazon", fig: "+22%", work: "/work/sales-up-22-while-tacos-fell-3-7-points" },
  { route: "/channels/amazon/brand-programs", name: "Amazon brand programs", short: "Brand programs", fig: "+64%", work: "/work/sales-up-64-after-entering-premium-beauty" },
  { route: "/channels/walmart", name: "Walmart", fig: "6.8x", work: "/work/6-8x-omnichannel-roas-from-walmart-display" },
  { route: "/channels/target-plus", name: "Target Plus", fig: "9 weeks", work: "/work/live-on-target-plus-in-9-weeks" },
  { route: "/channels/temu", name: "Temu", fig: "41,200", work: "/work/41-200-aged-units-cleared-through-temu" },
  { route: "/channels/international", name: "International", fig: "2x", work: "/work/conversion-doubled-on-amazon-uk-after-localizing-its-pages" },
  { route: "/channels/zalando", name: "Zalando", fig: "78%", work: "/work/78-of-winter-stock-sold-with-shallower-markdowns" },
  { route: "/channels/mercado-libre", name: "Mercado Libre", fig: "312 to 12", work: "/work/infringing-listings-cut-from-312-to-12" },
  { route: "/channels/tiktok-shop", name: "TikTok Shop", fig: "$2.3M", work: "/work/affiliate-sales-from-380k-to-2-3m-in-a-year" },
  { route: "/channels/instagram-shop", name: "Instagram Shop", fig: "+45%", work: "/work/instagram-referred-revenue-up-45-after-rebuilding-its-catalog" },
];
for (const c of [...CAPS, ...CHANNELS]) { c.file = fileOf(c.route); fileOf(c.work); }
const INDEX_CAP = fileOf("/capabilities"), INDEX_CH = fileOf("/channels");
const FILES = [INDEX_CAP, ...CAPS.map((c) => c.file), INDEX_CH, ...CHANNELS.map((c) => c.file)];
const LOGO_PAGES = [INDEX_CAP, ...CAPS.map((c) => c.file), INDEX_CH, fileOf("/channels/amazon")];

// ------------------------------------------------------------------ the case studies, by title
const CASES = new Map();
for (const r of ROUTES) {
  if (!r.route.startsWith("/work/") || r.route === "/work/creative") continue;
  const h1 = (read(path.basename(r.file)).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || fail(`${r.route}: no heading`))[1];
  const key = norm(h1);
  if (CASES.has(key)) fail(`two case studies share the title "${text(h1)}"`);
  CASES.set(key, { route: r.route, body: read(path.basename(r.file)) });
}
if (CASES.size < 20) fail(`expected about 25 case studies, found ${CASES.size}`);
const CARD = /<a class="kq-ccard" href="([^"]*)"([\s\S]*?)<\/a>/g;
const cardTitle = (inner) => (inner.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/) || fail("a case study card has no title"))[1];

// ------------------------------------------------------------------ a page as its top-level sections
function open(file) {
  const html = read(file);
  const a = html.indexOf("<main"), b = html.indexOf("</main>");
  if (a < 0 || b < 0) fail(`${file}: no <main>`);
  const start = html.indexOf(">", a) + 1, main = html.slice(start, b);
  const parts = [];
  let depth = 0, at = 0, from = 0, m;
  const re = /<(\/?)section\b[^>]*>/g;
  while ((m = re.exec(main))) {
    if (!m[1]) { if (depth === 0) { if (m.index > from) parts.push(main.slice(from, m.index)); at = m.index; } depth++; }
    else if (--depth === 0) { parts.push(main.slice(at, m.index + m[0].length)); from = m.index + m[0].length; }
  }
  if (from < main.length) parts.push(main.slice(from));
  // the line breaks between sections are not content
  return { file, html, head: html.slice(0, start), tail: html.slice(b), parts: parts.filter((s) => s.trim()) };
}
const at = (P, needle, what) => {
  const hits = P.parts.map((s, i) => (s.startsWith("<section") && s.includes(needle) ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) fail(`${P.file}: ${what || needle}: expected one section, found ${hits.length}`);
  return hits[0];
};
const edit = (P, i, find, put, what) => { P.parts[i] = once(P.parts[i], find, put, `${P.file}: ${what}`); };
const h3s = (s) => [...s.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
const same = (got, want, what) => { if (got.join(" | ") !== want.join(" | ")) fail(`${what} changed.\n   expected: ${want.join(" | ")}\n   found:    ${got.join(" | ")}`); };

// the questions in the page's structured data follow the questions on the page
// an answer that ends in a link with no sentence of its own ("See the case studies") keeps the
// link on the page but not in the structured answer, where it read as a fragment (QA F055)
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

// =====================================================================================
// --check: the end of the build. Later steps must not have undone any of this.
// =====================================================================================
if (CHECK) {
  let cards = 0, logos = 0, questions = 0, links = 0;
  for (const f of FILES) {
    const html = read(f), main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    if (!html.includes("data-kq-capchan")) fail(`${f}: this step did not run on it`);
    for (const m of main.matchAll(CARD)) {
      const hit = CASES.get(norm(cardTitle(m[2])));
      if (hit && m[1] !== hit.route) fail(`${f}: the card "${text(cardTitle(m[2]))}" opens ${m[1]}, not ${hit.route}`);
      if (hit) cards++;
    }
    if (html.includes("<!--kq-logos:")) fail(`${f}: a logo marker was not filled`);
    if (LOGO_PAGES.includes(f)) {
      const band = (main.match(/<section id="clients" class="kq-cc-proof"[\s\S]*?<\/section>/) || fail(`${f}: no client logo band`))[0];
      const n = count(band, '<img src="/assets/logo-');
      if (n !== 15) fail(`${f}: expected 15 client logos, found ${n}`);
      if (/<blockquote|<figure/.test(band)) fail(`${f}: the client band must hold logos only`);
      logos += n;
    }
    const qa = faqOf(html);
    let ld = null;
    for (const s of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      let j; try { j = JSON.parse(s[1]); } catch { continue; }
      for (const g of j["@graph"] || [j]) if (g["@type"] === "FAQPage") ld = g.mainEntity;
    }
    if (!ld || ld.length !== qa.length || ld.some((q, i) => q.name !== qa[i].name || q.acceptedAnswer.text !== qa[i].acceptedAnswer.text)) fail(`${f}: the questions in the structured data do not match the page`);
    questions += qa.length;
    for (const m of main.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)[^"]*"/g)) {
      if (m[1].startsWith("/assets/")) continue;
      if (!routes.has(m[1].replace(/(.)\/$/, "$1"))) fail(`${f}: a link points to ${m[1]}, which is not a page`);
      links++;
    }
  }
  console.log(`site-capchan --check: ${cards} case study cards open their case study, ${logos} client logos on ${LOGO_PAGES.length} pages, ${questions} questions match their structured data, ${links} internal links resolve`);
  process.exit(0);
}

// =====================================================================================
// Shared markup and styles
// =====================================================================================
const WRAP = '<div style="max-width: 1312px; margin: 0 auto">';
const H2 = "margin: 0; font-weight: 400; font-size: clamp(30px, 2.8vw, 40px); line-height: 1.06; letter-spacing: -0.025em";
const ARROW = '<span aria-hidden="true">→</span>';
const LOGOS = `<section id="clients" class="kq-cc-proof" aria-labelledby="clients-title">${WRAP}<h2 id="clients-title">Selected clients</h2><!--kq-logos:clients--></div></section>`;

const CSS = `<style data-kq-capchan>
/* Capabilities and Channels (scripts/site-capchan.mjs) */
.kq-cc-figlink{display:inline-flex;align-items:center;min-height:44px;margin-top:6px;font-size:17px;text-underline-offset:4px}
/* where a capability applies */
.kq-cc-where{background:#FDFCFA;border-bottom:1px solid #D3D9DF;padding:12px clamp(20px,4.4vw,64px)}
.kq-cc-where>div{max-width:1312px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px 28px}
.kq-cc-where h2{margin:0;font-size:17px;font-weight:500;line-height:1.3;letter-spacing:0;color:#102A4C}
.kq-cc-where ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.kq-cc-where a{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;box-sizing:border-box;border:1px solid #9AA7B4;border-radius:14px;background:#F8F6F1;color:#102A4C;font-size:16px;text-decoration:none;white-space:nowrap}
.kq-cc-where a:hover{background:#102A4C;border-color:#102A4C;color:#F8F6F1}
.kq-cc-where p{margin:0;font-size:16px;color:#4A4D52}
/* client logos, as a band */
.kq-cc-proof{padding:clamp(40px,4.4vw,64px) clamp(20px,4.4vw,64px);background:#FDFCFA}
.kq-cc-proof h2{margin:0;font-size:17px;font-weight:500;line-height:1.3;letter-spacing:0;color:#4A4D52;text-align:center}
.kq-cc-proof .kq-ab-logowrap{margin-top:20px}
.kq-cc-proof .kq-ab-logowrap ul{gap:8px 28px!important;justify-content:center}
.kq-cc-proof .kq-ab-logowrap li{flex:0 1 136px!important;min-height:60px!important}
.kq-cc-proof .kq-ab-logowrap img{max-width:100%;height:auto!important}
/* capability cards on the index: the figure is its own link */
.kq-cc-cap{display:flex;flex-direction:column;background:#FDFCFA;min-height:340px}
.kq-cc-capmain{flex:1 1 auto}
.kq-cc-capfig{display:block;margin:28px clamp(28px,3vw,44px) clamp(28px,3vw,44px);padding-top:22px;border-top:1px solid #D3D9DF;color:#262524;text-decoration:none}
.kq-cc-n{display:block;font-size:clamp(28px,2.4vw,38px);line-height:1.15;letter-spacing:-.02em;color:#102A4C;font-variant-numeric:tabular-nums}
.kq-cc-l{display:block;margin-top:8px;font-size:16px;line-height:1.45}
.kq-cc-m{display:inline-block;margin-top:10px;font-size:15px;color:#102A4C;text-decoration:underline;text-underline-offset:4px}
.kq-cc-capfig:hover .kq-cc-m{text-decoration-thickness:2px}
/* capability by channel */
.kq-cc-mx{width:100%;margin:40px 0 0;border-collapse:collapse;font-size:16px;line-height:1.3;background:#FDFCFA}
.kq-cc-mx th,.kq-cc-mx td{border-bottom:1px solid #D3D9DF;padding:0;text-align:center;vertical-align:middle}
.kq-cc-mx thead th,.kq-cc-mx thead td{background:#E1E9F1;font-weight:500;font-size:15px;vertical-align:bottom}
.kq-cc-mx tbody th{text-align:left;font-weight:500;width:22%}
.kq-cc-mx th a{display:flex;align-items:center;justify-content:center;min-height:56px;padding:8px 6px;color:#102A4C;text-decoration:none}
.kq-cc-mx tbody th a{justify-content:flex-start;padding:8px 20px}
.kq-cc-mx th a:hover{text-decoration:underline;text-underline-offset:4px}
.kq-cc-mx td a{display:flex;align-items:center;justify-content:center;min-height:56px;color:#102A4C;text-decoration:none}
.kq-cc-mx td a:hover{background:#E1E9F1}
.kq-cc-dot{display:block;width:12px;height:12px;border-radius:50%;background:#102A4C}
.kq-cc-chn{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* a channel's figure on its index card */
.kq-cc-tfig{display:block;margin-top:18px;padding-top:16px;border-top:1px solid #C5CCD3}
.kq-cc-tn{display:block;font-size:28px;line-height:1.1;letter-spacing:-.02em;color:#102A4C;font-variant-numeric:tabular-nums;transition:color .2s}
.kq-cc-tl{display:block;margin-top:6px;font-size:15px;line-height:1.45}
.kq-tile:hover .kq-cc-tn,.kq-tile:focus-visible .kq-cc-tn{color:#DCBF85}
.kq-tile:hover .kq-cc-tfig,.kq-tile:focus-visible .kq-cc-tfig{border-top-color:#3A5683}
/* problem and answer rows */
.kq-cc-rows{margin-top:48px;display:flex;flex-direction:column;gap:12px}
.kq-cc-row{display:flex;flex-wrap:wrap;gap:12px 48px;padding:28px 32px;background:#FDFCFA}
.kq-cc-rq{flex:1 1 320px;min-width:0}
.kq-cc-svc{margin:0 0 8px;font-size:15px;line-height:1.4;color:#626366}
.kq-cc-row h3{margin:0;font-weight:500;font-size:22px;line-height:1.3}
.kq-cc-ra{flex:999 1 480px;min-width:0;margin:0;max-width:34em}
.kq-cc-more{margin:24px 0 0;max-width:40em;font-size:18px;line-height:1.5}
.kq-cc-more a{color:#102A4C}
/* the capability cards on a channel page read as cards on every channel, not only some */
.kq-capband .kq-cb{background:#FDFCFA}
.kq-capband .kq-cb:hover{background:#F8F6F1}
.kq-cc-short{padding-top:clamp(56px,5.6vw,80px)!important;padding-bottom:clamp(56px,5.6vw,80px)!important}
main a[href="/work/creative"]{min-height:44px;display:inline-flex;align-items:center}
@media (max-width:1180px){
.kq-cc-mx thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.kq-cc-mx,.kq-cc-mx tbody,.kq-cc-mx tr,.kq-cc-mx tbody th{display:block;width:auto}
.kq-cc-mx{background:none}
.kq-cc-mx tr{margin-top:12px;padding:20px 20px 22px;background:#FDFCFA}
.kq-cc-mx th,.kq-cc-mx td{border:0}
.kq-cc-mx tbody th a{min-height:44px;padding:0;font-size:20px}
.kq-cc-mx td{display:inline-block;margin:8px 6px 0 0}
.kq-cc-mx td.kq-cc-no{display:none}
.kq-cc-mx td a{min-height:44px;padding:0 14px;border:1px solid #9AA7B4;border-radius:14px;font-size:15px}
.kq-cc-dot{display:none}
.kq-cc-chn{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}
}
@media (max-width:600px){
/* closer spacing above the review button; the picture keeps the 3:2 crop the other pages use
   (260px tall on a 390px phone), so its subject stays visible (QA F036) */
.kq-hero .kq-hero-img{margin-bottom:8px}
.kq-hero nav[aria-label="Breadcrumb"]{margin-bottom:10px!important}
.kq-hero h1+div{margin-top:18px!important}
.kq-hero [data-kq-cta]{margin-top:22px!important}
.kq-cc-where{padding-right:0}
.kq-cc-where>div{gap:4px 0}
.kq-cc-where h2{flex:0 0 100%;font-size:16px}
.kq-cc-where ul{flex:0 0 100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding:4px clamp(20px,4.4vw,64px) 4px 0;box-sizing:border-box}
.kq-cc-where ul::-webkit-scrollbar{display:none}
.kq-cc-proof .kq-ab-logowrap ul{gap:4px 16px!important}
.kq-cc-proof .kq-ab-logowrap li{flex:1 1 28%!important;min-height:50px!important}
.kq-cc-proof .kq-ab-logowrap img{width:auto!important;max-width:100%!important;max-height:24px!important}
.kq-cc-row{padding:22px 20px}
.kq-cc-rows{margin-top:32px}
.kq-tile .kq-pic img{aspect-ratio:16 / 9!important}
}
</style>`;

// =====================================================================================
// Read every page; work that all of them share
// =====================================================================================
const PAGES = new Map(FILES.map((f) => [f, open(f)]));
for (const P of PAGES.values()) if (P.html.includes("data-kq-capchan")) fail(`${P.file}: already applied; run the whole build`);
const pageOf = (route) => PAGES.get(fileOf(route));
const report = { cards: 0, matched: 0, unmatched: [], renamed: 0, questions: 0, applies: 0 };

for (const P of PAGES.values()) {
  // the hero: mark the review button's row so the phone layout can close the gap above it
  const cta = /<div((?: class="kq-load")? style="[^"]*margin-top: 40px[^"]*")>(<a class="kq-btn" href="\/contact")/;
  if (!cta.test(P.parts[0]) || !P.parts[0].startsWith('<section class="kq-hero')) fail(`${P.file}: the hero or its review button changed`);
  P.parts[0] = P.parts[0].replace(cta, (_, attrs, a) => `<div data-kq-cta${attrs}>${a}`);
  // house names in links to a capability
  for (let i = 0; i < P.parts.length; i++) {
    const n = count(P.parts[i], ">Retail Media</a>");
    if (n) { P.parts[i] = P.parts[i].split(">Retail Media</a>").join(">Retail Media and Advertising</a>"); report.renamed += n; }
  }
}
if (report.renamed !== 5) fail(`expected 5 links named "Retail Media" to rename, found ${report.renamed}`);

// ---- the hero figure: on the five capability pages without one, and a link on all of them
const HERO_BOX = "background: #102A4C; color: #F8F6F1; padding: clamp(28px, 3.4vw, 44px); box-sizing: border-box; margin-top: 44px; max-width: 520px";
const HERO_FIG = "margin: 0; font-size: clamp(50px, 6vw, 92px); line-height: 0.92; letter-spacing: -0.045em; color: #DCBF85; font-variant-numeric: tabular-nums";
const HERO_LINE = "margin: 24px 0 0; font-size: 18px; max-width: 26em";
const figBox = (c) => `<div class="kq-cc-herofig" style="background: #E1E9F1; padding: 28px 32px; margin-top: 48px"><p style="margin: 0; font-size: clamp(30px, 2.8vw, 40px); line-height: 1; letter-spacing: -0.04em; color: #102A4C; font-variant-numeric: tabular-nums"><span data-roll>${c.fig}</span></p><p style="margin: 14px 0 0; font-size: 18px; max-width: 30em">${c.label}</p></div>`;
for (const c of CAPS) {
  const P = pageOf(c.route);
  if (!text(P.parts.join(" ")).includes(c.fig)) fail(`${c.file}: the figure ${c.fig} is not on the page`);
  if (!text(read(fileOf(c.work))).includes(c.fig.replace(/^\+/, ""))) fail(`${c.work}: the figure ${c.fig} is not in the case study`);
  const has = /<div style="background: #E1E9F1; padding: 28px 32px; margin-top: 48px"><p [^>]*><span data-roll>([^<]*)<\/span><\/p><p [^>]*>([^<]*)<\/p><\/div>/;
  const m = P.parts[0].match(has);
  if (m) { if (m[1] !== c.fig || m[2] !== c.label) fail(`${c.file}: the hero figure changed (${m[1]}: ${m[2]})`); }
  else P.parts[0] = once(P.parts[0], "</a></div></div></div></div></section>", `</a></div>${figBox(c)}</div></div></div></section>`, `${c.file}: the end of the hero`);
  P.parts[0] = P.parts[0].replace(/(<div(?: class="kq-cc-herofig")? style="background: #E1E9F1; padding: 28px 32px; margin-top: 48px">[\s\S]*?)<\/div>/, (_, box) => `${box}<a class="kq-cc-figlink" href="${c.work}" style="color: #102A4C">Read the case study</a></div>`);
  if (count(P.parts[0], `href="${c.work}"`) !== 1) fail(`${c.file}: the hero figure was not linked`);
  // one hero result box on capability and channel pages: the channel pages' navy box, at most
  // 520px wide, so it no longer runs the width of the hero and covers its picture (QA F014, F029)
  let boxes = 0;
  P.parts[0] = P.parts[0].replace(/<div(?: class="kq-cc-herofig")? style="background: #E1E9F1; padding: 28px 32px; margin-top: 48px"><p style="margin: 0; font-size: clamp\(30px, 2\.8vw, 40px\); line-height: 1; letter-spacing: -0\.04em; color: #102A4C; font-variant-numeric: tabular-nums">(<span data-roll(?:="")?>[^<]*<\/span>)<\/p><p style="margin: 14px 0 0; font-size: 18px; max-width: 30em">([^<]*)<\/p><a class="kq-cc-figlink" (href="[^"]*") style="color: #102A4C">/g, (_, fig, line, href) => {
    boxes++;
    return `<div class="kq-cc-herofig" style="${HERO_BOX}"><p style="${HERO_FIG}">${fig}</p><p style="${HERO_LINE}">${line}</p><a class="kq-cc-figlink" ${href} style="color: #F8F6F1">`;
  });
  if (boxes !== 1) fail(`${c.file}: expected one hero result box to restyle, found ${boxes}`);
}
for (const c of CHANNELS) {
  const P = pageOf(c.route);
  if (!P.parts[0].includes(`<div style="${HERO_BOX}"><p style="${HERO_FIG}">`)) fail(`${c.file}: the channel hero box no longer has the style the capability pages copy`);
  const box = /(<div style="background: #102A4C; color: #F8F6F1; padding: clamp\(28px, 3\.4vw, 44px\); box-sizing: border-box; margin-top: 44px; max-width: 520px"><p style="[^"]*">)([^<]*)(<\/p><p style="[^"]*">)([^<]*)(<\/p>)<\/div>/;
  const m = P.parts[0].match(box) || fail(`${c.file}: the hero figure changed`);
  if (m[2] !== c.fig) fail(`${c.file}: the hero figure is ${m[2]}, expected ${c.fig}`);
  if (!text(read(fileOf(c.work))).includes(c.fig.replace(/^\+/, ""))) fail(`${c.work}: the figure ${c.fig} is not in the case study`);
  c.figLine = m[4];
  P.parts[0] = P.parts[0].replace(box, (all) => all.slice(0, -6) + `<a class="kq-cc-figlink" href="${c.work}" style="color: #F8F6F1">Read the case study</a></div>`);
}

// =====================================================================================
// Agentic Commerce is the home of Alexa for Shopping and Walmart Sparky
// =====================================================================================
{
  const assistant = (route, id, was, cards, title, summary, more) => {
    const P = pageOf(route), i = at(P, `<section id="${id}"`, `the ${id} section`);
    if (!P.parts[i].includes(`>${was}</h2>`)) fail(`${P.file}: the heading "${was}" changed`);
    same(h3s(P.parts[i]), cards, `${P.file}: the cards under "${was}"`);
    P.parts[i] = `<section id="${id}" class="kq-cc-short" aria-labelledby="${id}-title" style="padding: clamp(80px, 9vw, 144px) clamp(20px, 4.4vw, 64px) clamp(80px, 9vw, 144px)">${WRAP}<h2 id="${id}-title" style="${H2}; max-width: 20em">${title}</h2><p class="kq-wwr">${summary}</p><p class="kq-cc-more">${more} ${ARROW}</p></div></section>`;
  };
  assistant("/channels/amazon", "alexa-shopping", "Alexa for Shopping optimization and management", ["Listings it can read", "Questions and reviews", "Sponsored Prompts", "Answer tracking"],
    "Your listings in Alexa for Shopping",
    "Alexa for Shopping is Amazon’s AI shopping assistant in the US, formed in May 2026 from Rufus and Alexa+. A shopper asks a question and gets a short list of products, so we manage how your listings appear there as part of the account: listings the assistant can read, answered customer questions and reviews, Sponsored Prompts, and tracking of how often your products are named.",
    'Outside the US the assistant is still called Rufus. The full method is on the <a href="/capabilities/agentic-commerce#alexa-shopping">Agentic Commerce</a> page; advertising is on the <a href="/capabilities/retail-media#ai-ads">Retail Media and Advertising</a> page');
  assistant("/channels/walmart", "sparky", "Walmart Sparky optimization and management", ["Item content Sparky can read", "The signals it can see", "Sponsored Prompts", "Answer tracking"],
    "Your items in Walmart Sparky",
    "Sparky is Walmart’s AI shopping assistant, in the Walmart app and on Walmart.com. A shopper asks a question and gets a short list of items, so we manage how your catalog appears there as part of the account: item content Sparky can read, the price, stock, delivery and review signals it can see, the Sponsored Prompts test, and tracking of which items it names.",
    'The full method is on the <a href="/capabilities/agentic-commerce#sparky">Agentic Commerce</a> page. Advertising in Sparky is on the <a href="/capabilities/retail-media#ai-ads">Retail Media and Advertising</a> page');

  // Agentic Commerce no longer sends readers to the channel pages for "more": it is the fuller page
  const A = pageOf("/capabilities/agentic-commerce");
  let i = at(A, "How we optimize for each assistant");
  edit(A, i, `More under <a href="#alexa-shopping">Alexa for Shopping</a>, below, and on the <a href="/channels/amazon#alexa-shopping">Amazon</a> page ${ARROW}`, `More under <a href="#alexa-shopping">Alexa for Shopping</a>, below ${ARROW}`, "the Alexa for Shopping card");
  edit(A, i, `More under <a href="#sparky">Walmart Sparky</a>, below, and on the <a href="/channels/walmart#sparky">Walmart</a> page ${ARROW}`, `More under <a href="#sparky">Walmart Sparky</a>, below ${ARROW}`, "the Walmart Sparky card");
  i = at(A, '<section id="alexa-shopping"');
  edit(A, i, 'More on the <a href="/channels/amazon#alexa-shopping">Amazon</a> page. Sponsored Prompts', 'The rest of the account is on the <a href="/channels/amazon">Amazon</a> page. Sponsored Prompts', "the Alexa for Shopping footnote");
  i = at(A, '<section id="sparky"');
  edit(A, i, 'More on the <a href="/channels/walmart#sparky">Walmart</a> page. Sponsored Prompts', 'The rest of the account is on the <a href="/channels/walmart">Walmart</a> page. Sponsored Prompts', "the Walmart Sparky footnote");
  i = at(A, 'id="faq-title"');
  edit(A, i, 'The <a href="/channels/amazon#alexa-shopping">Amazon</a> and <a href="/channels/walmart#sparky">Walmart</a> pages cover each in detail.', 'See <a href="#alexa-shopping">Alexa for Shopping</a> and <a href="#sparky">Walmart Sparky</a>, above.', "the answer about content for each assistant");
}

// =====================================================================================
// Seven channel pages: "Problems we solve" folded into the first section
// =====================================================================================
// features and problems are the headings the export has today; if either list changes, the
// rows below have to be rewritten from the new copy, so the build stops.
const FOLD = {
  "/channels/amazon/brand-programs": {
    first: "The four programs",
    features: ["Amazon Vine", "Premium Beauty", "Luxury Stores", "Creator Connections"],
    problems: ["Amazon is diluting a prestige brand.", "A new launch has too few reviews to convert.", "It is unclear which programs are worth joining.", "Creator programs are not paying back."],
    rows: [
      ["Amazon Vine", "A new launch has too few reviews to convert.", "Vine brings reviews from Amazon’s invited Vine Voices to new launches and ASINs with thin review profiles, and is strongest in consumables, beauty, health and wellness, electronics and softlines. We model the cost of the units against the expected conversion lift before you enroll, then time enrollment so reviews arrive as advertising and A+ Content go live."],
      ["Premium Beauty and Luxury Stores", "Amazon is diluting a prestige brand.", "Premium Beauty is an invitation-only environment for prestige cosmetics, clinical skincare, luxury fragrance and professional haircare. Luxury Stores is a curated store inside the Amazon app where participating brands sell directly and decide their own inventory, selection and pricing. Amazon decides eligibility brand by brand. We assess fit, prepare the brand for Amazon’s review and manage onboarding, then run curated assortments, restrained advertising, A+ Content, the Storefront and seasonal collection launches to luxury standards. A clinical skincare brand grew Amazon sales 64% after entering Premium Beauty."],
      ["Creator Connections", "Creator programs are not paying back.", "Creator Connections is an Amazon program in which brands offer creators a commission on the sales they drive. We set commission rates against your margin, track sales by creator, niche and format, and time campaigns to launches and peak events, so spend moves to the creators who convert."],
      ["All four programs", "It is unclear which programs are worth joining.", "We assess your eligibility for Vine, Premium Beauty, Luxury Stores and Creator Connections, model the cost and expected return of each, and recommend where to start."],
    ],
    // brand programs had no capability links: the four it draws on, in the page's own words
    band: ["The capabilities these programs draw on", [
      ["/capabilities/retail-media", "Advertising timed with Vine enrollment and creator campaigns, and kept restrained in Premium Beauty and Luxury Stores."],
      ["/capabilities/creative-studio", "A+ Content that goes live as Vine reviews arrive, and Storefronts held to luxury standards."],
      ["/capabilities/marketplace-operations", "Eligibility checks, enrollment, onboarding and the ongoing management of each program."],
      ["/capabilities/analytics-forecasting", "The cost of each program modeled against its expected return before you enroll, then tracked program by program."],
    ]],
  },
  "/channels/target-plus": {
    first: "Target Plus, from onboarding to Roundel",
    features: ["Onboarding and integration", "Catalog and content", "Imagery", "Inventory and fulfillment", "Pricing and promotions", "Roundel advertising"],
    problems: ["Partner standing is at risk.", "Target Plus is not adding incremental sales.", "Content does not meet Target’s standards.", "Prices conflict with other channels.", "The invitation has arrived and setup has to be right the first time."],
    rows: [
      ["Onboarding and integration", "The invitation has arrived and setup has to be right the first time.", "Once Target invites a brand, we manage onboarding: catalog integration, product data, imagery and operational setup, each checked against Target’s requirements before it is submitted, so the account launches without rework."],
      ["Catalog, content and imagery", "Content does not meet Target’s standards.", "Titles, descriptions, attributes and taxonomy are built to Target’s specifications and kept current, alongside Target-compliant imagery, infographics and video."],
      ["Inventory and fulfillment", "Partner standing is at risk.", "Target keeps evaluating partners on content, product quality and operational performance. We forecast demand, monitor fulfillment against the thresholds Target sets, and fix gaps in the standards in your partner agreement before they are flagged."],
      ["Pricing and promotions", "Prices conflict with other channels.", "Target Plus prices are set within Target’s pricing policies and price-match commitments as part of your pricing across every channel, with seasonal promotion plans, so promotions and margins stay consistent."],
      ["Roundel advertising", "Target Plus is not adding incremental sales.", "We run Target Product Ads in Roundel Media Studio to reach Target guests who are not already buying from you elsewhere, and report them with the rest of your retail media."],
    ],
  },
  "/channels/zalando": {
    first: "Zalando across every market and season",
    features: ["Onboarding", "Localization", "Imagery and model content", "Zalando Marketing Services", "ZFS logistics", "Returns"],
    problems: ["Returns are eroding margin.", "Feeds and attributes fail Zalando’s checks.", "The range is hard to find across Zalando’s markets.", "Imagery for large size and color runs is expensive.", "It is unclear whether to use ZFS."],
    rows: [
      ["Returns", "Returns are eroding margin.", "We analyze returns by product, size and market, then fix the size guides, descriptions and imagery that set the wrong expectation."],
      ["Onboarding", "Feeds and attributes fail Zalando’s checks.", "Product data integration, feed configuration, imagery, sizing and attribute mapping are corrected before go-live in every market."],
      ["Zalando Marketing Services", "The range is hard to find across Zalando’s markets.", "We advertise through ZMS, with campaigns planned around European fashion seasons, budgets set by market and results reported with the rest of your retail media."],
      ["Imagery and model content", "Imagery for large size and color runs is expensive.", "We use AI-assisted model imagery for large size and color runs, alongside product, lifestyle and model photography to Zalando’s specifications."],
      ["ZFS logistics", "It is unclear whether to use ZFS.", "Partners can fulfill from their own logistics or use ZFS, and we help you decide when ZFS is worth adding. With ZFS we handle inbound planning, regional positioning and size and color balancing across Zalando’s network."],
    ],
    // said once already, under "How we work": Fit every market
    dropped: { Localization: "Fit every market" },
  },
  "/channels/mercado-libre": {
    first: "What we manage in each country",
    features: ["Setup by country", "Spanish and Portuguese listings", "Listing optimization", "Mercado Ads", "Mercado Envios", "Installment pricing"],
    problems: ["Installments are eating into margin.", "Country setup is slowing the launch.", "One listing set is used for every country.", "Delivery performance is falling short.", "Advertising is not calibrated by country."],
    rows: [
      ["Listing types and installment pricing", "Installments are eating into margin.", "Premium listings offer buyers interest-free installments at a higher fee, and each installment plan adds a financing cost. We choose the Clásica or Premium listing type and the installment plan per product, so the price still clears your margin."],
      ["Setup by country", "Country setup is slowing the launch.", "Registration, tax, payment, shipping and compliance are configured for each country as part of setup, across the 18 where Mercado Libre operates."],
      ["Spanish and Portuguese listings", "One listing set is used for every country.", "We write listings for each country’s buyers from market-specific keyword research, including Portuguese for Brazil, and check every listing for completeness, keywords, imagery and price."],
      ["Mercado Envios", "Delivery performance is falling short.", "Delivery speed and reliability affect how listings perform, so we manage Mercado Envios enrollment, inventory positioning and delivery tracking in each market."],
      ["Mercado Ads", "Advertising is not calibrated by country.", "We run Product Ads, Brand Ads, Display Ads and Video Ads. Product Ads are charged per click, and we set budgets and target returns by country and category."],
    ],
  },
  "/channels/temu": {
    first: "Temu, run on your brand’s terms",
    features: ["Seller model and setup", "Listings for the feed", "Pricing", "Creative", "Inventory and fulfillment", "Flash sales"],
    problems: ["Temu prices could undercut other channels.", "Temu could cheapen the brand.", "It is unclear which seller model to choose.", "Flash sales cause stockouts.", "Listings get lost in a fast feed."],
    rows: [
      ["Seller model and setup", "It is unclear which seller model to choose.", "We compare the fully managed model and the local seller program against your margins, pricing control and operations, and recommend the one that fits. Then we handle registration, category qualification, policy compliance, payment and tax."],
      ["Pricing", "Temu prices could undercut other channels.", "On the local seller program we set competitive prices with margin floors before launch. On fully managed we set supply prices that hold your margin at Temu’s retail price."],
      ["Assortment", "Temu could cheapen the brand.", "We decide before launch which products belong on Temu and which stay off it, and listings follow your brand guidelines."],
      ["Listings for the feed", "Listings get lost in a fast feed.", "We build titles, attributes and imagery for a shopper scrolling, with the product and its value clear in the first image."],
      ["Flash sales, inventory and fulfillment", "Flash sales cause stockouts.", "We coordinate stock and price before every platform campaign, and forecast demand and monitor fulfillment to protect in-stock rates and seller standing."],
    ],
    // said once already, in "How each capability works on Temu": Creative Studio
    dropped: { Creative: "Product photography, lifestyle imagery and infographics sized for a fast-scrolling feed" },
  },
  "/channels/tiktok-shop": {
    first: "Your TikTok Shop, creators and ads",
    features: ["Shop setup", "Shoppable video", "LIVE shopping", "Creator affiliates", "TikTok ads", "Product seeding"],
    problems: ["TikTok feels off-brand for a premium label.", "Creator programs are hard to scale and measure.", "Polished brand video does not sell on TikTok.", "Shop advertising has changed.", "Sales spike and then stall.", "LIVE shopping feels risky."],
    rows: [
      ["Product seeding", "TikTok feels off-brand for a premium label.", "Creators show the product in use within your brand standards, guided by creative briefs and product seeding to chosen niches, with Spark Ads amplifying proven organic and creator posts."],
      ["Creator affiliates", "Creator programs are hard to scale and measure.", "We run creator selection, outreach, briefs, gifting and commissions through TikTok Shop’s affiliate tools, judge each creator on attributed sales, and shift commissions toward the creators and formats that sell."],
      ["Shoppable video", "Polished brand video does not sell on TikTok.", "Our Creative Studio makes product demonstrations and trend-led video for the feed, where heavily produced spots often underperform, alongside creator content."],
      ["TikTok ads", "Shop advertising has changed.", "TikTok now runs Shop advertising through GMV Max. We run Product GMV Max and LIVE GMV Max for Shop sales, plus Spark Ads for proven organic and creator posts."],
      ["LIVE shopping", "LIVE shopping feels risky.", "We start LIVE where products sell better demonstrated than described, plan the format, hosts and offers before the first stream, monitor it in real time and judge each event on Shop sales."],
      ["Stock and momentum", "Sales spike and then stall.", "Stock is planned for demand surges, and the posts and creators that sold are scaled with Spark Ads and GMV Max so momentum turns into steady sales."],
    ],
    dropped: { "Shop setup": "Open the shop" },
  },
  "/channels/instagram-shop": {
    first: "Your Instagram Shop, run as one program",
    features: ["Shop and catalog", "Shoppable content", "Creative production", "Meta advertising", "Audiences", "Creator partnerships"],
    problems: ["Posts get engagement but not sales.", "Sales from Instagram are hard to see.", "Meta advertising costs keep rising.", "Content and advertising are planned separately.", "The catalog is out of sync with stock and price."],
    rows: [
      ["Product tags and catalog ads", "Posts get engagement but not sales.", "Product tags, catalog ads and Advantage+ sales campaigns shorten the path from post to checkout on your own website."],
      ["Shop and catalog", "The catalog is out of sync with stock and price.", "We set up Meta Commerce Manager, catalog syndication, collections, product tagging and the checkout link to your site, and keep the catalog in sync with your stock and prices."],
      ["Meta advertising and audiences", "Meta advertising costs keep rising.", "We run Advantage+ catalog ads to custom, retargeting and lookalike audiences built from site visitors, customer lists, engagers and past purchasers, and exclude existing customers from prospecting so spend goes to new buyers."],
      ["Shoppable content and creators", "Content and advertising are planned separately.", "We run posts, Stories, Reels, creators and Meta advertising to one strategy: publishing plans across Feed, Stories and Reels that balance brand storytelling and product, and creators chosen for audience overlap and conversion."],
      ["Measurement", "Sales from Instagram are hard to see.", "We measure through the Meta pixel and the Conversions API on your site and report the results beside your site analytics."],
    ],
    // said once already, in "How each capability works on Instagram Shop": Creative Studio
    dropped: { "Creative production": "Product photography, Reels, Stories and AI image and video" },
  },
};
const capName = (href) => (CAPS.find((c) => c.route === href) || fail(`${href} is not a capability`)).name;
const bandCard = ([href, line]) => `<a class="kq-cb" href="${href}"><span class="kq-cbn">${capName(href)} ${ARROW}</span><span class="kq-cbt">${esc(line)}</span></a>`;
let folded = 0;
for (const [route, F] of Object.entries(FOLD)) {
  const P = pageOf(route);
  const i = at(P, `>${F.first}</h2>`, `the section "${F.first}"`);
  let sec = P.parts[i];
  const bandAt = sec.indexOf('<div class="kq-capband">');
  const gridOpen = F.band ? '<div style="margin-top: 48px; display: flex; flex-direction: column">' : '<div style="margin-top: 56px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr)); gap: 48px 64px">';
  const g = sec.indexOf(gridOpen), end = F.band ? sec.lastIndexOf("</div></section>") : bandAt;
  if (g < 0 || end < g || (F.band ? bandAt >= 0 : bandAt < 0)) fail(`${P.file}: the first section is not laid out as expected`);
  same(h3s(sec.slice(g, end)), F.features, `${P.file}: what the first section lists`);
  const j = at(P, 'id="problems-title"', "Problems we solve");
  same(h3s(P.parts[j]), F.problems, `${P.file}: the problems`);
  same(F.rows.map((r) => r[1]).sort(), [...F.problems].sort(), `${P.file}: the problems carried into the rows`);
  for (const [was, where] of Object.entries(F.dropped || {})) if (!P.parts.some((s, k) => k !== i && k !== j && s.includes(where)) && !sec.slice(end).includes(where)) fail(`${P.file}: "${was}" is dropped because "${where}" covers it, and that is no longer on the page`);
  const rows = `<div class="kq-cc-rows">${F.rows.map(([svc, q, a]) => `<div class="kq-cc-row"><div class="kq-cc-rq"><p class="kq-cc-svc">${esc(svc)}</p><h3>${esc(q)}</h3></div><p class="kq-cc-ra">${esc(a)}</p></div>`).join("")}</div>`;
  const band = F.band ? `<div class="kq-capband"><h3 class="kq-cbh">${F.band[0]}</h3><div class="kq-cbg" style="--cols: ${F.band[1].length}">${F.band[1].map(bandCard).join("")}</div></div>` : "";
  P.parts[i] = sec.slice(0, g) + rows + band + sec.slice(end);
  // with the white section between them gone, "How we work" takes its place on the lighter ground
  const k = at(P, 'id="steps-title"', "How we work");
  if (!/^<section style="[^"]*; background: #E1E9F1">/.test(P.parts[k]) || count(P.parts[k], '<li style="background: #FDFCFA; padding: 32px">') !== 4) fail(`${P.file}: "How we work" changed`);
  P.parts[k] = P.parts[k].replace("; background: #E1E9F1\">", '">').split('<li style="background: #FDFCFA; padding: 32px">').join('<li style="background: #E1E9F1; padding: 32px">');
  P.parts.splice(j, 1);
  folded++;
}

// Walmart: its page has a section on Sparky, so Agentic Commerce is one of its capabilities
{
  const P = pageOf("/channels/walmart"), i = at(P, "How each capability works on Walmart");
  edit(P, i, '<div class="kq-cbg" style="--cols: 4">', '<div class="kq-cbg" style="--cols: 5">', "the capability cards");
  const last = P.parts[i].lastIndexOf("</a></div></div>");
  if (last < 0 || count(P.parts[i], 'class="kq-cb"') !== 4) fail(`${P.file}: the capability cards changed`);
  P.parts[i] = P.parts[i].slice(0, last + 4) + bandCard(["/capabilities/agentic-commerce", "Item content completed to Walmart’s item spec, so Sparky can match your products to the questions shoppers ask."]) + P.parts[i].slice(last + 4);
}

// ---- the truth: which capabilities each channel page describes
const TRUTH = new Map(); // channel route -> Set of capability routes
for (const c of CHANNELS) {
  const P = pageOf(c.route);
  const i = P.parts.findIndex((s) => s.includes('<div class="kq-capband">'));
  if (i < 0 || count(P.parts.join(""), '<div class="kq-capband">') !== 1) fail(`${c.file}: expected one block of capability cards`);
  P.parts[i] = P.parts[i].replace('<div class="kq-capband">', '<div class="kq-capband" id="capabilities">');
  const band = P.parts[i].slice(P.parts[i].indexOf('<div class="kq-capband"'));
  const set = new Set([...band.matchAll(/<a class="kq-cb" href="([^"]+)"/g)].map((m) => m[1]));
  for (const h of set) capName(h);
  if (set.size < 3) fail(`${c.file}: fewer than three capabilities listed`);
  TRUTH.set(c.route, set);
}
const where = (cap) => CHANNELS.filter((c) => TRUTH.get(c.route).has(cap.route));
if (where(CAPS[0]).length < 8 || where(CAPS[5]).length !== 1) fail("the capability-by-channel truth looks wrong; check the channel pages' capability cards");

// =====================================================================================
// Capability pages
// =====================================================================================
const QUESTIONS = {
  // the question whose answer repeats the cards goes on every page ("What results ..."); these
  // go as well where a page had more than eight, each because the page says it elsewhere
  "/capabilities/retail-media": ["How do you decide how much to spend on each channel?", "How do you tell whether DSP spend is incremental?", "Do you manage Amazon advertising and DSP together?", "Can we advertise inside AI shopping assistants?", "Do Sponsored Prompts on Amazon need their own campaigns or budget?", "How do you measure advertising in AI assistants?"],
  "/capabilities/creative-studio": ["What does the Creative Studio produce?"],
  "/capabilities/marketplace-operations": [],
  "/capabilities/analytics-forecasting": ["Can you build our fiscal year plan?"],
  "/capabilities/agentic-commerce": ["Can you measure agentic commerce performance?", "How is optimizing for AI different from traditional SEO?", "What does Alexa for Shopping draw on?", "Which AI shopping assistants do you optimize for?", "How do our products get into ChatGPT’s shopping results?"],
  "/capabilities/revenue-recovery": [],
};
function dropQuestions(P, drop, max) {
  const i = at(P, 'id="faq-title"', "the questions");
  let sec = P.parts[i];
  const items = sec.match(/<details\b[\s\S]*?<\/details>/g) || [];
  const q = (d) => text((d.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || "");
  for (const name of drop) {
    const hit = items.filter((d) => (name instanceof RegExp ? name.test(q(d)) : q(d) === name));
    if (hit.length !== 1) fail(`${P.file}: the question "${name}" was expected once, found ${hit.length} times`);
    sec = sec.replace(hit[0], "");
    report.questions++;
  }
  const left = count(sec, "<details");
  if (left > max || left < 4) fail(`${P.file}: ${left} questions left, expected 4 to ${max}`);
  if (!/<details open/.test(sec)) sec = sec.replace("<details ", "<details open ");
  P.parts[i] = sec;
  return left;
}
// a featured case in the form the other four pages use, made from the page's own card
function feature(P, title, summary) {
  const i = at(P, 'id="cases-title"', "Case studies");
  let sec = P.parts[i];
  const card = [...sec.matchAll(CARD)].find((m) => text(cardTitle(m[2])) === title) || fail(`${P.file}: no card titled "${title}"`);
  const hit = CASES.get(norm(title)) || fail(`${P.file}: no case study titled "${title}"`);
  const img = (card[2].match(/<img [^>]*src="([^"]+)" alt="([^"]*)"/) || fail(`${P.file}: the card has no picture`));
  const who = text((card[2].match(/<p style="margin: 0; font-size: 15px; color: #626366">([^<]*)<\/p>/) || fail(`${P.file}: the card has no client line`))[1]);
  const figs = [...card[2].matchAll(/<p style="margin: 0; font-size: clamp\(28px, 2\.4vw, 38px\);[^"]*">([^<]*)<\/p><p style="[^"]*">([^<]*)<\/p>/g)];
  if (figs.length < 1) fail(`${P.file}: the card "${title}" has no figures`);
  if (!text(sec + P.parts.join(" ")).includes(summary.slice(0, 40)) && !text(hit.body).includes(summary.slice(0, 40))) fail(`${P.file}: the featured case summary is not taken from the site`);
  const fig = ([n, l]) => `<div><p style="margin: 0; font-size: clamp(30px, 2.8vw, 40px); line-height: 1; letter-spacing: -0.035em; color: #102A4C; font-variant-numeric: tabular-nums"><span data-roll="">${n}</span></p><p style="margin: 10px 0 0; font-size: 15px; color: #626366">${l}</p></div>`;
  const section = `<section style="padding: clamp(80px, 9vw, 144px) clamp(20px, 4.4vw, 64px) clamp(80px, 9vw, 144px); background: #102A4C; color: #F8F6F1">${WRAP}<div style="display: flex; flex-wrap: wrap; gap: 56px 80px; align-items: center"><div style="flex: 1 1 520px; min-width: 0"><img loading="lazy" decoding="async" src="${img[1]}" alt="${img[2]}" style="width: 100%; max-width: 520px; aspect-ratio: 16 / 9; display: block; border-radius: 2px; margin-bottom: 28px; object-fit: cover"><p style="margin: 0; font-size: 15px; color: #C9D4DF">Case study: ${who.charAt(0).toLowerCase() + who.slice(1).replace(". ", ", ")}</p><h2 id="proof-title" style="${H2}; margin-top: 16px; max-width: 13em">${title}.</h2><p style="margin: 28px 0 0; max-width: 30em">${esc(summary)}</p><a href="${hit.route}" style="min-height: 44px; display: inline-flex; align-items: center; color: #F8F6F1; font-size: 18px; margin-top: 32px">Read the case study</a></div><div style="flex: 1 1 420px; min-width: 0; background: #E1E9F1; padding: clamp(32px, 4vw, 56px); display: flex; flex-direction: column; gap: 32px">${figs.map((m) => fig([m[1], m[2]])).join("")}</div></div></div></section>`;
  sec = sec.replace(card[0], "");
  if (count(sec, 'class="kq-ccard"') < 1) fail(`${P.file}: featuring "${title}" would leave no case study cards`);
  // two navy sections would sit together: the cards move to the page's light ground
  if (/^<section style="[^"]*; background: #102A4C; color: #F8F6F1">/.test(sec)) sec = once(sec.replace("; background: #102A4C; color: #F8F6F1\">", '">'), 'display: inline-flex; align-items: center; color: #F8F6F1; display: inline-block; font-size: 18px">All case studies', 'display: inline-flex; align-items: center; display: inline-block; font-size: 18px">All case studies', `${P.file}: the link to all case studies`);
  P.parts[i] = sec;
  P.parts.splice(i, 0, section);
}

for (const c of CAPS) {
  const P = pageOf(c.route);
  if (P.parts.filter((s) => s.includes('id="proof-title"')).length > 1) fail(`${c.file}: more than one featured case`);
  if (c.route === "/capabilities/agentic-commerce") feature(P, "From 6 to 23 of 40 Alexa for Shopping answers", "Its listings left firmness, loft, sleep position and cooling blank. Completing that product data put the brand in the answers to 23 of 40 tracked prompts in Alexa for Shopping (formerly Rufus), up from 6.");
  if (c.route === "/capabilities/revenue-recovery") feature(P, "$781K in shortage claims recovered", "For a kitchen appliance vendor on Vendor Central, we recovered $781K in shortage claims and cut the shortage rate 72%.");
  if (P.parts.filter((s) => s.includes('id="proof-title"')).length !== 1) fail(`${c.file}: expected one featured case`);

  c.questions = dropQuestions(P, [/^What results ha(ve|s) /, ...QUESTIONS[c.route]], 8);

  const chans = where(c);
  const note = c.route === "/capabilities/revenue-recovery" ? "<p>Vendor Central and Seller Central accounts.</p>" : "";
  if (note && (chans.length !== 1 || !text(P.parts.join(" ")).includes("Vendor Central and Seller Central accounts"))) fail(`${c.file}: the note on where Revenue Recovery applies no longer holds`);
  // the line under "Questions executives ask" names the same channels (QA F092)
  {
    const fi = at(P, 'id="faq-title"', "the questions");
    const line = /(<p style="margin: 20px 0 0; font-size: 15px; color: #626366">)Applies (?:on|to) [^<]*(<\/p>)/;
    if (line.test(P.parts[fi])) {
      const names = chans.map((ch) => ch.name);
      const list = names.length === CHANNELS.length ? "every channel we run" : names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
      const own = c.route === "/capabilities/agentic-commerce" ? ", and to your brand’s own site" : "";
      P.parts[fi] = P.parts[fi].replace(line, (_, a, b) => `${a}Applies on ${list}${own}.${b}`);
      report.applies++;
    }
  }
  P.parts.splice(1, 0, `<nav class="kq-cc-where" aria-labelledby="applies-title"><div><h2 id="applies-title">Where this applies</h2><ul>${chans.map((ch) => `<li><a href="${ch.route}#capabilities">${ch.name}</a></li>`).join("")}</ul>${note}</div></nav>`);
  P.parts.splice(at(P, 'id="faq-title"'), 0, LOGOS);
}

if (report.applies !== 4) fail(`expected 4 capability pages with an "Applies on" line, found ${report.applies}`);

// =====================================================================================
// /capabilities
// =====================================================================================
{
  const P = PAGES.get(INDEX_CAP), i = at(P, 'id="cap-title"', "What we do");
  let n = 0;
  P.parts[i] = P.parts[i].replace(/<a href="(\/capabilities\/[a-z-]+)" style="([^"]*)">([\s\S]*?)<p style="margin: auto 0 0;[^"]*">([^<]*)<\/p><\/a>/g, (_, href, style, inner, was) => {
    const c = CAPS.find((x) => x.route === href) || fail(`${P.file}: a card links to ${href}`);
    if (!was.includes(c.fig)) fail(`${P.file}: the ${c.name} card showed "${was}", not ${c.fig}`);
    if (!style.includes("background: #FDFCFA; padding: clamp(28px, 3vw, 44px); min-height: 340px; ")) fail(`${P.file}: the capability cards changed`);
    n++;
    return `<div class="kq-cc-cap"><a class="kq-cc-capmain" href="${href}" style="${style.replace("background: #FDFCFA; padding: clamp(28px, 3vw, 44px); min-height: 340px; ", "padding: clamp(28px, 3vw, 44px) clamp(28px, 3vw, 44px) 0; ")}">${inner}</a><a class="kq-cc-capfig" href="${c.work}" style="display: block"><span class="kq-cc-n">${c.fig}</span><span class="kq-cc-l">${c.label}</span><span class="kq-cc-m">Read the case study ${ARROW}</span></a></div>`;
  });
  if (n !== 6) fail(`${P.file}: expected six capability cards, rebuilt ${n}`);

  const cell = (cap, ch) => (TRUTH.get(ch.route).has(cap.route)
    ? `<td role="cell"><a href="${ch.route}#capabilities"><span class="kq-cc-dot" aria-hidden="true"></span><span class="kq-cc-chn">${ch.short || ch.name}<span class="kq-sr">: ${cap.name}</span></span></a></td>`
    : '<td role="cell" class="kq-cc-no"><span class="kq-sr">Not listed</span></td>');
  const table = `<section id="by-channel" aria-labelledby="by-channel-title" style="padding: clamp(80px, 9vw, 144px) clamp(20px, 4.4vw, 64px) clamp(80px, 9vw, 144px)">${WRAP}<h2 id="by-channel-title" style="${H2}">Capabilities by channel</h2><p style="margin: 20px 0 0; max-width: 34em">A mark means that channel’s page describes how we run the capability there. Choose one to read it.</p>` +
    `<table class="kq-cc-mx" role="table" aria-labelledby="by-channel-title"><thead role="rowgroup"><tr role="row"><td role="cell"></td>${CHANNELS.map((ch) => `<th role="columnheader" scope="col"><a href="${ch.route}">${ch.short || ch.name}</a></th>`).join("")}</tr></thead><tbody role="rowgroup">` +
    CAPS.map((cap) => `<tr role="row"><th role="rowheader" scope="row"><a href="${cap.route}">${cap.name}</a></th>${CHANNELS.map((ch) => cell(cap, ch)).join("")}</tr>`).join("") + "</tbody></table></div></section>";
  P.parts.splice(i + 1, 0, table);
  P.parts.splice(at(P, 'id="faq-title"'), 0, LOGOS);
}

// =====================================================================================
// /channels
// =====================================================================================
{
  const P = PAGES.get(INDEX_CH), i = at(P, 'aria-label="Where we operate"');
  let sec = P.parts[i];
  const tiles = sec.match(/<a class="kq-tile" [\s\S]*?<\/a>/g) || [];
  if (tiles.length !== 10) fail(`${P.file}: expected 10 channel cards, found ${tiles.length}`);
  const byRoute = new Map(tiles.map((t) => [(t.match(/href="([^"]+)"/) || [])[1], t]));
  // Temu is a marketplace: one group, and it sits with the other marketplaces
  let temu = byRoute.get("/channels/temu") || fail(`${P.file}: no Temu card`);
  if (!temu.includes('data-k="us intl"') || !temu.includes('<span class="kq-tag">Marketplace</span>')) fail(`${P.file}: the Temu card's groups changed`);
  byRoute.set("/channels/temu", temu.replace('data-k="us intl"', 'data-k="us"'));
  // the filter chip for that group: Temu is not a US-only marketplace (Jordan, 2026-11-27)
  sec = once(sec, '<label for="cf-us">US marketplaces</label>', '<label for="cf-us">Marketplaces</label>', `${P.file}: the marketplaces filter chip`);
  let intl = byRoute.get("/channels/international") || fail(`${P.file}: no International card`);
  byRoute.set("/channels/international", once(intl, "Amazon in 20+ countries, plus Zalando, Mercado Libre and Temu.", "Amazon in 20+ countries, plus Zalando and Mercado Libre.", `${P.file}: the International card`));
  const out = CHANNELS.map((c) => {
    const t = byRoute.get(c.route) || fail(`${P.file}: no card for ${c.route}`);
    return once(t, "</span></span></span><span class=\"kq-more\">", `</span><span class="kq-cc-tfig"><span class="kq-cc-tn">${c.fig}</span><span class="kq-cc-tl">${c.figLine}</span></span></span></span><span class="kq-more">`, `${P.file}: the ${c.name} card`);
  });
  const a = sec.indexOf(tiles[0]), b = sec.indexOf(tiles[9]) + tiles[9].length;
  if (sec.slice(a, b) !== tiles.join("")) fail(`${P.file}: something sits between the channel cards`);
  P.parts[i] = sec.slice(0, a) + out.join("") + sec.slice(b);

  // the two questions whose answers were the home page's, word for word (Why Kwontified explains the strategy)
  const j = at(P, 'id="faq-title"');
  dropQuestions(P, ["What is an agile omni-channel strategy?", "How is that different from a multi-channel strategy?"], 8);
  edit(P, j, "Amazon’s international marketplaces, Zalando in Europe, Mercado Libre in Latin America and Temu, and handle", "Amazon’s international marketplaces, Zalando in Europe and Mercado Libre in Latin America, and handle", "the answer on international marketplaces");
  // the strategy is explained once, on Why Kwontified
  const k = at(P, "Channel strategies, connected in one agile omni-channel strategy.");
  edit(P, k, "Budgets move between channels only with your approval.</p>", 'Budgets move between channels only with your approval. <a href="/why-kwontified#omni-channel" style="color: #F8F6F1">How the strategy works</a></p>', "the strategy paragraph");
  P.parts.splice(at(P, 'id="faq-title"'), 0, LOGOS);
}

// =====================================================================================
// Temu is a marketplace on its own page and on International; logos on Amazon
// =====================================================================================
{
  const T = pageOf("/channels/temu");
  T.parts[0] = once(T.parts[0], ' / <a href="/channels/international" style="color: #626366">International</a> / <span aria-current="page">Temu</span>', ' / <span aria-current="page">Temu</span>', `${T.file}: the breadcrumb`);

  const I = pageOf("/channels/international");
  I.parts[0] = once(I.parts[0], "Amazon’s international marketplaces, Zalando, Mercado Libre and Temu, with", "Amazon’s international marketplaces, Zalando and Mercado Libre, with", `${I.file}: the introduction`);
  let i = at(I, '<section aria-label="International channels"');
  const tile = (I.parts[i].match(/<a class="kq-tile" href="\/channels\/temu"[\s\S]*?<\/a>/) || fail(`${I.file}: no Temu card under International channels`))[0];
  I.parts[i] = once(I.parts[i].replace(tile, ""), "</div></div></div></section>", `</div></div><p class="kq-cc-more">Temu is run as its own marketplace. See the <a href="/channels/temu">Temu</a> page ${ARROW}</p></div></section>`, `${I.file}: the end of International channels`);
  if (count(I.parts[i], 'class="kq-tile"') !== 3) fail(`${I.file}: expected three international channel cards`);
  i = at(I, 'id="faq-title"');
  edit(I, i, ">Amazon international, Zalando, Mercado Libre and Temu.</p>", ">Amazon international, Zalando and Mercado Libre.</p>", "the line under the questions heading");
  edit(I, i, "plus Zalando across Europe, Mercado Libre in its 18 Latin American countries, and Temu.", "plus Zalando across Europe and Mercado Libre in its 18 Latin American countries. Temu is run as its own marketplace.", "the answer on which marketplaces");

  // the page's descriptions (search results, structured data) say the same as its introduction
  for (const k of ["head", "tail"]) {
    const n = count(I[k], "Zalando, Mercado Libre and Temu, with");
    if (k === "head" && n < 1) fail(`${I.file}: the page description no longer lists Temu; check it`);
    I[k] = I[k].split("Zalando, Mercado Libre and Temu, with").join("Zalando and Mercado Libre, with");
  }

  const A = pageOf("/channels/amazon");
  A.parts.splice(at(A, 'id="faq-title"'), 0, LOGOS);
}

// =====================================================================================
// Case study cards: each opens its own case study
// =====================================================================================
for (const P of PAGES.values()) {
  for (let i = 0; i < P.parts.length; i++) {
    P.parts[i] = P.parts[i].replace(CARD, (all, href, rest) => {
      report.cards++;
      const title = cardTitle(rest), hit = CASES.get(norm(title));
      if (!hit) { report.unmatched.push(`${P.file}: ${text(title)}`); return `<a class="kq-ccard" href="/work"${rest}</a>`; }
      report.matched++;
      return `<a class="kq-ccard" href="${hit.route}"${rest}</a>`;
    });
  }
}

// =====================================================================================
// Write, and check what was written
// =====================================================================================
for (const P of PAGES.values()) {
  let html = P.head + "\n" + P.parts.join("\n") + "\n" + P.tail;
  html = once(html, "</head>", CSS + "</head>", `${P.file}: </head>`);
  html = faqData(html, P.file);
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) fail(`${P.file}: an id is used twice: ${[...new Set(dup)].join(", ")}`);
  for (const m of main.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const [p, hash] = m[1].split("#");
    if (p.startsWith("/") && !p.startsWith("/assets/") && !routes.has(p.split("?")[0])) fail(`${P.file}: a link points to ${p}, which is not a page`);
    if (hash && !p && !ids.includes(hash)) fail(`${P.file}: a link points to #${hash}, which is not on the page`);
    // anchors on the other pages this step writes
    if (hash && p && PAGES.has(path.basename(ROUTES.find((r) => r.route === p)?.file || ""))) {
      const other = PAGES.get(fileOf(p));
      if (!other.parts.join("").includes(` id="${hash}"`)) fail(`${P.file}: a link points to ${p}#${hash}, which is not on that page`);
    }
  }
  for (const m of main.matchAll(CARD)) { const hit = CASES.get(norm(cardTitle(m[2]))); if (hit && m[1] !== hit.route) fail(`${P.file}: a matched card does not open its case study`); }
  if (/<blockquote/.test(main)) fail(`${P.file}: client quotes do not go on capability or channel pages`);
  if (count(html, "<!--kq-logos:clients-->") !== (LOGO_PAGES.includes(P.file) ? 1 : 0)) fail(`${P.file}: wrong number of client logo markers`);
  fs.writeFileSync(path.join(DIR, P.file), html);
}
if (!read("why-kwontified.html").includes('id="omni-channel"')) fail("Why Kwontified no longer has the section #omni-channel that /channels links to");

const matrix = CAPS.map((c) => `${c.name.split(" ")[0]} ${where(c).length}`).join(", ");
console.log(`site-capchan: ${report.matched} of ${report.cards} case study cards open their own case study${report.unmatched.length ? ` (left on /work: ${report.unmatched.join("; ")})` : ""}, 2 more became featured cases; review button on the phone's first screen on ${PAGES.size} pages; hero figures linked on 16; ${folded} channel pages folded "Problems we solve" into their first section; capability by channel from the channel pages (${matrix}); ${report.questions} questions removed; client logos marked on ${LOGO_PAGES.length} pages`);
