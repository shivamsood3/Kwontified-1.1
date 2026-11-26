import type { MetadataRoute } from "next";
import siteRoutes from "../site-routes.json";
// publication dates of dated pages (articles, news, press releases), written by scripts/site-seo.mjs
import lastmod from "../site-lastmod.json";

const base = "https://kwontified.com";
// Not for search: the form confirmation and the client portal sign-in.
const skip = new Set(["/contact/thank-you", "/subscribe/thank-you", "/client-sign-in"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes
    .filter(({ route }) => !skip.has(route))
    .map(({ route }) => ({
      url: `${base}${route === "/" ? "" : route}`,
      // a real date only where the page has one; a build-time date on every URL would tell crawlers nothing
      ...((lastmod as Record<string, string>)[route] ? { lastModified: (lastmod as Record<string, string>)[route] } : {}),
      changeFrequency: "monthly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
