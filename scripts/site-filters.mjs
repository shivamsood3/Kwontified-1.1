// Filters on the Work page, the creative gallery and the case study pages (2026-11-27 filter
// review, plan approved by Jordan). Follows the Perspectives index (site-perspectives-ux.mjs):
// a count on every option, a removable chip per active filter, a result line announced to
// screen readers, and the filters in the address so a view can be shared and reached with Back.
//
// Work (/work):
//   - The export's filter and the shared pager are switched off for this list only (the export's
//     own code skips elements that already carry data-ready / data-pg-ready) and replaced by one
//     script that filters and pages together. The export filtered with a class and paged on the
//     hidden attribute, so "1–12 of 25" never changed and matches on page 2 stayed out of view.
//   - Cards keep their width when few match (auto-fill instead of auto-fit).
//   - Several choices inside a facet (Amazon or Walmart); counts say how many cards each option
//     adds given the other facets, and an option with none is disabled.
//   - Channels: Temu is its own option (it was folded into "TikTok, Instagram and Temu" and its
//     cases were tagged International); TikTok Shop and Instagram Shop share one. Capabilities use
//     the house names. Old addresses still work (#channel=social, #channel=intl, single values).
//   - A link to /work#channel=... followed while already on /work applies the filter.
//   - The filter bar sits directly under the introduction: the featured carousel moves below the
//     list, so the controls and their results stay together. On phones the bar stays in view while
//     the list scrolls and shrinks to the three facet buttons and the result line.
//   - A card whose case study page names a capability its card lacked gets that capability, so the
//     counts agree with the case pages.
// Case studies (25 pages): the category, channel and capabilities under the summary link to the
// Work page filtered to that value.
// Creative gallery (/work/creative): counts on the chips, a result line ("3 of 11 pieces")
// announced politely, the choice in the address (#kind=video, restored on load and on Back), and on
// phones one sideways-scrolling chip row that stays in view.
// Creative Studio (/capabilities/creative-studio): each service the gallery has a filter for links
// to that filtered view. Nothing else on that page changes.
//
// Runs after site-about.mjs and before site-seo.mjs (content changes come before the structured
// data); the list fade in site-effects.mjs watches the hidden and data-pg-off attributes this
// step's scripts set.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const fail = (m) => { throw new Error("site-filters: " + m); };
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const fileOf = (route) => path.join(ROOT, "public", (routes.find((r) => r.route === route) || fail(`${route} is not a route`)).file);
const once = (h, find, put, what) => {
  const n = h.split(find).length - 1;
  if (n !== 1) fail(`${what}: expected once, found ${n} times`);
  return h.replace(find, () => put);
};
const count = (h, re, n, what) => { const k = (h.match(re) || []).length; if (k !== n) fail(`${what}: expected ${n}, found ${k}`); };

// ---- the facets --------------------------------------------------------------------------------
const CH = [["amazon", "Amazon"], ["walmart", "Walmart"], ["target", "Target Plus"], ["temu", "Temu"], ["intl", "International"], ["social", "TikTok Shop and Instagram Shop"]];
const IND = [["beauty", "Beauty and personal care"], ["apparel", "Apparel, footwear and accessories"], ["food", "Food, health and wellness"], ["home", "Home and household"], ["pet", "Pet"]];
const CAP = [["retail", "Retail Media and Advertising"], ["creative", "Creative Studio"], ["ops", "Marketplace Operations"], ["analytics", "Analytics and Forecasting"], ["ai", "Agentic Commerce"], ["recovery", "Revenue Recovery"]];
const FACETS = { ch: CH, ind: IND, cap: CAP };
const HASH = { ch: "channel", ind: "industry", cap: "capability" };
// the channel a case study page names -> the Work page's channel value
const chKey = (t) => /temu/i.test(t) ? "temu" : /walmart/i.test(t) ? "walmart" : /target/i.test(t) ? "target" : /tiktok|instagram/i.test(t) ? "social"
  : /amazon (uk|mexico|europe|canada|japan)|zalando|mercado/i.test(t) ? "intl" : /amazon|ai shopping/i.test(t) ? "amazon" : fail(`no channel value for "${t}"`);

