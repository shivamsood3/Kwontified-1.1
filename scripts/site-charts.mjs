// Charts, graphs, maps and figures across the site (2026-11-27 chart review, approved by the owner).
//
// The review scored the site's charts 70/100. Text inside every SVG chart shrank with the drawing
// to 5 to 9px on phones, two of them gave screen readers no numbers, the same before/after chart
// was drawn two ways, a scroll-linked animation left values floating over empty axes for half a
// screen, and the rolling figures settled with gaps ("$781 K", "$1 55K"). This step:
//
//   1. Redraws the nine data charts as one component (figure.kq-chart): bars in HTML on one
//      baseline from zero, values, categories and legend as real text, a visually hidden table
//      with every value, the caption kept. Each chart is found by its own aria-label and checked
//      against the spec below: every printed figure and every bar height must match, or the build
//      stops. No figure changes. Owner's decisions: the International "1x to 2x" chart is removed
//      (it repeats the figure above it); the shortage chart says "H1 2024" and "H1 2025" wherever
//      it appears; Creative Studio's two pairs are indexed to 100 before so they share one scale.
//   2. One motion rule: the export's scroll-linked bar animation is removed; the charts' bars grow
//      together, once, through the export's own "exhibits draw themselves" script (off under
//      reduced motion).
//   3. The rolling figures: each digit column takes the width of its own digit, so the figure
//      settles without gaps. The roll stays off under reduced motion, as before.
//   4. The two line illustrations on Analytics: their words move out of the drawing into HTML
//      (readable on phones), with a legend, a "Today" label and a "0" on the spike's baseline.
//   5. The Channels hub and the Why Kwontified data flow get a phone layout in HTML; the Agentic
//      Commerce illustration is rebuilt in HTML at every width.
//   6. The two marketplace maps: a legend, colours that reach 3:1, the United States outlined on
//      International (so its note is true), no colour transition under reduced motion, and the
//      56 country notes on International in a list keyboard users can open.
//   7. The Perspectives tables: the scroll box is a labelled region reachable by keyboard, and
//      columns of numbers are right-aligned.
//   8. The client portal app script (export to Excel, ask a question, live charts) is removed from
//      every page that has no portal (`.pt`) element for it to run on; it stays wherever one exists.
//
// Runs after site-home.mjs and before site-seo.mjs: after every step that moves content (the charts
// are final), before SEO reads the pages and before site-images.mjs.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const fail = (m) => { throw new Error("site-charts: " + m); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html") && !/^(es|fr|ko|zh)--/.test(f));
const pages = new Map();
const page = (f) => { if (!pages.has(f)) { if (!fs.existsSync(path.join(DIR, f))) fail(`${f} is missing`); pages.set(f, fs.readFileSync(path.join(DIR, f), "utf8")); } return pages.get(f); };
const put = (f, h) => pages.set(f, h);
for (const f of files) if (page(f).includes('data-kq-charts')) fail(`${f}: already applied; run the whole build`);
const css = new Map(); // file -> set of style blocks to add
const addCss = (f, k) => { if (!css.has(f)) css.set(f, new Set()); css.get(f).add(k); };

