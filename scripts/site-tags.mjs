// Adds the Google Tag Manager container and the Google Ads tag to every built page.
//
// Runs after build-site.mjs, site-fixes.mjs and site-content.mjs, on the files in
// public/_kq. The container is wired into the cookie banner the pages already
// have, the same way Google Analytics is:
//
//   - nothing loads until the visitor allows analytics or advertising cookies
//   - the visitor's choice is passed to the container as Google consent signals
//     before it loads, and again whenever the choice changes ("Cookie
//     preferences" in the footer), so a tag only runs for a category the
//     visitor allowed
//   - gtag('js', new Date()) is sent once, shared with the Google Analytics tag
//   - the Google Ads tag counts as advertising: it goes in the pages' own
//     kqLoadAds hook, so it only runs after the visitor allows advertising
//     cookies, and never when the browser sends a Global Privacy Control signal
//
// The Google Ads tag is installed the way Google supports for an AW- ID:
// googletagmanager.com/gtag/js plus gtag('config', ...). Google's help page
// "Set up your Google tag installation correctly for gtag.js" (answer 17231523)
// says loading a G-, AW- or DC- ID through the gtm.js path is unsupported.
//
// To change the container, edit GTM_ID; to change the Google Ads tag, edit ADS_ID. To load the container for every visitor
// before they choose, see the note at the bottom of this file.
import fs from "node:fs";
import path from "node:path";

const GTM_ID = "GTM-NCKGHDXW";
const ADS_ID = "AW-857530176";
const DIR = path.join(process.cwd(), "public/_kq");

const TAG_CODE =
  "/* Google Tag Manager (" + GTM_ID + "): loads once the visitor allows analytics or advertising cookies; " +
  "their choice is passed to it as Google consent signals */" +
  "window.kqStartTags=function(){if(window.kqJs)return;window.kqJs=1;gtag('js',new Date());};" +
  "window.kqTagConsent=function(c){c=c||{};var g=function(v){return v?'granted':'denied';}," +
  "s={analytics_storage:g(c.analytics),ad_storage:g(c.advertising),ad_user_data:g(c.advertising)," +
  "ad_personalization:g(c.advertising),functionality_storage:g(c.functional)," +
  "personalization_storage:g(c.functional),security_storage:'granted'};" +
  "if(window.kqGTM){gtag('consent','update',s);return;}" +
  "if(!c.analytics&&!c.advertising)return;" +
  "window.kqGTM=1;gtag('consent','default',s);window.kqStartTags();" +
  "var e=document.createElement('script');e.async=true;" +
  "e.src='https://www.googletagmanager.com/gtm.js?id=" + GTM_ID + "';document.head.appendChild(e);};";

// [what to find, what to put in its place] - each must be found exactly once per page
const EDITS = [
  // 1. define the container loader just before the Google Analytics loader
  ["window.kqLoadAnalytics=function(){", TAG_CODE + "window.kqLoadAnalytics=function(){"],
  // 2. Google Analytics shares the single gtag('js') call
  ["gtag('js',new Date());gtag('config',", "window.kqStartTags();gtag('config',"],
  // 3. the cookie banner tells the container every time the visitor's choice is applied
  ["function apply(c){window.kqConsent=c;", "function apply(c){window.kqConsent=c;if(window.kqTagConsent)window.kqTagConsent(c);"],
  // 4. Google Ads tag, inside the advertising hook. One copy of gtag.js serves both
  //    Google tags, so it is only fetched here if Google Analytics has not fetched it.
  [
    "window.kqLoadAds=function(){if(window.kqAds)return;window.kqAds=1;};",
    "window.kqLoadAds=function(){if(window.kqAds)return;window.kqAds=1;window.kqStartTags();" +
      "if(!window.kqGA){var s=document.createElement('script');s.async=true;" +
      "s.src='https://www.googletagmanager.com/gtag/js?id=" + ADS_ID + "';document.head.appendChild(s);}" +
      "gtag('config','" + ADS_ID + "');};",
  ],
];