// ---- Work page ----------------------------------------------------------------------------------
const WORK = fileOf("/work");
let w = fs.readFileSync(WORK, "utf8");
if (w.includes("data-kq-filters")) fail("already applied; run the whole build");

const CARD_RE = /<a class="kq-ccard"([^>]*)>([\s\S]*?)<\/a>/g;
const cards = [...w.matchAll(CARD_RE)].map((m) => {
  const at = (k) => (m[1].match(new RegExp(` ${k}="([^"]*)"`)) || fail(`card without ${k}`))[1];
  const line = (m[2].match(/<p style="margin: 0; font-size: 15px; color: #626366">([^<]*)<\/p><h2/) || fail("card without its brand and channel line"))[1];
  return { href: at("href"), ch: at("data-ch").split(/\s+/), ind: at("data-ind").split(/\s+/), cap: at("data-cap").split(/\s+/), channel: line.split(". ").slice(1).join(". ") };
});
if (cards.length !== 25) fail(`expected 25 case study cards, found ${cards.length}`);
const changed = [];
// Temu is a marketplace of its own: its cases leave International; a case on Temu and Amazon is both
for (const c of cards) if (/temu/i.test(c.channel)) {
  const want = c.channel.split(/ and /).map(chKey);
  if (c.ch.join(" ") !== want.join(" ")) { changed.push(`${c.href}: channel ${c.ch.join(" ")} -> ${want.join(" ")}`); c.ch = want; }
}
if (changed.length !== 2) fail(`expected to move 2 Temu case studies out of International, moved ${changed.length}`);

// ---- case study pages: link the labels, and keep the cards' capabilities in step with them ----
const capKey = Object.fromEntries(CAP.map(([k, n]) => [n, k])), indKey = Object.fromEntries(IND.map(([k, n]) => [n, k]));
const A = (f, v, label) => `<a class="kq-il kq-ul kq-tag" href="/work#${HASH[f]}=${v}">${label}</a>`;
let caseLinks = 0;
for (const c of cards) {
  const file = fileOf(c.href);
  let h = fs.readFileSync(file, "utf8");
  const dd = (name) => {
    const re = new RegExp(`(<dt[^>]*>${name}<\\/dt><dd[^>]*>)([^<]*)(<\\/dd>)`, "g");
    const m = [...h.matchAll(re)];
    if (m.length !== 1) fail(`${c.href}: expected one "${name}" label, found ${m.length}`);
    return { re, value: m[0][2] };
  };
  const put = (name, fn) => { const { re, value } = dd(name); h = h.replace(re, (_, a, v, b) => a + fn(value) + b); caseLinks++; };
  put("Category", (v) => A("ind", indKey[v] || c.ind[0], v));
  put("Channel", (v) => {
    const parts = v.split(/ and /);
    if (parts.length === c.ch.length && parts.every((p, i) => chKey(p) === c.ch[i])) return parts.map((p, i) => A("ch", c.ch[i], p)).join(" and ");
    if (c.ch.length !== 1 || chKey(v) !== c.ch[0]) fail(`${c.href}: the page says "${v}" but the card's channel is ${c.ch.join(" ")}`);
    return A("ch", c.ch[0], v);
  });
  put("Capabilities", (v) => v.split(/, /).map((n) => {
    const k = capKey[n] || fail(`${c.href}: "${n}" is not a capability's house name`);
    if (!c.cap.includes(k)) { c.cap.push(k); changed.push(`${c.href}: capability ${k} added (the case study names it)`); }
    return A("cap", k, n);
  }).join(", "));
  if (!h.includes(".kq-tag{")) h = once(h, "</head>", `<style data-kq-filters>.kq-tag{display:inline-block;padding:6px 0}</style></head>`, `${c.href}: </head>`);
  fs.writeFileSync(file, h);
}

// write the corrected tags back onto the cards
{
  let i = 0;
  w = w.replace(CARD_RE, (all, attrs, body) => {
    const c = cards[i++];
    return `<a class="kq-ccard"${attrs.replace(/ data-ch="[^"]*"/, ` data-ch="${c.ch.join(" ")}"`).replace(/ data-cap="[^"]*"/, ` data-cap="${c.cap.join(" ")}"`)}>${body}</a>`;
  });
}

