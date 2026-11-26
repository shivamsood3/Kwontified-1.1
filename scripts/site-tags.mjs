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

let pages = 0;
for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const full = path.join(DIR, file);
  let html = fs.readFileSync(full, "utf8");
  if (html.includes("window.kqTagConsent=")) continue; // already done
  for (const [find, put] of EDITS) {
    const n = html.split(find).length - 1;
    if (n !== 1) throw new Error(`site-tags: expected "${find.slice(0, 40)}" once in ${file}, found ${n}`);
    html = html.replace(find, () => put);
  }
  fs.writeFileSync(full, html);
  pages++;
}
console.log(`site-tags: Google Tag Manager ${GTM_ID} and Google Ads tag ${ADS_ID} added to ${pages} pages (both load after cookie consent)`);

// Loading before consent: Google's own snippet loads the container for every
// visitor straight away. To do that instead, call
//   gtag('consent','default',{...all 'denied'...}); kqStartTags();
// and add the gtm.js script in the page head, then keep kqTagConsent for updates.
// The cookie banner and the Privacy Policy currently say nothing non-essential
// runs until the visitor chooses, so change those first.
