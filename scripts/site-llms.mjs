// llms.txt, the Perspectives feed, and the final checks on every page's metadata.
// The LAST step of the site build (after site-capchan.mjs --check), so it reads the pages
// exactly as they will be served.
//
//   1. public/llms.txt: an index of the site for AI answer engines (https://llmstxt.org).
//      A short summary and checked facts first, then every indexable English page: core pages
//      in groups (company, capabilities, channels, work, Perspectives, policies), then the
//      archive under "## Optional", newest first. Each line is the page's own title and its
//      served meta description; the step fails if any line differs from the page, or if an
//      indexable page is missing. Each fact must still be shown on the page named beside it.
//      No company figures (team size, brands served, revenue managed) belong here.
//   2. public/feed.xml: RSS 2.0 with the 50 newest Perspectives pieces (linked from every
//      Perspectives page by site-seo.mjs).
//   3. Checks on every built page, English and translated:
//        - every JSON-LD block parses, and each node has the properties its type needs
//          (schema.org, and Google's required properties for the rich results it supports);
//        - Kwontified is one Organization (@id https://kwontified.com/#organization) everywhere,
//          and each founder one Person @id;
//        - no JobPosting without a real posting date, none past its validThrough;
//        - every breadcrumb and @id on kwontified.com points at a page that exists;
//        - English titles 30-65 characters and descriptions 70-160, unique among indexable pages.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public/_kq");
const SITE = "https://kwontified.com";
const ORG_ID = `${SITE}/#organization`;
const FOUNDERS = { "Elaine Kwon": "/about/leadership/elaine-kwon", "Jordan Taylor": "/about/leadership/jordan-taylor" };
const problems = [];
const bad = (m) => problems.push(m);
const fail = (m) => { console.error(`site-llms: ${m}`); process.exit(1); };

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", nbsp: " ", hellip: "…" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m));
const strip = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const visible = (h) => strip(h.replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/g, " ").replace(/<head\b[\s\S]*?<\/head>/, " "));
const meta = (h, attr, name) => { const m = h.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || h.match(new RegExp(`<meta content="([^"]*)" ${attr}="${name}"`)); return m ? decode(m[1]) : ""; };
const titleOf = (h) => decode((h.match(/<title>([\s\S]*?)<\/title>/) || ["", ""])[1]).trim();
const noindexed = (h) => /<meta name="robots" content="[^"]*noindex/.test(h);
const url = (route) => SITE + (route === "/" ? "" : route);

const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const i18n = fs.existsSync(path.join(ROOT, "site-i18n-routes.json")) ? JSON.parse(fs.readFileSync(path.join(ROOT, "site-i18n-routes.json"), "utf8")) : [];
const known = new Set([...routes.map((r) => r.route), ...i18n.map((t) => t.route)]);
const page = new Map(routes.map((r) => [r.route, fs.readFileSync(path.join(ROOT, "public", r.file), "utf8")]));
const today = new Date().toISOString().slice(0, 10); // only to reject expired postings; never written anywhere

// ---------------------------------------------------------------- 3. checks on every page
const LD = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
const typesOf = (o) => [].concat(o["@type"] || []);
const has = (o, k) => o[k] !== undefined && o[k] !== "" && !(Array.isArray(o[k]) && !o[k].length);
const routeOfUrl = (u) => { if (typeof u !== "string" || !u.startsWith(SITE)) return null; const p = u.slice(SITE.length).split("#")[0].replace(/\/$/, ""); return p || "/"; };
const validDate = (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}([T ][\d:.+\-Z]+)?$/.test(d) && !isNaN(Date.parse(d));
const counts = { files: 0, blocks: 0, nodes: 0, types: {} };
const personIds = {};