// the option lists, with the counts already written so nothing changes when the script starts
const has = (c, f, v) => c[f].includes(v);
const panel = (f) => {
  const opts = FACETS[f].map(([v, l]) => {
    const n = cards.filter((c) => has(c, f, v)).length;
    if (!n) fail(`${f}=${v} has no case studies`);
    return `<button type="button" data-f="${f}" data-v="${v}" data-l="${l}" aria-pressed="false" aria-label="${l}, ${n} case studies">${l} <span class="kq-fn" aria-hidden="true">${n}</span></button>`;
  }).join("");
  return `<p class="kq-fhint">Choose one or more</p><div class="kq-fchips" role="group" aria-label="${{ ch: "Channel", ind: "Industry", cap: "Capability" }[f]}"><button type="button" data-f="${f}" data-v="" aria-pressed="true">All</button>${opts}</div>`;
};
for (const f of ["ch", "ind", "cap"]) {
  const re = new RegExp(`(<div class="kq-fpanel" id="fp-${f}" hidden>)<div class="kq-fchips" role="group" aria-label="[^"]*">[\\s\\S]*?<\\/div>(<\\/div>)`, "g");
  count(w, re, 1, `the ${f} option panel`);
  w = w.replace(re, (_, a, b) => a + panel(f) + b);
}
// switch off the export's filter and the shared pager for this list (both skip a marked element)
w = once(w, '<div class="kq-wf">', '<div class="kq-wf" data-ready="1" data-kq-filters>', "the Work filter");
w = once(w, '<div class="kq-cgrid" id="work-grid" data-pg-size="12" style="flex: 1 1 0; min-width: 0; display: grid; grid-template-columns: repeat(auto-fit,',
  '<div class="kq-cgrid" id="work-grid" data-pg-size="12" data-pg-ready="1" style="flex: 1 1 0; min-width: 0; display: grid; grid-template-columns: repeat(auto-fill,', "the Work grid");
// one announcement per change: the result line speaks for filters, a hidden line for page turns
count(w, /<span data-pg-count aria-live="polite"><\/span>/g, 2, "the pager counts");
w = w.split('<span data-pg-count aria-live="polite"></span>').join("<span data-pg-count></span>");
w = once(w, '<h2 class="kq-sr" id="wf-title">Find a case study</h2>', '<h2 class="kq-sr" id="wf-title">Find a case study</h2><p class="kq-vh" aria-live="polite" data-kq-pglive></p><div class="kq-fsent" aria-hidden="true"></div>', "the filter heading");
w = once(w, '<p class="kq-fcount" aria-live="polite" aria-atomic="true">25 case studies</p>', '<p class="kq-fcount" aria-live="polite" aria-atomic="true">25 case studies</p>', "the result line");
// the featured carousel moves below the list, so the filter bar sits under the introduction
{
  const a = w.indexOf('<section class="kq-car" id="car-work"');
  const b = w.indexOf("</section>", a) + 10;
  const car = w.slice(a, b);
  if (a < 0 || car.includes("<section", 10)) fail("the featured carousel is not one plain section");
  const list = w.indexOf('<section style="padding: 0 clamp(20px, 4.4vw, 64px) 0"><div style="max-width: 1312px; margin: 0 auto"><div class="kq-wf" data-ready="1" data-kq-filters>');
  if (w.slice(b, list).trim() !== "") fail("the case study list no longer follows the featured carousel");
  w = w.slice(0, a) + w.slice(b);
  w = once(w, '<section aria-label="What clients say"', car + '<section aria-label="What clients say"', "the quotes section");
}

