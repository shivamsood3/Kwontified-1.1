// The client portal example shown on Why Kwontified (and wherever else the site shows the portal).
//
// It is a picture of the product, not live data: static HTML and CSS drawn in the visual language
// of the Kwontified Client Portal mockups (Jordan's design artifact,
// https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9), with a sample brand's figures. It shows two
// screens, one for each kind of reader the portal serves:
//   1. Overview: what an executive opens (the month against goal for each channel, the decisions
//      waiting for the client, and what needs attention with its owner and status);
//   2. Amazon operations: what the people who run the channel open (the product, campaign,
//      search term or shipment behind a number, each with its next step and owner). This screen
//      is a proposal that grew out of the review of the data warehouse; the mockups split the
//      same information over their Sales, Inventory, Account health and Sponsored ads screens.
// A real radio group above the picture switches between them. It needs no script: the two screens
// share one grid cell and the unchosen one is hidden with visibility, so the page never moves.
// Each screen is one labelled image for assistive technology; the menu and top bar are decoration.
//
// The example carries an "Illustrative example" tag and a caption, and is marked data-nosnippet so
// the sample figures are not quoted in search results as Kwontified's own.
//
// Every figure is derived below from one small set of invented base numbers (most of them the
// mockups' own sample figures), and check() stops the build if a total, a ratio or a sentence no
// longer follows from its parts. Change a base number and everything that depends on it follows.
// Both screens must stay under about 950px tall at 1440px wide and 1,700px on a phone: the picture
// is as tall as the taller screen, so measure both after any change (text that wraps adds a line).
//
// scripts/site-about.mjs calls portalSection() with its own section helpers and adds PORTAL_CSS to
// the page. Everything about the picture lives in this file.

const fail = (m) => { console.error("portal-example: " + m); process.exit(1); };
const check = (ok, m) => { if (!ok) fail("the sample figures no longer agree: " + m); };
const usd = (n) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
const num = (n) => Math.round(n).toLocaleString("en-US");
const sum = (a, f) => a.reduce((t, x) => t + f(x), 0);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// ---- the sample brand: October 1 to 23, 2026 --------------------------------------------------
const CH = [
  // channel, data through, sales to date, ad spend, ad-attributed sales, October goal, October forecast
  { n: "Amazon", thru: "Oct 23", sales: 908400, spend: 88350, adSales: 410828, goal: 1240000, fc: 1229100 },
  { n: "Walmart", thru: "Oct 22", sales: 228100, spend: 18900, adSales: 66717, goal: 310000, fc: 318000 },
  { n: "Target Plus", thru: "Oct 22", sales: 101600, spend: 7690, adSales: 24608, goal: 140000, fc: 142500 },
];
const ALL = { n: "All channels", sales: sum(CH, (c) => c.sales), spend: sum(CH, (c) => c.spend), adSales: sum(CH, (c) => c.adSales), goal: sum(CH, (c) => c.goal), fc: sum(CH, (c) => c.fc) };
const roas = ALL.adSales / ALL.spend, tacos = (100 * ALL.spend) / ALL.sales;
const AMZ = CH[0], amzGap = AMZ.goal - AMZ.fc;
check(ALL.sales === 1238100 && ALL.spend === 114940 && roas.toFixed(2) === "4.37" && tacos.toFixed(1) === "9.3", "channel totals");
check(amzGap === 10900 && ALL.goal - ALL.fc === 400, "goal gaps");

// the recommendation that closes the Amazon gap
const REC = { add: 2500, roas: 4.06, days: 8 };
const recSales = Math.floor((REC.add * REC.roas) / 100) * 100;
check(recSales === 10100 && Math.round((100 * REC.add * REC.roas) / amzGap) === 93, "the recommendation against the gap");

