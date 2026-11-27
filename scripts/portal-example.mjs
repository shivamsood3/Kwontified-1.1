// The client portal example shown on Why Kwontified (and wherever else the site shows the portal).
//
// It is a working model of the product, not live data: HTML, CSS and a small inline script drawn in
// the visual language of the Kwontified Client Portal mockups (Jordan's design artifact,
// https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9), with a sample brand's figures. It shows the
// portal as it is planned, with two screens, one for each kind of reader the portal serves:
//   1. Overview: what an executive opens. The month, or the quarter, against goal for each channel
//      (forecast with its likely range, sales and contribution to date, ad spend against plan, ROAS,
//      TACoS), contribution after each marketplace's fees and ad spend, sales by day, the decisions
//      waiting for the client (which they can answer), what needs attention with its owner, status
//      and date, and what the team did.
//   2. Operations: what the people who run the channels open. A channel switch (Amazon, Walmart,
//      Target Plus). Amazon has seven tabs, each a real table that sorts and exports to CSV
//      (Products, Advertising by campaign, Search terms, Inventory, Returns and repeat, Promotions,
//      Account health), then inbound shipments and the week's changes. Walmart has a short item
//      view; Target Plus shows the honest "no feed for this account yet" state.
//
// How it works
//   - The screen, channel, period and Advertising view switches are radio groups and CSS (:has), so
//     they work without the script. Only the chosen screen, channel, tab panel, period and view is
//     laid out, so the cards below the tabs follow their content with no empty band; the script holds
//     the figure at its tallest state's height, so the page below it does not move.
//   - Everything else is switched on by PORTAL_JS: the tabs (a tablist with arrow keys), search and
//     the "With an open step" filter, column sorting (aria-sort), CSV export, the "Data as of"
//     freshness panel, Agree and Discuss on each decision, and the buttons that open the place in
//     the example where a number's detail is (first choosing the view that holds it), and the sales
//     by day chart as a slider (arrow keys read each day). The screen, tab and Advertising view are
//     kept in the address (#portal-ops-inventory, #portal-ops-advertising-keywords,
//     #portal-overview-q4 and so on), and every switch is a step in the history, so Back returns to
//     where you were and a reload keeps it. Without the script none
//     of those controls is shown (they are hidden with visibility, so nothing moves when the script
//     turns them on), and the example is a still picture of the two screens.
//   - It is real structure for assistive technology (headings, lists, tables with captions). The
//     side menu and the top search box are decoration and are hidden from it.
//
// The example carries an "Illustrative example" tag and a caption, and is marked data-nosnippet so
// the sample figures are not quoted in search results as Kwontified's own.
//
// Every figure is derived below from one small set of invented base numbers (most of them the
// mockups' own sample figures), and check() stops the build if a total, a ratio, a date or a
// sentence no longer follows from its parts. Change a base number and everything that depends on
// it follows. Keep the picture under about 1,270px tall at 1440px wide, 2,200px on an iPhone 13 and
// 2,620px at 320px (the Overview, the tallest state), so measure after any change.
//
// scripts/site-about.mjs calls portalSection() with its own section helpers and adds PORTAL_CSS to
// the page. Everything about the example, its script included, lives in this file.

const fail = (m) => { console.error("portal-example: " + m); process.exit(1); };
const check = (ok, m) => { if (!ok) fail("the sample figures no longer agree: " + m); };
const usd = (n) => (n < 0 ? "−" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
const usd2 = (n) => "$" + n.toFixed(2);
const num = (n) => Math.round(n).toLocaleString("en-US");
const pct = (n, d = 1) => n.toFixed(d) + "%";
const sum = (a, f) => a.reduce((t, x) => t + f(x), 0);
const word = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] || String(n);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const r10 = (n) => Math.round(n / 10) * 10, r100 = (n) => Math.round(n / 100) * 100, r1k = (n) => Math.round(n / 1000) * 1000;
const near = (a, b, tol) => Math.abs(a - b) / b <= tol;

// ---- dates: the data is as of Oct 24, 2026; sales run Oct 1 to 23 --------------------------------
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const D0 = Date.UTC(2026, 9, 24);
const date = (days) => { const d = new Date(D0 + Math.floor(days) * 864e5); return MON[d.getUTCMonth()] + " " + d.getUTCDate(); };
// a month before September is next year (the data runs from Aug 25 into the new year)
const yr = (m) => (MON.indexOf(m) < 7 ? 2027 : 2026);
const iso = (md) => { const [m, d] = md.split(" "); return yr(m) + "-" + String(MON.indexOf(m) + 1).padStart(2, "0") + "-" + d.padStart(2, "0"); };
const ASOF = "Oct 24, 6:00 a.m. ET", INV_ASOF = "Oct 24, 5:40 a.m. ET";
const DAYS = 23, DAYS_LEFT = 8, LEAD_WEEKS = 5, SAFETY_WEEKS = 1, COVER = [8, 12];
check(new Date(Date.UTC(2026, 9, 1)).getUTCDay() === 4 && date(0) === "Oct 24" && date(8) === "Nov 1", "the calendar");

// ---- the sample brand by channel, October to date --------------------------------------------------
const CH = [
  // sales and ad spend to date, ad-attributed sales, the October ad budget agreed with the client, the
  // October goal, the forecast and its likely range (80%)
  { n: "Amazon", thru: "Oct 23", days: 23, sales: 908400, spend: 88350, adSales: 410828, plan: 122000, goal: 1240000, fc: 1166100, lo: 1160000, hi: 1173000 },
  { n: "Walmart", thru: "Oct 22", days: 22, sales: 228100, spend: 18900, adSales: 66717, plan: 26000, goal: 310000, fc: 323900, lo: 317000, hi: 331000 },
  { n: "Target Plus", thru: "Oct 22", days: 22, sales: 101600, spend: 7690, adSales: 24608, plan: 10500, goal: 140000, fc: 144300, lo: 139000, hi: 150000 },
];
const ALL = { n: "All channels", sales: sum(CH, (c) => c.sales), spend: sum(CH, (c) => c.spend), adSales: sum(CH, (c) => c.adSales), plan: sum(CH, (c) => c.plan), goal: sum(CH, (c) => c.goal), fc: sum(CH, (c) => c.fc) };
// the channels' ranges combined as independent errors (root of the sum of squares)
ALL.lo = r1k(ALL.fc - Math.sqrt(sum(CH, (c) => (c.fc - c.lo) ** 2)));
ALL.hi = r1k(ALL.fc + Math.sqrt(sum(CH, (c) => (c.hi - c.fc) ** 2)));
const roas = ALL.adSales / ALL.spend, tacos = (100 * ALL.spend) / ALL.sales;
const AMZ = CH[0], amzGap = AMZ.goal - AMZ.fc;
check(ALL.sales === 1238100 && ALL.spend === 114940 && roas.toFixed(2) === "4.37" && tacos.toFixed(1) === "9.3", "channel totals");
check(amzGap === 73900 && ALL.goal - ALL.fc === 55700 && ALL.lo === 1624000 && ALL.hi === 1646000, "goal gaps and ranges");
check(CH.every((c) => c.lo <= c.fc && c.fc <= c.hi) && AMZ.hi < AMZ.goal, "each forecast inside its range; Amazon's range below goal");
check((AMZ.adSales / AMZ.spend).toFixed(2) === "4.65" && ((100 * CH[1].spend) / CH[1].sales).toFixed(1) === "8.3", "the mockup's channel table");
const ON_GOAL = 0.0025; // within 0.25% of goal reads "On goal"

// contribution by channel: sales less refunds, the marketplace's fees, promotions, fulfilment and ad
// spend (no product cost). Amazon and Walmart from their settlements; Target Plus from the weekly
// upload (Target's commission and refunds) and the brand's own 3PL invoices for shipping its orders.
// Amazon refunds are filled in below from the units returned (Returns tab) at their selling prices
const COSTS = { refunds: 18500, referral: 133950, fulfilment: 109040, storage: 7410, promotions: 10360 };
const CCOSTS = [COSTS, { refunds: 3650, referral: 34220, fulfilment: 31940, storage: 1060, promotions: 0 }, { refunds: 1520, referral: 15240, fulfilment: 9860, storage: 0, promotions: 0 }];
CH.forEach((c, i) => { c.contrib = c.sales - sum(Object.values(CCOSTS[i]), (v) => v) - c.spend; });
ALL.contrib = sum(CH, (c) => c.contrib);
const contribution = AMZ.contrib, contribShare = ((100 * contribution) / AMZ.sales).toFixed(1), allShare = ((100 * ALL.contrib) / ALL.sales).toFixed(1);
check(contribution === 540790 && contribShare === "59.5", "contribution on Amazon");
check(CH[1].contrib === 138330 && CH[2].contrib === 67290 && ALL.contrib === 746410 && allShare === "60.3", "contribution by channel");
check(near(CCOSTS[1].referral / CH[1].sales, 0.15, 0.01) && near(CCOSTS[2].referral / CH[2].sales, 0.15, 0.01), "Walmart's and Target Plus's 15% referral fee and commission");
check(CH.every((c) => c.contrib / c.sales > 0.55 && c.contrib / c.sales < 0.7), "contribution shares in a plausible band");

// the quarter (Oct 1 to Dec 31): the October figures above, plus November and December goals, ad
// plans and forecasts from the holiday plan, each forecast with its likely range (half-width)
const Q4 = [
  // Amazon's November and December forecasts are the products' sum at the stock plan's rates (asserted below)
  { goal: [1520000, 1610000], plan: [148000, 162000], fc: [1560800, 1677200], half: [52000, 68000] },
  { goal: [385000, 425000], plan: [31000, 34000], fc: [391000, 433000], half: [16000, 20000] },
  { goal: [172000, 198000], plan: [12500, 14000], fc: [168000, 194500], half: [9000, 12000] },
];
const QDAYS = 92;
const CHQ = CH.map((c, i) => { const q = Q4[i], fc = c.fc + q.fc[0] + q.fc[1], rest = sum(q.half, (h) => h * h);
  return { ...c, goal: c.goal + q.goal[0] + q.goal[1], plan: c.plan + q.plan[0] + q.plan[1], fc, lo: r1k(fc - Math.sqrt((c.fc - c.lo) ** 2 + rest)), hi: r1k(fc + Math.sqrt((c.hi - c.fc) ** 2 + rest)) }; });
const ALLQ = { ...ALL, goal: sum(CHQ, (c) => c.goal), plan: sum(CHQ, (c) => c.plan), fc: sum(CHQ, (c) => c.fc) };
ALLQ.lo = r1k(ALLQ.fc - Math.sqrt(sum(CHQ, (c) => (c.fc - c.lo) ** 2)));
ALLQ.hi = r1k(ALLQ.fc + Math.sqrt(sum(CHQ, (c) => (c.hi - c.fc) ** 2)));
check(CHQ[0].goal === 4370000 && CHQ[0].fc === 4404100 && ALLQ.goal === 6000000 && ALLQ.fc === 6058800 && ALLQ.plan === 560000, "the quarter's goals, forecasts and ad plans");
check([...CHQ, ALLQ].every((c) => c.lo <= c.fc && c.fc <= c.hi) && CHQ.every((c, i) => c.fc > CH[i].fc && c.spend < c.plan), "each quarter forecast inside its range");
// November and December each run above the channel's daily rate to date (the holiday season)
check(CH.every((c, i) => Q4[i].fc[0] / 30 > c.sales / c.days && Q4[i].fc[1] / 31 > Q4[i].fc[0] / 30), "the quarter's months rise into December");

// ---- sales by day, by channel: a weekly rhythm, Prime Big Deal Days on Oct 7 and 8, scaled to the totals
const DOW = [0.95, 1.05, 1.03, 1.0, 0.98, 0.97, 1.02]; // Sunday to Saturday
const BDD_EXTRA = 8220; // the deal's extra Amazon sales on each of the two days (see PROMOS)
// two Amazon listings are suppressed: the gift set from Oct 19 (listed Oct 1 to 18) and the mineral
// sunscreen, both sizes, from Oct 21 (listed Oct 1 to 20). Their sales fall only on the days they were
// listed; the rest of Amazon's sales run on every day.
const SUPP = [["Gift set", 67700, 18], ["Mineral sunscreen", 107100, 20]];
const wave = (n, w) => Array.from({ length: n }, (_, d) => DOW[(4 + d) % 7] * (1 + 0.004 * d) * (1 + w * Math.sin(d * 1.9)));
const spread = (total, raw, n) => { const t = sum(raw.slice(0, n), (x) => x); return raw.map((x, d) => (d < n ? (x * total) / t : 0)); };
function byDay(c, w, spike, parts = []) {
  const raw = wave(c.days, w), rest = c.sales - spike * 2 - sum(parts, (q) => q[1]);
  const listed = spread(rest, raw, c.days).map((x, d) => x + (spike && (d === 6 || d === 7) ? spike : 0));
  const v = listed.map((x, d) => r10(x + sum(parts, (q) => spread(q[1], raw, q[2])[d])));
  const big = v.indexOf(Math.max(...v)); v[big] += c.sales - sum(v, (x) => x);
  return { v, listed };
}
const AMZD = byDay(CH[0], 0.03, BDD_EXTRA, SUPP);
const DAILY = [AMZD.v, byDay(CH[1], 0.05, 0).v, byDay(CH[2], 0.06, 0).v];
check(DAILY.every((v, i) => sum(v, (x) => x) === CH[i].sales && v.length === CH[i].days), "sales by day against the channel totals");
// the suppressions show in Amazon's days: Oct 19 to 23 against the same weekdays a week before
const amzSpan = (a, b) => sum(DAILY[0].slice(a, b + 1), (x) => x);
const lostWeek = sum(SUPP, ([, s, n]) => sum(spread(s, wave(DAYS, 0.03), n).slice(11, 16), (x) => x)) - sum(SUPP, ([, s, n]) => sum(spread(s, wave(DAYS, 0.03), n).slice(18, 23), (x) => x));
check(amzSpan(18, 22) < amzSpan(11, 15) && near(amzSpan(11, 15) - amzSpan(18, 22), lostWeek - (sum(AMZD.listed.slice(18, 23), (x) => x) - sum(AMZD.listed.slice(11, 16), (x) => x)), 0.01), "Amazon's days drop when the listings are suppressed");
// the rest of the month runs at the last seven days' level, by day of week. Amazon's forecast leaves
// the two suppressed listings out until Amazon reinstates them, so it continues only what is listed.
const restOfMonth = (v) => { const lvl = sum(v.slice(-7), (x) => x) / 7; let t = 0; for (let d = v.length; d < 31; d++) t += lvl * DOW[(4 + d) % 7]; return t; };
check(CH.every((c, i) => c.fc === r100(c.sales + restOfMonth(i ? DAILY[i] : AMZD.listed))), "forecasts continue the last seven days (Amazon: the listings still live)");
// what the two listings would add if both were back on Oct 25 (seven days at their listed-day rates)
const BACK = "Oct 25", backDays = 31 - (+BACK.split(" ")[1]) + 1, reinstate = r100(sum(SUPP, ([, s, n]) => (s / n) * backDays));
const dayTotal = (d) => sum(DAILY, (v) => v[d] || 0);
const span = (a, b) => { let t = 0; for (let d = a; d <= b; d++) t += dayTotal(d); return t; };

// eight complete weeks, Aug 25 to Oct 19 (all channels, in thousands). The three October weeks come
// from the days above (contribution at each channel's October share of sales); Sep 29 and 30 run at
// September's daily rate.
const SEP = { sales: ALL.sales / 1.083, spend: ALL.spend / 1.084, roas: roas / 1.017, contrib: ALL.contrib / 1.074 };
const wk = (v) => (v / DAYS) * 7;
const chWeek = (a, b) => { let t = 0; for (let d = a; d <= b; d++) CH.forEach((c, i) => { t += (DAILY[i][d] || 0) * (c.contrib / c.sales); }); return t; };
const WK = {
  sales: [340, 345, 347, 352, 358, Math.round((span(0, 4) + (2 * SEP.sales) / DAYS) / 1000), Math.round(span(5, 11) / 1000), Math.round(span(12, 18) / 1000)],
  spend: [31.8, 32.0, 32.3, 32.6, 33.2, 33.9, 35.2, 34.8],
  roas: [4.24, 4.28, 4.3, 4.32, 4.33, 4.35, 4.39, 4.36],
  contrib: [207, 210, 211, 215, 218, 224, Math.round(chWeek(5, 11) / 1000), Math.round(chWeek(12, 18) / 1000)],
};
WK.tacos = WK.sales.map((s, i) => (100 * WK.spend[i]) / s);
const avg = (a, i, j) => sum(a.slice(i, j + 1), (x) => x) / (j - i + 1);
for (const k of ["sales", "spend", "contrib"]) {
  const scale = k === "spend" || k === "sales" ? 1000 : 1000;
  check(near(avg(WK[k], 1, 3) * scale, wk(SEP[k]), 0.02), `the ${k} line in September (${avg(WK[k], 1, 3)} against ${Math.round(wk(SEP[k]))})`);
  // October's two full weeks run a little above the month's average: the suppressions from Oct 19 pull the last days down
  check(near(avg(WK[k], 6, 7) * scale, wk(ALL[k]), 0.055), `the ${k} line in October (${avg(WK[k], 6, 7)} against ${Math.round(wk(ALL[k]))})`);
}
check(near(avg(WK.roas, 1, 3), SEP.roas, 0.01) && near(avg(WK.roas, 6, 7), roas, 0.01), "the ROAS line");

// ---- Amazon products, Oct 1 to 23 -------------------------------------------------------------------
// sales, Sponsored ads sales, units, sessions, change on Sep 1 to 23, Featured Offer %, rating and
// ratings, sales rank, units on hand, inbound, average weekly units (Oct 1 to 23), the product's November
// and December daily units against October's (its season), units returned, top return reason, repeat
// buyers %, Subscribe and Save subscriptions, and the open step if there is one
const PRODUCTS = [
  { n: "Retinol serum", sku: "SKN-RS-30", sales: 129500, ad: 53611, units: 3083, sess: 39025, chg: 9.8, fo: 99.2, rt: 4.5, rc: 2140, rank: 1420, on: 4800, inb: 3000, wk: 938, q4: [1.25, 1.3], ret: 96, why: "Not as expected", rep: 24, sns: 610 },
  { n: "Gift set", sku: "SKN-GS-3P", sales: 67700, ad: 31445, units: 1058, sess: 25190, chg: 38.5, fo: 96.0, rt: 4.6, rc: 380, rank: 5600, listed: 18, on: 980, inb: 7000, wk: 322, q4: [2.0, 2.6], ret: 19, why: "Arrived damaged", rep: 6, sns: 0, tag: ["bad", "Suppressed"], step: "Corrected image with Amazon", who: "Creative Studio · filed Oct 20, next check Oct 25" },
  { n: "Mineral sunscreen", sku: "SKN-MS-50, -100", sales: 107100, ad: 41094, units: 3825, sess: 56250, chg: -3.4, fo: 97.8, rt: 4.3, rc: 1920, rank: 1860, listed: 20, on: 9800, inb: 0, wk: 1164, q4: [0.85, 0.8], ret: 61, why: "No longer needed", rep: 22, sns: 420, tag: ["bad", "Suppressed"], step: "Safety data sheet with Amazon", who: "<span class=\"w\">Marketplace </span>Operations · both sizes, filed Oct 17, next check Oct 25" },
  { n: "Eye cream", sku: "SKN-EC-15", sales: 54600, ad: 19847, units: 1517, sess: 24869, chg: 1.7, fo: 99.4, rt: 4.4, rc: 860, rank: 3900, on: 5200, inb: 0, wk: 462, q4: [1.2, 1.3], ret: 26, why: "Not as expected", rep: 19, sns: 280, tag: ["warn", "Listing issue"], step: "Bullet point rewrite due Oct 27", who: "<span class=\"w\">Marketplace </span>Operations · restricted claim, in progress" },
  { n: "Vitamin C serum", sku: "SKN-VC-30", sales: 262400, ad: 90083, units: 6905, sess: 75880, chg: 14.2, fo: 97.8, rt: 4.6, rc: 5310, rank: 410, on: 13100, inb: 9000, wk: 2102, q4: [1.28, 1.22], ret: 124, why: "No longer needed", rep: 31, sns: 1840 },
  { n: "Night cream", sku: "SKN-NC-50", sales: 169800, ad: 56579, units: 3691, sess: 48566, chg: 6.1, fo: 99.6, rt: 4.5, rc: 2480, rank: 1150, on: 8900, inb: 4500, wk: 1123, q4: [1.3, 1.3], ret: 89, why: "Arrived damaged", rep: 27, sns: 960 },
  { n: "Foaming cleanser", sku: "SKN-FC-15", sales: 75000, ad: 22719, units: 4167, sess: 49607, chg: 2.2, fo: 99.0, rt: 4.7, rc: 3090, rank: 890, on: 13200, inb: 0, wk: 1268, q4: [1.15, 1.2], ret: 50, why: "Ordered by mistake", rep: 35, sns: 1310 },
];
const OTHER_SALES = 42300, OTHER_AD_SALES = 13240, DSP_SALES = 82210, PRODUCT_COUNT = 31;
const shownSales = sum(PRODUCTS, (p) => p.sales);
check(shownSales + OTHER_SALES === AMZ.sales, "product sales against the Amazon total");
check(sum(PRODUCTS, (p) => p.ad) + OTHER_AD_SALES + DSP_SALES === AMZ.adSales, "product ad sales against the Amazon total");
check(PRODUCTS.every((p) => near(wk(p.units), p.wk, 0.01)), "weekly units follow from units sold");
const shownShare = Math.round((100 * shownSales) / AMZ.sales);
// the two suppressed products match the sales by day. Featured Offer % is a share of page views: they
// held it on every listed day, and while suppressed their pages, still reached from links, drew 15% of
// their listed-day page views with no offer
const SUPP_PV = 0.15;
check(SUPP.every(([n, sl, ld]) => { const p = PRODUCTS.find((x) => x.n === n); return p.sales === sl && p.listed === ld && Math.abs(p.fo - (100 * ld) / (ld + (DAYS - ld) * SUPP_PV)) < 0.05; }) && PRODUCTS.filter((p) => p.listed).length === SUPP.length, "the suppressed products against Amazon's days and the Featured Offer");
const SHIPMENTS = [["Vitamin C serum", 9000, "receiving", "Oct 26", "FBA18VK2Q7", "ONT8"], ["Retinol serum", 3000, "in transit", "Oct 29", "FBA18WD41M", "PHX7"], ["Gift set", 7000, "in transit", "Oct 31", "FBA18X3NTA", "BWI2"], ["Night cream", 4500, "ready to ship", "Nov 6", "FBA18Y92LR", "CLT2"]];
const inboundUnits = sum(SHIPMENTS, (s) => s[1]);
check(inboundUnits === sum(PRODUCTS, (p) => p.inb) && SHIPMENTS.every(([n, u]) => PRODUCTS.find((p) => p.n === n).inb === u), "inbound units");
const due = (p) => (SHIPMENTS.find((s) => s[0] === p.n) || [])[3];

