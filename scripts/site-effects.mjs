// Interaction and motion details shared by every page, added as the last build step.
//
// The inner pages already carry a motion system from the export (headline reveal, sections
// that rise in on scroll, page cross-fade). This step fills the gaps found in the UX review
// of 2026-11-27, with the same timings and easing so the site reads as one system:
//
//   1. Home page: the same headline reveal, scroll reveals, count-up on the three results
//      and page cross-fade the inner pages have.
//   2. Hover feedback on the links and buttons that had none (FAQ questions, footer icons
//      and legal links, breadcrumbs, text links with an inline colour, filter buttons).
//   3. Faster page changes: the browser fetches a page when the pointer rests on its link.
//   4. Form feedback: the button says what is happening, and a field explains its error.
//   5. A "Skip to main content" link for keyboard users.
//   6. A back-to-top button on long pages (on narrow screens it appears only at the end of the
//      page, so it never covers text being read).
//   7. A reading progress line on articles, news items and press releases.
//   8. Phones: "Request a review" stays in the header while scrolling (the wordmark
//      shortens to the K to make room), as it already does on tablets and desktop.
//   9. Tap feedback in the brand colours.
//  10. A short fade when a filter, search or pager changes a list.
//  11. From the QA review of 2026-11-27: about 80 characters a line on articles, legal and job
//      pages; balanced headings; a visible focus ring on every Perspectives row; the header
//      row kept to one line while fonts load, with a fallback face sized like the web font so
//      the swap barely moves the text; 44 px touch targets for standalone links on phones;
//      outlines and a visible wordmark in Windows contrast themes; a shorter phone footer
//      (two link columns, and no newsletter sign-up on the contact page, whose job is the
//      review request); a field-specific message for each empty required field.
//
// Everything that moves is off for visitors who ask for reduced motion. Nothing here hides
// content without JavaScript except the home page's scroll reveals, which are applied by the
// same script that shows them. Fails the build if a page or hook it relies on is missing.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { throw new Error("site-effects: " + m); };
const one = (html, re, to, what) => {
  const n = (html.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) || []).length;
  if (n !== 1) fail(`${what}: expected one match, found ${n}`);
  return html.replace(re, to);
};