const WCSS = `<style data-kq-filters>
/* Work filter (scripts/site-filters.mjs) */
.kq-ccard[hidden]{display:none!important}
.kq-pgb[hidden]{display:none!important}
#car-work{margin-top:clamp(64px,7vw,112px)}
.kq-fhint{margin:4px 10px 6px;font-size:13px;color:#626366}
.kq-fpanel .kq-fchips button{justify-content:flex-start;gap:10px}
.kq-fpanel .kq-fchips button .kq-fn{margin-left:auto;padding-left:12px}
.kq-fpanel .kq-fchips button[data-v]:not([data-v=""])::before{content:"";flex:none;width:16px;height:16px;box-sizing:border-box;border:1.5px solid #737C86;border-radius:4px;background:#FFFFFF center/12px 12px no-repeat}
.kq-fpanel .kq-fchips button[aria-pressed="true"]:not([data-v=""])::before{border-color:#102A4C;background-color:#102A4C;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2l2.3 2.3 4.7-5' fill='none' stroke='%23F8F6F1' stroke-width='1.8'/%3E%3C/svg%3E")}
.kq-fpanel .kq-fchips button[aria-disabled="true"]::before{opacity:.45}
.kq-fpills button{min-height:36px}
.kq-fsent{height:1px;margin-bottom:-1px}
@media (max-width:760px){
.kq-wf.is-live .kq-fctl{position:sticky;top:var(--kq-hh,64px);z-index:15}
.kq-fctl.is-stuck{padding-top:10px!important;padding-bottom:10px!important;border-radius:0 0 16px 16px!important}
.kq-fctl.is-stuck .kq-fsearch,.kq-fctl.is-stuck .kq-fpills{display:none!important}
.kq-fctl.is-stuck .kq-factive{margin-top:8px;padding-top:8px;min-height:0}
.kq-fpanel{max-height:min(60vh,420px);overflow-y:auto}
}
@media (prefers-reduced-motion:reduce){.kq-wf.is-live .kq-fctl{transition:none}}
</style>`;

