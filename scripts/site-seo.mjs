// Search and AI-answer metadata for every built page (SEO and GEO).
//
// Runs after build-site.mjs, site-fixes.mjs, site-content.mjs and site-archive.mjs, on
// the files in public/_kq, and before site-tags.mjs. Everything it writes is taken from
// what the page already shows (title, description, canonical, byline, date, hero image),
// so the structured data always matches the visible page.
//
//   1. JSON-LD on every page, linked by @id to one Organization:
//        - home: the existing Organization gains @id, logo, telephone and founders; a WebSite is added
//        - articles: BlogPosting (author = the named partner); news and press releases: NewsArticle
//        - leadership profiles: ProfilePage about a Person
//        - every other page: WebPage
//        - every page but home: BreadcrumbList built from the URL and the pages it passes through
//   2. Articles with their own hero image use it as the share image (og:image, twitter:image)
//      instead of the site-wide default.
//   3. Titles: " | Kwontified" is dropped when it would push the <title> past 60 characters,
//      the width Google shows before cutting a title off. og:title keeps the full form.
//   4. site-lastmod.json: the publication date of each dated page, read by app/sitemap.ts.
//
// Pages that already carry a JSON-LD type this step would add are left alone for that type.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://kwontified.com";
const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;
const LOGO = `${SITE}/brand/icon-192.png`;
const TITLE_MAX = 60;
const SUFFIX = " | Kwontified";
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

const fail = (m) => { console.error(`site-seo: ${m}`); process.exit(1); };
const routes = JSON.parse(fs.readFileSync(path.join(ROOT, "site-routes.json"), "utf8"));
const byRoute = new Map(routes.map((r) => [r.route, r]));
const fileOf = (r) => path.join(ROOT, "public", r.file);

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", nbsp: " ", hellip: "…" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENT[e.toLowerCase()] ?? m);
const strip = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const meta = (h, attr, name) => {
  const m = h.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`)) || h.match(new RegExp(`<meta content="([^"]*)" ${attr}="${name}"`));
  return m ? decode(m[1]) : "";
};
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;
const existingTypes = (h) =>
  [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try { const d = JSON.parse(m[1]); return (Array.isArray(d) ? d : d["@graph"] || [d]).map((x) => x["@type"]); } catch { fail(`invalid JSON-LD already in a page`); }
  });

// visible names for breadcrumbs: the page's H1
const pages = new Map();
for (const r of routes) {
  const h = fs.readFileSync(fileOf(r), "utf8");
  const h1 = h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  pages.set(r.route, { h, name: h1 ? strip(h1[1]) : strip((h.match(/<title>([\s\S]*?)<\/title>/) || ["", ""])[1]).replace(/\s*\|\s*Kwontified$/, "") });
}
const crumbName = (route) => (route === "/" ? "Home" : route === "/perspectives" ? "Perspectives" : pages.get(route).name);

const lastmod = {};
let counts = { ld: 0, shareImg: 0, titles: 0 };

for (const r of routes) {
  const page = pages.get(r.route);
  let h = page.h;
  const url = SITE + (r.route === "/" ? "" : r.route);
  const title = decode((h.match(/<title>([\s\S]*?)<\/title>/) || ["", ""])[1]);
  const headline = title.replace(/\s*\|\s*Kwontified$/, "");
  const description = meta(h, "name", "description");
  const published = meta(h, "property", "article:published_time");
  const author = meta(h, "property", "article:author");
  const isArticle = meta(h, "property", "og:type") === "article";
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(h);
  const have = existingTypes(h);
  const graph = [];

  // hero image, when the page has one of its own
  const hero = h.match(/<img\b[^>]*data-art="img"[^>]*>/) || h.match(/<img\b[^>]*class="kq-art-hero"[^>]*>/);
  const heroSrc = hero && (hero[0].match(/\ssrc="([^"]*)"/) || [])[1];
  const heroAlt = hero && decode((hero[0].match(/\salt="([^"]*)"/) || ["", ""])[1]);
  const ownImage = heroSrc && /\.(jpe?g|png|webp)$/i.test(heroSrc) ? SITE + (heroSrc.startsWith("/") ? heroSrc : "/" + heroSrc) : null;

  if (r.route === "/") {
    // complete the Organization the home page already declares, and add the WebSite
    h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (all, body) => {
      const d = JSON.parse(body);
      if (d["@type"] !== "Organization") return all;
      const org = {
        "@context": "https://schema.org", "@type": "Organization", "@id": ORG_ID, ...d, "@id": ORG_ID,
        logo: { "@type": "ImageObject", url: LOGO, width: 192, height: 192 },
        telephone: "+1-404-873-9148",
        // the postcode the contact page shows with this address
        address: d.address && !d.address.postalCode ? { ...d.address, postalCode: "30328" } : d.address,
        founder: Object.entries(PEOPLE).map(([name, p]) => ({ "@type": "Person", name, url: p.url, image: p.image })),
      };
      return ld(org);
    });
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
      author: person ? { "@type": "Person", name: author, url: person.url, sameAs: [person.sameAs] } : { "@id": ORG_ID },
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
    const role = strip((h.match(/<h1\b[^>]*>[\s\S]*?<\/h1>\s*<p\b[^>]*>([\s\S]*?)<\/p>/) || ["", ""])[1]);
    if (!have.includes("ProfilePage"))
      graph.push({
        "@type": "ProfilePage", "@id": `${url}#page`, url, name: headline, description,
        mainEntity: { "@type": "Person", name, ...(role ? { jobTitle: role } : {}), worksFor: { "@id": ORG_ID }, ...(p ? { sameAs: [p.sameAs], image: p.image, alumniOf: p.alumniOf, hasCredential: p.hasCredential, knowsAbout: p.knowsAbout, ...(p.knowsLanguage ? { knowsLanguage: p.knowsLanguage } : {}) } : {}) },
        isPartOf: { "@id": SITE_ID },
      });
  }
  if (!graph.some((g) => /Article|Posting|ProfilePage|WebSite/.test(g["@type"])) && r.route !== "/" && !have.includes("WebPage"))
    graph.push({ "@type": "WebPage", "@id": `${url}#page`, url, name: headline, description, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID }, inLanguage: "en-US" });

  // breadcrumbs: the trail the page itself shows (nav aria-label="Breadcrumb"), so the names match
  // what visitors see; labels without a link (e.g. "News") have no URL and are left out. Pages
  // without a visible trail get one built from the URL and the pages it passes through.
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
      items = trail.map((a) => [crumbName(a), SITE + (a === "/" ? "" : a)]).concat([[headline, url]]);
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

  // title length
  if (title.length > TITLE_MAX && title.endsWith(SUFFIX)) {
    h = h.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${(h.match(/<title>([\s\S]*?)<\/title>/)[1]).slice(0, -SUFFIX.length)}</title>`);
    counts.titles++;
  }
  if (h !== page.h) fs.writeFileSync(fileOf(r), h);
}

fs.writeFileSync(path.join(ROOT, "site-lastmod.json"), JSON.stringify(lastmod));
console.log(`site-seo: JSON-LD on ${counts.ld} pages, own share image on ${counts.shareImg}, ${counts.titles} titles shortened, ${Object.keys(lastmod).length} dated pages`);
