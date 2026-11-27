// Content changes applied after site-fixes.mjs, on public/_kq.
//   1. Accessibility statement at /accessibility (Terms layout); footer links point to it
//   2. Newsletter confirmation page at /subscribe/thank-you (Thank-you layout);
//      the newsletter form opens it after a successful sign-up
//   3. press releases renamed and reworded (three names removed), press materials block removed
//   4. "one plan" copy becomes one agile omni-channel strategy, with an explainer
// Each edit asserts that it matched, so a changed export fails the build loudly.
import fs from "node:fs";
import path from "node:path";
import { latestCards } from "./latest-cards.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const KQ = path.join(ROOT, "public/_kq");
const P = {};
for (const f of fs.readdirSync(KQ)) if (f.endsWith(".html")) P[f] = fs.readFileSync(path.join(KQ, f), "utf8");
const fail = (m) => { throw new Error("site-content: " + m); };
const count = (s, x) => s.split(x).length - 1;
// JSON-LD copies of the same sentence escape non-ASCII characters and keep a bare ampersand
const ld = (s) => s.replace(/&amp;/g, "&").replace(/[\u0080-\uffff]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
function swap(file, from, to) {
  if (!count(P[file], from)) fail(`${file}: "${from.slice(0, 50)}" not found`);
  P[file] = P[file].split(from).join(to).split(ld(from)).join(ld(to));
}
const setMeta = (h, title, desc, route) => {
  h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title} | Kwontified</title>`);
  h = h.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g, (_, a) => `${a}${title} | Kwontified`);
  h = h.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, (_, a) => a + desc);
  return h.replace(/(<link rel="canonical" href="|<meta property="og:url" content=")[^"]*/g, (_, a) => `${a}https://kwontified.com${route}`);
};
const newRoutes = [];
const addPage = (route, html, source) => {
  const file = route.slice(1).replace(/\//g, "--") + ".html";
  P[file] = html;
  newRoutes.push({ route, file: `/_kq/${file}`, source });
};

// ---- 1. Accessibility ------------------------------------------------------------
{
  const SECTIONS = [
    ["Our commitment", [
      "<strong>Last Updated:</strong> November 26, 2026",
      "Kwontified wants everyone to be able to use kwontified.com and the Kwontified client portal, including people who rely on screen readers, keyboard navigation, voice control, screen magnification or other assistive technology.",
      "Our goal is to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA across the site and the client portal.",
    ]],
    ["What we do", [
      "Pages are built with headings, landmarks and labels that assistive technology can read, and images carry text descriptions.",
      "Every link, button and form can be reached and used with a keyboard, with a visible focus indicator.",
      "Text and controls are designed to meet contrast requirements, and pages can be zoomed and reflowed on small screens.",
      "Moving content can be paused, and animation is reduced for visitors whose device asks for reduced motion.",
    ]],
    ["Known limitations", [
      "The site has not yet had an independent accessibility audit, so some pages may not fully meet our goal. Charts, downloadable documents and content hosted by other companies, such as press articles, marketplaces and social platforms, are the areas most likely to fall short.",
      "We treat a reported barrier as a defect and fix it as quickly as we can.",
    ]],
    ["Feedback and help", [
      "If something on this site is difficult to use, or you need information from it in another format, tell us. Please include the page address, what you were trying to do and the assistive technology you use, if any.",
      'Email: <a href="mailto:contact@kwontified.com">contact@kwontified.com</a><br>Phone: <a href="tel:+14048739148">404.873.9148</a>',
      "We aim to reply within two business days.",
    ]],
  ];
  let h = P["terms.html"] || fail("no Terms page to build the Accessibility page from");
  h = setMeta(h, "Accessibility", "How Kwontified works to make kwontified.com and its client portal usable by everyone, and how to tell us about a barrier.", "/accessibility");
  const one = (re, fn) => { let k = 0; h = h.replace(re, (...a) => { k++; return fn(...a); }); if (k !== 1) fail(`accessibility template: ${k} of ${re}`); };
  const m0 = h.indexOf("<main");
  one(/(<span class="kq-line">)Terms of Use(<\/span>)/g, (_, a, b) => a + "Accessibility" + b);
  one(/(<\/h1><p[^>]*>)The terms that govern[^<]*/g, (_, a) => a + "How we work to make kwontified.com and the Kwontified client portal usable by everyone, and how to reach us if something gets in your way.");
  const nav = h.indexOf('<nav aria-label="On this page"', m0), navEnd = h.indexOf("</nav>", nav) + 6;
  const li = h.slice(nav, navEnd).match(/<li[^>]*><a href="#s1"[^>]*>/) || fail("no contents entry");
  const h2 = h.slice(navEnd).match(/<h2 id="s1"[^>]*>/) || fail("no section heading");
  const p = h.slice(navEnd).match(/<\/h2>(<p[^>]*>)/) || fail("no paragraph");
  one(/(<nav aria-label="On this page"[\s\S]*?<ol[^>]*>)[\s\S]*?(<\/ol>)/g, (_, a, b) => a + SECTIONS.map(([t], i) => `${li[0].replace("#s1", "#s" + (i + 1))}${i + 1}. ${t}</a></li>`).join("") + b);
  const navEnd2 = h.indexOf("</nav>", h.indexOf('<nav aria-label="On this page"', m0)) + 6;
  const open = h.indexOf(">", h.indexOf("<div", navEnd2)) + 1;
  const secEnd = h.indexOf("</section>", open);
  const tail = h.slice(open, secEnd).match(/(?:\s*<\/div>){3}\s*$/) || fail("accessibility template: end of policy text not found");
  const close = secEnd - tail[0].length;
  h = h.slice(0, open) + SECTIONS.map(([t, ps], i) => `${h2[0].replace('id="s1"', `id="s${i + 1}"`)}${i + 1}. ${t}</h2>` + ps.map((x) => p[1] + x + "</p>").join("")).join("") + h.slice(close);
  if (/Terms of Use|binding agreement|legal@kwontified/.test(h.slice(h.indexOf("<main"), h.indexOf("</main>")).replace(/<a href="\/terms"[^>]*>[^<]*<\/a>/g, ""))) fail("accessibility page: Terms text left behind");
  addPage("/accessibility", h, "Terms.html layout (site-content)");
  let n = 0;
  for (const f of Object.keys(P)) P[f] = P[f].replace(/href="\/privacy"([^>]*>\s*Accessibility\s*<)/g, (_, a) => { n++; return `href="/accessibility"${a}`; });
  if (n < 90) fail(`only ${n} Accessibility footer links found`);
}

// ---- 2. Newsletter confirmation -----------------------------------------------------
// The page a visitor lands on after signing up in the footer. It confirms the sign-up, says
// what arrives, how often and from where, offers the three newest articles, and replaces the
// footer sign-up form (they have just used it) with a prompt to request a review.
// With double opt-in the sign-up API answers confirm: true and the form opens the page with
// ?confirm=1, which swaps in the "confirm by email" wording.
{
  let h = P["contact--thank-you.html"] || fail("no Thank-you page");
  h = setMeta(h, "You’re subscribed", "You are subscribed to the Kwontified Briefing, our monthly note on the marketplace changes that matter for brands.", "/subscribe/thank-you");
  const sw = (from, to) => { if (count(h, from) !== 1) fail(`confirmation template: expected one "${from.slice(0, 40)}", found ${count(h, from)}`); h = h.split(from).join(to); };
  sw(">Thank you.</h1>", ">You’re subscribed.</h1>");
  sw("Your request has reached us. A member of our team will read it and reply within one business day to suggest times for a discovery call.", "Thank you. The Kwontified Briefing will reach your inbox once a month.");
  sw("On the call we ask about your channels, your goals and your constraints. Afterwards we send a short written note on where we see the growth and what it would take. Nothing more is needed from you now.", "Each issue covers the marketplace changes that matter, what they mean for your brand and our latest guides. Your first may be a few weeks away, so our three newest articles are below.");
  sw("If something changes before we speak, write to ", "Every issue comes from newsletter@kwontified.com and has a one-click unsubscribe link. Add the address to your contacts so the briefing reaches your inbox. If an issue does not arrive, check your spam folder or write to ");
  // questions about the briefing go to the address it is sent from
  sw('<a href="mailto:contact@kwontified.com" style="color: #F8F6F1">contact@kwontified.com</a>', '<a href="mailto:newsletter@kwontified.com" style="color: #F8F6F1">newsletter@kwontified.com</a>');
  // buttons: read now, or see the work
  const one = (re, fn, what) => { let k = 0; h = h.replace(re, (...a) => { k++; return fn(...a); }); if (k !== 1) fail(`confirmation template: ${what} matched ${k} times`); };
  one(/href="\/work"([^>]*>)See our work<\/a>/g, (_, x) => `href="/perspectives"${x}Browse Perspectives</a>`, "first button");
  one(/href="\/"([^>]*>)Back to the homepage<\/a>/g, (_, x) => `href="/work"${x}See our case studies</a>`, "second link");
  // the three newest articles replace the fixed cards (site-archive.mjs refreshes them)
  sw(">Recent work and thinking</h2>", ">The latest from Perspectives</h2>");
  one(/(<h2 id="related-title"[^>]*>[^<]*<\/h2><div[^>]*>)[\s\S]*?(<\/div><\/div><\/section>\s*<\/main>)/g, (_, a, b) => a + latestCards(P["perspectives.html"]) + b, "cards");
  // the visitor has just signed up, so the footer does not ask again
  one(/(<h2[^>]*>)Get our marketplace briefing once a month\.(<\/h2>\s*<p[^>]*>)[^<]*(<\/p>)\s*<form data-kq-form="newsletter"[\s\S]*?<\/form>/g, (_, a, b, c) =>
    `${a}Want a first read on your own account?${b}Share your channels and goals. A member of our team will reply within one business day with a first read on where the growth is.${c}` +
    '<a class="kq-btn" href="/contact" style="align-self: flex-start; margin-top: 10px; display: inline-flex; align-items: center; min-height: 46px; padding: 0 22px; box-sizing: border-box; background: #DCBF85; color: #102A4C; font-size: 16px; font-weight: 500; text-decoration: none">Request a marketplace review</a>', "footer sign-up block");
  // double opt-in: the same page, worded for someone who still has to confirm by email
  sw("</section>\n<section", `</section><script>/* confirm by email (double opt-in) */
(function(){if(!/[?&]confirm=1(&|$)/.test(location.search))return;var h=document.getElementById('page-title');if(!h)return;var ps=h.parentNode.querySelectorAll('p');if(ps.length<3||!ps[2].firstChild)return;
h.textContent='One step left.';ps[0].textContent='We have sent a confirmation email to the address you entered. Open it and select the link to start receiving the Kwontified Briefing.';
ps[2].firstChild.nodeValue='The email comes from newsletter@kwontified.com. If it has not arrived in a few minutes, check your spam folder or write to ';
document.title='Confirm your subscription | Kwontified';})();</script>\n<section`);
  if (!/<meta name="robots"/.test(h)) h = h.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex">');
  if (/data-kq-form="newsletter"/.test(h)) fail("confirmation page still has a sign-up form");
  addPage("/subscribe/thank-you", h, "ThankYou.html layout (site-content)");
  // the newsletter form opens the confirmation page once the sign-up is saved
  let n = 0;
  for (const f of Object.keys(P)) P[f] = P[f].replace(/var p=document\.createElement\('p'\);p\.setAttribute\('role','status'\);[\s\S]*?f\.replaceWith\(p\);/, () => { n++; return "return r.json().catch(function(){return {};}).then(function(j){location.assign('/subscribe/thank-you'+(j&&j.confirm?'?confirm=1':''));});"; });
  if (n < 90) fail(`newsletter form hook found on only ${n} pages`);
}

// ---- 3. press releases ------------------------------------------------------------------
const MOVED = {};
for (const [oldSlug, slug, oldTitle, title, oldLead, lead] of [
  ["kwontifieds-elaine-kwon-jordan-taylor-corey-brown-and-priyanka-shah", "kwontified-to-attend-amazon-ads-unboxed-2026-in-san-francisco",
    "Kwontified’s Elaine Kwon, Jordan Taylor, Corey Brown and Priyanka Shah to attend Amazon Ads unBoxed 2026 in San Francisco", "Kwontified to attend Amazon Ads unBoxed 2026 in San Francisco",
    "managing partners Elaine Kwon and Jordan Taylor, Vice President of Growth Corey Brown and Vice President of Commercial and Retail Media Priyanka Shah will attend", "managing partners Elaine Kwon and Jordan Taylor will attend"],
  ["kwontifieds-jordan-taylor-corey-brown-and-dennis-wong-to-attend", "kwontified-to-attend-amazon-accelerate-2026-in-seattle",
    "Kwontified’s Jordan Taylor, Corey Brown and Dennis Wong to attend Amazon Accelerate 2026 in Seattle", "Kwontified to attend Amazon Accelerate 2026 in Seattle",
    "managing partner Jordan Taylor, Vice President of Growth Corey Brown and Senior Account Manager Dennis Wong will attend", "managing partner Jordan Taylor will attend"],
]) {
  const from = `perspectives--press-releases--${oldSlug}.html`, to = `perspectives--press-releases--${slug}.html`;
  const a = `/perspectives/press-releases/${oldSlug}`, b = `/perspectives/press-releases/${slug}`;
  if (!P[from]) fail(`${from} not found`);
  if (!P[from].includes(oldLead)) fail(`${from}: opening sentence not found`);
  P[to] = P[from].replace(/Kwontified’s [^<…]*…/g, title.slice(0, 40).replace(/\s\S*$/, "") + "…"); delete P[from];
  MOVED[a] = b;
  for (const f of Object.keys(P)) P[f] = P[f].split(oldTitle).join(title).split(oldLead).join(lead).split(a).join(b);
}
// the press materials block held placeholder links only; it comes back with the press kit
{
  let n = 0;
  for (const f of Object.keys(P)) P[f] = P[f].replace(/<div[^>]*><p[^>]*>Press materials<\/p><p[^>]*>[\s\S]*?<\/p><\/div>/g, () => { n++; return ""; });
  if (n < 2) fail(`expected a press materials block on every press release, found ${n}`);
}
for (const [f, h] of Object.entries(P)) if (/Corey Brown|Priyanka|Dennis Wong|\[Logo files\]/.test(h)) fail(`${f}: a removed name or press kit link is still on the page`);

// ---- 4. one agile omni-channel strategy --------------------------------------------------
const COPY = {
  "index.html": [
    ["One team owns the plan and the work.", "One team, one agile omni-channel strategy."],
    ["We run all of it as one plan, reviewed against one P&amp;L.", "We build a specific strategy for each channel and marketplace, then connect them in one agile omni-channel strategy, reviewed against one P&amp;L."],
    ["One plan, with sales, margin, advertising and inventory targets you approve.", "One agile omni-channel strategy, with sales, margin, advertising and inventory targets you approve for each channel."],
    ["business reviews against that plan.", "business reviews against that strategy."],
    ["Every channel you sell in, under one plan.", "Every channel you sell in, in one agile omni-channel strategy."],
    ["We manage every marketplace as one business. Spend moves between channels on measured return, catalog work is done once and adapted, and reporting shows the whole P&amp;L in one view.", "Each channel and marketplace gets its own strategy, built for how its shoppers search and buy. Those strategies connect in one agile omni-channel strategy that also accounts for your stores and your brand website. Budgets move between channels only with your approval, and reporting shows the whole P&amp;L in one view."],
    ["Six capabilities under one plan: retail media and advertising, creative, marketplace operations, analytics and forecasting, agentic commerce, and revenue recovery on Amazon. You approve one set of sales, margin, advertising and inventory targets.", "Six capabilities within one agile omni-channel strategy: retail media and advertising, creative, marketplace operations, analytics and forecasting, agentic commerce, and revenue recovery on Amazon. You approve the sales, margin, advertising and inventory targets for each channel."],
    ["Here one named team owns the plan and the work, so budget moves between channels on measured return and catalog work is done once and adapted for each platform.", "Here one named team builds a strategy for each channel and connects them, so advertising, creative and inventory decisions on one channel account for the others, and catalog work is done once and adapted for each platform. Budgets move between channels only with your approval."],
    ["business reviews against the plan you approved.", "business reviews against the strategy you approved."],
  ],
  "channels.html": [
    ["One budget, allocated by marginal return.", "Channel strategies, connected in one agile omni-channel strategy."],
    ["Because one team sees every channel, we put the next advertising dollar where it earns most, do catalog and content work once and adapt it per platform, and report total performance across every channel.", "Because one team sees every channel, each channel’s strategy accounts for the others. We do catalog and content work once and adapt it per platform, show you where the next advertising dollar would earn most, and report total performance across every channel. Budgets move between channels only with your approval."],
    [">One plan</text>", ">One strategy</text>"],
    ["By marginal return. Because one team sees every channel, we put the next advertising dollar where it earns most each month and report total performance across every channel, not channel by channel.", "With your approval. Each channel has its own budget inside one agile omni-channel strategy. Because one team sees every channel, we show you each month where the next advertising dollar would earn most and recommend any change. No budget moves between channels or marketplaces until you approve it."],
  ],
  "about.html": [
    ["to a single plan to close that gap.", "to one agile omni-channel strategy to close that gap."],
    ["to one plan for sales, margin, advertising and inventory that you approve.", "to one agile omni-channel strategy for sales, margin, advertising and inventory that you approve."],
  ],
  "capabilities.html": [["All six share one plan, one data set and one account lead,", "All six work inside one agile omni-channel strategy, with one data set and one account lead,"]],
  "channels--amazon.html": [["One team owns the plan, the daily work and the results,", "One team owns the Amazon strategy, the daily work and the results,"]],
  "channels--instagram-shop.html": [["We run posts, Stories, Reels, creators and Meta advertising to one plan.", "We run posts, Stories, Reels, creators and Meta advertising to one strategy."]],
  "channels--international.html": [["Each market is run day to day, with consolidated reporting and budgets that move between markets on measured return.", "Each market is run day to day to its own strategy, with consolidated reporting. Budgets move between markets only with your approval."],
    ["Budgets move between markets on measured return, as they do between channels.", "Budgets move between markets only with your approval, as they do between channels."],
    ["with consolidated reporting and budgets that move between markets on measured return.", "with consolidated reporting. Budgets move between markets only with your approval."],
  ],
  "capabilities--retail-media.html": [
    ["reported on one page, so budget can move between them.", "reported on one page, so you can see where a budget change would pay and approve it before anything moves."],
    ["and budget moves between channels on measured return.", "and we recommend budget changes between channels on measured return, for your approval."],
    ["and move money between channels when the next dollar earns more elsewhere.", "and recommend moving money between channels when the next dollar earns more elsewhere. Nothing moves between channels without your approval."],
    ["then move money to whichever channel returns more on the next dollar.", "then recommend moving money to whichever channel returns more on the next dollar. You approve any move between channels."],
  ],
  "channels--tiktok-shop.html": [
    ["the creator program and the ads as one plan.", "the creator program and the ads as one strategy."],
    ["content and ads run as one plan.", "content and ads run as one strategy."],
  ],
  "channels--walmart.html": [
    ["and budgets move to what returns most.", "so budget can go to the ad type that returns most. We recommend the change for your approval, or make it ourselves if you prefer us to manage budget flexibly."],
    ["Walmart is reported beside your other channels, so budget and stock move to where they earn the most.", "Walmart has its own strategy and is reported beside your other channels, so you can see where budget and stock would earn the most and approve any move."],
  ],
  "why-kwontified.html": [
    ["What does one plan cover?", "What does the omni-channel strategy cover?"],
    ["Sales, margin, advertising and inventory targets that you approve, across every marketplace you sell in. Retail media, creative, marketplace operations, analytics and forecasting, agentic commerce and revenue recovery all work to that plan.", "A strategy for each channel and marketplace, with sales, margin, advertising and inventory targets that you approve, connected across your marketplaces, your stores and your brand website. Retail media, creative, marketplace operations, analytics and forecasting, agentic commerce and revenue recovery all work to that strategy."],
  ],
};
for (const [f, pairs] of Object.entries(COPY)) for (const [from, to] of pairs) swap(f, from, to);

// the explainer: two FAQ entries (page and structured data) and a section on Why Kwontified
const FAQ = [
  ["What is an agile omni-channel strategy?", "It is one strategy that connects every place your customers shop: marketplaces and other e-commerce channels, brick-and-mortar stores and your brand website. Each channel and marketplace has its own strategy, built for how its shoppers search and buy, and each one is planned with the others in view. We review it against live sales, inventory and advertising data every week and adjust it as conditions change."],
  ["How is that different from a multi-channel strategy?", "A traditional multi-channel strategy runs each channel on its own budget and calendar, usually set once a year. An agile omni-channel strategy plans the channels together and keeps adjusting, so pricing, promotions, inventory and advertising on one channel support the others instead of competing with them. Budgets still belong to each channel: we recommend changes, and nothing moves between channels or marketplaces without your approval."],
];
function addFaq(f, after, FAQ) {
  const item = P[f].match(new RegExp(`<details[^>]*><summary[^>]*>${reEsc(after)}</summary><p[^>]*>[\\s\\S]*?</p></details>`)) || fail(`${f}: FAQ entry "${after}" not found`);
  const make = ([q, a]) => item[0].replace(/(<summary[^>]*>)[\s\S]*?(<\/summary>)/, (_, x, y) => x + q + y).replace(/(<\/summary><p[^>]*>)[\s\S]*?(<\/p><\/details>)/, (_, x, y) => x + a + y);
  P[f] = P[f].replace(item[0], () => item[0] + FAQ.map(make).join(""));
  const q = new RegExp(`\\{"@type": "Question", "name": "${reEsc(ld(after))}", "acceptedAnswer": \\{"@type": "Answer", "text": "(?:[^"\\\\]|\\\\.)*"\\}\\}`);
  const hit = P[f].match(q) || fail(`${f}: structured data for "${after}" not found`);
  P[f] = P[f].replace(hit[0], () => hit[0] + FAQ.map(([x, y]) => `, {"@type": "Question", "name": ${ld(JSON.stringify(x))}, "acceptedAnswer": {"@type": "Answer", "text": ${ld(JSON.stringify(y))}}}`).join(""));
}
const AD_TYPES = [["Can you move budget between ad types without asking us?", "That is your choice. If you set strict budgets by ad type, we recommend a reallocation when we see an opportunity and wait for your approval. If you prefer a more flexible approach, we move budget between ad types as circumstances change, guided by your advertising and sales objectives. Either way, budgets move between channels or marketplaces only with your approval."]];
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const [f, after, FAQ] of [["capabilities--retail-media.html", "How do you decide how much to spend on each channel?", AD_TYPES]]) addFaq(f, after, FAQ);
for (const [f, after] of [["index.html", "How is this different from hiring separate agencies?"], ["channels.html", "How do you split budget across channels?"], ["why-kwontified.html", "What does the omni-channel strategy cover?"]]) addFaq(f, after, FAQ);
{
  const F = "why-kwontified.html";
  const a = P[F].indexOf('<section aria-labelledby="approach-title"'), b = P[F].indexOf("</section>", a) + 10;
  if (a < 0) fail("Why Kwontified: section to model the explainer on not found");
  let s = P[F].slice(a, b);
  const one = (re, fn) => { let k = 0; s = s.replace(re, (...x) => { k++; return fn(...x); }); if (k !== 1) fail(`explainer: ${k} of ${re}`); };
  s = s.split("approach-title").join("omni-title");
  one(/(<h2 id="omni-title"[^>]*>)[^<]*/g, (_, x) => x + "One agile omni-channel strategy");
  one(/(<img[^>]*?src=")[^"]*(" alt=")[^"]*/g, (_, x, y) => x + "/assets/931ce73e9a6c.jpg" + y + "A laptop showing sales by channel, with a tablet and a phone each showing the same shampoo in a different store and the bottle standing beside them");
  one(/(<p[^>]*>)We find the cause before we choose the fix\.[\s\S]*?(<\/p>)/g, (_, x, y) => x + "A traditional multi-channel plan sets each channel’s budget and calendar once a year and runs each one on its own, so a promotion on one channel can undercut a price on another, or advertising can outrun the stock behind it. We work differently. Each channel and marketplace gets a strategy built for how its shoppers search and buy, and each of those strategies is part of one omni-channel strategy that also covers your stores and your brand website. It is agile because we review it against live sales, inventory and advertising data every week and adjust it when a channel changes. It stays yours: no budget moves between channels or marketplaces without your approval. Within a channel we work the way you prefer. If you set budgets by ad type, we recommend reallocations for your approval, and if you prefer a flexible approach, we move budget between ad types as conditions and your objectives require." + y);
  one(/(<p[^>]*>)A clear diagnosis, a recommendation with the numbers behind it[^<]*(<\/p>)/g, (_, x, y) => x + "A strategy for each channel, one view of how they work together, and a recommendation you approve before any budget moves." + y);
  P[F] = P[F].slice(0, b) + s + P[F].slice(b);
}

// ---- write --------------------------------------------------------------------------------
for (const f of fs.readdirSync(KQ)) if (f.endsWith(".html") && !P[f]) fs.rmSync(path.join(KQ, f));
for (const [f, h] of Object.entries(P)) fs.writeFileSync(path.join(KQ, f), h);
const routesFile = path.join(ROOT, "site-routes.json");
let routes = JSON.parse(fs.readFileSync(routesFile, "utf8")).map((r) => (MOVED[r.route] ? { ...r, route: MOVED[r.route], file: "/_kq/" + MOVED[r.route].slice(1).replace(/\//g, "--") + ".html" } : r));
routes = routes.filter((r) => !newRoutes.some((n) => n.route === r.route)).concat(newRoutes).sort((a, b) => a.route.localeCompare(b.route));
fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2) + "\n");
{
  const llms = path.join(ROOT, "public/llms.txt");
  let t = fs.readFileSync(llms, "utf8");
  for (const [a, b] of Object.entries(MOVED)) t = t.split(a).join(b);
  fs.writeFileSync(llms, t.replace(/Kwontified’s [^\]]*? to attend (Amazon [^\]]*)\]/g, "Kwontified to attend $1]").replace(/: Kwontified’s [^\n]*? to attend (Amazon [^\n]*)/g, ": Kwontified to attend $1"));
  if (/Corey Brown|Priyanka/.test(fs.readFileSync(llms, "utf8"))) fail("llms.txt still names a removed person");
}
const known = new Set(routes.map((r) => r.route));
const bad = [];
for (const r of routes) for (const m of fs.readFileSync(path.join(ROOT, "public", r.file), "utf8").matchAll(/href=\\?"(\/[a-z0-9\-/]*)(#[^"\\]*)?\\?"/g))
  if (!m[1].startsWith("/assets/") && !m[1].startsWith("/api/") && !known.has(m[1])) bad.push(`${r.route}: link to unknown route ${m[1]}`);
if (bad.length) fail([...new Set(bad)].slice(0, 20).join("\n"));
console.log(`site-content: ${newRoutes.length} new pages, ${Object.keys(MOVED).length} press releases renamed, ${Object.values(COPY).flat().length} copy changes, ${routes.length} routes`);
