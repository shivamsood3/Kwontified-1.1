export type ChannelProblem = { problem: string; solution: string };

export type Channel = {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  group: "US marketplaces" | "International" | "Social commerce";
  metric: { value: string; label: string };
  reviewLabel: string;
  accountTypes: { title: string; body: string }[];
  problems: ChannelProblem[];
};

export const channelsContent: Channel[] = [
  {
    slug: "amazon",
    name: "Amazon",
    h1: "Amazon, run as one business.",
    intro:
      "One team runs catalog, inventory, content, advertising, promotions and reporting — for 3P sellers and 1P vendors, in the US and every international Amazon marketplace you sell in.",
    group: "US marketplaces",
    metric: { value: "9.4x", label: "DSP ROAS, a national beauty brand, search ROAS held" },
    reviewLabel: "Request an Amazon review",
    accountTypes: [
      { title: "Seller Central (3P)", body: "For brands that sell direct to Amazon shoppers and control price, inventory and fulfillment. We run the account end to end." },
      { title: "Vendor Central (1P)", body: "For brands that sell wholesale to Amazon, where profit depends on purchase orders, fill rate and chargeback control." },
    ],
    problems: [
      { problem: "Ad spend is rising faster than sales.", solution: "We rebuild campaign structure around goals, cut the search terms that spend without selling, and judge every budget on TACoS and incremental return." },
      { problem: "Growth has stalled at the top of search.", solution: "Search captures demand that already exists. Amazon DSP, Marketing Cloud audiences and prospecting creative reach shoppers who are not searching yet, for the brand." },
      { problem: "Listings convert below the category.", solution: "Image testing, Premium A+ Content and listing copy built from search terms and reviews — the premium-skincare brand’s conversion rose from 8.2% to 12.1% on the same ad budget." },
      { problem: "Vendor Central margin is leaking.", solution: "Per-order shortage, chargeback and freight claims, plus terms negotiation, recovered revenue and fill rate." },
      { problem: "Listings are suppressed or variation families are broken.", solution: "Catalog audits and fixes before spend scales — one $6.2M account restored 147 listings." },
    ],
  },
  {
    slug: "walmart",
    name: "Walmart",
    h1: "Walmart for sellers and suppliers.",
    intro:
      "We run Walmart Marketplace (3P) and Walmart Supplier (1P) accounts: item setup, content, replenishment, WFS, Walmart Connect and the scorecard metrics that decide visibility.",
    group: "US marketplaces",
    metric: { value: "+19%", label: "Walmart revenue, consumer-health brand, on a 34% smaller ad budget" },
    reviewLabel: "Request a Walmart review",
    accountTypes: [
      { title: "Walmart Supplier (1P)", body: "For suppliers selling to Walmart, where the scorecard and purchase orders drive results." },
      { title: "Walmart Marketplace (3P)", body: "For Marketplace sellers who control price, inventory and content and own fulfillment and account health." },
    ],
    problems: [
      { problem: "Amazon listings copied to Walmart underperform.", solution: "Walmart’s search ranks on different signals; we build Walmart listings from Walmart keyword research and attributes." },
      { problem: "The Pro Seller Badge is out of reach.", solution: "We manage each of the metrics Walmart scores, from on-time delivery to price competitiveness, to reach the Pro-tier and keep it." },
      { problem: "Supplier scorecards are slipping.", solution: "Fill rates, on-time shipments, EDI compliance and packaging standards monitored and fixed before they cost purchase orders." },
      { problem: "Walmart Connect spend is hard to judge.", solution: "Sponsored Search and Display reported beside organic and fulfillment metrics, and budgets set on net return." },
    ],
  },
  {
    slug: "target-plus",
    name: "Target Plus",
    h1: "Target Plus, run to its standards.",
    intro:
      "Target Plus is invitation-only and holds sellers to Target’s standards for content, price and service. We run the catalog, Roundel advertising and operations to keep the invitation and grow it.",
    group: "US marketplaces",
    metric: { value: "+34%", label: "revenue through operational excellence, apparel brand" },
    reviewLabel: "Request a Target Plus review",
    accountTypes: [
      { title: "Target Plus (3P)", body: "A curated, invitation-only marketplace. We manage onboarding, content to Target’s guidelines, and the service metrics that keep you in the program." },
    ],
    problems: [
      { problem: "Content doesn’t meet Target’s guidelines.", solution: "We build listings and imagery to Target Plus specifications, so items stay live and eligible for placement." },
      { problem: "Roundel budget isn’t tied to margin.", solution: "Target Product Ads planned against your Target Plus stock and your margin, tested for incrementality before they scale." },
      { problem: "Service metrics risk the invitation.", solution: "Shipping, cancellation and return metrics monitored continuously, so a slip is caught before it threatens the program." },
    ],
  },
  {
    slug: "international",
    name: "International",
    h1: "Grow abroad without starting over.",
    intro:
      "We launch and run international marketplaces from the catalog we already manage — localizing content, advertising and operations country by country, so a new market starts from what already works.",
    group: "International",
    metric: { value: "14", label: "countries run from one catalog" },
    reviewLabel: "Request an international review",
    accountTypes: [
      { title: "Amazon international", body: "Europe, the UK, Canada, Mexico, Japan and Australia — localized listings, in-market advertising and compliance, run beside your US account." },
      { title: "European platforms", body: "Zalando and Mercado Libre run alongside Amazon, so one team sees the whole international P&L." },
    ],
    problems: [
      { problem: "A US catalog won’t simply copy abroad.", solution: "We localize content, sizing, compliance and search for each market rather than translating a US listing word for word." },
      { problem: "VAT, EPR and compliance stall launches.", solution: "We manage registration, labeling and documentation per market, so listings go live and stay live." },
      { problem: "In-market advertising is an afterthought.", solution: "Advertising is planned per locale against local demand, reported in one cross-border view." },
    ],
  },
  {
    slug: "zalando",
    name: "Mercado Libre & Zalando",
    h1: "Zalando, run across Europe.",
    intro:
      "Zalando’s Partner Program reaches fashion shoppers across Europe. We run connected retail and partner models — content, pricing, fulfillment and advertising — localized market by market.",
    group: "International",
    metric: { value: "Europe", label: "run across Zalando’s partner markets" },
    reviewLabel: "Request a Zalando review",
    accountTypes: [
      { title: "Partner Program", body: "You hold stock and fulfill; we run content, pricing and Zalando Marketing Services across markets." },
      { title: "Connected Retail", body: "Sell from your own stock through Zalando’s reach, with operations and localization handled." },
    ],
    problems: [
      { problem: "European sizing and content don’t match.", solution: "We localize sizing, descriptions and imagery to each market’s expectations and Zalando’s standards." },
      { problem: "Zalando advertising sits separate from the plan.", solution: "Zalando Marketing Services planned and reported beside your other channels, in one P&L." },
      { problem: "Fulfillment and returns eat margin.", solution: "We set the fulfillment model and returns handling market by market to protect contribution." },
    ],
  },
  {
    slug: "mercado-libre",
    name: "Mercado Libre",
    h1: "Mercado Libre, country by country.",
    intro:
      "Mercado Libre is the largest marketplace in Latin America, and each country is its own business. We run listings, Mercado Ads, Mercado Envíos and reputation per country, from one plan.",
    group: "International",
    metric: { value: "5", label: "Latin American countries, one plan" },
    reviewLabel: "Request a Mercado Libre review",
    accountTypes: [
      { title: "Per-country accounts", body: "Mexico, Brazil, Argentina, Chile and Colombia — each with its own catalog, pricing, logistics and advertising, run together." },
    ],
    problems: [
      { problem: "Each country behaves differently.", solution: "We run catalog, pricing and advertising per country rather than treating Latin America as one market." },
      { problem: "Reputation and Mercado Líder status are at risk.", solution: "We manage the service metrics behind seller reputation, protecting visibility and the Buy Box equivalent." },
      { problem: "Mercado Envíos logistics are complex.", solution: "We set the shipping model per country to keep delivery fast and costs in line with margin." },
    ],
  },
  {
    slug: "temu",
    name: "Temu",
    h1: "Temu, priced to protect margin.",
    intro:
      "Temu is a price-led marketplace. We decide where a brand belongs on it, set margin floors before launch, and run the catalog and promotions so volume never comes at the cost of contribution.",
    group: "International",
    metric: { value: "Margin", label: "floors set before a single unit sells" },
    reviewLabel: "Request a Temu review",
    accountTypes: [
      { title: "Local-to-US and semi-managed", body: "We run the model that fits your supply chain, with pricing and promotions planned against a margin floor." },
    ],
    problems: [
      { problem: "Temu’s pricing pressure erodes margin.", solution: "We set margin floors first and plan promotions against them, so the channel earns contribution, not just volume." },
      { problem: "It’s unclear whether a brand belongs on Temu.", solution: "We run the economics and brand fit before launch, and recommend against it when the numbers don’t work." },
      { problem: "Catalog and compliance differ from Amazon.", solution: "We build listings to Temu’s requirements and manage the operation separately from your other channels." },
    ],
  },
  {
    slug: "tiktok-shop",
    name: "TikTok Shop",
    h1: "TikTok Shop, built on creators.",
    intro:
      "TikTok Shop turns content into checkout. We run the storefront, creator partnerships, affiliate program, live shopping and in-feed ads — creative and commerce managed by the same team.",
    group: "Social commerce",
    metric: { value: "Creators", label: "first — content that converts to checkout" },
    reviewLabel: "Request a TikTok Shop review",
    accountTypes: [
      { title: "Shop and affiliate", body: "Storefront setup, product feed, the TikTok Shop affiliate program and creator partnerships run as one commerce engine." },
    ],
    problems: [
      { problem: "Creator content doesn’t drive sales.", solution: "We match creators to the product and brief them from what converts, then track sales by creator, niche and format." },
      { problem: "Live shopping is hard to run.", solution: "We plan, produce and run live sessions, and fold the learnings into creator and ad content." },
      { problem: "Ads and organic content pull apart.", solution: "In-feed ads and Spark Ads amplify the content that already sells, so paid and organic compound." },
    ],
  },
  {
    slug: "instagram-shop",
    name: "Instagram Shop",
    h1: "Instagram Shop, run for sales.",
    intro:
      "Instagram is where discovery happens. We run the shop, product tagging, shopping ads and creator content so the audience you build on Instagram becomes revenue, not just reach.",
    group: "Social commerce",
    metric: { value: "Shop", label: "run for sales, not just reach" },
    reviewLabel: "Request an Instagram Shop review",
    accountTypes: [
      { title: "Shop and shopping ads", body: "Catalog, product tagging, shoppable content and Advantage+ shopping campaigns managed against marketplace and DTC goals." },
    ],
    problems: [
      { problem: "A big following isn’t converting.", solution: "We make content shoppable with product tags and shopping ads, so attention turns into tracked sales." },
      { problem: "Creative sits apart from the data.", solution: "Instagram creative is briefed from the same conversion data as your marketplace listings." },
      { problem: "Instagram spend isn’t measured on revenue.", solution: "Shopping campaigns are planned and reported against marketplace and DTC revenue, in one view." },
    ],
  },
];

