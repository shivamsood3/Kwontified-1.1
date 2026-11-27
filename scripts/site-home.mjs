// Home page: one story, told once.
//
// Reviewed 2026-11-27 (64/100) and approved by Jordan. The export had 13 sections and ran to
// 25 phone screens: proof was split across six blocks, the two client quotes waited until
// screen 15 on a phone, "one team" and "every channel" argued the same point twice, the
// creative strip showed still lifes captioned with results that were not creative work, the
// press logos stacked in one column on a phone, and the page body had no link to Why
// Kwontified, Capabilities or Channels. On an iPhone 13 the review button began one pixel
// above the bottom of the first screen.
//
// The order is now: hero; client logos; three linked results with the Dr. Brandt quote under
// them; one "one team" section that carries the six capabilities under their house names in
// menu order; the channels, each linked to its own page; four real pieces from the creative
// gallery (/work/creative, read from that page so the two stay in step); press logos with the
// Vilebrequin quote; the case finder; Perspectives; five questions; the closing request.
// Gone: the picture-only section, the "What clients say" section (its two quotes moved up),
// the Target Plus figure beside the channels (it is in the finder and on /work), the row for
// AI shopping assistants in the channel list (Agentic Commerce is one of the six capabilities
// above it), and four questions. On phones: the logos sit three to a row, section headings use
// the inner pages' 30px, the six capabilities and the creative pieces are each one row to
// swipe, and the channels picture is left out.
//
// What this step does not touch: the hero's markup, video and headline (phones only get a
// shorter picture and tighter spacing, in CSS); anything inside #finder (moved whole, checked
// byte for byte); the two logo lists (site-logos.mjs still finds 15 inline logos in each); the
// header and footer.
//
// Runs after site-about.mjs (which copies the two quotes from this page for About and Why
// Kwontified) and before site-seo.mjs. Fails if a section it expects is missing, renamed or
// reshaped, so a new export is looked at before this rearranges it.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const FILE = "index.html";
const fail = (m) => { throw new Error("site-home: " + m); };
const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => r.route));
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const count = (s, find) => s.split(find).length - 1;
const once = (s, find, put, what) => {
  if (count(s, find) !== 1) fail(`${what}: expected once, found ${count(s, find)} times`);
  return s.replace(find, () => put);
};
const text = (h) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

const html = read(FILE);
if (html.includes("data-kq-home")) fail("already applied; run the whole build");

// ---- the page as: everything before its sections, the sections by name, everything after ----
const a = html.indexOf("<main"), b = html.indexOf("</main>");
if (a < 0 || b < 0) fail("no <main>");
const start = html.indexOf(">", a) + 1, main = html.slice(start, b);
const S = {};
{
  const names = [];
  let depth = 0, at = -1, end = 0, m;
  const re = /<(\/?)section\b[^>]*>/g;
  while ((m = re.exec(main))) {
    if (!m[1]) {
      if (depth === 0) { at = m.index; if (main.slice(end, at).trim()) fail("there is markup between two sections"); }
      depth++;
    } else if (--depth === 0) {
      end = m.index + m[0].length;
      const sec = main.slice(at, end), open = sec.slice(0, sec.indexOf(">"));
      const name = (open.match(/\sid="([^"]+)"/) || open.match(/\saria-labelledby="([^"]+)"/) || fail("a section has neither an id nor a label"))[1];
      S[name] = sec; names.push(name);
    }
  }
  if (main.slice(end).trim()) fail("there is markup after the last section");
  const expected = "top clients results disciplines interlude channels work perspectives press quotes finder faq-title contact";
  if (names.join(" ") !== expected) fail(`the sections changed.\n   expected: ${expected}\n   found:    ${names.join(" ")}`);
}

