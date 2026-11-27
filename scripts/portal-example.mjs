// The client portal example shown on Why Kwontified (and wherever else the site shows the portal).
//
// It is a picture of the product, not live data: static HTML and CSS drawn to match the
// Kwontified Client Portal mockups (Jordan's design artifact,
// https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9), with a sample brand's figures. It carries
// an "Illustrative example" tag and a caption, and is marked data-nosnippet so the sample
// figures are not quoted in search results as Kwontified's own.
//
// scripts/site-about.mjs calls portalSection() with its own section helpers and adds
// PORTAL_CSS to the page. Everything about the picture lives in this file.

export function portalSection({ section, two, H2, P }) {
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
return portal;
}

export const PORTAL_CSS = String.raw`/* the client portal picture, in the portal mockups' own type sizes and colours */
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
`;
