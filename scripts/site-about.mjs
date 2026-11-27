// About and Why Kwontified: one job each.
//
// In the export the two pages did each other's work. About carried "how we work" (the
// approach, data and AI, the first 50 days) while Why Kwontified carried the company's eight
// values; both opened on "built by operators"; neither used the client logos or the two
// client quotes the home page has. Reviewed 2026-11-27 (About 53/100, Why 48/100) and
// approved by Jordan with these decisions: no company figures; client names, logos and
// quotes may be used; the client portal is shown as an illustrative example; nothing about
// fees or minimum terms; the current imagery stays.
//
//   About answers "who are these people?": story, leadership, values, clients, results,
//   credentials, press, offices, careers.
//   Why Kwontified answers "why hire them over the alternatives?": who it suits, a plain
//   comparison, the differences (each with a linked result), client voice, the portal, data
//   and AI, the first 50 days, three commitments, questions.
//
// Sections are moved whole wherever the export's own section fits; new ones are written here
// in the same markup. The client and press logo lists are left as markers
// (<!--kq-logos:clients-->, <!--kq-logos:press-->) that site-logos.mjs fills once it has
// written the logo files. The capability, channel and case study pages get a link to Why
// Kwontified beside their review button, and Careers gets the values in short.
//
// Runs after site-contact.mjs and before site-seo.mjs. Fails if a section it expects is
// missing or renamed, so a new export is looked at before this rearranges it.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const fail = (m) => { throw new Error("site-about: " + m); };
const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => r.route));
const need = (...rs) => { for (const r of rs) if (!routes.has(r.split("#")[0].split("?")[0])) fail(`${r} is not a page on the site`); };
const read = (f) => fs.readFileSync(path.join(DIR, f), "utf8");
const once = (html, find, put, what) => {
  const n = html.split(find).length - 1;
  if (n !== 1) fail(`${what}: expected once, found ${n} times`);
  return html.replace(find, () => put);
};
const text = (h) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// ---- a page as: everything before its sections, the sections by heading, everything after ----
function page(file, expected) {
  const html = read(file);
  if (html.includes("data-kq-about")) fail(`${file}: already applied; run the whole build`);
  const a = html.indexOf("<main"), b = html.indexOf("</main>");
  if (a < 0 || b < 0) fail(`${file}: no <main>`);
  const start = html.indexOf(">", a) + 1, main = html.slice(start, b);
  const list = [];
  let depth = 0, at = -1, m;
  const re = /<(\/?)section\b[^>]*>/g;
  while ((m = re.exec(main))) {
    if (!m[1]) { if (depth === 0) at = m.index; depth++; }
    else if (--depth === 0) list.push(main.slice(at, m.index + m[0].length));
  }
  const by = {};
  for (const s of list) by[text((s.match(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/) || fail(`${file}: a section has no heading`))[1])] = s;
  const names = Object.keys(by);
  if (names.join(" | ") !== expected.join(" | ")) fail(`${file}: the sections changed.\n   expected: ${expected.join(" | ")}\n   found:    ${names.join(" | ")}`);
  return { html, head: html.slice(0, start), tail: html.slice(b), by };
}
const withId = (sec, id) => (/^<section\b[^>]*\sid="/.test(sec) ? sec.replace(/^(<section\b[^>]*\sid=")[^"]*/, (_, a) => a + id) : sec.replace(/^<section\b/, `<section id="${id}"`));

// ---- shared markup, in the export's own style ----
const PAD = "padding: clamp(64px, 7vw, 112px) clamp(20px, 4.4vw, 64px)";
const WRAP = '<div style="max-width: 1312px; margin: 0 auto">';
const H2 = "margin: 0; font-weight: 400; font-size: clamp(30px, 2.8vw, 40px); line-height: 1.06; letter-spacing: -0.025em; max-width: 12em";
const P = "margin: 0; max-width: 36em; font-size: clamp(18px, 1.53vw, 22px); line-height: 1.55";
const two = (left, right) => `<div style="display: flex; flex-wrap: wrap; gap: 40px 80px"><div style="flex: 1 1 360px; min-width: 0">${left}</div><div style="flex: 999 1 620px; min-width: 0">${right}</div></div>`;
const section = (id, title, bg, body, dark = false) => `<section id="${id}" aria-labelledby="${id}-title" style="${PAD}; background: ${bg}${dark ? "; color: #F8F6F1" : ""}">${WRAP}${body}</div></section>`;
const onPage = (items) => `<nav class="kq-onpage" aria-label="On this page"><ul>${items.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></nav>`;

const home = read("index.html");
// the two client quotes, exactly as the home page has them
const quotesAt = home.indexOf("What clients say");
const quotes = [...home.slice(quotesAt, home.indexOf("</section>", quotesAt)).matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0]);
if (quotes.length !== 2 || !/Dr\. Brandt/.test(quotes[0]) || !/Vilebrequin/.test(quotes[1])) fail("the home page no longer has the two client quotes");
for (const l of ["Selected clients", "Publications that have featured Kwontified"]) if (!home.includes(`<ul aria-label="${l}"`)) fail(`the home page list "${l}" is missing`);
// Two sections, so the names and the words read as different things: the logos on the
// lightest ground, then the two quotes on navy with a gold rule over each. `after` is whatever
// follows the quotes inside the navy section (on Why Kwontified, the mid-page review button).
const clients = (id, more, after) =>
  section(id, "Selected clients", "#FDFCFA", `<h2 id="${id}-title" style="${H2}">Selected clients</h2><!--kq-logos:clients-->${more}`) + "\n" +
  `<section id="${id}-say" class="kq-ab-say" aria-labelledby="${id}-say-title" style="${PAD}; background: #102A4C; color: #F8F6F1">${WRAP}<h2 id="${id}-say-title" style="${H2}; color: #F8F6F1">What clients say</h2><div class="kq-ab-quotes">${quotes.join("")}</div>${after}</div></section>`;