// ---------------------------------------------------------------- styles, every page
const EASE = "var(--ease-out,cubic-bezier(.22,1,.36,1))";
// the white wordmark in the header and footer (shown dark in a light Windows contrast theme)
const LOGO = "023b2419eb30.svg";
if (!fs.existsSync(path.join(ASSETS, LOGO))) fail(`the white wordmark ${LOGO} is not in public/assets`);
const CSS = `<style data-kq-fx>
/* skip link: off screen until a keyboard user reaches it */
.kq-skip{position:fixed;left:16px;top:12px;z-index:100;padding:12px 18px;background:#FDFCFA;color:#102A4C!important;font-size:16px;font-weight:500;line-height:1.2;text-decoration:none!important;border-radius:14px;corner-shape:squircle;box-shadow:0 8px 24px rgba(10,28,54,.28);transform:translateY(-250%)}
.kq-skip:focus{transform:none;outline:3px solid #DCBF85;outline-offset:2px}
main:focus{outline:none}
/* hover feedback where the export had none */
.kq-q{transition:color 180ms ease}
footer a,nav[aria-label="Breadcrumb"] a,main a[style*="color: #"]:not([class]){transition:color 180ms ease,background-color 180ms ease}
main a[style*="gap"]>svg[aria-hidden]:last-child{transition:transform 240ms ${EASE}}
@media (hover:hover){
.kq-q:hover,.kq-q:hover::after{color:#00618D}
main a[style*="color: #102A4C"]:not([style*="background: #"]):not(.kq-btn):hover,a.kq-il:hover{color:#00618D!important}
a[style*="color: #626366"]:hover{color:#102A4C!important}
:is(a,button)[style*="color: #F8F6F1"]:not([style*="background: #"]):not(.kq-btn):hover,a[style*="color: #C9D4DF"]:hover,footer a:not([style*="background: #"]):hover{color:#DCBF85!important}
.kq-hero.kq-hero-dark nav a:hover{color:#DCBF85!important}
:is([style*="background: #102A4C"],[style*="background: #0A1C36"],.kq-close,.kq-band,.kq-s-pattern) a.kq-il:hover{color:#DCBF85!important}
main a[style*="gap"]:hover>svg[aria-hidden]:last-child{transform:translateX(4px)}
#finder button[aria-pressed="false"]:hover{background:#FDFCFA!important;border-color:#102A4C!important;color:#102A4C!important}
#finder button[aria-pressed="true"]:hover,button[data-gf][aria-pressed="true"]:hover{background:#244676!important}
button[data-gf][aria-pressed="false"]:hover{background:#D3D9DF!important}
}
#finder button,button[data-gf]{transition:background-color 180ms ease,color 180ms ease,border-color 180ms ease}
/* tap feedback in the brand colours */
html{-webkit-tap-highlight-color:rgba(16,42,76,.14)}
header,footer,[style*="background: #102A4C"],[style*="background: #0A1C36"],.kq-close,.kq-band,.kq-s-pattern{-webkit-tap-highlight-color:rgba(220,191,133,.3)}
:is(a[style*="background: #DCBF85"],a[style*="background: #102A4C"],footer button[type="submit"],#finder button,button[data-gf]):active{transform:scale(.97)}
@media (hover:none){
.kq-q:active,.kq-q:active::after{color:#00618D!important}
:is([data-kq-row],.kq-ccard,.kq-tile,.kq-press-card,.kq-cb):active{opacity:.78!important;transition:opacity 80ms ease!important}
}
/* back to top */
.kq-top{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom) + var(--lift,0px));z-index:15;width:48px;height:48px;padding:0;border-radius:50%;border:1px solid rgba(248,246,241,.45);background:#102A4C;color:#F8F6F1;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 8px 24px rgba(10,28,54,.28);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity 240ms ease,transform 240ms ${EASE},visibility 0s 240ms,background-color 180ms ease}
.kq-top.is-on{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.kq-top:hover{background:#244676}
body:has(header details[open]) .kq-top{opacity:0;visibility:hidden}
.kq-top:active{transform:scale(.95)}
.kq-top:focus-visible{outline:3px solid #00618D;outline-offset:3px;box-shadow:0 0 0 3px #FDFCFA,0 8px 24px rgba(10,28,54,.28)}
/* reading progress, on the bottom edge of the header */
.kq-prog{position:absolute;left:0;right:0;bottom:0;height:3px;background:#DCBF85;transform:scaleX(0);transform-origin:0 50%;pointer-events:none}
/* form feedback */
.kq-ferr{margin:0;font-size:15px;line-height:1.4;color:#A12B22}
footer .kq-ferr,.kq-ferr.kq-ferr-dark{margin:10px 0 0;font-size:14px;color:#F8F6F1}
form[data-kq-form] [aria-invalid="true"]{border-color:#A12B22!important;box-shadow:inset 0 0 0 1px #A12B22}
footer form[data-kq-form] [aria-invalid="true"]{border-color:#DCBF85!important;box-shadow:inset 0 0 0 2px #DCBF85}
form[data-kq-form] button[aria-busy="true"]{cursor:progress}
/* phones: the review button stays in the header while scrolling; the wordmark shortens to the K */
@media (max-width:600px){
.kq-head>nav{flex-wrap:nowrap!important;gap:12px!important}
.kq-head.is-stuck a[aria-label="Kwontified home"]>img,.kq-hh.is-stuck>div>a:first-child>img{clip-path:inset(0 calc(100% - 22px) 0 0)}
.kq-head.is-stuck a[aria-label="Kwontified home"],.kq-hh.is-stuck>div>a:first-child{flex:none;width:44px;overflow:hidden}
.kq-head a[aria-label="Kwontified home"]>img,.kq-hh>div>a:first-child>img{flex:none;max-width:none}
.kq-head.is-stuck .kq-links{display:flex!important;margin-left:auto;flex-wrap:nowrap!important}
.kq-head.is-stuck .kq-links>:not(.kq-btn){display:none!important}
.kq-head.is-stuck .kq-links>.kq-btn{padding:10px 14px!important;font-size:14px!important;white-space:nowrap}
.kq-hh>div{flex-wrap:nowrap!important;gap:8px 12px!important}
}
@media (max-width:760px){
.kq-hh.is-stuck>div{padding-top:10px!important;padding-bottom:10px!important}
.kq-hh.is-stuck .kq-hact{display:flex!important;margin-left:auto;order:2;flex-wrap:nowrap!important}
.kq-hh.is-stuck .kq-hact>:not([href="/contact"]){display:none!important}
.kq-hh.is-stuck .kq-hact>a[href="/contact"]{box-sizing:border-box;min-height:44px;padding:10px 14px!important;font-size:14px;white-space:nowrap}
.kq-hh.is-stuck .kq-menu{order:3;margin-left:0}
}
/* English pages show the review button from the top of the page on phones too, with the short K
   (translated previews keep it for when the visitor scrolls: their labels are longer) */
@media (max-width:600px){
html[lang="en"] .kq-head a[aria-label="Kwontified home"]>img,html[lang="en"] .kq-hh>div>a:first-child>img{clip-path:inset(0 calc(100% - 22px) 0 0)}
html[lang="en"] .kq-head a[aria-label="Kwontified home"],html[lang="en"] .kq-hh>div>a:first-child{flex:none;width:44px;overflow:hidden}
html[lang="en"] .kq-head .kq-links{display:flex!important;margin-left:auto;flex-wrap:nowrap!important}
html[lang="en"] .kq-head .kq-links>:not(.kq-btn){display:none!important}
html[lang="en"] .kq-head .kq-links>.kq-btn{padding:10px 14px!important;font-size:14px!important;white-space:nowrap}
}
@media (max-width:760px){
html[lang="en"] .kq-hh .kq-hact{display:flex!important;margin-left:auto;order:2;flex-wrap:nowrap!important}
html[lang="en"] .kq-hh .kq-hact>:not([href="/contact"]){display:none!important}
html[lang="en"] .kq-hh .kq-hact>a[href="/contact"]{box-sizing:border-box;min-height:44px;padding:10px 14px!important;font-size:14px;white-space:nowrap}
html[lang="en"] .kq-hh .kq-menu{order:3;margin-left:0}
}
@media screen and (prefers-reduced-motion:no-preference){
.kq-skip{transition:transform 140ms ${EASE}}
.kq-swap{animation:kq-swap 280ms ${EASE} both}
@keyframes kq-swap{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (max-width:760px){
.kq-head.is-stuck .kq-links>.kq-btn,.kq-hh.is-stuck .kq-hact>a[href="/contact"]{animation:kq-fade 240ms ease both}
}
@media (max-width:600px){
.kq-head.is-stuck a[aria-label="Kwontified home"]>img,.kq-hh.is-stuck>div>a:first-child>img{animation:kq-fade 240ms ease both}
}
}
@keyframes kq-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
.kq-top,.kq-q,main a[style*="gap"]>svg[aria-hidden]:last-child{transition:none}
main a[style*="gap"]:hover>svg[aria-hidden]:last-child,.kq-top:active,:is(a[style*="background: #DCBF85"],a[style*="background: #102A4C"],footer button[type="submit"],#finder button,button[data-gf]):active{transform:none}
}
@media print{.kq-skip,.kq-top,.kq-prog{display:none!important}}
/* back to top on narrower screens: a ring in the page colour sets it apart from what is behind it */
@media (max-width:1199px){.kq-top{right:max(8px,env(safe-area-inset-right));bottom:calc(8px + env(safe-area-inset-bottom) + var(--lift,0px));box-shadow:0 0 0 3px #F8F6F1,0 8px 24px rgba(10,28,54,.28)}}
/* reading measure: about 80 characters a line on articles, legal pages, job pages and channel
   introductions (the 68ch and 75ch caps from the export ran to 95-110, because "0" is wide in
   this face). Tables and figures keep the full column. */
article[data-art="body"] :is(p,li),main[data-kq-read] :is(p,li),main p.kq-wwr,main .kq-mappanel p,main p:is([style*="max-width: 36em"],[style*="max-width: 40em"],[style*="max-width: 44em"],[style*="max-width: 50em"]){max-width:33em!important}
/* a table that scrolls sideways can be focused and scrolled with the keyboard; show where focus is */
div[role="region"][tabindex="0"]:focus-visible{outline:3px solid #00618D;outline-offset:2px}
/* headings do not leave one word on the last line; paragraphs avoid a lone last word */
h1,h2,h3{text-wrap:balance}
@media (min-width:700px){.kq-nw{white-space:nowrap}}
@media (max-width:359px){main h1#page-title{font-size:31px!important}}
main p{text-wrap:pretty}
/* focus ring on Perspectives rows: one colour that shows on the page, including round the navy
   featured card (the ring took the text colour, cream on cream) */
[data-kq-row]:focus-within{outline:3px solid #00618D!important;outline-offset:4px}
:is([style*="background: #102A4C"],[style*="background: #0A1C36"],.kq-close,.kq-band,.kq-s-pattern) [data-kq-row]:focus-within{outline-color:#DCBF85!important}
/* while the web fonts load, text is set in Arial (or its metric twin) scaled to the web font's
   width and line metrics, so the swap barely moves anything (measured against the woff2 files) */
@font-face{font-family:'KQ Fallback';src:local('Arial'),local('ArialMT'),local('Liberation Sans'),local('Arimo');font-weight:100 450;size-adjust:92.3%;ascent-override:81.3%;descent-override:27.1%;line-gap-override:0%}
@font-face{font-family:'KQ Fallback';src:local('Arial'),local('ArialMT'),local('Liberation Sans'),local('Arimo');font-weight:451 599;size-adjust:95.9%;ascent-override:78.2%;descent-override:26.1%;line-gap-override:0%}
@font-face{font-family:'KQ Fallback';src:local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('LiberationSans-Bold'),local('Arimo Bold');font-weight:600 900;size-adjust:92.4%;ascent-override:81.2%;descent-override:27.1%;line-gap-override:0%}
body>div[style*="Neue Haas Grotesk"]{font-family:'Neue Haas Grotesk Display Pro','Neue Haas Grotesk Text Pro','KQ Fallback','Helvetica Neue',Helvetica,Arial,sans-serif!important}
/* the header row keeps to one line while the web fonts load (it wrapped in the wider fallback
   face and then snapped back: layout shift of 0.2 to 1.2 at 1440) */
.kq-head>nav,.kq-hh>div{flex-wrap:nowrap!important}
.kq-head .kq-links,.kq-hh nav[aria-label="Primary"],.kq-hh .kq-hact{flex-wrap:nowrap!important;white-space:nowrap}
/* touch targets of at least 44 by 44 px for links that stand on their own (an invisible layer
   enlarges the tap area without moving the text) */
@media (max-width:760px){
:is([data-art="authlink"],p[data-art="kicker"]>a,main p>a:not([class]):only-child,main li>a:not([class]):only-child,main .kq-xl>a,main a.kq-why,main a[style*="display: inline-block"]:not([class]),.kq-cr-direct>a,.kq-ab-reach>a){position:relative}
:is([data-art="authlink"],p[data-art="kicker"]>a,main p>a:not([class]):only-child,main li>a:not([class]):only-child,main .kq-xl>a,main a.kq-why,main a[style*="display: inline-block"]:not([class]),.kq-cr-direct>a,.kq-ab-reach>a)::after{content:"";position:absolute;left:-6px;right:-6px;top:50%;height:48px;transform:translateY(-50%)}
header nav>a[href="/"]:not([aria-label]){min-height:44px!important}
main nav[aria-label="On this page"] li{margin-top:0!important}
main nav[aria-label="On this page"] li>a{display:flex;align-items:center;min-height:44px;padding:4px 0;box-sizing:border-box}
.kq-stat>p>a.kq-il{display:inline-block;padding:3px 0}
.kq-filter>input{clip:rect(0 0 0 0);clip-path:inset(50%)}
}
/* Windows contrast themes: buttons keep an outline, and the white wordmark stays visible */
@media (forced-colors:active){
.kq-btn,a[style*="background: #DCBF85"],a[style*="background: #102A4C"],form[data-kq-form] button[type="submit"],.kq-top{border:1px solid ButtonText!important}
}
@media (forced-colors:active) and (prefers-color-scheme:light){img[src="/assets/${LOGO}"]{filter:invert(1)}}
/* phones: the footer's link lists in two columns with 44 px rows (it was four and a half screens long) */
@media (max-width:600px){
footer>div{padding-top:40px!important;padding-bottom:24px!important;gap:28px!important}
footer div:has(>a[href^="tel:"]){display:grid!important;grid-template-columns:auto auto;justify-content:start;gap:4px 24px!important}
footer div:has(>a[href^="tel:"])>img{grid-column:1/-1}
footer>div>div:last-child>div{gap:0 16px!important}
footer .kq-flinks{display:block!important;columns:2;column-gap:20px}
footer .kq-flinks>div{break-inside:avoid;margin:0 0 24px;gap:0!important}
footer .kq-flinks>div>a{min-height:44px!important;padding:0!important;box-sizing:border-box;display:flex;align-items:center;line-height:1.3}
footer .kq-flinks>div>h2{margin:0 0 4px!important;min-height:44px;display:flex;align-items:center}
}
</style>`;