function checkPage(file, h, where) {
  counts.files++;
  const blocks = [];
  for (const m of h.matchAll(LD)) {
    counts.blocks++;
    try { blocks.push(JSON.parse(m[1])); } catch (e) { bad(`${where}: JSON-LD does not parse (${e.message})`); }
  }
  // every node, and the named nodes of this page by @id (for references)
  const all = [], byId = new Map();
  const walk = (o, top) => {
    if (Array.isArray(o)) return o.forEach((x) => walk(x, top));
    if (!o || typeof o !== "object") return;
    all.push({ o, top });
    if (o["@id"] && Object.keys(o).length > 1) byId.set(o["@id"], { ...(byId.get(o["@id"]) || {}), ...o });
    for (const [k, v] of Object.entries(o)) if (k !== "@context") walk(v, false);
  };
  for (const b of blocks) walk(Array.isArray(b) ? b : b["@graph"] || [b], true);
  const deref = (o) => (o && o["@id"] && byId.has(o["@id"]) ? { ...byId.get(o["@id"]), ...o } : o);
  const need = (o, t, keys) => { const miss = keys.filter((k) => !has(o, k)); if (miss.length) bad(`${where}: ${t} without ${miss.join(", ")}`); };

  for (const { o, top } of all) {
    counts.nodes++;
    for (const t of typesOf(o)) counts.types[t] = (counts.types[t] || 0) + 1;
    const t = typesOf(o).join("/");
    if (o["@id"]) { const r = routeOfUrl(o["@id"]); if (r && !known.has(r)) bad(`${where}: @id ${o["@id"]} is not a page on the site`); }
    if (/Organization/.test(t) && !/CollegeOrUniversity|EducationalOrganization/.test(t)) {
      if (!o["@id"]) bad(`${where}: anonymous Organization ${JSON.stringify(o).slice(0, 80)}`);
      else if (o["@id"] !== ORG_ID && (o.name === "Kwontified" || o.url === SITE)) bad(`${where}: Kwontified under a second @id ${o["@id"]}`);
      if (top) need(o, "Organization", ["name", "url", "logo", "legalName", "description"]);
    }
    if (t === "Person") {
      need(o, "Person", ["name"]);
      if (FOUNDERS[o.name] && o["@id"] !== `${SITE}${FOUNDERS[o.name]}#person`) bad(`${where}: ${o.name} without the Person @id ${SITE}${FOUNDERS[o.name]}#person`);
      if (o["@id"]) (personIds[o.name] ||= new Set()).add(o["@id"]);
    }
    if (t === "WebSite") need(o, t, ["name", "url"]);
    if (/(^|\/)(WebPage|AboutPage|ContactPage|CollectionPage|ProfilePage)$/.test(t)) need(o, t, ["name", "url"]);
    if (t === "ProfilePage" && !(o.mainEntity && deref(o.mainEntity).name)) bad(`${where}: ProfilePage without mainEntity.name`);
    if (/^(Article|BlogPosting|NewsArticle)$/.test(t)) {
      need(o, t, ["headline", "datePublished", "image", "author", "publisher"]);
      if (o.headline && o.headline.length > 110) bad(`${where}: ${t} headline over 110 characters`);
      if (o.datePublished && !validDate(o.datePublished)) bad(`${where}: ${t} datePublished "${o.datePublished}" is not a date`);
      if (![].concat(o.author || []).map(deref).every((a) => a && a.name)) bad(`${where}: ${t} author without a name`);
    }
    if (t === "BreadcrumbList") {
      const L = o.itemListElement || [];
      if (!L.length) bad(`${where}: BreadcrumbList is empty`);
      L.forEach((li, i) => {
        if (li.position !== i + 1) bad(`${where}: BreadcrumbList position ${li.position} at ${i + 1}`);
        if (!li.name) bad(`${where}: BreadcrumbList item ${i + 1} has no name`);
        const it = typeof li.item === "string" ? li.item : li.item && li.item["@id"];
        if (!it && i < L.length - 1) bad(`${where}: BreadcrumbList item ${i + 1} has no address`);
        if (it && it.startsWith(SITE) && !known.has(routeOfUrl(it))) bad(`${where}: breadcrumb ${it} is not a page on the site`);
      });
    }
    if (t === "FAQPage") {
      const Q = [].concat(o.mainEntity || []);
      if (!Q.length) bad(`${where}: FAQPage without questions`);
      Q.forEach((q, i) => { if (!q.name || !q.acceptedAnswer || !q.acceptedAnswer.text) bad(`${where}: FAQ question ${i + 1} without name or answer`); });
    }
    if (t === "Service" && top) need(o, t, ["name", "provider", "serviceType"]);
    if (t === "CreativeWork") need(o, t, ["name", "url", "publisher"]);
    if (t === "ItemList") { const L = o.itemListElement || []; if (!L.length || L.some((li, i) => li.position !== i + 1 || !li.item)) bad(`${where}: ItemList items need positions 1..n and an item`); }
    if (t === "JobPosting") {
      // Google's required properties, plus the owner rule: a real posting date only
      need(o, t, ["title", "description", "datePosted", "hiringOrganization"]);
      if (!o.jobLocation && !(o.jobLocationType === "TELECOMMUTE" && o.applicantLocationRequirements)) bad(`${where}: JobPosting needs jobLocation, or TELECOMMUTE with applicantLocationRequirements`);
      if (o.datePosted && (!validDate(o.datePosted) || o.datePosted.slice(0, 10) > today)) bad(`${where}: JobPosting datePosted "${o.datePosted}" is not a real past date`);
      if (o.validThrough && (!validDate(o.validThrough) || o.validThrough.slice(0, 10) < today)) bad(`${where}: JobPosting expired on ${o.validThrough}; remove the role or its dates in site-seo.mjs JOBS`);
      if ((o.hiringOrganization || {})["@id"] !== ORG_ID) bad(`${where}: JobPosting hiringOrganization is not ${ORG_ID}`);
    }
  }
  return all;
}