need("/capabilities/retail-media", "/capabilities/creative-studio", "/capabilities/marketplace-operations", "/capabilities/analytics-forecasting", "/capabilities/agentic-commerce", "/capabilities/revenue-recovery",
  "/work", "/work/shortage-claims", "/work/sales-up-22-while-tacos-fell-3-7-points", "/about/careers", "/about/leadership", "/contact", "/client-sign-in", "/why-kwontified", "/about", "/perspectives");

// =====================================================================================
// About
// =====================================================================================
const A = page("about.html", ["Built by marketplace operators.", "Who we are", "Our story", "Our approach", "Results from recent engagements", "Leadership", "In the press", "Data and AI behind the work", "Credentials held across the team", "How an engagement starts", "Questions people ask about Kwontified", "Get a first read on your marketplace business."]);
const W = page("why-kwontified.html", ["Why brands choose Kwontified.", "Built by operators", "How we solve problems", "One agile omni-channel strategy", "Decisions made from your data", "Service built for premium brands", "Our values", "Questions executives ask", "See how we would run your business."]);

// Who we are: facts in the tiles, the six capabilities by their own names
let who = A.by["Who we are"];
const tiles = [["2016", "Founded, in Atlanta"], ["8", "Marketplaces we manage"], ["3", "Offices: Atlanta, New York and Seattle"], ["1P and 3P", "Vendor and seller accounts"]];
const tile = who.match(/<li style="background: #FDFCFA; padding: 24px 28px"><p style="([^"]*)">Since 2016<\/p><p style="([^"]*)">[^<]*<\/p><\/li>/) || fail("About: the three tiles changed");
who = who.replace(/(<ul style="margin: 48px 0 0;[^"]*">)[\s\S]*?(<\/ul>)/, (_, o, c) => o.replace("<ul ", '<ul class="kq-ab-tiles" ') + tiles.map(([n, l]) => `<li style="background: #FDFCFA; padding: 24px 28px"><p style="${tile[1]}">${n}</p><p style="${tile[2]}">${l}</p></li>`).join("") + c);
const CAPS = [
  ["/capabilities/retail-media", "Retail Media and Advertising", "Amazon, Walmart Connect and Target Roundel"],
  ["/capabilities/creative-studio", "Creative Studio", "Product photography, video, A+ Content and Storefronts"],
  ["/capabilities/marketplace-operations", "Marketplace Operations", "Catalog, inventory, demand planning and brand program launches"],
  ["/capabilities/analytics-forecasting", "Analytics and Forecasting", "Sales forecasts, promotion planning and performance reporting"],
  ["/capabilities/agentic-commerce", "Agentic Commerce", "Preparing brands for AI shopping assistants"],
  ["/capabilities/revenue-recovery", "Revenue Recovery", "Shortage and price claims"],
];
if (!who.includes("Reputation management</li></ul>")) fail('About: the "What we do" list changed');
who = who.replace(/(<h3 style="[^"]*">What we do<\/h3><ul style="[^"]*">)[\s\S]*?(<\/ul>)/, (_, o, c) => o + CAPS.map(([href, name, line]) => `<li style="padding: 14px 0; border-top: 1px solid #D3D9DF"><a href="${href}" style="color: #102A4C; font-weight: 500">${name}</a><br><span style="font-size: 16px; color: #626366">${line}</span></li>`).join("") + c);
who = withId(who, "who");

// Our story: three short paragraphs and three dates; the city photographs move to Offices
let story = A.by["Our story"];
const cities = [...story.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map((m) => m[0]);
if (cities.length !== 3) fail("About: expected three city photographs in Our story");
const storyH2 = (story.match(/<h2 id="story-title"[^>]*>Our story<\/h2>/) || fail("About: no Our story heading"))[0];
story = section("story", "Our story", "#F8F6F1", two(
  `${storyH2}<dl class="kq-ab-dates"><div><dt>2016</dt><dd>Founded in Atlanta</dd></div><div><dt>2017</dt><dd>First quoted in the national press</dd></div><div><dt>Today</dt><dd>Eight marketplaces, three offices</dd></div></dl>`,
  `<p style="${P}">Kwontified started in 2016 on one observation: brands that make excellent products often run marketplace businesses well below what those products could earn.</p>` +
  `<p style="${P}; margin-top: 20px">The people who started it had run these businesses themselves: Amazon Fashion’s luxury goods P&amp;L across 150+ brands, and digital marketing teams serving 11,000+ clients. So we built one team that runs advertising, creative and operations to one agile omni-channel strategy, to close that gap.</p>` +
  `<p style="${P}; margin-top: 20px">Today we manage eight marketplaces for premium consumer brands from our headquarters in Atlanta, Georgia, and offices in New York and Seattle, and we prepare those brands for the AI assistants that now sit between the shopper and the purchase.</p>`,
)).replace(' aria-labelledby="story-title-title"', ' aria-labelledby="story-title"');

// Values: the whole section from Why Kwontified
let values = withId(W.by["Our values"], "values");
values = once(values, "Eight values guide how we make decisions, build our team and work with every client.</p>", 'Eight values guide how we make decisions, build our team and work with every client. <a href="/about/careers" style="color: #102A4C">See open roles</a></p>', "About: the values introduction");

// Credentials: the two Amazon partner statuses first
let creds = withId(A.by["Credentials held across the team"], "credentials");
creds = creds.replace(/(<ul style="flex: 999 1 560px;[^"]*">)([\s\S]*?)(<\/ul>)/, (_, o, items, c) => {
  const lis = items.match(/<li\b[\s\S]*?<\/li>/g) || [];
  const first = lis.filter((l) => /Amazon Ads Partner|Service Provider Network/.test(l));
  if (lis.length !== 11 || first.length !== 2) fail("About: the credentials list changed");
  return o + [...first.sort((x) => (/Ads Partner/.test(x) ? -1 : 1)), ...lis.filter((l) => !first.includes(l))].join("") + c;
});

// Press: the outlets as logos, the six pieces with their dates, and where press goes now
let press = withId(A.by["In the press"], "press");
press = once(press, "Our founders have been quoted on Amazon and marketplace retail since 2017 by the outlets executives read.</p>",
  'Our founders have been quoted on Amazon and marketplace retail by the outlets executives read. Six of those pieces are here, each with its date.</p><p style="margin: 16px 0 0; max-width: 26em">For interviews and comment: <a href="mailto:press@kwontified.com" style="color: #102A4C">press@kwontified.com</a>. <a href="/perspectives?type=press" style="color: #102A4C">Press releases</a></p>', "About: the press introduction");
press = press.replace(/<\/div><\/section>$/, () => '<h3 class="kq-ab-sub">Publications that have featured Kwontified</h3><!--kq-logos:press--></div></section>');

// Offices: the three city photographs, now with the addresses
const OFFICES = [["Atlanta (headquarters)", "7000 Central Parkway, Suite 1100<br>Atlanta, GA 30328"], ["New York", "175 Greenwich Street, 38th Floor<br>New York, NY 10007"], ["Seattle", "1201 Third Avenue, Suite 2200<br>Seattle, WA 98101"]];
const footer = A.html.slice(A.html.lastIndexOf("<footer"));
for (const [, addr] of OFFICES) if (!text(footer).includes(text(addr.split("<br>")[0]))) fail("About: an office address differs from the footer's: " + addr);
const offices = section("offices", "Offices", "#F8F6F1",
  `<h2 id="offices-title" style="${H2}">Offices</h2><ul class="kq-ab-offices">${cities.map((fig, i) => `<li>${fig.replace(/<figcaption[\s\S]*?<\/figcaption>/, "").replace(/aspect-ratio: 3 \/ 5/, "aspect-ratio: 4 / 3")}<h3>${OFFICES[i][0]}</h3><p>${OFFICES[i][1]}</p></li>`).join("")}</ul>` +
  `<p class="kq-ab-reach"><a href="tel:+14048739148">404.873.9148</a> <a href="mailto:contact@kwontified.com">contact@kwontified.com</a> <a href="/contact">Request a marketplace review</a></p>`);
for (const [i, c] of ["Atlanta", "New York", "Seattle"].entries()) if (!cities[i].includes(`>${c}</figcaption>`)) fail("About: the city photographs are not in the order Atlanta, New York, Seattle");

const aboutClients = clients("clients", "", "");
const results = withId(A.by["Results from recent engagements"], "results");
const aboutMain = [
  A.by["Built by marketplace operators."],
  onPage([["#story", "Our story"], ["#leadership", "Leadership"], ["#values", "Values"], ["#clients", "Clients"], ["#credentials", "Credentials"], ["#press", "Press"], ["#offices", "Offices"], ["/about/careers", "Careers"]]),
  who, story, A.by["Leadership"], values, aboutClients, results, creds, press, offices,
  withId(A.by["Questions people ask about Kwontified"], "questions"), A.by["Get a first read on your marketplace business."],
].join("\n");

// =====================================================================================
// Why Kwontified
// =====================================================================================
const fit = section("fit", "fit", "#E1E9F1", two(
  `<h2 id="fit-title" style="${H2}">Who we are the right fit for</h2><p style="margin: 24px 0 0; max-width: 26em">Kwontified is an agency. Our team runs your marketplace accounts from inside them; we do not sell software.</p>`,
  `<ul class="kq-ab-fit"><li>Premium consumer brands, with beauty, fashion and consumables at the core.</li><li>Brands selling through vendor accounts, seller accounts or both, on one marketplace or several.</li><li>Teams that want one partner accountable for advertising, creative, operations and reporting, working to a plan they approve.</li></ul>`,
) + `<h3 class="kq-ab-sub" id="compare-title">Compared with the alternatives</h3><p style="margin: 10px 0 0; max-width: 40em">How the three usually differ.</p>
<table class="kq-ab-cmp" aria-labelledby="compare-title"><thead><tr><td></td><th scope="col">An in-house team alone</th><th scope="col">Several specialist agencies</th><th scope="col">Kwontified</th></tr></thead><tbody>
<tr><th scope="row">Who owns the plan</th><td data-th="An in-house team alone">Your team, alongside everything else it runs</td><td data-th="Several specialist agencies">Each agency, for its own channel or service</td><td data-th="Kwontified">One team, to one plan you approve across every marketplace</td></tr>
<tr><th scope="row">Advertising, creative and operations</th><td data-th="An in-house team alone">Hired and managed role by role</td><td data-th="Several specialist agencies">Split across vendors, so advertising can outrun the stock behind it</td><td data-th="Kwontified">Run together: the team that plans your advertising also runs the account behind it</td></tr>
<tr><th scope="row">Reporting</th><td data-th="An in-house team alone">Built and maintained by your team</td><td data-th="Several specialist agencies">A separate report from each vendor</td><td data-th="Kwontified">One portal: a dashboard for each channel and a written update every week</td></tr>
<tr><th scope="row">Marketplace experience</th><td data-th="An in-house team alone">Depends on who you can hire</td><td data-th="Several specialist agencies">Deep in one specialty</td><td data-th="Kwontified">Led by operators who ran Amazon Fashion’s luxury goods P&amp;L</td></tr>
</tbody></table>`);

let ops = withId(W.by["Built by operators"], "operators");
ops = once(ops, ">Built by operators</h2>", ">Led by people who ran these businesses</h2>", "Why: the operators heading");
let solve = withId(W.by["How we solve problems"], "how");
solve = once(solve, "we recovered $781K in shortage claims", 'we <a href="/work/shortage-claims" style="color: #102A4C">recovered $781K in shortage claims</a>', "Why: the shortage claims result");
let omni = W.by["One agile omni-channel strategy"];
{
  const m = omni.match(/<p style="(margin: 0; max-width: 36em;[^"]*)">(A traditional multi-channel plan[\s\S]*?)<\/p>/) || fail("Why: the omni-channel paragraph changed");
  const cuts = ["We work differently.", "It is agile because", "Within a channel we work the way you prefer."];
  let rest = m[2]; const parts = [];
  for (const c of cuts) { const i = rest.indexOf(c); if (i < 1) fail(`Why: the omni-channel paragraph no longer has "${c}"`); parts.push(rest.slice(0, i).trim()); rest = rest.slice(i); }
  parts.push(rest.trim());
  omni = omni.replace(m[0], () => parts.map((p, i) => `<p style="${i ? m[1].replace("margin: 0;", "margin: 18px 0 0;") : m[1]}">${p}</p>`).join(""));
}
let data = W.by["Decisions made from your data"];
data = once(data, "Amazon sales grew 22% while TACoS fell 3.7 points", '<a href="/work/sales-up-22-while-tacos-fell-3-7-points" style="color: #102A4C">Amazon sales grew 22% while TACoS fell 3.7 points</a>', "Why: the pet supplements result");

const btn = (A.by["Get a first read on your marketplace business."].match(/<a class="kq-btn kq-btn-light" href="\/contact"[^>]*>/) || fail("no review button to copy"))[0];
const midCta = `<div class="kq-ab-ask"><p>Want to see where we would start on your account? A managing partner reads every request.</p>${btn}Get your first read</a></div>`;

// The client portal, drawn to match the Kwontified Client Portal mockups (the Overview screen):
// the same layout, type sizes, colours and sample skincare brand. It is a picture of the
// product, not live data, so it is one labelled image for assistive technology and is kept
// out of search snippets; the sample figures are the mockups' own.
const PT = {
  nav: [["Overview", 0, true], ["Channels", "g"], ["Amazon", 0], ["Sales", 1], ["Advertising", 1], ["Marketing Cloud", 1], ["Operations", 1], ["Walmart", 0], ["Target Plus", 0], ["Your account", "g"], ["Reports and forecasts", 0], ["Call notes and projects", 0], ["Team and access", 0]],
  kpis: [["Total sales", "$1,238,100", "+8.3%", "pos"], ["Ad spend", "$114,940", "+8.4%", ""], ["ROAS", "4.37x", "+1.7%", "pos"], ["TACoS", "9.3%", "+0.0 pts", ""]],
  alerts: [
    ["High", "Retinol serum: 2.9 weeks of cover", "Runs out around Nov 12 unless the inbound shipment lands first.", "$39,400", "weekly sales", "Inventory"],
    ["High", "Behind the October goal", "Forecast $1,229,000 against $1,240,000, with 8 days left.", "$10,900", "short of goal", "Sales overview"],
    ["High", "3 suppressed listings", "Mineral sunscreen (two sizes) and the gift set cannot be bought until the fixes are approved.", "3", "listings", "Account health"],
    ["Medium", "3 campaigns ran out of budget", "89 hours without ads this month, on campaigns returning 4.06x to 5.21x.", "$5,100", "est. ad sales missed", "Sponsored ads"],
  ],
  trends: [
    ["Sales", "$259,574", "+0.8%", [249039, 255417, 253306, 257488, 255701, 248337, 322765, 259574]],
    ["Sponsored ads ROAS", "4.61x", "−2.2%", [4.345, 4.755, 4.681, 4.713, 3.706, 4.117, 5.143, 4.609]],
    ["New-to-brand share of ad sales", "39.9%", "−0.1 pts", [38.89, 39.37, 40.07, 40.05, 40.06, 39.67, 39.93, 39.92]],
    ["Sessions", "100,703", "+0.5%", [100168, 100174, 99637, 100239, 99979, 95703, 118603, 100703]],
  ],
};
// a small line for eight weekly values: the mockups' blue, a faint base line, a dot on the latest week
function spark(v) {
  const W = 200, H = 52, pad = 5, lo = Math.min(...v), hi = Math.max(...v), span = hi - lo || 1;
  const pts = v.map((y, i) => [pad + (i * (W - 2 * pad)) / (v.length - 1), H - pad - ((y - lo) / span) * (H - 2 * pad - 6)]);
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" "), last = pts[pts.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" preserveAspectRatio="none"><line x1="${pad}" y1="${H - 1}" x2="${W - pad}" y2="${H - 1}" stroke="#E5E5E5"/><path d="${d} L${last[0].toFixed(1)} ${H - 1} L${pad} ${H - 1} Z" fill="#00618D" fill-opacity=".07"/><path d="${d}" fill="none" stroke="#00618D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg><i style="left:${((last[0] / W) * 100).toFixed(1)}%;top:${((last[1] / H) * 100).toFixed(1)}%"></i>`;
}
const ICON = { 0: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></svg>', 1: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 12.5l3.5-4 3 2.5 4.5-6"/></svg>' };
const portal = section("portal", "portal", "#F8F6F1", two(
  `<h2 id="portal-title" style="${H2}">The client portal</h2>`,
  `<p style="${P}">Every dashboard, report, forecast, call note and open task for your account is in one place, and you see the same numbers we do. Tables export to CSV or Excel.</p><p style="margin: 16px 0 0"><a href="/client-sign-in" style="color: #102A4C">Client sign-in</a></p>`,
) + `<figure class="kq-pt-fig"><div class="kq-pt" role="img" data-nosnippet aria-label="Illustration of the client portal’s Overview screen for a sample skincare brand. A side menu lists the overview, each channel and its dashboards, reports and forecasts, call notes and projects, and team access. The page opens with a one-sentence summary of the month, then four headline figures with their change on last month, a list of what needs attention ranked by severity and sales at stake, and weekly trends for sales, return on ad spend, new-to-brand share and sessions.">
<div class="kq-pt-side"><p class="kq-pt-brand"><b>KWONTIFIED</b><span>Client portal</span></p>${PT.nav.map(([label, kind, on]) => (kind === "g" ? `<p class="kq-pt-grp">${label}</p>` : `<p class="kq-pt-nv${kind ? " sub" : ""}${on ? " on" : ""}">${ICON[kind]}<span>${label}</span></p>`)).join("")}<p class="kq-pt-usr"><i>MC</i><span>Maya Chen</span></p></div>
<div class="kq-pt-main"><div class="kq-pt-top"><p class="kq-pt-search"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>Search dashboards, products and reports</p><p class="kq-pt-tag">Illustrative example</p><p class="kq-pt-scope">Sample skincare brand</p></div>
<div class="kq-pt-sheet"><p class="kq-pt-crumb">Sample skincare brand</p><div class="kq-pt-trow"><div><p class="kq-pt-h1">Overview</p><p class="kq-pt-find">Sales across your three channels reached $1,238,100 in October so far; Amazon is forecast $10,900 short of goal, and a recommendation from your team would close most of it.</p></div><p class="kq-pt-stamp">Data as of Oct 24, 6:00 a.m. ET</p></div>
<div class="kq-pt-ctl"><span>Oct 1 to 23, 2026</span><span>vs same days last month</span><span class="kq-pt-exp">Export page</span></div>
<div class="kq-pt-card kq-pt-kstrip">${PT.kpis.map(([l, v, d, c]) => `<div><p class="kl">${l}</p><p class="kv">${v}</p><p class="kd"><span class="${c || "mut"}">${d}</span> <span class="mut">vs Sep 1 to 23</span></p></div>`).join("")}</div>
<div class="kq-pt-cols"><div class="kq-pt-card"><p class="kq-pt-h2">Needs attention</p><p class="kq-pt-csub">Today, across your channels. Ranked by severity, then by sales at stake</p><ul class="kq-pt-att">${PT.alerts.map(([sev, t, d, n, u, go]) => `<li><span class="pill ${sev === "High" ? "bad" : "warn"}">${sev}</span><div><p class="at">${t}</p><p class="ad">${d}</p></div><div class="av"><span><strong>${n}</strong> <small>${u}</small></span><span class="go">${go} →</span></div></li>`).join("")}</ul></div>
<div class="kq-pt-card tint"><p class="kq-pt-h2">Weekly trends</p><p class="kq-pt-csub">Last eight complete weeks, Aug 25 to Oct 19</p><div class="kq-pt-sm">${PT.trends.map(([l, v, d, series]) => `<div><p class="kl">${l}</p><p class="sv">${v}</p><p class="kd mut">${d} vs four weeks earlier</p><div class="kq-pt-spark">${spark(series)}</div></div>`).join("")}</div></div></div>
</div></div></div><figcaption>An illustrative example of the portal’s Overview screen, with a sample brand’s figures. It does not show a client’s data.</figcaption></figure>
<ul class="kq-pt-points"><li><strong>One overview across every channel</strong>The month in a sentence, then the figures behind it.</li><li><strong>What needs attention, ranked</strong>By severity, then by the sales at stake, each with its next step.</li><li><strong>Dated to the source</strong>Every page says how fresh each channel’s data is.</li></ul>`);

const commitments = section("commitments", "commitments", "#E1E9F1",
  `<h2 id="commitments-title" style="${H2}">Three commitments</h2><p style="margin: 24px 0 0; max-width: 34em; font-size: 18px; line-height: 1.5">They come from the eight values we hire and work by. <a href="/about#values" style="color: #102A4C">Read all eight</a></p>
<ol class="kq-ab-commit"><li><h3>You hear about problems from us first</h3><p>As soon as we see one, along with what we are doing about it.</p></li><li><h3>Work is reviewed before it reaches you</h3><p>And we tell you plainly when something can be better, including our own work.</p></li><li><h3>Senior people stay on your account</h3><p>The leaders who shape your strategy stay involved long after onboarding, and still read the search-term reports and case logs themselves.</p></li></ol>`);

// "Service built for premium brands" is not carried over: its points are now made where they
// can be seen (the portal section, the third commitment, and the question "Who works on our account?").
for (const k of ["named team", "senior leaders", "portal holds every dashboard"]) if (!W.by["Service built for premium brands"].includes(k)) fail(`Why: the service section changed (no "${k}"); check what is being dropped`);

// Questions: the three about the omni-channel strategy become one
let faq = withId(W.by["Questions executives ask"], "questions");
{
  const items = faq.match(/<details\b[\s\S]*?<\/details>/g) || [];
  if (items.length !== 10) fail(`Why: expected 10 questions, found ${items.length}`);
  const q = (d) => text((d.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || "");
  const gone = ["What does the omni-channel strategy cover?", "How is that different from a multi-channel strategy?"];
  const keep = "What is an agile omni-channel strategy?";
  for (const g of [...gone, keep]) if (!items.some((d) => q(d) === g)) fail(`Why: the question "${g}" is missing`);
  const pStyle = (items[0].match(/<p style="([^"]*)">/) || fail("Why: no answer style"))[1];
  for (const d of items) {
    if (gone.includes(q(d))) faq = faq.replace(d, "");
    else if (q(d) === keep) faq = faq.replace(d, d.replace(keep, "What is an agile omni-channel strategy, and how is it different from multi-channel?").replace(/<p style="[^"]*">[\s\S]*<\/p>/, `<p style="${pStyle}">It is one strategy that connects every place your customers shop: marketplaces and other e-commerce channels, brick-and-mortar stores and your brand website. Each channel and marketplace has its own strategy, with sales, margin, advertising and inventory targets that you approve, and each one is planned with the others in view. A traditional multi-channel strategy runs each channel on its own budget and calendar, usually set once a year. We review ours against live sales, inventory and advertising data every week and adjust it as conditions change. Budgets still belong to each channel: nothing moves between channels or marketplaces without your approval.</p>`));
  }
  if ((faq.match(/<details\b/g) || []).length !== 8) fail("Why: expected 8 questions after merging");
}

const whyClients = clients("clients", `<p style="margin: 32px 0 0"><a href="/work" style="font-size: 18px; color: #102A4C">See the case studies</a></p>`, midCta);
const whyMain = [
  W.by["Why brands choose Kwontified."],
  onPage([["#fit", "Who it suits"], ["#how", "How we work"], ["#clients", "Clients"], ["#portal", "The portal"], ["#first-50-days", "First 50 days"], ["#commitments", "Commitments"], ["#questions", "Questions"]]),
  fit, ops, solve, withId(omni, "omni-channel"), withId(data, "your-data"), whyClients, portal,
  withId(A.by["Data and AI behind the work"], "data-ai"), withId(A.by["How an engagement starts"], "first-50-days"), commitments, faq, W.by["See how we would run your business."],
].join("\n");

// ---- styles for the new pieces (both pages) ----
const CSS = `<style data-kq-about>
/* About and Why Kwontified (scripts/site-about.mjs) */
main section[id]{scroll-margin-top:96px}
/* these two pages carry many sections: closer together than the export's default */
main>section:not(.kq-hero):not(.kq-close):not(.kq-ab-mid){padding-top:clamp(56px,6.2vw,96px)!important;padding-bottom:clamp(56px,6.2vw,96px)!important}
.kq-ab-logowrap ul{gap:14px 40px!important;justify-content:center}
.kq-ab-logowrap li{flex:0 1 180px!important}
@media (min-width:1100px){.kq-ab-tiles{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
.kq-onpage{background:#F8F6F1;border-bottom:1px solid #D3D9DF;padding:0 clamp(20px,4.4vw,64px)}
.kq-onpage ul{list-style:none;max-width:1312px;margin:0 auto;padding:0;display:flex;gap:0 28px;overflow-x:auto;scrollbar-width:none;font-size:16px}
.kq-onpage ul::-webkit-scrollbar{display:none}
.kq-onpage a{display:flex;align-items:center;min-height:52px;white-space:nowrap;color:#102A4C;text-decoration:none}
.kq-onpage a:hover{text-decoration:underline;text-underline-offset:4px}
.kq-ab-sub{margin:56px 0 0;font-weight:500;font-size:22px;line-height:1.25;color:#102A4C}
.kq-ab-dates{margin:32px 0 0;display:flex;flex-direction:column;max-width:420px}
.kq-ab-dates>div{display:flex;gap:20px;padding:14px 0;border-top:1px solid #D3D9DF}
.kq-ab-dates dt{flex:0 0 72px;font-size:18px;font-weight:500;color:#102A4C}
.kq-ab-dates dd{margin:0;font-size:18px;line-height:1.4}
.kq-ab-logowrap{margin-top:40px}
.kq-ab-quotes{margin-top:44px;display:flex;flex-wrap:wrap;gap:48px 64px}
.kq-ab-quotes figure{padding-top:26px;border-top:2px solid #DCBF85}
.kq-ab-quotes blockquote{font-size:clamp(20px,1.7vw,24px)!important;color:#F8F6F1}
.kq-ab-quotes figcaption{color:#C9D4DF}.kq-ab-quotes figcaption span{color:#F8F6F1}
.kq-ab-ask{margin-top:clamp(40px,5vw,72px);padding-top:clamp(28px,3vw,40px);border-top:1px solid #244676;display:flex;flex-wrap:wrap;gap:24px 64px;align-items:center;justify-content:space-between}
.kq-ab-ask p{margin:0;font-size:clamp(20px,1.8vw,26px);line-height:1.3;letter-spacing:-.01em;max-width:26em}
.kq-ab-offices{list-style:none;margin:40px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:32px 24px}
.kq-ab-offices figure{margin:0}
.kq-ab-offices h3{margin:16px 0 0;font-weight:500;font-size:20px;line-height:1.25;color:#102A4C}
.kq-ab-offices p{margin:6px 0 0;font-size:17px;line-height:1.5}
.kq-ab-reach{margin:40px 0 0;display:flex;flex-wrap:wrap;gap:8px 36px;font-size:18px}
.kq-ab-reach a{color:#102A4C;padding:8px 0}
.kq-ab-fit{list-style:none;margin:0;padding:0;font-size:clamp(18px,1.53vw,22px);line-height:1.45}
.kq-ab-fit li{padding:16px 0;border-top:1px solid #C5CCD3;max-width:34em}
.kq-ab-fit li:last-child{border-bottom:1px solid #C5CCD3}
.kq-ab-cmp{width:100%;margin:28px 0 0;border-collapse:collapse;font-size:17px;line-height:1.45;background:#FDFCFA}
.kq-ab-cmp th,.kq-ab-cmp td{padding:18px 20px;text-align:left;vertical-align:top;border-bottom:1px solid #D3D9DF}
.kq-ab-cmp thead th{font-weight:500;font-size:16px;color:#262524;background:#F8F6F1}
.kq-ab-cmp thead td{background:#F8F6F1}
.kq-ab-cmp tbody th{font-weight:500;color:#102A4C;width:22%}
.kq-ab-cmp td{width:26%}
.kq-ab-cmp thead th:last-child,.kq-ab-cmp tbody td:last-child{background:#102A4C;color:#F8F6F1;border-bottom-color:#244676}
.kq-ab-commit{list-style:none;margin:48px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:12px}
.kq-ab-commit li{background:#FDFCFA;padding:32px}
.kq-ab-commit h3{margin:0;font-weight:500;font-size:22px;line-height:1.25;color:#102A4C}
.kq-ab-commit p{margin:12px 0 0;font-size:18px;line-height:1.55}
/* the client portal picture, in the portal mockups' own type sizes and colours */
.kq-pt-fig{margin:clamp(32px,4vw,56px) 0 0}
.kq-pt{--border:#E8E8E8;--rule:#F0F1F2;--muted:#5F6368;--acc:#00618D;display:grid;grid-template-columns:212px minmax(0,1fr);background:#EEF2F4;border:1px solid #DCE3E8;border-radius:14px;box-shadow:0 30px 60px -28px rgba(10,28,54,.35),0 2px 6px rgba(10,28,54,.06);font-size:14px;line-height:20px;color:#262524;text-align:left;overflow:hidden}
.kq-pt p{margin:0}.kq-pt *{box-sizing:border-box}
.kq-pt-side{padding:14px 12px 16px;display:flex;flex-direction:column;gap:2px}
.kq-pt-brand{display:flex;align-items:baseline;gap:10px;height:34px;padding:6px 10px 0;margin-bottom:12px!important}
.kq-pt-brand b{font-weight:500;font-size:12px;letter-spacing:.24em;color:#102A4C}.kq-pt-brand span{font-size:13px;color:var(--muted);white-space:nowrap}
.kq-pt-grp{margin:14px 10px 4px!important;font-size:12px;color:var(--muted)}
.kq-pt-nv{display:flex;align-items:center;gap:10px;height:31px;padding:0 10px;border-radius:8px;color:var(--muted);white-space:nowrap}
.kq-pt-nv svg{flex:none;color:#6B7378}
.kq-pt-nv.sub{height:28px;padding-left:36px}
.kq-pt-nv.on{background:#E1E7EA;color:#262524}
.kq-pt-usr{margin-top:auto!important;display:flex;align-items:center;gap:10px;padding:12px 10px 0}
.kq-pt-usr i{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:500;background:#102A4C;color:#F8F6F1}
.kq-pt-main{min-width:0;display:flex;flex-direction:column}
.kq-pt-top{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px 0 0}
.kq-pt-search{flex:0 1 420px;display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;margin-right:auto!important;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;color:#6B6B6B;white-space:nowrap;overflow:hidden}
.kq-pt-tag{padding:3px 10px;border-radius:999px;background:#102A4C;color:#DCBF85;font-size:12px;font-weight:500;white-space:nowrap}
.kq-pt-scope{display:inline-flex;align-items:center;height:32px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
.kq-pt-sheet{flex:1;background:#FFFFFF;border:1px solid #E3E8EB;border-radius:16px;margin:0 8px 8px 0;padding:22px 24px 24px;min-width:0}
.kq-pt-crumb{color:var(--muted);margin-bottom:6px!important}
.kq-pt-trow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:10px 24px}
.kq-pt-h1{font-size:24px;line-height:30px;font-weight:600;letter-spacing:-.01em}
.kq-pt-find{margin-top:6px!important;line-height:22px;max-width:62em}
.kq-pt-stamp{font-size:12px;color:var(--muted);white-space:nowrap;text-decoration:underline dotted #B3B8BC;text-underline-offset:3px}
.kq-pt-ctl{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.kq-pt-ctl span{display:inline-flex;align-items:center;height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
.kq-pt-ctl .kq-pt-exp{margin-left:auto;color:var(--acc);border-color:#C9D9E2}
.kq-pt-card{background:#FFFFFF;border:1px solid var(--border);border-radius:8px;padding:18px 20px;min-width:0}
.kq-pt-card.tint{background:#F6F9FB;border-color:#DFE8ED}
.kq-pt-kstrip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding:0;margin-top:16px}
.kq-pt-kstrip>div{padding:14px 20px;border-left:1px solid var(--border);min-width:0}.kq-pt-kstrip>div:first-child{border-left:0}
.kq-pt .kl{color:var(--muted)}
.kq-pt .kv{margin-top:4px;font-size:24px;line-height:30px;font-weight:500;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.kq-pt .kd{margin-top:4px;font-size:12px;line-height:16px}
.kq-pt .pos{color:#247B50}.kq-pt .mut{color:var(--muted)}
.kq-pt-cols{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:16px;align-items:start;margin-top:16px}
.kq-pt-h2{font-size:16px;line-height:22px;font-weight:600}
.kq-pt-csub{margin-top:2px!important;color:var(--muted)}
.kq-pt-att{list-style:none;margin:8px 0 0;padding:0}
.kq-pt-att li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 14px;align-items:start;padding:12px 0;border-bottom:1px solid var(--rule)}
.kq-pt-att li:last-child{border-bottom:0;padding-bottom:0}
.kq-pt .pill{display:inline-flex;align-items:center;justify-self:start;height:20px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap}
.kq-pt .pill.bad{background:#FFEDEA;color:#831C1E}.kq-pt .pill.warn{background:#FFFBEB;color:#92400E}
.kq-pt .at{font-weight:500}.kq-pt .ad{margin-top:2px;color:var(--muted)}
.kq-pt .av{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.kq-pt .av strong{font-weight:500}.kq-pt .av small{font-size:12px;color:var(--muted)}
.kq-pt .go{color:var(--acc)}
.kq-pt-sm{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 20px;margin-top:14px}
.kq-pt-sm>div{min-width:0}
.kq-pt .sv{margin-top:4px;font-size:20px;line-height:26px;font-weight:500;font-variant-numeric:tabular-nums}
.kq-pt-spark{position:relative;margin-top:8px}
.kq-pt-spark svg{display:block;width:100%;height:52px}
.kq-pt-spark i{position:absolute;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#00618D;box-shadow:0 0 0 2px #F6F9FB}
.kq-pt-fig figcaption{margin-top:14px;font-size:15px;color:#626366}
.kq-pt-points{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 32px;font-size:17px;line-height:1.5}
.kq-pt-points li{padding-top:14px;border-top:2px solid #102A4C}
.kq-pt-points strong{display:block;font-weight:500;color:#102A4C}
@media (max-width:1100px){.kq-pt{grid-template-columns:1fr}.kq-pt-side{display:none}.kq-pt-top{padding:0 12px}.kq-pt-sheet{margin:0 8px 8px}.kq-pt-cols{grid-template-columns:1fr}}
@media (max-width:760px){.kq-pt-search{display:none}.kq-pt-top{justify-content:space-between}.kq-pt-sheet{padding:18px 16px}.kq-pt-kstrip{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-kstrip>div{padding:12px 14px}.kq-pt-kstrip>div:nth-child(odd){border-left:0}.kq-pt-kstrip>div:nth-child(n+3){border-top:1px solid var(--border)}.kq-pt .kv{font-size:20px;line-height:26px}.kq-pt-ctl .kq-pt-exp{display:none}.kq-pt-att li{display:flex;flex-direction:column;gap:6px}.kq-pt .av{flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 14px;text-align:left;white-space:normal}.kq-pt-att li:nth-child(n+4){display:none}.kq-pt-scope{overflow:hidden;text-overflow:ellipsis}}
@media (max-width:600px){
.kq-ab-logowrap ul{gap:4px 16px!important}
.kq-ab-logowrap li{flex:1 1 28%!important;min-height:50px!important}
.kq-ab-logowrap img{width:auto!important;max-width:100%!important;height:auto!important;max-height:24px!important}
.kq-ab-tiles{grid-template-columns:1fr 1fr!important}.kq-ab-tiles li{padding:18px 16px!important}
#values ol{margin-top:32px!important;gap:8px!important}#values ol>li{padding:20px!important}#values ol>li>svg{display:none}
#values ol>li>p:last-child{margin-top:8px!important;font-size:16px!important;line-height:1.5!important}
#values ol>li>p:first-of-type{display:none}#values ol>li>h3{margin-top:0!important}
#leadership div[style*="grid-template-columns"]{grid-template-columns:1fr 1fr!important;gap:24px 16px!important;margin-top:32px!important}
#leadership article img{width:min(150px,100%)!important}
.kq-press-card{padding:18px!important}.kq-press-card>span:last-child{font-size:18px!important}
.kq-ab-offices{gap:24px!important}.kq-ab-offices img{aspect-ratio:16 / 7!important}
.kq-ab-quotes{margin-top:32px;gap:32px}
/* on a phone the still lifes beside each argument add length and no information */
:is(#who,#operators,#how,#omni-channel,#your-data) img{display:none!important}
:is(#who,#how,#omni-channel,#your-data) div:has(>img){display:none!important}
.kq-ab-commit{margin-top:32px}.kq-ab-commit li{padding:22px}
}
@media (max-width:760px){
.kq-ab-cmp thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.kq-ab-cmp,.kq-ab-cmp tbody,.kq-ab-cmp tr,.kq-ab-cmp th,.kq-ab-cmp td{display:block;width:auto}
.kq-ab-cmp{background:none}
.kq-ab-cmp tr{margin-top:14px;background:#FDFCFA}
.kq-ab-cmp tbody th{width:auto;padding-bottom:6px;border-bottom:0;font-size:19px}
.kq-ab-cmp td{width:auto}
.kq-ab-cmp td{padding-top:8px;padding-bottom:8px;font-size:16px}.kq-ab-cmp tbody td:last-child{padding-bottom:14px}
.kq-ab-cmp td::before{content:attr(data-th);display:block;margin-bottom:2px;font-size:14px;font-weight:500;color:#626366}
.kq-ab-cmp tbody td:last-child::before{color:#DCBF85}
}
</style>`;

// the questions in the page's structured data follow the questions on the page
function faqData(html, file) {
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const qa = [...main.matchAll(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)].map((m) => ({ "@type": "Question", name: text(m[1]), acceptedAnswer: { "@type": "Answer", text: text(m[2]) } }));
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

function finish(P, main, file) {
  let html = P.head + "\n" + main + "\n" + P.tail;
  html = once(html, "</head>", CSS + "</head>", `${file}: </head>`);
  html = faqData(html, file);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) fail(`${file}: an id is used twice: ${[...new Set(dup)].join(", ")}`);
  for (const m of html.matchAll(/<nav class="kq-onpage"[\s\S]*?<\/nav>/g)) for (const a of m[0].matchAll(/href="#([^"]+)"/g)) if (!ids.includes(a[1])) fail(`${file}: the page menu points at #${a[1]}, which is not on the page`);
  fs.writeFileSync(path.join(DIR, file), html);
  return (text(main).split(" ").length);
}
const aboutWords = finish(A, aboutMain, "about.html");
const whyWords = finish(W, whyMain, "why-kwontified.html");

// =====================================================================================
// Careers: the values in short. Capability, channel and case study pages: a way to Why Kwontified.
// =====================================================================================
{
  const f = "about--careers.html";
  let h = read(f);
  const names = [...W.by["Our values"].matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
  if (names.length !== 8) fail("expected eight values, found " + names.length);
  const at = h.indexOf("Questions candidates ask"), sec = h.lastIndexOf("<section", at);
  if (at < 0 || sec < 0) fail("Careers: no questions section to put the values before");
  h = h.slice(0, sec) + section("values", "values", "#F8F6F1", two(
    `<h2 id="values-title" style="${H2}">The values we hire and work by</h2>`,
    `<ol style="margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 0 40px; font-size: 20px; line-height: 1.4">${names.map((n) => `<li style="padding: 14px 0; border-top: 1px solid #D3D9DF">${n.replace(/&/g, "&amp;")}</li>`).join("")}</ol><p style="margin: 28px 0 0"><a href="/about#values" style="font-size: 18px; color: #102A4C">What each one means in practice</a></p>`,
  )) + "\n" + h.slice(sec);
  fs.writeFileSync(path.join(DIR, f), h);
}
let linked = 0;
for (const f of fs.readdirSync(DIR)) {
  if (!/^(capabilities--|channels--|work--)[a-z0-9-]+\.html$/.test(f) || f === "work--creative.html") continue;
  let h = read(f);
  const at = h.indexOf('<section id="review"');
  if (at < 0) continue;
  const end = h.indexOf("</section>", at), band = h.slice(at, end);
  const m = band.match(/<a class="kq-btn kq-btn-light" href="\/contact"[^>]*>[^<]*<\/a>/);
  if (!m || band.includes("/why-kwontified")) continue;
  h = h.slice(0, at) + band.replace(m[0], () => m[0] + '<a class="kq-why" href="/why-kwontified" style="display: block; margin-top: 18px; padding: 6px 0; font-size: 17px; color: #F8F6F1; text-underline-offset: 4px">Why brands choose Kwontified</a>') + h.slice(end);
  fs.writeFileSync(path.join(DIR, f), h);
  linked++;
}
if (linked < 40) fail(`expected the Why Kwontified link on at least 40 capability, channel and case study pages, added ${linked}`);

console.log(`site-about: About rebuilt (13 sections, ${aboutWords} words: story, leadership, values, clients, results, credentials, press, offices); Why Kwontified rebuilt (15 sections, ${whyWords} words: fit and comparison, differences with linked results, clients, portal example, first 50 days, commitments, 8 questions); values on Careers; Why Kwontified linked from ${linked} pages`);