// Amazon products, Oct 1 to 23: sales, units, sessions, change on Sep 1 to 23, units on hand, inbound, average weekly units
const PRODUCTS = [
  { n: "Retinol serum", ad: 53611, sku: "SKN-RS-30", sales: 129500, units: 3083, sess: 39025, chg: 9.8, on: 2700, inb: 6000, wk: 938, tag: ["bad", "Low cover"], step: "Reorder 6,300 units by Oct 30", who: "Marketplace Operations · awaiting your decision" },
  { n: "Gift set", ad: 31445, sku: "SKN-GS-3P", sales: 67700, units: 1058, sess: 25190, chg: 38.5, on: 980, inb: 6000, wk: 322, tag: ["bad", "Suppressed"], step: "Corrected image uploaded Oct 20", who: "Creative Studio · with Amazon for review" },
  { n: "Mineral sunscreen", ad: 41094, sku: "SKN-MS-50", sales: 107100, units: 3825, sess: 56250, chg: -3.4, on: 8900, inb: 0, wk: 1164, tag: ["bad", "Suppressed"], step: "Safety data sheet filed Oct 17", who: "Marketplace Operations · two sizes, with Amazon" },
  { n: "Eye cream", ad: 19847, sku: "SKN-EC-15", sales: 54600, units: 1517, sess: 24869, chg: 1.7, on: 4100, inb: 0, wk: 462, tag: ["warn", "Listing issue"], step: "Bullet point rewrite due Oct 27", who: "Marketplace Operations · restricted claim, in progress" },
  { n: "Vitamin C serum", ad: 90083, sku: "SKN-VC-30", sales: 262400, units: 6905, sess: 75880, chg: 14.2, on: 13100, inb: 9000, wk: 2102 },
  { n: "Night cream", ad: 56579, sku: "SKN-NC-50", sales: 169800, units: 3691, sess: 48566, chg: 6.1, on: 7400, inb: 4500, wk: 1123 },
  { n: "Foaming cleanser", ad: 22719, sku: "SKN-FC-15", sales: 75000, units: 4167, sess: 49607, chg: 2.2, on: 10600, inb: 0, wk: 1268 },
];
const OTHER_SALES = 42300, OTHER_AD_SALES = 13240, DSP_SALES = 82210, PRODUCT_COUNT = 31;
const shownSales = sum(PRODUCTS, (p) => p.sales);
check(shownSales + OTHER_SALES === AMZ.sales, "product sales against the Amazon total");
check(sum(PRODUCTS, (p) => p.ad) + OTHER_AD_SALES + DSP_SALES === AMZ.adSales, "product ad sales against the Amazon total");
const shownShare = Math.round((100 * shownSales) / AMZ.sales);
const cover = (p) => p.on / p.wk;
const retinol = PRODUCTS[0];
check(cover(retinol).toFixed(1) === "2.9" && ((retinol.on + retinol.inb + 6300) / retinol.wk).toFixed(0) === "16", "retinol serum cover and reorder");
const retinolWeekly = Math.round((retinol.wk * retinol.sales) / retinol.units / 100) * 100;
check(retinolWeekly === 39400, "retinol serum weekly sales");
const lowCover = PRODUCTS.filter((p) => cover(p) < 4).length, withStep = PRODUCTS.filter((p) => p.tag).length;

// campaigns that ran out of budget: daily budget, hours without ads this month, return
const CAPPED = [
  { n: "Brands video: vitamin C", day: 280, hrs: 41, roas: 4.06 },
  { n: "Products keyword: retinol", day: 380, hrs: 30, roas: 5.21 },
  { n: "Products auto: all products", day: 190, hrs: 18, roas: 4.85 },
].map((c) => ({ ...c, missed: Math.round(((c.day / 24) * c.hrs * c.roas) / 10) * 10 }));
const cappedHrs = sum(CAPPED, (c) => c.hrs), cappedMissed = sum(CAPPED, (c) => c.missed);
check(cappedHrs === 89 && cappedMissed === 5100 && CAPPED[0].roas === REC.roas, "campaigns out of budget");

const SHIPMENTS = [["Vitamin C serum", 9000, "receiving", "Oct 26"], ["Retinol serum", 6000, "in transit", "Oct 29"], ["Gift set", 6000, "in transit", "Oct 31"], ["Night cream", 4500, "ready to ship", "Nov 6"]];
const inboundUnits = sum(SHIPMENTS, (s) => s[1]);
check(inboundUnits === sum(PRODUCTS, (p) => p.inb) && inboundUnits === 25500, "inbound units");

// eight complete weeks, Aug 25 to Oct 19, all channels: sales and ad spend in thousands, return on ad spend
const WK = { sales: [352, 358, 355, 361, 366, 371, 384, 379], spend: [33.1, 33.6, 33.2, 33.9, 34.2, 34.6, 35.9, 35.1], roas: [4.21, 4.26, 4.3, 4.28, 4.33, 4.31, 4.41, 4.37] };
WK.tacos = WK.sales.map((s, i) => (100 * WK.spend[i]) / s);

// a small line for eight weekly values: the mockups' blue, a dot on the latest week
function spark(v, W = 92, H = 30) {
  const pad = 4, lo = Math.min(...v), hi = Math.max(...v), span = hi - lo || 1;
  const pts = v.map((y, i) => [pad + (i * (W - 2 * pad)) / (v.length - 1), H - pad - ((y - lo) / span) * (H - 2 * pad)]);
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" "), last = pts[pts.length - 1];
  return `<span class="kq-pt-spark"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><path d="${d}" fill="none" stroke="#00618D" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.5" fill="#00618D" stroke="#FFFFFF" stroke-width="2"/></svg></span>`;
}

const ICON = { 0: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></svg>', 1: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 12.5l3.5-4 3 2.5 4.5-6"/></svg>' };
const SEARCH = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>';