const WJS = `<script>/* Work filter and pager (scripts/site-filters.mjs) */
(function(){var d=document,w=window,wf=d.querySelector('.kq-wf[data-kq-filters]'),grid=d.getElementById('work-grid');if(!wf||!grid||wf.kqOn)return;wf.kqOn=1;wf.classList.add('is-live');
var cards=[].slice.call(grid.querySelectorAll('.kq-ccard')),q=d.getElementById('wf-q'),count=wf.querySelector('.kq-fcount'),clear=wf.querySelector('.kq-fclear'),empty=wf.querySelector('.kq-fempty'),
pills=wf.querySelector('.kq-fpills'),dds=[].slice.call(wf.querySelectorAll('.kq-fdd')),btns=[].slice.call(wf.querySelectorAll('.kq-fchips button')),pgl=wf.querySelector('[data-kq-pglive]'),ctl=wf.querySelector('.kq-fctl'),
ctls=[].slice.call(d.querySelectorAll('[data-pg-for="work-grid"]')),F=['ch','ind','cap'],AT={ch:'data-ch',ind:'data-ind',cap:'data-cap'},N={ch:'Channel',ind:'Industry',cap:'Capability'},H={ch:'channel',ind:'industry',cap:'capability'},
OLD={tiktok:'social',instagram:'social','tiktok-shop':'social','instagram-shop':'social',international:'intl','target-plus':'target'},SIZE=+grid.getAttribute('data-pg-size')||12,
st={ch:[],ind:[],cap:[],q:''},shown=cards.slice(),page=0,mine='';
function vals(c,f){return (c.getAttribute(AT[f])||'').split(/\\s+/);}
function hit(c,s,skip){for(var i=0;i<3;i++){var f=F[i],v=s[f];if(f!==skip&&v.length&&!v.some(function(x){return vals(c,f).indexOf(x)>=0;}))return false;}return !s.q||c.getAttribute('data-text').indexOf(s.q)>=0;}
function lab(f,v){var b=wf.querySelector('.kq-fchips button[data-f="'+f+'"][data-v="'+v+'"]');return b?b.getAttribute('data-l'):v;}
function known(f,v){return !!wf.querySelector('.kq-fchips button[data-f="'+f+'"][data-v="'+v+'"]');}
function range(){return (page*SIZE+1)+'\\u2013'+Math.min(shown.length,(page+1)*SIZE)+' of '+shown.length;}
function paint(){var pages=Math.max(1,Math.ceil(shown.length/SIZE));page=Math.max(0,Math.min(page,pages-1));
cards.forEach(function(c){var i=shown.indexOf(c);if(c.hidden!==(i<0))c.hidden=i<0;var off=i>=0&&(i<page*SIZE||i>=(page+1)*SIZE);if(off!==c.hasAttribute('data-pg-off')){if(off)c.setAttribute('data-pg-off','');else c.removeAttribute('data-pg-off');}});
ctls.forEach(function(c){var n=c.querySelector('[data-pg-count]'),p=c.querySelector('[data-pg-prev]'),x=c.querySelector('[data-pg-next]');if(n)n.textContent=shown.length?range():'';
if(p){p.disabled=page===0;p.hidden=pages<2;}if(x){x.disabled=page>=pages-1;x.hidden=pages<2;}c.hidden=false;});}
function hash(){var h=[];F.forEach(function(f){if(st[f].length)h.push(H[f]+'='+st[f].join(','));});if(st.q)h.push('q='+encodeURIComponent(st.q));return h.length?'#'+h.join('&'):'';}
function write(){var h=hash();mine=h;try{if(h!==location.hash&&!(h===''&&!location.hash))history.replaceState(history.state,'',location.pathname+location.search+h);}catch(_){}}
function read(){var s={ch:[],ind:[],cap:[],q:''},R={channel:'ch',industry:'ind',capability:'cap'};
location.hash.replace(/^#/,'').split('&').forEach(function(p){var i=p.indexOf('='),k=p.slice(0,i),v=p.slice(i+1);if(i<0)return;
try{v=decodeURIComponent(v.replace(/\\+/g,' '));}catch(_){}
if(R[k])v.toLowerCase().split(',').forEach(function(x){x=OLD[x]||x;var f=R[k];if(known(f,x)&&s[f].indexOf(x)<0)s[f].push(x);});
if(k==='q')s.q=v.trim().toLowerCase();});return s;}
function pill(text,label,fn){var li=d.createElement('li'),b=d.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);
b.addEventListener('click',function(){var all=[].slice.call(pills.querySelectorAll('button')),i=all.indexOf(b);fn();apply(true);var now=pills.querySelectorAll('button');(now[Math.min(i,now.length-1)]||q).focus();});li.appendChild(b);pills.appendChild(li);}
function apply(save){shown=cards.filter(function(c){return hit(c,st);});var n=shown.length,any=st.ch.length||st.ind.length||st.cap.length||st.q;page=0;
count.textContent=(n===cards.length?n:n+' of '+cards.length)+(cards.length===1?' case study':' case studies');empty.hidden=n>0;clear.hidden=!any;
btns.forEach(function(b){var f=b.getAttribute('data-f'),v=b.getAttribute('data-v');
if(!v){b.setAttribute('aria-pressed',st[f].length?'false':'true');return;}
var on=st[f].indexOf(v)>=0,k=cards.filter(function(c){return hit(c,st,f)&&vals(c,f).indexOf(v)>=0;}).length,sp=b.querySelector('.kq-fn');
b.setAttribute('aria-pressed',on?'true':'false');if(sp)sp.textContent=k;b.setAttribute('aria-disabled',(!on&&k===0)?'true':'false');b.setAttribute('aria-label',lab(f,v)+', '+k+(k===1?' case study':' case studies'));});
dds.forEach(function(x){var f=x.getAttribute('data-f'),s=st[f],val=x.querySelector('.kq-fval');val.textContent=!s.length?'All':lab(f,s[0])+(s.length>1?' +'+(s.length-1):'');x.classList.toggle('is-set',!!s.length);});
pills.innerHTML='';F.forEach(function(f){st[f].forEach(function(v){pill(lab(f,v),'Remove filter: '+N[f]+', '+lab(f,v),function(){st[f]=st[f].filter(function(x){return x!==v;});});});});
if(st.q)pill('\\u201C'+st.q+'\\u201D','Clear search: '+st.q,function(){st.q='';q.value='';});
if(save)write();paint();}
/* the pager: the same controls as before, now counting only the cards that match */
ctls.forEach(function(c){var p=c.querySelector('[data-pg-prev]'),x=c.querySelector('[data-pg-next]');
function go(n,btn,other){page+=n;paint();if(pgl)pgl.textContent='Case studies '+range().replace('\\u2013',' to ');
if(btn.disabled&&other&&!other.disabled)other.focus();
if(c.hasAttribute('data-pg-bottom')||grid.getBoundingClientRect().top<0)grid.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
if(p)p.addEventListener('click',function(){go(-1,p,x);});if(x)x.addEventListener('click',function(){go(1,x,p);});});
/* options: All clears the facet; any other option is added or taken away */
function shut(x){x.classList.remove('is-open');x.querySelector('.kq-fsum').setAttribute('aria-expanded','false');x.querySelector('.kq-fpanel').hidden=true;}
function open(x){dds.forEach(function(o){if(o!==x)shut(o);});x.classList.add('is-open');x.querySelector('.kq-fsum').setAttribute('aria-expanded','true');var pn=x.querySelector('.kq-fpanel');pn.hidden=false;
var on=pn.querySelector('button[aria-pressed="true"]')||pn.querySelector('button');if(on)on.focus();}
btns.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f'),v=b.getAttribute('data-v'),dd=b.closest('.kq-fdd');
if(!v){st[f]=[];apply(true);if(dd){shut(dd);dd.querySelector('.kq-fsum').focus();}return;}
if(b.getAttribute('aria-disabled')==='true')return;var i=st[f].indexOf(v);if(i<0)st[f].push(v);else st[f].splice(i,1);apply(true);});});
dds.forEach(function(x){x.querySelector('.kq-fsum').addEventListener('click',function(){x.classList.contains('is-open')?shut(x):open(x);});
x.addEventListener('keydown',function(e){if(!x.classList.contains('is-open'))return;if(e.key==='Escape'){shut(x);x.querySelector('.kq-fsum').focus();}
if(e.key==='ArrowDown'||e.key==='ArrowUp'){var bs=[].slice.call(x.querySelectorAll('.kq-fpanel button')),i=bs.indexOf(d.activeElement);e.preventDefault();i=e.key==='ArrowDown'?Math.min(bs.length-1,i+1):Math.max(0,i-1);bs[i].focus();}});
x.addEventListener('focusout',function(e){if(x.classList.contains('is-open')&&e.relatedTarget&&!x.contains(e.relatedTarget))shut(x);});});
d.addEventListener('click',function(e){dds.forEach(function(x){if(x.classList.contains('is-open')&&!x.contains(e.target))shut(x);});});
var tm;q.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){st.q=q.value.trim().toLowerCase();apply(true);},150);});
function reset(){st={ch:[],ind:[],cap:[],q:''};q.value='';apply(true);q.focus();}
clear.addEventListener('click',reset);wf.querySelector('.kq-fclear2').addEventListener('click',reset);
/* a link to /work#channel=... on this page, or Back and Forward between such links */
function fromAddress(scroll){if(location.hash===mine||(location.hash&&!/^#(?:.*&)?(?:channel|industry|capability|q)=/.test(location.hash)))return;st=read();q.value=st.q;apply(false);mine=location.hash;
if(scroll)wf.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
w.addEventListener('hashchange',function(){fromAddress(true);});
/* the header's height, for the bar that stays in view on phones; the bar shrinks once it is stuck */
var hd=d.querySelector('.kq-head');function hh(){if(hd)wf.style.setProperty('--kq-hh',Math.round(hd.getBoundingClientRect().height)+'px');}
hh();w.addEventListener('resize',hh);if(hd&&'ResizeObserver' in w)new ResizeObserver(hh).observe(hd);
var sent=wf.querySelector('.kq-fsent'),stuck=false,mq=w.matchMedia('(max-width:760px)');
function stick(){var on=mq.matches&&sent.getBoundingClientRect().top<(parseFloat(getComputedStyle(wf).getPropertyValue('--kq-hh'))||64)-4&&wf.getBoundingClientRect().bottom>w.innerHeight*0.5;
if(on===stuck)return;stuck=on;var h0=ctl.offsetHeight;ctl.classList.toggle('is-stuck',on);ctl.style.marginBottom='';if(on)ctl.style.marginBottom=(h0-ctl.offsetHeight)+'px';}
w.addEventListener('scroll',function(){stick();},{passive:true});w.addEventListener('resize',stick);
st=read();q.value=st.q;mine=location.hash;apply(false);stick();
})();</script>`;

