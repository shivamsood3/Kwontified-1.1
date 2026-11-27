// The Contact page ("Request a marketplace review") and its Thank-you page.
//
// The export's Contact page put the form under a full-height photograph, asked ten questions
// in one run with only the email required, pre-selected "Pre-launch" as the revenue, and
// opened the Thank-you page whether or not the request had been sent. This step rebuilds the
// top of the page (2026-11-27 review, approved by Jordan):
//
//   - The form is on the first screen: headline and assurances on the left, the form in a card
//     on the right, "What happens next" beside it. On a phone the order is headline, form,
//     what happens next.
//   - Six fields are required (first name, last name, work email, company, website, what you
//     want to achieve). Job title, channels, revenue and needs are in an optional block.
//     Revenue has no default. Needs can be several, named after the six capabilities.
//   - A personal email address is accepted, with a one-line nudge toward a work address.
//   - window.kqContact (called by the form hook that build-site.mjs adds to every page) sends
//     the form to /api/contact and opens the Thank-you page only when the server says the
//     request was delivered. Otherwise a message says it did not send, keeps the answers and
//     offers the same request by email.
//   - Answers from the home page case finder (/contact#ch=wm&rev=m) are carried into the form,
//     and the page the visitor came from is sent with the request.
//   - Other routes: email and phone, press, careers, existing clients, and the three offices.
//   - Copy: "A senior team member reads every request." (Jordan, 2026-11-27: say "team member" across the site, "a senior team member" where seniority is the point; never "a managing partner".) No booking
//     link yet (to be added later).
//
// The words a script shows are in the page's markup (hidden until needed), not in the script,
// so the translation step can reach them.
//
// Runs after site-errors.mjs and before site-seo.mjs (the FAQ structured data is made from the
// finished page) and site-images.mjs (the photograph gets its smaller version).
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const fail = (m) => { throw new Error("site-contact: " + m); };
const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => r.route));
const once = (html, find, put, what) => {
  const n = html.split(find).length - 1;
  if (n !== 1) fail(`${what}: expected once, found ${n} times`);
  return html.replace(find, () => put);
};

const FILE = path.join(DIR, "contact.html");
let h = fs.readFileSync(FILE, "utf8");
if (h.includes("data-kq-contact")) fail("already applied; run the whole build");