// ---- shared markup, in the export's own style ----
const ARROW = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M3 8H13M9 4L13 8L9 12"></path></svg>';
const more = (href, label, extra = "") => `<a href="${href}" style="font-size: 16px; padding: 10px 0; display: inline-flex; align-items: center; gap: 10px; text-underline-offset: 5px; align-self: flex-start${extra}">${label}\n${ARROW}</a>`;
const WRAP = "max-width: 1280px; margin: 0 auto; padding: clamp(64px, 8vw, 120px) clamp(24px, 5.5vw, 80px)";
const H2 = "margin: 0; font-size: 40px; line-height: 1.08; letter-spacing: -0.02em; font-weight: 400; color: #102A4C";
const esc = (s) => s.replace(/&(?!amp;|#)/g, "&amp;");

// ---- the two client quotes, as the export has them ----
const quotes = [...S.quotes.matchAll(/<figure style="flex: 1 1 380px; margin: 0; display: flex; flex-direction: column; gap: 18px">\s*<blockquote style="margin: 0; font-size: 22px; line-height: 1\.35; letter-spacing: -0\.01em">([\s\S]*?)<\/blockquote>\s*<figcaption style="font-size: 15px">([\s\S]*?)<\/figcaption>\s*<\/figure>/g)];
if (quotes.length !== 2 || !/Dr\. Brandt/.test(quotes[0][2]) || !/Vilebrequin/.test(quotes[1][2])) fail("the two client quotes changed");
const quote = (q) => `<div class="kq-hm-say"><h3 class="kq-hm-label">What clients say</h3><figure class="kq-hm-quote"><blockquote>${q[1]}</blockquote><figcaption>${q[2]}</figcaption></figure></div>`;

// =====================================================================================
// Results: the three linked results, then the first quote
// =====================================================================================
let results = S.results;
if (count(results, 'font-size: clamp(60px, 6.4vw, 92px)') !== 3) fail("expected three headline results");
if (!results.endsWith("</div>\n</div>\n</div>\n</section>")) fail("the results section ends differently");
results = results.slice(0, -"</div>\n</section>".length) + quote(quotes[0]) + "\n</div>\n</section>";

// =====================================================================================
// One team: the argument once, then the six capabilities under their house names
// =====================================================================================
const CAPS = [
  ["/capabilities/retail-media", "Retail Media and Advertising"],
  ["/capabilities/creative-studio", "Creative Studio"],
  ["/capabilities/marketplace-operations", "Marketplace Operations"],
  ["/capabilities/analytics-forecasting", "Analytics and Forecasting"],
  ["/capabilities/agentic-commerce", "Agentic Commerce"],
  ["/capabilities/revenue-recovery", "Revenue Recovery"],
];
const D = S.disciplines;
for (const [find, what] of [
  ["One team, one agile omni-channel strategy.</h2>", "heading"],
  ["Most brands split advertising, creative and operations across separate agencies, then lose margin where those plans disagree: ads that drive shoppers to products about to stock out, creative briefed without the search data, promotions with no stock behind them. We build a specific strategy for each channel and marketplace, then connect them in one agile omni-channel strategy, reviewed against one P&amp;L.</p>", "introduction"],
  ["<li>One named team and one inbox for every channel you sell in.</li>", "first point"],
  ["<li>One agile omni-channel strategy, with sales, margin, advertising and inventory targets you approve for each channel.</li>", "second point"],
  ["<li>A weekly update, plus monthly and quarterly business reviews against that strategy.</li>", "third point"],
  ["<li>Senior leaders who stay involved long after onboarding.</li>", "fourth point"],
]) if (count(D, find) !== 1) fail(`one team: the ${what} changed`);
if (count(D, "<li>") !== 4) fail("one team: expected four points");
const cards = [...D.matchAll(/<article data-kq-row style="flex: 1 1 300px; display: flex; flex-direction: column; gap: 12px">\s*<img loading="lazy" decoding="async" src="(\/assets\/[^"]+)" alt="([^"]+)"[^>]*>\s*<h3 [^>]*>[^<]+<\/h3>\s*<p style="margin: 0; font-size: 17px">([^<]+)<\/p>\s*<a class="kq-sl" href="([^"]+)"[^>]*>[^<]+<svg[\s\S]*?<\/svg><\/a>\s*<\/article>/g)];
if (cards.length !== 6 || count(D, "<article") !== 6) fail(`one team: expected six capability cards, found ${cards.length}`);
const C = S.channels;
for (const [find, what] of [
  ["Every channel you sell in, in one agile omni-channel strategy.</h2>", "heading"],
  ["Each channel and marketplace gets its own strategy, built for how its shoppers search and buy. Those strategies connect in one agile omni-channel strategy that also accounts for your stores and your brand website. Budgets move between channels only with your approval, and reporting shows the whole P&amp;L in one view.</p>", "introduction"],
]) if (count(C, find) !== 1) fail(`channels: the ${what} changed`);

const capCards = CAPS.map(([href, name]) => {
  const c = cards.find((x) => x[4] === href) || fail(`one team: no card links to ${href}`);
  // the arrow stays on the line of the name's last word
  const cut = name.lastIndexOf(" ");
  return `<article data-kq-row><img loading="lazy" decoding="async" src="${c[1]}" alt="${c[2]}"><div><h3><a class="kq-sl kq-il" href="${href}" style="display: inline">${name.slice(0, cut + 1)}<span>${name.slice(cut + 1)} ${ARROW}</span></a></h3><p>${c[3]}</p></div></article>`;
}).join("\n");
const oneTeam = `<section id="capabilities" style="background: #E1E9F1">
<div style="${WRAP}">
<div class="kq-hm-top" style="display: flex; flex-wrap: wrap; gap: 32px 80px; margin-bottom: 56px">
<div style="flex: 1.3 1 420px; display: flex; flex-direction: column; gap: 24px">
<h2 style="${H2}; width: 100%; max-width: 692px">One team, one agile omni-channel strategy.</h2>
<p style="margin: 0; max-width: 640px">Most brands split advertising, creative and operations across separate agencies, then lose margin where those plans disagree: ads that drive shoppers to products about to stock out, creative briefed without the search data, promotions with no stock behind them. We build a strategy for each channel and marketplace, then connect them in one plan that also accounts for your stores and your brand website, reviewed against one P&amp;L.</p>
${more("/why-kwontified", "Why brands choose Kwontified")}
</div>
<div style="flex: 1 1 360px; display: flex; flex-direction: column; gap: 12px">
<h3 style="margin: 0; font-size: 18px; font-weight: 500; color: #102A4C">What one team means for you</h3>
<ul style="margin: 0; padding: 0 0 0 20px; display: flex; flex-direction: column; gap: 8px; font-size: 17px">
<li>One named team and one inbox for every channel you sell in.</li>
<li>Sales, margin, advertising and inventory targets you approve for each channel. Budgets move between channels only with your approval.</li>
<li>A weekly update, plus monthly and quarterly business reviews against that strategy.</li>
<li>Senior leaders who stay involved long after onboarding.</li>
</ul>
</div>
</div>
<div class="kq-hm-caps">
${capCards}
</div>
<p class="kq-hm-after">${more("/capabilities", "See all six capabilities")}</p>
</div>
</section>`;

// =====================================================================================
// Channels: every channel linked to its own page, in menu order
// =====================================================================================
const rows = {};
for (const m of C.matchAll(/<li data-kq-row style="flex: 1 1 250px; display: flex; gap: 14px; padding: 10px 0">(<svg[\s\S]*?<\/svg>)<span><span style="font-weight: 500"><a class="kq-il kq-sl" href="([^"]+)">([^<]+)<\/a><\/span><br><span style="font-size: 15px; color: #626366">([^<]+)<\/span><\/span><\/li>/g)) rows[m[3]] = { icon: m[1], href: m[2], line: m[4] };
if (Object.keys(rows).length !== 11 || count(C, "<li ") !== 11) fail(`channels: expected 11 rows, found ${Object.keys(rows).length}`);
const row = (name) => rows[name] || fail(`channels: no row for ${name}`);
// drawn in the export's own icon style (24 unit grid, 1.5 stroke, square ends)
const BADGE = '<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" style="flex: none; margin-top: 2px"><circle cx="12" cy="9" r="5.5"></circle><path d="M8.5 13.5V21L12 18.5L15.5 21V13.5"></path></svg>';
// [page, name, line, icon]. One row per page: the two Amazon account types share Amazon's
// page, and the assistants are a capability (Agentic Commerce, in the section above).
const CHANNELS = [
  ["/channels/amazon", "Amazon", "Seller Central (3P) and Vendor Central (1P)", row("Amazon Seller Central").icon],
  ["/channels/amazon/brand-programs", "Amazon brand programs", "Vine, Premium Beauty, Luxury Stores and Creator Connections", BADGE],
  ["/channels/walmart", "Walmart", row("Walmart").line, row("Walmart").icon],
  ["/channels/target-plus", "Target Plus", row("Target Plus").line, row("Target Plus").icon],
  ["/channels/international", "International", "Amazon in 20+ countries, plus Zalando and Mercado Libre", row("International").icon],
  ["/channels/zalando", "Zalando", row("Zalando").line, row("Zalando").icon],
  ["/channels/mercado-libre", "Mercado Libre", row("Mercado Libre").line, row("Mercado Libre").icon],
  ["/channels/temu", "Temu", row("Temu").line, row("Temu").icon],
  ["/channels/tiktok-shop", "TikTok Shop", row("TikTok Shop").line, row("TikTok Shop").icon],
  ["/channels/instagram-shop", "Instagram Shop", row("Instagram Shop").line, row("Instagram Shop").icon],
];
for (const [href, name] of CHANNELS) if (name !== "Amazon" && name !== "Amazon brand programs" && row(name).href !== href) fail(`channels: ${name} no longer links to ${href}`);
if (row("International").line !== "Amazon in 20+ countries, plus Zalando, Mercado Libre and Temu") fail("channels: the International line changed");
// the brand programs line is the channels page's own
if (!read("channels.html").includes("Vine, Premium Beauty, Luxury Stores and Creator Connections.")) fail("the channels page no longer describes the Amazon brand programs this way");
const picture = (C.match(/<img loading="lazy" decoding="async" src="\/assets\/[^"]+" alt="A laptop showing a client portal dashboard[^"]*" style="width: 100%; height: auto; display: block; border-radius: 2px">\s*<p style="margin: 0; font-size: 14px; color: #626366">Illustrative data\.<\/p>/) || fail("channels: the picture or its caption changed"))[0];
if (count(C, ">9 weeks</p>") !== 1) fail("channels: the Target Plus result changed");
const channels = `<section id="channels" style="background: #F8F6F1">
<div class="kq-hm-chwrap" style="${WRAP}; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 48px 72px">
<div style="flex: 1.1 1 440px; min-width: 0; display: flex; flex-direction: column; gap: 24px">
<h2 style="${H2}">Every channel you sell in, run as one business.</h2>
<p style="margin: 0; max-width: 560px">Each channel and marketplace gets its own strategy, built for how its shoppers search and buy, and reporting shows the whole P&amp;L in one view.</p>
<ul aria-label="Channels we run" class="kq-hm-ch" style="list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 0 28px; font-size: 17px; line-height: 1.35">
${CHANNELS.map(([href, name, line, icon]) => `<li data-kq-row style="flex: 1 1 250px; display: flex; gap: 14px; padding: 10px 0">${icon}<span><span style="font-weight: 500"><a class="kq-il kq-sl" href="${href}">${name}</a></span><br><span style="font-size: 15px; color: #626366">${esc(line)}</span></span></li>`).join("")}
</ul>
${more("/channels", "See all channels")}
</div>
<div class="kq-hm-chpic" style="flex: 1 1 400px; min-width: 0; display: flex; flex-direction: column; gap: 14px">
${picture.replace(' style="width: 100%; height: auto; display: block; border-radius: 2px">', ' width="1536" height="1030" style="width: 100%; height: auto; display: block; border-radius: 2px">')}
${more("/capabilities/analytics-forecasting", "How we report across channels")}
</div>
</div>
</section>`;

// =====================================================================================
// Creative: four pieces from the gallery page, with that page's own captions and links
// =====================================================================================
const gallery = read("work--creative.html");
const figures = [...gallery.matchAll(/<figure\b[^>]*\sdata-gc="[^"]*"[^>]*>[\s\S]*?<\/figure>/g)].map((m) => m[0]);
if (figures.length < 8) fail(`the creative gallery has ${figures.length} pieces; expected at least 8`);
// [picture, width / height of the file]: a Storefront, an A+ module, a video and display ads
const PIECES = [["188df53f3859", 1.6], ["d9e37a300be1", 1], ["6de1dc61cd86", 0.8], ["b00b2ab212e1", 1]];
const pieces = PIECES.map(([id, ratio]) => {
  const f = figures.find((x) => x.includes(`src="/assets/${id}.jpg"`)) || fail(`the creative gallery no longer shows /assets/${id}.jpg`);
  const alt = (f.match(/<img\b[^>]*\salt="([^"]+)"/) || fail(`gallery piece ${id} has no description`))[1];
  const cap = f.match(/<figcaption [^>]*><span style="display: block; font-size: 14px; margin-bottom: 6px">([^<]+)<\/span>([^<]+?)\s*(?:<span style="color: #262524"><a class="kq-sl kq-il" href="(\/work\/[^"]+)">([^<]+)<\/a><\/span>)?<\/figcaption>/) || fail(`gallery piece ${id}: the caption changed`);
  const [, kind, who, href, result] = cap;
  return `<figure${href ? " data-kq-row" : ""} style="--r: ${ratio}"><img loading="lazy" decoding="async" src="/assets/${id}.jpg" alt="${alt}"><figcaption><span>${kind}</span>${who}${href ? ` <a class="kq-sl kq-il" href="${href}">${result}</a>` : ""}</figcaption></figure>`;
});
if (pieces.filter((p) => p.includes("data-kq-row")).length < 3) fail("fewer than three of the four creative pieces link to a case study");
for (const [find, what] of [["Creative that sells, still on brand.</h2>", "heading"], ['href="/capabilities/creative-studio"', "Creative Studio link"]]) if (count(S.work, find) !== 1) fail(`creative: the ${what} changed`);
if (count(S.work, "<article") !== 5) fail("creative: expected the export's five pictures");
const work = `<section id="work" style="background: #E1E9F1">
<div style="${WRAP}">
<div class="kq-hm-top" style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px 48px; margin-bottom: 48px">
<h2 style="flex: 1 1 420px; max-width: 760px; ${H2}">Creative that sells, still on brand.</h2>
${more("/work/creative", "See the creative gallery")}
</div>
<div class="kq-hm-work">
${pieces.join("\n")}
</div>
</div>
</section>`;

// =====================================================================================
// Press: the outlets, with the second quote beside them
// =====================================================================================
let press = S.press;
press = once(press, '<section id="press" style="background: #E1E9F1">\n<div style="max-width: 1280px; margin: 0 auto; padding: clamp(56px, 6vw, 88px) clamp(24px, 5.5vw, 80px)">\n', '<section id="press" style="background: #F8F6F1">\n<div style="max-width: 1280px; margin: 0 auto; padding: clamp(56px, 6vw, 88px) clamp(24px, 5.5vw, 80px)">\n<div class="kq-hm-press"><div>\n', "press: the opening");
if (!press.endsWith("</a>\n</div>\n</section>")) fail("the press section ends differently");
press = press.slice(0, -"</div>\n</section>".length) + "</div>" + quote(quotes[1]) + "</div>\n</div>\n</section>";
if (!read("about.html").includes('id="press-stage-title"')) fail('About no longer has the press list that "See all press" opens');

// =====================================================================================
// Questions: five. Out: the two that are word for word on /channels, and the two the page
// already answers in its first screen and its channel list.
// =====================================================================================
const CUT = ["What is an agile omni-channel strategy?", "How is that different from a multi-channel strategy?", "What does Kwontified do?", "Which marketplaces does Kwontified manage?"];
const KEEP = ["Which product categories does Kwontified serve?", "What is included in marketplace management?", "How is this different from hiring separate agencies?", "How often will we hear from you?", "How do we start?"];
let faq = S["faq-title"];
{
  const all = [...faq.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<\/details>/g)];
  const names = all.map((m) => text(m[1]));
  if (names.length !== 9 || [...CUT, ...KEEP].some((q) => !names.includes(q))) fail(`the questions changed: ${names.join(" | ")}`);
  for (const m of all) if (CUT.includes(text(m[1]))) faq = faq.replace(m[0], () => "");
  const channelsPage = text(read("channels.html"));
  for (const q of CUT.slice(0, 2)) if (!channelsPage.includes(q)) fail(`"${q}" is no longer answered on /channels; keep it here or move it`);
  faq = once(faq, "Six capabilities within one agile omni-channel strategy: retail media and advertising, creative, marketplace operations, analytics and forecasting, agentic commerce, and revenue recovery on Amazon.", "Six capabilities within one agile omni-channel strategy: Retail Media and Advertising, Creative Studio, Marketplace Operations, Analytics and Forecasting, Agentic Commerce, and Revenue Recovery on Amazon.", "questions: what is included");
  // the categories answer, as broad as Why Kwontified's list (Jordan, 2026-11-27: the site must not read as niche)
  faq = once(faq, "Kwontified works across hardlines, softlines and consumables. In hardlines that includes consumer electronics, small appliances and housewares. In softlines it includes apparel, footwear, handbags, luggage, accessories and jewelry. We also manage beauty and personal care, health and wellness, home goods, and consumer packaged goods such as food and beverage, household, baby and pet products.",
    "Almost any product that sells on marketplaces and social channels. Kwontified works across hardlines, softlines and consumables: apparel, footwear, handbags, swimwear, intimates, watches, jewelry, luggage and accessories; beauty, skincare, hair care and personal hygiene; health and wellness, supplements, consumer packaged goods, food and beverages; baby and pet products; home goods, housewares, home appliances, and lawn and garden equipment; and consumer electronics. If a product can be sold on these channels, we will most likely work with it.");
  if (count(faq, "<details") !== 5) fail("expected five questions");
}

if (count(S.contact, "A member of our team will reply within one business day") !== 1) fail('the closing section no longer says "A member of our team will reply"');
if (!/^<section id="interlude" aria-label="Product photograph"/.test(S.interlude) || text(S.interlude)) fail("the picture-only section now has text; look before removing it");

// ---- styles, this page only ----
const CSS = `<style data-kq-home>
/* phones: a shorter hero picture and tighter spacing, so the review button is on the first screen.
   overflow-anchor: the header gets shorter on the first scroll; the browser holds the page still by
   pinning an element, and it cannot pin the hero text (its entrance animation rules that out), so it
   is told to pin the next thing down instead. Without this a jump straight past the picture moved
   the page by the header's 24px. */
@media (max-width:760px){.kq-fh .kq-fh-media{aspect-ratio:2.39/1!important}.kq-fh .kq-fh-text{padding-top:18px!important;padding-bottom:36px!important;overflow-anchor:none}.kq-fh .kq-fh-text,.kq-fh .kq-fh-text>div{gap:14px!important}}
.kq-hm-label{margin:0 0 20px;font-size:15px;line-height:1.5;font-weight:500;color:#775812}
.kq-hm-quote{margin:0;display:flex;flex-direction:column;gap:18px}
.kq-hm-quote blockquote{margin:0;max-width:34em;font-size:22px;line-height:1.35;letter-spacing:-.01em}
.kq-hm-quote figcaption{font-size:15px}
#results .kq-hm-say{margin-top:64px;padding-top:32px;border-top:1px solid #D3D9DF}
@media (min-width:900px){#results .kq-hm-say{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.4fr);gap:0 64px}}
.kq-hm-after{margin:40px 0 0}
/* six capabilities */
.kq-hm-caps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px 32px}
.kq-hm-caps>article{display:flex;flex-direction:column;gap:18px;min-width:0}
.kq-hm-caps img{width:100%;height:auto;aspect-ratio:4/3;display:block;border-radius:2px;object-fit:cover}
.kq-hm-caps h3{margin:0 0 8px;font-size:26px;line-height:1.12;letter-spacing:-.015em;font-weight:400;color:#102A4C}
.kq-hm-caps h3 span{white-space:nowrap}.kq-hm-caps h3 svg{margin-left:4px;vertical-align:-1px}
.kq-hm-caps p{margin:0;font-size:17px}
/* creative strip: whole pieces at one height, each as wide as its own shape */
.kq-hm-work{display:flex;align-items:flex-start;gap:20px}
.kq-hm-work>figure{margin:0;min-width:0;flex:var(--r) 1 0%}
.kq-hm-work img{width:100%;height:auto;aspect-ratio:var(--r);display:block;border-radius:2px;object-fit:cover}
.kq-hm-work figcaption{margin-top:14px;font-size:15px;line-height:1.45;color:#626366}
.kq-hm-work figcaption span{display:block;margin-bottom:4px;font-size:14px}
.kq-hm-work figcaption a{color:#262524}
/* press and the second quote */
.kq-hm-press{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:48px clamp(40px,6vw,96px);align-items:start}
#press ul{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 28px!important}
#press ul>li{min-width:0}
@media (max-width:1079px){.kq-hm-press{grid-template-columns:minmax(0,1fr)}#press ul{grid-template-columns:repeat(5,minmax(0,1fr))}#press ul>li :is(img,svg){max-width:100%;height:auto!important}
.kq-hm-work{--h:min(240px,50vw);overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;margin:-6px calc(-1 * clamp(24px,5.5vw,80px)) -6px -6px;padding:6px clamp(24px,5.5vw,80px) 10px 6px;scroll-padding-left:6px}
.kq-hm-work>figure{flex:0 0 auto;width:max(calc(var(--r) * var(--h)),210px);scroll-snap-align:start}
.kq-hm-work img{width:auto;max-width:100%;height:var(--h)}}
@media (max-width:1079px) and (hover:none){.kq-hm-work{scrollbar-width:none}.kq-hm-work::-webkit-scrollbar{display:none}}
@media (max-width:1000px){.kq-hm-caps{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:760px){
main>section:not(#top):not(#finder):not(#contact)>div{padding-top:48px!important;padding-bottom:48px!important}
/* both logo lists: three columns */
#clients ul,#press ul{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px 14px!important}
#clients ul>li,#press ul>li{min-width:0;min-height:48px!important}
#clients ul>li :is(img,svg),#press ul>li :is(img,svg){max-width:100%;height:auto!important}
#results div[style*="margin-bottom: 56px"],.kq-hm-top{margin-bottom:32px!important}
#results div[style*="gap: 48px 64px"]{gap:28px!important}
#results .kq-hm-say{margin-top:40px;padding-top:28px}
.kq-hm-label{margin-bottom:14px}
.kq-hm-quote blockquote{font-size:19px}
.kq-hm-press{gap:36px}
.kq-hm-after{margin-top:20px}
/* section headings at the size the inner pages use on a phone (the finder keeps its own) */
main>section h2[style*="font-size: 40px"]{font-size:30px!important}
/* six capabilities: one row to swipe, as the creative strip */
.kq-hm-caps{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:-6px calc(-1 * clamp(24px,5.5vw,80px)) -6px -6px;padding:6px clamp(24px,5.5vw,80px) 10px 6px;scroll-padding-left:6px}
.kq-hm-caps::-webkit-scrollbar{display:none}
.kq-hm-caps>article{flex:0 0 78%;gap:14px;scroll-snap-align:start}
.kq-hm-caps h3{font-size:22px;margin-bottom:6px}
/* channels: the list carries the section on a phone */
.kq-hm-chpic img,.kq-hm-chpic p{display:none!important}
.kq-hm-chwrap{gap:0!important}
#perspectives div[style*="margin-bottom: 48px"]{margin-bottom:32px!important}
#perspectives div[style*="gap: 48px 56px"]{gap:32px!important}
section[aria-labelledby="faq-title"] div[style*="gap: 40px 80px"]{gap:24px!important}
section[aria-labelledby="faq-title"] details{padding:18px 20px!important}
section[aria-labelledby="faq-title"] summary{font-size:19px!important;line-height:1.3}
}
</style>`;

// ---- put it together ----
const order = [S.top, S.clients, results, oneTeam, channels, work, press, S.finder, S.perspectives, faq, S.contact];
const newMain = "\n\n" + order.join("\n\n") + "\n";
let out = html.slice(0, start) + newMain + html.slice(b);
out = once(out, "</head>", CSS + "</head>", "the end of <head>");

// the FAQ structured data, rebuilt from the questions on the page
{
  const qa = [...newMain.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({ "@type": "Question", name: text(m[1]), acceptedAnswer: { "@type": "Answer", text: text(m[2]) } }));
  if (qa.map((q) => q.name).join("|") !== KEEP.slice().sort((x, y) => newMain.indexOf(x) - newMain.indexOf(y)).join("|")) fail("the questions on the page are not the five expected");
  let n = 0;
  out = out.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (all, body) => {
    let j; try { j = JSON.parse(body); } catch { return all; }
    if (j["@type"] !== "FAQPage") return all;
    n++; j.mainEntity = qa;
    return `<script type="application/ld+json">${JSON.stringify(j)}</script>`;
  });
  if (n !== 1) fail(`expected one FAQPage block, found ${n}`);
}

// ---- checks on the result ----
if (!out.includes(S.finder)) fail("the case finder changed while being moved");
if (!out.includes(S.top) || !out.includes(S.perspectives) || !out.includes(S.contact) || !out.includes(S.clients)) fail("a section that should be untouched changed");
for (const l of ["Selected clients", "Publications that have featured Kwontified"]) {
  const at = out.indexOf(`<ul aria-label="${l}"`), list = out.slice(at, out.indexOf("</ul>", at));
  if (at < 0 || count(list, '<svg role="img"') !== 15 || !list.slice(0, list.indexOf(">")).includes("color: #262524")) fail(`the list "${l}" no longer has its 15 logos`);
}
const body = text(newMain);
const said = count(body, "agile omni-channel strategy");
if (said < 1 || said > 3) fail(`"agile omni-channel strategy" appears ${said} times in the page body; the plan is one to three`);
if (/\bRufus\b|managing partner/i.test(body)) fail("a retired term is on the page");
const links = [...newMain.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((m) => m[1]);
for (const h of links) if (h.startsWith("/") && !routes.has(h.split("#")[0].split("?")[0])) fail(`${h} is not a page on the site`);
for (const r of ["/why-kwontified", "/capabilities", "/channels", "/work/creative", "/contact", ...CAPS.map((c) => c[0]), ...CHANNELS.map((c) => c[0])]) if (!links.includes(r)) fail(`the page body does not link to ${r}`);
const ids = [...out.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
if (dup.length) fail(`an id is used twice: ${[...new Set(dup)].join(", ")}`);
if (count(newMain, "<section") !== 11 || count(newMain, "</section>") !== 11) fail("expected 11 sections");

fs.writeFileSync(path.join(DIR, FILE), out);
console.log(`site-home: home page rebuilt (11 sections, was 13; ${body.split(" ").length} words, was ${text(main).split(" ").length}; one quote with the results and one with the press logos; 6 capabilities and ${CHANNELS.length} channels linked by name; ${pieces.length} gallery pieces; 5 questions, was 9; "agile omni-channel strategy" ${said} times)`);
