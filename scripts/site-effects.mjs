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
//   6. A back-to-top button on long pages (on narrow screens it appears when the visitor
//      scrolls back up or reaches the end, so it never covers text being read).
//   7. A reading progress line on articles, news items and press releases.
//   8. Phones: "Request a review" stays in the header while scrolling (the wordmark
//      shortens to the K to make room), as it already does on tablets and desktop.
//   9. Tap feedback in the brand colours.
//  10. A short fade when a filter, search or pager changes a list.
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

/* forms: the button says what is happening; a field explains its own error */
(function(){
var WAIT={newsletter:'Subscribing\\u2026',contact:'Sending\\u2026'},n=0;
function btn(f){return f.querySelector('button[type="submit"],button:not([type])');}
function rest(b){if(!b||!b.hasAttribute('data-kq-label'))return;b.textContent=b.getAttribute('data-kq-label');b.removeAttribute('data-kq-label');b.removeAttribute('aria-busy');}
w.addEventListener('submit',function(e){var f=e.target;if(!f||!f.matches||!f.matches('form[data-kq-form]'))return;
var k=f.getAttribute('data-kq-form'),b=btn(f);if(!b||!WAIT[k]||b.hasAttribute('data-kq-label'))return;
b.setAttribute('data-kq-label',b.textContent);b.style.minWidth=b.offsetWidth+'px';b.textContent=WAIT[k];b.setAttribute('aria-busy','true');
if('MutationObserver' in w&&!b.kqWatch){b.kqWatch=1;new MutationObserver(function(){if(!b.disabled)rest(b);}).observe(b,{attributes:true,attributeFilter:['disabled']});}
},true);
w.addEventListener('pageshow',function(e){if(!e.persisted)return;[].slice.call(d.querySelectorAll('form[data-kq-form] button[data-kq-label]')).forEach(function(b){b.disabled=false;rest(b);});});
function text(el){var v=el.validity;
if(el.type==='email'){if(v.valueMissing)return 'Enter your work email address.';if(v.typeMismatch)return 'Check the email address. It should look like name@company.com.';}
if(v.valueMissing)return 'This field is required.';return el.validationMessage||'Check this field.';}
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
var b=d.createElement('button');b.type='button';b.className='kq-top';b.setAttribute('aria-label','Back to top');
b.innerHTML='<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M12 19V6M6 11l6-6 6 6"/></svg>';
root.appendChild(b);
var foot=d.querySelector('footer'),box=foot&&foot.firstElementChild,last=box&&box.lastElementChild,on=false;
/* wide screens: the button sits in the page margin, so it stays. Narrower screens: it would cover the
   end of a line of text, so it shows when the visitor scrolls back up or reaches the end of the page */
var wide=w.matchMedia('(min-width:1200px)'),y0=w.scrollY,up=false;
var upd=raf(function(){var y=w.scrollY,top=last?last.getBoundingClientRect().top:1e9;
if(Math.abs(y-y0)>12){up=y<y0;y0=y;}
var show=html.scrollHeight>w.innerHeight*3&&y>w.innerHeight*2&&(wide.matches||up||top<w.innerHeight);
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

// ---------------------------------------------------------------- every page
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
if (files.length < 1000) fail(`expected the whole site in public/_kq, found ${files.length} pages`);
let articles = 0;
for (const f of files) {
  const file = path.join(DIR, f);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("data-kq-fx")) fail(`${f}: already applied; run the whole build`);
  if (f === "index.html") html = home(html);
  // skip link: first thing in the page, inside the wrapper that sets the font
  html = one(html, /(<body[^>]*>\s*<div\b[^>]*>)/, (m) => m + SKIP, `${f}: page wrapper`);
  html = one(html, /<main(?=[\s>])([^>]*)>/, (m, attrs) => {
    if (/\bid=/.test(attrs)) fail(`${f}: <main> already has an id`);
    return `<main id="main" tabindex="-1"${attrs}>`;
  }, `${f}: <main>`);
  if (html.split("</head>").length !== 2) fail(`${f}: expected one </head>`);
  html = html.replace("</head>", () => CSS + SPECULATION + "</head>");
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => SCRIPT + "</body>");
  if (/<article\b[^>]*data-art="body"/.test(html)) articles++;
  fs.writeFileSync(file, html);
}
if (articles < 900) fail(`expected the archive's articles to carry data-art="body" for the reading progress line, found ${articles}`);
console.log(`site-effects: ${files.length} pages (skip link, hover and tap feedback, form feedback, back to top, faster page changes); reading progress on ${articles} articles; home page motion; script /assets/${jsName} (${(JS.length / 1024).toFixed(1)} KB)`);
