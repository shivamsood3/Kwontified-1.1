// The client portal example shown on Why Kwontified (and wherever else the site shows the portal).
//
// It is a working model of the product, not live data: HTML, CSS and a small inline script drawn in
// the visual language of the Kwontified Client Portal mockups (Jordan's design artifact,
// https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9), with a sample brand's figures. It shows the
// portal as it is planned, with two screens, one for each kind of reader the portal serves:
//   1. Overview: what an executive opens (the month against goal for each channel, contribution
//      after Amazon fees and ad spend, the decisions waiting for the client, what needs attention
//      with its owner and status, and what the team did this week);
//   2. Amazon operations: what the people who run the channel open. Five tabs (Products,
//      Advertising, Inventory, Orders, Account health), each a real table, then the campaigns, search terms
//      and shipments behind the numbers. The Products tab is a proposal that grew out of the
//      review of the data warehouse; the mockups split it over several screens.
//
// How it works
//   - The screen switch is a radio group and CSS (:has), so it works without the script. The two
//     screens share one grid cell and the unchosen one is hidden with visibility, so the page never
//     moves. The four tab panels share a cell in the same way.
//   - Everything else is switched on by PORTAL_JS: the tabs (a tablist with arrow keys), the
//     "With an open step" filter (aria-pressed), column sorting (aria-sort) and the buttons on the
//     Overview that open the place in the example where the detail is. Those buttons are written
//     disabled and the script enables them, so without the script the example is a still picture
//     with nothing that looks alive and does nothing.
//   - It is real structure for assistive technology (headings, lists, tables with captions), not an
//     image. The side menu and search box are decoration and are hidden from it.
//
// The example carries an "Illustrative example" tag and a caption, and is marked data-nosnippet so
// the sample figures are not quoted in search results as Kwontified's own.
//
// Every figure is derived below from one small set of invented base numbers (most of them the
// mockups' own sample figures), and check() stops the build if a total, a ratio or a sentence no
// longer follows from its parts. Change a base number and everything that depends on it follows.
// Keep the picture under about 1,050px tall at 1440px wide and 1,900px on a phone: it is as tall
// as the taller screen, so measure both after any change (text that wraps adds a line).
//
// scripts/site-about.mjs calls portalSection() with its own section helpers and adds PORTAL_CSS to
// the page. Everything about the example, its script included, lives in this file.

const fail = (m) => { console.error("portal-example: " + m); process.exit(1); };
const check = (ok, m) => { if (!ok) fail("the sample figures no longer agree: " + m); };
const usd = (n) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
const num = (n) => Math.round(n).toLocaleString("en-US");
const sum = (a, f) => a.reduce((t, x) => t + f(x), 0);
const word = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven"][n] || String(n);
const cap = (s) => s[0].toUpperCase() + s.slice(1);

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

// contribution on Amazon: sales less refunds, Amazon's fees, promotions and ad spend (no product cost)
const COSTS = { refunds: 15400, referral: 133950, fulfilment: 109040, storage: 7410, promotions: 11800 };
const contribution = AMZ.sales - sum(Object.values(COSTS), (v) => v) - AMZ.spend, contribShare = ((100 * contribution) / AMZ.sales).toFixed(1);
check(contribution === 542450 && contribShare === "59.7", "contribution");

// the recommendation that closes the Amazon gap
const REC = { add: 2500, roas: 4.06, days: 8 };
const recSales = Math.floor((REC.add * REC.roas) / 100) * 100;
check(recSales === 10100 && Math.round((100 * REC.add * REC.roas) / amzGap) === 93, "the recommendation against the gap");

// Amazon products, Oct 1 to 23: sales, Sponsored ads sales, units, sessions, change on Sep 1 to 23, units on hand,
// inbound, average weekly units, order-by date, units returned, top return reason, repeat buyers %, Subscribe and Save
const PRODUCTS = [
  { n: "Retinol serum", sku: "SKN-RS-30", sales: 129500, ad: 53611, units: 3083, sess: 39025, chg: 9.8, on: 2700, inb: 6000, wk: 938, by: "Oct 30", ret: 96, why: "Not as expected", rep: 24, sns: 610, tag: ["bad", "Low cover"], step: "Reorder 6,300 units by Oct 30", who: "<span class=\"w\">Marketplace </span>Operations · awaiting your decision" },
  { n: "Gift set", sku: "SKN-GS-3P", sales: 67700, ad: 31445, units: 1058, sess: 25190, chg: 38.5, on: 980, inb: 6000, wk: 322, by: "Oct 28", ret: 19, why: "Arrived damaged", rep: 6, sns: 0, tag: ["bad", "Suppressed"], step: "Corrected image uploaded Oct 20", who: "Creative Studio · with Amazon for review" },
  { n: "Mineral sunscreen", sku: "SKN-MS-50", sales: 107100, ad: 41094, units: 3825, sess: 56250, chg: -3.4, on: 8900, inb: 0, wk: 1164, by: "Nov 18", ret: 61, why: "No longer needed", rep: 22, sns: 420, tag: ["bad", "Suppressed"], step: "Safety data sheet filed Oct 17", who: "<span class=\"w\">Marketplace </span>Operations · two sizes, with Amazon" },
  { n: "Eye cream", sku: "SKN-EC-15", sales: 54600, ad: 19847, units: 1517, sess: 24869, chg: 1.7, on: 4100, inb: 0, wk: 462, by: "Dec 9", ret: 26, why: "Not as expected", rep: 19, sns: 280, tag: ["warn", "Listing issue"], step: "Bullet point rewrite due Oct 27", who: "<span class=\"w\">Marketplace </span>Operations · restricted claim, in progress" },
  { n: "Vitamin C serum", sku: "SKN-VC-30", sales: 262400, ad: 90083, units: 6905, sess: 75880, chg: 14.2, on: 13100, inb: 9000, wk: 2102, by: "Nov 4", ret: 124, why: "No longer needed", rep: 31, sns: 1840 },
  { n: "Night cream", sku: "SKN-NC-50", sales: 169800, ad: 56579, units: 3691, sess: 48566, chg: 6.1, on: 7400, inb: 4500, wk: 1123, by: "Nov 11", ret: 89, why: "Arrived damaged", rep: 27, sns: 960 },
  { n: "Foaming cleanser", sku: "SKN-FC-15", sales: 75000, ad: 22719, units: 4167, sess: 49607, chg: 2.2, on: 10600, inb: 0, wk: 1268, by: "Dec 2", ret: 50, why: "Ordered by mistake", rep: 35, sns: 1310 },
];
const OTHER_SALES = 42300, OTHER_AD_SALES = 13240, DSP_SALES = 82210, PRODUCT_COUNT = 31, COVER_WEEKS = 16;
const shownSales = sum(PRODUCTS, (p) => p.sales);
check(shownSales + OTHER_SALES === AMZ.sales, "product sales against the Amazon total");
check(sum(PRODUCTS, (p) => p.ad) + OTHER_AD_SALES + DSP_SALES === AMZ.adSales, "product ad sales against the Amazon total");
const shownShare = Math.round((100 * shownSales) / AMZ.sales);
const cover = (p) => p.on / p.wk;
const order = (p) => Math.max(0, Math.round((COVER_WEEKS * p.wk - p.on - p.inb) / 100) * 100); // to 16 weeks, in cases of 100
const retinol = PRODUCTS[0];
check(cover(retinol).toFixed(1) === "2.9" && order(retinol) === 6300 && order(PRODUCTS[1]) === 0, "retinol serum cover and reorder");
const retinolWeekly = Math.round((retinol.wk * retinol.sales) / retinol.units / 100) * 100;
check(retinolWeekly === 39400, "retinol serum weekly sales");
const lowCover = PRODUCTS.filter((p) => cover(p) < 4).length, withStep = PRODUCTS.filter((p) => p.tag).length;
check(lowCover === 2 && withStep === 4, "open steps");
const byName = PRODUCTS.map((p) => p.n).sort();

