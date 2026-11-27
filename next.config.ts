import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import siteRoutes from "./site-routes.json";
import i18n from "./site-i18n/config.json";
import liveSite from "./site-src/redirects.json";
import siteCsp from "./site-csp.json";

// Pages are the client's HTML exports, built by scripts/build-site.mjs into
// public/_kq and served unchanged at their canonical routes.
// Articles, news items and press releases all follow one file-naming rule
// (/perspectives/news/x is /_kq/perspectives--news--x.html), so three patterns
// serve every one of them. Listing each as its own rewrite would pass Vercel's
// limit on routes once the archive is in.
const isArticle = (route: string) => /^\/perspectives\/(news\/|press-releases\/)?[^/]+$/.test(route);
const pageRewrites = siteRoutes
  .filter(({ route }) => !isArticle(route))
  .map(({ route, file }) => ({ source: route, destination: file }));
const articleRewrites = [
  { source: "/perspectives/news/:slug", destination: "/_kq/perspectives--news--:slug.html" },
  { source: "/perspectives/press-releases/:slug", destination: "/_kq/perspectives--press-releases--:slug.html" },
  { source: "/perspectives/:slug", destination: "/_kq/perspectives--:slug.html" },
];

// Translated pages (see scripts/site-i18n.mjs): /es/about/careers is /_kq/es--about--careers.html.
// Four patterns cover every language and page; an address with no translated file is a 404.
const langs = i18n.languages.map((l) => l.code).join("|");
const langRewrites = langs
  ? [
      { source: `/:lang(${langs})`, destination: "/_kq/:lang--index.html" },
      { source: `/:lang(${langs})/:a`, destination: "/_kq/:lang--:a.html" },
      { source: `/:lang(${langs})/:a/:b`, destination: "/_kq/:lang--:a--:b.html" },
      { source: `/:lang(${langs})/:a/:b/:c`, destination: "/_kq/:lang--:a--:b--:c.html" },
    ]
  : [];

// ---------------------------------------------------------------------------
// Redirects (all 308 permanent). Three sources of old addresses, one rule set:
//   1. `moved` below: addresses from the previous build of this site that moved or merged.
//   2. site-src/archive/moved.json: old -> new Perspectives addresses written by the archive
//      import when a slug changes. Optional; a missing file means no renamed articles.
//   3. site-src/redirects.json: addresses of the live kwontified.com this site replaces
//      (exact paths, section patterns and other domains). The owner's live-site URL export
//      is added there as data; see the notes at the top of that file.
// Every destination must be a route of this site, chains are followed to their last page,
// and a key that is still a live page is an error, so a stale entry fails the build.
// ---------------------------------------------------------------------------
const moved: Record<string, string> = {
  // the sleep-brand case study was renamed when the site adopted "Alexa for Shopping" (2026-11-27)
  "/work/from-6-to-23-of-40-rufus-answers": "/work/from-6-to-23-of-40-alexa-for-shopping-answers",
  "/capabilities/ai-commerce": "/capabilities/agentic-commerce",
  "/capabilities/analytics": "/capabilities/analytics-forecasting",
  "/perspectives/holiday-2026-season-starts-in-october": "/perspectives/holiday-season-starts-october",
  "/perspectives/amazon-dsp-incrementality": "/perspectives",
  "/perspectives/authors/elaine-kwon": "/about/leadership/elaine-kwon",
  "/perspectives/authors/jordan-taylor": "/about/leadership/jordan-taylor",
  "/perspectives/news/amazon-black-friday-week-2026-dates": "/perspectives/news/watch-amazon-black-friday-week-2026-dates",
  "/perspectives/news/prime-big-deal-days-2026-early-read":
    "/perspectives/news/early-read-prime-big-deal-days-2026-from-public-sources-labeled",
  "/perspectives/news/unboxed-2026-day-two-automation":
    "/perspectives/news/unboxed-2026-day-two-what-advertisers-give-up-for-automation",
  "/perspectives/news/unboxed-2026-amazon-ads-agents": "/perspectives",
  "/perspectives/press/unboxed-2026-san-francisco":
    "/perspectives/press-releases/kwontified-to-attend-amazon-ads-unboxed-2026-in-san-francisco",
  "/perspectives/press/accelerate-2026-seattle":
    "/perspectives/press-releases/kwontified-to-attend-amazon-accelerate-2026-in-seattle",
  "/perspectives/press/perspectives-briefing-launch":
    "/perspectives/press-releases/kwontified-launches-perspectives-and-the-kwontified-briefing-newsletter",
  "/styleguide": "/",
  "/thank-you": "/contact/thank-you",
  "/work/vendor-central-recovery": "/work/shortage-claims",
  "/work/gallery": "/work/creative",
  "/work/amazon-dsp": "/work",
  "/work/account-health-restore": "/work",
  "/work/international-expansion": "/work",
  "/work/walmart-sku-transition": "/work",
};