const htmlFiles = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
const routeOfFile = new Map([...routes.map((r) => [path.basename(r.file), r.route]), ...i18n.map((t) => [path.basename(t.file), t.route])]);
const graphOf = new Map();
for (const f of htmlFiles) graphOf.set(f, checkPage(f, fs.readFileSync(path.join(DIR, f), "utf8"), routeOfFile.get(f) || f));
for (const [name, ids] of Object.entries(personIds)) if (FOUNDERS[name] && ids.size !== 1) bad(`${name} appears under ${ids.size} Person @ids`);

// news and press releases sit under their section page once it exists
for (const [hub, re] of [["/perspectives/news", /^\/perspectives\/news\/./], ["/perspectives/press-releases", /^\/perspectives\/press-releases\/./]]) {
  if (!known.has(hub)) continue;
  const miss = routes.filter((r) => re.test(r.route)).filter((r) => !graphOf.get(path.basename(r.file)).some(({ o }) => o["@type"] === "BreadcrumbList" && o.itemListElement.some((li) => li.item === url(hub))));
  if (miss.length) bad(`${miss.length} pages under ${hub} leave it out of their BreadcrumbList (site-seo.mjs adds it when site-routes.json lists ${hub} at step 13; register the section pages before site-seo runs)`);
}

// English titles and descriptions
const indexable = routes.filter((r) => !noindexed(page.get(r.route)));
const seenT = new Map(), seenD = new Map();
for (const r of routes) {
  const h = page.get(r.route), t = titleOf(h), d = meta(h, "name", "description");
  if (t.length < 30 || t.length > 65) bad(`${r.route}: title is ${t.length} characters (30-65): "${t}"`);
  if (d.length < 70 || d.length > 160) bad(`${r.route}: description is ${d.length} characters (70-160)`);
  if (indexable.includes(r)) { if (seenT.has(t)) bad(`${r.route}: same title as ${seenT.get(t)}`); seenT.set(t, r.route); if (seenD.has(d)) bad(`${r.route}: same description as ${seenD.get(d)}`); seenD.set(d, r.route); }
}
for (const f of ["404.html", "403.html"]) if (fs.existsSync(path.join(DIR, f))) { const t = titleOf(fs.readFileSync(path.join(DIR, f), "utf8")); if (t.length < 30 || t.length > 65) bad(`${f}: title is ${t.length} characters (30-65): "${t}"`); }