// ---------------------------------------------------------------- styles, home page only
// The home page is a separate export without the inner pages' motion rules or timing tokens
// (its FAQ rules already refer to the tokens, so defining them also makes its FAQ open and
// close smoothly). The rules below are the inner pages' own, unchanged.
const HOME_CSS = `<style data-kq-fx-home>
:root{--ease-out:cubic-bezier(.22,1,.36,1);--ease-expo:cubic-bezier(.16,1,.3,1);--ease-in-out:cubic-bezier(.76,0,.24,1);--ease-exit:cubic-bezier(.55,.055,.675,.19);--t-press:140ms;--t-hover:180ms;--t-ui:240ms}
.kq-mask{display:block;overflow:clip;padding-bottom:.12em;margin-bottom:-.12em}
.kq-mask>.kq-line{display:block}
[data-kq-count]{font-variant-numeric:tabular-nums}
.kq-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media screen and (prefers-reduced-motion:no-preference){
@view-transition{navigation:auto}
::view-transition-old(root){animation:kq-vt-out 200ms var(--ease-exit) both}
::view-transition-new(root){animation:kq-vt-in 380ms var(--ease-out) 60ms both}
.kq-mask>.kq-line{animation:kq-line-up 900ms var(--ease-expo) var(--d,120ms) both}
.kq-load{animation:kq-load-rise 600ms var(--ease-out) both;animation-delay:var(--d,400ms)}
.kq-js .kq-r{opacity:0;transform:translateY(24px);transition:opacity 700ms var(--ease-out),transform 900ms var(--ease-expo);transition-delay:calc(var(--i,0) * 80ms)}
.kq-js .kq-r.kq-r-item{transform:translateY(12px);transition-delay:calc(var(--i,0) * 60ms)}
.kq-js .kq-r.is-in{opacity:1;transform:none}
}
@keyframes kq-line-up{from{transform:translateY(105%)}}
@keyframes kq-load-rise{from{opacity:0;transform:translateY(12px)}}
@keyframes kq-vt-out{to{opacity:0}}
@keyframes kq-vt-in{from{opacity:0;transform:translateY(16px)}}
@media print{.kq-r{opacity:1!important;transform:none!important}}
</style>`;