export const brandPrograms = {
  slug: "brand-programs",
  name: "Amazon brand programs",
  h1: "Brand programs, run for return.",
  intro:
    "Vine, Premium Beauty, Luxury Stores and Creator Connections open retail environments and marketing tools that standard account management does not reach. We check eligibility and the economics before you enroll.",
  metric: { value: "+204%", label: "three-year growth for a luxury swimwear house, no discounting" },
  reviewLabel: "Request a program review",
  problems: [
    { problem: "A new launch has too few reviews to convert.", solution: "Vine enrollment timed with advertising and A+ Content, modeled against the cost of the units before the brand enrolls." },
    { problem: "A prestige brand looks out of place on Amazon.", solution: "Premium Beauty or Luxury Stores where the brand qualifies, with the Storefront and A+ Content held to luxury standards." },
    { problem: "Discounting is wearing down the brand.", solution: "Curation and restrained advertising. One French Riviera swimwear house grew 204% in three years without discounting." },
    { problem: "Creator traffic is not measured.", solution: "Creator Connections commissions set against margin, with sales tracked by creator, niche and format." },
  ],
} as const;

export function getChannel(slug: string) {
  return channelsContent.find((c) => c.slug === slug);
}

export const channelGroups = [
  "US marketplaces",
  "International",
  "Social commerce",
] as const;