const CANONICAL_HOST = "kwontified.com";
const routeSet = new Set(siteRoutes.map(({ route }) => route));
const pathOf = (dest: string) => dest.replace(/[?#].*$/, "") || "/";

// An old address as a redirect source: path only, percent-encoded as browsers send it (so
// "/a b" and "/a%20b" are the same key), lower case, no trailing slash, and the characters
// Next.js reads as pattern syntax escaped.
function sourcePath(raw: string, from: string): string {
  let p = raw.trim();
  if (/^https?:\/\//i.test(p)) p = new URL(p).pathname;
  p = p.replace(/[?#].*$/, "");
  try {
    p = encodeURI(decodeURI(p));
  } catch {
    throw new Error(`${from}: "${raw}" has a broken %-escape`);
  }
  p = p.toLowerCase();
  if (p.length > 1) p = p.replace(/\/+$/, "");
  if (!p.startsWith("/") || p === "/") throw new Error(`${from}: "${raw}" is not an old address (expected /path or https://host/path)`);
  return p;
}
const escapeSource = (p: string) => p.replace(/[(){}:*+?\\]/g, "\\$&");

// site-src/archive/moved.json (WS6) may be {old: new}, [[old, new]] or [{from|old|source, to|new|destination}].
function readArchiveMoves(): Record<string, string> {
  const file = path.join(process.cwd(), "site-src/archive/moved.json");
  if (!fs.existsSync(file)) return {};
  const data: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  const pairs: [unknown, unknown][] = Array.isArray(data)
    ? data.map((e) => (Array.isArray(e) ? [e[0], e[1]] : [e?.from ?? e?.old ?? e?.source, e?.to ?? e?.new ?? e?.destination]))
    : data && typeof data === "object"
      ? Object.entries(data as Record<string, unknown>).filter(([k]) => !k.startsWith("_"))
      : [];
  if (!pairs.length && data && (!Array.isArray(data) || data.length)) throw new Error("site-src/archive/moved.json: no old -> new pairs found");
  return Object.fromEntries(
    pairs.map(([a, b], i) => {
      if (typeof a !== "string" || typeof b !== "string" || !a.startsWith("/") || !b.startsWith("/"))
        throw new Error(`site-src/archive/moved.json entry ${i + 1}: expected two addresses starting with "/", got ${JSON.stringify([a, b])}`);
      return [a, b];
    }),
  );
}

function buildRedirects() {
  const exact = new Map<string, string>();
  const add = (map: Record<string, string>, from: string) => {
    for (const [raw, dest] of Object.entries(map)) {
      if (raw.startsWith("_")) continue;
      const src = sourcePath(raw, from);
      const to = dest.trim();
      if (pathOf(to) === src) continue; // an old address that still exists here unchanged
      if (routeSet.has(src)) throw new Error(`${from}: "${raw}" is a live page of this site; remove the redirect or the page`);
      if (exact.has(src) && exact.get(src) !== to) throw new Error(`${from}: "${raw}" redirects to both "${exact.get(src)}" and "${to}"`);
      exact.set(src, to);
    }
  };
  add(moved, "next.config.ts moved");
  add(readArchiveMoves(), "site-src/archive/moved.json");
  add(liveSite.paths, "site-src/redirects.json paths");

  // follow chains (old -> renamed -> renamed again) so every visitor gets one hop
  const settle = (dest: string, from: string) => {
    let d = dest;
    for (let hops = 0; !/^https?:/.test(d) && exact.has(pathOf(d)); hops++) {
      if (hops > 10) throw new Error(`redirect loop from "${from}"`);
      d = exact.get(pathOf(d))!;
    }
    if (!/^https:\/\//.test(d) && !routeSet.has(pathOf(d)))
      throw new Error(`redirect "${from}" -> "${d}": the destination is not a route in site-routes.json`);
    return d;
  };

  const domainRules = liveSite.domains.map((raw: string) => {
    const host = raw.trim().toLowerCase();
    if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host) || host === CANONICAL_HOST)
      throw new Error(`site-src/redirects.json domains: "${raw}" is not another domain name`);
    return {
      source: "/:path*",
      has: [{ type: "host" as const, value: host.replace(/\./g, "\\.") }],
      destination: `https://${CANONICAL_HOST}/:path*`,
      permanent: true,
    };
  });
  const exactRules = [...exact.keys()].map((src) => ({ source: escapeSource(src), destination: settle(exact.get(src)!, src), permanent: true }));
  const patternRules = liveSite.patterns.map(({ source, destination }: { source: string; destination: string }) => {
    if (!source.startsWith("/") || source === "/" || /^\/(:|\(|_next|assets|api|_kq)/.test(source))
      throw new Error(`site-src/redirects.json patterns: "${source}" would catch pages of this site`);
    return { source, destination: destination.includes(":") ? destination : settle(destination, source), permanent: true };
  });
  return [...domainRules, ...exactRules, ...patternRules];
}
const redirectRules = buildRedirects();

// ---------------------------------------------------------------------------
// Security headers.
// Content-Security-Policy: REPORT-ONLY until the owner has reviewed the Google Tag Manager
// container against it (OWNER TODO, F091). To enforce it, set CSP_ENFORCE to true; nothing else
// changes. The policy sent now is exactly the one that would be enforced, so the reports
// ("csp-report" lines in the Vercel logs, app/api/csp-report) show what enforcing would block.
// script-src has no 'unsafe-inline': the site's scripts are files under /assets (moved there by
// scripts/site-bundle.mjs, the last build step), and the few scripts still inline are allowed by
// their sha256, which that step writes to site-csp.json on every build. Google hosts are the
// ones Google documents for GA4 and Google Ads through Tag Manager; tags added to the container
// later may need more (Custom HTML tags need 'unsafe-inline' or a nonce: see HANDOVER.md).
// style-src keeps 'unsafe-inline' (the pages use style attributes throughout).
// ---------------------------------------------------------------------------
const CSP_ENFORCE = false;
const google = {
  script: "https://*.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com",
  img: "https://*.google-analytics.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com",
  connect:
    "https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com https://www.googleadservices.com",
  frame: "https://td.doubleclick.net https://bid.g.doubleclick.net https://www.googletagmanager.com",
};
const csp = [
  "default-src 'self'",
  `script-src 'self' ${siteCsp.scriptHashes.map((h) => `'${h}'`).join(" ")} ${google.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${google.img}`,
  "font-src 'self'",
  `connect-src 'self' ${google.connect}`,
  "media-src 'self'",
  `frame-src ${google.frame}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(CSP_ENFORCE ? ["upgrade-insecure-requests"] : []), // ignored, with a console warning, in a report-only policy
  "report-uri /api/csp-report",
].join("; ");

// Asset names that carry a 12-hex content hash (abc123def456.jpg, abc123def456-800.webp,
// kq-fx-abc123def456.js, logo-abc123def456.svg) never change in place. Everything else under
// /assets (archive-A0002.jpg, leadership-*.jpg, *.i18n.js, whose name is the English file's
// hash) may be replaced under the same name, so browsers revalidate it daily.
const HASHED_ASSET = "(?:[a-z0-9-]*-)?[0-9a-f]{12}(?:-\\d+)?\\.(?:jpg|jpeg|png|webp|avif|svg|gif|js|json|css|woff2?|mp4|webm)";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // the 403 and 404 route handlers read the built pages at run time; make sure the files ship with them
  outputFileTracingIncludes: { "/403": ["./public/_kq/403.html"], "/\\[...missing\\]": ["./public/_kq/404.html"] },
  async rewrites() {
    return { beforeFiles: [...pageRewrites, ...articleRewrites, ...langRewrites], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return [
      ...redirectRules,
      // the newsletter press release tells readers to subscribe at kwontified.com/subscribe;
      // the sign-up form is in the footer of every page (temporary, in case a page is added later)
      { source: "/subscribe", destination: "/perspectives#newsletter-email", permanent: false },
    ];
  },
  async headers() {
    return [
      // when two rules set the same header, the later one wins: un-hashed assets first, hashed after
      { source: "/assets/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }] },
      { source: `/assets/:file(${HASHED_ASSET})`, headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // every response: browsers must not guess content types; other sites receive only the
      // origin when a visitor follows a link away; no other site may show these pages in a frame;
      // the pages use no camera, microphone, location, payment or USB; HTTPS only for two years
      // (not includeSubDomains until every subdomain, clients.kwontified.com included, is HTTPS)
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: CSP_ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
      // the built files are only meant to be reached through their routes
      { source: "/_kq/:file*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      // staging and preview deployments (*.vercel.app) must never be indexed alongside
      // kwontified.com; the production domain does not match, so it is unaffected
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<deployment>.+)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