// ---------------------------------------------------------------- 1. llms.txt
const text = new Map();
const shown = (route) => { if (!text.has(route)) text.set(route, visible(page.get(route) || fail(`expected the page ${route}`))); return text.get(route); };
const nameOf = (h) => (meta(h, "property", "og:title") || titleOf(h)).replace(/\s*\|\s*Kwontified$/, "").trim();
// Facts, each with the page that must still show it. Keep figures about the company out.
const FACTS = [
  ["Kwontified (Kwontified LLC) is an agency that manages online marketplaces for consumer brands: its team runs each client’s marketplace accounts, with reporting in a client portal.",
    [["/about", "Kwontified manages online marketplaces for consumer brands"], ["/about", "An agency."], ["/", "Kwontified LLC"]]],
  ["Founded in 2016. Headquarters: Atlanta, Georgia (7000 Central Parkway, Suite 1100, Atlanta, GA 30328). Offices: New York (175 Greenwich Street, 38th Floor, New York, NY 10007) and Seattle (1201 Third Avenue, Suite 2200, Seattle, WA 98101).",
    [["/about", "Kwontified was founded in 2016"], ["/about", "7000 Central Parkway, Suite 1100"], ["/about", "175 Greenwich Street, 38th Floor"], ["/about", "1201 Third Avenue, Suite 2200"]]],
  ["Leadership: Elaine Kwon and Jordan Taylor, Co-Founders and Managing Partners (profiles: https://kwontified.com/about/leadership/elaine-kwon and https://kwontified.com/about/leadership/jordan-taylor).",
    [["/about/leadership", "Elaine Kwon"], ["/about/leadership", "Jordan Taylor"], ["/about/leadership", "Co-Founder and Managing Partner"]]],
  ["Amazon Ads Partner and a member of the Amazon Service Provider Network (SPN).",
    [["/about", "Kwontified is an Amazon Ads Partner and a member of the Amazon Service Provider Network (SPN)"]]],
  ["Capabilities: Retail Media and Advertising, Creative Studio, Marketplace Operations, Analytics and Forecasting, Agentic Commerce, and Revenue Recovery on Amazon.",
    ["Retail Media and Advertising", "Creative Studio", "Marketplace Operations", "Analytics and Forecasting", "Agentic Commerce", "Revenue Recovery"].map((c) => ["/capabilities", c])],
  ["Channels: eight channels: six marketplaces (Amazon, Walmart, Target Plus, Zalando, Mercado Libre and Temu) and two social commerce channels (TikTok Shop and Instagram Shop), each with its own page.",
    [["/channels", "Amazon"], ["/channels", "Walmart"], ["/channels", "Target Plus"], ["/channels", "Zalando"], ["/channels", "Mercado Libre"], ["/channels", "Temu"], ["/channels", "TikTok"], ["/channels", "Instagram"]]],
  ["Contact: contact@kwontified.com or 404.873.9148. Marketplace review requests: https://kwontified.com/contact.",
    [["/", "contact@kwontified.com"], ["/", "404.873.9148"]]],
];
for (const [line, checks] of FACTS) for (const [route, s] of checks) if (!shown(route).includes(s)) bad(`llms.txt fact "${line.slice(0, 50)}…" no longer matches ${route} (expected "${s}")`);