// Runs at the end of the body, before first paint of anything below the hero: marks the
// blocks of each section, shows each one as it enters the screen, then removes the marks
// so the blocks keep their own hover transitions. The three results count up once.
const HOME_JS = `<script>/* home page: sections rise in on scroll; the three results count up */
(function(){var d=document,html=d.documentElement;
if(html.classList.contains('kq-js')||!window.matchMedia||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
html.classList.add('kq-js');
function count(el){var m=/^(\\D*)(\\d+(?:\\.\\d+)?)(.*)$/.exec(el.textContent.trim());if(!m)return;var full=el.textContent,t=parseFloat(m[2]),dec=(m[2].split('.')[1]||'').length,t0=0;
var said=d.createElement('span'),seen=d.createElement('span');said.className='kq-sr';said.textContent=full;seen.setAttribute('aria-hidden','true');seen.textContent=m[1]+(0).toFixed(dec)+m[3];
el.textContent='';el.appendChild(said);el.appendChild(seen);
function step(ts){if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/1400);k=1-Math.pow(1-k,3);if(k<1){seen.textContent=m[1]+(t*k).toFixed(dec)+m[3];requestAnimationFrame(step);}else el.textContent=full;}
requestAnimationFrame(step);}
function show(el){if(el.classList.contains('is-in'))return;el.classList.add('is-in');if(el.hasAttribute('data-kq-count'))count(el);
setTimeout(function(){el.classList.remove('kq-r','kq-r-item','is-in');el.style.removeProperty('--i');},1400);}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);show(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:0});
[].slice.call(d.querySelectorAll('main > section')).slice(1).forEach(function(s){var picked=[];
[].slice.call(s.querySelectorAll('h2, h3, p, ul, article, figure, details, [role=group], a')).forEach(function(el){
if(picked.some(function(p){return p.contains(el);}))return;if(!el.getClientRects().length)return;picked.push(el);});
picked.forEach(function(el,i){el.classList.add('kq-r');if(/^(ARTICLE|FIGURE|DETAILS|A|UL)$/.test(el.tagName))el.classList.add('kq-r-item');el.style.setProperty('--i',Math.min(i,3));io.observe(el);});});
setTimeout(function(){[].slice.call(d.querySelectorAll('.kq-r:not(.is-in)')).forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){io.unobserve(el);show(el);}});},2500);
})();</script>`;

