export type Stat = { value: string; label: string };

export type CaseStudy = {
  slug?: string;
  brand: string;
  title: string;
  channel: string;
  capability: string;
  stats: Stat[];
  featured?: boolean;
  draft?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "amazon-dsp",
    brand: "A national beauty brand · Amazon US",
    title: "$1.8M from DSP, with search intact",
    channel: "Amazon",
    capability: "Retail media",
    stats: [
      { value: "$1.8M", label: "DSP attributed revenue" },
      { value: "9.4x", label: "DSP ROAS" },
      { value: "+28%", label: "New-to-brand sales" },
    ],
    featured: true,
  },
  {
    brand: "A luxury swimwear brand · Amazon US, EU, UK",
    title: "+204% three-year growth for luxury swimwear",
    channel: "International",
    capability: "Creative",
    stats: [
      { value: "+204%", label: "Three-year growth" },
      { value: "0", label: "Points of discounting" },
    ],
  },
  {
    brand: "A global accessories brand · Amazon, Target Plus",
    title: "Growing every channel while diversifying revenue",
    channel: "Amazon",
    capability: "Retail media",
    stats: [
      { value: "11.1x", label: "Amazon ROAS" },
      { value: "3", label: "Marketplaces" },
    ],
  },
  {
    brand: "A home goods brand · Amazon Vendor Central",
    title: "Restoring PO fill rate on a 1P account",
    channel: "Amazon",
    capability: "Revenue recovery",
    stats: [
      { value: "71% → 92%", label: "PO fill rate" },
      { value: "$14.0M", label: "Recovered revenue" },
    ],
  },
  {
    slug: "account-health-restore",
    brand: "A leading CPG brand · Amazon",
    title: "Restoring a $6.2M Amazon business",
    channel: "Amazon",
    capability: "Operations",
    stats: [
      { value: "147", label: "Listings restored" },
      { value: "+68%", label: "Recovered revenue" },
    ],
  },
  {
    brand: "A premium skincare brand · Amazon US",
    title: "Conversion from 8.2% to 12.1% on the same budget",
    channel: "Amazon",
    capability: "Creative",
    stats: [
      { value: "8.2% → 12.1%", label: "Conversion rate" },
      { value: "+47%", label: "Hero-ASIN sales" },
    ],
  },
  {
    brand: "A natural oral-care brand · Amazon, Walmart",
    title: "Unified reporting across two marketplaces",
    channel: "Walmart",
    capability: "Analytics",
    stats: [
      { value: "5.0x → 6.8x", label: "Blended ROAS" },
      { value: "2", label: "Marketplaces, one P&L" },
    ],
  },
  {
    slug: "walmart-sku-transition",
    brand: "A consumer-health brand · Walmart",
    title: "+19% Walmart revenue on a smaller ad budget",
    channel: "Walmart",
    capability: "Retail media",
    stats: [
      { value: "+19%", label: "Revenue growth" },
      { value: "−34%", label: "Ad budget" },
    ],
  },
  {
    brand: "A men's outdoor apparel brand · Amazon",
    title: "From zero to an $8.8M forecast in a year",
    channel: "Amazon",
    capability: "Operations",
    stats: [
      { value: "$8.8M", label: "Year-1 forecast" },
      { value: "8 mo", label: "To first revenue" },
    ],
  },
  {
    brand: "A health and beauty brand · Amazon US",
    title: "Building a recurring revenue stream",
    channel: "Amazon",
    capability: "Analytics",
    stats: [
      { value: "38%", label: "Subscribe & Save share" },
      { value: "+22%", label: "Repeat revenue" },
    ],
  },
  {
    slug: "international-expansion",
    brand: "A premium fashion brand · Amazon UK, EU, CA",
    title: "Growing into new international markets",
    channel: "International",
    capability: "Operations",
    stats: [
      { value: "$1.4M", label: "International revenue" },
      { value: "3", label: "New regions live" },
    ],
  },
  {
    brand: "A footwear brand · Zalando, EU",
    title: "Zalando launch across European markets",
    channel: "International",
    capability: "Operations",
    stats: [
      { value: "6", label: "EU markets live" },
      { value: "+41%", label: "Season-over-season" },
    ],
  },
];

export const workFilters = {
  channels: ["All", "Amazon", "Walmart", "Target Plus", "International", "Social"],
  capabilities: [
    "All",
    "Retail media",
    "Creative",
    "Operations",
    "Analytics",
    "Revenue recovery",
  ],
};
