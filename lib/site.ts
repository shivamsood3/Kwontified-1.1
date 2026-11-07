export const site = {
  name: "Kwontified",
  legalName: "Kwontified LLC",
  tagline: "Measured growth. Beautiful work.",
  descriptor: "ecommerce simplified",
  phone: "646.825.5283",
  phoneHref: "tel:+16468255283",
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
    { label: "LinkedIn", short: "Li", href: "https://www.linkedin.com/company/kwontified" },
    { label: "Facebook", short: "Fb", href: "https://www.facebook.com/kwontified" },
    { label: "X", short: "X", href: "https://x.com/kwontified" },
    { label: "Instagram", short: "Ig", href: "https://www.instagram.com/kwontified" },
    { label: "TikTok", short: "Tt", href: "https://www.tiktok.com/@kwontified" },
    { label: "YouTube", short: "Yt", href: "https://www.youtube.com/@kwontified" },
  ],
  clientSignInUrl: "https://clients.kwontified.com/sign-in",
} as const;

export type Office = (typeof site.offices)[number];
