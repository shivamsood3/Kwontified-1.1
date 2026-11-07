import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact/thank-you", "/api/"],
      },
      {
        // Explicitly welcome AI / answer-engine crawlers (AEO / GEO).
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://kwontified.com/sitemap.xml",
    host: "https://kwontified.com",
  };
}
