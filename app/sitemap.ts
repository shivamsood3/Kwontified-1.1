import type { MetadataRoute } from "next";
import siteRoutes from "../site-routes.json";
// last-change dates, written by scripts/site-seo.mjs: the publication date of articles, news and
// press releases, and for other pages the date of the last commit to the files their content comes from
import lastmod from "../site-lastmod.json";
// translated pages, written by scripts/site-i18n.mjs; only languages marked live are listed
import translated from "../site-i18n-routes.json";

const base = "https://kwontified.com";
// Not for search: the form confirmation and the client portal sign-in.
const skip = new Set(["/contact/thank-you", "/subscribe/thank-you", "/client-sign-in"]);
const url = (route: string) => `${base}${route === "/" ? "" : route}`;
const live = (translated as { lang: string; tag?: string; route: string; en: string; live: boolean }[]).filter((t) => t.live && !skip.has(t.en));
// every language a page exists in, so search engines can show each reader the right one
const versions = (en: string) => {
  const others = live.filter((t) => t.en === en);
  if (!others.length) return {};
  return { alternates: { languages: Object.fromEntries([["en", url(en)], ...others.map((t) => [t.tag || t.lang, url(t.route)])]) } };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const dates = lastmod as Record<string, string>;
  const entry = (route: string, en: string, priority: number) => ({
    url: url(route),
    // a real date only where one is known; a build-time date on every URL would tell crawlers nothing
    ...(dates[en] ? { lastModified: dates[en] } : {}),
    changeFrequency: "monthly" as const,
    priority,
    ...versions(en),
  });
  return [
    ...siteRoutes.filter(({ route }) => !skip.has(route)).map(({ route }) => entry(route, route, route === "/" ? 1 : 0.7)),
    ...live.map((t) => entry(t.route, t.en, 0.6)),
  ];
}