// Amazon refunds in contribution: the units returned this month at their selling prices, the seven
// products here and $900 across the other 24
const OTHER_RETURNED = 900, returnedValue = sum(PRODUCTS, (p) => (p.ret * p.sales) / p.units);
check(COSTS.refunds === r100(returnedValue + OTHER_RETURNED) && COSTS.refunds > returnedValue, "Amazon refunds against the units returned");

// one cover rule everywhere, at the Q4 forecast. Each product sells its October daily average to
// Oct 31, then that times its season in November and December (Amazon's forecast, which includes the
// booked promotions), and October's rate again from January. The products' seasons, weighted by
// sales (the other 24 products at 1.15 and 1.2), come to Amazon's November and December forecast.
const OTHER_Q4 = [1.15, 1.2], QDAYS_M = [30, 31];
// one rate everywhere: Amazon's November and December forecasts are each product's daily sales (a
// suppressed product: while it was listed, the rate the stock plan, "A week" and the reinstatement
// use) times its season, plus the other 24 products at October's rate times theirs
const monthAt = (k) => sum(PRODUCTS, (p) => (p.sales / (p.listed || DAYS)) * p.q4[k] * QDAYS_M[k]) + (OTHER_SALES / DAYS) * OTHER_Q4[k] * QDAYS_M[k];
check([0, 1].every((k) => Q4[0].fc[k] === r100(monthAt(k))), "Amazon's November and December forecasts at the stock plan's product rates");
const NOV1 = 8, DEC1 = 38, JAN1 = 69; // days from Oct 24
// a suppressed product sells at its rate on the days it was listed, from the day it is expected back
// (both cases are due Oct 25), so stock is planned as if it sells again
const daily = (p) => p.units / (p.listed || DAYS);
const rate = (p, d) => (p.listed && d < dayOf(BACK) ? 0 : daily(p)) * (d < NOV1 ? 1 : d < DEC1 ? p.q4[0] : d < JAN1 ? p.q4[1] : 1);
const dayOf = (md) => { const [m, d] = md.split(" "); return Math.round((Date.UTC(yr(m), MON.indexOf(m), +d) - D0) / 864e5); };
check(date(NOV1) === "Nov 1" && date(DEC1) === "Dec 1" && date(JAN1) === "Jan 1" && dayOf("Jan 1") === JAN1 && iso("Jan 4") === "2027-01-04", "the forecast calendar");
const demand = (p, a, b) => { let t = 0; for (let d = a; d < b; d++) t += rate(p, d); return t; };
// days until on hand and inbound run out (inbound counts from the day it is due)
const runDays = (p) => { let st = p.on; const dd = p.inb ? dayOf(due(p)) : -1; for (let d = 0; d < 400; d++) { if (d === dd) st += p.inb; const need = rate(p, d); if (st < need) return d + st / need; st -= need; } return 400; };
// weeks of cover at the Q4 forecast; under 8 is low and gets a suggested order of 12 weeks of forecast
// demand less on hand and inbound (in cases of 100); order by is six weeks before stock runs out (the
// five-week lead time plus one week of safety stock), so an order lands a week before it does
const cover = (p) => runDays(p) / 7, coverOct = (p) => (p.on + p.inb) / p.wk;
const low = (p) => cover(p) < COVER[0];
const order = (p) => (low(p) ? Math.ceil((demand(p, 0, COVER[1] * 7) - p.on - p.inb) / 100) * 100 : 0);
const orderBy = (p) => date(runDays(p) - (LEAD_WEEKS + SAFETY_WEEKS) * 7), runsOut = (p) => date(runDays(p));
const retinol = PRODUCTS[0];
retinol.tag = ["bad", "Low cover"]; retinol.step = `Order ${num(order(retinol))} by ${orderBy(retinol)}`; retinol.who = "<span class=\"w\">Marketplace </span>Operations · awaiting your decision";
check(cover(retinol).toFixed(1) === "6.8" && coverOct(retinol) >= COVER[0] && order(retinol) === 5800 && orderBy(retinol) === "Oct 29" && runsOut(retinol) === "Dec 10", "retinol serum: low at the Q4 forecast though not at October's rate; order 5,800 by Oct 29, out Dec 10");
check(PRODUCTS.every((p) => date(runDays(p) - SAFETY_WEEKS * 7) === date(dayOf(orderBy(p)) + LEAD_WEEKS * 7)), "an order placed on its order-by day lands a week before stock runs out");
check(demand(retinol, 0, dayOf(due(retinol))) < retinol.on, "retinol on hand lasts until its inbound arrives");
check(PRODUCTS.every((p) => runDays(p) - (LEAD_WEEKS + SAFETY_WEEKS) * 7 >= 0), "no order date is already past");
check(PRODUCTS.filter(low).length === 1 && PRODUCTS.every((p) => p === retinol || (cover(p) >= COVER[0] && cover(p) <= COVER[1])), "only the retinol serum is outside the cover target");
const retinolWeekly = Math.round((retinol.wk * retinol.sales) / retinol.units / 100) * 100;
const suppNovWeek = r100(sum(PRODUCTS.filter((p) => p.listed), (p) => (p.sales / p.listed) * p.q4[0] * 7));
const weekly = (p) => r100((p.sales / (p.listed || DAYS)) * 7); // a suppressed listing: while it was listed
check(retinolWeekly === 39400, "retinol serum weekly sales");
const withStep = PRODUCTS.filter((p) => p.tag), suppressed = PRODUCTS.filter((p) => p.tag && p.tag[1] === "Suppressed");
check(withStep.length === 4 && suppressed.length === 2, "open steps");
const byName = PRODUCTS.map((p) => p.n).sort();
// FBA reimbursements this month: product, units, what happened, amount. Each is paid per unit at
// about 65% of the product's average selling price, to the cent, so a unit comes to $24.70 to $41.59.
const REIMB = [["Night cream", 12, "lost in a warehouse"], ["Vitamin C serum", 8, "lost in a warehouse"], ["Retinol serum", 6, "damaged in fulfilment"], ["Gift set", 2, "damaged in fulfilment"]]
  .map(([n, u, why]) => { const p = PRODUCTS.find((x) => x.n === n); return [n, u, why, Math.round(u * Math.round(65 * p.sales / p.units) / 100)]; });
const reimbTotal = sum(REIMB, (r) => r[3]);
check(reimbTotal === 804 && REIMB.every(([, u, , v]) => v / u >= 24 && v / u <= 60), "reimbursements: four cases, $804, $24 to $60 a unit");
const rowId = (p, k = "i") => `kq-pt-${k}-` + p.sku.replace(/[^A-Za-z0-9-]/g, "");


// ---- Amazon advertising by campaign, Oct 1 to 23 ------------------------------------------------------
// name, type, daily budget, spend, ad-attributed sales, hours out of budget this month, next step
const CAMPAIGNS = [
  ["Products keyword: vitamin C", "Sponsored Products, keyword", 520, 11240, 64070, 0],
  ["Products keyword: retinol", "Sponsored Products, keyword", 380, 8610, 44860, 30],
  ["Products keyword: night cream", "Sponsored Products, keyword", 340, 7420, 37840, 0],
  ["Brands video: vitamin C", "Sponsored Brands, video", 280, 5870, 23832, 41],
  ["Display: product page retargeting", "Sponsored Display, audiences", 240, 5190, 14221, 0],
  ["Brands collection: skincare", "Sponsored Brands, collection", 220, 4880, 18105, 0],
  ["Products auto: all products", "Sponsored Products, auto", 190, 4330, 21000, 18],
  ["Products targeting: competitor serums", "Sponsored Products, product targeting", 200, 4310, 15430, 0],
  ["DSP: all line items", "Amazon DSP, 14-day attribution", 0, 19140, DSP_SALES, 0],
].map(([n, type, day, spend, sales, hrs]) => ({ n, type, day, spend, sales, hrs, roas: sales / spend }));
// hours out of budget by the budget in force: [daily budget, hours lost, days]; the video's budget
// went from $250 to $280 on Oct 19, so its 41 hours are 33 at $250 (Oct 1 to 18) and 8 at $280
const PERIODS = { "Products keyword: retinol": [[380, 30, 23]], "Brands video: vitamin C": [[250, 33, 18], [280, 8, 5]], "Products auto: all products": [[190, 18, 23]] };
for (const c of CAMPAIGNS) { const per = PERIODS[c.n]; c.missed = per ? r10(sum(per, ([b, h]) => (b / 24) * h) * c.roas) : 0; if (per) check(sum(per, (x) => x[1]) === c.hrs && sum(per, (x) => x[2]) === DAYS && per[per.length - 1][0] === c.day, c.n + " hours by budget"); }
const CAMPAIGN_COUNT = 24, capped = CAMPAIGNS.filter((c) => c.hrs);
const shownSpend = sum(CAMPAIGNS, (c) => c.spend), spendShare = Math.round((100 * shownSpend) / AMZ.spend);
check(shownSpend < AMZ.spend && sum(CAMPAIGNS, (c) => c.sales) < AMZ.adSales && spendShare === 80, "campaigns against the Amazon totals");
check(CAMPAIGNS.every((c) => !c.day || c.spend <= c.day * DAYS) && capped.find((c) => c.day === 280).spend <= 250 * 18 + 280 * 5, "spend within daily budgets (the video budget went from $250 to $280 on Oct 19)");
const cappedHrs = sum(capped, (c) => c.hrs), cappedMissed = sum(capped, (c) => c.missed);
check(capped.length === 3 && cappedHrs === 89 && cappedMissed === 4930 && capped.find((c) => c.day === 280).missed === 1770, "campaigns out of budget");
const rRange = `${Math.min(...capped.map((c) => c.roas)).toFixed(2)}x to ${Math.max(...capped.map((c) => c.roas)).toFixed(2)}x`;
check(rRange === "4.06x to 5.21x", "returns of the campaigns out of budget");

// keywords in the three keyword campaigns: keyword, match type, campaign, bid, spend, ad sales,
// top-of-search impression share, next step, and the day it was added if that was this month. Each
// campaign's keywords stay within its totals. A keyword that ran all month spent at least what any
// search term it matched did (Search terms tab); one added this month has only its days since.
const KEYWORDS = [
  ["vitamin c serum", "phrase", 0, 2.2, 5860, 33990, 38, "Bid raised 10% Oct 20"],
  ["vitamin c", "broad", 0, 1.65, 3540, 19120, 22, ""],
  ["vitamin c serum for face", "exact", 0, 2.45, 260, 1790, 41, "Added from search terms", "Oct 22"],
  ["retinol serum", "phrase", 1, 2.4, 4310, 23060, 35, "Cap lift awaiting your decision"],
  ["retinol", "broad", 1, 1.8, 2980, 15200, 18, "Cap lift awaiting your decision"],
  ["night cream", "phrase", 2, 1.95, 3880, 20560, 31, ""],
  ["anti aging night cream", "broad", 2, 1.7, 1710, 7950, 14, ""],
  ["night cream for face", "exact", 2, 2.05, 1260, 6690, 29, "Top-of-search adjustment Oct 19"],
  ["night cream for dry skin", "phrase", 2, 1.85, 120, 500, 24, "Added from search terms", "Oct 21"],
];
for (let k = 0; k < 3; k++) { const c = CAMPAIGNS[k], ks = KEYWORDS.filter((x) => x[2] === k); check(ks.length && sum(ks, (x) => x[4]) <= c.spend && sum(ks, (x) => x[5]) <= c.sales, c.n + " keywords within the campaign"); }
check(KEYWORDS.filter((k) => k[8]).length === 2 && KEYWORDS.filter((k) => k[8]).every((k) => date(-7) <= k[8] && k[8] < "Oct 24"), "keywords added this week (Oct 17 to 23)");
const kwSpend = sum(KEYWORDS, (x) => x[4]), kwCampSpend = sum(CAMPAIGNS.slice(0, 3), (c) => c.spend), kwShare = Math.round((100 * kwSpend) / kwCampSpend);
check(kwSpend === 23920 && kwCampSpend === 27270 && kwShare === 88, "keywords against the keyword campaigns' spend");
// a keyword added this month: its spend is no more than its days at the campaign's daily budget
check(KEYWORDS.filter((x) => x[8]).every((x) => x[4] <= (CAMPAIGNS[x[2]].day * (Date.UTC(2026, 9, DAYS) - Date.UTC(2026, 9, +x[8].split(" ")[1] - 1)) / 864e5) && x[4] < 0.1 * CAMPAIGNS[x[2]].spend), "keywords added this month");
// Sponsored Products placements for the five Sponsored Products campaigns shown
const SPC = CAMPAIGNS.filter((c) => c.type.startsWith("Sponsored Products"));
const PLACES = [["Top of search, first page", 40, 19940, 118430, "Hold the +40%"], ["Rest of search", 0, 9860, 39050, "No change"], ["Product pages", 0, 6110, 25720, "Test +15%, proposed for Oct 28"]];
check(SPC.length === 5 && sum(PLACES, (x) => x[2]) === sum(SPC, (c) => c.spend) && sum(PLACES, (x) => x[3]) === sum(SPC, (c) => c.sales), "placements against the Sponsored Products campaigns");

// ---- the two recommendations on the Amazon gap, sized to what was missed ------------------------------
const REST = 7; // Oct 25 to 31, once agreed on Oct 24
// each campaign's recent rate of hours lost (the video's since its raise), over seven days, at today's budget
const fwd = (c) => { const per = PERIODS[c.n], [b, h, d] = per[per.length - 1]; return ((h / d) * REST * b) / 24; };
const lift = { spend: r10(sum(capped, fwd)), sales: r100(sum(capped, (c) => fwd(c) * c.roas)) };
check(lift.spend === 320 && lift.sales === 1500, "the budget lift is sized to the hours being missed");
// a 10% coupon on the vitamin C serum for Oct 27 to 31, at the lift and redemption the September one
// had. "Sales during" means the same in both: all of the product's sales on the promotion's days, before
// the discount. September's coupon ran Sep 8 to 21, 14 of the 23 days Sep 1 to 23, at +14% on the days
// without it; the October base is the product's daily average to date.
const vc = PRODUCTS[4], eye = PRODUCTS[3];
const SEPC = { days: 14, lift: 14, redeem: 0.3 }; // 30% of sales during used the coupon
SEPC.base = vc.sales / (1 + vc.chg / 100) / (DAYS - SEPC.days + SEPC.days * (1 + SEPC.lift / 100));
// Amazon's coupon fee, as used here: $5 per coupon plus 2.5% of the sales that used it (to $10)
const couponFee = (sales, redeem) => r10(5 + 0.025 * sales * redeem);
SEPC.sales = r100(SEPC.days * SEPC.base * (1 + SEPC.lift / 100)); SEPC.discount = r100(SEPC.sales * 0.1 * SEPC.redeem); SEPC.fee = couponFee(SEPC.sales, SEPC.redeem); SEPC.cost = SEPC.discount + SEPC.fee;
check(SEPC.sales === 146900 && SEPC.discount === 4400 && SEPC.fee === 1110 && SEPC.cost === 5510 && near(SEPC.sales / SEPC.days, (vc.sales / (1 + vc.chg / 100) / DAYS) * 1.04, 0.02), "September's coupon against the product's September sales");
const coupon = { days: 5, base: (vc.sales / DAYS) * 5 };
coupon.sales = coupon.base * (1 + SEPC.lift / 100); coupon.more = r100(coupon.sales - coupon.base); coupon.discount = r100(coupon.sales * 0.1 * SEPC.redeem); coupon.fee = couponFee(coupon.sales, SEPC.redeem); coupon.cost = coupon.discount + coupon.fee;
check(coupon.more === 8000 && coupon.discount === 2000 && coupon.fee === 490 && coupon.cost === 2490 && near(coupon.sales / coupon.days / (SEPC.sales / SEPC.days), vc.sales / DAYS / SEPC.base, 0.01), "the coupon recommendation, on the same basis as September's");
// each decision in contribution after product cost: extra sales less Amazon's fees and refunds (their
// share of Amazon sales) and product cost (22% of selling price, from the brand's cost file), less the
// extra ad spend or discounts
const PCOST = 0.22, margin = 1 - (COSTS.referral + COSTS.fulfilment + COSTS.refunds) / AMZ.sales - PCOST;
lift.contrib = r100(lift.sales * margin - lift.spend); coupon.contrib = r100(coupon.more * margin - coupon.cost);
check(Math.round(100 * margin) === 49 && (100 * (1 - PCOST - margin)).toFixed(1) === "28.8" && margin.toFixed(3) === "0.492" && lift.contrib === 400 && coupon.contrib === 1400, "the decisions in contribution");
const recovered = lift.sales + coupon.more;
check(recovered === 9500 && recovered < amzGap, "the recommendations against the gap");
// the retinol order protects December: a week of its forecast sales, and their contribution
const retinolDec = r100((retinol.units / DAYS) * retinol.q4[1] * 7 * (retinol.sales / retinol.units)), retinolDecC = r100(retinolDec * margin);
check(retinolDec === 51200 && retinolDecC === 25200, "what the retinol order protects");