const GROUPS = [
  ["Company", (r) => /^\/(about(\/.*)?|why-kwontified|contact)$/.test(r) || r === "/"],
  ["Capabilities", (r) => /^\/capabilities(\/|$)/.test(r)],
  ["Channels", (r) => /^\/channels(\/|$)/.test(r)],
  ["Work", (r) => /^\/work(\/|$)/.test(r)],
  ["Perspectives", (r) => /^\/perspectives(\/(news|press-releases|\d{4}))?$/.test(r)],
  ["Policies", (r) => /^\/(accessibility|privacy|terms)$/.test(r)],
  ["Optional", (r) => /^\/perspectives\/./.test(r)],
];
const esc = (s) => s.replace(/([[\]])/g, "\\$1");
const line = (route) => { const h = page.get(route); return `- [${esc(route === "/" ? "Kwontified" : nameOf(h))}](${url(route)}): ${meta(h, "name", "description")}`; };
const homeDesc = meta(page.get("/"), "name", "description");
let out = `# Kwontified\n\n> ${homeDesc}\n\n${FACTS.map(([l]) => `- ${l}`).join("\n")}\n`;
const placed = new Set();
const published = (route) => meta(page.get(route), "property", "article:published_time");
for (const [name, test] of GROUPS) {
  let items = indexable.map((r) => r.route).filter((r) => !placed.has(r) && test(r));
  if (name === "Optional") items.sort((a, b) => (published(b) || "").localeCompare(published(a) || "") || a.localeCompare(b));
  if (!items.length) continue;
  out += `\n## ${name}\n`;
  for (const r of items) { placed.add(r); out += line(r) + "\n"; }
}
for (const r of indexable) if (!placed.has(r.route)) bad(`llms.txt: ${r.route} fits no group; add it to GROUPS in site-llms.mjs`);
// the check the step promises: every listed description is the served one, every indexable page is listed
const listed = new Map([...out.matchAll(/^- \[(?:[^\]\\]|\\.)*\]\((https:\/\/kwontified\.com[^)]*)\): (.*)$/gm)].map((m) => [routeOfUrl(m[1]), m[2]]));
for (const r of indexable) {
  if (!listed.has(r.route)) bad(`llms.txt does not list ${r.route}`);
  else if (listed.get(r.route) !== meta(page.get(r.route), "name", "description")) bad(`llms.txt description for ${r.route} differs from the page`);
}
for (const r of listed.keys()) if (!indexable.some((x) => x.route === r)) bad(`llms.txt lists ${r}, which is not an indexable page`);
if (/\beight marketplaces\b/i.test(out)) bad('llms.txt says "eight marketplaces"; the owner\'s wording is "eight channels: six marketplaces and two social commerce channels"');

// ---------------------------------------------------------------- 2. feed.xml
const xml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const rfc822 = (d) => new Date(d.slice(0, 10) + "T00:00:00Z").toUTCString().replace("GMT", "+0000");
const pieces = indexable.map((r) => r.route).filter((r) => /^\/perspectives\/./.test(r) && published(r))
  .sort((a, b) => published(b).localeCompare(published(a)) || a.localeCompare(b)).slice(0, 50);
if (!pieces.length) bad("feed.xml: no dated Perspectives pieces");
const ph = page.get("/perspectives");
let feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n<channel>\n` +
  `<title>Kwontified Perspectives</title>\n<link>${url("/perspectives")}</link>\n<description>${xml(meta(ph, "name", "description"))}</description>\n<language>en-us</language>\n` +
  `<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>\n<pubDate>${rfc822(published(pieces[0]))}</pubDate>\n`;
for (const r of pieces) {
  const h = page.get(r), by = meta(h, "property", "article:author");
  feed += `<item><title>${xml(nameOf(h))}</title><link>${url(r)}</link><guid isPermaLink="true">${url(r)}</guid><pubDate>${rfc822(published(r))}</pubDate>${by ? `<dc:creator>${xml(by)}</dc:creator>` : ""}<description>${xml(meta(h, "name", "description"))}</description></item>\n`;
}
feed += "</channel>\n</rss>\n";

if (problems.length) fail(`${problems.length} problem${problems.length === 1 ? "" : "s"}:\n  · ${problems.slice(0, 40).join("\n  · ")}${problems.length > 40 ? `\n  · … and ${problems.length - 40} more` : ""}`);
fs.writeFileSync(path.join(ROOT, "public/llms.txt"), out);
fs.writeFileSync(path.join(ROOT, "public/feed.xml"), feed);
const top = Object.entries(counts.types).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t, n]) => `${t} ${n}`).join(", ");
console.log(`site-llms: llms.txt lists ${listed.size} pages (${listed.size - [...listed.keys()].filter((r) => /^\/perspectives\/./.test(r) && !/^\/perspectives\/(news|press-releases|\d{4})$/.test(r)).length} core, the archive under Optional; ${FACTS.length} facts checked against the pages), every description matches its page | feed.xml: ${pieces.length} newest pieces | JSON-LD: ${counts.blocks} blocks on ${counts.files} pages parse and pass (${top}); one Organization @id, one Person @id per founder, ${counts.types.JobPosting || 0} job postings | titles and descriptions within length on ${routes.length} English pages`);