w = once(w, "</head>", WCSS + "</head>", "</head>");
w = w.replace(/<\/body>(?![\s\S]*<\/body>)/, () => WJS + "</body>");
fs.writeFileSync(WORK, w);

// ---- creative gallery -----------------------------------------------------------------------------
const GAL = fileOf("/work/creative");
let g = fs.readFileSync(GAL, "utf8");
const figs = [...g.matchAll(/<figure\b[^>]*\sdata-gc="([^"]+)"/g)].map((m) => m[1].split(/\s+/));
if (figs.length !== 11) fail(`creative gallery: expected 11 pieces, found ${figs.length}`);
const kinds = [];
g = g.replace(/<button type="button" data-gf="([a-z]+)" aria-pressed="(true|false)"([^>]*)>([^<]+)<\/button>/g, (_, v, p, rest, label) => {
  const n = v === "all" ? figs.length : figs.filter((k) => k.includes(v)).length;
  if (!n) fail(`creative gallery: the ${label} chip has no pieces`);
  kinds.push([v, label, n]);
  return `<button type="button" data-gf="${v}" aria-pressed="${p}"${v === "all" ? ' data-ready="1"' : ""}${rest} aria-label="${label}, ${n} ${n === 1 ? "piece" : "pieces"}">${label} <span class="kq-gn" aria-hidden="true">${n}</span></button>`;
});
if (kinds.length !== 7 || kinds[0][0] !== "all") fail(`creative gallery: expected All and six kinds of work, found ${kinds.length} chips`);
g = once(g, '<div role="group" aria-label="Filter the gallery" style="display: flex; flex-wrap: wrap; gap: 10px">',
  '<div class="kq-gbar"><div class="kq-gchips" role="group" aria-label="Filter the gallery" style="display: flex; flex-wrap: wrap; gap: 10px">', "the gallery chips");
{
  const a = g.indexOf('<div class="kq-gchips"'), b = g.indexOf("</div>", a) + 6;
  g = g.slice(0, b) + `<p class="kq-gcount" aria-live="polite" aria-atomic="true">${figs.length} pieces</p></div>` + g.slice(b);
}
g = once(g, '<div style="margin-top: 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 24px">',
  '<div class="kq-ggrid" style="margin-top: 32px; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr)); gap: 24px">', "the gallery grid");