// ---------------------------------------------------------------- the cookie notice
// The notice itself comes from the export (an <aside class="kq-ck"> and its script in every
// page). Changes from the QA review of 2026-11-27:
//   1. It is the first thing after the skip link, so a keyboard user reaches it within three
//      Tabs instead of after 90 or more stops hidden behind it (WCAG 2.4.11). While it is open,
//      a focused element that would sit under it is scrolled clear, and the page can scroll far
//      enough to uncover the footer.
//   2. Shorter wording and a compact layout on phones (the three buttons on one row), so it
//      covers about a third of a phone screen instead of half to two thirds. The details of each
//      cookie type stay one tap away under "Choose cookies".
//   3. Opened again from "Cookie preferences" in the footer, it has a Close button and closes
//      on Escape, keeping the visitor's saved choice; focus goes back to the footer button.
//   4. A saved choice lasts 12 months, and only for the version of the notice it was given to.
//      When the tags in the container or the Privacy Policy change in a way visitors should
//      decide on again, add 1 to CONSENT_VERSION: everyone is asked again on their next visit.
//      A choice saved before versioning (no "v") counts as version 1.
//   5. Withdrawing analytics or advertising consent also deletes the first-party cookies those
//      tags set (Google Analytics _ga*, Google Ads _gcl*, Meta _fbp/_fbc, Microsoft _uet*,
//      LinkedIn li_fat_id).
const CONSENT_VERSION = 1;
const CONSENT_MONTHS = 12;
const CK_TEXT_OLD = "We use necessary cookies to run the site. With your permission, we also use analytics cookies to see how the site is used and advertising cookies to measure and show our ads. Read our ";
const CK_TEXT = "We use necessary cookies to run the site. With your permission, we also use cookies to measure visits and to measure and show our ads. Read our ";
const CLOSE_ICON = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"><path d="M3 3l10 10M13 3 3 13"/></svg>`;
const CK_CSS = `<style data-kq-ck>
.kq-ck{scroll-margin:0}
.kq-ck-x{position:absolute;top:8px;right:8px;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:none;color:#102A4C;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background-color 180ms ease}
.kq-ck-x:hover{background:#E1E9F1}
.kq-ck-x:focus-visible{outline:3px solid #00618D;outline-offset:0}
.kq-ck:has(.kq-ck-x:not([hidden])) .kq-ck-t{padding-right:40px}
/* while the notice is open the footer gains room below it, so nothing ends up permanently under it */
html.kq-ck-on footer{padding-bottom:var(--kq-ck-h,0px)}
@media (max-width:600px){
.kq-ck{left:8px;bottom:8px;width:calc(100vw - 16px);max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);padding:14px 14px 12px;font-size:14px;line-height:1.4;border-radius:12px}
.kq-ck .kq-ck-t{font-size:17px;line-height:1.25}
.kq-ck p{margin-top:4px}
.kq-ck-x{top:2px;right:2px}
.kq-ck-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}
.kq-ck-actions button{padding:4px 6px;font-size:14px;line-height:1.15;border-radius:10px}
.kq-ck-opts label{padding:6px 0}
}
@media (forced-colors:active){.kq-ck{border:1px solid CanvasText}.kq-ck-actions button{border:1px solid ButtonText}}
</style>`;
const DAY = 864e5;
const CK_EDITS = [
  // version and expiry
  ["var KEY='kq-consent-v1',gpc=navigator.globalPrivacyControl===true,opener=null;",
    `var KEY='kq-consent-v1',VER=${CONSENT_VERSION},MAXAGE=${Math.round(CONSENT_MONTHS * 30.44)}*${DAY},gpc=navigator.globalPrivacyControl===true,opener=null,html=d.documentElement,x=box.querySelector('[data-ck=close]');`],
  ["function read(){try{var c=JSON.parse(localStorage.getItem(KEY)||'null');return c&&typeof c==='object'?c:null;}catch(e){return null;}}",
    "function read(){try{var c=JSON.parse(localStorage.getItem(KEY)||'null');if(!c||typeof c!=='object'||(c.v==null?1:c.v)!==VER)return null;" +
      "if(c.t){var t=Date.parse(c.t);if(!(t>0)||Date.now()-t>MAXAGE)return null;}return c;}catch(e){return null;}}" +
      // withdrawn consent: remove the first-party cookies the tags set, on this host and its parent domains
      "function wipe(c){var re=[];if(!c.analytics)re.push(/^_ga/);if(!c.advertising)re.push(/^(_gcl|_fbp|_fbc|_uet|li_fat_id)/);if(!re.length)return;" +
      "var host=location.hostname.split('.'),doms=[''];for(var i=0;i<host.length-1;i++)doms.push(';domain=.'+host.slice(i).join('.'));" +
      "d.cookie.split(';').forEach(function(s){var n=s.split('=')[0].trim();if(!n||!re.some(function(r){return r.test(n);}))return;" +
      "doms.forEach(function(dm){d.cookie=n+'=;Max-Age=0;path=/'+dm;});});}"],
  ["if(c.advertising&&window.kqLoadAds)window.kqLoadAds();}", "if(c.advertising&&window.kqLoadAds)window.kqLoadAds();wipe(c);}"],
  ["c.t=new Date().toISOString();", "c.v=VER;c.t=new Date().toISOString();"],
  // closing from Save, Accept or Reject also hides Close
  ["apply(c);box.hidden=true;if(opener){opener.focus();opener=null;}}", "apply(c);close();}" +
    "function close(){box.hidden=true;if(x)x.hidden=true;if(opener){opener.focus();opener=null;}}"],
  ["else if(k==='save')", "else if(k==='close')close();else if(k==='save')"],
  // reopened from the footer: Close and Escape keep the saved choice
  ["b.addEventListener('click',function(){opener=b;show(true);",
    "b.addEventListener('click',function(){opener=b;show(true);if(x)x.hidden=!read();"],
  ["var c=read();if(c){if(gpc)c.advertising=false;apply(c);}else show(false);",
    "d.addEventListener('keydown',function(e){if(e.key!=='Escape'||box.hidden||!x||x.hidden)return;var a=d.activeElement;if(a&&a!==d.body&&!box.contains(a))return;e.preventDefault();close();});" +
      // while open: room to scroll past it, and a focused element is scrolled out from under it
      "function room(){var on=!box.hidden,h=on?Math.ceil(box.getBoundingClientRect().height)+16:0;html.classList.toggle('kq-ck-on',on);" +
      "html.style.setProperty('--kq-ck-h',h+'px');html.style.scrollPaddingBottom=on?h+'px':'';}" +
      "if('MutationObserver' in window)new MutationObserver(room).observe(box,{attributes:true,attributeFilter:['hidden'],subtree:true});" +
      "if('ResizeObserver' in window)new ResizeObserver(room).observe(box);addEventListener('resize',room);" +
      "d.addEventListener('focusin',function(e){var el=e.target;if(box.hidden||!el||!el.getBoundingClientRect||box.contains(el))return;" +
      "var r=el.getBoundingClientRect(),t=box.getBoundingClientRect();" +
      "if(r.bottom>t.top-8&&r.top<t.bottom&&r.right>t.left&&r.left<t.right)window.scrollBy({top:r.bottom-t.top+16,behavior:'instant'});});" +
      "var c=read();if(c){if(gpc)c.advertising=false;apply(c);}else show(false);room();"],
];

