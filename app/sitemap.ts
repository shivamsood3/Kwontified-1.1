import type { MetadataRoute } from "next";
import siteRoutes from "../site-routes.json";

const base = "https://kwontified.com";
// Not for search: the form confirmation and the client portal sign-in.
const skip = new Set(["/contact/thank-you", "/subscribe/thank-you", "/client-sign-in"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes
    .filter(({ route }) => !skip.has(route))
    .map(({ route }) => ({
      url: `${base}${route === "/" ? "" : route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
