import type { NextConfig } from "next";
import siteRoutes from "./site-routes.json";

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

// URLs from the previous build of the site that moved or were merged.
const moved: Record<string, string> = {
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
  "/perspectives/press/perspectives-briefing-launch": "/perspectives",
  "/styleguide": "/",
  "/thank-you": "/contact/thank-you",
  "/work/vendor-central-recovery": "/work/shortage-claims",
  "/work/gallery": "/work/creative",
  "/work/amazon-dsp": "/work",
  "/work/account-health-restore": "/work",
  "/work/international-expansion": "/work",
  "/work/walmart-sku-transition": "/work",
};

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: [...pageRewrites, ...articleRewrites], afterFiles: [], fallback: [] };
  },
  async redirects() {
    return Object.entries(moved).map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      // asset file names are content hashes, so they never change in place
      { source: "/assets/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // the built files are only meant to be reached through their routes
      { source: "/_kq/:file*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