// ---------------------------------------------------------------- script, every page
const JS = `/* Kwontified: shared interaction details (see scripts/site-effects.mjs) */
(function(){'use strict';
var d=document,w=window,html=d.documentElement;
var reduce=!!(w.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var skip=d.querySelector('.kq-skip'),root=skip?skip.parentNode:d.body;
function raf(fn){var t=0;return function(){if(!t)t=requestAnimationFrame(function(){t=0;fn();});};}
/* words shown to the visitor; a translated page supplies its own in window.kqT */
function T(s){return (w.kqT&&w.kqT[s])||s;}

/* forms: the button says what is happening; a field explains its own error */
(function(){
var WAIT={newsletter:T('Subscribing\\u2026'),contact:T('Sending\\u2026')},n=0;
function btn(f){return f.querySelector('button[type="submit"],button:not([type])');}
function rest(b){if(!b||!b.hasAttribute('data-kq-label'))return;b.textContent=b.getAttribute('data-kq-label');b.removeAttribute('data-kq-label');b.removeAttribute('aria-busy');}
w.addEventListener('submit',function(e){var f=e.target;if(!f||!f.matches||!f.matches('form[data-kq-form]'))return;
var k=f.getAttribute('data-kq-form'),b=btn(f);if(!b||!WAIT[k]||b.hasAttribute('data-kq-label'))return;
b.setAttribute('data-kq-label',b.textContent);b.style.minWidth=b.offsetWidth+'px';b.textContent=WAIT[k];b.setAttribute('aria-busy','true');
if('MutationObserver' in w&&!b.kqWatch){b.kqWatch=1;new MutationObserver(function(){if(!b.disabled)rest(b);}).observe(b,{attributes:true,attributeFilter:['disabled']});}
},true);
w.addEventListener('pageshow',function(e){if(!e.persisted)return;[].slice.call(d.querySelectorAll('form[data-kq-form] button[data-kq-label]')).forEach(function(b){b.disabled=false;rest(b);});});
function text(el){var v=el.validity;
if(el.type==='email'){if(v.valueMissing)return T('Enter your work email address.');if(v.typeMismatch)return T('Check the email address. It should look like name@company.com.');}
if(v.valueMissing)return MISSING[el.name]||need(el);if(v.patternMismatch&&el.title)return el.title;return el.validationMessage||T('Check this field.');}
/* a required field that is empty says what it needs (the visible words are looked up through T for translated pages);
   a field not listed here is named by its label */
function need(el){var l=el.labels&&el.labels[0],t=(l?l.textContent:el.getAttribute('aria-label')||el.name||'').trim();if(t.slice(-1)==='*')t=t.slice(0,-1).trim();return T('Fill in “{f}”.').replace('{f}',t);}
var MISSING={first_name:T('Enter your first name.'),last_name:T('Enter your last name.'),company:T('Enter your company or brand.'),website:T('Enter your brand website, for example brand.com.'),notes:T('Tell us what you want to achieve.'),password:T('Enter your password.')};
function slot(el){var id=el.id||(el.id='kq-f'+(n++)),m=d.getElementById(id+'-err');if(m)return m;
m=d.createElement('p');m.id=id+'-err';m.className='kq-ferr';m.setAttribute('aria-live','polite');
var f=el.form,nl=f&&f.getAttribute('data-kq-form')==='newsletter';
if(nl){var old=f.parentNode.querySelector('[data-kq-nl-error]');if(old)old.remove();f.insertAdjacentElement('afterend',m);}else el.insertAdjacentElement('afterend',m);
var by=el.getAttribute('aria-describedby');el.setAttribute('aria-describedby',(by?by+' ':'')+m.id);return m;}
function mark(el){slot(el).textContent=text(el);el.setAttribute('aria-invalid','true');}
function clear(el){if(!el.hasAttribute('aria-invalid'))return;el.removeAttribute('aria-invalid');var m=el.id&&d.getElementById(el.id+'-err');if(m)m.textContent='';}
function ours(el){return el&&el.form&&el.form.hasAttribute('data-kq-form')&&el.willValidate;}
d.addEventListener('invalid',function(e){var el=e.target;if(!ours(el))return;e.preventDefault();mark(el);
var first=el.form.querySelector(':invalid');if(first===el)el.focus();},true);
d.addEventListener('blur',function(e){var el=e.target;if(!ours(el)||!('value' in el))return;if(el.value&&!el.validity.valid)mark(el);else if(el.validity.valid)clear(el);},true);
d.addEventListener('input',function(e){var el=e.target;if(ours(el)&&el.validity.valid)clear(el);},true);
})();

/* back to top: on long pages, after two screens of scrolling */
(function(){if(d.querySelector('.kq-top'))return;
var b=d.createElement('button');b.type='button';b.className='kq-top';b.setAttribute('aria-label',T('Back to top'));
b.innerHTML='<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 19V6M6 11l6-6 6 6"/></svg>';
root.appendChild(b);
var foot=d.querySelector('footer'),box=foot&&foot.firstElementChild,last=box&&box.lastElementChild,on=false;
/* wide screens: the button sits in the page margin, so it stays. Narrower screens: it would sit over
   the end of the lines being read, so it shows only once the visitor reaches the end of the page */
var wide=w.matchMedia('(min-width:1200px)');
var upd=raf(function(){var y=w.scrollY,top=last?last.getBoundingClientRect().top:1e9;
var show=html.scrollHeight>w.innerHeight*3&&y>w.innerHeight*2&&(wide.matches||top<w.innerHeight);
if(show!==on){on=show;b.classList.toggle('is-on',on);}
if(on)b.style.setProperty('--lift',Math.max(0,w.innerHeight-top+8)+'px');});
w.addEventListener('scroll',upd,{passive:true});w.addEventListener('resize',upd,{passive:true});upd();
b.addEventListener('click',function(e){w.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
if(e.detail===0){var l=d.querySelector('header a[href="/"]');if(l)l.focus({preventScroll:true});}});
})();

/* articles: reading progress on the bottom edge of the header */
(function(){var art=d.querySelector('article[data-art="body"]'),head=d.querySelector('header.kq-head');if(!art||!head||head.querySelector('.kq-prog'))return;
var bar=d.createElement('div');bar.className='kq-prog';bar.setAttribute('aria-hidden','true');head.appendChild(bar);
var upd=raf(function(){var end=art.getBoundingClientRect().bottom+w.scrollY-w.innerHeight;
var p=end>0?w.scrollY/end:1;bar.style.transform='scaleX('+Math.max(0,Math.min(1,p)).toFixed(4)+')';});
w.addEventListener('scroll',upd,{passive:true});w.addEventListener('resize',upd,{passive:true});upd();
})();

/* lists: a short fade when a filter, search or pager changes what is shown */
(function(){if(reduce||!('MutationObserver' in w))return;var last=0;
['pointerdown','keydown','input','change'].forEach(function(t){d.addEventListener(t,function(e){if(e.isTrusted)last=Date.now();},true);});
function replay(el){el.classList.remove('kq-swap');void el.offsetWidth;el.classList.add('kq-swap');}
d.addEventListener('animationend',function(e){if(e.animationName==='kq-swap')e.target.classList.remove('kq-swap');});
function watch(el,opts,targets){var q=0;new MutationObserver(function(rs){if(q||Date.now()-last>1500)return;
/* a class change counts only when it filters a card in or out (not when a card is revealed on scroll) */
if(!rs.some(function(r){return r.attributeName!=='class'||/\\bis-out\\b/.test(r.oldValue||'')!==r.target.classList.contains('is-out');}))return;
q=requestAnimationFrame(function(){q=0;(targets||[el]).forEach(replay);});}).observe(el,opts);}
var A={subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['hidden','data-pg-off','class']};
[].slice.call(d.querySelectorAll('[data-pg-size]')).forEach(function(g){watch(g,A);});
var fig=d.querySelector('figure[data-gc]');if(fig)watch(fig.parentNode,A);
var tile=d.querySelector('main .kq-tile');
if(tile&&d.querySelector('.kq-chips'))d.addEventListener('change',function(e){if(e.target&&/^cf-/.test(e.target.id||''))replay(tile.parentNode);});
var fin=d.getElementById('finder'),live=fin&&fin.querySelector('p[aria-live]');
if(live)watch(live.parentNode,{subtree:true,childList:true,characterData:true},[].slice.call(live.parentNode.querySelectorAll('p')));
})();

/* page changes: browsers without speculation rules (Safari, Firefox) fetch a page when its link is hovered or touched */
(function(){if(w.HTMLScriptElement&&HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules'))return;
var c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType||'')))return;
var done={},t=0;
function go(a){var u;try{u=new URL(a.href);}catch(_){return;}
if(u.origin!==location.origin||u.pathname===location.pathname||/^\\/(api\\/|subscribe$)/.test(u.pathname)||a.target==='_blank'||a.hasAttribute('download')||done[u.pathname])return;
done[u.pathname]=1;var l=d.createElement('link'),href=u.pathname+u.search;
/* Firefox: a prefetch link. Safari has none, so a plain request warms the connection and the cache */
if(l.relList&&l.relList.supports&&l.relList.supports('prefetch')){l.rel='prefetch';l.href=href;d.head.appendChild(l);}
else if(w.fetch)w.fetch(href,{credentials:'same-origin'}).catch(function(){});}
function link(e){return e.target&&e.target.closest&&e.target.closest('a[href]');}
d.addEventListener('mouseover',function(e){var a=link(e);clearTimeout(t);if(a)t=setTimeout(function(){go(a);},80);},{passive:true});
d.addEventListener('touchstart',function(e){var a=link(e);if(a)go(a);},{passive:true});
})();
})();
`;

