// Search and AI-answer metadata for every built page (SEO and GEO).
//
// Runs after every step that writes page content (build-site, site-fixes, site-content,
// site-archive, site-errors, site-contact, site-about, site-capchan, site-channel-content,
// site-filters, site-home, site-charts), on the files in public/_kq, and before site-images.
// Everything it writes is taken from what the page already shows (title, description,
// canonical, byline, date, hero image, the facts lists), so the structured data always
// matches the visible page.
//
//   1. JSON-LD on every page, linked by @id:
//        - one Organization, https://kwontified.com/#organization. Its full node (legal name,
//          description, logo, the three offices, founders) is written on the home page and on
//          About; every other mention of Kwontified (Service providers, article publishers,
//          WebPage.about) points at it by @id. No page carries an anonymous Kwontified node.
//        - one Person per founder, https://kwontified.com/about/leadership/<name>#person: the
//          full node on the profile page, references from the home page's founder list, from
//          every article's author and from the leadership page's ItemList.
//        - articles: BlogPosting; news and press releases: NewsArticle
//        - capability and channel pages: their Service gets an @id, a serviceType and the
//          Organization as provider
//        - case studies: a CreativeWork (the case study) about the capability and channel
//          Services it names, with the engagement period where the page states one
//        - job pages: JobPosting ONLY when the role has a real posting date in JOBS below.
//          Until the owner supplies the dates the job pages carry WebPage and BreadcrumbList only.
//        - every other page: WebPage; every page but home: BreadcrumbList
//   2. Articles with their own hero image use it as the share image (og:image, twitter:image).
//   3. Titles: a few titles are rewritten from SHORT_TITLES (core pages under 30 characters,
//      headlines over 65); " | Kwontified" is added when it fits and dropped when it would push
//      the <title> past 60 characters. og:title keeps the full headline. The step fails if a
//      title ends up shorter than 30 or longer than 65 characters.
//   4. Perspectives pages link the RSS feed (/feed.xml, written by site-llms.mjs).
//   5. site-lastmod.json, read by app/sitemap.ts: the publication date of each dated page, and
//      for the other pages the date of the last commit to the files their content comes from
//      (never the build date; a page whose history git cannot show gets no date).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const SITE = "https://kwontified.com";
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const LOGO = `${SITE}/brand/icon-192.png`;
const TITLE_MIN = 30, TITLE_MAX = 60, TITLE_HARD_MAX = 65;
const SUFFIX = " | Kwontified";
const LEGAL_NAME = "Kwontified LLC";
const TELEPHONE = { ld: "+1-404-873-9148", shown: "404.873.9148" };
// the offices as the About page lists them (checked against the page below)
const OFFICES = [
  { name: "Atlanta (headquarters)", street: "7000 Central Parkway, Suite 1100", city: "Atlanta", region: "GA", postal: "30328" },
  { name: "New York", street: "175 Greenwich Street, 38th Floor", city: "New York", region: "NY", postal: "10007" },
  { name: "Seattle", street: "1201 Third Avenue, Suite 2200", city: "Seattle", region: "WA", postal: "98101" },
];
const postal = (o) => ({ "@type": "PostalAddress", streetAddress: o.street, addressLocality: o.city, addressRegion: o.region, postalCode: o.postal, addressCountry: "US" });
const place = (o) => ({ "@type": "Place", name: `Kwontified ${o.name}`, address: postal(o) });

const MIT_AI = { "@type": "EducationalOccupationalCredential", name: "Applied Agentic AI for Organizational Transformation", credentialCategory: "certificate", recognizedBy: { "@type": "CollegeOrUniversity", name: "MIT Professional Education" } };
const PEOPLE = {
  // facts as the profile pages show them (site-src/pages/AuthorJordan.html, Author.html)
  "Jordan Taylor": {
    url: `${SITE}/about/leadership/jordan-taylor`, sameAs: "https://www.linkedin.com/in/jordanhtaylor/", image: `${SITE}/assets/leadership-jordan-taylor.jpg`,
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Cornell University" }, { "@type": "CollegeOrUniversity", name: "University of Notre Dame" }],
    hasCredential: [{ "@type": "EducationalOccupationalCredential", name: "Bachelor of Arts", credentialCategory: "degree", recognizedBy: { "@type": "CollegeOrUniversity", name: "Cornell University" } }, { "@type": "EducationalOccupationalCredential", name: "Juris Doctor", credentialCategory: "degree", recognizedBy: { "@type": "CollegeOrUniversity", name: "University of Notre Dame" } }, MIT_AI],
    knowsAbout: ["Retail media", "Amazon Ads", "Marketplace analytics", "Business intelligence", "Artificial intelligence in retail", "Agentic commerce"],
  },
  "Elaine Kwon": {
    url: `${SITE}/about/leadership/elaine-kwon`, sameAs: "https://www.linkedin.com/in/elainekwon/", image: `${SITE}/assets/leadership-elaine-kwon.jpg`,
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "University of Pennsylvania" }],
    hasCredential: [{ "@type": "EducationalOccupationalCredential", name: "Bachelor of Arts", credentialCategory: "degree", recognizedBy: { "@type": "CollegeOrUniversity", name: "University of Pennsylvania" } }, MIT_AI],
    knowsAbout: ["Marketplace management", "E-commerce operations", "Amazon", "Luxury fashion e-commerce", "Agentic commerce"],
  },
};
for (const p of Object.values(PEOPLE)) p.id = `${p.url}#person`;