// campaigns that ran out of budget: daily budget, hours without ads this month, return
const CAPPED = [
  { n: "Brands video: vitamin C", day: 280, hrs: 41, roas: 4.06 },
  { n: "Products keyword: retinol", day: 380, hrs: 30, roas: 5.21 },
  { n: "Products auto: all products", day: 190, hrs: 18, roas: 4.85 },
].map((c) => ({ ...c, missed: Math.round(((c.day / 24) * c.hrs * c.roas) / 10) * 10 }));
const cappedHrs = sum(CAPPED, (c) => c.hrs), cappedMissed = sum(CAPPED, (c) => c.missed);
check(cappedHrs === 89 && cappedMissed === 5100 && CAPPED[0].roas === REC.roas, "campaigns out of budget");

// Amazon advertising by type, Oct 1 to 23: spend and attributed sales
const ADS = [["Sponsored Products, auto", 17120, 82948], ["Sponsored Products, keyword", 30290, 167789], ["Sponsored Products, product targeting", 4310, 15430], ["Sponsored Brands, video", 7420, 30125], ["Sponsored Brands, product collection", 4880, 18105], ["Sponsored Display, audiences", 5190, 14221], ["DSP", 19140, DSP_SALES]];
check(sum(ADS, (a) => a[1]) === AMZ.spend && sum(ADS, (a) => a[2]) === AMZ.adSales && (ADS[3][2] / ADS[3][1]).toFixed(2) === REC.roas.toFixed(2), "advertising by type against the Amazon totals");
const TAB_NAMES = ["Products", "Advertising", "Inventory", "Orders", "Account health"], ti = (n) => TAB_NAMES.indexOf(n);

const SHIPMENTS = [["Vitamin C serum", 9000, "receiving", "Oct 26"], ["Retinol serum", 6000, "in transit", "Oct 29"], ["Gift set", 6000, "in transit", "Oct 31"], ["Night cream", 4500, "ready to ship", "Nov 6"]];
const inboundUnits = sum(SHIPMENTS, (s) => s[1]);
check(inboundUnits === sum(PRODUCTS, (p) => p.inb) && inboundUnits === 25500, "inbound units");

// eight complete weeks, Aug 25 to Oct 19: sales and ad spend in thousands (all channels), return on ad spend, Amazon contribution
const WK = { sales: [352, 358, 355, 361, 366, 371, 384, 379], spend: [33.1, 33.6, 33.2, 33.9, 34.2, 34.6, 35.9, 35.1], roas: [4.21, 4.26, 4.3, 4.28, 4.33, 4.31, 4.41, 4.37], contrib: [137, 139, 138, 141, 143, 145, 150, 148] };
WK.tacos = WK.sales.map((s, i) => (100 * WK.spend[i]) / s);

// a small line for eight weekly values: the mockups' blue, a dot on the latest week. It stretches
// to the room it has; the strokes do not scale, so the dot stays round.
function spark(v) {
  const W = 92, H = 30, pad = 4, lo = Math.min(...v), hi = Math.max(...v), span = hi - lo || 1;
  const pts = v.map((y, i) => [pad + (i * (W - 2 * pad)) / (v.length - 1), H - pad - ((y - lo) / span) * (H - 2 * pad)]);
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" "), last = pts[pts.length - 1].map((n) => n.toFixed(1));
  return `<svg class="kq-pt-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="#00618D" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="M${last[0]} ${last[1]}h0" stroke="#FFFFFF" stroke-width="11" vector-effect="non-scaling-stroke"/><path d="M${last[0]} ${last[1]}h0" stroke-width="7" vector-effect="non-scaling-stroke"/></svg>`;
}

const ICON = { 0: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></svg>', 1: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 12.5l3.5-4 3 2.5 4.5-6"/></svg>' };
const SEARCH = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>';

// a button on the Overview that opens the place in the example where the detail is: "screen tab target"
const go = (label, to, about) => `<button type="button" class="go hit" data-go="${to}" disabled>${label}<span class="sr"> ${about}</span> <span aria-hidden="true">→</span></button>`;
// a table inside its own scroll region, so a narrow screen can scroll it sideways with every column kept
const tbl = (id, caption, head, body, cls = "") => `<div class="kq-pt-scroll" role="region" id="${id}-r" aria-labelledby="${id}" tabindex="0"><table class="${cls}"><caption id="${id}" class="sr">${caption}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
const th = (label, small, sort = true, cls = "num") => `<th scope="col" class="${cls}"${sort ? ' aria-sort="none"' : ""}>${sort ? `<button type="button" disabled><span>${label} <i aria-hidden="true"></i></span>${small ? `<small>${small}</small>` : ""}</button>` : `${label}${small ? `<small>${small}</small>` : ""}`}</th>`;
const td = (v, a, b, cls = "num") => `<td class="${cls}" data-v="${v}">${a}${b === undefined ? "" : `<small>${b}</small>`}</td>`;
const HINT = `<p class="kq-pt-hint">Scroll the table sideways to see every column.</p>`;

export function portalSection({ section, two, H2, P }) {
  const NAV = [["Overview", 0, "n1"], ["Channels", "g"], ["Amazon", 0], ["Sales", 1], ["Advertising", 1], ["Marketing Cloud", 1], ["Operations", 1, "n2"], ["Walmart", 0], ["Target Plus", 0], ["Your account", "g"], ["Reports and forecasts", 0], ["Call notes and projects", 0], ["Team and access", 0]];
  const side = `<div class="kq-pt-side" aria-hidden="true"><p class="kq-pt-brand"><b>KWONTIFIED</b><span>Client portal</span></p>${NAV.map(([label, kind, cls]) => (kind === "g" ? `<p class="kq-pt-grp">${label}</p>` : `<p class="kq-pt-nv${kind ? " sub" : ""}${cls ? " " + cls : ""}">${ICON[kind]}<span>${label}</span></p>`)).join("")}<p class="kq-pt-usr"><i>MC</i><span>Maya Chen</span></p></div>`;
  const top = `<div class="kq-pt-top"><p class="kq-pt-search" aria-hidden="true">${SEARCH}Search dashboards, products and reports</p><p class="kq-pt-tag">Illustrative example</p><p class="kq-pt-scope" aria-hidden="true">Sample skincare brand</p></div>`;

  // ---- screen 1: Overview, for an executive ---------------------------------------------------
  const KPIS = [
    ["Total sales", usd(ALL.sales), ["+8.3%", "pos"], ["+21.6%", "pos"], WK.sales],
    ["Ad spend", usd(ALL.spend), ["+8.4%", "mut"], ["+17.9%", "mut"], WK.spend],
    ["ROAS", roas.toFixed(2) + "x", ["+1.7%", "pos"], ["+3.1%", "pos"], WK.roas],
    ["TACoS", tacos.toFixed(1) + "%", ["+0.0 pts", "mut"], ["−0.3 pts", "pos"], WK.tacos],
    ["Contribution, Amazon", usd(contribution), ["+7.4%", "pos"], ["+20.3%", "pos"], WK.contrib],
  ];
  const kstrip = `<ul class="kq-pt-card kq-pt-kstrip">${KPIS.map(([l, v, a, b, s]) => `<li><p class="kl">${l}</p><div class="kr"><p class="kv">${v}</p>${spark(s)}</div><p class="kd"><span class="${a[1]}">${a[0]}</span> <span class="mut">vs Sep 1 to 23</span></p><p class="kd"><span class="${b[1]}">${b[0]}</span> <span class="mut">vs <span class="w">Oct 1 to 23, </span>2025</span></p></li>`).join("")}</ul>