// ---- promotions: what ran, what is running, what is proposed or booked --------------------------------
// Amazon's fee for the two-day Prime Big Deal Days deal
// estimated as $70 a day plus 1% of the deal's sales
const dealFee = (days, sales) => days * 70 + r10(0.01 * sales), DEAL_FEE = dealFee(2, 36000);
check(DEAL_FEE === 500, "the deal fee");
const PROMOS = [
  { id: "kq-pt-pr-new", n: "Coupon, 10% off", what: "Vitamin C serum", when: "Oct 27 to 31", sales: `${usd(r100(coupon.sales))} est.`, sv: coupon.sales, lift: `+${SEPC.lift}% est.`, lv: SEPC.lift, cost: `${usd(coupon.cost)} est.`, cv: coupon.cost, dis: coupon.discount, fee: coupon.fee, st: ["warn", "Proposed"], note: "awaiting your decision, by Oct 25" },
  { n: "Prime Big Deal Days, 20% off", what: "Night cream, eye cream", when: "Oct 7 to 8", sales: usd(36000), sv: 36000, lift: "+84%", lv: 84, cost: usd(7200 + DEAL_FEE), cv: 7200 + DEAL_FEE, dis: 7200, fee: DEAL_FEE, st: ["flat", "Ended"], note: "deal on both products" },
  { n: "Subscribe and Save, extra 5%", what: "Subscription orders, six products", when: "Oct 1 to 31", sales: usd(53200), sv: 53200, lift: "Not measured", lv: -1, cost: usd(2660), cv: 2660, dis: 2660, fee: 0, st: ["good", "Running"], note: "sales and cost to Oct 23" },
  { n: "Coupon, 10% off", what: "Vitamin C serum", when: "Sep 8 to 21", sales: usd(SEPC.sales), sv: SEPC.sales, lift: `+${SEPC.lift}%`, lv: SEPC.lift, cost: usd(SEPC.cost), cv: SEPC.cost, dis: SEPC.discount, fee: SEPC.fee, st: ["flat", "Ended"], note: `the basis for the proposal; ${pct(100 * SEPC.redeem, 0)}&nbsp;redeemed` },
  { n: "Coupon, 15% off", what: "Gift set", when: "Nov 13 to Dec 2", sales: "Not started", sv: 0, lift: "Not started", lv: -1, cost: "Not started", cv: 0, st: ["good", "Booked"], note: "in the holiday plan; starts once the listing is back" },
  { n: "Prime exclusive discount, 15% off", what: "Night cream", when: "Nov 20 to 26", sales: "Not started", sv: 0, lift: "Not started", lv: -1, cost: "Not started", cv: 0, st: ["good", "Booked"], note: "in the holiday plan" },
  { n: "Black Friday deal, 20% off", what: "Vitamin C serum, foaming cleanser", when: "Nov 27 to Dec 1", sales: "Not started", sv: 0, lift: "Not started", lv: -1, cost: "Not started", cv: 0, st: ["good", "Booked"], note: "in the holiday plan" },
];
const PROMO_DATES = [["Oct 27", "Oct 31"], ["Oct 7", "Oct 8"], ["Oct 1", "Oct 31"], ["Sep 8", "Sep 21"], ["Nov 13", "Dec 2"], ["Nov 20", "Nov 26"], ["Nov 27", "Dec 1"]];
check(PROMOS.every((x, i) => x.when === (PROMO_DATES[i][0].split(" ")[0] === PROMO_DATES[i][1].split(" ")[0] ? PROMO_DATES[i][0] + " to " + PROMO_DATES[i][1].split(" ")[1] : PROMO_DATES[i][0] + " to " + PROMO_DATES[i][1])), "promotion dates");
// a promotion's cost is its discount on the sales during it, before the discount (as in Total sales)
check(Math.round(36000 * 0.2) === 7200 && Math.round(53200 * 0.05) === 2660 && 7200 + DEAL_FEE + 2660 === COSTS.promotions, "October promotion costs (discounts and the deal fee) against contribution");
check(near((BDD_EXTRA * 2 + 19560) / 19560 - 1, 0.84, 0.01) && 36000 - 19560 === 2 * BDD_EXTRA, "the deal's lift and its extra sales by day");

// ---- search terms the team acted on (search share is Brand Analytics, week to Oct 17) -----------------
const TERMS = [
  ["vitamin c serum for face", 8.4, 9.1, 1840, 6.75, "Moved to exact match", "Retail Media and Advertising", "done Oct 22"],
  ["vitamin c serum", 6.1, 6.8, 2310, 5.12, "Bid raised 10%", "Retail Media and Advertising", "done Oct 20"],
  ["retinol serum", 4.9, 5.3, 2950, 5.48, "Budget cap lift", "Retail Media and Advertising", "awaiting your decision"],
  ["night cream for face", 3.7, 4.2, 1260, 5.31, "Top-of-search bid adjustment", "Retail Media and Advertising", "done Oct 19"],
  ["foaming face cleanser", 3.1, 3.6, 860, 4.41, "Auto close-match bid raised 10%", "Retail Media and Advertising", "done Oct 18"],
  ["mineral sunscreen for face", 2.6, 2.1, 980, 2.94, "Ads paused with the listing", "Retail Media and Advertising", "paused Oct 21; resume when reinstated"],
  ["eye cream for dark circles", 1.8, 1.5, 520, 3.1, "Hold until the bullet fix", "Marketplace Operations", "review Oct 28"],
  ["night cream for dry skin", 1.4, 1.9, 430, 3.95, "Moved to phrase match", "Retail Media and Advertising", "done Oct 21"],
  ["sunscreen spf 50 face", 0.9, 0.3, 640, 0.64, "Added as a negative", "Retail Media and Advertising", "done Oct 20"],
];
const TERM_COUNT = 412;
const matches = ([kw, m], t) => t[0] === kw || (m !== "exact" && t[0].includes(kw));
check(KEYWORDS.filter((k) => !k[8]).every((k) => TERMS.filter((t) => matches(k, t)).every((t) => t[3] <= k[4])) && near(6690 / 1260, 5.31, 0.002), "keywords that ran all month against the search terms they matched");
check(TERMS.every((t) => { const ks = KEYWORDS.filter((k) => matches(k, t)); return !ks.length || t[3] <= sum(ks, (k) => k[4]); }), "each search term's spend within the keywords that matched it");
// every search term moved to a match type is in the Keywords view, added on the day the action was done
check(TERMS.filter((t) => /^Moved to (exact|phrase) match$/.test(t[5])).every((t) => KEYWORDS.some((k) => k[0] === t[0] && t[5] === `Moved to ${k[1]} match` && t[7] === "done " + k[8])) && !TERMS.some((t) => /as an? (exact|phrase|broad) keyword/i.test(t[5])), "search-term actions against the Keywords view");

// ---- Walmart items, Oct 1 to 22 ---------------------------------------------------------------------
// sales, Buy Box win rate, listing quality score, Walmart Fulfillment Services weeks of cover (with inbound)
const WM = [
  ["Vitamin C serum", 71400, 98.1, 92, 9.4],
  ["Retinol serum", 46200, 96.4, 88, 3.1, "WFS inbound booked for Oct 28", 2070],
  ["Mineral sunscreen", 38900, 91.2, 74, 4.0, "WFS inbound booked for Oct 28", 2120],
  ["Night cream", 33100, 99.0, 90, 10.2],
  ["Foaming cleanser", 21800, 97.5, 85, 8.6],
];
// Walmart weekly units are estimated: Walmart sales ÷ 22 days × 7 ÷ the product's average Amazon price
// (Walmart's units are not in the data warehouse yet). Weeks of cover: units on hand ÷ weekly units; a
// low item's last field is its units inbound on Oct 28, and with them, (on hand + inbound) ÷ weekly units
const wmPrice = (w) => { const p = PRODUCTS.find((x) => x.n === w[0]); return p.sales / p.units; };
const wmWk = (w) => Math.round(((w[1] / 22) * 7) / wmPrice(w));
const wmAfter = (w) => w[4] + w[6] / wmWk(w);
check(wmWk(WM[1]) === 350 && wmWk(WM[2]) === 442 && WM.every((w) => wmWk(w) > 0) && wmAfter(WM[1]).toFixed(1) === "9.0" && wmAfter(WM[2]).toFixed(1) === "8.8", "Walmart weekly units (at Amazon's average price) and cover with the inbound");
const WMADS = [["Sponsored Products, keyword", 7810, 30460], ["Sponsored Products, automatic", 6240, 21840], ["Sponsored Brands", 2950, 8850], ["Display", 1900, 5567]];
const WMLQ = [["Mineral sunscreen", "Score 74: three of five recommended images; SPF value missing", "Creative Studio, due Oct 30"], ["Foaming cleanser", "Score 85: title over Walmart’s 75 characters", "<span class=\"w\">Marketplace </span>Operations, due Oct 28"], ["Retinol serum", "Score 88: two attributes missing", "<span class=\"w\">Marketplace </span>Operations, due Oct 31"]];
check(sum(WMADS, (a) => a[1]) === CH[1].spend && sum(WMADS, (a) => a[2]) === CH[1].adSales, "Walmart Connect against the Walmart totals");
const wmWeekly = r100(sum(WM.filter((w) => w[4] < COVER[0]), (w) => (w[1] / 22) * 7)), wmShown = sum(WM, (w) => w[1]), wmShare = Math.round((100 * wmShown) / CH[1].sales), wmLow = WM.filter((w) => w[4] < COVER[0]);
check(WMLQ.every(([n, d]) => d.startsWith("Score " + WM.find((w) => w[0] === n)[3])), "listing quality scores") ; check(wmShown < CH[1].sales && wmShare === 93 && wmLow.length === 2 && wmLow.every((w) => w[5] && wmAfter(w) >= COVER[0] && wmAfter(w) <= COVER[1]), "Walmart items: the booked inbound brings the two low items back into the target");

const TAB_NAMES = ["Products", "Advertising", "Search terms", "Inventory", "Returns and repeat", "Promotions", "Account health"];
const TAB_KEYS = ["products", "advertising", "search-terms", "inventory", "returns", "promotions", "health"];
const hashOf = (name) => "portal-ops-" + TAB_KEYS[TAB_NAMES.indexOf(name)];

// a small line for eight weekly values: the mockups' blue, a dot on the latest week. It stretches
// to the room it has; the strokes do not scale, so the dot stays round.
function spark(v) {
  const W = 92, H = 30, pad = 4, lo = Math.min(...v), hi = Math.max(...v), sp = hi - lo || 1;
  const pts = v.map((y, i) => [pad + (i * (W - 2 * pad)) / (v.length - 1), H - pad - ((y - lo) / sp) * (H - 2 * pad)]);
  const d = pts.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" "), last = pts[pts.length - 1].map((n) => n.toFixed(1));
  return `<svg class="kq-pt-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="#00618D" stroke-linecap="round" stroke-linejoin="round"><path d="${d}" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="M${last[0]} ${last[1]}h0" stroke="#FFFFFF" stroke-width="12" vector-effect="non-scaling-stroke"/><path d="M${last[0]} ${last[1]}h0" stroke-width="8" vector-effect="non-scaling-stroke"/></svg>`;
}

// the side menu's icons, one per entry as in the mockups (16px, 1.5px strokes)
const svg = (d) => `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  grid: svg('<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>'),
  bag: svg('<path d="M3 5.5h10l-.8 8H3.8z"/><path d="M5.5 5.5V4.5a2.5 2.5 0 0 1 5 0v1"/>'),
  list: svg('<path d="M5.5 4h8M5.5 8h8M5.5 12h8"/><path d="M2.5 4h.01M2.5 8h.01M2.5 12h.01"/>'),
  bars: svg('<path d="M3.5 13V8M8 13V3M12.5 13V6"/>'),
  horn: svg('<path d="M2.5 6.5v3h2.5l5 3v-9l-5 3z"/><path d="M12.5 6.5a2 2 0 0 1 0 3"/>'),
  cloud: svg('<path d="M4.5 12.5a3 3 0 0 1-.3-6 4 4 0 0 1 7.6 1 2.5 2.5 0 0 1-.3 5z"/>'),
  box: svg('<path d="M2.5 5 8 2.5 13.5 5v6L8 13.5 2.5 11z"/><path d="M2.5 5 8 7.5 13.5 5M8 7.5v6"/>'),
  fees: svg('<rect x="3" y="2.5" width="10" height="11" rx="1"/><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"/>'),
  star: svg('<path d="M8 2.5v11M3.2 5.2l9.6 5.6M3.2 10.8l9.6-5.6"/>'),
  target: svg('<circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="8" r="2"/>'),
  doc: svg('<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M9.5 2.5V5H12M6 8.5h4M6 11h4"/>'),
  chat: svg('<path d="M2.5 3.5h11v7.5H7l-3 2.5V11H2.5z"/>'),
  bell: svg('<path d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>'),
  book: svg('<path d="M3 3h4a1 1 0 0 1 1 1v9.5a1 1 0 0 0-1-1H3zM13 3H9a1 1 0 0 0-1 1v9.5a1 1 0 0 1 1-1h4z"/>'),
  gear: svg('<circle cx="8" cy="8" r="2"/><path d="M8 2.5v1.6M8 11.9v1.6M2.5 8h1.6M11.9 8h1.6M4.1 4.1l1.1 1.1M10.8 10.8l1.1 1.1M4.1 11.9l1.1-1.1M10.8 5.2l1.1-1.1"/>'),
  team: svg('<circle cx="6" cy="6" r="2"/><circle cx="11" cy="6.5" r="1.6"/><path d="M2.5 12.5a3.5 3.5 0 0 1 7 0M9.5 12.2a3 3 0 0 1 4-1.9"/>'),
};
const SEARCH = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>';
const RMA = `<span class="w">Retail Media and </span>Advertising`, MO = `<span class="w">Marketplace </span>Operations`;

// controls the script switches on (all written disabled, and hidden until the script runs)
// a button that opens the place in the example where the detail is: "hash target"
const go = (label, hash, target, about) => `<button type="button" class="go hit js" data-go="${hash} ${target}" disabled>${label}<span class="sr"> ${about}</span> <span aria-hidden="true">→</span></button>`;
const exportBtn = (what, label = "Export CSV") => `<button type="button" class="kq-pt-btn js" data-csv="${what}" disabled>${label}</button>`;
// a table inside its own scroll region, so a narrow screen can scroll it sideways with every column kept
// each table carries the file name its CSV gets; each header and cell can carry its CSV columns
// (data-h, data-c: plain values, "|" between columns), so the export is not scraped from formatted text
const plain = (h) => String(h).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const attr = (k, a) => (a ? ` ${k}="${a.map((x) => plain(x)).join("|").replace(/"/g, "&quot;")}"` : "");
const tbl = (id, caption, head, body, cls = "", file = "") => `<div class="kq-pt-scroll" role="region" id="${id}-r" aria-labelledby="${id}" tabindex="0"><table class="${cls}" id="${id}-t"${file ? ` data-file="${file}"` : ""}><caption id="${id}" class="sr">${caption}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
const th = (label, small, sort = true, cls = "num", h) => `<th scope="col" class="${cls}"${sort ? ' aria-sort="none"' : ""}${attr("data-h", h)}>${sort ? `<button type="button" disabled><span>${label} <i aria-hidden="true"></i></span>${small ? `<small>${small}</small>` : ""}</button>` : `${label}${small ? `<small>${small}</small>` : ""}`}</th>`;
const td = (v, a, b, cls = "num", c = [v]) => `<td class="${cls}" data-v="${v}"${attr("data-c", c)}>${a}${b === undefined ? "" : `<small>${b}</small>`}</td>`;
const f1 = (n) => n.toFixed(1), f2 = (n) => n.toFixed(2);
const HINT = `<p class="kq-pt-hint">Scroll<span class="w"> the table</span> sideways<span class="w"> to see every column</span>.</p>`;
const pill = (k, t) => `<span class="pill ${k}">${t}</span>`;
// definitions: always shown on a wide screen; on a phone the script folds them behind a button
let defN = 0;
const fold = (label, html, tag = "p", cls = "kq-pt-note") => { const id = "kq-pt-df" + ++defN; return `<button type="button" class="kq-pt-dfb js" aria-expanded="false" aria-controls="${id}" disabled>${label}</button><${tag} class="${cls} kq-pt-df" id="${id}">${html}</${tag}>`; };
const defs = (html, cls) => fold("Definitions", html, "p", cls);
// a heading that becomes a disclosure button on a phone (with the script): the heading stays a heading
const foldHead = (text, small = "", nw = "") => { const id = "kq-pt-df" + ++defN; return [`<h4 class="kq-pt-h2"><span class="fh${nw}">${text}${small}</span><button type="button" class="kq-pt-dfb hd js${nw}"${nw ? ' data-narrow=""' : ""} aria-expanded="false" aria-controls="${id}" disabled>${text}</button></h4>`, id]; };
// the "Data as of" stamp: the time, then each source's date in a panel the script opens
const FRESH = [["Amazon sales and traffic", "to Oct 23"], ["Amazon ads", "to Oct 23; the last 14 days are provisional"], ["Amazon search share (Brand Analytics)", "week to Oct 17"], ["Amazon inventory and shipments", INV_ASOF], ["Walmart", "to Oct 22"], ["Target Plus", "to Oct 22, uploaded by hand: no feed yet"]];
const stamp = (n, line2) => `<div class="kq-pt-stamp"><span class="kq-pt-asof" data-pop="kq-pt-fr${n}">Data as of ${ASOF}</span><span>${line2}</span><div class="kq-pt-pop" id="kq-pt-fr${n}" hidden><p class="at">Freshness by source</p><ul>${FRESH.map(([a, b]) => `<li><span>${a}</span><small>${b}</small></li>`).join("")}</ul></div></div>`;

export function portalSection({ section, two, H2, P }) {
  defN = 0;
  // the mockups' side menu: [label, icon, a sub-entry, the entry each screen highlights]
  const NAV = [["Overview", "grid", 0, "n1"], ["Channels"], ["Amazon", "bag"], ["Products", "list", 1], ["Sales", "bars", 1], ["Advertising", "horn", 1], ["Marketing Cloud", "cloud", 1], ["Operations", "box", 1, "n2"], ["Fees and contribution", "fees", 1], ["Walmart", "star", 0, "n3"], ["Target Plus", "target", 0, "n4"], ["Your account"], ["Reports and forecasts", "doc"], ["Call notes and projects", "chat"], ["Alerts and notifications", "bell"], ["Definitions", "book"], ["Team and access", "team"], ["Account settings", "gear"]];
  const side = `<div class="kq-pt-side" aria-hidden="true"><p class="kq-pt-brand"><b>KWONTIFIED</b><span>Client portal</span></p>${NAV.map(([label, icon, sub, cls]) => (!icon ? `<p class="kq-pt-grp">${label}</p>` : `<p class="kq-pt-nv${sub ? " sub" : ""}${cls ? " " + cls : ""}">${ICON[icon]}<span>${label}</span></p>`)).join("")}<p class="kq-pt-usr"><i>SU</i><span>Sample user</span></p></div>`;
  const top = `<div class="kq-pt-top"><p class="kq-pt-search" aria-hidden="true">${SEARCH}Search dashboards, products and reports</p><p class="kq-pt-tag">Illustrative example</p><p class="kq-pt-scope">Sample<span class="xw"> skincare</span> brand</p></div>`;

  // ---- screen 1: Overview, for an executive ---------------------------------------------------
  const KPIS = [
    ["Total sales", usd(ALL.sales), ["+8.3%", "pos"], ["+21.6%", "pos"], WK.sales],
    ["Ad spend", usd(ALL.spend), ["+8.4%", "mut"], ["+17.9%", "mut"], WK.spend],
    ["ROAS", roas.toFixed(2) + "x", ["+1.7%", "pos"], ["+3.1%", "pos"], WK.roas],
    ["TACoS", tacos.toFixed(1) + "%", ["+0.0 pts", "mut"], ["−0.3 pts", "pos"], WK.tacos],
    ["Contribution", usd(ALL.contrib), ["+7.4%", "pos"], ["+20.3%", "pos"], WK.contrib],
  ];
  const kstrip = `<p class="kq-pt-kkey n">Change vs Sep 1 to 23 · vs 2025</p><ul class="kq-pt-card kq-pt-kstrip">${KPIS.map(([l, v, a, b, s]) => `<li><p class="kl">${l}</p><div class="kr"><p class="kv">${v}</p>${spark(s)}</div><p class="kd"><span class="${a[1]}">${a[0]}</span> <span class="mut w">vs Sep 1 to 23</span></p><p class="kd"><span class="n mut">· </span><span class="${b[1]}">${b[0]}</span> <span class="mut w">vs Oct 1 to 23, 2025</span></p></li>`).join("")}</ul>