export function portalSection({ section, two, H2, P }) {
  const NAV = [["Overview", 0, "n1"], ["Channels", "g"], ["Amazon", 0], ["Sales", 1], ["Advertising", 1], ["Marketing Cloud", 1], ["Operations", 1, "n2"], ["Walmart", 0], ["Target Plus", 0], ["Your account", "g"], ["Reports and forecasts", 0], ["Call notes and projects", 0], ["Team and access", 0]];
  const side = `<div class="kq-pt-side" aria-hidden="true"><p class="kq-pt-brand"><b>KWONTIFIED</b><span>Client portal</span></p>${NAV.map(([label, kind, cls]) => (kind === "g" ? `<p class="kq-pt-grp">${label}</p>` : `<p class="kq-pt-nv${kind ? " sub" : ""}${cls ? " " + cls : ""}">${ICON[kind]}<span>${label}</span></p>`)).join("")}<p class="kq-pt-usr"><i>MC</i><span>Maya Chen</span></p></div>`;
  const top = `<div class="kq-pt-top" aria-hidden="true"><p class="kq-pt-search">${SEARCH}Search dashboards, products and reports</p><p class="kq-pt-tag">Illustrative example</p><p class="kq-pt-scope">Sample skincare brand</p></div>`;

  // ---- screen 1: Overview, for an executive ---------------------------------------------------
  const KPIS = [
    ["Total sales", usd(ALL.sales), ["+8.3%", "pos"], ["+21.6%", "pos"], WK.sales],
    ["Ad spend", usd(ALL.spend), ["+8.4%", "mut"], ["+17.9%", "mut"], WK.spend],
    ["ROAS", roas.toFixed(2) + "x", ["+1.7%", "pos"], ["+3.1%", "pos"], WK.roas],
    ["TACoS", tacos.toFixed(1) + "%", ["+0.0 pts", "mut"], ["−0.3 pts", "pos"], WK.tacos],
  ];
  const kstrip = `<div class="kq-pt-card kq-pt-kstrip">${KPIS.map(([l, v, a, b, s]) => `<div><p class="kl">${l}</p><div class="kr"><p class="kv">${v}</p>${spark(s)}</div><p class="kd"><span class="${a[1]}">${a[0]}</span> <span class="mut">vs Sep 1 to 23</span></p><p class="kd"><span class="${b[1]}">${b[0]}</span> <span class="mut">vs <span class="w">Oct 1 to 23, </span>2025</span></p></div>`).join("")}</div>
<p class="kq-pt-defs"><b>Total sales</b> ordered product sales before refunds. <b>ROAS</b> ad-attributed sales ÷ ad spend. <b>TACoS</b> ad spend ÷ total sales. Ad sales for the last 14 days are provisional.<span class="w"> Lines show the last eight complete weeks.</span></p>`;

  const SCALE = 1.1; // the bars run to 110% of goal, so a forecast above goal still fits
  const goalRow = (c, total) => {
    const gap = c.fc - c.goal, near = Math.abs(gap) / c.goal < 0.0025;
    const pill = near ? `<span class="pill flat">On goal</span>` : gap < 0 ? `<span class="pill warn">${usd(-gap)} short</span>` : `<span class="pill good">${usd(gap)} ahead</span>`;
    const w = (v) => ((100 * v) / c.goal / SCALE).toFixed(1);
    return `<div class="gr${total ? " tot" : ""}"><p class="gn">${c.n}${c.thru ? ` <small>to ${c.thru}</small>` : ""}</p><div class="gb"><i class="f" style="width:${w(c.fc)}%"></i><i class="a" style="width:${w(c.sales)}%"></i><i class="g" style="left:${(100 / SCALE).toFixed(1)}%"></i></div><p class="gv"><strong>${usd(c.fc)}</strong> <small>${((100 * c.fc) / c.goal).toFixed(1)}% of ${usd(c.goal)}</small></p><p class="gs">${pill}</p></div>`;
  };
  const goal = `<div class="kq-pt-card"><div class="kq-pt-chead"><p class="kq-pt-h2">October forecast against goal</p><p class="kq-pt-leg"><span><i class="a"></i>Sales to date</span><span><i class="f"></i><span>Forecast<span class="w"> to month end</span></span></span><span><i class="g"></i>Goal</span></p></div><div class="kq-pt-goal">${CH.map((c) => goalRow(c)).join("")}${goalRow(ALL, true)}</div><p class="kq-pt-note">Amazon likely range: $1,223,000 to $1,236,000.</p></div>`;

  const ALERTS = [
    ["High", `${retinol.n}: ${cover(retinol).toFixed(1)} weeks of cover`, "Runs out around Nov 12 unless the inbound shipment lands first.", usd(retinolWeekly), "weekly sales", "Marketplace Operations", `${num(retinol.inb)} units in transit, due Oct 29`, "Inventory"],
    ["High", "Amazon is behind the October goal", `Forecast ${usd(AMZ.fc)} against ${usd(AMZ.goal)}, with 8 days left.`, usd(amzGap), "short of goal", "Advertising", "Recommendation awaiting your decision", "Sales overview"],
    ["High", "3 suppressed listings", "Mineral sunscreen (two sizes) and the gift set cannot be bought.", "3", "listings", "Marketplace Operations", "Fixes with Amazon for review", "Account health"],
    ["Medium", `${CAPPED.length} campaigns ran out of budget`, `${cappedHrs} hours without ads this month, on campaigns returning ${Math.min(...CAPPED.map((c) => c.roas)).toFixed(2)}x to ${Math.max(...CAPPED.map((c) => c.roas)).toFixed(2)}x.`, usd(cappedMissed), "est. ad sales missed", "Advertising", "Budget shift proposed Oct 22", "Sponsored ads"],
  ];
  const attention = `<div class="kq-pt-card"><p class="kq-pt-h2">Needs attention <small class="w">Ranked by severity, then by sales at stake, each with its owner and status</small></p><ul class="kq-pt-att wide">${ALERTS.map(([sev, t, d, n, u, who, st, go]) => `<li><span class="pill ${sev === "High" ? "bad" : "warn"}">${sev}</span><div><p class="at">${t}</p><p class="ad">${d}</p></div><div class="aw"><p class="at">${who}</p><p class="ad">${st}</p></div><div class="av"><span><strong>${n}</strong> <small>${u}</small></span><span class="go">${go} →</span></div></li>`).join("")}</ul></div>`;

  const DECISIONS = [
    [`Add ${usd(REC.add)} to Sponsored Brands video for the last eight days`, `About ${usd(recSales)} more at ${REC.roas.toFixed(2)}x: 93% of the ${usd(amzGap)} gap.`, "Advertising", "Decide by Oct 25"],
    ["Order 6,300 units of retinol serum by Oct 30", "With the shipment in transit, back to 16 weeks of cover.", "Marketplace Operations", "Decide by Oct 30"],
  ];
  const decisions = `<div class="kq-pt-card rec"><p class="kq-pt-h2">Decisions for you <small class="w">${DECISIONS.length} recommendations from your team</small></p><ul class="kq-pt-dec">${DECISIONS.map(([t, d, who, by]) => `<li><p class="at">${t}</p><p class="ad">${d}</p><p class="dm"><span><b>${who}</b> ${by}</span><span class="go">Discuss with your team →</span></p></li>`).join("")}</ul><p class="kq-pt-note">Your team makes the change once you have agreed.</p></div>`;


  const execLabel = `Illustration of the client portal’s Overview screen for a sample skincare brand: the screen an executive opens. It starts with a one-sentence summary of the month, the date each channel’s data runs to and the dates of the latest weekly update and call notes. Four headline figures follow (total sales, ad spend, return on ad spend and total advertising cost of sale), each compared with last month and with last year, with a definition of each and a note that recent ad sales are provisional. A chart sets October sales to date and the forecast against the goal for Amazon, Walmart, Target Plus and all channels together. Beside it, two recommendations from the account team wait for the client’s decision. A list shows what needs attention, ranked by severity and sales at stake, each item with its owner, its status and the dashboard behind it.`;
  const exec = `<div class="kq-pt-sheet kq-pt-v1" role="img" aria-label="${esc(execLabel)}"><div class="kq-pt-trow"><div><p class="kq-pt-h1">Overview</p><p class="kq-pt-find">Sales across your three channels reached ${usd(ALL.sales)} in October so far and are forecast to finish within ${usd(ALL.goal - ALL.fc)} of the ${usd(ALL.goal)} goal. Amazon is forecast ${usd(amzGap)} short; a recommendation from your team would close most of it.</p></div><p class="kq-pt-stamp"><span>Data as of Oct 24, 6:00 a.m. ET</span><span>Amazon to ${AMZ.thru} · Walmart, Target Plus to ${CH[1].thru}</span><span>Weekly update posted Oct 23 · call notes Oct 21</span></p></div>
<div class="kq-pt-ctl"><span>Oct 1 to 23, 2026</span><span>vs same days last month</span><span class="w">vs same days last year</span><span class="kq-pt-exp">Export page</span></div>
${kstrip}
<div class="kq-pt-cols">${goal}${decisions}</div>
${attention}</div>`;

  // ---- screen 2: Amazon, Operations, for the people who run the channel -------------------------
  const MAXWK = 12, band = [6, 10];
  const prow = (p) => {
    const c = cover(p), low = c < 4;
    const d = (cls, a, b) => `<p class="${cls}"><span>${a}</span><small>${b}</small></p>`;
    return `<div class="pr">${d("pn", `<span class="at">${p.n}</span>`, p.sku)}${d("ps num", usd(p.sales), `<span class="${p.chg > 0 ? "pos" : "neg"}">${p.chg > 0 ? "+" : "−"}${Math.abs(p.chg).toFixed(1)}%</span>`)}${d("px num", num(p.sess), `${((100 * p.units) / p.sess).toFixed(1)}%`)}${d("pa num", usd(p.ad), `${((100 * p.ad) / p.sales).toFixed(1)}%`)}<div class="pv"><p><strong>${c.toFixed(1)}</strong>${low ? ` <span class="pill bad">Low</span>` : ""}</p><span class="cb"><b style="left:${(100 * band[0]) / MAXWK}%;width:${(100 * (band[1] - band[0])) / MAXWK}%"></b><i${low ? ` class="low"` : ""} style="width:${Math.min(100, (100 * c) / MAXWK).toFixed(1)}%"></i></span></div>${d("pk num", num(p.on), p.inb ? `${num(p.inb)} inbound` : "none inbound")}<div class="pt">${p.tag ? `<p><span class="pill ${p.tag[0]}">${p.tag[1]}</span> <span class="at">${p.step}</span></p><p class="ao">${p.who}</p>` : `<p class="mut">No open step</p>`}</div></div>`;
  };
  const table = `<div class="kq-pt-card kq-pt-prod"><div class="pr ph"><p class="pn">Product</p><p class="ps num">Sales<small>vs Sep 1 to 23</small></p><p class="px num">Sessions<small>unit session %</small></p><p class="pa num">Ad sales<small>share of sales</small></p><p class="pv">Weeks of cover<small>target ${band[0]} to ${band[1]}</small></p><p class="pk num">On hand<small>inbound</small></p><p class="pt">Next step<small>owner and status</small></p></div>${PRODUCTS.map(prow).join("")}<p class="kq-pt-note"><span class="w">${PRODUCTS.length} of ${PRODUCT_COUNT} products, ${shownShare}% of Amazon sales. </span><span class="n">The ${withStep === 4 ? "four" : withStep} with an open step, of ${PRODUCT_COUNT} products. </span><b>Unit session %</b> units ordered ÷ sessions. <b>Weeks of cover</b> units on hand ÷ average weekly units over four weeks; under 4 is low.</p></div>`;

  const rows = (items) => `<ul class="kq-pt-att two">${items.map(([t, d, n, u]) => `<li><div><p class="at">${t}</p><p class="ad">${d}</p></div><div class="av"><span><strong>${n}</strong></span><small>${u}</small></div></li>`).join("")}</ul>`;
  const capped = `<div class="kq-pt-card"><p class="kq-pt-h2">Campaigns that ran out of budget</p><p class="kq-pt-csub">Est. missed = hourly budget × hours × ROAS</p>${rows(CAPPED.map((c) => [c.n, `${c.hrs} hours · ${c.roas.toFixed(2)}x ROAS`, usd(c.missed), "est. missed"]))}</div>`;
  const terms = `<div class="kq-pt-card"><p class="kq-pt-h2">Search terms we acted on</p><p class="kq-pt-csub">Ads to Oct 23 · search share to Oct 17</p>${rows([["vitamin c serum for face", "$1,840 spend · 6.75x ROAS", "Exact match", "done Oct 22"], ["sunscreen spf 50 face", "$640 spend · 0.64x ROAS", "Negative", "done Oct 22"], ["mineral sunscreen for face", "Clicks 2.6%, purchases 2.1%", "Listing review", "proposed"]])}</div>`;
  const ships = `<div class="kq-pt-card"><p class="kq-pt-h2">Inbound shipments</p><p class="kq-pt-csub">${num(inboundUnits)} units, with status and expected date</p><ul class="kq-pt-att two one">${SHIPMENTS.map(([n, u, st, eta]) => `<li><p><span class="at">${n}</span> <small>${num(u)}</small></p><p class="num"><small>${st}</small> <strong>${eta}</strong></p></li>`).join("")}</ul></div>`;

  const opsLabel = `Illustration of the portal’s Amazon Operations screen for the same sample brand: the screen the people who run the channel open. A table lists products sorted by what needs a next step, with sales and the change on last month, sessions and unit session percentage, Sponsored ads sales and their share of sales, weeks of cover against a six to ten week target (cover under four weeks is marked in red and labelled low), units on hand and inbound, and the next step with its owner and status. Below it are three lists: campaigns that ran out of budget, with the hours lost, the estimated sales missed and how the estimate is made; search terms with the action taken on each, and the date each source runs to; and inbound shipments with units, status and expected date.`;
  const ops = `<div class="kq-pt-sheet kq-pt-v2" role="img" aria-label="${esc(opsLabel)}"><div class="kq-pt-trow"><div><p class="kq-pt-h1">Amazon operations</p><p class="kq-pt-find">${PRODUCTS.length === 7 ? "Seven" : PRODUCTS.length} products make up ${shownShare}% of Amazon sales this month. ${withStep === 4 ? "Four" : withStep} have an open step: ${lowCover === 2 ? "two" : lowCover} are under four weeks of cover and three listings are suppressed.</p></div><p class="kq-pt-stamp"><span>Data as of Oct 24, 6:00 a.m. ET</span><span>Sales to ${AMZ.thru} · inventory as of this morning</span></p></div>
<div class="kq-pt-ctl"><span class="tb on">Products</span><span class="tb w">Inventory</span><span class="tb w">Orders</span><span class="tb w">Account health</span><span class="kq-pt-find2">${SEARCH}Find a product or SKU</span><span>With an open step <b>${withStep}</b></span><span class="w">Columns</span><span class="kq-pt-exp">Export CSV or Excel</span></div>
${table}
<div class="kq-pt-three">${capped}${terms}${ships}</div></div>`;

  const sw = `<div class="kq-pt-sw" role="radiogroup" aria-labelledby="kq-pt-swl"><span id="kq-pt-swl">Show the example for</span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v1" checked><label for="kq-pt-v1">An executive</label></span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v2"><label for="kq-pt-v2">The team running the channel</label></span></div>`;

  return section("portal", "portal", "#F8F6F1", two(
    `<h2 id="portal-title" style="${H2}">The client portal</h2>`,
    `<p style="${P}">Every dashboard, report, forecast, call note and open task for your account is in one place, and you see the same numbers we do. An executive opens on the month against goal and the decisions waiting for an answer. The people who run the channel open on the product, campaign or shipment behind each number. Tables export to CSV or Excel.</p><p style="margin: 16px 0 0"><a href="/client-sign-in" style="color: #102A4C">Client sign-in</a></p>`,
  ) + `<figure class="kq-pt-fig">${sw}<div class="kq-pt" data-nosnippet>
${side}
<div class="kq-pt-main">${top}<div class="kq-pt-views">${exec}
${ops}</div></div></div><figcaption>An illustrative example of two portal screens, with a sample brand’s figures. It does not show a client’s data.</figcaption></figure>
<ul class="kq-pt-points"><li><strong>The month against goal</strong>Sales to date, the forecast and the goal for each channel, then the decisions waiting for you.</li><li><strong>The item behind each number</strong>The product, campaign, search term or shipment, with its next step and who has it.</li><li><strong>Dated to the source</strong>Every page says how fresh each channel’s data is.</li></ul>`);
}