// Job postings. OWNER ITEM: a JobPosting needs the date the role was really posted (and,
// if the role closes, the last day to apply). Put them here as "YYYY-MM-DD"; a role without a
// datePosted carries no JobPosting. Never use the build date. Remove the role (or its dates)
// when it closes: site-llms.mjs fails the build on a posting whose validThrough has passed.
const JOBS = {
  "/about/careers/advertising-analyst": { datePosted: null, validThrough: null },
  "/about/careers/advertising-manager": { datePosted: null, validThrough: null },
  "/about/careers/marketplace-account-analyst": { datePosted: null, validThrough: null },
  "/about/careers/marketplace-account-manager": { datePosted: null, validThrough: null },
  "/about/careers/senior-marketplace-account-manager": { datePosted: null, validThrough: null },
};
// remote applicants: the country they must live in (owner to confirm with the dates)
const JOB_APPLICANT_COUNTRY = "US";

// Where a channel page states the markets it covers (each name must appear on the page).
const AREA = {
  "/channels/mercado-libre": ["Brazil", "Mexico", "Argentina", "Colombia", "Chile"],
};

// Case study facts: the Work filter keys used in their "Capabilities" list, and the channel
// pages their "Channel" names point to.
const CAPABILITY_PAGE = { retail: "/capabilities/retail-media", creative: "/capabilities/creative-studio", ops: "/capabilities/marketplace-operations", analytics: "/capabilities/analytics-forecasting", ai: "/capabilities/agentic-commerce", recovery: "/capabilities/revenue-recovery" };
const CHANNEL_PAGE = [[/Zalando/, "/channels/zalando"], [/Mercado Libre/, "/channels/mercado-libre"], [/TikTok/, "/channels/tiktok-shop"], [/Instagram/, "/channels/instagram-shop"], [/Temu/, "/channels/temu"], [/Target/, "/channels/target-plus"], [/Walmart/, "/channels/walmart"], [/Amazon/, "/channels/amazon"]];