const GCSS = `<style data-kq-filters>
/* Creative gallery filter (scripts/site-filters.mjs) */
.kq-gbar{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}
.kq-gn{margin-left:8px;opacity:.75;font-variant-numeric:tabular-nums}
.kq-gcount{margin:0;font-size:15px;color:#626366}
figure[data-gc][hidden]{display:none!important}
.kq-ggrid{scroll-margin-top:calc(var(--kq-hh,64px) + 120px)}
@media (max-width:760px){
.kq-gbar{position:sticky;top:var(--kq-hh,64px);z-index:15;display:block;margin:0 calc(-1 * clamp(20px,4.4vw,64px));padding:10px clamp(20px,4.4vw,64px) 8px;background:#FDFCFA;box-shadow:0 8px 16px -12px rgba(16,42,76,.35)}
.kq-gchips{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;scroll-padding:0 20px;margin:0 calc(-1 * clamp(20px,4.4vw,64px));padding:0 clamp(20px,4.4vw,64px)}
.kq-gchips::-webkit-scrollbar{display:none}
.kq-gchips button{flex:none;white-space:nowrap}
.kq-gcount{font-size:14px;margin-top:6px}
}
</style>`;
const GJS = `<script>/* Creative gallery filter (scripts/site-filters.mjs) */
(function(){var d=document,w=window,bar=d.querySelector('.kq-gbar');if(!bar||bar.kqOn)return;bar.kqOn=1;
var btns=[].slice.call(bar.querySelectorAll('button[data-gf]')),figs=[].slice.call(d.querySelectorAll('figure[data-gc]')),out=bar.querySelector('.kq-gcount'),grid=d.querySelector('.kq-ggrid'),mine=location.hash;
function has(f,v){return v==='all'||(' '+f.getAttribute('data-gc')+' ').indexOf(' '+v+' ')>-1;}
function known(v){return btns.some(function(b){return b.getAttribute('data-gf')===v;});}
function read(){var h=location.hash.replace(/^#/,''),m=/(?:^|&)kind=([a-z]+)/.exec(h),v=m?m[1]:h;return known(v)?v:'all';}
function set(v,save){var n=0;btns.forEach(function(b){var on=b.getAttribute('data-gf')===v;b.style.background=on?'#102A4C':'#E1E9F1';b.style.color=on?'#F8F6F1':'#262524';b.setAttribute('aria-pressed',on?'true':'false');});
figs.forEach(function(f){var ok=has(f,v);if(f.hidden===ok)f.hidden=!ok;f.style.display='';if(ok)n++;});
out.textContent=(v==='all'?n:n+' of '+figs.length)+' pieces';
if(save){mine=v==='all'?'':'#kind='+v;try{history.replaceState(history.state,'',location.pathname+location.search+mine);}catch(_){}}}
btns.forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-gf'),true);
var row=b.parentNode;if(row.scrollWidth>row.clientWidth)b.scrollIntoView({block:'nearest',inline:'nearest'});
if(grid&&grid.getBoundingClientRect().top<bar.getBoundingClientRect().bottom)grid.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});});
w.addEventListener('hashchange',function(){var h=location.hash.replace(/^#/,'');if(location.hash===mine||(h&&!/^kind=/.test(h)&&!known(h)))return;mine=location.hash;set(read(),false);bar.scrollIntoView({block:'start'});});
var hd=d.querySelector('.kq-head');function hh(){if(hd)d.documentElement.style.setProperty('--kq-hh',Math.round(hd.getBoundingClientRect().height)+'px');}
hh();w.addEventListener('resize',hh);if(hd&&'ResizeObserver' in w)new ResizeObserver(hh).observe(hd);
set(read(),false);var on=bar.querySelector('[aria-pressed="true"]');if(on&&on.parentNode.scrollWidth>on.parentNode.clientWidth)on.parentNode.scrollLeft=on.offsetLeft-20;
})();</script>`;
g = once(g, "</head>", GCSS + "</head>", "</head>");
g = g.replace(/<\/body>(?![\s\S]*<\/body>)/, () => GJS + "</body>");
fs.writeFileSync(GAL, g);