<p class="kq-pt-defs"><b>Total sales</b> ordered product sales before refunds. <b>ROAS</b> ad-attributed sales ÷ ad spend. <b>TACoS</b> ad spend ÷ total sales. <b>Contribution</b> Amazon sales less refunds, Amazon’s fees, promotions and ad spend, before product cost: ${contribShare}% of Amazon sales. Ad sales for the last 14 days are provisional.<span class="w"> Lines show the last eight complete weeks.</span></p>`;

  const SCALE = 1.1; // the bars run to 110% of goal, so a forecast above goal still fits
  const goalRow = (c, total) => {
    const gap = c.fc - c.goal, near = Math.abs(gap) / c.goal < 0.0025;
    const pill = near ? `<span class="pill flat">On goal</span>` : gap < 0 ? `<span class="pill warn">${usd(-gap)} short</span>` : `<span class="pill good">${usd(gap)} ahead</span>`;
    const w = (v) => ((100 * v) / c.goal / SCALE).toFixed(1);
    return `<li class="gr${total ? " tot" : ""}"><p class="gn">${c.n}${c.thru ? ` <small>to ${c.thru}</small>` : ""}</p><div class="gb" aria-hidden="true"><i class="f" style="width:${w(c.fc)}%"></i><i class="a" style="width:${w(c.sales)}%"></i><i class="g" style="left:${(100 / SCALE).toFixed(1)}%"></i></div><p class="gv"><span class="sr">Sales to date ${usd(c.sales)}. Forecast </span><strong>${usd(c.fc)}</strong> <small>${((100 * c.fc) / c.goal).toFixed(1)}% of ${usd(c.goal)}<span class="sr"> goal</span></small></p><p class="gs">${pill}</p></li>`;
  };
  const goal = `<div class="kq-pt-card"><div class="kq-pt-chead"><h4 class="kq-pt-h2">October forecast against goal</h4><p class="kq-pt-leg" aria-hidden="true"><span><i class="a"></i>Sales to date</span><span><i class="f"></i><span>Forecast<span class="w"> to month end</span></span></span><span><i class="g"></i>Goal</span></p></div><ul class="kq-pt-goal">${CH.map((c) => goalRow(c)).join("")}${goalRow(ALL, true)}</ul><p class="kq-pt-note">Amazon likely range: $1,223,000 to $1,236,000.</p></div>`;

  const DECISIONS = [
    [`Add ${usd(REC.add)} to Sponsored Brands video for the last eight days`, `About ${usd(recSales)} more at ${REC.roas.toFixed(2)}x: 93% of the ${usd(amzGap)} gap.`, "Advertising", "Decide by Oct 25", go("See the campaigns", `2 ${ti("Advertising")} kq-pt-capped`, "that ran out of budget")],
    ["Order 6,300 units of retinol serum by Oct 30", "With the shipment in transit, back to 16 weeks of cover.", `<span class="w">Marketplace </span>Operations`, "Decide by Oct 30", go("See the inventory", `2 ${ti("Inventory")} kq-pt-i-${retinol.sku}`, "for retinol serum")],
  ];
  const decisions = `<div class="kq-pt-card rec" id="kq-pt-dec" tabindex="-1"><h4 class="kq-pt-h2">Decisions for you <small class="w">${DECISIONS.length} recommendations from your team</small></h4><ul class="kq-pt-dec">${DECISIONS.map(([t, d, who, by, btn]) => `<li><p class="at">${t}</p><p class="ad">${d}</p><p class="dm"><span><b>${who}</b> ${by}</span>${btn}</p></li>`).join("")}</ul><p class="kq-pt-note">Your team makes the change once you have agreed.</p></div>`;

  const ALERTS = [
    ["High", `${retinol.n}: ${cover(retinol).toFixed(1)} weeks of cover`, "Runs out around Nov 12 unless the inbound shipment lands first.", usd(retinolWeekly), "weekly sales", `<span class="w">Marketplace </span>Operations`, `${num(retinol.inb)} units<span class="w"> in transit,</span> due Oct 29`, go("Inventory", `2 ${ti("Inventory")} kq-pt-i-${retinol.sku}`, "for retinol serum")],
    ["High", "Amazon is behind the October goal", `Forecast ${usd(AMZ.fc)} against ${usd(AMZ.goal)}, with 8 days left.`, usd(amzGap), "short of goal", "Advertising", "Recommendation awaiting your decision", go("Recommendation", "1 - kq-pt-dec", "on the Amazon goal")],
    ["High", "3 suppressed listings", "Mineral sunscreen (two sizes) and the gift set cannot be bought.", "3", "listings", `<span class="w">Marketplace </span>Operations`, "Fixes with Amazon for review", go("Account health", `2 ${ti("Account health")} kq-pt-issues-r`, "open issues")],
    ["Medium", `${CAPPED.length} campaigns ran out of budget`, `${cappedHrs} hours without ads this month, on campaigns returning ${Math.min(...CAPPED.map((c) => c.roas)).toFixed(2)}x to ${Math.max(...CAPPED.map((c) => c.roas)).toFixed(2)}x.`, usd(cappedMissed), "est. ad sales missed", "Advertising", "Budget shift proposed Oct 22", go("Campaigns", `2 ${ti("Advertising")} kq-pt-capped`, "that ran out of budget")],
  ];
  const attention = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Needs attention <small class="w">Ranked by severity, then by sales at stake, each with its owner and status</small></h4><ul class="kq-pt-att wide">${ALERTS.map(([sev, t, d, n, u, who, st, btn]) => `<li><span class="pill ${sev === "High" ? "bad" : "warn"}">${sev}</span><div><p class="at">${t}</p><p class="ad">${d}</p></div><div class="aw"><p class="at">${who}</p><p class="ad">${st}</p></div><div class="av"><span><strong>${n}</strong> <small>${u}</small></span>${btn}</div></li>`).join("")}</ul></div>`;

  const LOG = [["Oct 22", "Advertising", "38 negative search terms added, 2 moved to exact"], ["Oct 21", "Call note", "Weekly review: notes and action items posted"], ["Oct 20", "Creative Studio", "Corrected gift set main image uploaded"]];
  const team = `<div class="kq-pt-card kq-pt-team"><h4 class="kq-pt-h2">From your team this week</h4><ul>${LOG.map(([dt, who, t]) => `<li><small>${dt} · ${who}</small><span>${t}</span></li>`).join("")}</ul></div>`;

  const exec = `<section class="kq-pt-sheet kq-pt-v1" aria-labelledby="kq-pt-h1"><p class="kq-pt-crumb">Sample skincare brand</p><div class="kq-pt-trow"><div><h3 class="kq-pt-h1" id="kq-pt-h1">Overview</h3><p class="kq-pt-find">Sales across your three channels reached ${usd(ALL.sales)} in October so far and are forecast to finish within ${usd(ALL.goal - ALL.fc)} of the ${usd(ALL.goal)} goal. Amazon is forecast ${usd(amzGap)} short; a recommendation from your team would close most of it.</p></div><p class="kq-pt-stamp"><span><span class="n">Oct 1 to 23, 2026 · </span>Data as of Oct 24, 6:00 a.m. ET</span><span>Amazon to ${AMZ.thru} · Walmart, Target Plus to ${CH[1].thru}</span></p></div>
<p class="kq-pt-ctl"><span>Oct 1 to 23, 2026</span><span>vs same days last month</span><span class="w">vs same days last year</span></p>
${kstrip}
<div class="kq-pt-cols">${goal}${decisions}</div>
${attention}
${team}</section>`;

  // ---- screen 2: Amazon operations, for the people who run the channel --------------------------
  const MAXWK = 12, band = [6, 10];
  const bar = (c) => `<span class="cb" aria-hidden="true"><b style="left:${(100 * band[0]) / MAXWK}%;width:${(100 * (band[1] - band[0])) / MAXWK}%"></b><i${c < 4 ? ` class="low"` : ""} style="width:${Math.min(100, (100 * c) / MAXWK).toFixed(1)}%"></i></span>`;
  const coverCell = (p) => { const c = cover(p); return `<td class="cv" data-v="${c.toFixed(2)}"><span><strong>${c.toFixed(1)}</strong>${c < 4 ? ` <span class="pill bad">Low</span>` : ""}</span>${bar(c)}</td>`; };
  const name = (p, id) => `<th scope="row" data-v="${byName.indexOf(p.n)}"${id ? ` id="${id}" tabindex="-1"` : ""}>${p.n}<small>${p.sku}</small></th>`;
  const products = tbl("kq-pt-c0", `Products, Oct 1 to 23: ${PRODUCTS.length} of ${PRODUCT_COUNT}, ${shownShare}% of Amazon sales`,
    th("Product", "", true, "") + th("Sales", "vs Sep 1 to 23") + th("Sessions", "unit session %") + th("Ad sales", "share of sales") + th("Weeks of cover", `target ${band[0]} to ${band[1]}`, true, "") + th("On hand", "inbound") + th("Next step", "owner and status", true, "desc"),
    PRODUCTS.map((p) => `<tr${p.tag ? " data-step" : ""}>${name(p)}${td(p.sales, usd(p.sales), `<span class="${p.chg > 0 ? "pos" : "neg"}">${p.chg > 0 ? "+" : "−"}${Math.abs(p.chg).toFixed(1)}%</span>`)}${td(p.sess, num(p.sess), `${((100 * p.units) / p.sess).toFixed(1)}%`)}${td(p.ad, usd(p.ad), `${((100 * p.ad) / p.sales).toFixed(1)}%`)}${coverCell(p)}${td(p.on, num(p.on), p.inb ? `${num(p.inb)} inbound` : "none inbound")}<td class="pt" data-v="${(p.tag ? (p.tag[0] === "bad" ? 2 : 1) : 0) * 1e7 + p.sales}">${p.tag ? `<span class="pill ${p.tag[0]}">${p.tag[1]}</span> <span class="at">${p.step}</span><small>${p.who}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "prod")
    + `<p class="kq-pt-none" hidden>No product matches. Clear the search or the filter to see all ${word(PRODUCTS.length)}.</p><p class="kq-pt-note">${PRODUCTS.length} of ${PRODUCT_COUNT} products, ${shownShare}% of Amazon sales. <b>Unit session %</b> units ordered ÷ sessions. <b>Ad sales</b> Sponsored ads only. <b>Weeks of cover</b> units on hand ÷ average weekly units over four weeks; under 4 is low.</p>`;
  const inventory = tbl("kq-pt-c1", "Inventory and replenishment by product, as of this morning",
    th("Product", "", true, "") + th("On hand") + th("Inbound") + th("Weekly units", "four-week average") + th("Weeks of cover", `target ${band[0]} to ${band[1]}`, true, "") + th("Suggested order", `to ${COVER_WEEKS} weeks`) + th("Order by", "", false),
    PRODUCTS.map((p) => `<tr>${name(p, `kq-pt-i-${p.sku}`)}${td(p.on, num(p.on))}${td(p.inb, p.inb ? num(p.inb) : "None")}${td(p.wk, num(p.wk))}${coverCell(p)}${td(order(p), order(p) ? num(order(p)) : "Covered by inbound")}<td class="num">${p.by}</td></tr>`).join(""))
    + `<p class="kq-pt-note">Suggested orders bring each product to ${COVER_WEEKS} weeks of cover with what is inbound, in cases of 100. ${num(inboundUnits)} units are inbound in ${word(SHIPMENTS.length)} shipments. 460 units in two listings are stranded and cannot sell.</p>`;
  const orders = tbl("kq-pt-c2", "Orders, returns and repeat purchase by product, Oct 1 to 23",
    th("Product", "", true, "") + th("Units ordered") + th("Returned") + th("Return rate") + th("Top return reason", "", false, "") + th("Repeat buyers", "share of customers") + th("Subscribe and Save", "active subscriptions"),
    PRODUCTS.map((p) => `<tr>${name(p)}${td(p.units, num(p.units))}${td(p.ret, num(p.ret))}${td(((100 * p.ret) / p.units).toFixed(2), `${((100 * p.ret) / p.units).toFixed(1)}%`)}<td>${p.why}</td>${td(p.rep, `${p.rep}%`)}${td(p.sns, p.sns ? num(p.sns) : "Not enrolled")}</tr>`).join(""))
    + `<p class="kq-pt-note"><b>Return rate</b> units returned ÷ units ordered. <b>Repeat buyers</b> customers who bought the product more than once, from Amazon Brand Analytics, to Oct 17. Subscriptions as of this morning.</p>`;
  const st = (k, t) => `<span class="pill ${k}">${t}</span>`;
  const health = `<div class="kq-pt-two">` + tbl("kq-pt-c3", "Performance against Amazon’s targets",
    th("Measure", "", false, "") + th("Current", "", false) + th("Target", "", false, "") + th("Status", "", false, ""),
    [["Order defect rate", "0.21%", "Below 1%", st("good", "On track")], ["Late shipment rate", "0.8%", "Below 4%", st("good", "On track")], ["Pre-fulfillment cancel rate", "0.1%", "Below 2.5%", st("good", "On track")], ["Valid tracking rate", "99.2%", "Above 95%", st("good", "On track")], ["Policy warnings", "1", "None open", st("warn", "Watch")], ["Suppressed listings", "3", "None", st("bad", "Action")]].map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td class="num">${b}</td><td>${c}</td><td>${d}</td></tr>`).join(""), "plain")
    + tbl("kq-pt-issues", "Open issues, with owner and status",
    th("Open issue", "", false, "") + th("Products", "", false, "") + th("Opened", "", false, "") + th("Status", "", false, "") + th("Owner", "", false, ""),
    [["Missing safety data sheet", "Mineral sunscreen, two sizes", "Oct 17", "With Amazon for review", `<span class="w">Marketplace </span>Operations`], ["Main image rule", "Gift set", "Oct 20", "Corrected image uploaded", "Creative Studio"], ["Restricted claim in bullet points", "Eye cream", "Oct 21", "Rewrite due Oct 27", `<span class="w">Marketplace </span>Operations`], ["Policy warning: expiration dating", "Retinol serum", "Oct 14", "Plan of action submitted", `<span class="w">Marketplace </span>Operations`]].map(([a, b, c, d, e]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td><td>${e}</td></tr>`).join(""), "plain") + `</div><p class="kq-pt-note">Account health as of this morning.<span class="w"> The three suppressed listings are the two sunscreen sizes and the gift set.</span></p>`;

  const ads = tbl("kq-pt-c4", "Amazon advertising by campaign type, Oct 1 to 23",
    th("Campaign type", "", true, "") + th("Spend") + th("Share of spend") + th("Ad sales") + th("ROAS") + th("ACoS"),
    ADS.map(([n, sp, sa], i) => `<tr><th scope="row" data-v="${i}">${n}</th>${td(sp, usd(sp))}${td(sp, `${((100 * sp) / AMZ.spend).toFixed(1)}%`)}${td(sa, usd(sa))}${td((sa / sp).toFixed(3), `${(sa / sp).toFixed(2)}x`)}${td(((100 * sp) / sa).toFixed(2), `${((100 * sp) / sa).toFixed(1)}%`)}</tr>`).join(""))
    + `<p class="kq-pt-note">All types: ${usd(AMZ.spend)} spend, ${usd(AMZ.adSales)} ad sales, ${(AMZ.adSales / AMZ.spend).toFixed(2)}x. <b>ROAS</b> ad-attributed sales ÷ spend. <b>ACoS</b> spend ÷ ad-attributed sales. Sponsored ads use a 7-day window and DSP a 14-day window; the last 14 days are provisional.</p>`;
  const TABS = [["Products", products], ["Advertising", ads], ["Inventory", inventory], ["Orders", orders], ["Account health", health]];
  check(TABS.map((t) => t[0]).join() === TAB_NAMES.join(), "tab order");
  const tablist = `<div class="kq-pt-bar"><div class="kq-pt-tabs" role="tablist" aria-label="Amazon operations">${TABS.map(([t], i) => `<button type="button" role="tab" id="kq-pt-t${i}" aria-controls="kq-pt-p${i}" aria-selected="${!i}"${i ? ' tabindex="-1"' : ""} disabled>${t.replace("Account health", '<span class="w">Account health</span><span class="n">Health</span>').replace("Advertising", '<span class="w">Advertising</span><span class="n">Ads</span>')}</button>`).join("")}</div><p class="kq-pt-say" role="status"></p><label class="kq-pt-q"><span class="sr">Find a product or SKU</span>${SEARCH}<input type="search" placeholder="Find a product" autocomplete="off" disabled></label><button type="button" class="kq-pt-flt hit" aria-pressed="false" disabled>With an open step <b>${withStep}</b></button></div>`;
  const panes = `<div class="kq-pt-panes">${TABS.map(([, html], i) => `<div class="kq-pt-pane${i ? "" : " on"}" role="tabpanel" id="kq-pt-p${i}" aria-labelledby="kq-pt-t${i}">${html}${HINT}</div>`).join("")}</div>`;

  const rows = (items) => `<ul class="kq-pt-att two">${items.map(([t, d, n, u]) => `<li><div><p class="at">${t}</p><p class="ad">${d}</p></div><div class="av"><span><strong>${n}</strong></span><small>${u}</small></div></li>`).join("")}</ul>`;
  const capped = `<div class="kq-pt-card" id="kq-pt-capped" tabindex="-1"><h4 class="kq-pt-h2">Campaigns that ran out of budget</h4><p class="kq-pt-csub">Est. missed = hourly budget × hours × ROAS</p>${rows(CAPPED.map((c) => [c.n, `${c.hrs} hours · ${c.roas.toFixed(2)}x ROAS`, usd(c.missed), "est. missed"]))}</div>`;
  const terms = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Search terms we acted on</h4><p class="kq-pt-csub">Ads to Oct 23 · search share to Oct 17</p>${rows([["vitamin c serum for face", "$1,840 spend · 6.75x ROAS", "Exact match", "done Oct 22"], ["sunscreen spf 50 face", "$640 spend · 0.64x ROAS", "Negative", "done Oct 22"], ["mineral sunscreen for face", "Clicks 2.6%, purchases 2.1%", "Listing review", "proposed"]])}</div>`;
  const ships = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Inbound shipments</h4><p class="kq-pt-csub">${num(inboundUnits)} units, with status and expected date</p><ul class="kq-pt-att two one">${SHIPMENTS.map(([n, u, s, eta]) => `<li><p><span class="at">${n}</span> <small>${num(u)}<span class="sr"> units</span></small></p><p class="num"><small>${s}</small> <strong>${eta}</strong></p></li>`).join("")}</ul></div>`;

  const CHANGES = [["Oct 22", "Search terms", "38 negatives added, 2 moved to exact match"], ["Oct 21", "Featured Offer", "Vitamin C serum lost it for 6 hours to an offer at $36.90"], ["Oct 20", "Listing", "Gift set main image replaced"], ["Oct 19", "Budget", `Brands video raised from $250 to ${usd(CAPPED[0].day)} a day`]];
  const changes = `<div class="kq-pt-card kq-pt-team four"><h4 class="kq-pt-h2">Changes this week</h4><ul>${CHANGES.map(([dt, k, t]) => `<li><small>${dt} · ${k}</small><span>${t}</span></li>`).join("")}</ul></div>`;

  const ops = `<section class="kq-pt-sheet kq-pt-v2" aria-labelledby="kq-pt-h2" data-tab="0"><p class="kq-pt-crumb">Sample skincare brand / Amazon</p><div class="kq-pt-trow"><div><h3 class="kq-pt-h1" id="kq-pt-h2">Operations</h3><p class="kq-pt-find">${cap(word(PRODUCTS.length))} products make up ${shownShare}% of Amazon sales this month. ${cap(word(withStep))} have an open step: ${word(lowCover)} are under four weeks of cover and three listings are suppressed.</p></div><p class="kq-pt-stamp"><span>Data as of Oct 24, 6:00 a.m. ET</span><span>Sales to ${AMZ.thru} · inventory as of this morning</span></p></div>
${tablist}
${panes}
<div class="kq-pt-three">${capped}${terms}${ships}</div>
${changes}</section>`;

  const sw = `<div class="kq-pt-sw" role="radiogroup" aria-labelledby="kq-pt-swl"><span id="kq-pt-swl">Show the example for</span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v1" checked><label for="kq-pt-v1">An executive</label></span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v2"><label for="kq-pt-v2">The team running the channel</label></span></div>`;

  return section("portal", "portal", "#F8F6F1", two(
    `<h2 id="portal-title" style="${H2}">The client portal</h2>`,
    `<p style="${P}">Every dashboard, report, forecast, call note and open task for your account is in one place, and you see the same numbers we do. An executive opens on the month against goal and the decisions waiting for an answer. The people who run the channel open on the product, campaign or shipment behind each number. Tables export to CSV or Excel.</p><p style="margin: 16px 0 0">The example below works: switch screens, open the tabs, sort a column, find a product. <a href="/client-sign-in" style="color: #102A4C">Client sign-in</a></p>`,
  ) + `<figure class="kq-pt-fig">${sw}<div class="kq-pt" data-nosnippet>
${side}
<div class="kq-pt-main">${top}<div class="kq-pt-views">${exec}
${ops}</div></div></div><figcaption>An illustrative example of two portal screens, with a sample brand’s figures. It does not show a client’s data.</figcaption><script>${PORTAL_JS}</script></figure>
<ul class="kq-pt-points"><li><strong>The month against goal</strong>Sales to date, the forecast and the goal for each channel, then the decisions waiting for you.</li><li><strong>The item behind each number</strong>The product, campaign, search term or shipment, with its next step and who has it.</li><li><strong>Dated to the source</strong>Every page says how fresh each channel’s data is.</li></ul>`);
}