// Titles. Keys are the page's current title without " | Kwontified" (the headline for
// articles); values are the <title> to use. A key that no longer matches any page is listed in
// the step's output and skipped (the page's own title stays, and the length check still applies).
const SHORT_TITLES = {
  // core pages under 30 characters
  "Careers at Kwontified": "Careers at Kwontified | Marketplace Management Jobs",
  "Leadership": "Leadership | The Team That Runs Kwontified",
  "Accessibility": "Accessibility Statement | Kwontified",
  "Client Sign-In": "Client Sign-In | Kwontified Client Portal",
  "Thank You": "Thank You for Your Request | Kwontified",
  "Privacy Policy": "Privacy Policy | How Kwontified Uses Your Data",
  "Terms of Use": "Website Terms of Use | Kwontified",
  "Why Brands Choose Kwontified": "Why Brands Choose Kwontified | One Team, Every Channel",
  "Creative Gallery": "Creative Gallery | Marketplace Creative by Kwontified",
  "Page not found": "Page Not Found (404) | Kwontified",
  // case studies over 65 characters (WS5's casePage title rule supersedes these when merged)
  "Instagram-referred revenue up 45% after rebuilding its catalog and tags.": "Instagram-referred revenue up 45% after a catalog rebuild",
  "Margin nearly doubled by choosing listing types product by product.": "Margin nearly doubled by choosing listing types per product",
  // articles, news and press releases whose headline is over 65 characters
  "Amazon dynamic bidding up and down overpays on your own brand’s searches": "Amazon dynamic bidding overpays on your own brand searches",
  "Amazon’s 2019 fee changes move every product’s advertising ceiling": "Amazon’s 2019 fee changes move your advertising ceiling",
  "Amazon home and kitchen in 2018 sells the sofa without the showroom": "Amazon home in 2018 sells the sofa without the showroom",
  "Shoppers trust the Amazon Prime badge because Amazon keeps the promise": "Why shoppers trust the Amazon Prime badge",
  "Mercado Libre earns buyer trust by owning the payment and the parcel": "Mercado Libre earns trust by owning payment and parcel",
  "Amazon Accelerate 2020: Brand Follow, repeat-purchase data and $100 million to promote small sellers": "Accelerate 2020: Brand Follow and $100M for small sellers",
  "Amazon Accelerate 2022: email for brands and new ways to test listings": "Amazon Accelerate 2022: brand email and listing tests",
  "Amazon bars sellers from using FedEx Ground for Prime orders through the holidays": "Amazon bars FedEx Ground for Prime orders over the holidays",
  "Amazon confirms its October Prime event: Prime Early Access Sale, October 11–12": "Amazon confirms Prime Early Access Sale for October 11–12",
  "Amazon cuts referral fees on low-priced items and raises most FBA fees, effective February 19": "Amazon cuts low-price referral fees, raises most FBA fees",
  "Amazon details 2024 fee changes, including a low-inventory-level fee": "Amazon details 2024 fees, including a low-inventory fee",
  "Amazon halts weekly orders to smaller vendors and points them to Seller Central": "Amazon halts weekly orders to smaller vendors",
  "Amazon held its first ad conference for brands, AdCon 2019, in Seattle": "Amazon held its first brand ad conference, AdCon 2019",
  "Amazon introduces Rufus, a generative AI shopping assistant, in beta": "Amazon introduces Rufus, an AI shopping assistant, in beta",
  "Amazon launches Project Zero, letting brands remove counterfeit listings themselves": "Amazon’s Project Zero lets brands remove counterfeits",
  "Amazon limits FBA inbound shipments to household staples, medical supplies and other high-demand products until April 5": "Amazon limits FBA inbound to essentials until April 5",
  "Amazon opens registration for Accelerate 2021, its virtual seller conference on October 20 and 21": "Amazon Accelerate 2021 registration opens: October 20–21",
  "Amazon opens registration for Accelerate 2022, its seller conference": "Amazon opens registration for Accelerate 2022",
  "Amazon raises clothing and handbag referral fees as FBA fees rise on February 22": "Amazon raises clothing and handbag fees as FBA fees rise",
  "Amazon raises FBA fees about 3% and cuts some referral fees, effective February 18": "Amazon raises FBA fees about 3%, cuts some referral fees",
  "Amazon raises the US Prime fee and reports advertising revenue as its own line": "Amazon raises US Prime fee and reports ad revenue separately",
  "Amazon releases a local MCP package for Selling Partner API developers": "Amazon releases a local MCP package for SP-API developers",
  "Amazon sets Black Friday Deals Week for November 20 to 27, weeks after Walmart and Target opened theirs": "Amazon sets Black Friday Deals Week for November 20 to 27",
  "Amazon sets Black Friday Deals Week for November 22 to 29, with Cyber Monday deals on December 2": "Amazon sets Black Friday Deals Week for November 22 to 29",
  "Amazon sets Black Friday Week and Cyber Monday for November 20 to December 1": "Amazon sets Black Friday Week for November 20 to December 1",
  "Amazon sets Prime Big Deal Days for October 6–7, and Target matches the dates": "Amazon sets Prime Big Deal Days for October 6–7",
  "Amazon sets Prime Day 2018 for July 16, a 36-hour event in 17 countries": "Amazon sets Prime Day 2018 for July 16, a 36-hour event",
  "Amazon sets Prime Day 2019 for July 15 and 16, its first 48-hour event": "Amazon sets Prime Day 2019 for July 15 and 16",
  "Amazon sets Prime Day 2020 for October 13-14, with a $10 credit for buying from small businesses first": "Amazon sets Prime Day 2020 for October 13-14",
  "Amazon sets Prime Day 2025 for July 8 to 11, its first four-day event": "Amazon sets Prime Day 2025 for July 8 to 11",
  "Amazon starts its Black Friday deals on November 16, a week before Black Friday": "Amazon starts its Black Friday deals on November 16",
  "Amazon unifies AMS, AMG and AAP as Amazon Advertising; Headline Search Ads become Sponsored Brands": "AMS, AMG and AAP become Amazon Advertising",
  "Amazon will let more non-essential products into FBA this week, in capped quantities": "Amazon lets more non-essential products into FBA, capped",
  "Amazon’s first-quarter sales rise 44% as it moves Prime Day into the second quarter": "Amazon Q1 sales up 44% as Prime Day moves into Q2",
  "Amazon’s second AdCon ran online and steered brands toward streaming TV and video ads": "Amazon’s second AdCon steers brands toward streaming TV",
  "Andy Jassy becomes Amazon’s chief executive as Jeff Bezos moves to executive chair": "Andy Jassy becomes Amazon’s chief executive",
  "Cyber Week 2019 early read: Thanksgiving and Black Friday set online records but land just under Adobe’s forecast": "Cyber Week 2019 early read: records, just under forecast",
  "De minimis duty-free treatment ends for all countries on August 29": "De minimis duty-free treatment ends for all countries",
  "Duty-free treatment ends for low-value goods from China and Hong Kong": "Duty-free ends for low-value goods from China and Hong Kong",
  "Early read: Black Friday 2021 online sales slip as the season spreads out": "Early read: Black Friday 2021 online sales slip",
  "Early read, Cyber Week 2018: Black Friday online sales rose 23.6% to $6.22 billion (preliminary)": "Cyber Week 2018 early read: Black Friday up 23.6% online",
  "Early read: Cyber Week 2020 sets online records on Thanksgiving and Black Friday, below Adobe’s October forecast (preliminary)": "Early read: Cyber Week 2020 sets online records",
  "Early read: Cyber Week 2022 from public sources, labeled preliminary": "Early read: Cyber Week 2022 from public sources",
  "Early read: Cyber Week 2024 online sales rose 8%, led by Black Friday": "Early read: Cyber Week 2024 online sales rose 8%",
  "Early read on Prime Day 2022: shoppers spent more per order, and hunted for value": "Prime Day 2022 early read: bigger orders, more value hunting",
  "Early read: Prime Big Deal Days 2024 set an October record, details thin": "Early read: Prime Big Deal Days 2024 set an October record",
  "Early read: Prime Day 2020 ends with panel data only and Amazon’s tally still to come (preliminary)": "Early read: Prime Day 2020 ends with panel data only",
  "Early read: Prime Day 2021 set a record for third-party sellers, with no total disclosed": "Early read: Prime Day 2021 record for third-party sellers",
  "Early read: Prime Day 2024 drew $14.2 billion online, preliminary data shows": "Early read: Prime Day 2024 drew $14.2 billion online",
  "Early read: Prime Early Access Sale 2022, from public sources (preliminary)": "Early read: Prime Early Access Sale 2022",
  "Facebook launches Shops, one free storefront across Facebook and Instagram": "Facebook launches Shops for Facebook and Instagram",
  "GDPR takes effect across the EU, with fines up to 4% of global turnover": "GDPR takes effect, with fines up to 4% of global turnover",
  "Google delays the end of third-party cookies in Chrome to late 2023": "Google delays Chrome’s cookie phase-out to late 2023",
  "Google launches Shopping Actions, a shared cart for retailers across Search and Assistant": "Google launches Shopping Actions, a shared retail cart",
  "INFORM Consumers Act signed into law; marketplace seller rules take effect in June 2023": "INFORM Consumers Act signed; seller rules start June 2023",
  "Instagram adds shopping to Stories, starting with Adidas, Aritzia and Louis Vuitton": "Instagram adds shopping to Stories",
  "Instagram launches Checkout, letting US shoppers buy from 20-plus brands in the app": "Instagram launches Checkout with 20-plus brands",
  "Instagram opens a Shop in Explore, with in-app checkout through Facebook Pay": "Instagram opens a Shop in Explore with in-app checkout",
  "Instagram opens shoppable posts to businesses in eight more countries": "Instagram opens shoppable posts in eight more countries",
  "Jeff Bezos to hand Amazon’s CEO role to Andy Jassy in the third quarter": "Jeff Bezos to hand Amazon’s CEO role to Andy Jassy",
  "OpenAI adds Instant Checkout to ChatGPT and opens its commerce protocol": "OpenAI adds Instant Checkout to ChatGPT",
  "OpenAI releases ChatGPT, a conversational AI model, as a free preview": "OpenAI releases ChatGPT as a free preview",
  "Prime Day 2018, early read: sales ran ahead of 2017 after a broken first hour": "Prime Day 2018 early read: sales ran ahead of 2017",
  "Supreme Court lets states require out-of-state online sellers to collect sales tax": "Supreme Court lets states make online sellers collect tax",
  "Temu runs its first Super Bowl ad, five months after launching in the U.S.": "Temu runs its first Super Bowl ad",
  "US 15% tariffs on $112 billion of Chinese imports, including most clothing, take effect": "15% US tariffs on $112B of Chinese imports take effect",
  "US announces broad new tariffs on imports from nearly every country": "US announces broad new tariffs on nearly every country",
  "Walmart Connect sets 2024 plans: auction display, self-serve access, new advertisers": "Walmart Connect 2024 plans: auction display and self-serve",
  "Walmart launches Walmart+ on September 15: free same-day delivery from stores for $98 a year": "Walmart launches Walmart+ on September 15 at $98 a year",
  "Walmart opens its marketplace to Shopify merchants and expects 1,200 to join this year": "Walmart opens its marketplace to Shopify merchants",
  "Walmart partners with OpenAI to sell through ChatGPT Instant Checkout": "Walmart partners with OpenAI on ChatGPT Instant Checkout",
  "Walmart renames its ad business Walmart Connect and plans a DSP with The Trade Desk": "Walmart renames its ad business Walmart Connect",
  "Kwontified launches Perspectives and the Kwontified Briefing newsletter": "Kwontified launches Perspectives and the Kwontified Briefing",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Accelerate 2023 in Seattle": "Kwontified to attend Amazon Accelerate 2023 in Seattle",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Accelerate 2024 in Seattle": "Kwontified to attend Amazon Accelerate 2024 in Seattle",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Accelerate 2025 in Seattle": "Kwontified to attend Amazon Accelerate 2025 in Seattle",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Ads unBoxed 2023 in New York": "Kwontified to attend Amazon Ads unBoxed 2023 in New York",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Ads unBoxed 2024 in Austin": "Kwontified to attend Amazon Ads unBoxed 2024 in Austin",
  "Kwontified managing partners Elaine Kwon and Jordan Taylor to attend Amazon Ads unBoxed 2025 in Nashville": "Kwontified to attend Amazon Ads unBoxed 2025 in Nashville",
  "Kwontified partners Elaine Kwon and Jordan Taylor to attend NRF 2018: Retail’s Big Show": "Kwontified to attend NRF 2018: Retail’s Big Show",
};