// ---- Creative Studio: each service the gallery can show links to that view ---------------------------
const CS = fileOf("/capabilities/creative-studio");
let s = fs.readFileSync(CS, "utf8");
const SERVICES = [["Product and lifestyle photography", "photography"], ["AI image and video", "ai"], ["Video", "video"], ["A+ and Premium A+ Content", "aplus"], ["Storefront wireframes and refreshes", "storefronts"], ["Social and creator content", "social"]];
for (const [h3, kind] of SERVICES) {
  const label = (kinds.find((k) => k[0] === kind) || fail(`the gallery has no ${kind} filter`))[1];
  const re = new RegExp(`(<h3 style="margin: 0; font-weight: 500; font-size: 22px">${h3.replace(/[+]/g, "\\+")}<\\/h3><p style="margin: 10px 0 0">[^<]*<\\/p>)`, "g");
  count(s, re, 1, `Creative Studio: the "${h3}" service`);
  s = s.replace(re, (m) => `${m}<p class="kq-xl"><a href="/work/creative#kind=${kind}">${label} in the creative gallery</a> <span aria-hidden="true">→</span></p>`);
}
if (!s.includes(".kq-xl")) fail("Creative Studio: the kq-xl link style is missing");
fs.writeFileSync(CS, s);

console.log(`site-filters: Work page (${CH.length} channels with Temu on its own, house capability names, several choices per facet, paging follows the filter, filter bar under the introduction, ${changed.length} card tags corrected); ${caseLinks} labels linked on ${cards.length} case studies; gallery (${kinds.length} chips with counts, result line, #kind= address); ${SERVICES.length} Creative Studio services linked to the gallery`);
for (const c of changed) console.log("  · " + c);
