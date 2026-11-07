export const site = {
  name: "Kwontified",
  legalName: "Kwontified LLC",
  tagline: "Measured growth. Beautiful work.",
  descriptor: "ecommerce simplified",
  phone: "404.873.9148",
  phoneHref: "tel:+14048739148",
  email: "hello@kwontified.com",
  year: 2026,
  offices: [
    {
      label: "Atlanta",
      note: "Headquarters",
      lines: ["7000 Central Parkway, Suite 1100", "Sandy Springs, GA 30328"],
    },
    {
      label: "New York",
      note: "",
      lines: ["175 Greenwich Street, 38th Floor", "New York, NY 10007"],
    },
    {
      label: "Seattle",
      note: "",
      lines: ["1201 Third Avenue, Suite 2200", "Seattle, WA 98101"],
    },
  ],
  social: [
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/company/kwontified", color: "#0A66C2" },
    { label: "YouTube", short: "YT", href: "https://www.youtube.com/@kwontified", color: "#FF0000" },
    { label: "Instagram", short: "IG", href: "https://www.instagram.com/kwontified", color: "#E4405F" },
    { label: "Facebook", short: "f", href: "https://www.facebook.com/kwontified", color: "#1877F2" },
    { label: "X", short: "X", href: "https://x.com/kwontified", color: "#111111" },
    { label: "Threads", short: "@", href: "https://www.threads.net/@kwontified", color: "#111111" },
    { label: "Bluesky", short: "bs", href: "https://bsky.app/profile/kwontified.com", color: "#0285FF" },
    { label: "TikTok", short: "tk", href: "https://www.tiktok.com/@kwontified", color: "#111111" },
  ],
  clientSignInUrl: "https://clients.kwontified.com/sign-in",
} as const;

export type Office = (typeof site.offices)[number];