// The files a core page's content comes from, beyond its own source page (site-routes.json
// "source"): the steps that rewrite that page's content. Shared steps that only change the
// header, footer, scripts or metadata are not content and are left out.
const CONTENT_SCRIPTS = [
  [/^\/$/, ["site-home.mjs"]],
  [/^\/(about|why-kwontified|about\/careers)$/, ["site-about.mjs"]],
  [/^\/contact(\/|$)/, ["site-contact.mjs"]],
  [/^\/(capabilities|channels)(\/|$)/, ["site-capchan.mjs", "site-channel-content.mjs"]],
  [/^\/work$/, ["site-filters.mjs", "site-fixes.mjs"]],
  [/^\/work\/creative$/, ["site-filters.mjs"]],
  [/^\/work\/(?!creative$)/, ["site-fixes.mjs", "site-capchan.mjs", "site-filters.mjs"]],
];
// Section pages news and press releases sit under, once a later step builds them (they
// become the middle level of the BreadcrumbList when site-routes.json lists them).
const HUBS = { news: ["/perspectives/news", "News"], "press-releases": ["/perspectives/press-releases", "Press releases"] };
const FEED = '<link rel="alternate" type="application/rss+xml" title="Kwontified Perspectives" href="/feed.xml">';

const fail = (m) => { console.error(`site-seo: ${m}`); process.exit(1); };
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const byRoute = new Map(routes.map((r) => [r.route, r]));
const fileOf = (r) => path.join(ROOT, "public", r.file);

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", nbsp: " ", hellip: "…" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m);
const escText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const visible = (h) => strip(h.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/g, " ").replace(/<head\b[\s\S]*?<\/head>/, " "));
const meta = (h, attr, name) => {
  const m = h.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || h.match(new RegExp(`<meta content="([^"]*)" ${attr}="${name}"`));
  return m ? decode(m[1]) : "";
};
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const parseLd = (body, where) => { try { return JSON.parse(body); } catch { fail(`${where}: invalid JSON-LD already in the page`); } };
const existingTypes = (h, where) =>
  [...h.matchAll(LD)].flatMap((m) => { const d = parseLd(m[1], where); return (Array.isArray(d) ? d : d["@graph"] || [d]).map((x) => x["@type"]); });
