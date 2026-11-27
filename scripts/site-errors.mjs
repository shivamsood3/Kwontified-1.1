// The two error pages: 404 (page not found) and 403 (access restricted).
//
// build-site.mjs makes a 404 shell from the Thank-you export (header, footer, styles and
// scripts). This step replaces what sits between <main> and </main> with pages designed for
// the job, and writes a second copy as the 403 page. Runs after site-archive.mjs (the three
// newest articles come from the finished Perspectives index) and before site-seo.mjs and
// site-images.mjs (so the photographs get their smaller versions like every other).
//
// What each page is for:
//   404  Someone followed an old link or mistyped an address. Say so plainly, put search first,
//        offer the pages whose address or title is closest to the one they asked for, then six
//        places to start and the three newest articles. Served by app/not-found.tsx with
//        status 404.
//   403  Someone reached a page they may not open (a client-only page, or a request the host
//        refused). Say so, offer the client sign-in, say who to ask (support@, as on the
//        sign-in page). Served at /403 by
//        app/403/route.ts with status 403.
//
// Each page has its own picture, made for it on 2026-11-27 in the site's still-life style
// (AI-generated with Higgsfield, GPT Image 2.6; prompts and job IDs are in HANDOVER.md):
// three plinths with the middle one empty (404) and a closed navy door with its key hanging
// beside it (403). The files are in site-src/assets; their names end in the first eight
// characters of their hash, so replace a picture by adding a new file and changing PHOTO below.
import fs from "node:fs";
import path from "node:path";
import { latestCards } from "./latest-cards.mjs";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const ASSETS = path.join(ROOT, "public/assets");
const fail = (m) => { throw new Error("site-errors: " + m); };
const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8")).map((r) => r.route));

const shell = fs.readFileSync(path.join(DIR, "404.html"), "utf8");
const index = fs.readFileSync(path.join(DIR, "perspectives.html"), "utf8");
if ((shell.match(/<main\b/g) || []).length !== 1 || !shell.includes("</main>")) fail("the 404 shell has no single <main>");

const PHOTO = {
  404: { file: "error-404-e1d78729.jpg", alt: "Three pale stone plinths against a sunlit steel blue plaster wall: the two outer ones each hold a parcel tied with string, and the middle one is empty" },
  403: { file: "error-403-0ee5006a.jpg", alt: "A closed navy door in a sunlit pale blue plaster wall, with a brass key hanging on a hook beside it and a closed carton on an oak bench" },
};
for (const p of Object.values(PHOTO)) if (!fs.existsSync(path.join(ASSETS, p.file))) fail(`photograph ${p.file} is not in public/assets`);

// six places to start, the same on both pages
const START = [
  ["/capabilities", "Capabilities", "Retail media, creative, operations, analytics, agentic commerce and revenue recovery"],
  ["/channels", "Channels", "Amazon, Walmart, Target Plus and the other marketplaces we run"],
  ["/work", "Work", "Twenty-five case studies with figures"],
  ["/perspectives", "Perspectives", "Articles, news and press releases, each dated so you can judge how current it is"],
  ["/about", "About", "Who we are, who leads the work and how to join us"],
  ["/contact", "Contact", "Request a marketplace review"],
];
for (const [h] of START) if (!routes.has(h)) fail(`${h} is offered on the error pages but is not a page`);
for (const h of ["/client-sign-in", "/"]) if (!routes.has(h)) fail(`${h} is linked from the error pages but is not a page`);

const SEARCH_ICON = `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>`;
const CARD = 'style="color: #262524; text-decoration: none; display: block; background: #FDFCFA; padding: 28px 32px; border-top: 3px solid #DCBF85"';

