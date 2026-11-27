import type { MetadataRoute } from "next";

// /client-sign-in is not disallowed: it is linked from every page and carries
// <meta name="robots" content="noindex">, which a crawler can only read if it may fetch the page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact/thank-you", "/subscribe/thank-you", "/api/", "/_kq/"],
      },
      {
        // Explicitly welcome AI / answer-engine crawlers (AEO / GEO).
        // A crawler named here follows only this group, not the "*" group above, so the
        // same private paths are repeated. Claude-Web and anthropic-ai are retired tokens.
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/contact/thank-you", "/subscribe/thank-you", "/api/", "/_kq/"],
      },
    ],
    sitemap: "https://kwontified.com/sitemap.xml",
    host: "https://kwontified.com",
  };
}