let pages = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const full = path.join(DIR, file);
  let html = fs.readFileSync(full, "utf8");
  if (html.includes("window.kqTagConsent=")) continue; // already done
  for (const [find, put] of EDITS.concat(CK_EDITS)) {
    const n = html.split(find).length - 1;
    if (n !== 1) throw new Error(`site-tags: expected "${find.slice(0, 40)}" once in ${file}, found ${n}`);
    html = html.replace(find, () => put);
  }
  // the notice: shorter wording, a Close button, and first in the page after the skip link
  const aside = html.match(/<aside class="kq-ck"[\s\S]*?<\/aside>\n?/g) || [];
  if (aside.length !== 1) throw new Error(`site-tags: expected one cookie notice in ${file}, found ${aside.length}`);
  let ck = aside[0];
  for (const [find, put] of [[CK_TEXT_OLD, CK_TEXT], ["<h2>Cookies on this site</h2>", `<h2>Cookies on this site</h2><button type="button" class="kq-ck-x" data-ck="close" aria-label="Close" hidden="hidden">${CLOSE_ICON}</button>`]]) {
    if (ck.split(find).length !== 2) throw new Error(`site-tags: ${file}: the cookie notice changed ("${find.slice(0, 40)}")`);
    ck = ck.replace(find, () => put);
  }
  // ...nor as its first heading: the title becomes a paragraph with role="heading", so assistive tech still
  // hears a heading while the page's own H1 is the first heading in its source (QA seo-r2-02, round 3)
  if (ck.split("<h2>Cookies on this site</h2>").length !== 2) throw new Error(`site-tags: ${file}: cookie notice title changed`);
  ck = ck.replace("<h2>Cookies on this site</h2>", '<p class="kq-ck-t" role="heading" aria-level="2">Cookies on this site</p>');
  html = html.split(".kq-ck h2").join(".kq-ck .kq-ck-t").split("box.querySelector('h2')").join("box.querySelector('.kq-ck-t')");
  // snippet generators and text extractors must not read the notice as the page's opening text (QA seo-r2-02)
  ck = ck.replace('<aside class="kq-ck"', '<aside class="kq-ck" data-nosnippet');
  html = html.replace(aside[0], "");
  const root = /<body[^>]*>\s*<div\b[^>]*>/;
  if (!root.test(html)) throw new Error(`site-tags: ${file}: no page wrapper to put the cookie notice in`);
  html = html.replace(root, (m) => m + ck);
  if (html.split("</head>").length !== 2) throw new Error(`site-tags: ${file}: expected one </head>`);
  html = html.replace("</head>", () => CK_CSS + "</head>");
  fs.writeFileSync(full, html);
  pages++;
}
console.log(`site-tags: Google Tag Manager ${GTM_ID} and Google Ads tag ${ADS_ID} added to ${pages} pages (both load after cookie consent); cookie notice first after the skip link, ${CONSENT_MONTHS}-month consent, version ${CONSENT_VERSION}`);

// Loading before consent: Google's own snippet loads the container for every
// visitor straight away. To do that instead, call
//   gtag('consent','default',{...all 'denied'...}); kqStartTags();
// and add the gtm.js script in the page head, then keep kqTagConsent for updates.
// The cookie banner and the Privacy Policy currently say nothing non-essential
// runs until the visitor chooses, so change those first.