const facts = (h) => { const out = {}; for (const m of h.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/g)) out[strip(m[1])] = { html: m[2], text: strip(m[2]) }; return out; };
const titleOf = (h) => decode((h.match(/<title>([\s\S]*?)<\/title>/) || ["", ""])[1]);
const isKwontifiedOrg = (o) => o && typeof o === "object" && [].concat(o["@type"] || []).includes("Organization") && (o.name === "Kwontified" || o.url === SITE || o["@id"] === ORG_ID);

// ---- read every page once
const pages = new Map();
for (const r of routes) {
  const h = fs.readFileSync(fileOf(r), "utf8");
  const h1 = h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  pages.set(r.route, { h, name: h1 ? strip(h1[1]) : titleOf(h).replace(/\s*\|\s*Kwontified$/, "") });
}
const crumbName = (route) => (route === "/" ? "Home" : route === "/perspectives" ? "Perspectives" : pages.get(route).name);
const need = (route) => pages.get(route) || fail(`expected the page ${route}`);

// ---- the founders: role as their profile pages show it
for (const [name, p] of Object.entries(PEOPLE)) {
  const route = p.url.slice(SITE.length), h = need(route).h;
  if (need(route).name !== name) fail(`${route}: expected the heading "${name}", found "${need(route).name}"`);
  p.role = strip((h.match(/<h1\b[^>]*>[\s\S]*?<\/h1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/) || ["", ""])[1]);
  if (!p.role) fail(`${route}: no job title under the heading`);
}
const personRef = (name) => { const p = PEOPLE[name]; return { "@type": "Person", "@id": p.id, name, url: p.url, jobTitle: p.role }; };

// ---- the Organization: one full node, checked against what the pages show
const home = need("/"), about = need("/about");
const homeOrg = [...home.h.matchAll(LD)].map((m) => parseLd(m[1], "/")).find((d) => isKwontifiedOrg(d));
if (!homeOrg) fail("the home page has no Organization JSON-LD to complete");
const aboutText = visible(about.h);
for (const o of OFFICES) for (const s of [o.street, `${o.city}, ${o.region} ${o.postal}`]) if (!aboutText.includes(s)) fail(`/about no longer shows the office line "${s}"; update OFFICES`);
if (!home.h.includes(LEGAL_NAME)) fail(`the home page no longer shows "${LEGAL_NAME}"; update LEGAL_NAME`);
if (!visible(home.h).includes(TELEPHONE.shown)) fail(`the home page no longer shows ${TELEPHONE.shown}`);
const ORG_DESC = meta(about.h, "name", "description") || fail("/about has no meta description for the Organization");
const ORG = {
  "@type": "Organization", "@id": ORG_ID, name: "Kwontified", legalName: LEGAL_NAME, url: SITE,
  description: ORG_DESC,
  ...(homeOrg.foundingDate ? { foundingDate: homeOrg.foundingDate } : {}),
  ...(homeOrg.email ? { email: homeOrg.email } : {}),
  telephone: TELEPHONE.ld,
  logo: { "@type": "ImageObject", url: LOGO, width: 192, height: 192 },
  address: postal(OFFICES[0]),
  location: OFFICES.map(place),
  founder: Object.keys(PEOPLE).map(personRef),
  ...(homeOrg.sameAs ? { sameAs: homeOrg.sameAs } : {}),
};

// ---- Services on capability and channel pages: their names, for references from case studies
const serviceName = new Map();
for (const r of routes) if (/^\/(capabilities|channels)\/./.test(r.route)) {
  for (const m of pages.get(r.route).h.matchAll(LD)) { const d = parseLd(m[1], r.route); if (d["@type"] === "Service" && d.name) serviceName.set(r.route, d.name); }
}
const serviceRef = (route) => { if (!byRoute.has(route)) fail(`no page ${route} for a case study fact`); return { "@type": "Service", "@id": `${SITE}${route}#service`, name: serviceName.get(route) || pages.get(route).name }; };

// Existing JSON-LD on a page: Kwontified is always the one Organization; a Service gets its @id.
function fixLd(d, route, url) {
  if (isKwontifiedOrg(d) && !d["@graph"]) return { "@context": "https://schema.org", ...ORG };
  const walk = (o) => {
    if (Array.isArray(o)) return o.map(walk);
    if (!o || typeof o !== "object") return o;
    if (isKwontifiedOrg(o)) return o["@id"] === ORG_ID && Object.keys(o).length <= 4 ? o : { "@id": ORG_ID };
    const out = {};
    for (const [k, v] of Object.entries(o)) out[k] = walk(v);
    return out;
  };
  const out = walk(d);
  if (out["@type"] === "Service") {
    Object.assign(out, { "@id": `${url}#service`, url, serviceType: out.serviceType || out.name, provider: { "@id": ORG_ID } });
    if (AREA[route]) {
      const text = visible(pages.get(route).h);
      for (const a of AREA[route]) if (!text.includes(a)) fail(`${route}: AREA names ${a}, which the page does not show`);
      out.areaServed = AREA[route].map((name) => ({ "@type": "Country", name }));
    }
  }
  return out;
}

