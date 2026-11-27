// The client portal example shown on Why Kwontified (and wherever else the site shows the portal).
//
// It is a working model of the product, not live data: HTML, CSS and a small inline script drawn in
// the visual language of the Kwontified Client Portal mockups (Jordan's design artifact,
// https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9), with a sample brand's figures. It shows the
// portal as it is planned, with two screens, one for each kind of reader the portal serves:
//   1. Overview: what an executive opens. The month against goal for each channel (sales to date,
//      forecast with its likely range, ad spend against plan, ROAS, TACoS), contribution after
//      Amazon fees and ad spend, sales by day, the decisions waiting for the client (which they can
//      answer), what needs attention with its owner, status and date, and what the team did.
//   2. Operations: what the people who run the channels open. A channel switch (Amazon, Walmart,
//      Target Plus). Amazon has seven tabs, each a real table that sorts and exports to CSV
//      (Products, Advertising by campaign, Search terms, Inventory, Returns and repeat, Promotions,
//      Account health), then inbound shipments and the week's changes. Walmart has a short item
//      view; Target Plus shows the honest "no feed for this account yet" state.
//
// How it works
//   - The screen switch and the channel switch are radio groups and CSS (:has), so they work
//     without the script. Screens, channels and tab panels each share one grid cell and the ones
//     not chosen are hidden with visibility, so the page never moves.
//   - Everything else is switched on by PORTAL_JS: the tabs (a tablist with arrow keys), search and
//     the "With an open step" filter, column sorting (aria-sort), CSV export, the "Data as of"
//     freshness panel, Agree and Discuss on each decision, and the buttons that open the place in
//     the example where a number's detail is. The screen and tab are kept in the address
//     (#portal-ops-inventory and so on), so Back returns to where you were. Without the script none
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
// it follows. Keep the picture under about 1,150px tall at 1440px wide, 2,100px on an iPhone 13 and
// 2,400px at 320px: it is as tall as the taller screen, so measure both after any change.
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
const ASOF = "Oct 24, 6:00 a.m. ET", INV_ASOF = "Oct 24, 5:40 a.m. ET";
const DAYS = 23, DAYS_LEFT = 8, LEAD_WEEKS = 5, COVER = [8, 12];
check(new Date(Date.UTC(2026, 9, 1)).getUTCDay() === 4 && date(0) === "Oct 24" && date(8) === "Nov 1", "the calendar");

// ---- the sample brand by channel, October to date --------------------------------------------------
const CH = [
  // sales and ad spend to date, ad-attributed sales, the October ad budget agreed with the client, the
  // October goal, the forecast and its likely range (80%)
  { n: "Amazon", thru: "Oct 23", days: 23, sales: 908400, spend: 88350, adSales: 410828, plan: 122000, goal: 1240000, fc: 1229100, lo: 1223000, hi: 1236000 },
  { n: "Walmart", thru: "Oct 22", days: 22, sales: 228100, spend: 18900, adSales: 66717, plan: 26000, goal: 310000, fc: 318000, lo: 311000, hi: 325000 },
  { n: "Target Plus", thru: "Oct 22", days: 22, sales: 101600, spend: 7690, adSales: 24608, plan: 10500, goal: 140000, fc: 142500, lo: 137000, hi: 148000 },
];
const ALL = { n: "All channels", sales: sum(CH, (c) => c.sales), spend: sum(CH, (c) => c.spend), adSales: sum(CH, (c) => c.adSales), plan: sum(CH, (c) => c.plan), goal: sum(CH, (c) => c.goal), fc: sum(CH, (c) => c.fc) };
// the channels' ranges combined as independent errors (root of the sum of squares)
ALL.lo = r1k(ALL.fc - Math.sqrt(sum(CH, (c) => (c.fc - c.lo) ** 2)));
ALL.hi = r1k(ALL.fc + Math.sqrt(sum(CH, (c) => (c.hi - c.fc) ** 2)));
const roas = ALL.adSales / ALL.spend, tacos = (100 * ALL.spend) / ALL.sales;
const AMZ = CH[0], amzGap = AMZ.goal - AMZ.fc;
check(ALL.sales === 1238100 && ALL.spend === 114940 && roas.toFixed(2) === "4.37" && tacos.toFixed(1) === "9.3", "channel totals");
check(amzGap === 10900 && ALL.goal - ALL.fc === 400 && ALL.lo === 1679000 && ALL.hi === 1701000, "goal gaps and ranges");
check(CH.every((c) => c.lo <= c.fc && c.fc <= c.hi) && AMZ.hi < AMZ.goal, "each forecast inside its range; Amazon's range below goal");
check((AMZ.adSales / AMZ.spend).toFixed(2) === "4.65" && ((100 * CH[1].spend) / CH[1].sales).toFixed(1) === "8.3", "the mockup's channel table");
const ON_GOAL = 0.0025; // within 0.25% of goal reads "On goal"

// contribution on Amazon: sales less refunds, Amazon's fees, promotions and ad spend (no product cost)
const COSTS = { refunds: 15400, referral: 133950, fulfilment: 109040, storage: 7410, promotions: 11800 };
const contribution = AMZ.sales - sum(Object.values(COSTS), (v) => v) - AMZ.spend, contribShare = ((100 * contribution) / AMZ.sales).toFixed(1);
check(contribution === 542450 && contribShare === "59.7", "contribution");

// ---- sales by day, by channel: a weekly rhythm, Prime Big Deal Days on Oct 7 and 8, scaled to the totals
const DOW = [0.95, 1.05, 1.03, 1.0, 0.98, 0.97, 1.02]; // Sunday to Saturday
const BDD_EXTRA = 8220; // the deal's extra Amazon sales on each of the two days (see PROMOS)
function byDay(c, wave, spike) {
  const raw = Array.from({ length: c.days }, (_, d) => DOW[(4 + d) % 7] * (1 + 0.004 * d) * (1 + wave * Math.sin(d * 1.9)));
  const base = (c.sales - spike * 2) / sum(raw, (x) => x);
  const v = raw.map((x, d) => r10(x * base + (spike && (d === 6 || d === 7) ? spike : 0)));
  const big = v.indexOf(Math.max(...v)); v[big] += c.sales - sum(v, (x) => x);
  return v;
}
const DAILY = [byDay(CH[0], 0.03, BDD_EXTRA), byDay(CH[1], 0.05, 0), byDay(CH[2], 0.06, 0)];
check(DAILY.every((v, i) => sum(v, (x) => x) === CH[i].sales && v.length === CH[i].days), "sales by day against the channel totals");
const dayTotal = (d) => sum(DAILY, (v) => v[d] || 0);
const span = (a, b) => { let t = 0; for (let d = a; d <= b; d++) t += dayTotal(d); return t; };

// eight complete weeks, Aug 25 to Oct 19 (all channels, in thousands; contribution is Amazon's). The
// three October weeks come from the days above; Sep 29 and 30 run at September's daily rate.
const SEP = { sales: ALL.sales / 1.083, spend: ALL.spend / 1.084, roas: roas / 1.017, contrib: contribution / 1.074 };
const wk = (v) => (v / DAYS) * 7;
const amzWeek = (a, b) => { let t = 0; for (let d = a; d <= b; d++) t += DAILY[0][d]; return t; };
const WK = {
  sales: [340, 345, 347, 352, 358, Math.round((span(0, 4) + (2 * SEP.sales) / DAYS) / 1000), Math.round(span(5, 11) / 1000), Math.round(span(12, 18) / 1000)],
  spend: [31.8, 32.0, 32.3, 32.6, 33.2, 33.9, 35.2, 34.8],
  roas: [4.24, 4.28, 4.3, 4.32, 4.33, 4.35, 4.39, 4.36],
  contrib: [150, 152, 153, 156, 158, 162, Math.round((amzWeek(5, 11) * contribShare) / 100000), Math.round((amzWeek(12, 18) * contribShare) / 100000)],
};
WK.tacos = WK.sales.map((s, i) => (100 * WK.spend[i]) / s);
const avg = (a, i, j) => sum(a.slice(i, j + 1), (x) => x) / (j - i + 1);
for (const k of ["sales", "spend", "contrib"]) {
  const scale = k === "spend" || k === "sales" ? 1000 : 1000;
  check(near(avg(WK[k], 1, 3) * scale, wk(SEP[k]), 0.02), `the ${k} line in September (${avg(WK[k], 1, 3)} against ${Math.round(wk(SEP[k]))})`);
  check(near(avg(WK[k], 6, 7) * scale, wk(k === "contrib" ? contribution : ALL[k]), 0.035), `the ${k} line in October (${avg(WK[k], 6, 7)} against ${Math.round(wk(k === "contrib" ? contribution : ALL[k]))})`);
}
check(near(avg(WK.roas, 1, 3), SEP.roas, 0.01) && near(avg(WK.roas, 6, 7), roas, 0.01), "the ROAS line");