// Switches the example on: tabs, the open-step filter, column sorting and the Overview's buttons.
// Written for old browsers on purpose (no arrow functions), and it touches nothing outside the figure.
const PORTAL_JS = String.raw`(function(){var f=document.querySelector('.kq-pt-fig');if(!f||!f.querySelector)return;
function all(s,r){return [].slice.call((r||f).querySelectorAll(s))}
var ops=f.querySelector('.kq-pt-v2'),box=f.querySelector('.kq-pt-panes'),say=f.querySelector('.kq-pt-say'),flt=f.querySelector('.kq-pt-flt'),qi=f.querySelector('.kq-pt-q input'),none=f.querySelector('.kq-pt-none'),tabs=all('[role=tab]'),panes=tabs.map(function(t){return document.getElementById(t.getAttribute('aria-controls'))});
function pick(i,focus){tabs.forEach(function(t,j){var on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;panes[j].classList.toggle('on',on)});ops.setAttribute('data-tab',i);say.textContent='';if(focus)tabs[i].focus()}
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i)});t.addEventListener('keydown',function(e){var k=e.key,n=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:k==='Home'?0:k==='End'?tabs.length-1:null;if(n===null)return;e.preventDefault();pick((n+tabs.length)%tabs.length,1)})});
function apply(){var on=flt.getAttribute('aria-pressed')==='true',s=qi.value.toLowerCase().replace(/^\s+|\s+$/g,''),n=0,rows=all('tbody tr',panes[0]);box.style.minHeight=box.offsetHeight+'px';rows.forEach(function(r){r.hidden=(on&&!r.hasAttribute('data-step'))||(s&&r.cells[0].textContent.toLowerCase().indexOf(s)<0);if(!r.hidden)n++});none.hidden=n>0;say.textContent='Showing '+n+' of '+rows.length+' products'}
flt.addEventListener('click',function(){flt.setAttribute('aria-pressed',flt.getAttribute('aria-pressed')!=='true');apply()});qi.addEventListener('input',apply);
all('thead button').forEach(function(b){b.addEventListener('click',function(){var th=b.parentNode,i=[].indexOf.call(th.parentNode.children,th),c=th.getAttribute('aria-sort'),d=c==='descending'?'ascending':c==='ascending'||/num|desc/.test(th.className)?'descending':'ascending',tb=th.parentNode.parentNode.parentNode.tBodies[0];
all('th[aria-sort]',th.parentNode).forEach(function(x){x.setAttribute('aria-sort','none')});th.setAttribute('aria-sort',d);
[].slice.call(tb.rows).sort(function(a,c){var x=+a.cells[i].getAttribute('data-v'),y=+c.cells[i].getAttribute('data-v');return d==='ascending'?x-y:y-x}).forEach(function(r){tb.appendChild(r)});
say.textContent='Sorted by '+b.firstChild.textContent.replace(/\s+$/,'')+', '+d})});
all('[data-go]').forEach(function(b){b.addEventListener('click',function(){var g=b.getAttribute('data-go').split(' '),t=document.getElementById(g[2]);document.getElementById('kq-pt-v'+g[0]).checked=true;if(g[1]!=='-')pick(+g[1]);if(t)t.focus()})});
window.addEventListener('resize',function(){box.style.minHeight=''});
all('button[disabled],input[disabled]').forEach(function(b){b.disabled=false});f.className+=' is-live'})();`;