// JobPosting from the visible "At a glance" list and the role sections. Only with a real date.
function jobPosting(route, h, url, name, description) {
  const job = JOBS[route];
  if (!job || !job.datePosted) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(job.datePosted) || (job.validThrough && !/^\d{4}-\d{2}-\d{2}$/.test(job.validThrough))) fail(`${route}: posting dates must be YYYY-MM-DD`);
  const f = facts(h);
  const loc = (f.Location || {}).text || fail(`${route}: no Location in At a glance`);
  const type = (f["Employment type"] || {}).text || fail(`${route}: no Employment type in At a glance`);
  const TYPES = { "Full-time": "FULL_TIME", "Part-time": "PART_TIME", Contract: "CONTRACTOR", Temporary: "TEMPORARY", Internship: "INTERN" };
  if (!TYPES[type]) fail(`${route}: employment type "${type}" has no JobPosting value`);
  // the role, as the page describes it: from the first role section to the application block
  const a = h.search(/<h2\b[^>]*id="s-[^"]*"/), b = h.search(/<h2\b[^>]*>\s*Apply for /);
  if (a < 0 || b < a) fail(`${route}: cannot find the role sections`);
  const body = h.slice(a, b).replace(/<(script|style|svg|img|picture|figure|button)\b[\s\S]*?(<\/\1>|>)/g, "")
    .replace(/<(\/?)(h2|h3|p|ul|ol|li|strong|em|b|br)\b[^>]*>/g, "\u0000$1$2\u0001").replace(/<[^>]*>/g, "")
    .replace(/\u0000/g, "<").replace(/\u0001/g, ">").replace(/\s+/g, " ").trim();
  const years = ((f.Experience || {}).text || "").match(/^(\d+)\+? years?/);
  return {
    "@type": "JobPosting", "@id": `${url}#job`, title: name, description: body.length > 200 ? body : description,
    datePosted: job.datePosted, ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: TYPES[type],
    hiringOrganization: { "@type": "Organization", "@id": ORG_ID, name: "Kwontified", sameAs: SITE, logo: LOGO },
    ...(/Atlanta/.test(loc) ? { jobLocation: { "@type": "Place", address: postal(OFFICES[0]) } } : {}),
    ...(/Remote/i.test(loc) ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: JOB_APPLICANT_COUNTRY } } : {}),
    ...(years ? { experienceRequirements: { "@type": "OccupationalExperienceRequirements", monthsOfExperience: +years[1] * 12 } } : {}),
    directApply: false,
    url,
  };
}