// Chrome and Edge: fetch a same-site page when the pointer rests on its link (or on touch),
// so the click shows it at once. Fetch only: the page's scripts, video and tags do not run
// until the visitor goes there, so analytics and forms behave exactly as before.
const SPECULATION = `<script type="speculationrules">${JSON.stringify({
  prefetch: [{
    where: { and: [
      { href_matches: "/*" },
      { not: { href_matches: "/api/*" } },
      { not: { href_matches: "/subscribe" } },
      { not: { selector_matches: "[target=_blank],[download]" } },
    ] },
    eagerness: "moderate",
  }],
})}</script>`;

const SKIP = `<a class="kq-skip" href="#main">Skip to main content</a>`;

// ---------------------------------------------------------------- write the shared script
const jsName = `kq-fx-${crypto.createHash("sha256").update(JS).digest("hex").slice(0, 12)}.js`;
for (const f of fs.readdirSync(ASSETS)) if (/^kq-fx-[0-9a-f]{12}\.js$/.test(f)) fs.unlinkSync(path.join(ASSETS, f));
fs.writeFileSync(path.join(ASSETS, jsName), JS);
const SCRIPT = `<script defer src="/assets/${jsName}"></script>`;

// ---------------------------------------------------------------- home page markup
function home(html) {
  const a = html.indexOf('<section id="top"'), b = html.indexOf("</section>", a);
  if (a < 0 || b < 0) fail("home: hero section not found");
  let hero = html.slice(a, b);
  // headline: each line rises from behind its own edge
  hero = one(hero, /(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/, (_, open, inner, close) => {
    const lines = inner.split(/<br\s*\/?>/).map((s) => s.trim()).filter(Boolean);
    if (lines.length < 1 || lines.some((l) => /<(?!\/?(em|strong|span)\b)/.test(l))) fail("home: headline has markup this step does not expect");
    return open + lines.map((l, i) => `<span class="kq-mask"><span class="kq-line"${i ? ` style="--d: ${120 + i * 90}ms"` : ""}>${l}</span></span>`).join("") + close;
  }, "home headline");
  // the line above the headline, the paragraph and the buttons follow it in
  hero = one(hero, /<p style="margin: 0; font-size: 15px; font-weight: 500; color: #DCBF85">/, (m) => m.replace("<p ", '<p class="kq-load" ').replace('style="', 'style="--d: 80ms; '), "home hero label");
  hero = one(hero, /(<\/h1>\s*)<p style="/, (_, h) => `${h}<p class="kq-load" style="--d: 460ms; `, "home hero paragraph");
  hero = one(hero, /(<\/p>\s*)<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px 32px">/, (m, p) => `${p}<div class="kq-load" style="--d: 560ms; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 32px">`, "home hero buttons");
  html = html.slice(0, a) + hero + html.slice(b);
  // the three results count up when they come into view
  const r = html.indexOf('<section id="results"'), re = html.indexOf("</section>", r);
  if (r < 0) fail("home: results section not found");
  let n = 0;
  const results = html.slice(r, re).replace(/<p style="margin: 0; font-size: clamp\(60px, 6\.4vw, 92px\);[^"]*">(?=[^<]*\d)/g, (m) => { n++; return m.replace("<p ", "<p data-kq-count "); });
  if (n !== 3) fail(`home: expected three headline results, found ${n}`);
  html = html.slice(0, r) + results + html.slice(re);
  html = html.replace("</head>", () => HOME_CSS + "</head>");
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => HOME_JS + "</body>");
  return html;
}

// ---------------------------------------------------------------- headings: no lone last word
// text-wrap:balance evens out the lines but still leaves "operators." alone under "Built by
// marketplace". The last two words of each h1-h3 are kept together: with a no-break space when the
// pair is short enough for a 320px phone at that heading's size, otherwise (when both words are in
// the same run of text) in a span that stays on one line from 700px wide. Pages that have a
// translation keep their headings as they are, so the translation memory still matches them; a
// no-break space is fine there (the memory compares text with runs of white space made one).
const PAIR = { 1: 13, 2: 16, 3: 20 };
const translated = new Set();
for (const lang of fs.existsSync(path.join(ROOT, "site-i18n")) ? fs.readdirSync(path.join(ROOT, "site-i18n")) : []) {
  const dir = path.join(ROOT, "site-i18n", lang, "pages");
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) translated.add(f.replace(/\.json$/, ".html"));
}
let kept = 0, spanned = 0;
function headings(html, f) {
  return html.replace(/<h([123])\b([^>]*)>([\s\S]*?)<\/h\1>/g, (all, lv, attrs, inner) => {
    if (/<(svg|br)\b/i.test(inner.replace(/<svg[\s\S]*?<\/svg>\s*(?=(<\/[a-z]+>\s*)*$)/i, ""))) return all;
    // the text runs, outside tags and outside any svg
    const parts = inner.split(/(<svg[\s\S]*?<\/svg>|<[^>]+>)/);
    const words = [];
    parts.forEach((t, i) => { if (i % 2) return; const re = /\S+/g; let m; while ((m = re.exec(t))) words.push({ i, at: m.index, w: m[0] }); });
    if (words.length < 3) return all;
    const a = words[words.length - 2], b = words[words.length - 1];
    if (/&nbsp;|\u00a0/.test(inner)) return all;
    const pair = a.w.length + 1 + b.w.length;
    // the white space after word a: at the end of a's run, or (when a ends its run) the start of b's run
    let wi = a.i, wat = a.at + a.w.length;
    if (a.i !== b.i && !/^\s/.test(parts[a.i].slice(wat))) { wi = b.i; wat = 0; if (!/^\s/.test(parts[b.i])) return all; }
    if (pair <= PAIR[lv]) {
      const t = parts[wi], m = /^\s+/.exec(t.slice(wat));
      if (!m) return all;
      parts[wi] = t.slice(0, wat) + "\u00a0" + t.slice(wat + m[0].length);
      kept++;
    } else if (a.i === b.i && pair <= 26 && !translated.has(f)) {
      const t = parts[a.i];
      parts[a.i] = t.slice(0, a.at) + `<span class="kq-nw">${t.slice(a.at, b.at + b.w.length)}</span>` + t.slice(b.at + b.w.length);
      spanned++;
    } else return all;
    return `<h${lv}${attrs}>${parts.join("")}</h${lv}>`;
  });
}

// ---------------------------------------------------------------- every page
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
if (files.length < 1000) fail(`expected the whole site in public/_kq, found ${files.length} pages`);
let articles = 0, read = 0;
// pages read as running text: legal pages and job descriptions (articles are marked data-art="body")
const READ = /^(privacy|terms|accessibility|about--careers--[a-z0-9-]+)\.html$/;
for (const f of files) {
  const file = path.join(DIR, f);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("data-kq-fx")) fail(`${f}: already applied; run the whole build`);
  if (f === "index.html") html = home(html);
  html = headings(html, f);
  // skip link: first thing in the page, inside the wrapper that sets the font
  html = one(html, /(<body[^>]*>\s*<div\b[^>]*>)/, (m) => m + SKIP, `${f}: page wrapper`);
  html = one(html, /<main(?=[\s>])([^>]*)>/, (m, attrs) => {
    if (/\bid=/.test(attrs)) fail(`${f}: <main> already has an id`);
    return `<main id="main" tabindex="-1"${READ.test(f) ? " data-kq-read" : ""}${attrs}>`;
  }, `${f}: <main>`);
  if (READ.test(f)) read++;
  // the contact page's one job is the review request: no newsletter sign-up in its footer
  if (f === "contact.html") {
    if (!/<form data-kq-form="newsletter"/.test(html)) fail("contact.html: the footer sign-up changed; update the rule that hides it");
    html = html.replace("</head>", () => `<style data-kq-fx-contact>footer>div>div:has(>div>form[data-kq-form="newsletter"]){display:none!important}</style></head>`);
  }
  if (html.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
  html = html.replace("</head>", () => CSS + SPECULATION + "</head>");
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => SCRIPT + "</body>");
  if (/<article\b[^>]*data-art="body"/.test(html)) articles++;
  fs.writeFileSync(file, html);
}
if (read !== 8) fail(`expected the reading measure on 3 legal pages and 5 job pages, marked ${read}`);
if (articles < 900) fail(`expected the archive's articles to carry data-art="body" for the reading progress line, found ${articles}`);
console.log(`site-effects: ${files.length} pages (skip link, hover and tap feedback, form feedback, back to top, faster page changes); reading progress on ${articles} articles; home page motion; reading measure on ${read} legal and job pages; last two words of ${kept + spanned} headings kept together (${spanned} from 700px); script /assets/${jsName} (${(JS.length / 1024).toFixed(1)} KB)`);
