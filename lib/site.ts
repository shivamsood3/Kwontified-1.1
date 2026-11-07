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
  // Real profiles + official brand icons, matching the live site.
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kwontified", icon: "/social/linkedin.svg" },
    { label: "Instagram", href: "https://www.instagram.com/kwontified/", icon: "/social/instagram.svg" },
    { label: "Facebook", href: "https://www.facebook.com/kwontified", icon: "/social/facebook.svg" },
    { label: "X", href: "https://twitter.com/kwontified", icon: "/social/x.svg" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCvJbuLKclXWQ8y8Al-aAyjA", icon: "/social/youtube.svg" },
  ],
  clientSignInUrl: "https://clients.kwontified.com/sign-in",
} as const;

export type Office = (typeof site.offices)[number];