// Case study: the facts list under the heading ("Channel", "Engagement", "Capabilities").
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function caseStudy(route, h, url, name, description) {
  const f = facts(h);
  if (!f.Channel && !f.Capabilities) return null;
  const about = [];
  for (const m of ((f.Capabilities || {}).html || "").matchAll(/href="\/work#capability=([a-z-]+)"/g)) {
    if (!CAPABILITY_PAGE[m[1]]) fail(`${route}: capability key "${m[1]}" has no capability page in CAPABILITY_PAGE`);
    about.push(serviceRef(CAPABILITY_PAGE[m[1]]));
  }
  for (const part of ((f.Channel || {}).text || "").split(/,| and /)) {
    const hit = CHANNEL_PAGE.find(([re]) => re.test(part));
    if (hit && !about.some((x) => x["@id"] === `${SITE}${hit[1]}#service`)) about.push(serviceRef(hit[1]));
  }
  const period = ((f.Engagement || {}).text || "").match(/^([A-Z][a-z]+) (\d{4}) to ([A-Z][a-z]+) (\d{4})$/);
  const ym = (mo, y) => `${y}-${String(MONTHS.indexOf(mo) + 1).padStart(2, "0")}`;
  const img = (h.slice(h.indexOf("</dl>")).match(/<img\b[^>]*\ssrc="(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/) || [])[1];
  return {
    "@type": "CreativeWork", "@id": `${url}#case-study`, genre: "Case study", name, headline: name.length > 110 ? name.slice(0, 109) + "…" : name, description, url,
    ...(img ? { image: SITE + img } : {}),
    ...(about.length ? { about } : {}),
    ...(period && MONTHS.includes(period[1]) && MONTHS.includes(period[3]) ? { temporalCoverage: `${ym(period[1], period[2])}/${ym(period[3], period[4])}` } : {}),
    creator: { "@id": ORG_ID }, publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": url }, inLanguage: "en-US",
  };
}

// ---- titles
const usedTitles = new Set();
function retitle(h, where) {
  const title = titleOf(h), base = title.replace(/\s*\|\s*Kwontified$/, "");
  let next = title;
  if (SHORT_TITLES[base] !== undefined) {
    usedTitles.add(base);
    const t = SHORT_TITLES[base];
    next = /Kwontified/.test(t) || (t + SUFFIX).length > TITLE_MAX ? t : t + SUFFIX;
  } else if (title.length > TITLE_MAX && title.endsWith(SUFFIX)) next = title.slice(0, -SUFFIX.length);
  if (next.length < TITLE_MIN || next.length > TITLE_HARD_MAX) fail(`${where}: title "${next}" is ${next.length} characters (keep it ${TITLE_MIN}-${TITLE_HARD_MAX}); add it to SHORT_TITLES`);
  return { h: next === title ? h : h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escText(next)}</title>`), changed: next !== title };
}

// ---- dates for the sitemap
let gitOk = true, shallow = new Set();
const git = (args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
try {
  if (git(["rev-parse", "--is-shallow-repository"]) === "true") { const f = git(["rev-parse", "--git-path", "shallow"]); shallow = new Set(fs.readFileSync(path.resolve(ROOT, f), "utf8").split(/\s+/).filter(Boolean)); }
} catch { gitOk = false; }
const lastCommit = (files) => {
  if (!gitOk) return null;
  try {
    const out = git(["log", "-1", "--format=%cs %H", "--", ...files]);
    if (!out) return null;
    const [date, hash] = out.split(" ");
    // in a shallow clone the oldest commit fetched looks as if it added every file: unknown
    return shallow.has(hash) ? null : date;
  } catch { return null; }
};
function contentFiles(r) {
  const out = new Set();
  for (const m of String(r.source || "").matchAll(/([A-Za-z0-9]+\.html)/g)) if (fs.existsSync(path.join(ROOT, "site-src/pages", m[1]))) out.add(`site-src/pages/${m[1]}`);
  for (const m of String(r.source || "").matchAll(/\((site-[a-z-]+)\)/g)) out.add(`scripts/${m[1]}.mjs`);
  for (const [re, list] of CONTENT_SCRIPTS) if (re.test(r.route)) for (const s of list) out.add(`scripts/${s}`);
  return [...out];
}

const lastmod = {};
const counts = { ld: 0, shareImg: 0, titles: 0, jobs: 0, cases: 0, feed: 0, core: 0 };

for (const r of routes) {
  const page = pages.get(r.route);
  let h = page.h;
  const url = SITE + (r.route === "/" ? "" : r.route);
  const title = titleOf(h);
  const headline = title.replace(/\s*\|\s*Kwontified$/, "");
  const description = meta(h, "name", "description");
  const published = meta(h, "property", "article:published_time");
  const author = meta(h, "property", "article:author");
  const isArticle = meta(h, "property", "og:type") === "article";
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(h);

  // the JSON-LD the page already has: one Organization, Services with an @id
  h = h.replace(LD, (all, body) => {
    const d = parseLd(body, r.route), fixed = fixLd(d, r.route, url);
    return JSON.stringify(fixed) === JSON.stringify(d) ? all : ld(fixed);
  });
  const have = existingTypes(h, r.route);
  const graph = [];

  // hero image, when the page has one of its own
  const hero = h.match(/<img\b[^>]*data-art="img"[^>]*>/) || h.match(/<img\b[^>]*class="kq-art-hero"[^>]*>/);
  const heroSrc = hero && (hero[0].match(/\ssrc="([^"]*)"/) || [])[1];
  const heroAlt = hero && decode((hero[0].match(/\salt="([^"]*)"/) || ["", ""])[1]);
  const ownImage = heroSrc && /\.(jpe?g|png|webp)$/i.test(heroSrc) ? SITE + (heroSrc.startsWith("/") ? heroSrc : "/" + heroSrc) : null;
  let mainEntity = null, pageType = "WebPage";

  if (r.route === "/") {
    if (!have.includes("WebSite")) graph.push({ "@type": "WebSite", "@id": SITE_ID, url: SITE, name: "Kwontified", publisher: { "@id": ORG_ID } });
  } else if (isArticle && published) {
    const news = /^\/perspectives\/(news|press-releases)\//.test(r.route);
    const person = PEOPLE[author];
    graph.push({
      "@type": news ? "NewsArticle" : "BlogPosting",
      "@id": `${url}#article`,
      headline: headline.length > 110 ? headline.slice(0, 109) + "…" : headline,
      description,
      datePublished: published,
      author: person ? { "@type": "Person", "@id": person.id, name: author, url: person.url, sameAs: [person.sameAs] } : { "@type": "Organization", "@id": ORG_ID, name: "Kwontified", url: SITE },
      publisher: { "@type": "Organization", "@id": ORG_ID, name: "Kwontified", logo: { "@type": "ImageObject", url: LOGO } },
      // its own picture, else the share image the page already declares (press releases have no hero)
      ...(ownImage || meta(h, "property", "og:image") ? { image: [ownImage || meta(h, "property", "og:image")] } : {}),
      mainEntityOfPage: { "@id": url },
      isPartOf: { "@id": SITE_ID },
      inLanguage: "en-US",
    });
    lastmod[r.route] = published;
  } else if (/^\/about\/leadership\/[^/]+$/.test(r.route)) {
    const name = page.name, p = PEOPLE[name];
    if (!p) fail(`${r.route}: "${name}" is not in PEOPLE`);
    if (!have.includes("ProfilePage"))
      graph.push({
        "@type": "ProfilePage", "@id": `${url}#page`, url, name: headline, description,
        mainEntity: { "@type": "Person", "@id": p.id, name, url: p.url, jobTitle: p.role, worksFor: { "@id": ORG_ID }, sameAs: [p.sameAs], image: p.image, alumniOf: p.alumniOf, hasCredential: p.hasCredential, knowsAbout: p.knowsAbout },
        isPartOf: { "@id": SITE_ID },
      });
  } else if (r.route === "/about/leadership") {
    const main = (h.match(/<main\b[\s\S]*<\/main>/) || [""])[0];
    const shown = [...new Set([...main.matchAll(/href="(\/about\/leadership\/[a-z-]+)"/g)].map((m) => m[1]))];
    const people = shown.map((route) => Object.keys(PEOPLE).find((n) => PEOPLE[n].url === SITE + route) || fail(`/about/leadership links ${route}, which is not in PEOPLE`));
    if (!people.length) fail("/about/leadership shows no profile");
    mainEntity = { "@type": "ItemList", "@id": `${url}#people`, name: "Leadership team", itemListElement: people.map((n, i) => ({ "@type": "ListItem", position: i + 1, item: personRef(n) })) };
  } else if (r.route === "/about") {
    pageType = "AboutPage";
    mainEntity = { "@id": ORG_ID };
  } else if (JOBS[r.route] !== undefined) {
    const job = jobPosting(r.route, h, url, page.name, description);
    if (job) { graph.push(job); counts.jobs++; }
  } else if (/^\/work\/./.test(r.route) && r.route !== "/work/creative") {
    const cs = caseStudy(r.route, h, url, page.name.replace(/\.$/, ""), description);
    if (cs) { graph.push(cs); mainEntity = { "@id": cs["@id"] }; counts.cases++; }
  }
  if (!graph.some((g) => /Article|Posting|ProfilePage|WebSite/.test(g["@type"])) && r.route !== "/" && !have.includes("WebPage"))
    graph.unshift({ "@type": pageType, "@id": `${url}#page`, url, name: headline, description, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID }, ...(mainEntity ? { mainEntity } : {}), inLanguage: "en-US" });

  // breadcrumbs: the trail the page itself shows (nav aria-label="Breadcrumb"), so the names match
  // what visitors see; labels without a link have no URL and are left out. Pages without a
  // visible trail get one built from the URL and the pages it passes through.
  if (r.route !== "/" && !have.includes("BreadcrumbList")) {
    let items = [];
    const nav = h.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/);
    if (nav) {
      for (const m of nav[1].matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) items.push([strip(m[2]), SITE + (m[1] === "/" ? "" : m[1])]);
      const cur = nav[1].match(/<span[^>]*aria-current="page"[^>]*>([\s\S]*?)<\/span>/);
      const curName = cur ? strip(cur[1]) : "";
      items.push([curName && !curName.endsWith("…") ? curName : headline, url]);
    } else {
      const trail = ["/"];
      const parts = r.route.split("/").filter(Boolean);
      for (let i = 1; i < parts.length; i++) { const a = "/" + parts.slice(0, i).join("/"); if (byRoute.has(a)) trail.push(a); }
      items = trail.map((a) => [crumbName(a), SITE + (a === "/" ? "" : a)]);
      const hub = HUBS[(r.route.match(/^\/perspectives\/(news|press-releases)\/./) || [])[1]];
      if (hub && byRoute.has(hub[0]) && !trail.includes(hub[0])) items.push([hub[1], SITE + hub[0]]);
      items.push([headline, url]);
    }
    graph.push({ "@type": "BreadcrumbList", itemListElement: items.map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) });
  }
  if (graph.length && !noindex) {
    h = h.replace(/<\/head>/, () => ld({ "@context": "https://schema.org", "@graph": graph }) + "</head>");
    counts.ld++;
  }

  // share image: the article's own picture
  if (isArticle && ownImage && /archive-|\/assets\/[0-9a-f]{12}\./.test(ownImage)) {
    const set = (re, v) => { h = h.replace(re, (_, a, b) => a + v + b); };
    set(/(<meta property="og:image" content=")[^"]*(")/, ownImage);
    set(/(<meta name="twitter:image" content=")[^"]*(")/, ownImage);
    const alt = heroAlt ? heroAlt.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;") : "";
    if (alt) { set(/(<meta property="og:image:alt" content=")[^"]*(")/, alt); set(/(<meta name="twitter:image:alt" content=")[^"]*(")/, alt); }
    // the archive images are 1400 wide; their height varies, so drop the fixed 1200x630 size
    h = h.replace(/<meta property="og:image:(width|height)" content="[^"]*">\s*/g, "");
    counts.shareImg++;
  }

  // the Perspectives feed
  if (/^\/perspectives(\/|$)/.test(r.route) && !h.includes('type="application/rss+xml"')) { h = h.replace("</head>", () => FEED + "</head>"); counts.feed++; }

  // title
  const t = retitle(h, r.route);
  h = t.h; if (t.changed) counts.titles++;

  // last content change of an undated page
  if (!lastmod[r.route] && r.route !== "/perspectives") {
    const files = contentFiles(r), d = files.length ? lastCommit(files) : null;
    if (d) { lastmod[r.route] = d; counts.core++; }
  }
  if (h !== page.h) fs.writeFileSync(fileOf(r), h);
}
// the index changes whenever a piece is published
const newest = Object.entries(lastmod).filter(([r]) => r.startsWith("/perspectives/")).map(([, d]) => d).sort().pop();
if (newest) { lastmod["/perspectives"] = newest; counts.core++; }

// error pages are not routes, but have titles too
for (const f of ["404.html", "403.html"]) {
  const file = path.join(ROOT, "public/_kq", f);
  if (!fs.existsSync(file)) continue;
  const h = fs.readFileSync(file, "utf8"), t = retitle(h, f);
  if (t.changed) { fs.writeFileSync(file, t.h); counts.titles++; }
}
const unused = Object.keys(SHORT_TITLES).filter((k) => !usedTitles.has(k));

fs.writeFileSync(path.join(ROOT, "site-lastmod.json"), JSON.stringify(lastmod));
console.log(`site-seo: JSON-LD on ${counts.ld} pages (one Organization, ${Object.keys(PEOPLE).length} founders by @id, ${counts.cases} case studies, ${counts.jobs} job postings${counts.jobs ? "" : ": none until the owner supplies posting dates"}), own share image on ${counts.shareImg}, ${counts.titles} titles rewritten or shortened, feed linked on ${counts.feed} pages, ${Object.keys(lastmod).length} pages dated (${counts.core} from their content's last commit${gitOk ? "" : "; git unavailable, core pages undated"})` + (unused.length ? `\n  · ${unused.length} SHORT_TITLES entr${unused.length === 1 ? "y matches" : "ies match"} no page any more (the page's own title is kept): ${unused.slice(0, 3).join(" / ")}${unused.length > 3 ? " …" : ""}` : ""));