// ---------- finding an SVG by its own label, and the figure around it
function findSvg(h, f, label) {
  const at = `aria-label="${esc(label)}"`;
  const n = h.split(at).length - 1;
  if (n !== 1) fail(`${f}: expected the chart "${label.slice(0, 60)}" once, found ${n}`);
  const i = h.indexOf(at), s = h.lastIndexOf("<svg", i);
  if (s < 0 || h.slice(s, i).includes(">")) fail(`${f}: "${label.slice(0, 60)}" is not on an <svg>`);
  let depth = 0, k = s, e = -1; // the matching </svg>, past any drawing nested inside
  const re = /<svg\b|<\/svg>/g; re.lastIndex = s;
  for (let m; (m = re.exec(h));) { depth += m[0] === "</svg>" ? -1 : 1; if (depth === 0) { e = m.index + 6; break; } k = m.index; }
  if (e < 0) fail(`${f}: "${label.slice(0, 60)}" has no closing </svg>`);
  return { s, e, svg: h.slice(s, e) };
}
function figureAround(h, f, s, e) {
  const fs0 = h.lastIndexOf("<figure", s), fe = h.indexOf("</figure>", e);
  if (fs0 < 0 || fe < 0 || h.slice(fs0, s).includes("</figure>") || h.slice(e, fe).includes("<figure")) fail(`${f}: the chart is not inside its own <figure>`);
  const rest = h.slice(e, fe), cap = rest.match(/^<figcaption([^>]*)>([\s\S]*)<\/figcaption>$/);
  if (rest && !cap) fail(`${f}: unexpected markup after the chart: ${rest.slice(0, 80)}`);
  return { fs: fs0, fe: fe + 9, open: h.slice(fs0, h.indexOf(">", fs0) + 1), cap: cap ? { attrs: cap[1], html: cap[2] } : null };
}
const texts = (svg) => [...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((m) => dec(m[1]).trim());
const attr = (a, k) => { const m = a.match(new RegExp(`\\s${k}="([^"]*)"`)); return m ? m[1] : null; };
const bars = (svg) => [...svg.matchAll(/<rect\b([^>]*?)\/?>/g)].map((m) => m[1]).filter((a) => /^#(64809A|102A4C)$/.test(attr(a, "fill") || "") && +attr(a, "width") >= 15)
  .map((a) => ({ w: +attr(a, "width"), h: +attr(a, "height") }));
function checkScale(f, id, got, want, dim) { // drawn sizes must be proportional to the values, to 1.5 drawing units
  if (got.length !== want.length) fail(`${f} ${id}: expected ${want.length} bars, found ${got.length}`);
  const k = Math.max(...got.map((g) => g[dim])) / Math.max(...want);
  got.forEach((g, i) => { if (Math.abs(g[dim] - want[i] * k) > 1.5) fail(`${f} ${id}: bar ${i + 1} is ${g[dim]} units, its value ${want[i]} needs ${(want[i] * k).toFixed(1)}`); });
}

// ---------- the data charts
// kind "bars": groups of one or two bars on one baseline. "v" are bar heights (the value, or an
// index where the chart says so); "t" are the figures printed, exactly as the export prints them.
const CHARTS = [
  { id: "walmart-index", file: "channels--walmart.html", label: "Walmart.com sales and ad spend before and after, indexed to 100 before",
    texts: ["100", "123", "100", "95", "Walmart.com sales", "Ad spend", "Before", "After"], drawn: [[100, 123, 100, 95]],
    series: ["Before", "After"], groups: [{ x: "Walmart.com sales", v: [100, 123], t: ["100", "123"] }, { x: "Ad spend", v: [100, 95], t: ["100", "95"] }],
    table: "Walmart.com sales and ad spend before and after the engagement, indexed to 100 before" },
  { id: "premium-beauty-pairs", file: "capabilities--creative-studio.html", label: "Total sales rose from $2.90M to $4.76M, up 64%, and average order value rose from $58 to $71, up 22%, after entering Premium Beauty",
    texts: ["$2.90M", "Before", "$4.76M", "After", "$58", "Before", "$71", "After", "Total sales, up 64%", "Average order value, up 22%"], drawn: [[2.90, 4.76], [58, 71]],
    series: ["Before", "After"], groups: [{ x: "Total sales, up 64%", v: [100, (4.76 / 2.90) * 100], t: ["$2.90M", "$4.76M"] }, { x: "Average order value, up 22%", v: [100, (71 / 58) * 100], t: ["$58", "$71"] }],
    table: "Total sales and average order value before and after entering Premium Beauty",
    cap: ["Before and after entering Premium Beauty on Amazon US. Each pair of bars is drawn to its own scale from zero.", "Before and after entering Premium Beauty on Amazon US. Both pairs are indexed to 100 before, so the two rises share one scale."] },
  { id: "walmart-display-roas", file: "work.html", panel: true, label: "Bar chart: Walmart display returned 2.6x on online sales alone and 6.8x with in-store sales counted, on $380K of spend and $2.60M of attributed sales.",
    texts: ["2.6x", "6.8x", "Online sales only", "Online and in-store"], drawn: [[2.6, 6.8]],
    groups: [{ x: "Online sales only", v: [2.6], t: ["2.6x"] }, { x: "Online and in-store", v: [6.8], t: ["6.8x"] }], head: "ROAS" },
  { id: "premium-beauty-sales", file: "work.html", panel: true, label: "Bar chart: total Amazon sales rose from $2.90M to $4.76M, up 64%, after the brand entered Premium Beauty.",
    texts: ["+64%", "$2.90M", "$4.76M", "Before Premium Beauty", "After Premium Beauty"], drawn: [[2.90, 4.76]],
    groups: [{ x: "Before Premium Beauty", v: [2.90], t: ["$2.90M"] }, { x: "After Premium Beauty", v: [4.76], t: ["$4.76M"], d: "+64%" }], head: "Total Amazon sales" },
  { id: "shortage-work", file: "work.html", panel: true, label: "Bar chart: shortage deductions fell from $539K in the first half of one year to $155K in the first half of the next.",
    newLabel: "Shortage deductions fell from $539K in H1 2024 to $155K in H1 2025.",
    texts: ["$539K", "$155K", "First half, year one", "First half, year two"], drawn: [[539, 155]],
    groups: [{ x: "H1 2024 shortages", v: [539], t: ["$539K"] }, { x: "H1 2025 shortages", v: [155], t: ["$155K"] }], head: "Shortage deductions" },
  { id: "tiktok-affiliate", file: "work.html", panel: true, label: "Bar chart: TikTok Shop affiliate sales rose from $380K in the first half of one year to $2.3M in the first half of the next.",
    texts: ["$380K", "$2.3M", "First half, year one", "First half, year two"], drawn: [[380, 2300]],
    groups: [{ x: "First half, year one", v: [380], t: ["$380K"] }, { x: "First half, year two", v: [2300], t: ["$2.3M"] }], head: "Affiliate sales" },
  { id: "shortage-case", file: "work--shortage-claims.html", label: "Bar chart: shortage deductions fell from $539K in the first half of 2024 to $155K in the first half of 2025.",
    texts: ["$539K", "$155K", "H1 2024 shortages", "H1 2025 shortages"], drawn: [[539, 155]],
    groups: [{ x: "H1 2024 shortages", v: [539], t: ["$539K"] }, { x: "H1 2025 shortages", v: [155], t: ["$155K"] }], head: "Shortage deductions" },
  { id: "display-store-share", file: "capabilities--retail-media.html", kind: "seg", label: "Share of attributed sales made in stores and online",
    texts: ["62%", "In stores", "38%", "Online"], parts: [["In stores", 62, "62%"], ["Online", 38, "38%"]], head: "Share of attributed sales" },
  { id: "target-first-time", file: "capabilities--marketplace-operations.html", kind: "seg", label: "Share of items approved by Target Plus on first submission",
    texts: ["97%", "Approved first time", "3%", "Resubmitted"], parts: [["Approved first time", 97, "97%"], ["Resubmitted", 3, "3%"]], head: "Share of items" },
];
const REMOVE = [ // owner's decision: repeats the "2x" figure printed just above it
  { file: "channels--international.html", label: "Conversion rate on Amazon UK before and after the pages were localized, as a multiple of the starting rate", texts: ["1x", "Before localization", "2x", "After localization"] },
];
const fmtH = (x) => (Math.round(x * 10000) / 10000).toString();
function barsChart(c, label, cap) {
  const two = !!c.series, all = c.groups.flatMap((g) => g.v), max = Math.max(...all);
  const key = two ? `<ul class="kq-ch-key" aria-hidden="true">${c.series.map((s, i) => `<li><i class="kq-c${i + 1}"></i>${esc(s)}</li>`).join("")}</ul>` : "";
  const plot = `<div class="kq-ch-plot${c.groups.some((g) => g.d) ? " kq-ch-d" : ""}${two ? " kq-ch-pairs" : ""}" aria-hidden="true">${c.groups.map((g, gi) => `<div class="kq-ch-g"><div class="kq-ch-bars">${g.v.map((v, i) =>
    `<div class="kq-ch-c"><span class="kq-ch-v">${g.d && i === g.v.length - 1 ? `<small>${esc(g.d)}</small>` : ""}${esc(g.t[i])}</span><span class="kq-ch-b kq-c${two ? i + 1 : gi + 1}" style="--h:${fmtH(v / max)}"></span></div>`).join("")}</div><span class="kq-ch-x">${esc(g.x)}</span></div>`).join("")}</div>`;
  const table = two
    ? `<div class="kq-sr"><table><caption>${esc(c.table)}</caption><thead><tr><td></td>${c.series.map((s) => `<th scope="col">${esc(s)}</th>`).join("")}</tr></thead><tbody>${c.groups.map((g) => `<tr><th scope="row">${esc(g.x)}</th>${g.t.map((t) => `<td>${esc(t)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    : `<div class="kq-sr"><table><caption>${esc(label)}</caption><thead><tr><td></td><th scope="col">${esc(c.head)}</th></tr></thead><tbody>${c.groups.map((g) => `<tr><th scope="row">${esc(g.x)}</th><td>${esc(g.t[0])}${g.d ? ` (${esc(g.d)})` : ""}</td></tr>`).join("")}</tbody></table></div>`;
  return `<figure class="kq-vis kq-chart${c.panel ? " kq-chart-panel" : ""}" data-kq-chart="${c.id}" style="margin: 0; width: 100%">${key}${plot}${table}${cap || ""}</figure>`;
}
function segChart(c, cap) {
  const [a, b] = c.parts;
  const lab = (p, cls) => `<span class="${cls}"><b>${esc(p[2])}</b>${esc(p[0])}</span>`;
  return `<figure class="kq-vis kq-chart kq-chart-seg" data-kq-chart="${c.id}" style="margin: 0; width: 100%"><div class="kq-sg" aria-hidden="true"><div class="kq-sg-lab">${lab(a, "")}${lab(b, "kq-sg-r")}</div>`
    + `<div class="kq-sg-bar" style="grid-template-columns: ${a[1]}fr ${b[1]}fr"><span class="kq-c2"></span><span class="kq-c1"></span></div></div>`
    + `<div class="kq-sr"><table><caption>${esc(c.label)}</caption><thead><tr><td></td><th scope="col">${esc(c.head)}</th></tr></thead><tbody>${c.parts.map((p) => `<tr><th scope="row">${esc(p[0])}</th><td>${esc(p[2])}</td></tr>`).join("")}</tbody></table></div>${cap || ""}</figure>`;
}
let charts = 0;
for (const c of CHARTS) {
  let h = page(c.file);
  const { s, e, svg } = findSvg(h, c.file, c.label);
  const got = texts(svg);
  if (got.join("|") !== c.texts.join("|")) fail(`${c.file} ${c.id}: the chart's figures changed: ${got.join(" | ")}`);
  const fig = figureAround(h, c.file, s, e);
  if (c.kind === "seg") checkScale(c.file, c.id, bars(svg), c.parts.map((p) => p[1]), "w");
  else { const b = bars(svg); let k = 0; for (const d of c.drawn) { checkScale(c.file, c.id, b.slice(k, k + d.length), d, "h"); k += d.length; } if (k !== b.length) fail(`${c.file} ${c.id}: ${b.length} bars, expected ${k}`); }
  let cap = fig.cap ? `<figcaption${fig.cap.attrs}>${fig.cap.html}</figcaption>` : "";
  if (c.cap) { if (!fig.cap || dec(fig.cap.html) !== c.cap[0]) fail(`${c.file} ${c.id}: caption changed: ${fig.cap && fig.cap.html}`); cap = `<figcaption${fig.cap.attrs}>${esc(c.cap[1])}</figcaption>`; }
  const label = (c.newLabel || c.label).replace(/^Bar chart: /, "").replace(/^./, (x) => x.toUpperCase());
  const out = c.kind === "seg" ? segChart(c, cap) : barsChart(c, label, cap);
  h = h.slice(0, fig.fs) + out + h.slice(fig.fe);
  put(c.file, h); addCss(c.file, "chart"); charts++;
}
let removed = 0;
for (const r of REMOVE) {
  let h = page(r.file);
  const { s, e, svg } = findSvg(h, r.file, r.label);
  if (texts(svg).join("|") !== r.texts.join("|")) fail(`${r.file}: the chart to remove changed: ${texts(svg).join(" | ")}`);
  const fig = figureAround(h, r.file, s, e);
  put(r.file, h.slice(0, fig.fs) + h.slice(fig.fe)); removed++;
}

// ---------- line illustrations: words out of the drawing, into HTML laid over it
// Each label is placed at its drawing position as a share of the box; under 420px wide the
// labels that sit beside the lines give way to the legend below, which is always present.
const LINES = [
  { id: "forecast-scenarios", file: "capabilities--analytics-forecasting.html", label: "Illustration of a sales forecast: actual sales for six months, then conservative, standard and reach scenarios for the rest of the year.",
    texts: ["Sales forecast scenarios", "Reach", "Standard", "Conservative", "Jan", "Mar", "May", "Jul", "Sep", "Nov", "Actuals", "Illustration: each forecast carries three scenarios"],
    box: [30, 110, 600, 330], title: "Sales forecast scenarios", note: "Illustration: each forecast carries three scenarios",
    over: [["Reach", 502, 155, "s", "kq-ov-side"], ["Standard", 502, 225, "s", "kq-ov-side kq-ov-b"], ["Conservative", 502, 290, "s", "kq-ov-side"], ["Actuals", 130, 300, "m", "kq-ov-side"], ["Today", 244, 146, "e", ""]],
    ticks: [["Jan", 50], ["Mar", 130], ["May", 210], ["Jul", 290], ["Sep", 370], ["Nov", 450]],
    key: [["Actuals", "#262524", 4, ""], ["Standard", "#102A4C", 4, ""], ["Reach", "#102A4C", 3, "8 6"], ["Conservative", "#64809A", 3, "8 6"]] },
  { id: "viral-spike", file: "capabilities--analytics-forecasting.html", label: "Illustration of weekly sales rising to a spike while stock on hand stays above zero",
    texts: ["Weekly sales", "Stock on hand", "Week 1", "Week 12"], box: [0, 10, 520, 206],
    over: [["Weekly sales", 232, 34, "m", "kq-ov-side kq-ov-b"], ["Stock on hand", 430, 66, "m", "kq-ov-side kq-ov-b"], ["0", 33, 214, "e", "kq-ov-zero"]],
    ticks: [["Week 1", 40, "s"], ["Week 12", 500, "e"]],
    key: [["Weekly sales", "#102A4C", 4, ""], ["Stock on hand", "#244676", 3, "8 6"]] },
];
const swatch = (k) => `<svg width="28" height="8" viewBox="0 0 28 8" aria-hidden="true"><line x1="1" y1="4" x2="27" y2="4" stroke="${k[1]}" stroke-width="${k[2]}"${k[3] ? ` stroke-dasharray="${k[3]}"` : ""}/></svg>`;
for (const l of LINES) {
  let h = page(l.file);
  const { s, e, svg } = findSvg(h, l.file, l.label);
  if (texts(svg).join("|") !== l.texts.join("|")) fail(`${l.file} ${l.id}: the illustration's words changed: ${texts(svg).join(" | ")}`);
  const fig = figureAround(h, l.file, s, e);
  const [bx, by, bw, bh] = l.box, pct = (v, o, w) => (((v - o) / w) * 100).toFixed(2) + "%";
  const open = svg.slice(0, svg.indexOf(">") + 1);
  const svg2 = open.replace(/\sviewBox="[^"]*"/, ` viewBox="${bx} ${by} ${bw} ${bh}"`).replace(/\srole="img"/, "").replace(/\saria-label="[^"]*"/, ' aria-hidden="true" focusable="false"')
    + svg.slice(open.length).replace(/<text\b[^>]*>[^<]*<\/text>/g, "");
  if (!/aria-hidden="true"/.test(svg2) || /<text/.test(svg2)) fail(`${l.file} ${l.id}: could not take the words out of the drawing`);
  const over = l.over.map(([t, x, y, a, cls]) => `<span class="kq-ov-l kq-ov-${a}${cls ? " " + cls : ""}" style="left: ${pct(x, bx, bw)}; top: ${pct(y, by, bh)}">${esc(t)}</span>`).join("");
  const ticks = `<div class="kq-ov-x">${l.ticks.map(([t, x, a]) => `<span class="kq-ov-${a || "m"}" style="left: ${pct(x, bx, bw)}">${esc(t)}</span>`).join("")}</div>`;
  const key = `<ul class="kq-ov-key">${l.key.map((k) => `<li>${swatch(k)}${esc(k[0])}</li>`).join("")}</ul>`;
  const title = l.title ? `<p class="kq-ov-t">${esc(l.title)}</p>` : "";
  let cap = fig.cap ? `<figcaption${fig.cap.attrs}>${fig.cap.html}</figcaption>` : "";
  if (l.note) { if (cap) fail(`${l.file} ${l.id}: has a caption and a note`); cap = `<figcaption class="kq-ov-cap">${esc(l.note)}</figcaption>`; }
  const out = `${fig.open.replace(/class="([^"]*)"/, 'class="$1 kq-ov-fig"')}<div class="kq-ov" role="img" aria-label="${esc(l.label)}">${title}<div class="kq-ov-p">${svg2}${over}</div>${ticks}${key}</div>${cap}</figure>`;
  if (!/class="[^"]*kq-ov-fig/.test(out)) fail(`${l.file} ${l.id}: the figure has no class to extend`);
  h = h.slice(0, fig.fs) + out + h.slice(fig.fe);
  put(l.file, h); addCss(l.file, "lines");
}

// ---------- diagrams: a phone layout in HTML (Channels hub, data flow); Agentic illustration in HTML
{
  const f = "channels.html", label = "Diagram: one plan at the centre, connected to ten channels: Amazon, Walmart, Target Plus, Temu, International, Zalando, Mercado Libre, TikTok Shop, Instagram Shop and Amazon brand programs";
  let h = page(f);
  const { s, e, svg } = findSvg(h, f, label);
  const items = [...svg.matchAll(/(<svg x="[^"]*" y="[^"]*" width="28" height="28" (viewBox="0 0 24 24"[^>]*)>([\s\S]*?)<\/svg>)<text\b[^>]*>([^<]*)<\/text>/g)].map((m) => ({ icon: `<svg width="22" height="22" ${m[2]} aria-hidden="true">${m[3]}</svg>`, name: dec(m[4]) }));
  const names = items.map((i) => i.name).join(", ");
  if (items.length !== 10 || names !== "Amazon, Walmart, Target Plus, Temu, International, Zalando, Mercado Libre, TikTok Shop, Instagram Shop, Amazon brand programs") fail(`${f}: the hub's channels changed: ${names}`);
  const tx = texts(svg);
  if (tx.slice(10).join("|") !== "One strategy|one P&L") fail(`${f}: the hub's centre changed: ${tx.slice(10).join(" | ")}`);
  const order = ["Amazon", "Amazon brand programs", "Walmart", "Target Plus", "Temu", "International", "Zalando", "Mercado Libre", "TikTok Shop", "Instagram Shop"].map((n) => items.find((i) => i.name === n));
  const narrow = `<div class="kq-dg-n kq-hubn" role="img" aria-label="${esc(label)}"><p class="kq-hubn-c">One strategy<span>one P&amp;L</span></p><ul>${order.map((i) => `<li>${i.icon}${esc(i.name)}</li>`).join("")}</ul></div>`;
  h = h.slice(0, s) + `<div class="kq-dg kq-dg-hub">${svg.replace(/^<svg /, '<svg class="kq-dg-w" ')}${narrow}</div>` + h.slice(e);
  put(f, h); addCss(f, "dg");
}
{
  const f = "why-kwontified.html", label = "Diagram: marketplace sales, advertising and inventory data flow into one warehouse, which feeds reporting, forecasts and daily account checks. AI tools flag issues and opportunities, and our people decide what to do.";
  let h = page(f);
  const { s, e, svg } = findSvg(h, f, label);
  const tx = texts(svg);
  if (tx.join("|") !== "Marketplace sales|Advertising|Inventory|One warehouse|Reporting|Forecasts|Daily account checks|AI tools flag issues and opportunities. Our people decide what to do.") fail(`${f}: the data flow's words changed: ${tx.join(" | ")}`);
  const sec = h.lastIndexOf("<section", s);
  if (/id="portal"|class="kq-pt/.test(h.slice(sec, s).replace(/<\/section>[\s\S]*$/, "")) && !h.slice(sec, s).includes("</section>")) fail(`${f}: the data flow now sits in the portal section`);
  const arrow = `<svg class="kq-fl-a" width="16" height="22" viewBox="0 0 16 22" aria-hidden="true"><path d="M8 0V18" stroke="#7F9BB5" stroke-width="1.5"/><path d="M8 21l-5 -8h10z" fill="#7F9BB5"/></svg>`;
  const row = (a) => `<ul>${a.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const narrow = `<div class="kq-dg-n kq-fln" role="img" aria-label="${esc(label)}">${row(tx.slice(0, 3))}${arrow}<p class="kq-fl-wh">${esc(tx[3])}</p>${arrow}${row(tx.slice(4, 7))}<p class="kq-fl-note">${esc(tx[7])}</p></div>`;
  h = h.slice(0, s) + `<div class="kq-dg kq-dg-flow">${svg.replace(/^<svg /, '<svg class="kq-dg-w" ')}${narrow}</div>` + h.slice(e);
  put(f, h); addCss(f, "dg");
}
{
  const f = "capabilities--agentic-commerce.html", label = "Illustration of an AI shopping assistant answering a question about vitamin C serum, with the brand’s listing first among three recommendations.";
  let h = page(f);
  const { s, e, svg } = findSvg(h, f, label);
  const tx = texts(svg);
  const want = ["Which vitamin C serum suits sensitive skin?", "Three products match what you asked for:", "Gentle vitamin C serum, 30 ml", "Fragrance-free", "For sensitive skin", "Your listing", "Brightening serum, 30 ml", "Vitamin C 10%", "Daily vitamin C drops, 15 ml", "Fragrance-free", "Illustration: an AI shopping assistant answer"];
  if (tx.join("|") !== want.join("|")) fail(`${f}: the illustration's words changed: ${tx.join(" | ")}`);
  const fig = figureAround(h, f, s, e);
  if (fig.cap) fail(`${f}: the illustration has a caption now`);
  const item = (name, tags, you) => `<li${you ? ' class="is-you"' : ""}><span class="kq-ai-pic"><i></i></span><span class="kq-ai-t"><span class="kq-ai-n">${esc(name)}</span><span class="kq-ai-tags">${tags.map((t) => `<span>${esc(t)}</span>`).join("")}</span></span>${you ? `<span class="kq-ai-you">${esc(you)}</span>` : ""}</li>`;
  const out = `${fig.open.replace(/class="([^"]*)"/, 'class="$1 kq-ai-fig"')}<div class="kq-ai" role="img" aria-label="${esc(label)}"><p class="kq-ai-q">${esc(tx[0])}</p><p class="kq-ai-lead">${esc(tx[1])}</p><ul>${item(tx[2], [tx[3], tx[4]], tx[5])}${item(tx[6], [tx[7]])}${item(tx[8], [tx[9]])}</ul></div><figcaption class="kq-ai-cap">${esc(tx[10])}</figcaption></figure>`;
  if (!/kq-ai-fig/.test(out)) fail(`${f}: the figure has no class to extend`);
  h = h.slice(0, fig.fs) + out + h.slice(fig.fe);
  put(f, h); addCss(f, "ai");
}

// ---------- maps
const MAPS = [
  { file: "channels--amazon.html", mode: "groups", key: [["kq-mk-on", "Chosen marketplace"], ["kq-mk-in", "Other Amazon marketplaces"]] },
  { file: "channels--international.html", mode: "countries", key: [["kq-mk-on", "Chosen channel or country"], ["kq-mk-in", "Other channels in this list"], ["kq-mk-home", "United States"]],
    note: ["The United States, where most of our brands start, is shown in grey.", "The United States, where most of our brands start, is outlined in grey."] },
];
let notes = 0;
for (const m of MAPS) {
  let h = page(m.file);
  if ((h.match(/<div class="kq-map" data-mode="([a-z]+)"/g) || []).length !== 1 || !h.includes(`<div class="kq-map" data-mode="${m.mode}"`)) fail(`${m.file}: expected one map in ${m.mode} mode`);
  const svgEnd = h.indexOf("</svg>", h.indexOf('<svg class="kq-world"'));
  if (h.slice(svgEnd, svgEnd + 15) !== "</svg></figure>") fail(`${m.file}: the map's figure changed`);
  const legend = `<ul class="kq-maplegend">${m.key.map(([c, t]) => `<li><i class="${c}"></i>${esc(t)}</li>`).join("")}</ul>`;
  h = h.slice(0, svgEnd + 6) + legend + h.slice(svgEnd + 6);
  if (m.mode === "countries") {
    if (!h.includes('<path class="kq-mb kq-home"')) fail(`${m.file}: the United States is no longer marked as home`);
    const data = JSON.parse((h.match(/<script type="application\/json" class="kq-mapdata">([\s\S]*?)<\/script>/) || fail(`${m.file}: no map data`))[1]);
    const list = Object.values(data.countries).sort((a, b) => a.h.localeCompare(b.h));
    if (list.length < 50) fail(`${m.file}: only ${list.length} country notes`);
    const at = h.indexOf('<p class="kq-mapnote">'), end = h.indexOf("</p>", at) + 4;
    if (at < 0 || h.slice(at + 22, end - 4) !== m.note[0]) fail(`${m.file}: the map note changed`);
    // a button rather than <details>: the FAQ structured data counts every <details> as a question
    const all = `<div class="kq-mapall"><button type="button" aria-expanded="false" aria-controls="kq-mapall-list">Every country: marketplaces, listing languages and fulfillment (${list.length})</button><dl id="kq-mapall-list" hidden>${list.map((c) => `<div><dt>${esc(c.h)}</dt><dd>${esc(c.p)}</dd></div>`).join("")}</dl>`
      + `<script>(function(){var b=document.querySelector('.kq-mapall button'),l=document.getElementById('kq-mapall-list');if(!b||!l)return;b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',o?'false':'true');l.hidden=o;});})();</script></div>`;
    h = h.slice(0, at) + `<p class="kq-mapnote">${esc(m.note[1])}</p>` + all + h.slice(end);
    notes = list.length;
  }
  put(m.file, h); addCss(m.file, "map");
}

// ---------- Perspectives tables: a labelled, keyboard-reachable scroll box; numbers right-aligned
const WRAP = '<div style="margin: 32px 0 0; overflow-x: auto"><table';
const NUM = /^(?:about |nearly |almost )?[−+\-–]?\s?[$€£]?\s?\d[\d,]*(?:\.\d+)?\s?(?:%|x|K|M|B| billion| million| pts?| points?)?$/i;
let tables = 0, numCols = 0;
for (const f of files.filter((x) => x.startsWith("perspectives--"))) {
  let h = page(f);
  if (!h.includes("<table")) continue;
  const n = h.split("<table").length - 1;
  if (h.split(WRAP).length - 1 !== n) fail(`${f}: ${n} tables but ${h.split(WRAP).length - 1} in the expected scroll box`);
  h = h.replace(/<div style="margin: 32px 0 0; overflow-x: auto">(<table[\s\S]*?<\/table>)<\/div>/g, (all, t, at) => {
    const before = h.slice(Math.max(0, at - 4000), at), hs = [...before.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)];
    const name = hs.length ? dec(hs[hs.length - 1][1].replace(/<[^>]+>/g, "")).trim() : "";
    const rows = [...t.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<(t[hd])\b([^>]*)>([\s\S]*?)<\/t[hd]>/g)]);
    const body = rows.slice(1);
    const cols = rows[0] ? rows[0].length : 0, right = [];
    for (let c = 1; c < cols; c++) {
      const cells = body.map((r) => r[c]).filter(Boolean);
      if (cells.length && cells.length === body.length && cells.every((x) => x[1] === "td" && NUM.test(dec(x[3].replace(/<[^>]+>/g, "")).trim()))) right.push(c);
    }
    let out = t;
    if (right.length) {
      let ri = 0;
      out = t.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, inner) => { let ci = -1; ri++; return "<tr>" + inner.replace(/<(t[hd])\b([^>]*)>/g, (cell, tag, a) => { ci++; if (!right.includes(ci)) return cell; if (!/style="/.test(a)) fail(`${f}: a table cell has no style`); return `<${tag}${/text-align:\s*\w+/.test(a) ? a.replace(/text-align:\s*\w+/, "text-align: right") : a.replace(/style="/, 'style="text-align: right; ')}>`; }) + "</tr>"; });
      numCols += right.length;
    }
    tables++;
    return `<div class="kq-tbl" role="region" tabindex="0" aria-label="${esc(name ? "Table: " + name : "Table")}" style="margin: 32px 0 0; overflow-x: auto">${out}</div>`;
  });
  put(f, h); addCss(f, "tbl");
}

// ---------- shared code on every page: the scroll-linked bar animation, the rolling figures, the portal script
const BARIN = '\nsvg[role="img"] rect[fill="#102A4C"],svg[role="img"] rect[fill="#64809A"]{transform-box:fill-box;transform-origin:50% 100%;animation:kq-bar-in linear both;animation-timeline:view();animation-range:entry 10% entry 60%}';
const KEYS = "@keyframes kq-bar-in{from{scale:1 0}to{scale:1 1}}\n";
const ROLL = "col.appendChild(st);word.appendChild(col);}";
const ROLL2 = "var cw=d.createElement('span');cw.className='kq-cw';cw.textContent=ch;col.appendChild(cw);col.appendChild(st);word.appendChild(col);}";
const PT1 = "(function(){\nvar d=document,root=d.querySelector('.pt');if(!root||root.getAttribute('data-x'))return;";
const PT2 = "(function(){\nvar d=document,root=d.querySelector('.pt');if(!root||root.getAttribute('data-i'))return;";
let barin = 0, rolls = 0, portalOut = 0, portalKept = [], portalKB = 0;
const ptCut = (h, f, start, marker) => {
  const a = h.indexOf(start); if (a < 0) return h;
  if (h.indexOf(start, a + 1) >= 0) fail(`${f}: the portal script appears twice`);
  const b = h.indexOf("\n})();", a) + 6;
  const blk = h.slice(a, b);
  if (b < 6 || !blk.includes(marker) || blk.slice(1).includes("\n(function(){\n")) fail(`${f}: the portal script's shape changed`);
  portalKB += blk.length / 1024;
  return h.slice(0, a) + h.slice(b + (h[b] === "\n" ? 1 : 0));
};
for (const f of files) {
  let h = page(f);
  if (h.includes(BARIN)) { h = h.replace(BARIN, ""); barin++; }
  if (h.includes(KEYS) && !h.includes("kq-bar-in linear")) h = h.replace(KEYS, "");
  if (h.includes("kq-bar-in")) fail(`${f}: the scroll-linked bar animation is still there`);
  const r = h.split(ROLL).length - 1;
  if (r > 1) fail(`${f}: the rolling figures' script appears ${r} times`);
  if (r === 1) { h = h.replace(ROLL, ROLL2); addCss(f, "roll"); rolls++; }
  else if (/<span data-roll/.test(h) && !h.includes(ROLL2)) fail(`${f}: has rolling figures but not the script that rolls them`);
  if (h.includes(PT1) || h.includes(PT2)) {
    const markup = h.replace(/<script\b[\s\S]*?<\/script>/g, "").replace(/<style\b[\s\S]*?<\/style>/g, "");
    if (/\sclass="(?:[^"]*\s)?pt(?:\s[^"]*)?"/.test(markup)) portalKept.push(f);
    else { h = ptCut(h, f, PT1, "function zip("); h = ptCut(h, f, PT2, "function draw(box,spec)"); portalOut++; }
  }
  put(f, h);
}
if (barin < 1000) fail(`the scroll-linked bar animation was found on only ${barin} pages`);
if (rolls < 1000) fail(`the rolling figures' script was found on only ${rolls} pages`);
for (const c of CHARTS) if (!page(c.file).includes("exhibits draw themselves once as they enter")) fail(`${c.file}: no "exhibits draw themselves" script to grow the bars`);

// ---------- styles (one block per page, only the parts it uses)
const STYLE = {
  chart: `.kq-chart{--kq-c1:#64809A;--kq-c2:#102A4C;color:#262524;position:relative;container-type:inline-size}
.kq-chart .kq-sr th{font-weight:400}
.kq-c1{background:var(--kq-c1,#64809A)}.kq-c2{background:var(--kq-c2,#102A4C)}
.kq-chart-panel{background:#E1E9F1;padding:clamp(20px,3vw,40px) clamp(16px,3vw,40px) clamp(16px,2.4vw,28px);box-sizing:border-box;max-width:520px}
.kq-ch-key{list-style:none;margin:0 0 20px;padding:0;display:flex;flex-wrap:wrap;gap:6px 20px;font-size:15px;line-height:1.4;color:#626366}
.kq-ch-key li{display:flex;align-items:center;gap:8px}.kq-ch-key i{display:block;width:12px;height:12px;border-radius:2px}
.kq-ch-plot{--H:clamp(170px,22vw,220px);--L:40px;display:flex;gap:clamp(12px,3vw,32px)}
.kq-ch-plot.kq-ch-d{--L:60px}
.kq-ch-g{flex:1 1 0;min-width:0;display:flex;flex-direction:column}
.kq-ch-bars{height:var(--H);display:flex;align-items:flex-end;justify-content:center;gap:6px;border-bottom:1px solid #B4C0CB}
.kq-ch-c{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0}
.kq-ch-v{font-size:clamp(17px,1.7vw,22px);font-weight:500;line-height:1.15;margin-bottom:8px;white-space:nowrap;text-align:center}
.kq-ch-v small{display:block;font-size:15px;font-weight:500;color:#102A4C;margin-bottom:4px}
.kq-ch-b{display:block;width:clamp(44px,9vw,84px);height:calc((var(--H) - var(--L)) * var(--h));border-radius:4px 4px 0 0;transform-origin:50% 100%}
.kq-ch-x{margin-top:10px;font-size:15px;line-height:1.35;color:#626366;text-align:center}
@container (max-width:359px){.kq-ch-plot.kq-ch-pairs{flex-direction:column;gap:28px}.kq-ch-pairs .kq-ch-g{flex:none}}
.kq-sg-lab{display:flex;justify-content:space-between;gap:16px;margin-bottom:10px}
.kq-sg-lab span{display:flex;flex-direction:column;font-size:15px;line-height:1.35;color:#626366}
.kq-sg-lab b{font-size:clamp(22px,2vw,26px);font-weight:500;line-height:1.1;color:#262524;margin-bottom:4px}
.kq-sg-lab .kq-sg-r{text-align:right;align-items:flex-end}
.kq-sg-bar{display:grid;gap:2px;height:28px;transform-origin:0 50%}
.kq-sg-bar span{border-radius:4px}
@media (prefers-reduced-motion:no-preference){.kq-drawing .kq-chart .kq-ch-b,.kq-drawing .kq-chart .kq-sg-bar{transition:transform 700ms cubic-bezier(.22,.61,.36,1)}
.kq-drawing .kq-chart:not(.is-drawn) .kq-ch-b{transform:scaleY(0)}.kq-drawing .kq-chart:not(.is-drawn) .kq-sg-bar{transform:scaleX(0)}}
@media (forced-colors:active){.kq-ch-b,.kq-sg-bar span,.kq-ch-key i{background:CanvasText;border:1px solid CanvasText}.kq-c1{background:GrayText}}`,
  lines: `.kq-ov{container-type:inline-size}
.kq-ov-t{margin:0 0 12px;font-size:15px;line-height:1.4;color:#626366}
.kq-ov-p{position:relative}.kq-ov-p svg{display:block;width:100%;height:auto;overflow:visible}
.kq-ov-l{position:absolute;font-size:15px;line-height:1;color:#262524;white-space:nowrap;transform:translate(0,-85%)}
.kq-ov-l.kq-ov-m{transform:translate(-50%,-85%)}.kq-ov-l.kq-ov-e{transform:translate(-100%,-85%)}.kq-ov-l.kq-ov-b{font-weight:500}
.kq-ov-l.kq-ov-zero{transform:translate(-100%,-75%);color:#626366;font-size:14px}
.kq-ov-x{position:relative;height:22px;margin-top:6px;font-size:14px;line-height:1;color:#626366}
.kq-ov-x span{position:absolute;top:4px;white-space:nowrap}.kq-ov-x .kq-ov-m{transform:translateX(-50%)}.kq-ov-x .kq-ov-e{transform:translateX(-100%)}
.kq-ov-key{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px;line-height:1.4;color:#626366}
.kq-ov-key li{display:flex;align-items:center;gap:8px}
.kq-ov-cap{margin-top:12px;font-size:14px;color:#626366}
@container (max-width:419px){.kq-ov-side{display:none}.kq-ov-l{font-size:13px}.kq-ov-x{font-size:13px}}`,
  dg: `.kq-dg{container-type:inline-size}.kq-dg-n{display:none}
@container (max-width:499px){.kq-dg>.kq-dg-w{display:none!important}.kq-dg>.kq-dg-n{display:block}}
.kq-hubn{background:#102A4C;color:#F8F6F1;padding:24px 20px;border-radius:2px}
.kq-hubn-c{margin:0 auto 20px;max-width:15em;text-align:center;border:1.5px solid #DCBF85;border-radius:999px;padding:12px 20px;font-size:20px;line-height:1.2}
.kq-hubn-c span{display:block;font-size:15px;color:#C9D4DF;margin-top:4px}
.kq-hubn ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px 16px}
.kq-hubn li{display:flex;align-items:center;gap:10px;font-size:15px;line-height:1.3}
.kq-hubn li svg{flex:none;stroke:#EBDDB5}
.kq-fln{color:#F8F6F1;text-align:center}
.kq-fln ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.kq-fln li{border:1.5px solid #C9D4DF;border-radius:6px;padding:10px 12px;font-size:16px;line-height:1.3}
.kq-fl-a{display:block;margin:8px auto}
.kq-fl-wh{margin:0;border:2px solid #DCBF85;background:#14304A;border-radius:999px;padding:14px 16px;font-size:18px;line-height:1.2}
.kq-fl-note{margin:20px 0 0;padding-top:16px;border-top:1px solid #244676;font-size:16px;line-height:1.45;color:#C9D4DF}`,
  ai: `.kq-ai{background:#FFFFFF;color:#262524;padding:clamp(16px,3.2vw,32px);box-sizing:border-box}
.kq-ai-q{margin:0;background:#E1E9F1;padding:14px 18px;font-size:clamp(16px,1.3vw,18px);line-height:1.35}
.kq-ai-lead{margin:18px 0 10px;font-size:15px;line-height:1.4;color:#626366}
.kq-ai ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.kq-ai li{display:flex;align-items:flex-start;gap:14px;padding:12px 14px;border-left:5px solid transparent;flex-wrap:wrap}
.kq-ai li.is-you{background:#E1E9F1;border-left-color:#102A4C}
.kq-ai-pic{flex:none;width:44px;height:44px;background:#D5DEE7;display:flex;align-items:center;justify-content:center}
.kq-ai-pic i{display:block;width:22px;height:26px;border-radius:4px;background:#64809A;box-shadow:0 -6px 0 -2px #64809A}
.kq-ai li.is-you .kq-ai-pic i{background:#102A4C}
.kq-ai-t{flex:1 1 150px;min-width:0;display:flex;flex-direction:column;gap:8px}
.kq-ai-n{font-size:clamp(15px,1.2vw,17px);font-weight:500;line-height:1.3}
.kq-ai-tags{display:flex;flex-wrap:wrap;gap:6px}
.kq-ai-tags span{font-size:13px;line-height:1.2;color:#4A4D52;background:#FFFFFF;border-radius:999px;padding:5px 10px}
.kq-ai li:not(.is-you) .kq-ai-tags span{background:#E1E9F1}
.kq-ai-you{flex:none;font-size:13px;font-weight:500;line-height:1.2;color:#FFFFFF;background:#102A4C;border-radius:999px;padding:6px 12px}
.kq-ai-cap{margin-top:12px;font-size:14px;color:#D5DEE7}`,
  map: `.kq-world .kq-mc{fill:#64809A}
.kq-world .kq-mc.is-on{fill:#102A4C}
.kq-world .kq-home{fill:#D8DEE4;stroke:#626366;stroke-width:1.25px;vector-effect:non-scaling-stroke}
.kq-maplegend{list-style:none;margin:16px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px 20px;font-size:15px;line-height:1.4;color:#626366}
.kq-maplegend li{display:flex;align-items:center;gap:8px}.kq-maplegend i{display:block;width:14px;height:14px;border-radius:2px}
.kq-mk-on{background:#102A4C}.kq-mk-in{background:#64809A}.kq-mk-home{background:#D8DEE4;box-shadow:inset 0 0 0 1.5px #626366}
.kq-mapall{margin:20px 0 0;font-size:16px}
.kq-mapall button{font:inherit;font-size:16px;background:none;border:0;padding:0;cursor:pointer;min-height:44px;display:flex;align-items:center;gap:10px;color:#102A4C;text-align:left;text-decoration:underline;text-underline-offset:3px}
.kq-mapall button::after{content:"";flex:none;width:8px;height:8px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-2px) rotate(45deg)}
.kq-mapall button[aria-expanded="true"]::after{transform:translateY(2px) rotate(-135deg)}
.kq-mapall dl{margin:8px 0 0}
.kq-mapall dl>div{padding:10px 0;border-top:1px solid #C5CCD3}.kq-mapall dt{font-weight:500}.kq-mapall dd{margin:2px 0 0;line-height:1.5;color:#4A4D52}
@media (max-width:900px){.kq-mapall{order:7}}
@media (prefers-reduced-motion:reduce){.kq-world .kq-mc{transition:none}}`,
  tbl: `.kq-tbl:focus-visible{outline:2px solid #00618D;outline-offset:4px}`,
  roll: `.kq-roll .kq-col{position:relative;overflow:visible;overflow-y:clip}
.kq-roll .kq-cw{display:inline-block;visibility:hidden;line-height:1}
.kq-roll .kq-col>.kq-strip{position:absolute;top:0;left:50%;translate:-50% 0;text-align:center}`,
};
for (const [f, keys] of css) {
  let h = page(f);
  if (h.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
  if (keys.has("map") && !h.includes(".kq-world .kq-mc{fill:#B4C2D0")) fail(`${f}: the map's own colours changed`);
  const block = `<style data-kq-charts>\n/* charts, maps and figures (site-charts.mjs) */\n${[...keys].map((k) => STYLE[k]).join("\n")}\n</style>`;
  h = h.replace("</head>", block + "\n</head>");
  put(f, h);
}
// a table with the visually hidden class needs it defined
for (const c of CHARTS) if (!/\.kq-sr\{position:absolute;width:1px;height:1px/.test(page(c.file))) fail(`${c.file}: no .kq-sr style for the chart's table`);

for (const [f, h] of pages) fs.writeFileSync(path.join(DIR, f), h);
console.log(`site-charts: ${charts} charts redrawn as one component, ${removed} removed, ${LINES.length} line illustrations and 3 diagrams readable on phones, 2 maps with a legend (${notes} country notes listed), ${tables} Perspectives tables made keyboard regions (${numCols} number columns right-aligned); scroll-linked bar animation off ${barin} pages, rolling figures fixed on ${rolls}, portal script removed from ${portalOut} pages (${Math.round(portalKB / Math.max(1, portalOut))} KB each)${portalKept.length ? `, kept on ${portalKept.join(", ")}` : ""}`);