export const PORTAL_CSS = String.raw`/* the client portal picture, in the portal mockups' own type sizes and colours */
.kq-pt-fig{margin:clamp(32px,4vw,56px) 0 0}
.kq-pt-sw{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 16px;font-size:16px;color:#262524}
.kq-pt-sw>span:first-child{margin-right:6px}
.kq-pt-sw .o{position:relative;display:inline-flex}
.kq-pt-sw input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.kq-pt-sw label{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1px solid #9FB0C3;border-radius:999px;background:#FDFCFA;color:#262524;cursor:pointer}
.kq-pt-sw input:hover+label{border-color:#102A4C;color:#102A4C}
.kq-pt-sw input:checked+label{background:#102A4C;border-color:#102A4C;color:#F8F6F1;font-weight:500}
.kq-pt-sw input:focus-visible+label{outline:3px solid #00618D;outline-offset:2px}
.kq-pt{--border:#E8E8E8;--rule:#F0F1F2;--muted:#5F6368;--acc:#00618D;display:grid;grid-template-columns:212px minmax(0,1fr);background:#EEF2F4;border:1px solid #DCE3E8;border-radius:14px;box-shadow:0 30px 60px -28px rgba(10,28,54,.35),0 2px 6px rgba(10,28,54,.06);font-size:14px;line-height:20px;color:#262524;text-align:left;overflow:hidden}
.kq-pt p{margin:0}.kq-pt *{box-sizing:border-box}
.kq-pt b,.kq-pt strong{font-weight:500}
.kq-pt small{font-size:12px;color:var(--muted)}
.kq-pt-side{padding:14px 12px 16px;display:flex;flex-direction:column;gap:2px}
.kq-pt-brand{display:flex;align-items:baseline;gap:10px;height:34px;padding:6px 10px 0;margin-bottom:12px!important}
.kq-pt-brand b{font-weight:500;font-size:12px;letter-spacing:.24em;color:#102A4C}.kq-pt-brand span{font-size:13px;color:var(--muted);white-space:nowrap}
.kq-pt-grp{margin:14px 10px 4px!important;font-size:12px;color:var(--muted)}
.kq-pt-nv{display:flex;align-items:center;gap:10px;height:31px;padding:0 10px;border-radius:8px;color:var(--muted);white-space:nowrap}
.kq-pt-nv svg{flex:none;color:#6B7378}
.kq-pt-nv.sub{height:28px;padding-left:36px}
.kq-pt-nv.n1{background:#E1E7EA;color:#262524}
.kq-pt-usr{margin-top:auto!important;display:flex;align-items:center;gap:10px;padding:12px 10px 0}
.kq-pt-usr i{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:500;background:#102A4C;color:#F8F6F1}
.kq-pt-main{min-width:0;display:flex;flex-direction:column}
.kq-pt-top{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px 0 0}
.kq-pt-search{flex:0 1 420px;display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;margin-right:auto!important;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;color:#6B6B6B;white-space:nowrap;overflow:hidden}
.kq-pt-tag{padding:3px 10px;border-radius:999px;background:#102A4C;color:#DCBF85;font-size:12px;font-weight:500;white-space:nowrap}
.kq-pt-scope{display:inline-flex;align-items:center;height:32px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
/* the two screens share one cell: the page keeps one height whichever is showing */
.kq-pt-views{flex:1;display:grid;min-width:0}
.kq-pt-sheet{grid-area:1/1;background:#FFFFFF;border:1px solid #E3E8EB;border-radius:16px;margin:0 8px 8px 0;padding:18px 24px 20px;min-width:0}
.kq-pt-v2{visibility:hidden}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v1{visibility:hidden}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v2{visibility:visible}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n1{background:none;color:var(--muted)}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n2{background:#E1E7EA;color:#262524}
@supports not selector(:has(a)){.kq-pt-sw{display:none}}
.kq-pt-trow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:8px 24px}
.kq-pt-trow>div{flex:1 1 30em;min-width:0}
.kq-pt-h1{font-size:24px;line-height:30px;font-weight:600;letter-spacing:-.01em}
.kq-pt-find{margin-top:6px!important;line-height:22px;max-width:56em}
.kq-pt-stamp{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px;line-height:16px;color:var(--muted);text-align:right}
.kq-pt-stamp span:first-child{text-decoration:underline dotted #B3B8BC;text-underline-offset:3px}
.kq-pt-ctl{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.kq-pt-ctl span{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
.kq-pt-ctl .kq-pt-exp{margin-left:auto;color:var(--acc);border-color:#C9D9E2}
.kq-pt-ctl .tb{padding:0 3px;margin-right:8px;border:0;border-radius:0;background:none;color:var(--muted)}
.kq-pt-ctl .tb.on{color:#262524;font-weight:500;box-shadow:inset 0 -2px 0 var(--acc)}
.kq-pt .n{display:none}
.kq-pt-ctl .kq-pt-find2{color:#6B6B6B;min-width:190px;margin-left:8px}
.kq-pt-ctl b{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#FFEDEA;color:#831C1E;font-size:12px}
.kq-pt-card{background:#FFFFFF;border:1px solid var(--border);border-radius:8px;padding:16px 20px;min-width:0}
.kq-pt-card.rec{background:#EAF3F8;border-color:#C3D8E4}
.kq-pt-kstrip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding:0;margin-top:14px}
.kq-pt-kstrip>div{padding:12px 20px;border-left:1px solid var(--border);min-width:0}.kq-pt-kstrip>div:first-child{border-left:0}
.kq-pt .kl{color:var(--muted)}
.kq-pt .kr{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px}
.kq-pt .kv{font-size:24px;line-height:30px;font-weight:500;letter-spacing:-.01em}
.kq-pt .kd{margin-top:2px;font-size:12px;line-height:16px}
.kq-pt-spark{flex:none;display:block;line-height:0}
.kq-pt .pos{color:#247B50}.kq-pt .neg{color:#B42126}.kq-pt .mut{color:var(--muted)}
.kq-pt .num{text-align:right;font-variant-numeric:tabular-nums}
.kq-pt-defs,.kq-pt-note{margin-top:8px!important;max-width:none;font-size:12px;line-height:17px;color:var(--muted)}
.kq-pt-defs b,.kq-pt-note b{color:#262524}
.kq-pt-cols{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px;align-items:stretch;margin:12px 0 14px}
.kq-pt-h2{font-size:16px;line-height:22px;font-weight:600}.kq-pt-h2 small{margin-left:6px;font-weight:400}
.kq-pt-csub{margin-top:2px!important;color:var(--muted)}
.kq-pt-chead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:6px 16px}
.kq-pt-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt-leg>span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.kq-pt-leg i{width:14px;height:8px;border-radius:2px}
.kq-pt-leg .a,.kq-pt-goal .a{background:#00618D}
.kq-pt-leg .f,.kq-pt-goal .f{background:#A9CFE0}
.kq-pt-leg .g{width:2px;height:12px;border-radius:0;background:#262524}
.kq-pt-goal{margin-top:6px}
.kq-pt-goal .gr{display:grid;grid-template-columns:96px minmax(0,1fr) 124px 104px;gap:4px 16px;align-items:center;padding:5px 0;border-bottom:1px solid var(--rule)}
.kq-pt-goal .gv small{display:block;line-height:14px}
.kq-pt-goal .gr.tot{border-bottom:0;padding-bottom:0}
.kq-pt-goal .gr.tot .gn,.kq-pt-goal .gn{font-weight:500}
.kq-pt-goal .gn small{display:block;font-weight:400;line-height:14px}
.kq-pt-goal .gb{position:relative;height:10px;border-radius:5px;background:#EEF2F4}
.kq-pt-goal .gb i{position:absolute;top:0;bottom:0;left:0;border-radius:5px}
.kq-pt-goal .gb .g{top:-4px;bottom:-4px;width:2px;margin-left:-1px;border-radius:0;background:#262524}
.kq-pt-goal .gv{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;line-height:18px}.kq-pt-goal .gn{line-height:18px}
.kq-pt-goal .gs{text-align:right}
.kq-pt-att{list-style:none;margin:6px 0 0;padding:0}
.kq-pt-att li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 14px;align-items:start;padding:10px 0;border-bottom:1px solid var(--rule)}
.kq-pt-att.two li{grid-template-columns:minmax(0,1fr) auto;padding:7px 0}.kq-pt-att.one li{padding:8px 0;white-space:nowrap}
.kq-pt-att.wide li{grid-template-columns:64px minmax(0,1.9fr) minmax(0,1fr) auto;padding:6px 0}
.kq-pt-att .aw .ad{font-size:12px;line-height:18px}
.kq-pt-att li:last-child{border-bottom:0;padding-bottom:0}
.kq-pt .pill{display:inline-flex;align-items:center;justify-self:start;height:20px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap;vertical-align:1px}
.kq-pt .pill.bad{background:#FFEDEA;color:#831C1E}.kq-pt .pill.warn{background:#FFFBEB;color:#92400E;box-shadow:inset 0 0 0 1px #F5E3B0}.kq-pt .pill.good{background:#EAF6EF;color:#1D6340}.kq-pt .pill.flat{background:#EEF2F4;color:#3D4449}
.kq-pt .at{font-weight:500}.kq-pt .ad{margin-top:1px;color:var(--muted)}
.kq-pt .ao{margin-top:4px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt .ao b{color:#262524}
.kq-pt .av{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.kq-pt .go{color:var(--acc);white-space:nowrap}
.kq-pt-dec{list-style:none;margin:4px 0 0;padding:0}
.kq-pt-dec li{padding:9px 0;border-bottom:1px solid #C3D8E4}
.kq-pt-dec .ad{color:#3D4A52}
.kq-pt-dec .dm{display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 12px;margin-top:4px;font-size:12px;line-height:18px;color:#3D4A52}
.kq-pt-dec .dm b{color:#262524}
.kq-pt-card.rec .kq-pt-csub,.kq-pt-card.rec .kq-pt-note{color:#3D4A52}
/* the product table: one row per product across sales, traffic, stock and listing health */
.kq-pt-prod{margin-top:14px;padding:6px 20px 12px}
.kq-pt-prod .pr{display:grid;grid-template-columns:minmax(124px,1.1fr) 84px 90px 84px minmax(104px,.85fr) 92px minmax(0,2.75fr);gap:2px 14px;align-items:center;padding:5px 0;border-bottom:1px solid var(--rule)}
.kq-pt-prod .pr small{display:block;line-height:15px}
.kq-pt-prod .ph{align-items:end;color:var(--muted);font-size:12px;line-height:16px;border-bottom-color:var(--border)}
.kq-pt-prod .pr:not(.ph){min-height:46px}.kq-pt-prod .pr>p,.kq-pt-prod .pt p{line-height:18px}
.kq-pt-prod .pv p{display:flex;align-items:center;gap:8px;white-space:nowrap}
.kq-pt-prod .cb{position:relative;display:block;height:6px;margin:4px 0 0;border-radius:3px;background:#EEF2F4;overflow:hidden}
.kq-pt-prod .cb b{position:absolute;top:0;bottom:0;background:#D3E0E7}
.kq-pt-prod .cb i{position:absolute;top:0;bottom:0;left:0;border-radius:3px;background:#00618D}
.kq-pt-prod .cb i.low{background:#C4242A}
.kq-pt-prod .pt .ao{margin-top:1px}.kq-pt-prod .pt{padding-left:6px}
.kq-pt-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:start;margin-top:14px}
.kq-pt-three .av strong{font-weight:500}
.kq-pt-fig figcaption{margin-top:14px;font-size:15px;color:#626366}
.kq-pt-points{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 32px;font-size:17px;line-height:1.5}
.kq-pt-points li{padding-top:14px;border-top:2px solid #102A4C}
.kq-pt-points strong{display:block;font-weight:500;color:#102A4C}
@media (max-width:1100px){.kq-pt{grid-template-columns:1fr}.kq-pt-side{display:none}.kq-pt-top{padding:0 12px}.kq-pt-sheet{margin:0 8px 8px}.kq-pt .kq-pt-spark,.kq-pt-defs .w{display:none}.kq-pt-prod .pr{grid-template-columns:minmax(110px,1fr) 84px minmax(110px,.8fr) minmax(0,2.4fr)}.kq-pt-prod .px,.kq-pt-prod .pa,.kq-pt-prod .pk{display:none}}
@media (max-width:900px){.kq-pt-cols,.kq-pt-three{grid-template-columns:1fr}}
@media (max-width:760px){.kq-pt .w{display:none}.kq-pt .n{display:inline}.kq-pt-search{display:none}.kq-pt-top{justify-content:space-between}.kq-pt-sheet{padding:16px 14px}.kq-pt-stamp{align-items:flex-start;text-align:left}.kq-pt-ctl .kq-pt-exp,.kq-pt-ctl .kq-pt-find2{display:none}
.kq-pt-kstrip{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-kstrip>div{padding:8px 12px}.kq-pt-kstrip>div:nth-child(odd){border-left:0}.kq-pt-kstrip>div:nth-child(n+3){border-top:1px solid var(--border)}.kq-pt .kv{font-size:20px;line-height:26px}
.kq-pt-card{padding:12px 14px}.kq-pt-leg{flex-basis:100%;gap:2px 12px}
.kq-pt-goal .gr{grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:5px 0}.kq-pt-goal .gn small,.kq-pt-goal .gv small{display:inline}.kq-pt-goal .gb{grid-column:1/-1;grid-row:3;margin:3px 0 2px}.kq-pt-goal .gv{grid-column:1;grid-row:2;text-align:left}.kq-pt-goal .gs{grid-column:2;grid-row:1/3;align-self:center}
.kq-pt-att.wide li{display:block;position:relative;padding:8px 0}.kq-pt-att.wide .aw .at::after{content:" · ";font-weight:400}.kq-pt-dec li{padding:7px 0}.kq-pt-att.wide .pill{margin-right:6px}.kq-pt-att.wide li>div:nth-child(2){display:inline}.kq-pt-att.wide li>div:nth-child(2) .at{display:inline}.kq-pt-att.wide li>div:nth-child(2) .ad{display:none}.kq-pt-att.wide .aw{margin-top:3px;font-size:12px;line-height:17px}.kq-pt-att.wide .aw p{display:inline;font-size:12px}.kq-pt-att.wide .av{flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 12px;margin-top:3px;text-align:left;white-space:normal}.kq-pt-att.wide li:nth-child(n+4){display:none}
.kq-pt-dec .go{display:none}
.kq-pt-prod{padding:4px 14px 12px}.kq-pt-prod .ph,.kq-pt-prod .pr:nth-of-type(n+6){display:none}.kq-pt-prod .pr{grid-template-columns:minmax(0,1fr) auto;gap:3px 12px;padding:9px 0}.kq-pt-prod .ps{grid-column:2;grid-row:1}.kq-pt-prod .pv{grid-column:1/-1;display:flex;align-items:center;gap:10px}.kq-pt-prod .pv::before{content:"Weeks of cover";flex:none;white-space:nowrap;font-size:12px;color:var(--muted)}.kq-pt-prod .pv p{flex:0 0 76px}.kq-pt-prod .cb{flex:1 1 60px;max-width:130px;margin:0}.kq-pt-prod .pt{grid-column:1/-1;padding-left:0}
.kq-pt-scope{overflow:hidden;text-overflow:ellipsis}.kq-pt-sw{font-size:15px}.kq-pt-sw>span:first-child{flex-basis:100%}.kq-pt-sw label{padding:0 14px}}
@media (max-width:360px){.kq-pt .kv{font-size:18px}.kq-pt-kstrip>div{padding:8px 10px}}
/* end of the client portal picture */
`;