const CSS = `<style data-kq-err>
.kq-eh{position:relative;overflow:hidden;isolation:isolate;min-height:clamp(540px,46vw,760px);padding:24px clamp(20px,4.4vw,64px) clamp(64px,7vw,104px);background:#F8F6F1;color:#262524}
.kq-eh>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:right center;z-index:-2}
.kq-eh::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(248,246,241,.96) 0%,rgba(248,246,241,.93) 34%,rgba(248,246,241,.55) 44%,rgba(248,246,241,0) 54%)}
.kq-eh-in{max-width:1312px;margin:0 auto}
.kq-eh-text{max-width:min(31em,42vw)}
.kq-eh nav{font-size:15px;color:#626366;margin-bottom:48px}
.kq-eh-code{margin:0 0 18px;font-size:15px;font-weight:500;color:#102A4C;display:flex;align-items:center;gap:12px}
.kq-eh-code::before{content:"";width:40px;height:3px;background:#DCBF85}
.kq-eh h1{margin:0;font-weight:400;font-size:clamp(38px,3.9vw,56px);line-height:1.06;letter-spacing:-0.025em;color:#102A4C}
.kq-eh-lead{margin:28px 0 0;font-size:clamp(18px,1.53vw,22px);line-height:1.45}
.kq-eh-note{margin:20px 0 0;font-size:16px;line-height:1.6;color:#626366}
.kq-eh-note a{color:#102A4C}
.kq-es{display:flex;align-items:center;gap:12px;box-sizing:border-box;width:100%;max-width:520px;height:56px;margin-top:32px;padding:0 14px 0 18px;background:#FDFCFA;border:1px solid #737C86;border-radius:14px;corner-shape:squircle;font:inherit;font-size:18px;color:#626366;text-align:left;cursor:pointer;transition:border-color 180ms ease,box-shadow 180ms ease,color 180ms ease}
.kq-es:hover{border-color:#102A4C;color:#262524;box-shadow:0 0 0 3px rgba(16,42,76,.1)}
.kq-es svg{flex:none;color:#102A4C}
.kq-es span{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kq-es kbd{flex:none;font:inherit;font-size:14px;line-height:1;padding:5px 9px;border:1px solid #C9D0D8;border-radius:6px;color:#626366;background:#F8F6F1}
@media (hover:none),(max-width:760px){.kq-es kbd{display:none!important}}
.kq-es .kq-es-s{display:none}
@media (max-width:760px){.kq-es .kq-es-l{display:none}.kq-es .kq-es-s{display:inline}}
.kq-esug{margin-top:28px}
.kq-esug[hidden]{display:none}
.kq-esug p{margin:0;font-size:15px;color:#626366}
.kq-esug ul{margin:10px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px}
.kq-esug a{display:inline-flex;align-items:baseline;gap:10px;padding:7px 0;font-size:18px;line-height:1.35;color:#102A4C;text-underline-offset:4px;text-decoration-thickness:1px}
.kq-esug a span{display:inline-block;font-size:15px;color:#626366;white-space:nowrap}
.kq-eh-act{margin-top:36px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px}
.kq-eh-act>a:not(.kq-btn){font-size:18px;color:#102A4C;text-underline-offset:4px}
.kq-est{padding:clamp(72px,8vw,120px) clamp(20px,4.4vw,64px);background:#E1E9F1}
.kq-est>div{max-width:1312px;margin:0 auto}
.kq-est h2{margin:0;font-weight:400;font-size:clamp(30px,2.8vw,40px);line-height:1.08;letter-spacing:-0.02em;color:#102A4C}
.kq-est-grid{margin-top:40px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
@media (max-width:900px){.kq-est-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.kq-est-grid{grid-template-columns:minmax(0,1fr)}}
.kq-est-grid>a{transition:background-color 180ms ease,transform 320ms var(--ease-out,ease)}
.kq-est-grid>a p{margin:0;font-size:22px;line-height:1.3;font-weight:500;color:#102A4C;display:flex;align-items:center;justify-content:space-between;gap:12px}
.kq-est-grid>a p svg{flex:none;transition:transform 240ms var(--ease-out,ease)}
.kq-est-grid>a span{display:block;margin-top:8px;font-size:16px;line-height:1.45;color:#626366}
@media (hover:hover){.kq-est-grid>a:hover{background:#FFFFFF!important;transform:translateY(-3px)}.kq-est-grid>a:hover p svg{transform:translateX(4px)}}
.kq-est+.kq-est{background:#F8F6F1}
@media (max-width:900px){
.kq-eh{min-height:0;padding-top:0}
.kq-eh>img{position:static;display:block;width:calc(100% + 2*clamp(20px,4.4vw,64px));max-width:none;height:auto;aspect-ratio:3/2;margin:0 calc(-1*clamp(20px,4.4vw,64px)) 28px;object-position:var(--kq-eh-x,80%) center}
.kq-eh::before{display:none}
.kq-eh-text{max-width:none}
.kq-eh nav{margin-bottom:32px}
}
@media (prefers-reduced-motion:reduce){.kq-est-grid>a,.kq-est-grid>a p svg{transition:none}.kq-est-grid>a:hover{transform:none}}
</style>`;