// ---- Amazon products, Oct 1 to 23 -------------------------------------------------------------------
// sales, Sponsored ads sales, units, sessions, change on Sep 1 to 23, Featured Offer %, rating and
// ratings, sales rank, units on hand, inbound, average weekly units (four weeks), units returned, top
// return reason, repeat buyers %, Subscribe and Save subscriptions, and the open step if there is one
const PRODUCTS = [
  { n: "Retinol serum", sku: "SKN-RS-30", sales: 129500, ad: 53611, units: 3083, sess: 39025, chg: 9.8, fo: 99.2, rt: 4.5, rc: 2140, rank: 1420, on: 2700, inb: 3000, wk: 938, ret: 96, why: "Not as expected", rep: 24, sns: 610 },
  { n: "Gift set", sku: "SKN-GS-3P", sales: 67700, ad: 31445, units: 1058, sess: 25190, chg: 38.5, fo: 78.4, rt: 4.6, rc: 380, rank: 5600, on: 980, inb: 2000, wk: 322, ret: 19, why: "Arrived damaged", rep: 6, sns: 0, tag: ["bad", "Suppressed"], step: "Corrected image with Amazon", who: "Creative Studio · filed Oct 20, next check Oct 25" },
  { n: "Mineral sunscreen", sku: "SKN-MS-50, -100", sales: 107100, ad: 41094, units: 3825, sess: 56250, chg: -3.4, fo: 87.2, rt: 4.3, rc: 1920, rank: 1860, on: 9800, inb: 0, wk: 1164, ret: 61, why: "No longer needed", rep: 22, sns: 420, tag: ["bad", "Suppressed"], step: "Safety data sheet with Amazon", who: "<span class=\"w\">Marketplace </span>Operations · both sizes, filed Oct 17, next check Oct 25" },
  { n: "Eye cream", sku: "SKN-EC-15", sales: 54600, ad: 19847, units: 1517, sess: 24869, chg: 1.7, fo: 99.4, rt: 4.4, rc: 860, rank: 3900, on: 4100, inb: 0, wk: 462, ret: 26, why: "Not as expected", rep: 19, sns: 280, tag: ["warn", "Listing issue"], step: "Bullet point rewrite due Oct 27", who: "<span class=\"w\">Marketplace </span>Operations · restricted claim, in progress" },
  { n: "Vitamin C serum", sku: "SKN-VC-30", sales: 262400, ad: 90083, units: 6905, sess: 75880, chg: 14.2, fo: 97.8, rt: 4.6, rc: 5310, rank: 410, on: 13100, inb: 9000, wk: 2102, ret: 124, why: "No longer needed", rep: 31, sns: 1840 },
  { n: "Night cream", sku: "SKN-NC-50", sales: 169800, ad: 56579, units: 3691, sess: 48566, chg: 6.1, fo: 99.6, rt: 4.5, rc: 2480, rank: 1150, on: 7400, inb: 4500, wk: 1123, ret: 89, why: "Arrived damaged", rep: 27, sns: 960 },
  { n: "Foaming cleanser", sku: "SKN-FC-15", sales: 75000, ad: 22719, units: 4167, sess: 49607, chg: 2.2, fo: 99.0, rt: 4.7, rc: 3090, rank: 890, on: 10600, inb: 0, wk: 1268, ret: 50, why: "Ordered by mistake", rep: 35, sns: 1310 },
];
const OTHER_SALES = 42300, OTHER_AD_SALES = 13240, DSP_SALES = 82210, PRODUCT_COUNT = 31;
const shownSales = sum(PRODUCTS, (p) => p.sales);
check(shownSales + OTHER_SALES === AMZ.sales, "product sales against the Amazon total");
check(sum(PRODUCTS, (p) => p.ad) + OTHER_AD_SALES + DSP_SALES === AMZ.adSales, "product ad sales against the Amazon total");
check(PRODUCTS.every((p) => near(wk(p.units), p.wk, 0.01)), "weekly units follow from units sold");
const shownShare = Math.round((100 * shownSales) / AMZ.sales);
// one cover rule everywhere: weeks of cover counts stock on hand and inbound; under 8 weeks is low and
// gets a suggested order back to 12 weeks (in cases of 100); order by is the day cover reaches the
// five-week lead time; stock runs out when cover reaches zero
const cover = (p) => (p.on + p.inb) / p.wk;
const low = (p) => cover(p) < COVER[0];
const order = (p) => (low(p) ? Math.ceil((COVER[1] * p.wk - p.on - p.inb) / 100) * 100 : 0);
const orderBy = (p) => date((cover(p) - LEAD_WEEKS) * 7), runsOut = (p) => date(cover(p) * 7);
const retinol = PRODUCTS[0];
retinol.tag = ["bad", "Low cover"]; retinol.step = `Order ${num(order(retinol))} by ${orderBy(retinol)}`; retinol.who = "<span class=\"w\">Marketplace </span>Operations · awaiting your decision";
check(cover(retinol).toFixed(1) === "6.1" && order(retinol) === 5600 && orderBy(retinol) === "Oct 31" && runsOut(retinol) === "Dec 5", "retinol serum cover and reorder");
check(PRODUCTS.filter(low).length === 1 && PRODUCTS.every((p) => p === retinol || (cover(p) >= COVER[0] && cover(p) <= COVER[1])), "only the retinol serum is outside the cover target");
const retinolWeekly = Math.round((retinol.wk * retinol.sales) / retinol.units / 100) * 100;
const weekly = (p) => r100(wk(p.sales));
check(retinolWeekly === 39400, "retinol serum weekly sales");
const withStep = PRODUCTS.filter((p) => p.tag), suppressed = PRODUCTS.filter((p) => p.tag && p.tag[1] === "Suppressed");
check(withStep.length === 4 && suppressed.length === 2, "open steps");
const byName = PRODUCTS.map((p) => p.n).sort();
const rowId = (p) => "kq-pt-i-" + p.sku.replace(/[^A-Za-z0-9-]/g, "");

const SHIPMENTS = [["Vitamin C serum", 9000, "receiving", "Oct 26"], ["Retinol serum", 3000, "in transit", "Oct 29"], ["Gift set", 2000, "in transit", "Oct 31"], ["Night cream", 4500, "ready to ship", "Nov 6"]];
const inboundUnits = sum(SHIPMENTS, (s) => s[1]);
check(inboundUnits === sum(PRODUCTS, (p) => p.inb) && SHIPMENTS.every(([n, u]) => PRODUCTS.find((p) => p.n === n).inb === u), "inbound units");
const due = (p) => (SHIPMENTS.find((s) => s[0] === p.n) || [])[3];

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
].map(([n, type, day, spend, sales, hrs]) => ({ n, type, day, spend, sales, hrs, roas: sales / spend, missed: hrs ? r10((day / 24) * hrs * (sales / spend)) : 0 }));
const CAMPAIGN_COUNT = 24, capped = CAMPAIGNS.filter((c) => c.hrs);
const shownSpend = sum(CAMPAIGNS, (c) => c.spend), spendShare = Math.round((100 * shownSpend) / AMZ.spend);
check(shownSpend < AMZ.spend && sum(CAMPAIGNS, (c) => c.sales) < AMZ.adSales && spendShare === 80, "campaigns against the Amazon totals");
check(CAMPAIGNS.every((c) => !c.day || c.spend <= c.day * DAYS) && capped.find((c) => c.day === 280).spend <= 250 * 18 + 280 * 5, "spend within daily budgets (the video budget went from $250 to $280 on Oct 19)");
const cappedHrs = sum(capped, (c) => c.hrs), cappedMissed = sum(capped, (c) => c.missed);
check(capped.length === 3 && cappedHrs === 89 && cappedMissed === 5100, "campaigns out of budget");
const rRange = `${Math.min(...capped.map((c) => c.roas)).toFixed(2)}x to ${Math.max(...capped.map((c) => c.roas)).toFixed(2)}x`;
check(rRange === "4.06x to 5.21x", "returns of the campaigns out of budget");

// ---- the two recommendations on the Amazon gap, sized to what was missed ------------------------------
const REST = 7; // Oct 25 to 31, once agreed on Oct 24
const lift = { spend: r10(((sum(capped, (c) => c.day * c.hrs) / 24) * REST) / DAYS), sales: r100((cappedMissed * REST) / DAYS) };
check(lift.spend === 330 && lift.sales === 1600, "the budget lift is sized to the hours missed");
// a 10% coupon on the vitamin C serum for Oct 27 to 31, at the lift and redemption the September coupon had
const SEPC = { sales: 45600, lift: 9, cost: 2500 }, redeemed = (SEPC.cost * 9) / SEPC.sales; // share of sales that used the coupon
const vc = PRODUCTS[4], coupon = { days: 5, base: (vc.sales / DAYS) * 5 };
coupon.sales = coupon.base * (1 + SEPC.lift / 100); coupon.more = r100(coupon.sales - coupon.base); coupon.cost = r100((coupon.sales / 9) * redeemed);
check(coupon.more === 5100 && coupon.cost === 3400, "the coupon recommendation");
const recovered = lift.sales + coupon.more;
check(recovered === 6700 && recovered < amzGap, "the recommendations against the gap");

// ---- promotions: what ran, what is running, what is proposed or booked --------------------------------
const PROMOS = [
  { id: "kq-pt-pr-new", n: "Coupon, 10% off", what: "Vitamin C serum", when: "Oct 27 to 31", sales: `${usd(r100(coupon.sales))} est.`, sv: coupon.sales, lift: `+${SEPC.lift}% est.`, lv: SEPC.lift, cost: `${usd(coupon.cost)} est.`, cv: coupon.cost, st: ["warn", "Proposed"], note: "awaiting your decision, by Oct 25" },
  { n: "Prime Big Deal Days, 20% off", what: "Night cream, eye cream", when: "Oct 7 to 8", sales: usd(36000), sv: 36000, lift: "+84%", lv: 84, cost: usd(9000), cv: 9000, st: ["flat", "Ended"], note: "deal on both products" },
  { n: "Subscribe and Save, extra 5%", what: "Six products", when: "Oct 1 to 31", sales: usd(53200), sv: 53200, lift: "Not measured", lv: -1, cost: usd(2800), cv: 2800, st: ["good", "Running"], note: "sales and cost to Oct 23" },
  { n: "Coupon, 10% off", what: "Vitamin C serum", when: "Sep 8 to 21", sales: usd(SEPC.sales), sv: SEPC.sales, lift: `+${SEPC.lift}%`, lv: SEPC.lift, cost: usd(SEPC.cost), cv: SEPC.cost, st: ["flat", "Ended"], note: "the basis for the proposal" },
  { n: "Coupon, 15% off", what: "Gift set", when: "Nov 13 to Dec 2", sales: "Not started", sv: 0, lift: "Not started", lv: -1, cost: "Not started", cv: 0, st: ["good", "Booked"], note: "in the holiday plan" },
];
check(Math.round((36000 / 0.8) * 0.2) === 9000 && 2800 === Math.round((53200 / 0.95) * 0.05) && 9000 + 2800 === COSTS.promotions, "October promotion costs against contribution");
check(near((BDD_EXTRA * 2 + 19560) / 19560 - 1, 0.84, 0.01) && 36000 - 19560 === 2 * BDD_EXTRA, "the deal's lift and its extra sales by day");

// ---- search terms the team acted on (search share is Brand Analytics, week to Oct 17) -----------------
const TERMS = [
  ["vitamin c serum for face", 8.4, 9.1, 1840, 6.75, "Moved to exact match", "Retail Media and Advertising", "done Oct 22"],
  ["vitamin c serum", 6.1, 6.8, 2310, 5.12, "Bid raised 10%", "Retail Media and Advertising", "done Oct 20"],
  ["retinol serum", 4.9, 5.3, 2950, 5.48, "Budget cap lift", "Retail Media and Advertising", "awaiting your decision"],
  ["night cream for face", 3.7, 4.2, 1260, 5.31, "Top-of-search bid adjustment", "Retail Media and Advertising", "done Oct 19"],
  ["mineral sunscreen for face", 2.6, 2.1, 980, 2.94, "Listing review: price and images", "Marketplace Operations", "proposed, due Oct 28"],
  ["eye cream for dark circles", 1.8, 1.5, 520, 3.1, "Hold until the bullet fix", "Marketplace Operations", "review Oct 28"],
  ["sunscreen spf 50 face", 0.9, 0.3, 640, 0.64, "Added as a negative", "Retail Media and Advertising", "done Oct 22"],
];
const TERM_COUNT = 412;