export const PORTAL_CSS = String.raw`/* the client portal example, in the portal mockups' own type sizes and colours */
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
.kq-pt p,.kq-pt ul,.kq-pt h3,.kq-pt h4{margin:0}.kq-pt h3,.kq-pt h4{font-family:inherit;color:inherit;letter-spacing:normal;text-transform:none}.kq-pt ul{padding:0;list-style:none}.kq-pt *{box-sizing:border-box}
.kq-pt b,.kq-pt strong{font-weight:500}
.kq-pt small{font-size:12px;color:var(--muted)}
.kq-pt .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.kq-pt button{font:inherit;color:inherit;margin:0;padding:0;border:0;background:none;text-align:inherit;cursor:pointer;opacity:1}
.kq-pt button:disabled{cursor:default}
.kq-pt button:focus-visible,.kq-pt-scroll:focus-visible{outline:3px solid var(--acc);outline-offset:2px;border-radius:4px}
.kq-pt [tabindex="-1"]:focus{outline:3px solid var(--acc);outline-offset:2px}
.kq-pt .hit{position:relative}.kq-pt .hit::after{content:"";position:absolute;inset:-12px -6px}
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
/* the two screens share one cell, and so do the four tab panels: the page keeps one height whichever is showing */
.kq-pt-views,.kq-pt-panes{display:grid;min-width:0}.kq-pt-views{flex:1}
.kq-pt-sheet{grid-area:1/1;background:#FFFFFF;border:1px solid #E3E8EB;border-radius:16px;margin:0 8px 8px 0;padding:16px 24px 20px;min-width:0}
.kq-pt-v2,.kq-pt-pane{visibility:hidden}
.kq-pt-pane{grid-area:1/1;min-width:0}.kq-pt-pane.on{visibility:inherit}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v1{visibility:hidden}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v2{visibility:visible}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n1{background:none;color:var(--muted)}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n2{background:#E1E7EA;color:#262524}
@supports not selector(:has(a)){.kq-pt-sw{display:none}}
.kq-pt-crumb{color:var(--muted);margin-bottom:2px!important}
.kq-pt-trow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:8px 24px}
.kq-pt-trow>div{flex:1 1 30em;min-width:0}
.kq-pt-h1{font-size:24px;line-height:30px;font-weight:600;letter-spacing:-.01em}
.kq-pt-find{margin-top:4px!important;line-height:22px;max-width:58em}
.kq-pt-stamp{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px;line-height:16px;color:var(--muted);text-align:right}
.kq-pt-stamp span:first-child{text-decoration:underline dotted #B3B8BC;text-underline-offset:3px}
.kq-pt-ctl{display:flex;flex-wrap:wrap;gap:8px;max-width:none;margin-top:12px!important;padding-bottom:12px;border-bottom:1px solid var(--border)}
.kq-pt-ctl span{display:inline-flex;align-items:center;height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
.kq-pt-bar{display:flex;flex-wrap:wrap;align-items:center;gap:0 14px;margin-top:6px;border-bottom:1px solid var(--border)}
.kq-pt-tabs{display:flex;flex-wrap:wrap;gap:0 6px;margin-right:auto}
.kq-pt-tabs button{min-height:44px;padding:0 8px;color:var(--muted);white-space:nowrap}
.kq-pt-tabs button[aria-selected="true"]{color:#262524;font-weight:500;box-shadow:inset 0 -2px 0 var(--acc)}
.kq-pt-fig.is-live .kq-pt-tabs button:hover{color:#262524}
.kq-pt-say{min-height:16px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt .kq-pt-flt{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
.kq-pt .kq-pt-flt[aria-pressed="true"]{background:#E1E7EA;border-color:#AEBAC1}
.kq-pt-flt b{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#FFEDEA;color:#831C1E;font-size:12px}
.kq-pt-v2:not([data-tab="0"]) .kq-pt-flt,.kq-pt-v2:not([data-tab="0"]) .kq-pt-q{visibility:hidden}
.kq-pt-q{position:relative;display:flex;align-items:center;min-height:44px;color:#6B6B6B}
.kq-pt-q svg{position:absolute;left:10px;pointer-events:none}
.kq-pt-q input{width:190px;height:30px;margin:0;padding:0 8px 0 30px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;font:inherit;color:#262524;-webkit-appearance:none;appearance:none}
.kq-pt-q input::placeholder{color:#6B6B6B;opacity:1}
.kq-pt-q input:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.kq-pt-none{padding:14px 0;color:var(--muted)}.kq-pt-none[hidden]{display:none}
.kq-pt-card{background:#FFFFFF;border:1px solid var(--border);border-radius:8px;padding:14px 20px;min-width:0}
.kq-pt-card.rec{background:#EAF3F8;border-color:#C3D8E4}
.kq-pt-kstrip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:0!important;margin-top:12px!important}
.kq-pt-kstrip>li{padding:10px 16px;border-left:1px solid var(--border);min-width:0}.kq-pt-kstrip>li:first-child{border-left:0}
.kq-pt .kl{color:var(--muted);white-space:nowrap}
.kq-pt .kr{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px}
.kq-pt .kv{font-size:22px;line-height:30px;font-weight:500;letter-spacing:-.01em}
.kq-pt .kd{margin-top:2px;font-size:12px;line-height:16px}
.kq-pt-spark{flex:1 1 30px;min-width:0;max-width:92px;height:30px;overflow:visible}
.kq-pt .pos{color:#247B50}.kq-pt .neg{color:#B42126}.kq-pt .mut{color:var(--muted)}
.kq-pt .num{text-align:right;font-variant-numeric:tabular-nums}
.kq-pt-defs,.kq-pt-note,.kq-pt-hint{margin-top:8px!important;max-width:none;font-size:12px;line-height:17px;color:var(--muted)}
.kq-pt-defs b,.kq-pt-note b{color:#262524}
.kq-pt-hint{display:none}
.kq-pt-cols{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:12px;align-items:stretch;margin:10px 0 12px}
.kq-pt-h2{font-size:16px;line-height:22px;font-weight:600}.kq-pt-h2 small{margin-left:6px;font-weight:400}
.kq-pt-csub{margin-top:2px!important;color:var(--muted)}
.kq-pt-chead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:6px 16px}
.kq-pt-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt-leg>span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.kq-pt-leg i{width:14px;height:8px;border-radius:2px}
.kq-pt-leg .a,.kq-pt-goal .a{background:#00618D}
.kq-pt-leg .f,.kq-pt-goal .f{background:#A9CFE0}
.kq-pt-leg .g{width:2px;height:12px;border-radius:0;background:#262524}
.kq-pt-goal{margin-top:6px!important}
.kq-pt-goal .gr{display:grid;grid-template-columns:96px minmax(0,1fr) 124px 104px;gap:4px 16px;align-items:center;padding:4px 0;border-bottom:1px solid var(--rule)}
.kq-pt-goal .gv small{display:block;line-height:14px}
.kq-pt-goal .gr.tot{border-bottom:0;padding-bottom:0}
.kq-pt-goal .gn{font-weight:500;line-height:18px}
.kq-pt-goal .gn small{display:block;font-weight:400;line-height:14px}
.kq-pt-goal .gb{position:relative;height:10px;border-radius:5px;background:#EEF2F4}
.kq-pt-goal .gb i{position:absolute;top:0;bottom:0;left:0;border-radius:5px}
.kq-pt-goal .gb .g{top:-4px;bottom:-4px;width:2px;margin-left:-1px;border-radius:0;background:#262524}
.kq-pt-goal .gv{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;line-height:18px}
.kq-pt-goal .gs{text-align:right}
.kq-pt-att{margin-top:6px!important}
.kq-pt-att li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 14px;align-items:start;padding:10px 0;border-bottom:1px solid var(--rule)}
.kq-pt-att.two li{grid-template-columns:minmax(0,1fr) auto;padding:7px 0}.kq-pt-att.one li{padding:8px 0;white-space:nowrap}
.kq-pt-att.wide li{grid-template-columns:64px minmax(0,1.9fr) minmax(0,1fr) auto;padding:5px 0}
.kq-pt-att .aw .ad{font-size:12px;line-height:18px}
.kq-pt-att li:last-child{border-bottom:0;padding-bottom:0}
.kq-pt .pill{display:inline-flex;align-items:center;justify-self:start;height:20px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap;vertical-align:1px}
.kq-pt .pill.bad{background:#FFEDEA;color:#831C1E}.kq-pt .pill.warn{background:#FFFBEB;color:#92400E;box-shadow:inset 0 0 0 1px #F5E3B0}.kq-pt .pill.good{background:#EAF6EF;color:#1D6340}.kq-pt .pill.flat{background:#EEF2F4;color:#3D4449}
.kq-pt .at{font-weight:500}.kq-pt .ad{margin-top:1px;color:var(--muted)}
.kq-pt .av{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.kq-pt .go{color:var(--acc);white-space:nowrap}
.kq-pt-fig.is-live .go:hover{text-decoration:underline}
.kq-pt-dec{margin-top:4px!important}
.kq-pt-dec li{padding:8px 0;border-bottom:1px solid #C3D8E4}
.kq-pt-dec .ad{color:#3D4A52}
.kq-pt-dec .dm{display:flex;flex-wrap:wrap;justify-content:space-between;gap:2px 12px;margin-top:4px;font-size:12px;line-height:18px;color:#3D4A52}
.kq-pt-dec .dm b{color:#262524}
.kq-pt-card.rec .kq-pt-note{color:#3D4A52}
.kq-pt-team{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 28px;align-items:center;margin-top:12px;padding:12px 20px}
.kq-pt-team ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 24px}.kq-pt-team.four ul{grid-template-columns:repeat(4,minmax(0,1fr))}
.kq-pt-team li small,.kq-pt-team li span{display:block}.kq-pt-team li small{line-height:16px}
/* the tables: real tables, each in a scroll region so a narrow screen keeps every column */
.kq-pt-scroll{overflow-x:auto;min-width:0;margin-top:2px}
.kq-pt table{width:100%;border-collapse:collapse;line-height:18px}
.kq-pt th,.kq-pt td{padding:4px 9px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:middle;font-weight:400}
.kq-pt th:first-child,.kq-pt td:first-child{padding-left:0}.kq-pt th:last-child,.kq-pt td:last-child{padding-right:0}
.kq-pt thead th{height:44px;padding-top:0;padding-bottom:0;font-size:12px;line-height:15px;color:var(--muted);vertical-align:bottom;border-bottom-color:var(--border);white-space:nowrap}
.kq-pt thead th:not([aria-sort]){padding-bottom:6px}
.kq-pt thead button{display:flex;flex-direction:column;justify-content:flex-end;width:100%;height:44px;padding-bottom:6px}
.kq-pt th.num button{align-items:flex-end}
.kq-pt thead i{display:inline-block;width:9px;font-style:normal;color:#8A9399}
.kq-pt th[aria-sort=none] i::before{content:"↕"}.kq-pt th[aria-sort=descending] i::before{content:"↓";color:#262524}.kq-pt th[aria-sort=ascending] i::before{content:"↑";color:#262524}
.kq-pt th[aria-sort]:not([aria-sort=none]) button>span{color:#262524;font-weight:500}
.kq-pt tbody th{font-weight:500;white-space:nowrap}
.kq-pt th small,.kq-pt td small{display:block;line-height:15px;font-weight:400}
.kq-pt td.num{white-space:nowrap}
.kq-pt tbody tr{height:45px}.kq-pt table.plain tbody tr{height:40px}.kq-pt table.plain tbody th{white-space:normal}
.kq-pt tbody th:focus{outline-offset:-3px;background:#EAF3F8}
.kq-pt td.cv{min-width:112px}.kq-pt td.cv>span:first-child{display:flex;align-items:center;gap:8px}
.kq-pt .cb{position:relative;display:block;height:6px;margin:4px 0 0;border-radius:3px;background:#EEF2F4;overflow:hidden}
.kq-pt .cb b{position:absolute;top:0;bottom:0;background:#D3E0E7}
.kq-pt .cb i{position:absolute;top:0;bottom:0;left:0;border-radius:3px;background:#00618D}
.kq-pt .cb i.low{background:#C4242A}
.kq-pt td.pt{width:31%;min-width:250px}
.kq-pt-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.9fr);gap:0 32px;align-items:start}
.kq-pt-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:start;margin-top:12px}
.kq-pt-three .av strong{font-weight:500}
.kq-pt .n{display:none}
.kq-pt-fig figcaption{margin-top:14px;font-size:15px;color:#626366}
.kq-pt-points{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 32px;font-size:17px;line-height:1.5}
.kq-pt-points li{padding-top:14px;border-top:2px solid #102A4C}
.kq-pt-points strong{display:block;font-weight:500;color:#102A4C}
@media (max-width:1100px){.kq-pt{grid-template-columns:1fr}.kq-pt-side{display:none}.kq-pt-top{padding:0 12px}.kq-pt-sheet{margin:0 8px 8px}.kq-pt .kq-pt-spark,.kq-pt-defs .w{display:none}.kq-pt table.prod,.kq-pt-pane>.kq-pt-scroll>table:not(.prod){min-width:860px}.kq-pt-hint{display:block}.kq-pt-pane:last-child .kq-pt-hint{display:none}.kq-pt-pane>.kq-pt-scroll>table[class=""]{min-width:700px}.kq-pt tbody th{position:sticky;left:0;background:#FFFFFF;padding-right:12px;box-shadow:1px 0 0 var(--rule)}.kq-pt-kstrip{grid-template-columns:repeat(3,minmax(0,1fr))}.kq-pt-kstrip>li:nth-child(n+4){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(4){border-left:0}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}}
@media (max-width:900px){.kq-pt-team.four ul{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-cols,.kq-pt-three,.kq-pt-two{grid-template-columns:1fr}.kq-pt-two{gap:12px}.kq-pt-two table{min-width:660px}.kq-pt-two td,.kq-pt table.plain tbody th{white-space:nowrap}.kq-pt td.pt{min-width:310px}.kq-pt-pane:last-child .kq-pt-hint{display:block}.kq-pt-team{grid-template-columns:1fr}}
@media (max-width:760px){.kq-pt .w{display:none}.kq-pt .n{display:inline}.kq-pt-search{display:none}.kq-pt-top{justify-content:space-between}.kq-pt-sheet{padding:14px 14px 16px}.kq-pt-stamp{align-items:flex-start;text-align:left}
.kq-pt-kstrip{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-kstrip>li{padding:6px 12px}.kq-pt-kstrip>li:nth-child(odd){border-left:0}.kq-pt-kstrip>li:nth-child(even){border-left:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(n+3){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}.kq-pt .kv{font-size:20px;line-height:26px}
.kq-pt-card{padding:10px 14px}.kq-pt-leg{flex-basis:100%;gap:2px 12px}
.kq-pt-goal .gr{grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:4px 0}.kq-pt-goal .gn small,.kq-pt-goal .gv small{display:inline}.kq-pt-goal .gb{grid-column:1/-1;grid-row:3;margin:3px 0 2px}.kq-pt-goal .gv{grid-column:1;grid-row:2;text-align:left}.kq-pt-goal .gs{grid-column:2;grid-row:1/3;align-self:center}
.kq-pt-att.wide li{display:block;position:relative;padding:8px 0}.kq-pt-att.wide .aw .at::after{content:" · ";font-weight:400}.kq-pt-dec li{padding:7px 0}.kq-pt-att.wide .pill{margin-right:6px}.kq-pt-att.wide li>div:nth-child(2){display:inline}.kq-pt-att.wide li>div:nth-child(2) .at{display:inline}.kq-pt-att.wide li>div:nth-child(2) .ad{display:none}.kq-pt-att.wide .aw{margin-top:3px;font-size:12px;line-height:17px}.kq-pt-att.wide .aw p{display:inline;font-size:12px}.kq-pt-att.wide .av{flex-direction:row;flex-wrap:wrap;align-items:baseline;gap:4px 12px;margin-top:3px;text-align:left;white-space:normal}
.kq-pt tbody th,.kq-pt table.plain tbody th{white-space:normal;max-width:136px}.kq-pt-team ul,.kq-pt-team.four ul{grid-template-columns:1fr;gap:6px}.kq-pt-team{gap:6px}.kq-pt-ctl,.kq-pt-v1 .kq-pt-crumb{display:none}.kq-pt-kstrip{margin-top:10px!important}.kq-pt-kstrip>li:nth-child(5){display:grid;grid-template-columns:auto 1fr;gap:0 14px;align-items:center}.kq-pt-kstrip>li:nth-child(5) .kl{grid-column:1/-1}.kq-pt-kstrip>li:nth-child(5) .kr{grid-row:2/4;margin:0}.kq-pt table.plain tbody tr{height:32px}.kq-pt-bar{gap:0 10px}.kq-pt-tabs{gap:0 2px;flex-basis:100%}.kq-pt-tabs button{padding:0 6px}.kq-pt-say{flex-basis:100%}.kq-pt-q{flex:1}.kq-pt-q input{width:100%;height:36px;font-size:16px}.kq-pt .kq-pt-flt{height:36px}
.kq-pt-scope{overflow:hidden;text-overflow:ellipsis}.kq-pt-sw{font-size:15px}.kq-pt-sw>span:first-child{flex-basis:100%}.kq-pt-sw label{padding:0 14px}}
@media (max-width:360px){.kq-pt .kv{font-size:18px}.kq-pt-kstrip>li{padding:8px 10px}.kq-pt-tabs button{padding:0 5px}}
/* end of the client portal example */
`;