${defs(`<b>Total sales</b> ordered sales before refunds. <b>Ad spend</b> Amazon ads and DSP, Walmart Connect, Target Roundel. <b>ROAS</b> ad-attributed sales ÷ ad spend. <b>TACoS</b> ad spend ÷ total sales. <b>Contribution</b> sales less refunds, marketplace fees, promotions, fulfilment and ad spend, before product cost (${allShare}% of sales; by channel below). Lines: the eight weeks to Oct 19.<span class="n"> <b>A week</b> (Needs attention) average weekly sales, Oct 1 to 23, of what is affected (a suppressed listing: while it was listed).</span>`, "kq-pt-defs")}`;

  const SCALE = 1.1; // the bars run to 110% of goal, so a forecast above goal still fits
  const status = (c) => { const gap = c.fc - c.goal; return Math.abs(gap) / c.goal < ON_GOAL ? pill("flat", "On goal") : gap < 0 ? pill("warn", `${usd(-gap)} short`) : pill("good", `${usd(gap)} ahead`); };
  const gbar = (c) => { const w = (v) => ((100 * v) / c.goal / SCALE).toFixed(1); return `<span class="gb" aria-hidden="true"><i class="f" style="width:${w(c.fc)}%"></i><i class="a" style="width:${w(c.sales)}%"></i><i class="g" style="left:${(100 / SCALE).toFixed(1)}%"></i></span>`; };
  const chRow = (c, total) => `<tr${total ? ' class="tot"' : ""}><th scope="row"${attr("data-c", [c.n, c.thru ? iso(c.thru) : ""])}>${c.n}<span class="sp" aria-hidden="true">${status(c)}<span class="sg">${pct((100 * c.fc) / c.goal)}</span></span><small>${c.thru ? `to ${c.thru}` : "combined"}</small></th><td class="num"${attr("data-c", [c.fc, c.lo, c.hi])}><strong>${usd(c.fc)}</strong><small>${usd(c.lo)} to ${usd(c.hi)}</small></td><td class="gl"${attr("data-c", [c.goal, f1((100 * c.fc) / c.goal), Math.abs(c.fc - c.goal) / c.goal < ON_GOAL ? "On goal" : c.fc < c.goal ? "Short" : "Ahead", c.fc - c.goal])}><span class="gt">${status(c)} <small>${pct((100 * c.fc) / c.goal)} of ${usd(c.goal)}</small></span>${gbar(c)}</td><td class="num"${attr("data-c", [c.sales])}>${usd(c.sales)}</td><td class="num"${attr("data-c", [c.contrib, f1((100 * c.contrib) / c.sales)])}>${usd(c.contrib)}<small>${pct((100 * c.contrib) / c.sales)} of sales</small></td><td class="num"${attr("data-c", [c.spend, c.plan])}>${usd(c.spend)}<small>${pct((100 * c.spend) / c.plan, 0)} of ${usd(c.plan)}</small></td><td class="num"${attr("data-c", [f2(c.adSales / c.spend)])}>${(c.adSales / c.spend).toFixed(2)}x</td><td class="num"${attr("data-c", [f1((100 * c.spend) / c.sales)])}>${pct((100 * c.spend) / c.sales)}</td></tr>`;
  const chHead = (per) => th("Channel", `<span class="n">status, forecast ÷ goal</span>`, false, "", ["Channel", "Data through"]) + th("Forecast", `likely range, to ${per === "q" ? "Dec" : "Oct"} 31`, false, "num", ["Forecast (USD)", "Likely low (USD)", "Likely high (USD)"]) + th("Against goal", `forecast ÷ ${per === "q" ? "Q4" : "October"} goal`, false, "gl", [`${per === "q" ? "Q4" : "October"} goal (USD)`, "Forecast of goal (%)", "Status", "Forecast less goal (USD)"]) + th("Sales to date", "", false, "num", ["Sales to date (USD)"]) + th("Contribution", "to date", false, "num", ["Contribution to date (USD)", "Contribution share of sales (%)"]) + th("Ad spend", `of ${per === "q" ? "Q4" : "October"} plan`, false, "num", ["Ad spend to date (USD)", `${per === "q" ? "Q4" : "October"} ad plan (USD)`]) + th("ROAS", "", false) + th("TACoS", "", false, "num", ["TACoS (%)"]);
  const PER = [["m", "October"], ["q", "Q4"]];
  const perSeg = `<div class="kq-pt-seg kq-pt-perseg" role="radiogroup" aria-label="Period">${PER.map(([k, t], i) => `<span class="o"><input type="radio" name="kq-pt-per" id="kq-pt-p${k}" value="${k}"${i ? "" : " checked"}><label for="kq-pt-p${k}">${t}</label></span>`).join("")}</div>`;
  const channels = `<div class="kq-pt-card"><div class="kq-pt-chead"><h4 class="kq-pt-h2">By channel <small class="w">forecast against goal, then the period so far</small></h4>${perSeg}<p class="kq-pt-leg" aria-hidden="true"><span><i class="a"></i>Sales to date</span><span><i class="f"></i>Forecast</span><span><i class="g"></i>Goal</span></p>${exportBtn("kq-pt-chs")}</div>`
    + `<div class="kq-pt-pers" id="kq-pt-chs"><div class="kq-pt-per kq-pt-per-m">` + tbl("kq-pt-ch", "October by channel: forecast against goal, sales and contribution to date, ad spend against plan, ROAS and TACoS",
      chHead("m"), CH.map((c) => chRow(c)).join("") + chRow(ALL, true), "plain chan", "channels-october") + `</div><div class="kq-pt-per kq-pt-per-q">`
    + tbl("kq-pt-cq", "Q4 by channel, Oct 1 to Dec 31: forecast against goal, sales and contribution to date, ad spend against plan, ROAS and TACoS",
      chHead("q"), CHQ.map((c) => chRow(c)).join("") + chRow(ALLQ, true), "plain chan", "channels-q4") + `</div></div><p class="kq-pt-hint ph">Amazon to ${AMZ.thru}, others ${CH[1].thru}<span class="w">. Scroll sideways</span>.</p>`
    + defs(`<b>Forecast</b> to month or quarter end, made each morning: the rest of October at the last seven days’ level by day of week, with booked promotions, before the recommendations; Amazon’s leaves suppressed listings out. <b>Likely range</b> four times in five. <b>On goal</b> within 0.25%. <b>Plan</b> the agreed ad budget. <b>Q4</b> began Oct 1 (${pct((100 * DAYS) / QDAYS, 0)} passed), so to date is October’s; November and December goals and plans are the holiday plan’s. Their forecast: Walmart and Target Plus from the holiday plan; Amazon each product’s daily sales (while listed) × its season, with booked promotions, so the suppressed listings are back by Nov 1, as in the stock plan. <b>Contribution</b> for Target Plus uses the weekly upload and your 3PL’s invoices. The last 14 days’ ad sales are provisional.`) + `</div>`;

  // sales by day, stacked by channel in the mockups' three blues, with a 2px gap between segments. The
  // mockups' Day/Week switch is left out: the eight weekly values are already the KPI lines above, so a
  // week mode would add a control without a new figure
  const MAXD = 75000, TICKS = [0, 25000, 50000, 75000];
  const CHC = ["c0", "c1", "c2"];
  const cols = Array.from({ length: DAYS }, (_, d) => {
    const segs = DAILY.map((v, i) => (v[d] ? `<i class="${CHC[i]}" style="height:${((100 * v[d]) / MAXD).toFixed(2)}%"></i>` : "")).join("");
    const all = DAILY.every((v) => v[d]), tip = [`Oct ${d + 1}`, ...DAILY.map((v, i) => `${i} ${CH[i].n} ${v[d] ? usd(v[d]) : "not yet reported"}`), `${all ? "Total" : "Total so far"} ${usd(dayTotal(d))}`].join("|");
    return `<span class="col" data-tip="${tip}">${segs}</span>`;
  }).join("");
  const [dayHead, dayId] = foldHead("Sales by day", `<small class="w">by week: the lines above</small>`);
  const daily = `<div class="kq-pt-card kq-pt-daily"><div class="kq-pt-chead">${dayHead}<p class="kq-pt-leg" aria-hidden="true">${CH.map((c, i) => `<span><i class="${CHC[i]}"></i>${c.n}</span>`).join("")}</p>${exportBtn("kq-pt-dd-t")}</div>