// ---- what the export has; stop if it changed, so someone looks before this replaces it ----
const a = h.indexOf('<section class="kq-hero'), b = h.indexOf('<section aria-labelledby="faq-title"');
if (a < 0 || b < a) fail("the page no longer starts with a hero followed by the form and the questions");
const old = h.slice(a, b);
const names = [...new Set([...old.matchAll(/<(?:input|select|textarea)\b[^>]*\sname="([^"]+)"/g)].map((m) => m[1]))].join(",");
if (names !== "first_name,last_name,email,job_title,company,website,channels,revenue,goal,notes") fail("the export's form fields changed: " + names);
const photo = (old.match(/<img\b[^>]*class="kq-hero-img"[^>]*\ssrc="([^"]+)"[^>]*\salt="([^"]+)"/) || fail("no hero photograph")).slice(1, 3);
const button = (old.match(/<button type="submit" class="kq-btn"[^>]*>/) || fail("no submit button"))[0];
const channels = [...old.matchAll(/<input type="checkbox" name="channels" value="([^"]+)"[^>]*>([^<]+)<\/label>/g)].map((m) => [m[1], m[2].trim()]);
const revenue = [...(old.match(/<select id="rev"[\s\S]*?<\/select>/) || fail("no revenue menu"))[0].matchAll(/<option>([^<]+)<\/option>/g)].map((m) => m[1]);
const example = (old.match(/<textarea\b[^>]*\splaceholder="([^"]+)"/) || fail("no example in the notes field"))[1];
if (channels.length !== 7 || revenue.length !== 5) fail(`expected 7 channels and 5 revenue bands, found ${channels.length} and ${revenue.length}`);

// what the visitor needs help with: the six capabilities, then the two requests that span them
const NEEDS = [
  ["retail-media", "Retail media and advertising"],
  ["creative", "Creative and content"],
  ["operations", "Marketplace operations"],
  ["analytics", "Analytics and forecasting"],
  ["agentic-commerce", "AI shopping assistants"],
  ["revenue-recovery", "Revenue recovery"],
  ["new-marketplace", "Launching a new marketplace or country"],
  ["full-service", "Full-service management"],
];
const PROOF = [
  ["+64%", "Sales for a clinical skincare brand after entering Premium Beauty", "/work/sales-up-64-after-entering-premium-beauty"],
  ["$781K", "Shortage claims recovered for a kitchen appliance vendor", "/work/shortage-claims"],
  ["6.8x", "Omnichannel ROAS for a baby food supplier from Walmart display", "/work/6-8x-omnichannel-roas-from-walmart-display"],
];
for (const r of [...PROOF.map((p) => p[2]), "/about/careers", "/client-sign-in", "/privacy", "/perspectives", "/contact/thank-you"]) if (!routes.has(r)) fail(`${r} is not a page on the site`);
// the case finder's revenue answers (site-fixes.mjs): its three bands do not line up with the
// form's five, so only "under $5M" selects an option; the others are carried as words
const FINDER_REV = [["s", "under $5M in annual marketplace revenue", "Under $5M"], ["m", "$5M to $25M in annual marketplace revenue", ""], ["l", "over $25M in annual marketplace revenue", ""]];
if (!revenue.includes("Under $5M")) fail('the revenue menu no longer has "Under $5M"');

const field = (id, label, input, extra = "") => `<div class="kq-cf-f"><label for="${id}">${label}</label>${input}${extra}</div>`;
const check = (name, [value, label]) => `<label class="kq-cf-c"><input type="checkbox" name="${name}" value="${value}">${label}</label>`;
const TICK = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#DCBF85" stroke-width="1.8" stroke-linecap="square"><path d="M3.5 9.5l3.5 3.5 7.5-8"/></svg>`;

const FORM = `<form class="kq-cf" data-kq-form="contact" method="post" action="/api/contact" aria-labelledby="page-title">
<p class="kq-cf-note">Every field here is required.</p>
<div class="kq-cf-row">${field("f0", "First name", `<input id="f0" type="text" name="first_name" autocomplete="given-name" required>`)}${field("f1", "Last name", `<input id="f1" type="text" name="last_name" autocomplete="family-name" required>`)}</div>
${field("f2", "Work email", `<input id="f2" type="email" name="email" autocomplete="email" autocapitalize="off" spellcheck="false" required>`, `<p class="kq-cf-hint" role="status" hidden>A work address helps us prepare, but this one is fine.</p>`)}
<div class="kq-cf-row">${field("f4", "Company or brand", `<input id="f4" type="text" name="company" autocomplete="organization" required>`)}${field("f5", "Brand website", `<input id="f5" type="text" name="website" autocomplete="url" inputmode="url" autocapitalize="off" spellcheck="false" required pattern="\\s*(https?://)?([A-Za-z0-9\\-]+\\.)+[A-Za-z]{2,}(/\\S*)?\\s*" title="Enter a web address, such as yourbrand.com.">`)}</div>
${field("notes", "What do you want to achieve?", `<textarea id="notes" name="notes" rows="3" required placeholder="${example}"></textarea>`)}
<details class="kq-cf-more"><summary><span>Add detail</span> <span class="kq-cf-opt">Optional. It helps us prepare.</span></summary>
<div class="kq-cf-morein">
<p class="kq-cf-carried" hidden>Carried from the case finder: <span data-kq-carried></span>. Change anything below.${FINDER_REV.map(([k, words, opt]) => `<span data-rev="${k}" data-opt="${opt}" hidden>${words}</span>`).join("")}</p>
${field("f3", "Job title", `<input id="f3" type="text" name="job_title" autocomplete="organization-title">`)}
<fieldset><legend>Where you sell today</legend><div class="kq-cf-cs">${channels.map((c) => check("channels", c)).join("")}</div></fieldset>
${field("rev", "Annual e-commerce revenue", `<select id="rev" name="revenue"><option value="">Select a range</option>${revenue.map((r) => `<option>${r}</option>`).join("")}</select>`)}
<fieldset><legend>What you need help with</legend><div class="kq-cf-cs">${NEEDS.map((n) => check("goal", n)).join("")}</div></fieldset>
</div></details>
<div class="kq-cf-hp" aria-hidden="true"><label for="kq-hp">Leave this field empty</label><input id="kq-hp" type="text" name="contact_me_by_fax_only" tabindex="-1" autocomplete="off"></div>
<input type="hidden" name="t" value=""><input type="hidden" name="from" value=""><input type="hidden" name="finder" value="">
<p class="kq-cf-priv">We use what you share only to prepare for and hold this conversation. We do not share it with third parties. <a href="/privacy">Privacy Policy</a></p>
<p class="kq-cf-fail" id="send-failed" role="alert" tabindex="-1">That did not send, so we have not received it. Please try again, or <a data-kq-mailto href="mailto:contact@kwontified.com?subject=Marketplace%20review%20request">send it by email</a>. Your answers are still here.</p>
<div>${button.replace(/margin-top:[^;"]*;?/, "")}Request a marketplace review</button></div>
</form>`;

const TOP = `<section class="kq-ct" aria-label="Introduction" style="padding: 24px clamp(20px, 4.4vw, 64px) clamp(56px, 6vw, 88px); background: #102A4C; color: #F8F6F1"><div class="kq-ct-grid">
<div class="kq-ct-intro"><nav aria-label="Breadcrumb" style="font-size: 15px; color: #C9D4DF; margin-bottom: clamp(24px, 3vw, 44px)"><a href="/" style="color: #C9D4DF">Home</a> / <span aria-current="page">Request a marketplace review</span></nav><div aria-hidden="true" style="width: 56px; height: 3px; background: #DCBF85; margin-bottom: 24px"></div><h1 id="page-title" style="margin: 0; font-weight: 400; font-size: clamp(36px, 3.6vw, 52px); line-height: 1.06; letter-spacing: -0.025em; max-width: 11em; color: #F8F6F1">Request a marketplace review.</h1><p class="kq-ct-lede">Tell us where you sell and what you want to grow. A senior team member reads every request.</p>
<ul class="kq-ct-sure"><li>${TICK}<span>We reply within one business day.</span></li><li>${TICK}<span>The review is free and carries no obligation.</span></li><li>${TICK}<span>We sign a mutual NDA before reviewing any account data.</span></li></ul></div>
${FORM}
<aside class="kq-ct-next" aria-labelledby="next-title"><h2 id="next-title">What happens next</h2><ol>
<li><span aria-hidden="true">01</span><div><h3>We reply within one business day</h3><p>A senior team member reads your request, and we suggest times.</p></div></li>
<li><span aria-hidden="true">02</span><div><h3>A discovery call</h3><p>We ask about your channels, goals and constraints.</p></div></li>
<li><span aria-hidden="true">03</span><div><h3>A written first read</h3><p>A short note on where we see the growth and what it would take.</p></div></li></ol>
</aside>
<div class="kq-ct-res"><h2 id="proof-title">Recent results</h2><ul class="kq-ct-proof" aria-labelledby="proof-title">${PROOF.map(([fig, line, href]) => `<li><a href="${href}"><strong>${fig}</strong><span>${line}</span></a></li>`).join("")}</ul></div>
</div></section>
<section class="kq-cr" aria-labelledby="routes-title" style="padding: clamp(56px, 6vw, 88px) clamp(20px, 4.4vw, 64px); background: #E1E9F1"><div style="max-width: 1312px; margin: 0 auto">
<h2 id="routes-title" style="margin: 0; font-weight: 400; font-size: clamp(30px, 2.8vw, 40px); line-height: 1.06; letter-spacing: -0.025em">Other ways to reach us</h2>
<div class="kq-cr-grid"><div class="kq-cr-list">
<div class="kq-cr-i"><h3>Email or call</h3><p class="kq-cr-direct"><a href="mailto:contact@kwontified.com">contact@kwontified.com</a><a href="tel:+14048739148">404.873.9148</a></p></div>
<div class="kq-cr-i"><h3>Existing clients</h3><p>Your dashboards, reports and open tasks are in the client portal. <a href="/client-sign-in">Client sign-in</a></p></div>
<div class="kq-cr-i"><h3>Press</h3><p>For interviews and comment, write to <a href="mailto:press@kwontified.com">press@kwontified.com</a>. <a href="/perspectives?type=press">Press releases</a></p></div>
<div class="kq-cr-i"><h3>Careers</h3><p>We hire marketplace and advertising analysts and managers. <a href="/about/careers">See open roles</a></p></div>
<div class="kq-cr-i kq-cr-off"><h3>Offices</h3><ul><li><strong>Atlanta (headquarters)</strong><br>7000 Central Parkway, Suite 1100<br>Atlanta, GA 30328</li><li><strong>New York</strong><br>175 Greenwich Street, 38th Floor<br>New York, NY 10007</li><li><strong>Seattle</strong><br>1201 Third Avenue, Suite 2200<br>Seattle, WA 98101</li></ul></div>
</div><img class="kq-cr-img" loading="lazy" decoding="async" src="${photo[0]}" alt="${photo[1]}" width="1500" height="1000"></div>
</div></section>
`;

const CSS = `<style data-kq-contact>
/* Contact page (scripts/site-contact.mjs) */
.kq-ct-grid{max-width:1312px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,600px);grid-template-areas:"intro form" "next form" "next res";gap:36px clamp(40px,6vw,96px);align-items:start}
.kq-ct-intro{grid-area:intro}.kq-cf{grid-area:form}.kq-ct-next{grid-area:next}.kq-ct-res{grid-area:res}
.kq-ct-lede{margin:22px 0 0;font-size:clamp(18px,1.53vw,22px);line-height:1.45;max-width:26em;color:#F8F6F1}
.kq-ct-sure{list-style:none;margin:24px 0 0;padding:0;display:flex;flex-direction:column;gap:10px;font-size:16px;color:#F8F6F1}
.kq-ct-sure li{display:flex;gap:12px;align-items:flex-start}.kq-ct-sure svg{flex:none;margin-top:3px}
.kq-ct-next h2,.kq-ct-res h2{margin:0;font-weight:500;font-size:20px;color:#F8F6F1}
.kq-ct-next ol{list-style:none;margin:6px 0 0;padding:0}
.kq-ct-next ol li{display:flex;gap:18px;padding:16px 0;border-bottom:1px solid #244676}
.kq-ct-next ol li>span{flex:none;font-size:15px;color:#DCBF85;font-variant-numeric:tabular-nums;padding-top:3px}
.kq-ct-next h3{margin:0;font-weight:500;font-size:18px;line-height:1.3;color:#F8F6F1}
.kq-ct-next ol p{margin:4px 0 0;font-size:15px;color:#C9D4DF}
.kq-ct-proof{list-style:none;margin:12px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.kq-ct-proof a{display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box;padding:14px 16px;background:#0A1C36;color:#F8F6F1;text-decoration:none;transition:background-color 180ms ease}
.kq-ct-proof a:hover{background:#244676}
.kq-ct-proof strong{font-weight:400;font-size:28px;line-height:1.05;letter-spacing:-.02em;color:#DCBF85}
.kq-ct-proof span{font-size:15px;line-height:1.35;color:#C9D4DF}
/* the form */
.kq-cf{display:flex;flex-direction:column;gap:16px;box-sizing:border-box;padding:clamp(20px,2.2vw,30px);background:#FDFCFA;color:#262524}
.kq-cf-note{margin:0;font-size:15px;color:#626366}
.kq-cf-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.kq-cf-f{display:flex;flex-direction:column;gap:6px;min-width:0}
.kq-cf label,.kq-cf legend{font-size:15px;color:#262524}
.kq-cf input[type="text"],.kq-cf input[type="email"],.kq-cf select,.kq-cf textarea{font:inherit;font-size:18px;line-height:1.3;padding:11px 14px;min-height:50px;width:100%;box-sizing:border-box;border:1px solid #737C86;border-radius:0;background:#FFFFFF;color:#262524}
.kq-cf textarea{resize:vertical;min-height:96px}
.kq-cf textarea::placeholder{color:#626366;opacity:1}
.kq-cf :is(input,select,textarea):focus-visible{outline:3px solid #00618D;outline-offset:1px}
.kq-cf-hint{margin:0;font-size:15px;line-height:1.4;color:#626366}
.kq-cf-more{border-top:1px solid #C9D4DF;border-bottom:1px solid #C9D4DF}
.kq-cf-more summary{list-style:none;cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:4px 12px;min-height:48px;padding:4px 28px 4px 0;position:relative;font-size:16px;font-weight:500;color:#102A4C}
.kq-cf-more summary::-webkit-details-marker{display:none}
.kq-cf-more summary::after{content:"+";position:absolute;right:2px;top:50%;translate:0 -52%;font-size:26px;font-weight:300;line-height:1;color:#102A4C;transition:transform 240ms cubic-bezier(.22,1,.36,1)}
.kq-cf-more[open] summary::after{transform:rotate(45deg)}
.kq-cf-more summary:focus-visible{outline:3px solid #00618D;outline-offset:2px}
.kq-cf-opt{font-weight:400;font-size:15px;color:#626366}
.kq-cf-morein{display:flex;flex-direction:column;gap:18px;padding:6px 0 20px}
.kq-cf fieldset{border:0;margin:0;padding:0;min-width:0}
.kq-cf legend{padding:0;margin-bottom:2px;font-weight:500}
.kq-cf-cs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px}
.kq-cf-c{display:flex;align-items:center;gap:10px;min-height:44px;font-size:15px;cursor:pointer}
.kq-cf-c input{flex:none;width:22px;height:22px;margin:0;accent-color:#102A4C}
.kq-cf-carried{margin:0;padding:12px 14px;background:#E1E9F1;font-size:15px;line-height:1.4}
.kq-cf-hp{position:absolute!important;left:-9999px;width:1px;height:1px;overflow:hidden}
.kq-cf-priv{margin:0;font-size:15px;line-height:1.45;color:#626366}
.kq-cf-priv a{color:#00618D}
.kq-cf-fail{display:none;margin:0;padding:14px 16px;border-left:3px solid #A12B22;background:#F7E9E7;font-size:16px;line-height:1.45;color:#262524}
.kq-cf-fail.is-on,.kq-cf-fail:target{display:block}
.kq-cf-fail a{color:#00618D}
.kq-cf-fail:focus-visible{outline:3px solid #00618D;outline-offset:2px}
.kq-cf .kq-btn{margin-top:0!important;padding:14px 26px!important;font-size:18px!important}
.kq-cf .kq-btn[disabled]{opacity:.85}
/* other ways to reach us */
.kq-cr-grid{margin-top:clamp(28px,3vw,44px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,440px);gap:clamp(32px,5vw,80px);align-items:start}
.kq-cr-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px clamp(24px,3vw,48px)}
.kq-cr-i h3{margin:0;font-weight:500;font-size:20px;line-height:1.25;color:#102A4C}
.kq-cr-i p{margin:8px 0 0;font-size:17px;line-height:1.5;max-width:24em}
.kq-cr-i a{color:#00618D}
.kq-cr-direct{margin-top:2px!important}.kq-cr-direct a{display:block;width:fit-content;padding:8px 0}
.kq-cr-off{grid-column:1 / -1;padding-top:24px;border-top:1px solid #C5CCD3}
.kq-cr-off ul{list-style:none;margin:12px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 24px;font-size:16px;line-height:1.5}
.kq-cr-off strong{font-weight:500}
.kq-cr-img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover;object-position:88% center}
@media (max-width:1100px){.kq-ct-grid{grid-template-columns:minmax(0,1fr) minmax(0,520px);gap:32px 40px}.kq-cr-grid{grid-template-columns:1fr}.kq-cr-img{display:none}}
@media (max-width:900px){.kq-ct-grid{grid-template-columns:1fr;grid-template-areas:"intro" "form" "next" "res";gap:28px}.kq-ct-sure{display:none}}
@media (max-width:600px){.kq-ct-proof,.kq-cr-list,.kq-cr-off ul{grid-template-columns:1fr}.kq-cf-row,.kq-cf-cs{grid-template-columns:1fr}.kq-cf{margin:0 -4px}}
@media (prefers-reduced-motion:reduce){.kq-cf-more summary::after,.kq-ct-proof a{transition:none}}
</style>`;

// ---- the page's own script: carry answers in, send the form, say so if it fails ----
const JS = `<script>/* Contact form (scripts/site-contact.mjs) */
(function(){var d=document,w=window,f=d.querySelector('form[data-kq-form="contact"]');if(!f)return;
var E=f.elements,fail=f.querySelector('.kq-cf-fail'),more=f.querySelector('.kq-cf-more');
/* when the page was opened (the server ignores a form sent within two seconds), and where the visitor came from */
E.t.value=String(Date.now());
try{var r=d.referrer?new URL(d.referrer):null;if(r&&r.origin===location.origin&&r.pathname!==location.pathname)E.from.value=r.pathname;}catch(_){}
/* answers from the home page case finder: /contact#ch=wm&rev=m */
var CH={sc:'amazon-seller-central',vc:'amazon-vendor-central',wm:'walmart',tg:'target-plus',intl:'international'};
(function(){var c=/[#&]ch=([a-z]+)/.exec(location.hash),v=/[#&]rev=([a-z])/.exec(location.hash);if(!c&&!v)return;
var note=f.querySelector('.kq-cf-carried'),bits=[],box=c&&CH[c[1]]&&f.querySelector('input[name="channels"][value="'+CH[c[1]]+'"]');
if(box){box.checked=true;bits.push(box.parentNode.textContent.trim());}
var rv=v&&note.querySelector('[data-rev="'+v[1]+'"]');
if(rv){bits.push(rv.textContent);var o=rv.getAttribute('data-opt');if(o)E.revenue.value=o;}
if(!bits.length)return;note.querySelector('[data-kq-carried]').textContent=bits.join(', ');note.hidden=false;more.open=true;E.finder.value=bits.join('; ');})();
/* a personal address is fine; say that a work one helps */
var em=E.email,hint=f.querySelector('.kq-cf-hint'),FREE=/@(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|msn|icloud|me|mac|aol|proton|protonmail|pm|gmx|zoho|yandex|mail)\\.[a-z.]+$/i;
function nudge(){hint.hidden=!(em.validity.valid&&FREE.test(em.value.trim()));}
em.addEventListener('blur',nudge);em.addEventListener('input',function(){if(!hint.hidden)nudge();});
E.website.addEventListener('blur',function(){this.value=this.value.trim();});
/* a field with an error inside the closed optional block would be invisible: none are required there */
function byMail(){var rows=[['First name',E.first_name.value],['Last name',E.last_name.value],['Work email',em.value],['Company or brand',E.company.value],['Brand website',E.website.value],['What we want to achieve',E.notes.value]];
var body=rows.filter(function(x){return x[1];}).map(function(x){return x[0]+': '+x[1];}).join('\\n').slice(0,1500);
var a=fail.querySelector('[data-kq-mailto]');if(a)a.href='mailto:contact@kwontified.com?subject='+encodeURIComponent('Marketplace review request')+'&body='+encodeURIComponent(body);}
w.kqContact=function(form){var b=form.querySelector('button[type="submit"]');if(!b||b.disabled)return;b.disabled=true;fail.classList.remove('is-on');
var ctl='AbortController' in w?new AbortController():null,timer=setTimeout(function(){if(ctl)ctl.abort();},20000);
fetch('/api/contact',{method:'POST',body:new FormData(form),headers:{'x-kq-form':'1',accept:'application/json'},signal:ctl?ctl.signal:undefined})
.then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||!j.ok)throw 0;return j;});})
.then(function(j){clearTimeout(timer);try{sessionStorage.setItem('kq-lead','1');}catch(_){}location.assign('/contact/thank-you'+(j.confirmed?'?c=1':''));})
.catch(function(){clearTimeout(timer);b.disabled=false;byMail();fail.classList.add('is-on');fail.focus();});};
if(/[?&]sent=0/.test(location.search))fail.classList.add('is-on');
})();</script>`;

h = h.slice(0, a) + TOP + h.slice(b);
// the first question's answer, on the page and in the export's own copy of it for search engines
const Q1 = "We reply within one business day to suggest times for a discovery call. On the call";
if (h.split(Q1).length !== 3) fail(`the first question's answer: expected twice (page and structured data), found ${h.split(Q1).length - 1}`);
h = h.split(Q1).join("A senior team member reads your request, and we reply within one business day to suggest times for a discovery call. On the call");
h = once(h, "</head>", CSS + "</head>", "</head>");
h = h.replace(/<\/body>(?![\s\S]*<\/body>)/, () => JS + "</body>");
if (!h.includes("window.kqContact(f)")) fail("the form hook from build-site.mjs does not call window.kqContact");
if ((h.match(/<form\b[^>]*data-kq-form="contact"/g) || []).length !== 1) fail("expected one contact form");
fs.writeFileSync(FILE, h);

// ---- Thank-you page: the same promise, a line when a confirmation was emailed, and the
// conversion signal for Google Tag Manager (only ever read by tags the visitor consented to) ----
const TY = path.join(DIR, "contact--thank-you.html");
let t = fs.readFileSync(TY, "utf8");
t = once(t, "Your request has reached us. A member of our team will read it and reply within one business day to suggest times for a discovery call.</p>", 'Your request has reached us. A senior team member will read it, and we will reply within one business day to suggest times for a discovery call.</p><p data-kq-confirm hidden style="margin: 16px 0 0">We have sent a confirmation to your inbox.</p>', "the Thank-you page's first paragraph");
t = t.replace(/<\/body>(?![\s\S]*<\/body>)/, () => `<script>/* Thank-you page (scripts/site-contact.mjs) */
(function(){var p=document.querySelector('[data-kq-confirm]');if(p&&/[?&]c=1/.test(location.search))p.hidden=false;
try{if(sessionStorage.getItem('kq-lead')){sessionStorage.removeItem('kq-lead');(window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',form_id:'contact'});}}catch(_){}})();</script></body>`);
fs.writeFileSync(TY, t);

console.log(`site-contact: Contact page rebuilt (form on the first screen, 6 required fields, ${channels.length} channels, ${revenue.length} revenue bands and ${NEEDS.length} needs in the optional block, ${PROOF.length} results, 5 other routes); Thank-you page updated`);
