// Post-build fixes for the exported pages. Runs after build-site.mjs on public/_kq.
//   1. one page per case study, generated from the Work library cards on the
//      existing case study page's layout (only what the card states is shown)
//   2. every case study reference links to its own page
//   3. channel list, News and Press release items, About names and figures are links
//   4. article and case study cards are clickable as a whole, image included
//   5. homepage: the case finder buttons and the hero video button work
//   6. article pages carry their own author and date in the meta tags
// Each edit asserts that it matched, so a changed export fails the build loudly.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const KQ = path.join(ROOT, "public/_kq");
const P = {};
for (const f of fs.readdirSync(KQ)) if (f.endsWith(".html")) P[f] = fs.readFileSync(path.join(KQ, f), "utf8");
const log = [];
const fail = (m) => { throw new Error("site-fixes: " + m); };
const text = (h) => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const norm = (s) => text(s).toLowerCase().replace(/[.\s]+$/, "");
const esc = (s) => s.replace(/&(?!amp;|#|[a-z]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// replace exactly n matches of a global regex with a function's result
function sub(file, re, fn, n = 1) {
  let c = 0;
  P[file] = P[file].replace(re, (...a) => { c++; return fn(...a); });
  if (c !== n) fail(`${file}: expected ${n} match(es) of ${re}, found ${c}`);
}
// mark the nearest enclosing <tag> before idx as the positioning box for a stretched link
function markRow(file, idx, tag) {
  const at = P[file].lastIndexOf("<" + tag, idx);
  if (at < 0) fail(`${file}: no <${tag}> before ${idx}`);
  const end = at + tag.length + 1;
  if (P[file].slice(end, end + 12) !== " data-kq-row") P[file] = P[file].slice(0, end) + " data-kq-row" + P[file].slice(end);
}
const link = (href, inner, cls = "kq-il kq-sl") => `<a class="${cls}" href="${href}">${inner}</a>`;

// ---- 1. case studies ----------------------------------------------------------
const IND = { beauty: "Beauty and personal care", apparel: "Apparel, footwear and accessories", food: "Food, health and wellness", home: "Home and household", pet: "Pet" };
const CAP = { retail: "Retail Media and Advertising", creative: "Creative Studio", ops: "Marketplace Operations", analytics: "Analytics and Forecasting", ai: "Agentic Commerce", recovery: "Revenue Recovery" };
const EXISTING = "/work/shortage-claims";
const labels = (v, map) => v.split(/\s+/).filter(Boolean).map((k) => map[k] ?? fail(`unknown label ${k}`)).join(", ");
const slugify = (t) => {
  let s = text(t).toLowerCase().replace(/€/g, "eur ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (s.length > 64) s = s.slice(0, 64).replace(/-[^-]*$/, "");
  return s.replace(/(-(?:a|an|the|its|by|on|in|of|to|and|with|after|from))+$/, "");
};

const cards = [...P["work.html"].matchAll(/<a class="kq-ccard"([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, body]) => {
  const at = (k) => (attrs.match(new RegExp(k + '="([^"]*)"')) || [])[1] || "";
  const img = body.match(/<img[^>]*?src="([^"]+)"[^>]*?alt="([^"]*)"/) || fail("card without image");
  const plate = body.match(/class="kq-plate"[^>]*><span[^>]*>([\s\S]*?)<\/span><span[^>]*>([\s\S]*?)<\/span>/) || fail("card without figure");
  const main = body.match(/<p[^>]*>([^<]*)<\/p><h2[^>]*>([\s\S]*?)<\/h2><p[^>]*>([\s\S]*?)<\/p>/) || fail("card without text");
  const more = body.slice(main.index + main[0].length).match(/<p[^>]*><span[^>]*>([\s\S]*?)<\/span>([\s\S]*?)<\/p>/);
  const [brand, ...ch] = main[1].split(". ");
  const title = text(main[2]);
  return {
    title, key: norm(title), brand, channel: ch.join(". "), sum: main[3], img: img[1], alt: img[2],
    fig: text(plate[1]), lab: text(plate[2]), more: more ? [text(more[1]), text(more[2])] : null,
    ch: at("data-ch"), category: labels(at("data-ind"), IND), caps: labels(at("data-cap"), CAP),
  };
});
if (cards.length !== 25) fail(`expected 25 case study cards, found ${cards.length}`);
for (const c of cards) c.url = c.key.startsWith("$781k in shortage claims") ? EXISTING : "/work/" + slugify(c.title);
if (new Set(cards.map((c) => c.url)).size !== cards.length) fail("duplicate case study slugs");
if (!cards.some((c) => c.url === EXISTING)) fail("the existing case study is not in the library");
const find = (kw) => {
  const hit = cards.filter((c) => c.key.includes(kw.toLowerCase()));
  if (hit.length !== 1) fail(`"${kw}" names ${hit.length} case studies`);
  return hit[0];
};
// the four featured slides carry a longer account of the same case
for (const [, t, para] of P["work.html"].matchAll(/class="kq-slide-text"><h2[^>]*>([\s\S]*?)<\/h2><p[^>]*>([\s\S]*?)<\/p>/g)) {
  const c = cards.find((x) => x.key === norm(t)) || fail(`slide "${text(t)}" is not in the library`);
  c.long = para;
}

// Search descriptions for case studies whose card summary is too long for a results page
// (Google shows about 155 characters). Keyed by a phrase naming exactly one case study;
// the other cases use their card summary as before.
const CASE_DESC = Object.fromEntries(Object.entries({
  "price claims recovered": "A personal care appliance vendor recovered $538K of $612K after Amazon kept paying its old cost for five months, and fixed the process that let it happen.",
  "walmart display": "A baby food supplier’s Walmart display ads, aimed at households new to the brand and judged on store sales too, turned $380K of spend into $2.60M in sales.",
  "sold at full price": "A cashmere label sold 71% of its first-season Amazon allocation at full price, against 58% across its wholesale accounts, reordering only proven colors.",
  "affiliate sales": "A skincare brand took TikTok Shop affiliate sales from $380K to $2.3M in a year by sampling only acne and sensitive-skin creators with similar product sales.",
  "claims it could not prove": "A sports nutrition brand went from 7 to 21 of 45 tracked AI assistant answers by removing claims it could not prove and leading with third-party testing.",
  "roundel roas": "A clean skincare brand raised always-on Roundel ROAS from 2.4x to 3.9x by restructuring a campaign that spent 38% of its budget on branded search.",
  "amazon mexico": "A pet grooming brand listed all 41 products on Amazon Mexico from US FBA stock, in Spanish written from Mexican searches, to see which earned local inventory.",
  "break-even ad cost": "An oral care launch reached break-even ad cost in 7 weeks, not 12: Vine reviews arrived before the main ad spend, which came in at $38K against a $52K plan.",
  "conversion doubled": "A travel luggage brand doubled its Amazon UK conversion rate from 3.1% after its pages were rewritten in British English, with cabin sizes in centimetres.",
  "23 of 40": "A sleep brand went from 6 to 23 of 40 tracked Alexa for Shopping answers after completing the firmness, loft, sleep position and cooling data on its listings.",
  "viral spike": "A drinkware brand sold 66,800 tumblers in 12 weeks on TikTok Shop without running out: daily alerts on affiliate videos started restocking as the spike began.",
  "luxury stores conversion": "A fine jewelry brand raised Amazon Luxury Stores conversion from 3.4% to 5.1% with on-body imagery, scale references and short videos that show size.",
  "listing types": "A personal care brand nearly doubled its Mercado Libre margin from 9% by choosing the Clásica or Premium listing type product by product, not Premium for all.",
  "premium beauty": "A clinical skincare brand grew Amazon sales 64% after we cleared unauthorized sellers and rebuilt its pages, and Amazon accepted it into Premium Beauty.",
  "without losing the amazon buy box": "A kitchen tools brand kept the Amazon Buy Box while selling on Temu: price floors tied to Amazon and daily checks restored 14 suppressed offers in 3 weeks."
}).map(([kw, d]) => [find(kw).url, d]));

const TPL = P["work--shortage-claims.html"];
function casePage(c) {
  let h = TPL;
  const rep = (re, fn, n = 1) => {
    let k = 0;
    h = h.replace(re, (...a) => { k++; return fn(...a); });
    if (k !== n) fail(`case template: expected ${n} of ${re}, found ${k}`);
  };
  const others = [...cards.filter((x) => x !== c && x.ch === c.ch), ...cards.filter((x) => x !== c && x.ch !== c.ch && x.caps === c.caps), ...cards.filter((x) => x !== c)];
  const related = [...new Set(others)].slice(0, 3);
  const title = esc(c.title) + ".";
  h = h.split("$781K in shortage claims recovered.").join(title);
  h = h.split("https://kwontified.com" + EXISTING).join("https://kwontified.com" + c.url);
  const desc = CASE_DESC[c.url] || text(c.sum);
  if (desc.length > 160) fail(`case study ${c.url}: search description is ${desc.length} characters; add a shorter one to CASE_DESC`);
  rep(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, (_, a) => a + esc(desc), 3);
  rep(/(<span aria-current="page"[^>]*>)Shortage claims(<\/span>)/g, (_, a, b) => a + esc(c.brand.replace(/^An? /, "").replace(/^./, (x) => x.toUpperCase())) + b);
  rep(/(<p[^>]*>)A kitchen appliance vendor, Amazon Vendor Central(<\/p>)/g, (_, a, b) => `${a}${esc(c.brand)}, ${esc(c.channel)}${b}`);
  rep(/(<dt[^>]*>Category<\/dt><dd[^>]*>)[^<]*/g, (_, a) => a + c.category);
  rep(/(<dt[^>]*>Channel<\/dt><dd[^>]*>)[^<]*/g, (_, a) => a + esc(c.channel));
  rep(/(<dt[^>]*>Capabilities<\/dt><dd[^>]*>)[^<]*/g, (_, a) => a + c.caps);
  rep(/<div[^>]*><dt[^>]*>Engagement<\/dt><dd[^>]*>[^<]*<\/dd><\/div>/g, () => "");
  rep(/(<img[^>]*?src=")\/assets\/6698bff78375\.jpg(" alt=")[^"]*/g, (_, a, b) => a + c.img + b + c.alt);
  const tiles = [[c.fig, c.lab], ...(c.more ? [c.more] : [])];
  let i = 0;
  rep(/<div[^>]*><p[^>]*><span data-roll[^>]*>[^<]*<\/span><\/p><p[^>]*>[^<]*<\/p><\/div>/g, (m) =>
    i++ ? "" : tiles.map(([f, l]) => m.replace(/(<span data-roll[^>]*>)[^<]*/, (_, a) => a + esc(f)).replace(/(<\/p><p[^>]*>)[^<]*/, (_, a) => a + esc(l))).join(""), 4);
  rep(/<div[^>]*><figure class="kq-vis"[\s\S]*?<\/figure><\/div>/g, () => "");
  rep(/<p[^>]*>July 2024 to March 2025\. The figures[\s\S]*?<\/p>/g, () => "");
  rep(/(<h2 id="sit-title"[^>]*>)The situation(<\/h2>)/g, (_, a, b) => a + "Summary" + b);
  rep(/(<p[^>]*>)The vendor had taken[\s\S]*?(<\/p>)/g, (_, a, b) => a + (c.long || c.sum) + b);
  const did = h.indexOf('id="did-title"');
  if (did < 0) fail("case template: no What we did section");
  h = h.slice(0, h.lastIndexOf("<section", did)) + h.slice(h.indexOf("</section>", did) + 10);
  i = 0;
  rep(/<a href="[^"]*"( data-archive-id="[^"]*")?([^>]*>)(<p[^>]*>)[^<]*(<\/p><h3[^>]*>)[^<]*(<\/h3><\/a>)/g, (_, _id, rest, p, mid, end) => {
    const r = related[i++];
    return r ? `<a href="${r.url}"${rest}${p}Case study, ${esc(r.channel)}${mid}${esc(r.title)}${end}` : "";
  }, 3);
  rep(/(<h2 id="close-title"[^>]*>)Find out what Amazon owes you\.(<\/h2>)/g, (_, a, b) => a + "Let’s write your next case study." + b);
  rep(/(<p[^>]*>)Share your Vendor Central deduction history\.[^<]*(<\/p>)/g, (_, a, b) => a + "Share your channels and goals. We return a first read on where growth is most within reach for your brand." + b);
  rep(/>Request a recovery review<\/a>/g, () => ">Start your review</a>");
  const body = h.slice(h.indexOf("<main"), h.indexOf('id="related-title"'));
  for (const stale of ["July 2024", "kitchen appliance", "$1.42M"]) if (body.includes(stale) && !c.sum.includes(stale)) fail(`${c.url}: template text "${stale}" left behind`);
  return h;
}
const newRoutes = [];
for (const c of cards) {
  if (c.url === EXISTING) continue;
  const file = c.url.slice(1).replace(/\//g, "--") + ".html";
  if (P[file]) fail(`${file} already exists`);
  P[file] = casePage(c);
  newRoutes.push({ route: c.url, file: `/_kq/${file}`, source: "CaseStudy.html + Work.html card (site-fixes)" });
}

// ---- 2. case study references ---------------------------------------------------
{
  let i = 0;
  sub("work.html", /(<a class="kq-ccard"[^>]*?href=")[^"]*/g, (_, a) => a + cards[i++].url, 25);
  const tabs = [];
  sub("work.html", /(class="kq-slide-text"><h2[^>]*>)([\s\S]*?)(<\/h2>[\s\S]*?<a class="kq-btn[^"]*" href=")[^"]*/g, (_, a, t, b) => {
    const c = cards.find((x) => x.key === norm(t));
    tabs.push(c.key.includes("walmart display") ? "Walmart display" : c.key.includes("premium beauty") ? "Premium Beauty" : c.key.includes("shortage claims") ? "Shortage claims" : c.channel);
    return a + t + b + c.url;
  }, 4);
  ["Amazon DSP", "Conversion", "Vendor Central", "Luxury swimwear"].forEach((old, k) => {
    sub("work.html", new RegExp(`(class="kq-tab"[^>]*>)${old}(<)`, "g"), (_, a, b) => a + tabs[k] + b);
    sub("work.html", new RegExp(`(aria-label="${k + 1} of 4: )${old}(")`, "g"), (_, a, b) => a + tabs[k] + b);
  });
}
const NAMED = { "read the amazon case study": "premium beauty", "read the walmart case study": "walmart display", "read the revenue recovery case study": "shortage claims" };
for (const f of Object.keys(P)) {
  P[f] = P[f].replace(/<a\b([^>]*?)href="(\/work|\/work\/shortage-claims|\/channels\/walmart|\/capabilities\/revenue-recovery)"([^>]*)>([\s\S]*?)<\/a>/g, (all, a, href, b, inner, at) => {
    if (/kq-ccard|kq-tab|data-case=/.test(a + b)) return all; // data-case links are resolved by keyword below
    const t = norm(inner);
    let c = NAMED[t] ? find(NAMED[t]) : cards.find((x) => t.includes(x.key));
    if (!c && href.startsWith("/work") && /\bcase study\b/.test(t)) {
      // the sentence just before the link names the brand
      const win = text(P[f].slice(Math.max(0, at - 2500), at)).toLowerCase().slice(-400);
      let end = -1, len = 0;
      for (const x of cards) {
        const k = x.brand.replace(/^An? /, "").toLowerCase(), p = win.lastIndexOf(k);
        if (p >= 0 && (p + k.length > end || (p + k.length === end && k.length > len))) { c = x; end = p + k.length; len = k.length; }
      }
      const heads = [...P[f].slice(Math.max(0, at - 6000), at).matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((m) => norm(m[1]));
      for (let k = heads.length - 1; k >= 0 && !c; k--) c = cards.find((x) => x.key === heads[k]);
      if (!c) log.push(`unresolved case study link on ${f}: "${text(inner)}" -> ${href}`);
    }
    if (!c || c.url === href) return all;
    log.push(`${f}: "${text(inner).slice(0, 60)}" ${href} -> ${c.url}`);
    return `<a${a}href="${c.url}"${b}>${inner}</a>`;
  });
  // site search list
  P[f] = P[f].replace(/(<script type="application\/json" id="kq-cmdk-data">)([\s\S]*?)(<\/script>)/, (_, a, json, z) => {
    const data = JSON.parse(json).filter((e) => e.t !== "Case study: Amazon DSP");
    for (const e of data) if (e.g === "Case studies") {
      const c = cards.find((x) => x.key === norm(e.t));
      if (c) e.h = c.url; else log.push(`${f}: search entry "${e.t}" has no case study page`);
    }
    return a + JSON.stringify(data).replace(/<\//g, "<\\/") + z;
  });
}

// creative gallery: each piece links to its case study, named in the export by a keyword
{
  let n = 0;
  P["work--creative.html"] = P["work--creative.html"].replace(/href="\/work" data-case="([^"]+)"/g, (_, kw) => { n++; return `href="${find(kw).url}"`; });
  if (n !== 10) fail(`creative gallery: expected 10 case study links, found ${n}`);
}

// ---- 3. homepage -------------------------------------------------------------------
const HOME = "index.html";
const CHANNELS = [
  ["Amazon Seller Central", "/channels/amazon"], ["Amazon Vendor Central", "/channels/amazon"], ["Walmart", "/channels/walmart"],
  ["Target Plus", "/channels/target-plus"], ["International", "/channels/international"], ["Zalando", "/channels/zalando"],
  ["Mercado Libre", "/channels/mercado-libre"], ["Temu", "/channels/temu"], ["TikTok Shop", "/channels/tiktok-shop"],
  ["Instagram Shop", "/channels/instagram-shop"], ["AI shopping assistants", "/capabilities/agentic-commerce"],
];
for (const [name, href] of CHANNELS) {
  sub(HOME, new RegExp(`(<span[^>]*>)${reEsc(name)}(<\\/span><br>)`, "g"), (_, a, b) => a + link(href, name) + b);
  markRow(HOME, P[HOME].indexOf(link(href, name)), "li");
}
sub(HOME, /Rufus, ChatGPT, Gemini and Claude/g, () => "Claude, ChatGPT, Alexa for Shopping and Gemini");
sub(HOME, /href="#channels"/g, () => 'href="/capabilities/analytics-forecasting"');
sub(HOME, /href="\/about"([^>]*>\s*See all press)/g, (_, a) => `href="/about#press-stage-title"${a}`);
for (const [lead, kw] of [["Cashmere label, Amazon.", "sold at full price"], ["Cosmetics brand, Mercado Libre.", "infringing listings"], ["Travel luggage brand, Amazon UK.", "conversion doubled"], ["Outerwear brand, Zalando.", "winter stock"], ["Clinical skincare brand, Amazon US.", "premium beauty"]]) {
  const a = link(find(kw).url, lead);
  sub(HOME, new RegExp(`(<span[^>]*>)${reEsc(lead)}(<\\/span>)`, "g"), (_, x, y) => x + a + y);
  markRow(HOME, P[HOME].indexOf(a), "article");
}
{
  // footer headings link to their index pages, as they do on every other page
  const foot = P[HOME].indexOf('id="footer"');
  for (const [name, href] of [["Capabilities", "/capabilities"], ["Channels", "/channels"]]) {
    const m = P["work.html"].match(new RegExp(`<h2[^>]*>(<a href="${href}"[^>]*>)${name}<\\/a><\\/h2>`)) || fail(`no linked ${name} heading to copy`);
    const re = new RegExp(`(<h2[^>]*>)${name}(<\\/h2>)`, "g");
    re.lastIndex = foot;
    const hit = re.exec(P[HOME]) || fail(`no ${name} heading in the homepage footer`);
    P[HOME] = P[HOME].slice(0, hit.index) + hit[1] + m[1] + name + "</a>" + hit[2] + P[HOME].slice(hit.index + hit[0].length);
  }
}
// case finder: [where you sell most][annual revenue] -> case study. The cards state
// no client revenue, so the revenue band picks among that channel's cases; edit here.
const FINDER = [
  ["sold at full price", "premium beauty", "tacos fell"],
  ["price claims", "shortage claims", "shortage claims"],
  ["5% less ad spend", "walmart display", "walmart display"],
  ["live on target plus", "roundel roas", "roundel roas"],
  ["amazon mexico", "first six months on zalando", "conversion doubled"],
].map((row) => row.map((kw) => { const c = find(kw); return { tag: c.channel, fig: c.fig, line: `${c.brand}. ${c.title}.`, url: c.url }; }));
const HOME_JS = `<script>/* case finder and hero video button */
(function(){var s=document.getElementById('finder');if(!s)return;var g=s.querySelectorAll('[role=group]'),live=s.querySelector('p[aria-live]');if(g.length<2||!live)return;
var card=live.parentNode,ps=card.querySelectorAll('p'),as=card.querySelectorAll('a'),D=${JSON.stringify(FINDER)},C=['sc','vc','wm','tg','intl'],B=['s','m','l'],sel=[0,0];
if(ps.length<3||as.length<2)return;
function draw(){var d=D[sel[0]][sel[1]];ps[0].textContent=d.tag;ps[1].textContent=d.fig;live.textContent=d.line;as[0].setAttribute('href','/contact#ch='+C[sel[0]]+'&rev='+B[sel[1]]);as[1].setAttribute('href',d.url);
var t=as[1].firstChild;if(t&&t.nodeType===3)t.nodeValue='Read this case study ';else as[1].textContent='Read this case study';}
[0,1].forEach(function(k){var bs=[].slice.call(g[k].querySelectorAll('button')),on,off;
bs.forEach(function(b){if(b.getAttribute('aria-pressed')==='true')on=b.getAttribute('style');else off=b.getAttribute('style');});
bs.forEach(function(b,i){b.addEventListener('click',function(){sel[k]=i;bs.forEach(function(x,j){x.setAttribute('aria-pressed',j===i?'true':'false');if(on&&off)x.setAttribute('style',j===i?on:off);});draw();});});});
})();
(function(){var b=document.querySelector('button[aria-label="Pause video"]');if(!b||b.getAttribute('data-ready'))return;var v=b.parentNode.querySelector('video');if(!v)return;
b.setAttribute('data-ready','1');var pause=b.innerHTML,svg=b.querySelector('svg'),st=svg&&svg.getAttribute('style')||'width:16px;height:16px';
var play='<svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" style="'+st+'"><path d="M5 3.5L12.5 8L5 12.5Z"></path></svg>';
function sync(){var p=v.paused;if(b.getAttribute('aria-label')===(p?'Play video':'Pause video'))return;b.setAttribute('aria-label',p?'Play video':'Pause video');b.innerHTML=p?play:pause;}
/* reduced motion: keep the still frame and do not run the video */
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();v.preload='none';return;}
b.addEventListener('click',function(){if(v.paused)v.play();else v.pause();});
v.addEventListener('play',sync);v.addEventListener('pause',sync);
/* autoplay can be refused (iOS Low Power Mode, data saver): show Play instead of Pause */
v.addEventListener('canplay',function(){setTimeout(sync,600);},{once:true});setTimeout(sync,4000);
})();</script>`;
if (!P[HOME].includes('id="finder"') || !P[HOME].includes('aria-label="Pause video"')) fail("homepage finder or video button not found");
sub(HOME, /<\/body>(?![\s\S]*<\/body>)/g, () => HOME_JS + "</body>");

// ---- 4. Perspectives: News and Press releases ----------------------------------------
{
  const F = "perspectives.html";
  const h1 = (f) => norm((P[f].match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || ["", ""])[1]);
  const pages = Object.keys(P).filter((f) => /^perspectives--(news|press-releases)--/.test(f));
  const route = (f) => "/" + f.replace(/\.html$/, "").replace(/--/g, "/");
  let n = 0;
  P[F] = P[F].replace(/(<li data-date="[^"]*"[^>]*>\s*<span[^>]*>[^<]*<\/span><span[^>]*><span[^>]*>)([\s\S]*?)(<\/span><span[^>]*>)(News|Press release)/g, (all, a, title, b, kind) => {
    const kw = (title.match(/unBoxed|Accelerate/) || [])[0];
    // a press release is matched by its exact headline; failing that, by event name and year
    // (there is one unBoxed and one Accelerate release for most years)
    const yr = (title.match(/20\d\d/) || [""])[0];
    const press = pages.filter((p) => p.includes("--press-releases--"));
    const f = kind === "News" ? pages.find((p) => p.includes("--news--") && h1(p) === norm(title))
      : press.find((p) => h1(p) === norm(title)) || (kw && press.find((p) => h1(p).includes(kw.toLowerCase()) && h1(p).includes(yr)));
    if (!f) { log.push(`${F}: no page exists for ${kind} item "${text(title)}"`); return all; }
    n++;
    return a + link(route(f), title) + b + kind;
  });
  if (n < 5) fail(`${F}: linked ${n} News and Press release items, expected 5`);
  for (const m of [...P[F].matchAll(/<a class="kq-il kq-sl" href="\/perspectives\/(?:news|press-releases)\//g)].reverse()) markRow(F, m.index, "li");
}

// ---- 5. About ---------------------------------------------------------------------------
for (const [name, slug] of [["Elaine Kwon", "elaine-kwon"], ["Jordan Taylor", "jordan-taylor"]])
  sub("about.html", new RegExp(`(<h3[^>]*>)${name}(<\\/h3>)`, "g"), (_, a, b) => a + link(`/about/leadership/${slug}`, name, "kq-il") + b);
for (const [line, kw] of [["Sales growth for a clinical skincare brand after it entered Premium Beauty", "premium beauty"], ["Omnichannel ROAS for a baby food supplier from Walmart display", "walmart display"], ["Of a cashmere label’s first-season Amazon allocation sold at full price", "sold at full price"]])
  sub("about.html", new RegExp(`(<p[^>]*>)${reEsc(line)}(<\\/p>)`, "g"), (_, a, b) => a + link(find(kw).url, line, "kq-il kq-ul") + b);

// ---- 6. whole-card links, article meta, shared styles ------------------------------------
const CSS = `<style>/* site-fixes */[data-kq-row]{position:relative}a.kq-sl::after{content:"";position:absolute;inset:0;z-index:1}a.kq-il{color:inherit;text-decoration:none}a.kq-il:hover,a.kq-ul{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}[data-kq-row]:focus-within{outline:2px solid currentColor;outline-offset:4px}[data-kq-row] a.kq-sl:focus{outline:none}[data-kq-row]:hover a.kq-sl{text-decoration:underline;text-underline-offset:4px;text-decoration-thickness:1px}</style>`;
const MONTH = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
let stretched = 0, metas = 0;
for (const f of Object.keys(P)) {
  P[f] = P[f].replace(/<article\b([^>]*)>([\s\S]*?)<\/article>/g, (all, attrs, body) => {
    const as = body.match(/<a\b[^>]*>/g) || [];
    if (attrs.includes("data-kq-row")) return all;
    // a card whose only link goes to a Perspectives item is clickable as a whole, with or without
    // a picture (image, title, summary and date line all open it); other cards need a picture
    const one = as.length === 1, toPost = one && /href="\/perspectives\//.test(as[0]);
    if (!toPost && !body.includes("<img")) return all;
    if (/<(button|input|select|textarea|details|video|audio|iframe)\b/.test(body)) return all; // the link overlay would cover these
    if (!one || !/href="\/(perspectives|work|capabilities|channels)\//.test(as[0])) { if (one) log.push(`${f}: card with an image and ${as.length} links left as is`); return all; }
    stretched++;
    const a = /class="/.test(as[0]) ? as[0].replace(/class="/, 'class="kq-sl ') : as[0].replace(/^<a/, '<a class="kq-sl"');
    return `<article data-kq-row${attrs}>${body.replace(as[0], () => a)}</article>`;
  });
  if (/^perspectives--/.test(f)) {
    const by = text((P[f].match(/data-art="byline"[^>]*>([\s\S]*?)<\/p>/) || ["", ""])[1]);
    const d = by.match(/\b([A-Z][a-z]{2})[a-z]* (\d{1,2}), (\d{4})/), who = by.match(/^By ([^,.]+)/) || ["", "Kwontified"];
    if (d && MONTH[d[1]] && P[f].includes('property="article:published_time"')) {
      P[f] = P[f].replace(/(<meta property="article:published_time" content=")[^"]*/, (_, a) => `${a}${d[3]}-${MONTH[d[1]]}-${d[2].padStart(2, "0")}`)
        .replace(/(<meta property="article:author" content=")[^"]*/, (_, a) => a + who[1].trim());
      metas++;
    } else log.push(`${f}: byline not read, article meta left as is ("${by.slice(0, 60)}")`);
  }
  if (!P[f].includes("</head>")) fail(`${f}: no </head>`);
  P[f] = P[f].replace("</head>", CSS + "</head>");
}

// ---- write -----------------------------------------------------------------------------------
// Narrow screens: a grid column of minmax(340px, 1fr) is wider than a 320-375px phone once
// the page gutters are taken off, so the whole page scrolled sideways (WCAG 1.4.10 reflow).
// min(340px, 100%) keeps the column at most as wide as its container; wider screens are unchanged.
let reflowed = 0;
for (const f of Object.keys(P))
  P[f] = P[f].replace(/minmax\((\d+)px, 1fr\)/g, (_, n) => { reflowed++; return `minmax(min(${n}px, 100%), 1fr)`; });
log.push(`${reflowed} grid columns capped at their container width`);
// Fonts: the regular (400) and medium (500) faces set nearly all text. Without a preload the
// browser only finds them once it has parsed the inline CSS, so text first paints in the
// fallback font and reflows when they arrive; on a slow phone that moved the cookie banner
// (anchored to the bottom of the screen) and cost ~0.09 CLS on most pages.
let preloaded = 0;
for (const f of Object.keys(P)) {
  if (P[f].includes('rel="preload" as="font"')) continue;
  const faces = [...P[f].matchAll(/@font-face\{[^}]*url\('([^']+\.woff2)'\)[^}]*font-weight:(\d+)/g)].filter((m) => m[2] === "400" || m[2] === "500");
  if (!faces.length) continue;
  const links = faces.map((m) => `<link rel="preload" as="font" type="font/woff2" href="${m[1]}" crossorigin>`).join("");
  P[f] = P[f].replace(/<meta charset="[^"]*">/i, (m) => m + links);
  preloaded++;
}
log.push(`font preloads added to ${preloaded} pages`);
// Landmarks: every page wraps its content in <main> except the home page, so screen-reader
// users had no "skip to main content" landmark there (Lighthouse: landmark-one-main).
for (const f of Object.keys(P)) {
  if (P[f].includes("<main")) continue;
  const head = P[f].indexOf("</header>"), foot = P[f].indexOf('<footer id="footer"');
  if (head < 0 || foot < head) { log.push(`${f}: no <main> and no header/footer to place one`); continue; }
  P[f] = P[f].slice(0, head + 9) + "<main>" + P[f].slice(head + 9, foot) + "</main>" + P[f].slice(foot);
  log.push(`${f}: content wrapped in <main>`);
}
for (const [f, h] of Object.entries(P)) fs.writeFileSync(path.join(KQ, f), h);
const routesFile = path.join(ROOT, "site-routes.json");
const routes = JSON.parse(fs.readFileSync(routesFile, "utf8")).filter((r) => !newRoutes.some((n) => n.route === r.route)).concat(newRoutes);
routes.sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2) + "\n");
{
  const llms = path.join(ROOT, "public/llms.txt");
  let t = fs.readFileSync(llms, "utf8");
  const lines = cards.filter((c) => c.url !== EXISTING).map((c) => `- [${c.title}](https://kwontified.com${c.url}): ${text(c.sum)}`).join("\n");
  if (!t.includes("\n## Work\n")) fail("llms.txt has no Work section");
  t = t.replace(/(\n## Work\n(?:- .*\n)+)/, (m) => m + lines + "\n");
  fs.writeFileSync(llms, t);
}
// every internal link must resolve
const known = new Set(routes.map((r) => r.route));
const bad = [];
for (const r of routes) for (const m of fs.readFileSync(path.join(ROOT, "public", r.file), "utf8").matchAll(/href=\\?"(\/[a-z0-9\-/]*)(#[^"\\]*)?\\?"/g))
  if (!m[1].startsWith("/assets/") && !m[1].startsWith("/api/") && !known.has(m[1])) bad.push(`${r.route}: link to unknown route ${m[1]}`);
if (bad.length) fail([...new Set(bad)].slice(0, 20).join("\n"));
console.log(`site-fixes: ${newRoutes.length} case study pages, ${stretched} cards made clickable, ${metas} article meta tags corrected, ${routes.length} routes`);
if (log.length) console.log([...new Set(log)].map((l) => "  · " + l).join("\n"));
