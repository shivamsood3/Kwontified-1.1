export type NavItem = {
  label: string;
  href: string;
  blurb?: string;
};

export const capabilities: NavItem[] = [
  {
    label: "Retail Media and Advertising",
    href: "/capabilities/retail-media",
    blurb: "Amazon Ads, DSP and Marketing Cloud, judged on incremental return.",
  },
  {
    label: "Creative Studio",
    href: "/capabilities/creative-studio",
    blurb: "Photography, video, A+ Content and Storefronts briefed from what converts.",
  },
  {
    label: "Marketplace Operations",
    href: "/capabilities/marketplace-operations",
    blurb: "Catalog, inventory, pricing and compliance — 1P and 3P.",
  },
  {
    label: "Analytics and Forecasting",
    href: "/capabilities/analytics",
    blurb: "Dashboards, audits and forecasts a CFO can plan against.",
  },
  {
    label: "AI Commerce",
    href: "/capabilities/ai-commerce",
    blurb: "Be the answer when shoppers ask AI to recommend a product.",
  },
  {
    label: "Revenue Recovery",
    href: "/capabilities/revenue-recovery",
    blurb: "Shortage, price-claim and chargeback audits for vendor accounts.",
  },
];

export const channelMarketplaces: NavItem[] = [
  { label: "Amazon", href: "/channels/amazon", blurb: "Run as one business." },
  { label: "Walmart", href: "/channels/walmart", blurb: "For sellers and suppliers." },
  { label: "Target Plus", href: "/channels/target-plus", blurb: "Run to its standards." },
  { label: "International", href: "/channels/international", blurb: "Grow abroad without starting over." },
  { label: "Zalando", href: "/channels/zalando", blurb: "Run across Europe." },
  { label: "Mercado Libre", href: "/channels/mercado-libre", blurb: "Country by country." },
  { label: "Temu", href: "/channels/temu", blurb: "Priced to protect margin." },
];

export const channelSocial: NavItem[] = [
  { label: "TikTok Shop", href: "/channels/tiktok-shop", blurb: "Built on creators." },
  { label: "Instagram Shop", href: "/channels/instagram-shop", blurb: "Run for sales." },
];

export const channelsAll: NavItem[] = [...channelMarketplaces, ...channelSocial];

export const primaryNav = [
  { label: "Capabilities", href: "/capabilities" },
  { label: "Channels", href: "/channels" },
  { label: "Work", href: "/work" },
  { label: "Why Kwontified", href: "/why-kwontified" },
  { label: "Perspectives", href: "/perspectives" },
  { label: "About", href: "/about" },
] as const;

export const companyNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Why Kwontified", href: "/why-kwontified" },
  { label: "Leadership", href: "/about/leadership" },
  { label: "Work", href: "/work" },
  { label: "Perspectives", href: "/perspectives" },
  { label: "Careers", href: "/about/careers" },
  { label: "Contact", href: "/contact" },
  { label: "Client sign-in", href: "https://clients.kwontified.com/sign-in" },
];