// 404 only: offer the pages whose address or title is closest to the address that was asked for.
// It reads the list the site search already has in the page and the archive's titles, one entry
// per address (the same article can be in both).
const SUGGEST = `<script>/* 404: pages closest to the address that was asked for */
(function(){var d=document,box=d.querySelector('.kq-esug');if(!box)return;
var STOP={the:1,and:1,for:1,with:1,from:1,that:1,this:1,your:1,what:1,how:1,why:1,are:1,was:1,html:1,php:1,www:1,index:1,page:1,blog:1,post:1,news:1,perspectives:1,work:1,category:1,tag:1};
var words=decodeURIComponent(location.pathname).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2&&!STOP[x]&&!/^\\d+$/.test(x);});
if(!words.length)return;
var mail=d.querySelector('[data-kq-report]');if(mail)mail.href='mailto:contact@kwontified.com?subject='+encodeURIComponent('Broken link on kwontified.com')+'&body='+encodeURIComponent('This address did not open: '+location.href+'\\n\\nI found the link on: '+(d.referrer||'(please say where)'));
function rank(rows){var out=[],seen={};
/* one entry per page: the site list and the archive can both name the same article */
rows=rows.filter(function(r){var h=String(r.h||'').replace(/[?#].*$/,'').replace(/\\/$/,'')||'/';if(seen[h])return false;seen[h]=1;return true;});
rows.forEach(function(r){var hay=(r.h+' '+r.t).toLowerCase(),hits=0,len=0;words.forEach(function(x){if(hay.indexOf(x)>-1){hits++;len+=x.length;}});
if(hits>=Math.min(2,words.length)&&hits/words.length>=0.5)out.push({r:r,s:hits*10+len});});
out.sort(function(a,b){return b.s-a.s;});return out.slice(0,3).map(function(x){return x.r;});}
function show(list){if(!list.length)return;var ul=box.querySelector('ul');ul.innerHTML='';
list.forEach(function(r){var li=d.createElement('li'),a=d.createElement('a'),s=d.createElement('span');a.href=r.h;a.textContent=r.t+' ';s.textContent=r.g;a.appendChild(s);li.appendChild(a);ul.appendChild(li);});box.hidden=false;}
function go(){var dlg=d.getElementById('kq-cmdk'),url=dlg&&dlg.getAttribute('data-kq-articles'),pages=(window.kqSearch||[]).filter(function(r){return r.h&&r.h.charAt(0)==='/'&&r.h.indexOf('#')<0;});
if(!url||!window.fetch){show(rank(pages));return;}
fetch(url).then(function(r){if(!r.ok)throw 0;return r.json();}).then(function(rows){var G=['Article','News','Press release'];
show(rank(pages.concat(rows.map(function(r){return{t:r[0],h:r[1],g:G[r[2]]||G[0]};}))));}).catch(function(){show(rank(pages));});}
if(d.readyState==='complete')go();else addEventListener('load',go);
})();</script>`;

const ARROW = `<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M2 8h11M9 4l4 4-4 4"/></svg>`;
const start = (title) => `<section class="kq-est" aria-labelledby="start-title"><div><h2 id="start-title">${title}</h2><div class="kq-est-grid">` +
  START.map(([h, t, s]) => `<a href="${h}" ${CARD}><p>${t}${ARROW}</p><span>${s}</span></a>`).join("") + `</div></div></section>`;

function hero(code, o) {
  const p = PHOTO[code];
  return `<section class="kq-eh" aria-label="${o.label}"${o.x ? ` style="--kq-eh-x: ${o.x}"` : ""}><img fetchpriority="high" src="/assets/${p.file}" alt="${p.alt}" width="2000" height="848"><div class="kq-eh-in"><div class="kq-eh-text">` +
    `<nav aria-label="Breadcrumb"><a href="/" style="color: #626366">Home</a> / <span aria-current="page">${o.crumb}</span></nav>` +
    `<p class="kq-eh-code">Error ${code}</p>` +
    `<h1 id="page-title"><span class="kq-mask"><span class="kq-line">${o.h1}</span></span></h1>` +
    `<p class="kq-eh-lead kq-load" style="--d: 380ms">${o.lead}</p>${o.body}</div></div></section>`;
}