<div class="kq-pt-df" id="${dayId}"><div class="kq-pt-bars" aria-hidden="true"><span class="ax" aria-hidden="true">${TICKS.map((t) => `<span style="bottom:${((100 * t) / MAXD).toFixed(1)}%"><small>${t ? t / 1000 + "K" : "0"}</small></span>`).join("")}</span><span class="cols">${cols}<span class="tip" hidden></span></span><span class="xl" aria-hidden="true"><small>Oct 1</small><small>Oct 7 and 8<span class="w">: Prime Big Deal Days</span></small><small>Oct 23<span class="w">: Amazon only</span></small></span></div>
</div><table class="sr" id="kq-pt-dd-t" data-file="sales-by-day"><caption>Sales by day and channel, Oct 1 to 23</caption><thead><tr><th scope="col" data-h="Date">Day</th>${CH.map((c) => `<th scope="col" data-h="${c.n} (USD)">${c.n}</th>`).join("")}<th scope="col" data-h="Total reported (USD)">Total</th></tr></thead><tbody>${Array.from({ length: DAYS }, (_, d) => `<tr><th scope="row" data-c="${iso("Oct " + (d + 1))}">Oct ${d + 1}</th>${DAILY.map((v) => `<td data-c="${v[d] || ""}">${v[d] ? usd(v[d]) : "not yet reported"}</td>`).join("")}<td data-c="${dayTotal(d)}">${usd(dayTotal(d))}${DAILY.every((v) => v[d]) ? "" : " so far"}</td></tr>`).join("")}</tbody></table></div>`;

  const LOG = [["Oct 22", RMA, "38 negative search terms added, one moved to exact match"], ["Oct 21", "Call note", "Weekly review: notes and six action items posted"], ["Oct 20", "Creative Studio", "Corrected gift set main image filed with Amazon"]];
  const [teamHead, teamId] = foldHead("From your team this week");
  const team = `<div class="kq-pt-team kq-pt-log">${teamHead}<ul class="kq-pt-df" id="${teamId}">${LOG.map(([dt, who, t]) => `<li><small>${dt} · ${who}</small><span>${t}</span></li>`).join("")}</ul></div>`;
  const DECISIONS = [
    { t: `Lift the budget caps on ${word(capped.length)} campaigns, Oct 25 to 31`, d: `${cappedHrs} campaign-hours lost: +${usd(lift.spend)} spend, +${usd(lift.sales)} sales, +${usd(lift.contrib)} contribution.`, who: RMA, by: "Oct 24", go: go("Campaigns", hashOf("Advertising") + "-campaigns", "kq-pt-a-capped", "that ran out of budget") },
    { t: `Run a 10% coupon on the vitamin C serum, Oct 27 to 31`, d: `+${usd(coupon.more)} sales at September’s ${SEPC.lift}% lift, less ${usd(coupon.discount)} discount and ${usd(coupon.fee)} est. fee: +${usd(coupon.contrib)} contribution.`, who: MO, by: "Oct 25", go: go("Promotions", hashOf("Promotions"), "kq-pt-pr-new", "for the proposed coupon") },
    { t: `Order ${num(order(retinol))} units of retinol serum by ${orderBy(retinol)}`, d: `Out around ${runsOut(retinol)} at the Q4 forecast (${cover(retinol).toFixed(1)} weeks with ${num(retinol.inb)} inbound); a week out costs ${usd(retinolDec)} sales, ${usd(retinolDecC)} contribution.`, who: MO, by: "Oct 28", go: go("Inventory", hashOf("Inventory"), rowId(retinol), "for retinol serum") },
  ];
  const decisions = `<div class="kq-pt-card rec" id="kq-pt-dec" tabindex="-1"><h4 class="kq-pt-h2">Decisions for you <small class="w">the first two add about ${usd(recovered)} to Amazon’s October</small></h4><ul class="kq-pt-dec">${DECISIONS.map((x) => `<li><p class="at">${x.t}</p><p class="ad">${x.d}</p><p class="dm"><span class="dw"><b>${x.who}</b> · <span class="st" data-by="Decide by ${x.by}">Decide by ${x.by}</span></span><span class="ans js" role="group" aria-label="Your answer: ${plain(x.t)}"><button type="button" class="hit" data-ans="You agreed Oct 24" aria-pressed="false" disabled>Agree</button><button type="button" class="hit" data-ans="A team member calls you by ${x.by}" aria-pressed="false" disabled>Discuss</button></span>${x.go}</p></li>`).join("")}</ul><p class="kq-pt-note">Agree and we act; Discuss and a team member calls you before the decide-by date. Contribution here: each extra dollar of sales less Amazon’s fees, fulfilment and refunds (${pct(100 * (1 - PCOST - margin), 1)}) and product cost (${pct(100 * PCOST, 0)}), so ${Math.round(100 * margin)} cents, less any extra spend, discount or fee.</p><p class="sr" role="status" id="kq-pt-osay"></p>${team}</div>`;

  // what the team is handling: ranked by severity, then by the weekly sales of what is affected
  const ALERTS = [
    ["High", `${suppressed.length + 1} suppressed listings`, `Sunscreen (both sizes), gift set: with Amazon<span class="pm-i">; not in October’s forecast</span><span class="pq-i">; assumed back Nov 1 in Q4</span>.`, sum(suppressed, weekly), MO, "check Oct 25", go("Account health", hashOf("Account health"), "kq-pt-issues-r", "open issues")],
    ["Medium", `Walmart: ${word(wmLow.length)} items low in WFS`, `${wmLow.map((w) => w[0]).join(" and ").replace("Mineral", "mineral")}: ${wmLow.map((w) => w[4].toFixed(1)).join(" and ")} weeks on hand; the Oct 28 inbound brings ${wmLow.length === 2 ? "them" : "it"} to ${wmLow.map((w) => wmAfter(w).toFixed(1)).join(" and ")}.`, wmWeekly, MO, "WFS inbound booked for Oct 28", go("Walmart", "portal-ops-walmart", "kq-pt-wm-r", "items")],
    ["Medium", "Restricted claim: eye cream", "Amazon flagged a claim in its bullet points.", weekly(eye), MO, "rewrite due Oct 27", go("Products", hashOf("Products"), rowId(eye, "p"), "for the eye cream")],
    ["Low", "Policy warning: retinol serum", "Expiration dating; plan of action with Amazon.", weekly(retinol), MO, "check Oct 28", go("Account health", hashOf("Account health"), "kq-pt-issues-r", "open issues")],
  ];
  check(new Set(ALERTS.map((a) => a[1])).size === ALERTS.length && !ALERTS.slice(1).some((a) => /sunscreen|gift set/i.test(a[1])), "each product is counted in one alert at most");
  const SEV = ["High", "Medium", "Low"];
  check(ALERTS.every((a, i) => !i || (a[0] === ALERTS[i - 1][0] ? a[3] <= ALERTS[i - 1][3] : SEV.indexOf(a[0]) > SEV.indexOf(ALERTS[i - 1][0]))), "the attention list is ranked by severity, then by sales at stake");
  check(sum(suppressed, weekly) === 63800 && near(sum(suppressed, weekly), (reinstate / backDays) * 7, 0.01) && weekly(retinol) === retinolWeekly && weekly(eye) === 16600, "sales at stake");
  const attention = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Needs attention <small>${ALERTS.length}, by severity<span class="w">, then weekly sales at stake</span></small></h4><ul class="kq-pt-att wide">${ALERTS.map(([sev, t, d, n, who, st, btn]) => `<li><span class="pill ${["bad", "warn", "flat"][SEV.indexOf(sev)]}">${sev}</span><p class="at">${t}</p><p class="av"><strong>${usd(n)}</strong> <small>a week</small></p>${d ? `<p class="ad">${d}</p>` : ""}<p class="aw"><b>${who}</b> · ${st}</p>${btn}</li>`).join("")}</ul><p class="kq-pt-note w"><b>A week</b> average weekly sales, Oct 1 to 23 (suppressed: while listed).</p></div>`;


  const exec = `<section class="kq-pt-sheet kq-pt-v1" aria-labelledby="kq-pt-h1"><div class="kq-pt-trow"><h3 class="kq-pt-h1" id="kq-pt-h1">Overview</h3><p class="kq-pt-ctl"><span>Oct 1 to 23, 2026</span><span>vs same days last month</span><span class="w">vs same days last year</span></p></div>
<div class="kq-pt-frow"><p class="kq-pt-find kq-pt-per-m">Your three channels reached ${usd(ALL.sales)} in October so far and are forecast ${usd(ALL.goal - ALL.fc)} short of the ${usd(ALL.goal)} goal. Amazon is ${usd(amzGap)} short without the suppressed gift set and sunscreen: back on ${BACK} they would add about ${usd(reinstate)}, and two recommendations from your team about ${usd(recovered)}.</p><p class="kq-pt-find kq-pt-per-q">For Q4, Oct 1 to Dec 31, your three channels are forecast to finish ${usd(ALLQ.fc - ALLQ.goal)} above the ${usd(ALLQ.goal)} goal, Amazon ${usd(CHQ[0].fc - CHQ[0].goal)} above despite October. That assumes the suppressed gift set and sunscreen are back by Nov 1 at the rate they sold while listed; each week they stay out takes about ${usd(suppNovWeek)} off November. Target Plus is ${usd(CHQ[2].goal - CHQ[2].fc)} short; your team brings options to the Oct 28 call.</p>${stamp(1, `Amazon to ${AMZ.thru} · Walmart, Target Plus to ${CH[1].thru}`)}</div>
${kstrip}
${channels}
<div class="kq-pt-cols eq"><div>${decisions}</div><div>${attention}${daily}</div></div></section>`;
  check(ALL.goal - ALL.fc === 55700 && amzGap > reinstate + recovered && CH.slice(1).every((c) => c.fc > c.goal) && ALLQ.fc - ALLQ.goal === 58800 && CHQ[0].fc - CHQ[0].goal === 34100 && CHQ[2].goal - CHQ[2].fc === 3200 && suppNovWeek === 84500, "the headlines: October short, Q4 ahead if the listings are back by Nov 1");

  // ---- screen 2: Operations, for the people who run the channels ---------------------------------
  const MAXWK = 16;
  const bar = (c) => `<span class="cb" aria-hidden="true"><b style="left:${(100 * COVER[0]) / MAXWK}%;width:${(100 * (COVER[1] - COVER[0])) / MAXWK}%"></b><i${c < COVER[0] ? ` class="low"` : ""} style="width:${Math.min(100, (100 * c) / MAXWK).toFixed(1)}%"></i></span>`;
  const coverCell = (c) => `<td class="cv" data-v="${c.toFixed(2)}" data-c="${c.toFixed(1)}"><span><strong>${c.toFixed(1)}</strong>${c < COVER[0] ? ` ${pill("bad", "Low")}` : ""}</span>${bar(c)}</td>`;
  const name = (p, id) => `<th scope="row" data-v="${byName.indexOf(p.n)}"${attr("data-c", [p.n, p.sku])}${id ? ` id="${id}" tabindex="-1"` : ""}>${p.n}<small>${p.sku}</small></th>`;
  const PH = ["Product", "SKU"];
  const coverHead = th("Weeks of cover", `at Q4 forecast, target ${COVER[0]} to ${COVER[1]}`, true, "", ["Weeks of cover at Q4 forecast"]);
  const tool = (summary, extra, what) => `<div class="kq-pt-tool"><p>${summary}</p><div class="kq-pt-tr">${extra || ""}${exportBtn(what)}</div></div>`;

  const products = tool(`${PRODUCTS.length} of ${PRODUCT_COUNT} products, ${shownShare}% of Amazon sales, Oct 1 to 23`, `<label class="kq-pt-q js"><span class="sr">Find a product or SKU</span>${SEARCH}<input type="search" placeholder="Find a product" autocomplete="off" disabled></label><button type="button" class="kq-pt-flt kq-pt-btn js" aria-pressed="false" disabled>With an open step <b>${withStep.length}</b></button>`, "kq-pt-c0-t")
    + tbl("kq-pt-c0", `Products, Oct 1 to 23: ${PRODUCTS.length} of ${PRODUCT_COUNT}, ${shownShare}% of Amazon sales`,
      th("Product", "", true, "", PH) + th("Sales", "vs Sep 1 to 23", true, "num", ["Sales (USD)", "Change vs Sep 1 to 23 (%)"]) + th("Sessions", "unit session %", true, "num", ["Sessions", "Unit session (%)"]) + th("Ad sales", "share of sales", true, "num", ["Ad sales (USD)", "Ad sales share (%)"]) + th("Price", "Featured Offer %", true, "num", ["Average price (USD)", "Featured Offer (%)"]) + th("Rating", "sales rank", true, "num", ["Rating", "Ratings", "Sales rank"]) + coverHead + th("Next step", "owner, status and date", true, "desc", ["Flag", "Next step", "Owner and status"]),
      PRODUCTS.map((p) => `<tr${p.tag ? " data-step" : ""}>${name(p, rowId(p, "p"))}${td(p.sales, usd(p.sales), `<span class="${p.chg > 0 ? "pos" : "neg"}">${p.chg > 0 ? "+" : "−"}${Math.abs(p.chg).toFixed(1)}%</span>`, "num", [p.sales, f1(p.chg)])}${td(p.sess, num(p.sess), pct((100 * p.units) / p.sess), "num", [p.sess, f1((100 * p.units) / p.sess)])}${td(p.ad, usd(p.ad), pct((100 * p.ad) / p.sales), "num", [p.ad, f1((100 * p.ad) / p.sales)])}${td(p.sales / p.units, usd2(p.sales / p.units), pct(p.fo), "num", [f2(p.sales / p.units), f1(p.fo)])}${td(p.rt * 1e5 + p.rc, `${p.rt.toFixed(1)} <span class="mut">(${num(p.rc)})</span>`, `#${num(p.rank)}`, "num", [f1(p.rt), p.rc, p.rank])}${coverCell(cover(p))}<td class="nx" data-v="${(p.tag ? (p.tag[0] === "bad" ? 2 : 1) : 0) * 1e7 + p.sales}"${attr("data-c", p.tag ? [p.tag[1], p.step, p.who] : ["", "", ""])}>${p.tag ? `${pill(p.tag[0], p.tag[1])} <span class="at">${p.step}</span><small>${p.who}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "prod", "products")
    + `<p class="kq-pt-none" hidden>No product matches. Clear the search or the filter to see all ${word(PRODUCTS.length)}.</p>`
    + defs(`<b>Sessions</b> visits to the product’s pages; repeat visits within 24 hours count once. <b>Unit session %</b> units ordered ÷ sessions. <b>Ad sales</b> Sponsored ads only. <b>Price</b> average selling price. <b>Featured Offer %</b> share of page views where your offer held the Featured Offer (Buy Box); a suppressed listing’s pages show no offer. <b>Rating</b> average stars (ratings). <b>Sales rank</b> Best Sellers Rank in Beauty and Personal Care, Oct 23. <b>Weeks of cover</b> how long units on hand and inbound last at the Q4 forecast (Inventory tab); under ${COVER[0]} is low.`);

  const AV = [["c", "Campaigns"], ["k", "Keywords"], ["p", "Placements"]];
  const seg = `<div class="kq-pt-seg js" role="radiogroup" aria-label="Advertising view">${AV.map(([k, t], i) => `<span class="o"><input type="radio" name="kq-pt-av" id="kq-pt-av-${k}" value="${k}"${i ? "" : " checked"}><label for="kq-pt-av-${k}">${t}</label></span>`).join("")}</div>`;
  const campaigns = tbl("kq-pt-c1", "Amazon advertising by campaign, Oct 1 to 23",
      th("Campaign", "", true, "", ["Campaign", "Type"]) + th("Budget", "a day", true, "num", ["Daily budget (USD)", "Budget type"]) + th("Spend", "share of spend", true, "num", ["Spend (USD)", "Share of spend (%)"]) + th("Ad sales", "", true, "num", ["Ad sales (USD)"]) + th("ROAS", "ACoS", true, "num", ["ROAS", "ACoS (%)"]) + th("Out of budget", "hours, est. missed", true, "num", ["Hours out of budget", "Est. missed sales (USD)"]) + th("Next step", "", false, ""),
      CAMPAIGNS.map((c, i) => `<tr><th scope="row" data-v="${i}"${attr("data-c", [c.n, c.type])}${c === capped[0] ? ' id="kq-pt-a-capped" tabindex="-1"' : ""}>${c.n}<small class="w">${c.type}</small></th>${td(c.day, c.day ? usd(c.day) : "Flight", c.day ? undefined : "DSP budget", "num", [c.day || "", c.day ? "daily" : "DSP flight"])}${td(c.spend, usd(c.spend), pct((100 * c.spend) / AMZ.spend), "num", [c.spend, f1((100 * c.spend) / AMZ.spend)])}${td(c.sales, usd(c.sales))}${td(c.roas.toFixed(3), `${c.roas.toFixed(2)}x`, pct((100 * c.spend) / c.sales), "num", [f2(c.roas), f1((100 * c.spend) / c.sales)])}${td(c.hrs, c.hrs ? `${c.hrs} hours` : "None", c.hrs ? `${usd(c.missed)} missed` : undefined, "num", [c.hrs, c.missed])}<td>${c.hrs ? `${pill("warn", "Cap lift")} <span class="at">Oct 25 to 31</span><small>awaiting your decision, by Oct 24${c.day === 280 ? "; raised from $250 Oct 19" : ""}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "", "advertising-campaigns")
    + defs(`<b>Share of spend</b> of all Amazon ad spend. <b>ROAS</b> ad-attributed sales ÷ spend; <b>ACoS</b> spend ÷ ad-attributed sales. <b>Est. missed</b> hours out of budget × that day’s budget per hour (the video’s rose from $250 to $280 on Oct 19) × ROAS. Sponsored ads: 7-day window, DSP: 14; the last 14 days are provisional.`);
  const keywords = tbl("kq-pt-kw", "Keywords in the keyword campaigns, Oct 1 to 23",
      th("Keyword", "match type", true, "", ["Keyword", "Match type"]) + th("Campaign", "", false, "") + th("Bid", "", true, "num", ["Bid (USD)"]) + th("Spend", "", true, "num", ["Spend (USD)"]) + th("Ad sales", "", true, "num", ["Ad sales (USD)"]) + th("ROAS") + th("Top of search", "impression share", true, "num", ["Top-of-search impression share (%)"]) + th("Next step", "", false, "", ["Next step", "Added"]),
      KEYWORDS.map(([k, m, ci, bid, sp, sa, is, st, since], i) => `<tr><th scope="row" data-v="${i}"${attr("data-c", [k, m])}>${k}<small>${m}</small></th><td>${CAMPAIGNS[ci].n}</td>${td(bid, usd2(bid), undefined, "num", [f2(bid)])}${td(sp, usd(sp), since ? `since ${since}` : undefined, "num", [sp])}${td(sa, usd(sa))}${td((sa / sp).toFixed(3), `${(sa / sp).toFixed(2)}x`, undefined, "num", [f2(sa / sp)])}${td(is, `${is}%`)}<td${attr("data-c", [st, since ? iso(since) : ""])}>${st ? (since ? `${st}<small>${since}</small>` : st) : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "", "advertising-keywords")
    + defs(`<b>Top-of-search impression share</b> the share of top-of-search impressions for the keyword that your ads won. A keyword’s spend covers every search term it matched (see Search terms); one added this month shows its spend since then.`);
  const places = tbl("kq-pt-pl", "Sponsored Products placements, Oct 1 to 23",
      th("Placement", "", false, "") + th("Bid adjustment", "", false, "num", ["Bid adjustment (%)"]) + th("Spend", "share", true, "num", ["Spend (USD)", "Share of spend (%)"]) + th("Ad sales", "", true, "num", ["Ad sales (USD)"]) + th("ROAS") + th("Next step", "", false, ""),
      PLACES.map(([n, adj, sp, sa, st], i) => `<tr><th scope="row" data-v="${i}">${n}</th>${td(adj, adj ? `+${adj}%` : "None", undefined, "num", [adj])}${td(sp, usd(sp), pct((100 * sp) / sum(PLACES, (x) => x[2])), "num", [sp, f1((100 * sp) / sum(PLACES, (x) => x[2]))])}${td(sa, usd(sa))}${td((sa / sp).toFixed(3), `${(sa / sp).toFixed(2)}x`, undefined, "num", [f2(sa / sp)])}<td>${st}</td></tr>`).join(""), "plain", "advertising-placements")
    + `<p class="kq-pt-note"><b>Bid adjustment</b> how much more a bid pays for that placement.</p>`;
  const SUMS = [`${CAMPAIGNS.length} of ${CAMPAIGN_COUNT} campaigns, ${spendShare}% of Amazon ad spend. All: ${usd(AMZ.spend)} spend, ${usd(AMZ.adSales)} ad sales, ${(AMZ.adSales / AMZ.spend).toFixed(2)}x`, `${KEYWORDS.length} keywords, ${kwShare}% of the three keyword campaigns’ spend, ${word(KEYWORDS.filter((k) => k[8]).length)} added this week`, `The ${word(SPC.length)} Sponsored Products campaigns, by placement`];
  const ads = `<div class="kq-pt-tool">${seg}<div class="kq-pt-avs kq-pt-sums">${AV.map(([k], i) => `<p class="kq-pt-av kq-pt-av-${k}">${SUMS[i]}, Oct 1 to 23</p>`).join("")}</div><div class="kq-pt-tr">${exportBtn("kq-pt-p1")}</div></div><div class="kq-pt-avs"><div class="kq-pt-av kq-pt-av-c">${campaigns}</div><div class="kq-pt-av kq-pt-av-k">${keywords}</div><div class="kq-pt-av kq-pt-av-p">${places}</div></div>`;

  const terms = tool(`${TERMS.length} search terms your team acted on or is reviewing, of ${TERM_COUNT} with ad spend this month`, "", "kq-pt-c2-t")
    + tbl("kq-pt-c2", "Search terms with an action this month",
      th("Search term", "", true, "") + th("Click share", "week to Oct 17", true, "num", ["Click share (%)"]) + th("Purchase share", "week to Oct 17", true, "num", ["Purchase share (%)"]) + th("Ad spend", "ROAS, to Oct 23", true, "num", ["Ad spend (USD)", "ROAS"]) + th("Action", "", false, "") + th("Owner and status", "", false, "", ["Owner", "Status"]),
      TERMS.map(([t, cs, ps, sp, r, act, who, stt], i) => `<tr><th scope="row" data-v="${i}">${t}</th>${td(cs, pct(cs), undefined, "num", [f1(cs)])}${td(ps, `<span class="${ps < cs ? "neg" : ""}">${pct(ps)}</span>`, undefined, "num", [f1(ps)])}${td(sp, usd(sp), `${r.toFixed(2)}x`, "num", [sp, f2(r)])}<td>${act}</td><td${attr("data-c", [who, stt])}>${who.replace("Retail Media and ", '<span class="w">Retail Media and </span>').replace("Marketplace ", '<span class="w">Marketplace </span>')}<small>${stt}</small></td></tr>`).join(""), "", "search-terms")
    + defs(`<b>Click share</b> your products’ share of all clicks on the term in Amazon search. <b>Purchase share</b> the same for purchases; below click share (in red) means shoppers click and then buy elsewhere. Both from Brand Analytics, weekly. Ad spend and ROAS from Sponsored Products. Sunscreen ads stopped on Oct 21, when its listing was suppressed.`);

  const inventory = tool(`${num(inboundUnits)} units inbound in ${word(SHIPMENTS.length)} shipments · as of ${INV_ASOF}`, "", "kq-pt-c3-t")
    + tbl("kq-pt-c3", `Inventory and replenishment by product, as of ${INV_ASOF}`,
      th("Product", "", true, "", PH) + th("On hand") + th("Inbound", "expected", true, "num", ["Inbound", "Expected"]) + th("Weekly units", "average, Oct 1 to 23") + coverHead + th("Oct rate", "weeks of cover", true, "num", ["Weeks of cover at October rate"]) + th("Suggested order", `${COVER[1]} weeks at forecast`) + th("Order by", "stock runs out", true, "num", ["Order by", "Runs out"]),
      PRODUCTS.map((p) => `<tr>${name(p, rowId(p))}${td(p.on, num(p.on))}${td(p.inb, p.inb ? num(p.inb) : "None", due(p), "num", [p.inb, due(p) ? iso(due(p)) : ""])}${td(p.wk, num(p.wk))}${coverCell(cover(p))}${td(coverOct(p).toFixed(2), coverOct(p).toFixed(1), undefined, "num", [coverOct(p).toFixed(1)])}${td(order(p), order(p) ? `<strong>${num(order(p))}</strong>` : "Not yet")}${td(cover(p), orderBy(p), `out ${runsOut(p)}`, "num", [iso(orderBy(p)), iso(runsOut(p))])}</tr>`).join(""), "", "inventory")
    + defs(`<b>Weeks of cover</b> days until units on hand and inbound (from the day they are due) run out at the Q4 forecast, ÷ 7: each product’s October daily average, then November and December by its season, scaled to Amazon’s forecast, which includes the booked promotions. A suppressed product is planned at its listed-day rate from ${BACK}, when its case is due, so stock is ready if it returns. <b>Oct rate</b> on hand and inbound ÷ weekly units, for comparison. <b>Suggested order</b> once cover is under ${COVER[0]} weeks, ${COVER[1]} weeks of forecast sales less on hand and inbound, in cases of 100. <b>Order by</b> ${LEAD_WEEKS + SAFETY_WEEKS} weeks before stock runs out: the ${LEAD_WEEKS}-week lead time from order to stock at Amazon plus ${word(SAFETY_WEEKS)} week of safety stock, so an order lands a week before. 460 units in two listings are stranded.`);

  const returns = tool("Returns and repeat purchase by product, Oct 1 to 23", "", "kq-pt-c4-t")
    + tbl("kq-pt-c4", "Returns and repeat purchase by product, Oct 1 to 23",
      th("Product", "", true, "", PH) + th("Units ordered") + th("Returned") + th("Return rate", "", true, "num", ["Return rate (%)"]) + th("Top return reason", "", false, "") + th("Repeat buyers", "share of customers", true, "num", ["Repeat buyers (%)"]) + th("Subscribe and Save", "active subscriptions", true, "num", ["Subscribe and Save subscriptions"]),
      PRODUCTS.map((p) => `<tr>${name(p)}${td(p.units, num(p.units))}${td(p.ret, num(p.ret))}${td(((100 * p.ret) / p.units).toFixed(2), pct((100 * p.ret) / p.units), undefined, "num", [f1((100 * p.ret) / p.units)])}<td>${p.why}</td>${td(p.rep, `${p.rep}%`)}${td(p.sns, p.sns ? num(p.sns) : "Not enrolled")}</tr>`).join(""), "", "returns")
    + `<p class="kq-pt-note">Reimbursements this month: ${word(REIMB.length)} cases, ${num(sum(REIMB, (r) => r[1]))} units, ${usd(reimbTotal)}, filed by Revenue Recovery. ${["lost in a warehouse", "damaged in fulfilment"].map((why, i) => (i ? why : cap(why)) + ": " + REIMB.filter((r) => r[2] === why).map(([n, u, , v]) => `${u} ${(u > 1 && n === "Gift set" ? "gift sets" : n.replace(/^./, (c) => c.toLowerCase()))} (${usd(v)})`).join(" and ")).join("; ")}.</p>`
    + defs(`<b>Return rate</b> units returned ÷ units ordered. <b>Repeat buyers</b> customers who bought the product more than once, from Brand Analytics, to Oct 17. Subscriptions as of ${INV_ASOF}.`);

  const promos = tool(`October promotions cost ${usd(COSTS.promotions)}, counted in contribution`, "", "kq-pt-c5-t")
    + tbl("kq-pt-c5", "Promotions: proposed, running, ended and booked",
      th("Promotion", "", true, "") + th("Products", "", false, "") + th("Dates", "", false, "", ["Start", "End"]) + th("Sales during", "", true, "num", ["Sales during (USD)"]) + th("Lift", "", true, "num", ["Lift (%)"]) + th("Cost to you", "discount + Amazon fee", true, "num", ["Cost to you (USD)", "Discount (USD)", "Amazon fee, est. (USD)"]) + th("Status", "", false, "", ["Status", "Note"]),
      PROMOS.map((x, i) => `<tr><th scope="row" data-v="${i}"${x.id ? ` id="${x.id}" tabindex="-1"` : ""}>${x.n}</th><td>${x.what}</td><td class="dt"${attr("data-c", PROMO_DATES[i].map(iso))}>${x.when}</td>${td(x.sv, x.sales, undefined, "num", [x.sv ? (x.id ? r100(x.sv) : x.sv) : ""])}${td(x.lv, x.lift, undefined, "num", [x.lv >= 0 ? x.lv : ""])}${td(x.cv, x.cost, x.dis === undefined ? undefined : x.fee ? `${usd(x.dis)} + ${usd(x.fee)} fee est.` : "no fee", "num", [x.cv || "", x.dis === undefined ? "" : x.dis, x.dis === undefined ? "" : x.fee])}<td${attr("data-c", [x.st[1], x.note + (x.id ? "; figures are estimates" : "")])}>${pill(x.st[0], x.st[1])}<small>${x.note}</small></td></tr>`).join(""), "", "promotions")
    + defs(`<b>Sales during</b> all sales of the products on the promotion’s days, before the discount; for Subscribe and Save, the subscription orders it applies to. <b>Lift</b> against the same products’ average daily sales on the month’s other days. <b>Cost to you</b> the discount you fund (from settlements) plus Amazon’s fee, estimated here: a coupon $5 + 2.5% of the sales that used it, a deal $70 a day + 1% of its sales. The proposal applies September’s lift and redemption to October’s daily average.`);

  const health = `<div class="kq-pt-tool"><p>Account health as of ${INV_ASOF}</p><div class="kq-pt-tr">${exportBtn("kq-pt-c6-t", "Export measures")}${exportBtn("kq-pt-issues-t", "Export issues")}</div></div><div class="kq-pt-two">` + tbl("kq-pt-c6", "Performance against Amazon’s targets",
    th("Measure", "", false, "") + th("Current", "", false, "num", ["Current", "Unit"]) + th("Target", "", false, "") + th("Status", "", false, ""),
    [["Order defect rate", "0.21%", "Below 1%", pill("good", "On track")], ["Late shipment rate", "0.8%", "Below 4%", pill("good", "On track")], ["Pre-fulfillment cancel rate", "0.1%", "Below 2.5%", pill("good", "On track")], ["Valid tracking rate", "99.2%", "Above 95%", pill("good", "On track")], ["Policy warnings", "1", "None open", pill("warn", "Watch")], ["Suppressed listings", "3", "None", pill("bad", "Action")]].map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td class="num"${attr("data-c", b.endsWith("%") ? [b.slice(0, -1), "%"] : [b, "count"])}>${b}</td><td>${c}</td><td>${d}</td></tr>`).join(""), "plain", "health-measures")
    + tbl("kq-pt-issues", "Open issues, with owner, status and date",
      th("Open issue", "", false, "") + th("Products", "", false, "") + th("Status", "", false, "") + th("Next", "", false, "") + th("Owner", "", false, ""),
      [["Missing safety data sheet", "Mineral sunscreen, both sizes", "Filed Oct 17; suppressed Oct 21", "Check Oct 25", MO], ["Main image rule", "Gift set", "Suppressed Oct 19; new image filed Oct 20", "Check Oct 25", "Creative Studio"], ["Restricted claim in bullets", "Eye cream", "Opened Oct 21, rewrite in progress", "Due Oct 27", MO], ["Policy warning: expiration dating", "Retinol serum", "Plan of action filed Oct 16", "Check Oct 28", MO], ["Inbound carton labels missing", `Vitamin C serum, ${SHIPMENTS[0][4]}`, "Fee of $86 charged Oct 23; receiving continues", "Check Oct 26", MO]].map(([a, b, c, d, e]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td><td>${e}</td></tr>`).join(""), "plain", "health-issues") + `</div><p class="kq-pt-note">The three suppressed listings are the two sunscreen sizes and the gift set. Policy warnings are rated Low while a plan of action is under review.</p>`;

  const TABS = [["Products", products], ["Advertising", ads, "Ads"], ["Search terms", terms, "Terms"], ["Inventory", inventory], ["Returns and repeat", returns, "Returns"], ["Promotions", promos], ["Account health", health, "Health"]];
  check(TABS.map((t) => t[0]).join() === TAB_NAMES.join(), "tab order");
  const tablist = `<div class="kq-pt-bar"><div class="kq-pt-tabs" role="tablist" aria-label="Amazon operations">${TABS.map(([t, , s], i) => `<button type="button" role="tab" id="kq-pt-t${i}" aria-controls="kq-pt-p${i}" aria-selected="${!i}"${i ? ' tabindex="-1"' : ""} data-key="${TAB_KEYS[i]}" disabled>${s ? `<span class="w">${t}</span><span class="n">${s}</span>` : t}</button>`).join("")}</div><p class="kq-pt-say" role="status"></p></div>`;
  const withHint = (html) => (html.includes('<button type="button" class="kq-pt-dfb') ? html.replace('<button type="button" class="kq-pt-dfb', HINT + '<button type="button" class="kq-pt-dfb') : html + HINT);
  const panes = `<div class="kq-pt-panes">${TABS.map(([, html], i) => `<div class="kq-pt-pane${i ? "" : " on"}" role="tabpanel" id="kq-pt-p${i}" aria-labelledby="kq-pt-t${i}">${withHint(html)}</div>`).join("")}</div>`;

  const ships = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Inbound shipments</h4><p class="kq-pt-csub">${num(inboundUnits)} units · ${MO}</p><ul class="kq-pt-att two">${SHIPMENTS.map(([n, u, s, eta, id, fc]) => `<li><div><p><span class="at">${n}</span> <small>${num(u)}<span class="sr"> units</span></small></p><p class="ad"><small>${id} to ${fc}</small></p></div><div class="av"><span><small>${s}, due</small> <strong>${eta}</strong></span></div></li>`).join("")}</ul></div>`;
  const CHANGES = [["Oct 22", "Search terms", "38 negatives added; “vitamin c serum for face” moved to exact match"], ["Oct 21", "Featured Offer", `Vitamin C serum lost it for 6 hours to an offer at $36.90 (yours ${usd2(vc.sales / vc.units)})`], ["Oct 21", "Listing", "Mineral sunscreen suppressed while Amazon reviews the safety data sheet; its ads paused"], ["Oct 20", "Listing", "Gift set main image replaced, with Amazon for review"], ["Oct 19", "Budget", `Brands video raised from $250 to ${usd(capped.find((c) => c.day === 280).day)} a day`]];
  const FO = [["Vitamin C serum", "Lost 6 hours on Oct 21 to a $36.90 offer", "held again"], ["Mineral sunscreen", "Suppressed since Oct 21: no offer shown", "with Amazon"], ["Gift set", "Suppressed since Oct 19: no offer shown", "with Amazon"], [`${cap(word(PRODUCTS.filter((p) => p.fo >= 99).length))} other products`, "Held on 99% or more of page views", "no change"]];
  check(PRODUCTS.filter((p) => p.fo >= 99).length === 4 && PRODUCTS.filter((p) => p.fo < 99).map((p) => p.n).sort().join() === FO.slice(0, 3).map((f) => f[0]).sort().join(), "Featured Offer card against the products");
  const [foHead, foId] = foldHead("Featured Offer");
  const offers = `<div class="kq-pt-card">${foHead}<p class="kq-pt-csub">Last 7 days, prices unchanged · ${MO}</p><ul class="kq-pt-att kq-pt-fo kq-pt-df" id="${foId}">${FO.map(([n, d, st]) => `<li><p><span class="at">${n}</span> <small>${st}</small></p><p class="ad">${d}</p></li>`).join("")}</ul></div>`;
  const changes = `<div class="kq-pt-card kq-pt-team"><h4 class="kq-pt-h2">Highlights this week</h4><p class="kq-pt-csub">Selected changes; each tab dates the rest</p><ul>${CHANGES.map(([dt, k, t]) => `<li><small>${dt} · ${k}</small><span>${t}</span></li>`).join("")}</ul></div>`;

  const amazon = `<div class="kq-pt-chan kq-pt-k1"><div class="kq-pt-frow"><p class="kq-pt-find">${cap(word(PRODUCTS.length))} products make up ${shownShare}% of Amazon sales this month. ${cap(word(withStep.length))} have an open step: the retinol serum needs a reorder, the ${suppressed.map((p) => p.n.toLowerCase()).join(" and ")} are suppressed, and the eye cream has a listing issue.</p>${stamp(2, `Amazon to ${AMZ.thru} · inventory ${INV_ASOF}`)}</div>
${tablist}
${panes}
<div class="kq-pt-cols ops">${ships}${offers}${changes}</div></div>`;

  const walmart = `<div class="kq-pt-chan kq-pt-k2"><div class="kq-pt-frow"><p class="kq-pt-find">${cap(word(WM.length))} items make up ${wmShare}% of Walmart sales, Oct 1 to 22. ${cap(word(wmLow.length))} are low in Walmart Fulfillment Services, with inbound stock booked for Oct 28.</p><div class="kq-pt-stamp"><span>Walmart to ${CH[1].thru}</span></div></div>
<div class="kq-pt-card"><div class="kq-pt-tool"><p>Walmart items, Oct 1 to 22 <span class="kq-pt-say" role="status" id="kq-pt-wsay"></span></p><div class="kq-pt-tr">${exportBtn("kq-pt-wm-t")}</div></div>${tbl("kq-pt-wm", "Walmart items, Oct 1 to 22",
    th("Item", "", true, "", ["Item"]) + th("Sales", "Oct 1 to 22", true, "num", ["Sales (USD)"]) + th("Weekly units", "est., Amazon price", true, "num", ["Weekly units (est.)", "Price used (USD)"]) + th("Buy Box win rate", "", true, "num", ["Buy Box win rate (%)"]) + th("Listing quality", "score of 100", true, "num", ["Listing quality score"]) + th("WFS weeks of cover", `on hand, before inbound, target ${COVER[0]} to ${COVER[1]}`, true, "", ["WFS weeks of cover on hand at October rate"]) + th("Next step", "", false, "", ["Next step", "Owner"]),
    WM.map(([n, sl, bb, lq, c, step, inb], i) => `<tr><th scope="row" data-v="${[...WM].map((w) => w[0]).sort().indexOf(n)}">${n}</th>${td(sl, usd(sl))}${td(wmWk(WM[i]), num(wmWk(WM[i])), undefined, "num", [wmWk(WM[i]), f2(wmPrice(WM[i]))])}${td(bb, pct(bb), undefined, "num", [f1(bb)])}${td(lq, lq)}${coverCell(c)}<td${attr("data-c", step ? [`${step}: ${inb} units, ${wmAfter(WM[i]).toFixed(1)} weeks with it`, "Marketplace Operations"] : ["", ""])}>${step ? `<span class="at">${step}: ${num(inb)} units, ${wmAfter(WM[i]).toFixed(1)} weeks with it</span><small>${MO}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "plain", "walmart-items")}${HINT}
<p class="kq-pt-note"><b>Buy Box win rate</b> share of page views where your offer won the Buy Box. <b>Listing quality</b> Walmart’s score for content, offer and reviews. Walmart does not send units, sessions by day, item forecasts or seller performance standards to the data warehouse yet. <b>Weekly units</b> are estimated: Walmart sales ÷ 22 days × 7 ÷ the product’s average Amazon price. <b>WFS weeks of cover</b> units on hand ÷ weekly units; “with it” adds the inbound booked for Oct 28.</p></div>
<div class="kq-pt-cols eq"><div class="kq-pt-card"><h4 class="kq-pt-h2">Walmart Connect <small>Oct 1 to 22</small></h4><ul class="kq-pt-att two">${WMADS.map(([n, sp, sa]) => `<li><div><p class="at">${n}</p><p class="ad">${usd(sp)} spend</p></div><div class="av"><span><strong>${(sa / sp).toFixed(2)}x</strong></span><small>${usd(sa)} ad sales</small></div></li>`).join("")}</ul><p class="kq-pt-note">All: ${usd(CH[1].spend)} spend, ${usd(CH[1].adSales)} ad sales, ${(CH[1].adSales / CH[1].spend).toFixed(2)}x, 14-day attribution.</p></div>
<div class="kq-pt-card"><h4 class="kq-pt-h2">What lowers listing quality</h4><ul class="kq-pt-att two">${WMLQ.map(([n, d, st]) => `<li><div><p class="at">${n}</p><p class="ad">${d}</p></div><div class="av"><small>${st}</small></div></li>`).join("")}</ul></div></div></div>`;

  const target = `<div class="kq-pt-chan kq-pt-k3"><div class="kq-pt-card kq-pt-empty"><h4 class="kq-pt-h2">No Target Plus feed for this account yet</h4><p>Target Plus sales and Roundel ad spend on the Overview come from reports your team uploads by hand each week; the last upload covers sales to ${CH[2].thru}. Product, inventory and order detail will show here once a feed is connected.</p><ul class="kq-pt-list"><li>Sales and units by item, by day</li><li>Roundel campaigns: spend, ROAS and new-to-Target guests</li><li>Inventory and orders by item</li><li>Item ratings and content issues</li></ul><p class="kq-pt-note">The real portal shows this state for any source an account does not have, so an empty screen is never mistaken for zero sales.</p></div></div>`;

  const chsw = `<div class="kq-pt-chsw" role="radiogroup" aria-label="Channel">${[["amazon", "Amazon"], ["walmart", "Walmart"], ["target-plus", "Target Plus"]].map(([k, t], i) => `<span class="o"><input type="radio" name="kq-pt-ch" id="kq-pt-c-${k}" value="${k}"${i ? "" : " checked"}><label for="kq-pt-c-${k}">${t}</label></span>`).join("")}</div>`;
  const ops = `<section class="kq-pt-sheet kq-pt-v2" aria-labelledby="kq-pt-h2" data-tab="0"><p class="kq-pt-crumb">Sample skincare brand / <span class="cr-a">Amazon / Operations</span><span class="cr-w">Walmart</span><span class="cr-t">Target Plus</span></p><div class="kq-pt-trow"><h3 class="kq-pt-h1" id="kq-pt-h2">Operations</h3>${chsw}</div>
<div class="kq-pt-chans">${amazon}${walmart}${target}</div></section>`;

  const sw = `<div class="kq-pt-sw" role="radiogroup" aria-labelledby="kq-pt-swl"><span id="kq-pt-swl">Show the example for</span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v1" checked><label for="kq-pt-v1">An executive</label></span><span class="o"><input type="radio" name="kq-pt-view" id="kq-pt-v2"><label for="kq-pt-v2">The team running the channels</label></span></div>`;

  return section("portal", "portal", "#F8F6F1", two(
    `<h2 id="portal-title" style="${H2}">The client portal</h2>`,
    `<p style="${P}">Every dashboard, report, forecast, call note and open task for your account is in one place, and you see the same numbers we do. An executive opens on the month against goal and the decisions waiting for an answer. The people who run the channels open on the product, campaign or shipment behind each number. Every table exports to CSV.</p><p style="margin: 16px 0 0"><a href="/client-sign-in" style="color: #102A4C">Client sign-in</a></p>`,
  ) + `<figure class="kq-pt-fig">${sw}<div class="kq-pt" data-nosnippet>
${side}
<div class="kq-pt-main">${top}<div class="kq-pt-views">${exec}
${ops}</div></div></div><figcaption>An illustrative example of two portal screens, with a sample brand’s figures. It does not show a client’s data.<span class="js"> Try the tabs, sorting, search, CSV export and the decision buttons.</span></figcaption><script>${PORTAL_JS}</script></figure>
<ul class="kq-pt-points"><li><strong>The month against goal</strong>Sales to date, the forecast and its range, and the goal for each channel, then the decisions waiting for you.</li><li><strong>The item behind each number</strong>The product, campaign, search term or shipment, with its next step, who has it and when.</li><li><strong>Dated to the source</strong>Every page says how fresh each source is, and says so when a source is missing.</li></ul>`);
}

// Switches the example on: tabs, search and filter, sorting, CSV export, the freshness panels, the
// answers to decisions and the buttons that open the detail, with the place kept in the address.
// Written for old browsers on purpose (no arrow functions), and it touches nothing outside the figure
// except the address (replaceState and pushState on #portal-... only).
const PORTAL_JS = String.raw`(function(){var f=document.querySelector('.kq-pt-fig');if(!f||!f.querySelector||!document.addEventListener)return;
function all(s,r){return [].slice.call((r||f).querySelectorAll(s))}function el(i){return document.getElementById(i)}
function up(e,c){while(e&&e!==f){if(e.classList&&e.classList.contains(c))return e;e=e.parentNode}return null}
var ops=f.querySelector('.kq-pt-v2'),box=f.querySelector('.kq-pt-panes'),say=f.querySelector('.kq-pt-say'),osay=el('kq-pt-osay'),flt=f.querySelector('.kq-pt-flt'),qi=f.querySelector('.kq-pt-q input'),none=f.querySelector('.kq-pt-none'),tabs=all('[role=tab]'),panes=tabs.map(function(t){return el(t.getAttribute('aria-controls'))}),cur=0;
var keys=tabs.map(function(t){return t.getAttribute('data-key')});
function pick(i,focus){cur=i;box.style.minHeight='';tabs.forEach(function(t,j){var on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;panes[j].classList.toggle('on',on)});ops.setAttribute('data-tab',i);say.textContent='';if(focus)tabs[i].focus()}
function sayFor(b){return up(b,'kq-pt-v1')?osay:up(b,'kq-pt-k2')?el('kq-pt-wsay'):say}
var AVN={c:'campaigns',k:'keywords',p:'placements'};function av(){var r=f.querySelector('[name=kq-pt-av]:checked');return r?r.value:'c'}
function now(){if(el('kq-pt-v1').checked)return 'portal-overview'+(el('kq-pt-pq').checked?'-q4':'');var c=f.querySelector('[name=kq-pt-ch]:checked').value;return 'portal-ops-'+(c==='amazon'?keys[cur]+(keys[cur]==='advertising'?'-'+AVN[av()]:''):c)}
function mark(push){if(typeof fit==='function')fit();var h='#'+now();if(location.hash===h)return;try{history[push?'pushState':'replaceState'](history.state,'',h)}catch(e){}}
function go(h){h=(h||'').replace(/^#/,'');if(h.indexOf('portal-')!==0)return false;if(h==='portal-overview'||h==='portal-overview-q4'){el('kq-pt-v1').checked=true;el(h==='portal-overview'?'kq-pt-pm':'kq-pt-pq').checked=true;return true}
var m=h.slice(11),v=/^advertising-(campaigns|keywords|placements)$/.exec(m),i;if(v){m='advertising';v=v[1].charAt(0);if(av()!==v){el('kq-pt-av-'+v).checked=true;say.textContent=''}}i=keys.indexOf(m);if(m==='walmart'||m==='target-plus'){el('kq-pt-v2').checked=true;el('kq-pt-c-'+m).checked=true;return true}
if(i<0)return false;el('kq-pt-v2').checked=true;el('kq-pt-c-amazon').checked=true;pick(i);return true}
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i);mark(1)});t.addEventListener('keydown',function(e){var k=e.key,n=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:k==='Home'?0:k==='End'?tabs.length-1:null;if(n===null)return;e.preventDefault();pick((n+tabs.length)%tabs.length,1);mark()})});
all('input[type=radio]').forEach(function(r){r.addEventListener('change',function(){if(r.name==='kq-pt-av')say.textContent='';mark(1)})});
var lastF=null;f.addEventListener('focusin',function(e){lastF=e.target});
function refocus(){var a=document.activeElement;if(!lastF||!f.contains(lastF)||(a!==document.body&&a!==lastF))return;if(lastF.getClientRects().length&&!(lastF.getAttribute('role')==='tab'&&lastF.getAttribute('aria-selected')!=='true'))return;
var c=f.querySelector('[name=kq-pt-ch]:checked').value,t=el('kq-pt-v1').checked?el('kq-pt-v1'):c==='amazon'?tabs[cur]:el('kq-pt-c-'+c);if(t)t.focus()}
window.addEventListener('popstate',function(){if(!go(location.hash)&&!location.hash)go('#portal-overview');fit();refocus()});
function apply(){var on=flt.getAttribute('aria-pressed')==='true',s=qi.value.toLowerCase().replace(/^\s+|\s+$/g,''),n=0,rows=all('tbody tr',panes[0]);box.style.minHeight=box.offsetHeight+'px';rows.forEach(function(r){r.hidden=(on&&!r.hasAttribute('data-step'))||(s&&r.cells[0].textContent.toLowerCase().indexOf(s)<0);if(!r.hidden)n++});none.hidden=n>0;say.textContent='Showing '+n+' of '+rows.length+' products'}
flt.addEventListener('click',function(){flt.setAttribute('aria-pressed',flt.getAttribute('aria-pressed')!=='true');apply()});qi.addEventListener('input',apply);
all('thead button').forEach(function(b){b.addEventListener('click',function(){var th=b.parentNode,i=[].indexOf.call(th.parentNode.children,th),c=th.getAttribute('aria-sort'),d=c==='descending'?'ascending':c==='ascending'||/num|desc/.test(th.className)?'descending':'ascending',tb=th.parentNode.parentNode.parentNode.tBodies[0];
all('th[aria-sort]',th.parentNode).forEach(function(x){x.setAttribute('aria-sort','none')});th.setAttribute('aria-sort',d);
[].slice.call(tb.rows).sort(function(a,c){var x=+a.cells[i].getAttribute('data-v'),y=+c.cells[i].getAttribute('data-v');return d==='ascending'?x-y:y-x}).forEach(function(r){tb.appendChild(r)});
sayFor(b).textContent='Sorted by '+b.firstChild.textContent.replace(/\s+$/,'')+', '+d})});
function txt(n,drop){n=n.cloneNode(true);all(drop,n).forEach(function(x){x.parentNode.removeChild(x)});return n.textContent.replace(/\s+/g,' ').replace(/^ | $/g,'')}
function q(s){return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function cols(c,a,drop){var d=c.getAttribute(a);if(d!==null)return d.split('|');var s=c.querySelector('small'),m=txt(c,drop);return [a==='data-c'&&s?m+' · '+txt(s,'.sr,.n'):m]}
function csv(t){var out=[[]];all('thead th',t).forEach(function(c){out[0]=out[0].concat(cols(c,'data-h','small,.sr,i,.n'))});
all('tbody tr',t).forEach(function(r){if(r.hidden)return;var row=[];[].forEach.call(r.cells,function(c){row=row.concat(cols(c,'data-c','small,.sr,.n,.sp'))});out.push(row)});
return out.map(function(r){return r.map(q).join(',')}).join('\r\n')+'\r\n'}
all('[data-csv]').forEach(function(b){b.addEventListener('click',function(){var root=el(b.getAttribute('data-csv')),t=root.tagName==='TABLE'?root:all('table',root).filter(function(x){return x.getClientRects().length&&getComputedStyle(x).visibility==='visible'})[0];if(!t)return;
var name='sample-brand-'+t.getAttribute('data-file')+'.csv',n=all('tbody tr',t).filter(function(r){return !r.hidden}).length,data='﻿'+csv(t),a=document.createElement('a');try{a.href=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}))}catch(e){a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(data)}a.download=name;a.style.display='none';f.appendChild(a);a.click();setTimeout(function(){f.removeChild(a)},0);
sayFor(b).textContent='Downloaded '+name+', '+n+' rows'})});
function ring(t){t.classList.add('kq-pt-tgt');t.addEventListener('blur',function x(){t.classList.remove('kq-pt-tgt');t.removeEventListener('blur',x)})}
all('[data-go]').forEach(function(b){b.addEventListener('click',function(){var g=b.getAttribute('data-go').split(' '),t=el(g[1]);go('#'+g[0]);mark(1);if(t){ring(t);t.focus()}})});
all('[data-ans]').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode.parentNode.parentNode,st=li.querySelector('.st'),on=b.getAttribute('aria-pressed')!=='true';all('[data-ans]',li).forEach(function(x){x.setAttribute('aria-pressed',x===b&&on)});st.textContent=on?b.getAttribute('data-ans'):st.getAttribute('data-by');osay.textContent=(on?st.textContent:'Answer cleared')+': '+li.querySelector('.at').textContent})});
all('.kq-pt-asof').forEach(function(s){var p=el(s.getAttribute('data-pop')),w=s.parentNode,b=document.createElement('button');b.type='button';b.className=s.className;b.textContent=s.textContent;b.setAttribute('aria-controls',p.id);w.replaceChild(b,s);function set(o){b.setAttribute('aria-expanded',o);p.hidden=!o}set(false);
b.addEventListener('click',function(){set(p.hidden)});w.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden){set(false);b.focus()}});
document.addEventListener('click',function(e){if(!p.hidden&&!w.contains(e.target))set(false)});w.addEventListener('focusout',function(e){if(e.relatedTarget&&!w.contains(e.relatedTarget))set(false)})});
var mm=function(q){return window.matchMedia?window.matchMedia(q):{matches:false}},mq=mm('(max-width: 760px)'),mq2=mm('(max-width: 380px)');
all('.kq-pt-dfb').forEach(function(b){var p=el(b.getAttribute('aria-controls'));function set(o){b.setAttribute('aria-expanded',o);p.classList.toggle('open',o)}set(!(b.hasAttribute('data-narrow')?mq2:mq).matches);b.addEventListener('click',function(){set(b.getAttribute('aria-expanded')!=='true')})});
var tip=f.querySelector('.kq-pt-bars .tip'),cl=['c0','c1','c2'];if(tip){var bars=tip.parentNode,cs=all('.col',bars),day=cs.length-1;
function words(c){return c.getAttribute('data-tip').split('|').map(function(x){return x.replace(/^\d /,'')})}
function show(c){var t=c.getAttribute('data-tip').split('|');tip.innerHTML='';t.forEach(function(x,i){var s=document.createElement(i?'span':'b'),m=/^(\d) /.exec(x);if(m){var k=document.createElement('i');k.className=cl[+m[1]];s.appendChild(k);x=x.slice(2)}s.appendChild(document.createTextNode(x));tip.appendChild(s)});tip.hidden=false;var l=c.offsetLeft+c.offsetWidth/2-tip.offsetWidth/2;tip.style.left=Math.max(0,Math.min(l,bars.offsetWidth-tip.offsetWidth))+'px'}
function at(d){day=d;cs.forEach(function(c,j){c.classList.toggle('cur',j===d)});var w=words(cs[d]);bars.setAttribute('aria-valuenow',d+1);bars.setAttribute('aria-valuetext',w[0]+': '+w.slice(1).join(', '));show(cs[d])}
bars.parentNode.removeAttribute('aria-hidden');bars.setAttribute('role','slider');bars.tabIndex=0;bars.setAttribute('aria-label','Sales by day, Oct 1 to '+cs.length+': left and right arrows move a day');bars.setAttribute('aria-valuemin',1);bars.setAttribute('aria-valuemax',cs.length);bars.setAttribute('aria-valuenow',cs.length);bars.setAttribute('aria-valuetext',words(cs[day])[0]+': '+words(cs[day]).slice(1).join(', '));
bars.addEventListener('mouseover',function(e){var c=e.target;while(c&&c!==bars&&!c.hasAttribute('data-tip'))c=c.parentNode;if(!c||c===bars)return;show(c)});bars.addEventListener('mouseleave',function(){if(document.activeElement===bars)show(cs[day]);else tip.hidden=true});
bars.addEventListener('click',function(e){var c=e.target;while(c&&c!==bars&&!c.hasAttribute('data-tip'))c=c.parentNode;if(c&&c!==bars){bars.focus();at(cs.indexOf(c))}});
bars.addEventListener('focus',function(){at(day)});bars.addEventListener('blur',function(){tip.hidden=true;cs.forEach(function(c){c.classList.remove('cur')})});
bars.addEventListener('keydown',function(e){var k=e.key,n=k==='ArrowRight'||k==='ArrowUp'?day+1:k==='ArrowLeft'||k==='ArrowDown'?day-1:k==='Home'?0:k==='End'?cs.length-1:k==='PageUp'?day+7:k==='PageDown'?day-7:null;if(n===null)return;e.preventDefault();at(Math.max(0,Math.min(cs.length-1,n)))})}
var views=f.querySelector('.kq-pt-views'),pt=f.querySelector('.kq-pt');
var held=0,wide=window.matchMedia?window.matchMedia('(min-width: 1101px)'):{matches:true},lastW=0;
// on a wide screen, hold the figure at its tallest state unless what shows is much shorter (then it is as tall as itself)
// measured with the figure laid out even when it is off screen (content-visibility would report its last drawn size)
// and the off-screen placeholder is set to the new height, so Back and Forward restore the scroll exactly
function fit(){if(!held){views.style.minHeight='';return}var cv=pt.style.contentVisibility;pt.style.contentVisibility='visible';views.style.minHeight='';var n=views.offsetHeight;views.style.minHeight=n>=held-300?held+'px':'';pt.style.containIntrinsicBlockSize=pt.offsetHeight+'px';pt.style.contentVisibility=cv}
function steady(){lastW=window.innerWidth;held=0;views.style.minHeight='';if(!wide.matches)return;var cv=pt.style.contentVisibility;pt.style.contentVisibility='visible';var v1=el('kq-pt-v1').checked,ch=f.querySelector('[name=kq-pt-ch]:checked'),pr=f.querySelector('[name=kq-pt-per]:checked'),ar=f.querySelector('[name=kq-pt-av]:checked'),c0=cur,m=0;
function h(){m=Math.max(m,views.offsetHeight)}el('kq-pt-v1').checked=true;el('kq-pt-pq').checked=true;h();el('kq-pt-pm').checked=true;h();el('kq-pt-v2').checked=true;el('kq-pt-c-amazon').checked=true;
panes.forEach(function(p,i){panes.forEach(function(q,j){q.classList.toggle('on',i===j)});h();if(keys[i]==='advertising')['k','p','c'].forEach(function(x){el('kq-pt-av-'+x).checked=true;h()})});
['walmart','target-plus'].forEach(function(c){el('kq-pt-c-'+c).checked=true;h()});
el(v1?'kq-pt-v1':'kq-pt-v2').checked=true;ch.checked=true;pr.checked=true;ar.checked=true;panes.forEach(function(q,j){q.classList.toggle('on',j===c0)});pt.style.contentVisibility=cv;held=m;fit()}
if(window.IntersectionObserver)new IntersectionObserver(function(e){if(e[0].isIntersecting)fit()}).observe(pt);
var rt;window.addEventListener('resize',function(){if(window.innerWidth===lastW)return;box.style.minHeight='';clearTimeout(rt);rt=setTimeout(steady,150)});window.addEventListener('load',steady);
all('button[disabled],input[disabled]').forEach(function(b){b.disabled=false});f.className+=' is-live';steady();
if(go(location.hash))window.addEventListener('load',function(){var s=document.getElementById('portal')||f;if(s.scrollIntoView)s.scrollIntoView()})})();`;

export const PORTAL_CSS = String.raw`/* the client portal example, in the portal mockups' own type sizes and colours */
/* the example is far down the page: the browser skips laying it out until it comes near the screen, holding its measured height */
.kq-pt-fig{margin:clamp(32px,4vw,56px) 0 0;contain:layout style}
.kq-pt{content-visibility:auto;contain-intrinsic-block-size:auto 1260px}
.kq-pt-sw{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 16px;font-size:16px;color:#262524}
.kq-pt-sw>span:first-child{margin-right:6px}
.kq-pt-sw .o,.kq-pt-chsw .o{position:relative;display:inline-flex}
.kq-pt-sw input,.kq-pt-chsw input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.kq-pt-sw label{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1px solid #9FB0C3;border-radius:999px;background:#FDFCFA;color:#262524;cursor:pointer}
.kq-pt-sw input:hover+label{border-color:#102A4C;color:#102A4C}
.kq-pt-sw input:checked+label{background:#102A4C;border-color:#102A4C;color:#F8F6F1;font-weight:500}
.kq-pt-sw input:focus-visible+label,.kq-pt-chsw input:focus-visible+label{outline:3px solid #00618D;outline-offset:2px}
.kq-pt{--border:#E8E8E8;--rule:#F0F1F2;--muted:#5F6368;--acc:#00618D;display:grid;grid-template-columns:212px minmax(0,1fr);background:#EEF2F4;border:1px solid #DCE3E8;border-radius:14px;box-shadow:0 30px 60px -28px rgba(10,28,54,.35),0 2px 6px rgba(10,28,54,.06);font-size:14px;line-height:20px;color:#262524;text-align:left;overflow:hidden}
.kq-pt p,.kq-pt ul,.kq-pt h3,.kq-pt h4{margin:0}.kq-pt h3,.kq-pt h4{font-family:inherit;color:inherit;letter-spacing:normal;text-transform:none}.kq-pt ul{padding:0;list-style:none}.kq-pt *{box-sizing:border-box}
.kq-pt b,.kq-pt strong{font-weight:500}
.kq-pt small{font-size:12px;color:var(--muted)}
.kq-pt .sr,.kq-pt table.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.kq-pt button{font:inherit;color:inherit;margin:0;padding:0;border:0;background:none;text-align:inherit;cursor:pointer;opacity:1}
.kq-pt button:disabled{cursor:default}
.kq-pt-fig:not(.is-live) .js,.kq-pt-fig:not(.is-live) .kq-pt-tabs [aria-selected=false],.kq-pt-fig:not(.is-live) thead i{visibility:hidden}
.kq-pt-fig:not(.is-live) .kq-pt-dfb{display:none}
.kq-pt button:focus-visible,.kq-pt-scroll:focus-visible,.kq-pt summary:focus-visible{outline:3px solid var(--acc);outline-offset:2px;border-radius:4px}
.kq-pt [tabindex="-1"]:focus,.kq-pt .kq-pt-tgt{outline:3px solid var(--acc);outline-offset:2px}
.kq-pt .hit{position:relative}.kq-pt .hit::after{content:"";position:absolute;inset:-13px -6px}.kq-pt .kq-pt-asof,.kq-pt .kq-pt-dfb{position:relative}.kq-pt .kq-pt-asof::before{content:"";position:absolute;inset:-14px -4px}.kq-pt .kq-pt-dfb::before{content:"";position:absolute;inset:-6px -4px}
.kq-pt-side{padding:14px 12px 16px;display:flex;flex-direction:column;gap:2px}
.kq-pt-brand{display:flex;align-items:baseline;gap:10px;height:34px;padding:6px 10px 0;margin-bottom:12px!important}
.kq-pt-brand b{font-weight:500;font-size:12px;letter-spacing:.24em;color:#102A4C}.kq-pt-brand span{font-size:13px;color:var(--muted);white-space:nowrap}
.kq-pt-grp{margin:14px 10px 4px!important;font-size:12px;color:var(--muted)}
.kq-pt-nv{display:flex;align-items:center;gap:10px;height:31px;padding:0 10px;border-radius:8px;color:var(--muted);white-space:nowrap}
.kq-pt-nv svg{flex:none;color:#6B7378}
.kq-pt-nv.sub{height:28px;padding-left:22px}
.kq-pt-nv.n1{background:#E1E7EA;color:#262524}
.kq-pt-usr{margin-top:auto!important;display:flex;align-items:center;gap:10px;padding:12px 10px 0}
.kq-pt-usr i{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:500;background:#102A4C;color:#F8F6F1}
.kq-pt-main{min-width:0;display:flex;flex-direction:column}
.kq-pt-top{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px 0 0}
.kq-pt-search{flex:0 1 420px;display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;margin-right:auto!important;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;color:#6B6B6B;white-space:nowrap;overflow:hidden}
.kq-pt-tag{padding:3px 10px;border-radius:999px;background:#102A4C;color:#DCBF85;font-size:12px;font-weight:500;white-space:nowrap}
.kq-pt-scope{display:inline-block;height:32px;line-height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
/* screens, channels, tab panels, periods and Advertising views: only the chosen one is laid out, so the
   figure is as tall as what is showing and the cards below the tabs follow their content directly */
.kq-pt-views,.kq-pt-chans{display:grid;grid-template-columns:minmax(0,1fr);min-width:0}.kq-pt-views{flex:1}
.kq-pt-pane,.kq-pt-av,.kq-pt-per{min-width:0}.kq-pt-pane:not(.on){display:none}
.kq-pt-sheet{grid-area:1/1;background:#FFFFFF;border:1px solid #E3E8EB;border-radius:16px;margin:0 8px 8px 0;padding:16px 24px 20px;min-width:0}
.kq-pt-chan{grid-area:1/1;min-width:0}
.kq-pt-v2,.kq-pt-k2,.kq-pt-k3,.kq-pt-per-q,.kq-pt-av,.kq-pt .pq-i,.kq-pt .cr-w,.kq-pt .cr-t{display:none}.kq-pt-fig:has(#kq-pt-c-walmart:checked) .cr-w,.kq-pt-fig:has(#kq-pt-c-target-plus:checked) .cr-t{display:inline}.kq-pt-fig:has(#kq-pt-c-walmart:checked) .cr-a,.kq-pt-fig:has(#kq-pt-c-target-plus:checked) .cr-a{display:none}.kq-pt-fig:has(#kq-pt-pq:checked) .pq-i{display:inline}.kq-pt-fig:has(#kq-pt-pq:checked) .pm-i{display:none}
.kq-pt-fig:has(#kq-pt-av-c:checked) .kq-pt-av-c,.kq-pt-fig:has(#kq-pt-av-k:checked) .kq-pt-av-k,.kq-pt-fig:has(#kq-pt-av-p:checked) .kq-pt-av-p,.kq-pt-fig:has(#kq-pt-pq:checked) .kq-pt-per-q,.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v2,.kq-pt-fig:has(#kq-pt-c-walmart:checked) .kq-pt-k2,.kq-pt-fig:has(#kq-pt-c-target-plus:checked) .kq-pt-k3{display:block}
.kq-pt-fig:has(#kq-pt-pq:checked) .kq-pt-per-m,.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v1,.kq-pt-fig:has(#kq-pt-c-walmart:checked) .kq-pt-k1,.kq-pt-fig:has(#kq-pt-c-target-plus:checked) .kq-pt-k1{display:none}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n1{background:none;color:var(--muted)}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n2{background:#E1E7EA;color:#262524}
.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-walmart:checked) .kq-pt-nv.n2,.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-target-plus:checked) .kq-pt-nv.n2{background:none;color:var(--muted)}
.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-walmart:checked) .kq-pt-nv.n3,.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-target-plus:checked) .kq-pt-nv.n4{background:#E1E7EA;color:#262524}
@supports not selector(:has(a)){.kq-pt-sw,.kq-pt-chsw,.kq-pt-seg{display:none}.kq-pt-av-c{display:block}}
.kq-pt-crumb{color:var(--muted);margin-bottom:2px!important}
.kq-pt-trow{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px 24px}
.kq-pt-frow{display:flex;justify-content:space-between;align-items:flex-start;gap:6px 32px;margin-top:4px}
.kq-pt-h1{font-size:24px;line-height:30px;font-weight:600;letter-spacing:-.01em}
.kq-pt-find{flex:1 1 30em;min-width:0;line-height:22px;max-width:60em}
.kq-pt-stamp{position:relative;flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px;line-height:16px;color:var(--muted);text-align:right}
.kq-pt .kq-pt-asof{font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt-fig.is-live .kq-pt-asof{color:var(--acc);text-decoration:underline dotted;text-underline-offset:3px}
.kq-pt-fig.is-live .kq-pt-asof::after{content:" ▾";content:" ▾"/""}
.kq-pt-pop{position:absolute;top:100%;right:0;z-index:3;width:300px;margin-top:6px;padding:10px 14px;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;box-shadow:0 10px 30px -10px rgba(10,28,54,.35);text-align:left;color:#262524}
.kq-pt-pop[hidden]{display:none}
.kq-pt-pop li{display:flex;flex-direction:column;padding:4px 0;border-top:1px solid var(--rule)}.kq-pt-pop li:first-child{border-top:0}
.kq-pt-pop li span{font-size:12px}
.kq-pt-ctl{display:flex;flex-wrap:wrap;gap:8px}
.kq-pt-ctl span{display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:#EEF2F4;color:#3D4449;white-space:nowrap;font-size:13px}
.kq-pt-chsw,.kq-pt-seg{display:flex;flex-wrap:wrap;gap:6px}.kq-pt-seg .o{position:relative;display:inline-flex}.kq-pt-seg input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}.kq-pt-seg label{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;border-radius:8px;color:var(--muted);cursor:pointer;white-space:nowrap}.kq-pt-seg input:checked+label{background:#E1E7EA;color:#262524;font-weight:500}.kq-pt-seg input:hover+label{color:#262524}.kq-pt-seg input:focus-visible+label{outline:3px solid #00618D;outline-offset:2px}.kq-pt-sums{flex:1 1 16em;min-width:0}.kq-pt-sums p{font-size:12px;line-height:16px;color:var(--muted);align-self:center}
.kq-pt-v2 .kq-pt-trow{justify-content:flex-start}
.kq-pt .kq-pt-perseg{flex-wrap:nowrap;gap:2px;margin:-6px 0}.kq-pt .kq-pt-perseg input{inset:-6px 0;height:auto;z-index:1}.kq-pt .kq-pt-perseg label{position:relative;min-height:32px;min-width:48px;justify-content:center;padding:0 10px}.kq-pt .kq-pt-perseg label::after{content:"";position:absolute;inset:-6px 0;pointer-events:none}
.kq-pt-chsw label{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;cursor:pointer;white-space:nowrap}

.kq-pt-chsw input:checked+label{background:#E1E7EA;border-color:#AEBAC1;font-weight:500}
.kq-pt-chsw input:hover+label{border-color:#8A9399}
.kq-pt-bar{display:flex;flex-wrap:wrap;align-items:center;gap:0 14px;margin-top:6px;border-bottom:1px solid var(--border)}
.kq-pt-tabs{display:flex;flex-wrap:wrap;gap:0 4px;margin-right:auto}
.kq-pt-tabs button{min-height:44px;min-width:44px;padding:0 8px;color:var(--muted);white-space:nowrap;text-align:center}
.kq-pt-tabs button[aria-selected="true"]{color:#262524;font-weight:500;box-shadow:inset 0 -2px 0 var(--acc)}
.kq-pt-fig.is-live .kq-pt-tabs button:hover{color:#262524}
.kq-pt-say{min-height:16px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt-tool{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 12px;min-height:44px;padding:4px 0}
.kq-pt-tool>p{color:var(--muted);font-size:12px;line-height:16px;flex:1 1 20em;min-width:0}
.kq-pt-tr{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.kq-pt .kq-pt-btn{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap;font-size:13px}
.kq-pt-fig.is-live .kq-pt-btn:hover{border-color:#8A9399}
.kq-pt .kq-pt-btn[aria-pressed="true"]{background:#E1E7EA;border-color:#AEBAC1}
.kq-pt .kq-pt-btn{position:relative}.kq-pt .kq-pt-btn::after{content:"";position:absolute;inset:-8px 0}
.kq-pt-flt b{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:#FFEDEA;color:#831C1E;font-size:12px}
.kq-pt-q{position:relative;display:flex;align-items:center;min-height:44px;color:#6B6B6B}
.kq-pt-q svg{position:absolute;left:10px;pointer-events:none}
.kq-pt-q input{width:170px;height:30px;margin:0;padding:0 8px 0 30px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;font:inherit;color:#262524;-webkit-appearance:none;appearance:none}
.kq-pt-q input::placeholder{color:#6B6B6B;opacity:1}
.kq-pt-q input:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.kq-pt-none{padding:14px 0;color:var(--muted)}.kq-pt-none[hidden]{display:none}
.kq-pt-card{background:#FFFFFF;border:1px solid var(--border);border-radius:8px;padding:10px 18px 12px;min-width:0;margin-top:12px}
.kq-pt-card.rec{background:#EAF3F8;border-color:#C3D8E4}
.kq-pt-kstrip{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:0!important}
.kq-pt-kstrip>li{padding:8px 16px;border-left:1px solid var(--border);min-width:0}.kq-pt-kstrip>li:first-child{border-left:0}
.kq-pt .kl{color:var(--muted);white-space:nowrap}
.kq-pt .kr{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px}
.kq-pt .kv{font-size:22px;line-height:30px;font-weight:500;letter-spacing:-.01em;white-space:nowrap}
.kq-pt .kd{margin-top:2px;font-size:12px;line-height:16px}
.kq-pt-spark{flex:1 1 30px;min-width:0;max-width:92px;height:30px;overflow:visible}
.kq-pt .pos{color:#247B50}.kq-pt .neg{color:#B42126}.kq-pt .mut{color:var(--muted)}
.kq-pt .num{text-align:right;font-variant-numeric:tabular-nums}
.kq-pt-defs,.kq-pt-note,.kq-pt-hint{margin-top:6px!important;max-width:none;font-size:12px;line-height:17px;color:var(--muted)}
.kq-pt-defs b,.kq-pt-note b{color:#262524}
.kq-pt-hint{display:none}
.kq-pt .kq-pt-dfb{display:none;align-items:center;min-height:32px;margin-top:4px;font-size:12px;font-weight:500;color:var(--acc)}
.kq-pt .kq-pt-dfb::after{content:" ▾";content:" ▾"/"";white-space:pre}.kq-pt .kq-pt-dfb[aria-expanded=true]::after{content:" ▴";content:" ▴"/""}.kq-pt .kq-pt-dfb.hd{min-height:36px;margin:0;font-size:16px;font-weight:600;color:#262524}.kq-pt .kq-pt-dfb.hd::after{color:var(--acc)}
.kq-pt-cols{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:12px;align-items:stretch}.kq-pt-cols.eq{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.kq-pt-cols.eq>div{display:flex;flex-direction:column;min-width:0}.kq-pt-cols.eq>div>.kq-pt-card:last-child{flex:1}
.kq-pt-cols.ops{grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.1fr);align-items:start}
.kq-pt-h2{font-size:16px;line-height:22px;font-weight:600}.kq-pt-csub{color:var(--muted);font-size:12px;line-height:16px}.kq-pt-att.kq-pt-fo li{display:block;padding:6px 0}.kq-pt-fo p:first-child{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.kq-pt-h2 small{margin-left:6px;font-weight:400}
.kq-pt-chead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:4px 16px}
.kq-pt-chead>h4{margin-right:auto!important}
.kq-pt-leg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;line-height:16px;color:var(--muted)}
.kq-pt-leg>span{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.kq-pt-leg i{width:14px;height:8px;border-radius:2px}
.kq-pt-leg .a,.kq-pt .gb .a,.kq-pt .c0{background:#00618D}
.kq-pt-leg .f,.kq-pt .gb .f,.kq-pt .c2{background:#99C0D1}
.kq-pt .c1{background:#4D8FB0}
.kq-pt-leg .g{width:2px;height:12px;border-radius:0;background:#262524}
/* the channel table */
.kq-pt table.chan tbody tr{height:40px}.kq-pt table.chan thead th{height:38px}.kq-pt table.chan tr.tot th,.kq-pt table.chan tr.tot td{border-bottom:0;font-weight:500}
.kq-pt table.chan td strong{font-weight:500}
.kq-pt td.gl,.kq-pt th.gl{width:30%;min-width:220px}
.kq-pt .gt{display:flex;align-items:center;gap:8px}
.kq-pt .gb{position:relative;display:block;height:8px;margin-top:5px;border-radius:4px;background:#EEF2F4}
.kq-pt .gb i{position:absolute;top:0;bottom:0;left:0;border-radius:4px}
.kq-pt .gb .g{top:-3px;bottom:-3px;width:2px;margin-left:-1px;border-radius:0;background:#262524}
/* sales by day: columns grow from one baseline, segments 2px apart, rounded at the data end only */
.kq-pt-bars{position:relative;display:block;height:76px;margin:10px 0 0 30px;padding-bottom:20px}
.kq-pt-bars .ax{position:absolute;left:-30px;right:0;top:0;bottom:20px}
.kq-pt-bars .ax>span{position:absolute;left:0;right:0;border-top:1px solid #EEF2F4}
.kq-pt-bars .ax small{position:absolute;left:0;top:-9px;width:26px;text-align:right;line-height:16px;background:#FFFFFF}
.kq-pt-bars .cols{position:absolute;left:0;right:0;top:0;bottom:20px;display:flex;align-items:flex-end;gap:2px}
.kq-pt-bars .col{position:relative;flex:1 1 0;max-width:24px;height:100%;display:flex;flex-direction:column-reverse;align-items:stretch;gap:2px;margin:0 auto}
.kq-pt-bars .col>i{display:block;min-height:1px}.kq-pt-bars .col>i:last-of-type{border-radius:4px 4px 0 0}
.kq-pt-bars .col:hover>i,.kq-pt-bars .col.cur>i{filter:brightness(.88)}.kq-pt-bars .cols:focus{outline:none}.kq-pt-bars .cols:focus-visible{outline:3px solid var(--acc);outline-offset:4px;border-radius:4px}
.kq-pt-bars .tip{display:flex;position:absolute;bottom:calc(100% + 6px);z-index:2;flex-direction:column;gap:2px;padding:8px 10px;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;box-shadow:0 8px 20px -8px rgba(10,28,54,.3);font-size:12px;line-height:16px;white-space:nowrap}
.kq-pt-bars .tip[hidden]{display:none}
.kq-pt-bars .tip i{display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:2px}
.kq-pt-bars .xl{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between}
.kq-pt-bars .xl small{line-height:16px}
.kq-pt-daily .kq-pt-bars{pointer-events:auto}
/* decisions */
.kq-pt-dec{margin-top:2px!important}
.kq-pt-dec li{padding:4px 0 5px;border-bottom:1px solid #C3D8E4}
.kq-pt-dec .ad{color:#3D4A52}
.kq-pt-dec .dm{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin-top:4px;font-size:12px;line-height:18px;color:#3D4A52}
.kq-pt-dec .dm b{color:#262524}.kq-pt-dec .dm .go{margin-left:auto}.kq-pt-dec .dw{margin-right:4px}
.kq-pt .ans{display:inline-flex;gap:8px}
.kq-pt .ans button{height:28px;padding:0 12px;border:1px solid #9FB8C8;border-radius:999px;background:#FFFFFF;font-size:12px;font-weight:500;color:#102A4C}
.kq-pt .ans button::after{inset:-9px -4px}
.kq-pt .ans button[aria-pressed=true]{background:#102A4C;border-color:#102A4C;color:#FFFFFF}
.kq-pt-card.rec .kq-pt-note{color:#3D4A52}
.kq-pt .st{color:#262524}
/* needs attention */
.kq-pt-att{margin-top:4px!important}
.kq-pt-att li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 14px;align-items:start;padding:10px 0;border-bottom:1px solid var(--rule)}
.kq-pt-att.two li{grid-template-columns:minmax(0,1fr) auto;padding:7px 0}.kq-pt-att.one li{padding:6px 0;white-space:nowrap}
.kq-pt-att.wide li{grid-template-columns:62px minmax(0,1fr) auto;grid-template-areas:"p t v" ". d d" ". o g";gap:1px 10px;align-items:baseline;padding:5px 0}.kq-pt-att.wide .pill{grid-area:p;align-self:start}.kq-pt-att.wide .at{grid-area:t}.kq-pt-att.wide .av{grid-area:v;display:block}.kq-pt-att.wide .ad{grid-area:d;margin:0}.kq-pt-att.wide .aw{grid-area:o}.kq-pt-att.wide .go{grid-area:g;justify-self:end}.kq-pt-att .aw{font-size:12px;line-height:17px;color:var(--muted)}.kq-pt-att .aw b{color:#262524}
.kq-pt-att li:last-child{border-bottom:0;padding-bottom:0}
.kq-pt .pill{display:inline-flex;align-items:center;justify-self:start;height:20px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap;vertical-align:1px}
.kq-pt .pill.bad{background:#FFEDEA;color:#831C1E}.kq-pt .pill.warn{background:#FFFBEB;color:#92400E;box-shadow:inset 0 0 0 1px #F5E3B0}.kq-pt .pill.good{background:#EAF6EF;color:#1D6340}.kq-pt .pill.flat{background:#EEF2F4;color:#3D4449}
.kq-pt .at{font-weight:500}.kq-pt .ad{margin-top:1px;color:var(--muted)}
.kq-pt .av{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.kq-pt .go{color:var(--acc);white-space:nowrap}
.kq-pt-fig.is-live .go:hover{text-decoration:underline}
.kq-pt-team ul{margin-top:4px!important}
.kq-pt-team li{padding:5px 0;border-bottom:1px solid var(--rule)}.kq-pt-team li:last-child{border-bottom:0}
.kq-pt-team li small,.kq-pt-team li>span{display:block}.kq-pt-team li small{line-height:16px}.kq-pt-log{margin-top:10px;padding-top:8px;border-top:1px solid #C3D8E4}.kq-pt-log li{display:grid;grid-template-columns:minmax(0,1fr);gap:0 12px;align-items:baseline;padding:2px 0;border-bottom:0}.kq-pt-log li small{color:#3D4A52}
.kq-pt-empty{padding:28px 32px;max-width:46em}.kq-pt-empty>p{margin-top:8px!important;max-width:40em}.kq-pt-list{margin-top:10px!important}.kq-pt-list li{position:relative;padding:3px 0 3px 18px}.kq-pt-list li::before{content:"";position:absolute;left:2px;top:11px;width:6px;height:6px;border-radius:50%;background:#99C0D1}
/* the tables: real tables, each in a scroll region so a narrow screen keeps every column */
.kq-pt-scroll{overflow-x:auto;min-width:0}
.kq-pt table{width:100%;border-collapse:collapse;line-height:18px}
.kq-pt th,.kq-pt td{padding:4px 9px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:middle;font-weight:400}
.kq-pt th:first-child,.kq-pt td:first-child{padding-left:0}.kq-pt th:last-child,.kq-pt td:last-child{padding-right:1px}
.kq-pt thead th{height:44px;padding-top:0;padding-bottom:0;font-size:12px;line-height:15px;color:var(--muted);vertical-align:bottom;border-bottom-color:var(--border);white-space:nowrap}
.kq-pt thead th:not([aria-sort]){padding-bottom:6px}
.kq-pt thead button{display:flex;flex-direction:column;justify-content:flex-end;width:100%;height:44px;padding-bottom:6px}
.kq-pt th.num button{align-items:flex-end}
.kq-pt thead i{display:inline-block;width:9px;font-style:normal;color:#8A9399}
.kq-pt th[aria-sort=none] i::before{content:"↕"}.kq-pt th[aria-sort=descending] i::before{content:"↓";color:#262524}.kq-pt th[aria-sort=ascending] i::before{content:"↑";color:#262524}
.kq-pt th[aria-sort]:not([aria-sort=none]) button>span{color:#262524;font-weight:500}
.kq-pt tbody th{font-weight:500;white-space:nowrap}
.kq-pt th small,.kq-pt td small{display:block;line-height:15px;font-weight:400}
.kq-pt td.num,.kq-pt td.dt{white-space:nowrap}
.kq-pt tbody tr{height:44px}.kq-pt table.plain tbody tr{height:40px}.kq-pt table.plain tbody th{white-space:normal}
.kq-pt tbody th:focus{outline-offset:-3px;background:#EAF3F8}
.kq-pt td.cv{min-width:112px}.kq-pt td.cv>span:first-child{display:flex;align-items:center;gap:8px}
.kq-pt .cb{position:relative;display:block;height:6px;margin:4px 0 0;border-radius:3px;background:#EEF2F4;overflow:hidden}
.kq-pt .cb b{position:absolute;top:0;bottom:0;background:#D3E0E7}
.kq-pt .cb i{position:absolute;top:0;bottom:0;left:0;border-radius:3px;background:#00618D}
.kq-pt .cb i.low{background:#C4242A}
.kq-pt td.nx{width:27%;min-width:230px}
.kq-pt-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.1fr);gap:0 28px;align-items:start}.kq-pt-two td:nth-child(4){white-space:nowrap}
.kq-pt .n,.kq-pt-tabs .n,.kq-pt .sp{display:none}
.kq-pt-fig figcaption{margin-top:14px;font-size:15px;color:#626366}
.kq-pt-points{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 32px;font-size:17px;line-height:1.5}
.kq-pt-points li{padding-top:14px;border-top:2px solid #102A4C}
.kq-pt-points strong{display:block;font-weight:500;color:#102A4C}
@media (max-width:1100px){.kq-pt{contain-intrinsic-block-size:auto 1505px}.kq-pt-dec .dm{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"w w" "a g";gap:4px 8px}.kq-pt-dec .dw{grid-area:w}.kq-pt-dec .ans{grid-area:a}.kq-pt-dec .dm .go{grid-area:g;justify-self:end}.kq-pt-two{grid-template-columns:1fr;gap:12px}.kq-pt{grid-template-columns:1fr}.kq-pt-side{display:none}.kq-pt-top{padding:0 12px}.kq-pt-sheet{margin:0 8px 8px}.kq-pt-hint{display:block}.kq-pt-hint.ph,.kq-pt-pane:last-child .kq-pt-hint{display:none}
.kq-pt table.prod{min-width:900px}.kq-pt-pane table:not(.plain){min-width:780px}.kq-pt table.chan{min-width:900px}.kq-pt table.chan tbody th{white-space:nowrap}
.kq-pt tbody th{position:sticky;left:0;z-index:1;background:#FFFFFF;padding-right:12px;box-shadow:1px 0 0 var(--rule)}
.kq-pt-kstrip{grid-template-columns:repeat(3,minmax(0,1fr))}.kq-pt-kstrip>li:nth-child(n+4){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(4){border-left:0}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}}
@media (max-width:900px){.kq-pt-cols,.kq-pt-cols.ops,.kq-pt-cols.eq{grid-template-columns:1fr}.kq-pt-two{gap:12px}.kq-pt-two table,.kq-pt-k2 table{min-width:640px}.kq-pt .kq-pt-k2 td:last-child{min-width:200px;white-space:normal}.kq-pt-two td,.kq-pt table.plain tbody th{white-space:nowrap}.kq-pt-pane:last-child .kq-pt-hint{display:block}.kq-pt-frow{flex-wrap:wrap}.kq-pt-stamp{align-items:flex-start;text-align:left}.kq-pt-pop{right:auto;left:0}}
@media (max-width:760px){.kq-pt{contain-intrinsic-block-size:auto 2190px}.kq-pt .w{display:none}.kq-pt .n,.kq-pt-tabs .n{display:inline}.kq-pt-search{display:none}.kq-pt-top{justify-content:space-between}.kq-pt-sheet{padding:14px 14px 16px}
.kq-pt-fig.is-live .kq-pt-df:not(.open){display:none}.kq-pt-fig:not(.is-live) .kq-pt-stamp>span{display:block}.kq-pt-fig.is-live .kq-pt-dfb{display:inline-flex}.kq-pt-fig.is-live .fh{display:none}.kq-pt-fig.is-live .kq-pt-dfb.nw{display:none}.kq-pt-fig.is-live .fh.nw{display:inline}.kq-pt-fig.is-live .kq-pt-daily:has(.kq-pt-df:not(.open)) .kq-pt-leg{display:none}
.kq-pt-kstrip{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-kstrip>li{padding:5px 12px 6px}.kq-pt-kstrip>li:nth-child(odd){border-left:0}.kq-pt-kstrip>li:nth-child(even){border-left:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(n+3){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}.kq-pt .kv{font-size:20px;line-height:26px}.kq-pt-kstrip .kq-pt-spark{display:none}.kq-pt-kstrip>li:nth-child(5) .kq-pt-spark{display:block;max-width:none;height:26px}
.kq-pt-card{padding:10px 14px}.kq-pt-leg{gap:2px 12px}
.kq-pt-att.wide li{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"p t t" "d d d" "o o o" "v v g";padding:8px 0}.kq-pt-att.wide .av{text-align:left}
.kq-pt tbody th,.kq-pt table.plain tbody th{white-space:normal;min-width:134px;max-width:150px}.kq-pt #kq-pt-c6-t{min-width:440px}.kq-pt #kq-pt-c6-t tbody th{white-space:nowrap;max-width:none}.kq-pt-ctl,.kq-pt-v1 .kq-pt-crumb{display:none}
.kq-pt-kstrip>li:nth-child(5){display:grid;grid-template-columns:auto 1fr;gap:0 14px;align-items:center}.kq-pt-kstrip>li:nth-child(5) .kl{grid-column:1/-1}.kq-pt-kstrip>li:nth-child(5) .kr{grid-row:2/4;margin:0}
.kq-pt table.plain tbody tr{height:32px}.kq-pt-bar{gap:0 10px}.kq-pt-tabs{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:0;flex-basis:100%}.kq-pt-tabs button{padding:0 4px}.kq-pt-say{flex-basis:100%}
.kq-pt-tool>p{flex-basis:100%}.kq-pt-tr{flex:1 1 100%}.kq-pt-q{flex:1 1 100%}.kq-pt-q input{width:100%;height:36px;font-size:16px}.kq-pt .kq-pt-btn{height:36px}
.kq-pt-trow{gap:6px 12px}.kq-pt-log li{grid-template-columns:1fr}
.kq-pt-chead{display:grid;grid-template-columns:1fr auto;align-items:center;gap:4px 8px}.kq-pt-chead .kq-pt-leg{grid-column:1/-1;grid-row:2}.kq-pt-chead .kq-pt-perseg+.kq-pt-leg{grid-column:1}.kq-pt-chead .kq-pt-perseg~.kq-pt-btn{grid-column:2;grid-row:2;justify-self:end}.kq-pt-dec li{padding:6px 0}.kq-pt-att.wide li{padding:5px 0}.kq-pt .ad{line-height:19px}.kq-pt-card{margin-top:10px}.kq-pt-chead .kq-pt-leg{gap:2px 8px}.kq-pt-dec li:last-child{border-bottom:0;padding-bottom:2px}.kq-pt-find{line-height:21px}.kq-pt-leg>span{gap:4px}
.kq-pt-log{margin-top:8px}
.kq-pt-kkey{margin-top:6px!important;font-size:12px;line-height:16px;color:var(--muted)}.kq-pt-kkey+.kq-pt-card{margin-top:4px}.kq-pt .kd{display:inline}.kq-pt table.chan{min-width:900px}.kq-pt table.chan tbody th .sp{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;margin-top:3px}.kq-pt .sp .sg{font-size:12px;line-height:16px;font-weight:400;color:var(--muted)}.kq-pt table.chan tbody th small{display:none}.kq-pt .kq-pt-btn::after{inset:-5px 0}.kq-pt-v2 .kq-pt-frow{margin-bottom:10px}.kq-pt .kq-pt-asof{display:inline-block;padding:7px 0}.kq-pt .kq-pt-asof::before{inset:-7px -4px}.kq-pt-tool{padding-bottom:6px}.kq-pt table.chan tbody th{min-width:150px;max-width:156px}.kq-pt table.chan td:nth-child(2){white-space:normal;min-width:92px}.kq-pt table.chan{min-width:0}.kq-pt table.chan thead th:nth-child(2){white-space:normal}.kq-pt-stamp>span{display:none}
.kq-pt-bars{height:76px}.kq-pt .kq-pt-hint{display:inline-block;margin-right:14px}.kq-pt-chsw label{padding:0 10px}
.kq-pt-sw{font-size:15px}.kq-pt-sw>span:first-child{flex-basis:100%}.kq-pt-sw label{padding:0 14px}.kq-pt-empty{padding:16px}}
@media (max-width:380px){.kq-pt-fig.is-live .kq-pt-dfb.nw{display:inline-flex}.kq-pt-fig.is-live .fh.nw{display:none}.kq-pt{contain-intrinsic-block-size:auto 2610px}.kq-pt table.chan tbody th{min-width:112px;max-width:118px}.kq-pt table.chan td:nth-child(2),.kq-pt table.chan thead th:nth-child(2){padding-left:4px;padding-right:6px}.kq-pt table.chan td:nth-child(2){min-width:80px}.kq-pt-bars{height:64px}.kq-pt-card{padding:10px 12px}.kq-pt .xw{display:none}.kq-pt .kv{font-size:18px}.kq-pt-kstrip>li{padding:8px 10px}.kq-pt-tabs{grid-template-columns:repeat(auto-fill,minmax(64px,1fr))}.kq-pt-tabs button{font-size:13px}}
@media (forced-colors:active){.kq-pt .gb,.kq-pt .gb i,.kq-pt .cb,.kq-pt .cb i,.kq-pt .cb b,.kq-pt-bars .col>i,.kq-pt-leg i,.kq-pt-pop li::before,.kq-pt-list li::before{forced-color-adjust:none}}
/* end of the client portal example */
`;