// ---- Walmart items, Oct 1 to 22 ---------------------------------------------------------------------
// sales, Buy Box win rate, listing quality score, Walmart Fulfillment Services weeks of cover (with inbound)
const WM = [
  ["Vitamin C serum", 71400, 98.1, 92, 9.4],
  ["Retinol serum", 46200, 96.4, 88, 3.1, "WFS inbound booked for Oct 28"],
  ["Mineral sunscreen", 38900, 91.2, 74, 4.0, "WFS inbound booked for Oct 28"],
  ["Night cream", 33100, 99.0, 90, 10.2],
  ["Foaming cleanser", 21800, 97.5, 85, 8.6],
];
const WMADS = [["Sponsored Products, keyword", 7810, 30460], ["Sponsored Products, automatic", 6240, 21840], ["Sponsored Brands", 2950, 8850], ["Display", 1900, 5567]];
const WMLQ = [["Mineral sunscreen", "Score 74: three of five recommended images; SPF value missing", "Creative Studio, due Oct 30"], ["Foaming cleanser", "Score 85: title over Walmart’s 75 characters", "Operations, due Oct 28"], ["Retinol serum", "Score 88: two attributes missing", "Operations, due Oct 31"]];
check(sum(WMADS, (a) => a[1]) === CH[1].spend && sum(WMADS, (a) => a[2]) === CH[1].adSales, "Walmart Connect against the Walmart totals");
const wmWeekly = r100(sum(WM.filter((w) => w[4] < COVER[0]), (w) => (w[1] / 22) * 7)), wmShown = sum(WM, (w) => w[1]), wmShare = Math.round((100 * wmShown) / CH[1].sales), wmLow = WM.filter((w) => w[4] < COVER[0]);
check(WMLQ.every(([n, d]) => d.startsWith("Score " + WM.find((w) => w[0] === n)[3])), "listing quality scores") ; check(wmShown < CH[1].sales && wmShare === 93 && wmLow.length === 2 && wmLow.every((w) => w[5]), "Walmart items");

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

const ICON = { 0: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/></svg>', 1: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2.5 12.5l3.5-4 3 2.5 4.5-6"/></svg>' };
const SEARCH = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5l3 3" stroke-linecap="round"/></svg>';
const RMA = `<span class="w">Retail Media and </span>Advertising`, MO = `<span class="w">Marketplace </span>Operations`;

// controls the script switches on (all written disabled, and hidden until the script runs)
// a button that opens the place in the example where the detail is: "hash target"
const go = (label, hash, target, about) => `<button type="button" class="go hit js" data-go="${hash} ${target}" disabled>${label}<span class="sr"> ${about}</span> <span aria-hidden="true">→</span></button>`;
const exportBtn = (what) => `<button type="button" class="kq-pt-btn js" data-csv="${what}" disabled>Export CSV</button>`;
// a table inside its own scroll region, so a narrow screen can scroll it sideways with every column kept
const tbl = (id, caption, head, body, cls = "") => `<div class="kq-pt-scroll" role="region" id="${id}-r" aria-labelledby="${id}" tabindex="0"><table class="${cls}" id="${id}-t"><caption id="${id}" class="sr">${caption}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
const th = (label, small, sort = true, cls = "num") => `<th scope="col" class="${cls}"${sort ? ' aria-sort="none"' : ""}>${sort ? `<button type="button" disabled><span>${label} <i aria-hidden="true"></i></span>${small ? `<small>${small}</small>` : ""}</button>` : `${label}${small ? `<small>${small}</small>` : ""}`}</th>`;
const td = (v, a, b, cls = "num") => `<td class="${cls}" data-v="${v}">${a}${b === undefined ? "" : `<small>${b}</small>`}</td>`;
const HINT = `<p class="kq-pt-hint">Scroll<span class="w"> the table</span> sideways<span class="w"> to see every column</span>.</p>`;
const pill = (k, t) => `<span class="pill ${k}">${t}</span>`;
// definitions: always shown on a wide screen; on a phone the script folds them behind a button
let defN = 0;
const fold = (label, html, tag = "p", cls = "kq-pt-note") => { const id = "kq-pt-df" + ++defN; return `<button type="button" class="kq-pt-dfb js" aria-expanded="false" aria-controls="${id}" disabled>${label}</button><${tag} class="${cls} kq-pt-df" id="${id}">${html}</${tag}>`; };
const defs = (html, cls) => fold("Definitions", html, "p", cls);
// a heading that becomes a disclosure button on a phone (with the script): the heading stays a heading
const foldHead = (text, small = "") => { const id = "kq-pt-df" + ++defN; return [`<h4 class="kq-pt-h2"><span class="fh">${text}${small}</span><button type="button" class="kq-pt-dfb hd js" aria-expanded="false" aria-controls="${id}" disabled>${text}</button></h4>`, id]; };
// the "Data as of" stamp: the time, then each source's date in a panel the script opens
const FRESH = [["Amazon sales and traffic", "to Oct 23"], ["Amazon ads", "to Oct 23; the last 14 days are provisional"], ["Amazon search share (Brand Analytics)", "week to Oct 17"], ["Amazon inventory and shipments", INV_ASOF], ["Walmart", "to Oct 22"], ["Target Plus", "to Oct 22, uploaded by hand: no feed yet"]];
const stamp = (n, line2) => `<div class="kq-pt-stamp"><span class="kq-pt-asof" data-pop="kq-pt-fr${n}">Data as of ${ASOF}</span><span>${line2}</span><div class="kq-pt-pop" id="kq-pt-fr${n}" hidden><p class="at">Freshness by source</p><ul>${FRESH.map(([a, b]) => `<li><span>${a}</span><small>${b}</small></li>`).join("")}</ul></div></div>`;

export function portalSection({ section, two, H2, P }) {
  defN = 0;
  const NAV = [["Overview", 0, "n1"], ["Channels", "g"], ["Amazon", 0], ["Sales", 1], ["Advertising", 1], ["Marketing Cloud", 1], ["Operations", 1, "n2"], ["Walmart", 0], ["Target Plus", 0], ["Your account", "g"], ["Reports and forecasts", 0], ["Call notes and projects", 0], ["Team and access", 0]];
  const side = `<div class="kq-pt-side" aria-hidden="true"><p class="kq-pt-brand"><b>KWONTIFIED</b><span>Client portal</span></p>${NAV.map(([label, kind, cls]) => (kind === "g" ? `<p class="kq-pt-grp">${label}</p>` : `<p class="kq-pt-nv${kind ? " sub" : ""}${cls ? " " + cls : ""}">${ICON[kind]}<span>${label}</span></p>`)).join("")}<p class="kq-pt-usr"><i>SU</i><span>Sample user</span></p></div>`;
  const top = `<div class="kq-pt-top"><p class="kq-pt-search" aria-hidden="true">${SEARCH}Search dashboards, products and reports</p><p class="kq-pt-tag">Illustrative example</p><p class="kq-pt-scope">Sample<span class="xw"> skincare</span> brand</p></div>`;

  // ---- screen 1: Overview, for an executive ---------------------------------------------------
  const KPIS = [
    ["Total sales", usd(ALL.sales), ["+8.3%", "pos"], ["+21.6%", "pos"], WK.sales],
    ["Ad spend", usd(ALL.spend), ["+8.4%", "mut"], ["+17.9%", "mut"], WK.spend],
    ["ROAS", roas.toFixed(2) + "x", ["+1.7%", "pos"], ["+3.1%", "pos"], WK.roas],
    ["TACoS", tacos.toFixed(1) + "%", ["+0.0 pts", "mut"], ["−0.3 pts", "pos"], WK.tacos],
    ["Contribution, Amazon", usd(contribution), ["+7.4%", "pos"], ["+20.3%", "pos"], WK.contrib],
  ];
  const kstrip = `<p class="kq-pt-kkey n">Change vs Sep 1 to 23 · vs 2025</p><ul class="kq-pt-card kq-pt-kstrip">${KPIS.map(([l, v, a, b, s]) => `<li><p class="kl">${l}</p><div class="kr"><p class="kv">${v}</p>${spark(s)}</div><p class="kd"><span class="${a[1]}">${a[0]}</span> <span class="mut w">vs Sep 1 to 23</span></p><p class="kd"><span class="n mut">· </span><span class="${b[1]}">${b[0]}</span> <span class="mut w">vs Oct 1 to 23, 2025</span></p></li>`).join("")}</ul>
${defs(`<b>Total sales</b> ordered sales before refunds. <b>Ad spend</b> Amazon ads and DSP, Walmart Connect, Target Roundel. <b>ROAS</b> ad-attributed sales ÷ ad spend. <b>TACoS</b> ad spend ÷ total sales. <b>Contribution</b> Amazon sales less refunds, fees, promotions and ad spend, before product cost (${contribShare}% of sales). Lines: the eight weeks to Oct 19.`, "kq-pt-defs")}`;

  const SCALE = 1.1; // the bars run to 110% of goal, so a forecast above goal still fits
  const status = (c) => { const gap = c.fc - c.goal; return Math.abs(gap) / c.goal < ON_GOAL ? pill("flat", "On goal") : gap < 0 ? pill("warn", `${usd(-gap)} short`) : pill("good", `${usd(gap)} ahead`); };
  const gbar = (c) => { const w = (v) => ((100 * v) / c.goal / SCALE).toFixed(1); return `<span class="gb" aria-hidden="true"><i class="f" style="width:${w(c.fc)}%"></i><i class="a" style="width:${w(c.sales)}%"></i><i class="g" style="left:${(100 / SCALE).toFixed(1)}%"></i></span>`; };
  const chRow = (c, total) => `<tr${total ? ' class="tot"' : ""}><th scope="row">${c.n}<small>${c.thru ? `to ${c.thru}` : "combined"}</small></th><td class="num"><strong>${usd(c.fc)}</strong><small>${usd(c.lo)} to ${usd(c.hi)}</small></td><td class="gl"><span class="gt">${status(c)} <small>${pct((100 * c.fc) / c.goal)} of ${usd(c.goal)}</small></span>${gbar(c)}</td><td class="num">${usd(c.sales)}</td><td class="num">${usd(c.spend)}<small>${pct((100 * c.spend) / c.plan, 0)} of ${usd(c.plan)}</small></td><td class="num">${(c.adSales / c.spend).toFixed(2)}x</td><td class="num">${pct((100 * c.spend) / c.sales)}</td></tr>`;
  const channels = `<div class="kq-pt-card"><div class="kq-pt-chead"><h4 class="kq-pt-h2">October by channel <small class="w">forecast against goal, then the month so far</small></h4><p class="kq-pt-leg" aria-hidden="true"><span><i class="a"></i>Sales to date</span><span><i class="f"></i>Forecast</span><span><i class="g"></i>Goal</span></p>${exportBtn("kq-pt-ch-t")}</div>`
    + tbl("kq-pt-ch", "October by channel: forecast against goal, sales to date, ad spend against plan, ROAS and TACoS",
      th("Channel", "", false, "") + th("Forecast", "likely range", false) + th("Against goal", "forecast ÷ goal", false, "gl") + th("Sales to date", "", false) + th("Ad spend", "of October plan", false) + th("ROAS", "", false) + th("TACoS", "", false),
      CH.map((c) => chRow(c)).join("") + chRow(ALL, true), "plain chan") + HINT.replace('class="kq-pt-hint"', 'class="kq-pt-hint ph"')
    + defs(`<b>Forecast</b> sales to Oct 31, projected each morning from eight weeks’ trend and day-of-week pattern with booked promotions, before the recommendations below. <b>Likely range</b> where the month ends four times in five. <b>On goal</b> within 0.25%. <b>Plan</b> the October ad budget agreed with you; ${pct((100 * DAYS) / 31, 0)} of the month has passed. Ad sales for the last 14 days are provisional.`) + `</div>`;

  // sales by day, stacked by channel in the mockups' three blues, with a 2px gap between segments
  const MAXD = 75000, TICKS = [0, 25000, 50000, 75000];
  const CHC = ["c0", "c1", "c2"];
  const cols = Array.from({ length: DAYS }, (_, d) => {
    const segs = DAILY.map((v, i) => (v[d] ? `<i class="${CHC[i]}" style="height:${((100 * v[d]) / MAXD).toFixed(2)}%"></i>` : "")).join("");
    const tip = [`Oct ${d + 1}`, ...DAILY.map((v, i) => (v[d] ? `${i} ${CH[i].n} ${usd(v[d])}` : "")).filter(Boolean), `Total ${usd(dayTotal(d))}`].join("|");
    return `<span class="col" data-tip="${tip}">${segs}</span>`;
  }).join("");
  const [dayHead, dayId] = foldHead("Sales by day");
  const daily = `<div class="kq-pt-card kq-pt-daily"><div class="kq-pt-chead">${dayHead}<p class="kq-pt-leg" aria-hidden="true">${CH.map((c, i) => `<span><i class="${CHC[i]}"></i>${c.n}</span>`).join("")}</p></div>