const pages = {
  "404.html": {
    title: "Page not found | Kwontified",
    desc: "The page you were looking for has moved or no longer exists. Use Search in the menu, or start from Kwontified’s case studies or the homepage.",
    main: hero(404, {
      label: "Page not found", crumb: "Page not found", x: "100%",
      h1: "We can’t find that page.",
      lead: "The address may be mistyped, or the page may have moved or been retired. Search the site, or start from one of the pages below.",
      body: `<button type="button" class="kq-es kq-load" style="--d: 460ms" data-cmdk>${SEARCH_ICON}<span><span class="kq-es-l">Search pages, case studies and articles</span><span class="kq-es-s">Search the site</span></span><kbd aria-hidden="true">/</kbd></button>` +
        `<div class="kq-esug" hidden><p>Were you looking for one of these?</p><ul></ul></div>` +
        `<div class="kq-eh-act kq-load" style="--d: 540ms"><a class="kq-btn" href="/" style="background: #102A4C; color: #F8F6F1; text-decoration: none; padding: 16px 28px; min-height: 52px; font-size: 18px; box-sizing: border-box; display: inline-flex; align-items: center">Back to the homepage</a><a href="/work">See our work</a></div>` +
        `<p class="kq-eh-note">If a link on our site brought you here, <a data-kq-report href="mailto:contact@kwontified.com?subject=Broken%20link%20on%20kwontified.com">tell us</a> and we will fix it.</p>`,
    }) + start("Start from here") +
      `<section class="kq-est" aria-labelledby="latest-title"><div><h2 id="latest-title">The latest from Perspectives</h2><div class="kq-est-grid">${latestCards(index)}</div></div></section>`,
    tail: SUGGEST,
  },
  "403.html": {
    title: "Access restricted | Kwontified",
    desc: "This page is restricted. If you are a Kwontified client, sign in to the client portal; otherwise start from the homepage.",
    main: hero(403, {
      label: "Access restricted", crumb: "Access restricted", x: "100%",
      h1: "You don’t have access to this page.",
      lead: "This page is restricted, usually to clients who are signed in. If you are a client, sign in and open the link again.",
      body: `<div class="kq-eh-act kq-load" style="--d: 460ms"><a class="kq-btn" href="/client-sign-in" style="background: #102A4C; color: #F8F6F1; text-decoration: none; padding: 16px 28px; min-height: 52px; font-size: 18px; box-sizing: border-box; display: inline-flex; align-items: center">Client sign-in</a><a href="/">Back to the homepage</a></div>` +
        // the same address the client sign-in page gives for access help
        `<p class="kq-eh-note">If you think you should have access, ask your Kwontified account lead or write to <a href="mailto:support@kwontified.com?subject=Access%20to%20a%20page%20on%20kwontified.com">support@kwontified.com</a>.</p>`,
    }) + start("Open to everyone"),
    tail: "",
  },
};

for (const [name, p] of Object.entries(pages)) {
  let h = shell;
  const a = h.indexOf("<main"), a2 = h.indexOf(">", a) + 1, b = h.indexOf("</main>");
  h = h.slice(0, a2) + " " + p.main + " " + h.slice(b);
  const t = /<title>[\s\S]*?<\/title>/;
  if (!t.test(h)) fail(`${name}: no <title>`);
  h = h.replace(t, () => `<title>${p.title}</title>`);
  let n = 0;
  h = h.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, (_, x) => { n++; return x + p.desc; });
  if (n < 1) fail(`${name}: no description to set`);
  h = h.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g, (_, x) => x + p.title);
  if (!/<meta name="robots" content="noindex">/.test(h)) fail(`${name}: the shell is not marked noindex`);
  { let k = 0; h = h.replace(/<meta name="robots" content="noindex">/g, (m) => (k++ ? "" : m)); } // one robots tag (QA seo-r2-06)
  if (h.split("</head>").length !== 2) fail(`${name}: expected one </head>`);
  h = h.replace("</head>", () => CSS + "</head>");
  if (p.tail) h = h.replace(/<\/body>(?![\s\S]*<\/body>)/, () => p.tail + "</body>");
  // every link on the page must be a real page
  for (const m of h.slice(h.indexOf("<main"), h.indexOf("</main>")).matchAll(/href="(\/[^"#?]*)/g)) if (!routes.has(m[1]) && !m[1].startsWith("/assets/")) fail(`${name}: links to ${m[1]}, which is not a page`);
  fs.writeFileSync(path.join(DIR, name), h);
}
console.log(`site-errors: 404 and 403 pages built (${START.length} starting points each; 404 also has search, closest-page suggestions and the three newest articles)`);