<div class="kq-pt-df" id="${dayId}"><div class="kq-pt-bars" aria-hidden="true"><span class="ax">${TICKS.map((t) => `<span style="bottom:${((100 * t) / MAXD).toFixed(1)}%"><small>${t ? t / 1000 + "K" : "0"}</small></span>`).join("")}</span><span class="cols">${cols}<span class="tip" hidden></span></span><span class="xl"><small>Oct 1</small><small>Oct 7 and 8<span class="w">: Prime Big Deal Days</span></small><small>Oct 23<span class="w">: Amazon only</span></small></span></div>
</div><table class="sr"><caption>Sales by day and channel, Oct 1 to 23</caption><thead><tr><th scope="col">Day</th>${CH.map((c) => `<th scope="col">${c.n}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: DAYS }, (_, d) => `<tr><th scope="row">Oct ${d + 1}</th>${DAILY.map((v) => `<td>${v[d] ? usd(v[d]) : "not yet reported"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

  const LOG = [["Oct 22", "Advertising", "38 negative search terms added, 2 moved to exact match"], ["Oct 21", "Call note", "Weekly review: notes and six action items posted"], ["Oct 20", "Creative Studio", "Corrected gift set main image filed with Amazon"]];
  const [teamHead, teamId] = foldHead("From your team this week");
  const team = `<div class="kq-pt-team kq-pt-log">${teamHead}<ul class="kq-pt-df" id="${teamId}">${LOG.map(([dt, who, t]) => `<li><small>${dt} · ${who}</small><span>${t}</span></li>`).join("")}</ul></div>`;
  const DECISIONS = [
    { t: `Lift the budget caps on ${word(capped.length)} campaigns, Oct 25 to 31`, d: `${cappedHrs} campaign-hours lost: about ${usd(lift.spend)} more spend, ${usd(lift.sales)} more sales.`, who: "Advertising", by: "Oct 24", go: go("Campaigns", hashOf("Advertising"), "kq-pt-a-capped", "that ran out of budget") },
    { t: `Run a 10% coupon on the vitamin C serum, Oct 27 to 31`, d: `About ${usd(coupon.more)} more sales at September’s ${SEPC.lift}% lift, for about ${usd(coupon.cost)} in discounts.`, who: "Operations", by: "Oct 25", go: go("Promotions", hashOf("Promotions"), "kq-pt-pr-new", "for the proposed coupon") },
    { t: `Order ${num(order(retinol))} units of retinol serum by ${orderBy(retinol)}`, d: `${cover(retinol).toFixed(1)} weeks of cover with the ${num(retinol.inb)} in transit; runs out around ${runsOut(retinol)}.`, who: "Operations", by: "Oct 30", go: go("Inventory", hashOf("Inventory"), rowId(retinol), "for retinol serum") },
  ];
  const decisions = `<div class="kq-pt-card rec" id="kq-pt-dec" tabindex="-1"><h4 class="kq-pt-h2">Decisions for you <small class="w">the first two recover about ${usd(recovered)} of Amazon’s ${usd(amzGap)} gap</small></h4><ul class="kq-pt-dec">${DECISIONS.map((x) => `<li><p class="at">${x.t}</p><p class="ad">${x.d}</p><p class="dm"><span class="ans js" role="group" aria-label="Your answer: ${x.t}"><button type="button" class="hit" data-ans="You agreed Oct 24" aria-pressed="false" disabled>Agree</button><button type="button" class="hit" data-ans="On the Oct 28 call" aria-pressed="false" disabled>Discuss</button></span><span class="dw"><b>${x.who}</b> · <span class="st" data-by="Decide by ${x.by}">Decide by ${x.by}</span></span>${x.go}</p></li>`).join("")}</ul><p class="kq-pt-note">Your team makes the change once you agree. Discuss adds it to your Oct 28 call.</p><p class="sr" role="status" id="kq-pt-osay"></p>${team}</div>`;

  // what the team is handling: ranked by severity, then by the weekly sales of what is affected
  const ALERTS = [
    ["High", `${suppressed.length + 1} suppressed listings`, `Mineral sunscreen, both sizes, and the gift set cannot be bought.`, sum(suppressed, weekly), "Operations", "fixes filed Oct 17 and 20; check Oct 25", go("Account health", hashOf("Account health"), "kq-pt-issues-r", "open issues")],
    ["Medium", "Purchase share trails click share", `“mineral sunscreen for face”: ${pct(TERMS[4][1])} of clicks, ${pct(TERMS[4][2])} of purchases.`, weekly(PRODUCTS[2]), "Operations", "listing review proposed, due Oct 28", go("Search terms", hashOf("Search terms"), "kq-pt-st-4", "for mineral sunscreen for face")],
    ["Medium", `Walmart: ${word(wmLow.length)} items low in WFS stock`, `${wmLow.map((w) => w[0]).join(" and ").replace("Mineral", "mineral")}: ${wmLow.map((w) => w[4].toFixed(1)).join(" and ")} weeks of cover.`, wmWeekly, "Operations", "WFS inbound booked for Oct 28", go("Walmart", "portal-ops-walmart", "kq-pt-wm-r", "items")],
    ["Low", "Policy warning on the retinol serum", "", weekly(retinol), "Operations", "plan of action filed Oct 16; check Oct 28", go("Account health", hashOf("Account health"), "kq-pt-issues-r", "open issues")],
  ];
  const SEV = ["High", "Medium", "Low"];
  check(ALERTS.every((a, i) => !i || (a[0] === ALERTS[i - 1][0] ? a[3] <= ALERTS[i - 1][3] : SEV.indexOf(a[0]) > SEV.indexOf(ALERTS[i - 1][0]))), "the attention list is ranked by severity, then by sales at stake");
  check(sum(suppressed, weekly) === 53200 && weekly(retinol) === retinolWeekly && TERMS[4][0] === "mineral sunscreen for face", "sales at stake");
  const attention = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Needs attention <small>${ALERTS.length}, by severity<span class="w">, then weekly sales at stake</span></small></h4><ul class="kq-pt-att wide">${ALERTS.map(([sev, t, d, n, who, st, btn]) => `<li><span class="pill ${["bad", "warn", "flat"][SEV.indexOf(sev)]}">${sev}</span><p class="at">${t}</p><p class="av"><strong>${usd(n)}</strong> <small>a week</small></p>${d ? `<p class="ad">${d}</p>` : ""}<p class="aw"><b>${who}</b> · ${st}</p>${btn}</li>`).join("")}</ul><p class="kq-pt-note"><b>A week</b> four-week average sales of the products affected.</p></div>`;


  const exec = `<section class="kq-pt-sheet kq-pt-v1" aria-labelledby="kq-pt-h1"><div class="kq-pt-trow"><h3 class="kq-pt-h1" id="kq-pt-h1">Overview</h3><p class="kq-pt-ctl"><span>Oct 1 to 23, 2026</span><span>vs same days last month</span><span class="w">vs same days last year</span></p></div>
<div class="kq-pt-frow"><p class="kq-pt-find">Sales across your three channels reached ${usd(ALL.sales)} in October so far and are forecast to finish within ${usd(ALL.goal - ALL.fc)} of the ${usd(ALL.goal)} goal. Amazon is forecast ${usd(amzGap)} short; two recommendations from your team would recover about ${usd(recovered)} of it.</p>${stamp(1, `Amazon to ${AMZ.thru} · Walmart, Target Plus to ${CH[1].thru}`)}</div>
${kstrip}
${channels}
<div class="kq-pt-cols eq"><div>${decisions}</div><div>${attention}${daily}</div></div></section>`;
  check(ALL.goal - ALL.fc > 0 && Math.abs(ALL.goal - ALL.fc) / ALL.goal < ON_GOAL, "all channels read On goal");

  // ---- screen 2: Operations, for the people who run the channels ---------------------------------
  const MAXWK = 16;
  const bar = (c) => `<span class="cb" aria-hidden="true"><b style="left:${(100 * COVER[0]) / MAXWK}%;width:${(100 * (COVER[1] - COVER[0])) / MAXWK}%"></b><i${c < COVER[0] ? ` class="low"` : ""} style="width:${Math.min(100, (100 * c) / MAXWK).toFixed(1)}%"></i></span>`;
  const coverCell = (c) => `<td class="cv" data-v="${c.toFixed(2)}"><span><strong>${c.toFixed(1)}</strong>${c < COVER[0] ? ` ${pill("bad", "Low")}` : ""}</span>${bar(c)}</td>`;
  const name = (p, id) => `<th scope="row" data-v="${byName.indexOf(p.n)}"${id ? ` id="${id}" tabindex="-1"` : ""}>${p.n}<small>${p.sku}</small></th>`;
  const coverHead = th("Weeks of cover", `with inbound, target ${COVER[0]} to ${COVER[1]}`, true, "");
  const tool = (summary, extra, what) => `<div class="kq-pt-tool"><p>${summary}</p><div class="kq-pt-tr">${extra || ""}${exportBtn(what)}</div></div>`;

  const products = tool(`${PRODUCTS.length} of ${PRODUCT_COUNT} products, ${shownShare}% of Amazon sales, Oct 1 to 23`, `<label class="kq-pt-q js"><span class="sr">Find a product or SKU</span>${SEARCH}<input type="search" placeholder="Find a product" autocomplete="off" disabled></label><button type="button" class="kq-pt-flt kq-pt-btn hit js" aria-pressed="false" disabled>With an open step <b>${withStep.length}</b></button>`, "kq-pt-c0-t")
    + tbl("kq-pt-c0", `Products, Oct 1 to 23: ${PRODUCTS.length} of ${PRODUCT_COUNT}, ${shownShare}% of Amazon sales`,
      th("Product", "", true, "") + th("Sales", "vs Sep 1 to 23") + th("Sessions", "unit session %") + th("Ad sales", "share of sales") + th("Price", "Featured Offer %") + th("Rating", "sales rank") + coverHead + th("Next step", "owner, status and date", true, "desc"),
      PRODUCTS.map((p) => `<tr${p.tag ? " data-step" : ""}>${name(p)}${td(p.sales, usd(p.sales), `<span class="${p.chg > 0 ? "pos" : "neg"}">${p.chg > 0 ? "+" : "−"}${Math.abs(p.chg).toFixed(1)}%</span>`)}${td(p.sess, num(p.sess), pct((100 * p.units) / p.sess))}${td(p.ad, usd(p.ad), pct((100 * p.ad) / p.sales))}${td(p.sales / p.units, usd2(p.sales / p.units), pct(p.fo))}${td(p.rt * 1e5 + p.rc, `${p.rt.toFixed(1)} <span class="mut">(${num(p.rc)})</span>`, `#${num(p.rank)}`)}${coverCell(cover(p))}<td class="nx" data-v="${(p.tag ? (p.tag[0] === "bad" ? 2 : 1) : 0) * 1e7 + p.sales}">${p.tag ? `${pill(p.tag[0], p.tag[1])} <span class="at">${p.step}</span><small>${p.who}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "prod")
    + `<p class="kq-pt-none" hidden>No product matches. Clear the search or the filter to see all ${word(PRODUCTS.length)}.</p>`
    + defs(`<b>Sessions</b> visits to the product’s pages; repeat visits within 24 hours count once. <b>Unit session %</b> units ordered ÷ sessions. <b>Ad sales</b> Sponsored ads only. <b>Price</b> average selling price. <b>Featured Offer %</b> share of page views where your offer held the Featured Offer (Buy Box). <b>Rating</b> average stars (ratings). <b>Sales rank</b> Best Sellers Rank in Beauty and Personal Care, Oct 23. <b>Weeks of cover</b> units on hand and inbound ÷ average weekly units over four weeks; under ${COVER[0]} is low.`);

  const ads = tool(`${CAMPAIGNS.length} of ${CAMPAIGN_COUNT} campaigns, ${spendShare}% of Amazon ad spend. All campaigns: ${usd(AMZ.spend)} spend, ${usd(AMZ.adSales)} ad sales, ${(AMZ.adSales / AMZ.spend).toFixed(2)}x`, "", "kq-pt-c1-t")
    + tbl("kq-pt-c1", "Amazon advertising by campaign, Oct 1 to 23",
      th("Campaign", "", true, "") + th("Budget", "a day") + th("Spend", "share of spend") + th("Ad sales") + th("ROAS", "ACoS") + th("Out of budget", "hours, est. missed") + th("Next step", "", false, ""),
      CAMPAIGNS.map((c, i) => `<tr><th scope="row" data-v="${i}"${c === capped[0] ? ' id="kq-pt-a-capped" tabindex="-1"' : ""}>${c.n}<small class="w">${c.type}</small></th>${td(c.day, c.day ? usd(c.day) : "Flight", c.day ? undefined : "DSP budget")}${td(c.spend, usd(c.spend), pct((100 * c.spend) / AMZ.spend))}${td(c.sales, usd(c.sales))}${td(c.roas.toFixed(3), `${c.roas.toFixed(2)}x`, pct((100 * c.spend) / c.sales))}${td(c.hrs, c.hrs ? `${c.hrs} hours` : "None", c.hrs ? `${usd(c.missed)} missed` : undefined)}<td>${c.hrs ? `${pill("warn", "Cap lift")} <span class="at">Oct 25 to 31</span><small>awaiting your decision, by Oct 24${c.day === 280 ? "; raised from $250 Oct 19" : ""}</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""))
    + defs(`<b>Share of spend</b> the campaign’s spend ÷ all Amazon ad spend. <b>ROAS</b> ad-attributed sales ÷ spend. <b>ACoS</b> spend ÷ ad-attributed sales. <b>Est. missed</b> budget per hour × hours out of budget × the campaign’s ROAS. Sponsored ads use a 7-day window and DSP a 14-day window; the last 14 days are provisional.`);

  const terms = tool(`${TERMS.length} search terms your team acted on or is reviewing, of ${TERM_COUNT} with ad spend this month`, "", "kq-pt-c2-t")
    + tbl("kq-pt-c2", "Search terms with an action this month",
      th("Search term", "", true, "") + th("Click share", "week to Oct 17") + th("Purchase share", "week to Oct 17") + th("Ad spend", "ROAS, to Oct 23") + th("Action", "", false, "") + th("Owner and status", "", false, ""),
      TERMS.map(([t, cs, ps, sp, r, act, who, stt], i) => `<tr><th scope="row" data-v="${i}" id="kq-pt-st-${i}" tabindex="-1">${t}</th>${td(cs, pct(cs))}${td(ps, `<span class="${ps < cs ? "neg" : ""}">${pct(ps)}</span>`)}${td(sp, usd(sp), `${r.toFixed(2)}x`)}<td>${act}</td><td>${who.replace("Retail Media and ", '<span class="w">Retail Media and </span>').replace("Marketplace ", '<span class="w">Marketplace </span>')}<small>${stt}</small></td></tr>`).join(""))
    + defs(`<b>Click share</b> your products’ share of all clicks on the term in Amazon search. <b>Purchase share</b> the same for purchases; below click share (in red) means shoppers click and then buy elsewhere. Both from Brand Analytics, weekly. Ad spend and ROAS from Sponsored Products.`);

  const inventory = tool(`${num(inboundUnits)} units inbound in ${word(SHIPMENTS.length)} shipments · as of ${INV_ASOF}`, "", "kq-pt-c3-t")
    + tbl("kq-pt-c3", `Inventory and replenishment by product, as of ${INV_ASOF}`,
      th("Product", "", true, "") + th("On hand") + th("Inbound", "expected") + th("Weekly units", "four-week average") + coverHead + th("Suggested order", `to ${COVER[1]} weeks`) + th("Order by", "cover at 5 weeks"),
      PRODUCTS.map((p) => `<tr>${name(p, rowId(p))}${td(p.on, num(p.on))}${td(p.inb, p.inb ? num(p.inb) : "None", due(p))}${td(p.wk, num(p.wk))}${coverCell(cover(p))}${td(order(p), order(p) ? `<strong>${num(order(p))}</strong>` : "Not yet")}${td(cover(p), orderBy(p), low(p) ? "awaiting your decision" : undefined)}</tr>`).join(""))
    + defs(`<b>Suggested order</b> once cover with inbound is under ${COVER[0]} weeks, the units back to ${COVER[1]}, in cases of 100. <b>Order by</b> the day cover reaches the ${LEAD_WEEKS}-week lead time from order to stock at Amazon. 460 units in two listings are stranded.`);

  const returns = tool("Returns and repeat purchase by product, Oct 1 to 23", "", "kq-pt-c4-t")
    + tbl("kq-pt-c4", "Returns and repeat purchase by product, Oct 1 to 23",
      th("Product", "", true, "") + th("Units ordered") + th("Returned") + th("Return rate") + th("Top return reason", "", false, "") + th("Repeat buyers", "share of customers") + th("Subscribe and Save", "active subscriptions"),
      PRODUCTS.map((p) => `<tr>${name(p)}${td(p.units, num(p.units))}${td(p.ret, num(p.ret))}${td(((100 * p.ret) / p.units).toFixed(2), pct((100 * p.ret) / p.units))}<td>${p.why}</td>${td(p.rep, `${p.rep}%`)}${td(p.sns, p.sns ? num(p.sns) : "Not enrolled")}</tr>`).join(""))
    + defs(`<b>Return rate</b> units returned ÷ units ordered. <b>Repeat buyers</b> customers who bought the product more than once, from Brand Analytics, to Oct 17. Subscriptions as of ${INV_ASOF}.`);

  const promos = tool(`October promotions cost ${usd(COSTS.promotions)}, counted in contribution`, "", "kq-pt-c5-t")
    + tbl("kq-pt-c5", "Promotions: proposed, running, ended and booked",
      th("Promotion", "", true, "") + th("Products", "", false, "") + th("Dates", "", false, "") + th("Sales during") + th("Lift") + th("Cost to you") + th("Status", "", false, ""),
      PROMOS.map((x, i) => `<tr><th scope="row" data-v="${i}"${x.id ? ` id="${x.id}" tabindex="-1"` : ""}>${x.n}</th><td>${x.what}</td><td>${x.when}</td>${td(x.sv, x.sales)}${td(x.lv, x.lift)}${td(x.cv, x.cost)}<td>${pill(x.st[0], x.st[1])}<small>${x.note}</small></td></tr>`).join(""))
    + defs(`<b>Lift</b> sales during the promotion against the same products’ average daily sales over the 14 days before. <b>Cost to you</b> the discount you fund, from settlements. Proposed figures use the September coupon’s lift and redemption.`);

  const health = tool(`Account health as of ${INV_ASOF}`, "", "kq-pt-p6") + `<div class="kq-pt-two">` + tbl("kq-pt-c6", "Performance against Amazon’s targets",
    th("Measure", "", false, "") + th("Current", "", false) + th("Target", "", false, "") + th("Status", "", false, ""),
    [["Order defect rate", "0.21%", "Below 1%", pill("good", "On track")], ["Late shipment rate", "0.8%", "Below 4%", pill("good", "On track")], ["Pre-fulfillment cancel rate", "0.1%", "Below 2.5%", pill("good", "On track")], ["Valid tracking rate", "99.2%", "Above 95%", pill("good", "On track")], ["Policy warnings", "1", "None open", pill("warn", "Watch")], ["Suppressed listings", "3", "None", pill("bad", "Action")]].map(([a, b, c, d]) => `<tr><th scope="row">${a}</th><td class="num">${b}</td><td>${c}</td><td>${d}</td></tr>`).join(""), "plain")
    + tbl("kq-pt-issues", "Open issues, with owner, status and date",
      th("Open issue", "", false, "") + th("Products", "", false, "") + th("Status", "", false, "") + th("Next", "", false, "") + th("Owner", "", false, ""),
      [["Missing safety data sheet", "Mineral sunscreen, both sizes", "Filed Oct 17; suppressed Oct 21", "Check Oct 25", MO], ["Main image rule", "Gift set", "Suppressed Oct 19; new image filed Oct 20", "Check Oct 25", "Creative Studio"], ["Restricted claim in bullets", "Eye cream", "Opened Oct 21, rewrite in progress", "Due Oct 27", MO], ["Policy warning: expiration dating", "Retinol serum", "Plan of action filed Oct 16", "Check Oct 28", MO]].map(([a, b, c, d, e]) => `<tr><th scope="row">${a}</th><td>${b}</td><td>${c}</td><td>${d}</td><td>${e}</td></tr>`).join(""), "plain") + `</div><p class="kq-pt-note">The three suppressed listings are the two sunscreen sizes and the gift set. Policy warnings are rated Low while a plan of action is under review.</p>`;

  const TABS = [["Products", products], ["Advertising", ads, "Ads"], ["Search terms", terms, "Terms"], ["Inventory", inventory], ["Returns and repeat", returns, "Returns"], ["Promotions", promos], ["Account health", health, "Health"]];
  check(TABS.map((t) => t[0]).join() === TAB_NAMES.join(), "tab order");
  const tablist = `<div class="kq-pt-bar"><div class="kq-pt-tabs" role="tablist" aria-label="Amazon operations">${TABS.map(([t, , s], i) => `<button type="button" role="tab" id="kq-pt-t${i}" aria-controls="kq-pt-p${i}" aria-selected="${!i}"${i ? ' tabindex="-1"' : ""} data-key="${TAB_KEYS[i]}" disabled>${s ? `<span class="w">${t}</span><span class="n">${s}</span>` : t}</button>`).join("")}</div><p class="kq-pt-say" role="status"></p></div>`;
  const withHint = (html) => (html.includes('<button type="button" class="kq-pt-dfb') ? html.replace('<button type="button" class="kq-pt-dfb', HINT + '<button type="button" class="kq-pt-dfb') : html + HINT);
  const panes = `<div class="kq-pt-panes">${TABS.map(([, html], i) => `<div class="kq-pt-pane${i ? "" : " on"}" role="tabpanel" id="kq-pt-p${i}" aria-labelledby="kq-pt-t${i}">${withHint(html)}</div>`).join("")}</div>`;

  const ships = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Inbound shipments <small>${num(inboundUnits)} units</small></h4><ul class="kq-pt-att two one">${SHIPMENTS.map(([n, u, s, eta]) => `<li><p><span class="at">${n}</span> <small>${num(u)}<span class="sr"> units</span></small></p><p class="num"><small>${s}, due</small> <strong>${eta}</strong></p></li>`).join("")}</ul></div>`;
  const CHANGES = [["Oct 22", "Search terms", "38 negatives added, 2 moved to exact match"], ["Oct 21", "Featured Offer", `Vitamin C serum lost it for 6 hours to an offer at $36.90 (yours ${usd2(vc.sales / vc.units)})`], ["Oct 21", "Listing", "Mineral sunscreen suppressed while Amazon reviews the safety data sheet"], ["Oct 20", "Listing", "Gift set main image replaced, with Amazon for review"], ["Oct 19", "Budget", `Brands video raised from $250 to ${usd(capped.find((c) => c.day === 280).day)} a day`]];
  const FO = [["Vitamin C serum", "Lost for 6 hours on Oct 21 to an offer at $36.90", "held again"], ["Mineral sunscreen", "No offer shown: suppressed since Oct 21", "with Amazon"], ["Gift set", "No offer shown: suppressed since Oct 19", "with Amazon"], [`${cap(word(PRODUCTS.filter((p) => p.fo >= 99).length))} other products`, "Held on 99% or more of page views", "no change"]];
  check(PRODUCTS.filter((p) => p.fo >= 99).length === 4 && PRODUCTS.filter((p) => p.fo < 99).map((p) => p.n).sort().join() === FO.slice(0, 3).map((f) => f[0]).sort().join(), "Featured Offer card against the products");
  const offers = `<div class="kq-pt-card"><h4 class="kq-pt-h2">Featured Offer <small>last 7 days; your prices unchanged</small></h4><ul class="kq-pt-att two">${FO.map(([n, d, st]) => `<li><div><p class="at">${n}</p><p class="ad">${d}</p></div><div class="av"><small>${st}</small></div></li>`).join("")}</ul></div>`;
  const changes = `<div class="kq-pt-card kq-pt-team"><h4 class="kq-pt-h2">Changes this week</h4><ul>${CHANGES.map(([dt, k, t]) => `<li><small>${dt} · ${k}</small><span>${t}</span></li>`).join("")}</ul></div>`;

  const amazon = `<div class="kq-pt-chan kq-pt-k1"><div class="kq-pt-frow"><p class="kq-pt-find">${cap(word(PRODUCTS.length))} products make up ${shownShare}% of Amazon sales this month. ${cap(word(withStep.length))} have an open step: the retinol serum needs a reorder, the ${suppressed.map((p) => p.n.toLowerCase()).join(" and ")} are suppressed, and the eye cream has a listing issue.</p>${stamp(2, `Amazon to ${AMZ.thru} · inventory ${INV_ASOF}`)}</div>
${tablist}
${panes}
<div class="kq-pt-cols ops">${ships}${offers}${changes}</div></div>`;

  const walmart = `<div class="kq-pt-chan kq-pt-k2"><div class="kq-pt-frow"><p class="kq-pt-find">${cap(word(WM.length))} items make up ${wmShare}% of Walmart sales, Oct 1 to 22. ${cap(word(wmLow.length))} are low in Walmart Fulfillment Services, with inbound stock booked for Oct 28.</p><div class="kq-pt-stamp"><span>Walmart to ${CH[1].thru}</span></div></div>
<div class="kq-pt-card">${tbl("kq-pt-wm", "Walmart items, Oct 1 to 22",
    th("Item", "", false, "") + th("Sales", "Oct 1 to 22", false) + th("Buy Box win rate", "", false) + th("Listing quality", "score of 100", false) + th("WFS weeks of cover", `target ${COVER[0]} to ${COVER[1]}`, false, "") + th("Next step", "", false, ""),
    WM.map(([n, s, bb, lq, c, step]) => `<tr><th scope="row">${n}</th><td class="num">${usd(s)}</td><td class="num">${pct(bb)}</td><td class="num">${lq}</td>${coverCell(c)}<td>${step ? `<span class="at">${step}</span><small>Marketplace Operations</small>` : `<span class="mut">No open step</span>`}</td></tr>`).join(""), "plain")}${HINT}
<p class="kq-pt-note"><b>Buy Box win rate</b> share of page views where your offer won the Buy Box. <b>Listing quality</b> Walmart’s score for content, offer and reviews. Walmart does not send sessions by day or seller performance standards to the data warehouse yet, so this view leaves them out rather than estimate them.</p></div>
<div class="kq-pt-cols eq"><div class="kq-pt-card"><h4 class="kq-pt-h2">Walmart Connect <small>Oct 1 to 22</small></h4><ul class="kq-pt-att two">${WMADS.map(([n, sp, sa]) => `<li><div><p class="at">${n}</p><p class="ad">${usd(sp)} spend</p></div><div class="av"><span><strong>${(sa / sp).toFixed(2)}x</strong></span><small>${usd(sa)} ad sales</small></div></li>`).join("")}</ul><p class="kq-pt-note">All: ${usd(CH[1].spend)} spend, ${usd(CH[1].adSales)} ad sales, ${(CH[1].adSales / CH[1].spend).toFixed(2)}x, 14-day attribution.</p></div>
<div class="kq-pt-card"><h4 class="kq-pt-h2">What lowers listing quality</h4><ul class="kq-pt-att two">${WMLQ.map(([n, d, st]) => `<li><div><p class="at">${n}</p><p class="ad">${d}</p></div><div class="av"><small>${st}</small></div></li>`).join("")}</ul></div></div></div>`;

  const target = `<div class="kq-pt-chan kq-pt-k3"><div class="kq-pt-card kq-pt-empty"><h4 class="kq-pt-h2">No Target Plus feed for this account yet</h4><p>Target Plus sales and Roundel ad spend on the Overview come from reports your team uploads by hand each week; the last upload covers sales to ${CH[2].thru}. Product, inventory and order detail will show here once a feed is connected.</p><ul class="kq-pt-list"><li>Sales and units by item, by day</li><li>Roundel campaigns: spend, ROAS and new-to-Target guests</li><li>Inventory and orders by item</li><li>Item ratings and content issues</li></ul><p class="kq-pt-note">The real portal shows this state for any source an account does not have, so an empty screen is never mistaken for zero sales.</p></div></div>`;

  const chsw = `<div class="kq-pt-chsw" role="radiogroup" aria-label="Channel">${[["amazon", "Amazon"], ["walmart", "Walmart"], ["target-plus", "Target Plus"]].map(([k, t], i) => `<span class="o"><input type="radio" name="kq-pt-ch" id="kq-pt-c-${k}" value="${k}"${i ? "" : " checked"}><label for="kq-pt-c-${k}">${t}</label></span>`).join("")}</div>`;
  const ops = `<section class="kq-pt-sheet kq-pt-v2" aria-labelledby="kq-pt-h2" data-tab="0"><p class="kq-pt-crumb">Sample skincare brand / Operations</p><div class="kq-pt-trow"><h3 class="kq-pt-h1" id="kq-pt-h2">Operations</h3>${chsw}</div>
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
function pick(i,focus){cur=i;tabs.forEach(function(t,j){var on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;panes[j].classList.toggle('on',on)});ops.setAttribute('data-tab',i);say.textContent='';if(focus)tabs[i].focus()}
function now(){if(el('kq-pt-v1').checked)return 'portal-overview';var c=f.querySelector('[name=kq-pt-ch]:checked').value;return 'portal-ops-'+(c==='amazon'?keys[cur]:c)}
function mark(push){var h='#'+now();if(location.hash===h)return;try{history[push?'pushState':'replaceState'](history.state,'',h)}catch(e){}}
function go(h){h=(h||'').replace(/^#/,'');if(h.indexOf('portal-')!==0)return false;if(h==='portal-overview'){el('kq-pt-v1').checked=true;return true}
var m=h.slice(11),i=keys.indexOf(m);if(m==='walmart'||m==='target-plus'){el('kq-pt-v2').checked=true;el('kq-pt-c-'+m).checked=true;return true}
if(i<0)return false;el('kq-pt-v2').checked=true;el('kq-pt-c-amazon').checked=true;pick(i);return true}
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i);mark()});t.addEventListener('keydown',function(e){var k=e.key,n=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:k==='Home'?0:k==='End'?tabs.length-1:null;if(n===null)return;e.preventDefault();pick((n+tabs.length)%tabs.length,1);mark()})});
all('input[type=radio]').forEach(function(r){r.addEventListener('change',function(){mark()})});
window.addEventListener('popstate',function(){if(!go(location.hash)&&!location.hash)go('#portal-overview')});
function apply(){var on=flt.getAttribute('aria-pressed')==='true',s=qi.value.toLowerCase().replace(/^\s+|\s+$/g,''),n=0,rows=all('tbody tr',panes[0]);box.style.minHeight=box.offsetHeight+'px';rows.forEach(function(r){r.hidden=(on&&!r.hasAttribute('data-step'))||(s&&r.cells[0].textContent.toLowerCase().indexOf(s)<0);if(!r.hidden)n++});none.hidden=n>0;say.textContent='Showing '+n+' of '+rows.length+' products'}
flt.addEventListener('click',function(){flt.setAttribute('aria-pressed',flt.getAttribute('aria-pressed')!=='true');apply()});qi.addEventListener('input',apply);
all('thead button').forEach(function(b){b.addEventListener('click',function(){var th=b.parentNode,i=[].indexOf.call(th.parentNode.children,th),c=th.getAttribute('aria-sort'),d=c==='descending'?'ascending':c==='ascending'||/num|desc/.test(th.className)?'descending':'ascending',tb=th.parentNode.parentNode.parentNode.tBodies[0];
all('th[aria-sort]',th.parentNode).forEach(function(x){x.setAttribute('aria-sort','none')});th.setAttribute('aria-sort',d);
[].slice.call(tb.rows).sort(function(a,c){var x=+a.cells[i].getAttribute('data-v'),y=+c.cells[i].getAttribute('data-v');return d==='ascending'?x-y:y-x}).forEach(function(r){tb.appendChild(r)});
say.textContent='Sorted by '+b.firstChild.textContent.replace(/\s+$/,'')+', '+d})});
function txt(n,drop){n=n.cloneNode(true);all(drop,n).forEach(function(x){x.parentNode.removeChild(x)});return n.textContent.replace(/\s+/g,' ').replace(/^ | $/g,'')}
function q(s){return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function csv(t){var two=[],out=[],h=[];all('thead th',t).forEach(function(c,i){var l=txt(c,'small,.sr,i,.n'),s=c.querySelector('small');two[i]=!!s;h.push(l);if(s)h.push(l+': '+s.textContent)});out.push(h);
all('tbody tr',t).forEach(function(r){if(r.hidden)return;var row=[];[].forEach.call(r.cells,function(c,i){var s=c.querySelector('small'),m=txt(c,'small,.sr,.n');if(two[i]){row.push(m);row.push(s?s.textContent:'')}else row.push(s?m+' · '+s.textContent:m)});out.push(row)});
return t.caption.textContent+'\n'+out.map(function(r){return r.map(q).join(',')}).join('\n')}
all('[data-csv]').forEach(function(b){b.addEventListener('click',function(){var root=el(b.getAttribute('data-csv')),ts=root.tagName==='TABLE'?[root]:all('table',root),name='sample-brand-'+(root.id==='kq-pt-ch-t'?'channels':keys[cur])+'.csv',n=0;ts.forEach(function(t){n+=all('tbody tr',t).filter(function(r){return !r.hidden}).length});
var data='﻿'+ts.map(csv).join('\n\n'),a=document.createElement('a');try{a.href=URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}))}catch(e){a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(data)}a.download=name;a.style.display='none';f.appendChild(a);a.click();setTimeout(function(){f.removeChild(a)},0);
(up(b,'kq-pt-v1')?osay:say).textContent='Downloaded '+name+', '+n+' rows'})});
function ring(t){t.classList.add('kq-pt-tgt');t.addEventListener('blur',function x(){t.classList.remove('kq-pt-tgt');t.removeEventListener('blur',x)})}
all('[data-go]').forEach(function(b){b.addEventListener('click',function(){var g=b.getAttribute('data-go').split(' '),t=el(g[1]);go('#'+g[0]);mark(1);if(t){ring(t);t.focus()}})});
all('[data-ans]').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode.parentNode.parentNode,st=li.querySelector('.st'),on=b.getAttribute('aria-pressed')!=='true';all('[data-ans]',li).forEach(function(x){x.setAttribute('aria-pressed',x===b&&on)});st.textContent=on?b.getAttribute('data-ans'):st.getAttribute('data-by');osay.textContent=(on?st.textContent:'Answer cleared')+': '+li.querySelector('.at').textContent})});
all('.kq-pt-asof').forEach(function(s){var p=el(s.getAttribute('data-pop')),w=s.parentNode,b=document.createElement('button');b.type='button';b.className=s.className;b.textContent=s.textContent;b.setAttribute('aria-controls',p.id);w.replaceChild(b,s);function set(o){b.setAttribute('aria-expanded',o);p.hidden=!o}set(false);
b.addEventListener('click',function(){set(p.hidden)});w.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden){set(false);b.focus()}});
document.addEventListener('click',function(e){if(!p.hidden&&!w.contains(e.target))set(false)});w.addEventListener('focusout',function(e){if(e.relatedTarget&&!w.contains(e.relatedTarget))set(false)})});
var mq=window.matchMedia?window.matchMedia('(max-width: 760px)'):{matches:false};
all('.kq-pt-dfb').forEach(function(b){var p=el(b.getAttribute('aria-controls'));function set(o){b.setAttribute('aria-expanded',o);p.classList.toggle('open',o)}set(!mq.matches);b.addEventListener('click',function(){set(b.getAttribute('aria-expanded')!=='true')})});
var tip=f.querySelector('.kq-pt-bars .tip'),cl=['c0','c1','c2'];if(tip){var bars=tip.parentNode;bars.addEventListener('mouseover',function(e){var c=e.target;while(c&&c!==bars&&!c.hasAttribute('data-tip'))c=c.parentNode;if(!c||c===bars)return;var t=c.getAttribute('data-tip').split('|');tip.innerHTML='';t.forEach(function(x,i){var s=document.createElement(i?'span':'b'),m=/^(\d) /.exec(x);if(m){var k=document.createElement('i');k.className=cl[+m[1]];s.appendChild(k);x=x.slice(2)}s.appendChild(document.createTextNode(x));tip.appendChild(s)});tip.hidden=false;var l=c.offsetLeft+c.offsetWidth/2-tip.offsetWidth/2;tip.style.left=Math.max(0,Math.min(l,bars.offsetWidth-tip.offsetWidth))+'px'});bars.addEventListener('mouseleave',function(){tip.hidden=true})}
window.addEventListener('resize',function(){box.style.minHeight=''});
all('button[disabled],input[disabled]').forEach(function(b){b.disabled=false});f.className+=' is-live';
if(go(location.hash))window.addEventListener('load',function(){var s=document.getElementById('portal')||f;if(s.scrollIntoView)s.scrollIntoView()})})();`;

export const PORTAL_CSS = String.raw`/* the client portal example, in the portal mockups' own type sizes and colours */
/* the example is far down the page: the browser skips laying it out until it comes near the screen, holding its measured height */
.kq-pt-fig{margin:clamp(32px,4vw,56px) 0 0;contain:layout style}
.kq-pt{content-visibility:auto;contain-intrinsic-block-size:auto 1150px}
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
.kq-pt-nv.sub{height:28px;padding-left:36px}
.kq-pt-nv.n1{background:#E1E7EA;color:#262524}
.kq-pt-usr{margin-top:auto!important;display:flex;align-items:center;gap:10px;padding:12px 10px 0}
.kq-pt-usr i{width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:500;background:#102A4C;color:#F8F6F1}
.kq-pt-main{min-width:0;display:flex;flex-direction:column}
.kq-pt-top{display:flex;align-items:center;gap:12px;height:48px;padding:0 16px 0 0}
.kq-pt-search{flex:0 1 420px;display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;margin-right:auto!important;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;color:#6B6B6B;white-space:nowrap;overflow:hidden}
.kq-pt-tag{padding:3px 10px;border-radius:999px;background:#102A4C;color:#DCBF85;font-size:12px;font-weight:500;white-space:nowrap}
.kq-pt-scope{display:inline-block;height:32px;line-height:30px;padding:0 10px;border:1px solid #CFD5D9;border-radius:8px;background:#FFFFFF;white-space:nowrap}
/* screens, channels and tab panels each share one cell: the page keeps one height whichever is showing */
.kq-pt-views,.kq-pt-panes,.kq-pt-chans{display:grid;min-width:0}.kq-pt-views{flex:1}
.kq-pt-sheet{grid-area:1/1;background:#FFFFFF;border:1px solid #E3E8EB;border-radius:16px;margin:0 8px 8px 0;padding:16px 24px 20px;min-width:0}
.kq-pt-v2,.kq-pt-pane,.kq-pt-k2,.kq-pt-k3{visibility:hidden}
.kq-pt-pane,.kq-pt-chan{grid-area:1/1;min-width:0}.kq-pt-pane.on{visibility:inherit}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v1{visibility:hidden}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-v2{visibility:visible}
.kq-pt-fig:has(#kq-pt-c-walmart:checked) .kq-pt-k1,.kq-pt-fig:has(#kq-pt-c-target-plus:checked) .kq-pt-k1{visibility:hidden}
.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-walmart:checked) .kq-pt-k2,.kq-pt-fig:has(#kq-pt-v2:checked):has(#kq-pt-c-target-plus:checked) .kq-pt-k3{visibility:visible}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n1{background:none;color:var(--muted)}
.kq-pt-fig:has(#kq-pt-v2:checked) .kq-pt-nv.n2{background:#E1E7EA;color:#262524}
@supports not selector(:has(a)){.kq-pt-sw,.kq-pt-chsw{display:none}}
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
.kq-pt-chsw{display:flex;flex-wrap:wrap;gap:6px}
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
.kq-pt-btn[data-csv]{position:relative}.kq-pt-btn[data-csv]::after{content:"";position:absolute;inset:-7px 0}
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
.kq-pt-cols.ops{grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.1fr)}
.kq-pt-h2{font-size:16px;line-height:22px;font-weight:600}.kq-pt-h2 small{margin-left:6px;font-weight:400}
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
.kq-pt-bars{position:relative;display:block;height:90px;margin:10px 0 0 30px;padding-bottom:20px}
.kq-pt-bars .ax{position:absolute;left:-30px;right:0;top:0;bottom:20px}
.kq-pt-bars .ax>span{position:absolute;left:0;right:0;border-top:1px solid #EEF2F4}
.kq-pt-bars .ax small{position:absolute;left:0;top:-9px;width:26px;text-align:right;line-height:16px;background:#FFFFFF}
.kq-pt-bars .cols{position:absolute;left:0;right:0;top:0;bottom:20px;display:flex;align-items:flex-end;gap:2px}
.kq-pt-bars .col{position:relative;flex:1 1 0;max-width:24px;height:100%;display:flex;flex-direction:column-reverse;align-items:stretch;gap:2px;margin:0 auto}
.kq-pt-bars .col>i{display:block;min-height:1px}.kq-pt-bars .col>i:last-of-type{border-radius:4px 4px 0 0}
.kq-pt-bars .col:hover>i{filter:brightness(.92)}
.kq-pt-bars .tip{display:flex;position:absolute;bottom:calc(100% + 6px);z-index:2;flex-direction:column;gap:2px;padding:8px 10px;background:#FFFFFF;border:1px solid #CFD5D9;border-radius:8px;box-shadow:0 8px 20px -8px rgba(10,28,54,.3);font-size:12px;line-height:16px;white-space:nowrap}
.kq-pt-bars .tip[hidden]{display:none}
.kq-pt-bars .tip i{display:inline-block;width:8px;height:8px;margin-right:6px;border-radius:2px}
.kq-pt-bars .xl{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between}
.kq-pt-bars .xl small{line-height:16px}
.kq-pt-daily .kq-pt-bars{pointer-events:auto}
/* decisions */
.kq-pt-dec{margin-top:2px!important}
.kq-pt-dec li{padding:6px 0 7px;border-bottom:1px solid #C3D8E4}
.kq-pt-dec .ad{color:#3D4A52}
.kq-pt-dec .dm{display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;margin-top:4px;font-size:12px;line-height:18px;color:#3D4A52}
.kq-pt-dec .dm b{color:#262524}.kq-pt-dec .dm .go{margin-left:auto}
.kq-pt .ans{display:inline-flex;gap:8px}
.kq-pt .ans button{height:28px;padding:0 12px;border:1px solid #9FB8C8;border-radius:999px;background:#FFFFFF;font-size:12px;font-weight:500;color:#102A4C}
.kq-pt .ans button::after{inset:-8px -4px}
.kq-pt .ans button[aria-pressed=true]{background:#102A4C;border-color:#102A4C;color:#FFFFFF}
.kq-pt-card.rec .kq-pt-note{color:#3D4A52}
.kq-pt .st{color:#262524}
/* needs attention */
.kq-pt-att{margin-top:4px!important}
.kq-pt-att li{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:4px 14px;align-items:start;padding:10px 0;border-bottom:1px solid var(--rule)}
.kq-pt-att.two li{grid-template-columns:minmax(0,1fr) auto;padding:7px 0}.kq-pt-att.one li{padding:6px 0;white-space:nowrap}
.kq-pt-att.wide li{grid-template-columns:62px minmax(0,1fr) auto;grid-template-areas:"p t v" ". d d" ". o g";gap:1px 10px;align-items:baseline;padding:6px 0}.kq-pt-att.wide .pill{grid-area:p;align-self:start}.kq-pt-att.wide .at{grid-area:t}.kq-pt-att.wide .av{grid-area:v;display:block}.kq-pt-att.wide .ad{grid-area:d;margin:0}.kq-pt-att.wide .aw{grid-area:o}.kq-pt-att.wide .go{grid-area:g;justify-self:end}.kq-pt-att .aw{font-size:12px;line-height:17px;color:var(--muted)}.kq-pt-att .aw b{color:#262524}
.kq-pt-att li:last-child{border-bottom:0;padding-bottom:0}
.kq-pt .pill{display:inline-flex;align-items:center;justify-self:start;height:20px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:500;white-space:nowrap;vertical-align:1px}
.kq-pt .pill.bad{background:#FFEDEA;color:#831C1E}.kq-pt .pill.warn{background:#FFFBEB;color:#92400E;box-shadow:inset 0 0 0 1px #F5E3B0}.kq-pt .pill.good{background:#EAF6EF;color:#1D6340}.kq-pt .pill.flat{background:#EEF2F4;color:#3D4449}
.kq-pt .at{font-weight:500}.kq-pt .ad{margin-top:1px;color:var(--muted)}
.kq-pt .av{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.kq-pt .go{color:var(--acc);white-space:nowrap}
.kq-pt-fig.is-live .go:hover{text-decoration:underline}
.kq-pt-team ul{margin-top:4px!important}
.kq-pt-team li{padding:5px 0;border-bottom:1px solid var(--rule)}.kq-pt-team li:last-child{border-bottom:0}
.kq-pt-team li small,.kq-pt-team li span{display:block}.kq-pt-team li small{line-height:16px}.kq-pt-log{margin-top:10px;padding-top:8px;border-top:1px solid #C3D8E4}.kq-pt-log li{display:grid;grid-template-columns:132px minmax(0,1fr);gap:0 12px;align-items:baseline;padding:3px 0;border-bottom:0}.kq-pt-log li small{color:#3D4A52}
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
.kq-pt td.num{white-space:nowrap}
.kq-pt tbody tr{height:44px}.kq-pt table.plain tbody tr{height:40px}.kq-pt table.plain tbody th{white-space:normal}
.kq-pt tbody th:focus{outline-offset:-3px;background:#EAF3F8}
.kq-pt td.cv{min-width:112px}.kq-pt td.cv>span:first-child{display:flex;align-items:center;gap:8px}
.kq-pt .cb{position:relative;display:block;height:6px;margin:4px 0 0;border-radius:3px;background:#EEF2F4;overflow:hidden}
.kq-pt .cb b{position:absolute;top:0;bottom:0;background:#D3E0E7}
.kq-pt .cb i{position:absolute;top:0;bottom:0;left:0;border-radius:3px;background:#00618D}
.kq-pt .cb i.low{background:#C4242A}
.kq-pt td.nx{width:27%;min-width:230px}
.kq-pt-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.1fr);gap:0 28px;align-items:start}.kq-pt-two td:nth-child(4){white-space:nowrap}
.kq-pt .n,.kq-pt-tabs .n{display:none}
.kq-pt-fig figcaption{margin-top:14px;font-size:15px;color:#626366}
.kq-pt-points{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr));gap:16px 32px;font-size:17px;line-height:1.5}
.kq-pt-points li{padding-top:14px;border-top:2px solid #102A4C}
.kq-pt-points strong{display:block;font-weight:500;color:#102A4C}
@media (max-width:1100px){.kq-pt{contain-intrinsic-block-size:auto 1480px}.kq-pt-two{grid-template-columns:1fr;gap:12px}.kq-pt{grid-template-columns:1fr}.kq-pt-side{display:none}.kq-pt-top{padding:0 12px}.kq-pt-sheet{margin:0 8px 8px}.kq-pt-hint{display:block}.kq-pt-hint.ph,.kq-pt-pane:last-child .kq-pt-hint{display:none}
.kq-pt table.prod{min-width:900px}.kq-pt-pane table:not(.plain){min-width:780px}
.kq-pt tbody th{position:sticky;left:0;z-index:1;background:#FFFFFF;padding-right:12px;box-shadow:1px 0 0 var(--rule)}
.kq-pt-kstrip{grid-template-columns:repeat(3,minmax(0,1fr))}.kq-pt-kstrip>li:nth-child(n+4){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(4){border-left:0}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}}
@media (max-width:900px){.kq-pt-cols,.kq-pt-cols.ops,.kq-pt-cols.eq{grid-template-columns:1fr}.kq-pt-two{gap:12px}.kq-pt-two table,.kq-pt-k2 table{min-width:640px}.kq-pt-two td,.kq-pt table.plain tbody th{white-space:nowrap}.kq-pt-pane:last-child .kq-pt-hint{display:block}.kq-pt-frow{flex-wrap:wrap}.kq-pt-stamp{align-items:flex-start;text-align:left}.kq-pt-pop{right:auto;left:0}}
@media (max-width:760px){.kq-pt{contain-intrinsic-block-size:auto 2100px}.kq-pt .w{display:none}.kq-pt .n,.kq-pt-tabs .n{display:inline}.kq-pt-search{display:none}.kq-pt-top{justify-content:space-between}.kq-pt-sheet{padding:14px 14px 16px}
.kq-pt-fig.is-live .kq-pt-df:not(.open){display:none}.kq-pt-fig:not(.is-live) .kq-pt-stamp>span{display:block}.kq-pt-fig.is-live .kq-pt-dfb{display:inline-flex}.kq-pt-fig.is-live .fh{display:none}.kq-pt-fig.is-live .kq-pt-daily:has(.kq-pt-df:not(.open)) .kq-pt-leg{display:none}
.kq-pt-kstrip{grid-template-columns:repeat(2,minmax(0,1fr))}.kq-pt-kstrip>li{padding:5px 12px 6px}.kq-pt-kstrip>li:nth-child(odd){border-left:0}.kq-pt-kstrip>li:nth-child(even){border-left:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(n+3){border-top:1px solid var(--border)}.kq-pt-kstrip>li:nth-child(5){grid-column:span 2}.kq-pt .kv{font-size:20px;line-height:26px}.kq-pt-kstrip .kq-pt-spark{display:none}.kq-pt-kstrip>li:nth-child(5) .kq-pt-spark{display:block;max-width:none;height:26px}
.kq-pt-card{padding:10px 14px}.kq-pt-leg{gap:2px 12px}
.kq-pt-att.wide li{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"p t t" "d d d" "o o o" "v v g";padding:8px 0}.kq-pt-att.wide .av{text-align:left}
.kq-pt tbody th,.kq-pt table.plain tbody th{white-space:normal;min-width:134px;max-width:150px}.kq-pt #kq-pt-c6-t{min-width:440px}.kq-pt #kq-pt-c6-t tbody th{white-space:nowrap;max-width:none}.kq-pt-ctl,.kq-pt-v1 .kq-pt-crumb{display:none}
.kq-pt-kstrip>li:nth-child(5){display:grid;grid-template-columns:auto 1fr;gap:0 14px;align-items:center}.kq-pt-kstrip>li:nth-child(5) .kl{grid-column:1/-1}.kq-pt-kstrip>li:nth-child(5) .kr{grid-row:2/4;margin:0}
.kq-pt table.plain tbody tr{height:32px}.kq-pt-bar{gap:0 10px}.kq-pt-tabs{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:0;flex-basis:100%}.kq-pt-tabs button{padding:0 4px}.kq-pt-say{flex-basis:100%}
.kq-pt-tool>p{flex-basis:100%}.kq-pt-tr{flex:1 1 100%}.kq-pt-q{flex:1 1 100%}.kq-pt-q input{width:100%;height:36px;font-size:16px}.kq-pt .kq-pt-btn{height:36px}
.kq-pt-trow{gap:6px 12px}.kq-pt-log li{grid-template-columns:1fr}
.kq-pt-chead{display:grid;grid-template-columns:1fr auto;align-items:center}.kq-pt-chead .kq-pt-leg{grid-column:1/-1;grid-row:2}
.kq-pt-dec .dm{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"w w" "a g";gap:4px 8px}.kq-pt-dec .dw{grid-area:w}.kq-pt-dec .ans{grid-area:a}.kq-pt-dec .dm .go{grid-area:g;justify-self:end}
.kq-pt-dec li{padding:8px 0}.kq-pt-log{margin-top:8px}
.kq-pt-kkey{margin-top:10px!important;font-size:12px;line-height:16px;color:var(--muted)}.kq-pt-kkey+.kq-pt-card{margin-top:4px}.kq-pt .kd{display:inline}.kq-pt table.chan{min-width:820px}.kq-pt table.chan tbody th{min-width:86px;max-width:96px}.kq-pt-stamp>span{display:none}
.kq-pt-bars{height:76px}.kq-pt .kq-pt-hint{display:inline-block;margin-right:14px}.kq-pt-chsw label{padding:0 10px}
.kq-pt-sw{font-size:15px}.kq-pt-sw>span:first-child{flex-basis:100%}.kq-pt-sw label{padding:0 14px}.kq-pt-empty{padding:16px}}
@media (max-width:380px){.kq-pt{contain-intrinsic-block-size:auto 2380px}.kq-pt-bars{height:64px}.kq-pt-card{padding:10px 12px}.kq-pt .xw{display:none}.kq-pt .kv{font-size:18px}.kq-pt-kstrip>li{padding:8px 10px}.kq-pt-tabs{grid-template-columns:repeat(auto-fill,minmax(64px,1fr))}.kq-pt-tabs button{font-size:13px}}
@media (forced-colors:active){.kq-pt .gb,.kq-pt .gb i,.kq-pt .cb,.kq-pt .cb i,.kq-pt .cb b,.kq-pt-bars .col>i,.kq-pt-leg i,.kq-pt-pop li::before,.kq-pt-list li::before{forced-color-adjust:none}}
/* end of the client portal example */
`;
