export type Capability = {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  metric: { value: string; label: string };
  heroStats: { value: string; label: string }[];
  services: { title: string; body: string }[];
  caseStudy: { eyebrow: string; title: string; href: string };
};

export const capabilitiesContent: Capability[] = [
  {
    slug: "retail-media",
    name: "Retail Media and Advertising",
    h1: "Retail media measured on lift.",
    intro:
      "We run Amazon Ads, Amazon DSP, Amazon Marketing Cloud, Walmart Connect, Target Roundel, Meta and TikTok as one program — judged on incremental revenue rather than attributed clicks.",
    metric: { value: "9.4x", label: "DSP ROAS, search held" },
    heroStats: [
      { value: "$1.8M", label: "DSP attributed revenue" },
      { value: "+28%", label: "New-to-brand sales" },
      { value: "+19%", label: "Total account revenue" },
    ],
    services: [
      { title: "Amazon Sponsored Ads", body: "Sponsored Products, Brands and Display campaign architecture, keyword research, match types, bids, placements, negatives and creative tests. We structure campaigns by goal and read the terms that earn budget." },
      { title: "Amazon DSP", body: "Display, online video and streaming TV across Amazon-owned and third-party inventory, sequenced by funnel stage. Prospecting, retargeting and loyalty audiences each get their own creative and frequency." },
      { title: "Amazon Marketing Cloud", body: "Custom audiences, path-to-conversion analysis and multi-touch attribution that standard reports cannot show. We settle the question of what is incremental, then act on it." },
      { title: "Walmart Connect", body: "Sponsored Products and Search Brand Amplifier for Walmart sellers and suppliers, planned against stock and Marketplace position, reported beside organic and fulfillment metrics." },
      { title: "Target Roundel", body: "Target Product Ads in Roundel, planned against your margin and your Target Plus stock. Product and search budget tested for incrementality before it scales." },
      { title: "Meta and TikTok", body: "Advantage+ and creator campaigns that send demand to the marketplace, measured with the same budget and reporting as retail media — social spend judged on marketplace sales." },
    ],
    caseStudy: { eyebrow: "Case study · Amazon", title: "$1.8M from DSP, with search intact.", href: "/work/amazon-dsp" },
  },
  {
    slug: "creative-studio",
    name: "Creative Studio",
    h1: "Creative built from what converts.",
    intro:
      "Creative strategy, product photography, image editing, AI image and video, A+ Content and Storefront design — from a studio that reads the conversion data before it shoots, and holds the work to your brand’s own standard.",
    metric: { value: "8.2% → 12.1%", label: "Conversion rate" },
    heroStats: [
      { value: "12.1%", label: "Conversion after refresh" },
      { value: "+47%", label: "Sales on a hero ASIN" },
      { value: "$4.2M", label: "Revenue at risk, restored" },
    ],
    services: [
      { title: "Creative strategy", body: "A brand and conversion brief for each channel: what the listing, Storefront and ad must say, to which shoppers, and in what order. The brief draws on search terms, reviews, return reasons and competitor listings, so every asset has a job before it is made." },
      { title: "Product and lifestyle photography", body: "Main-image sets that meet each platform’s specifications and still earn the click, plus lifestyle and model work for detail pages, Storefronts and ads." },
      { title: "Image editing and retouching", body: "Retouching, color correction and background work on existing assets, where many brands already have most of what they need." },
      { title: "AI image and video", body: "AI-generated lifestyle scenes, model imagery and short social clips, used both for test-and-learn and where a job needs quick, on-brand volume." },
      { title: "A+ and Premium A+ Content", body: "New and edited A+ modules, comparison charts, case modules and brand story built from customer questions and reviews, with interactive modules where the brand qualifies." },
      { title: "Storefront and listing copy", body: "Storefront wireframes and refreshes for large assortments and new launches, plus titles, bullets and descriptions written for search, for shopping assistants such as Rufus, and for the shopper who reads every word." },
    ],
    caseStudy: { eyebrow: "Case study · creative", title: "The work behind the numbers.", href: "/work/creative" },
  },
  {
    slug: "marketplace-operations",
    name: "Marketplace Operations",
    h1: "Operations that protect margin.",
    intro:
      "Catalog, inventory, 1P and 3P account management, promotions and compliance across Amazon, Walmart, Target Plus and international marketplaces — run by the same team that plans your advertising.",
    metric: { value: "147", label: "Listings restored" },
    heroStats: [
      { value: "147", label: "Listings restored" },
      { value: "+68%", label: "Recovered revenue" },
      { value: "$6.2M", label: "Amazon business, restored" },
    ],
    services: [
      { title: "Catalog and listings", body: "Listing creation, titles, bullets, attributes and parent-child variation structure, with continuous checks for suppressed ASINs and compliance flags. We fix the catalog before scaling spend, because broken variation families and missing attributes cap advertising." },
      { title: "Inventory and demand forecasting", body: "ASIN-level plans from our APCIS-certified supply chain team, built on sales velocity, seasonality, promotions and ad-driven demand. Plans warn weeks-of-cover ahead, so inventory risk reaches the ad calendar before it reaches the shopper." },
      { title: "Vendor Central", body: "Purchase order forecasting, new item setup, detail-page corrections, chargeback disputes and support for vendor terms negotiations. We track fill rate, chargebacks and shortage claims against each purchase order." },
      { title: "Promotions and merchandising", body: "Lightning Deals, Prime Exclusive Discounts, coupons, Subscribe and Save and Best Deal placements, planned against stock and margin so promotion earns new-to-brand customers instead of discounting demand you already had." },
      { title: "Brand programs", body: "Brand Registry, Transparency, Project Zero and Vine enrollment and ongoing management. We check eligibility and run the economics first, so a brand enrolls only where the program pays back." },
      { title: "Account health", body: "Policy warnings, listing quality issues and fulfillment metrics monitored continuously, so a suppression or policy strike is caught and worked before it costs the Buy Box." },
    ],
    caseStudy: { eyebrow: "Case study · Amazon and Walmart", title: "Restoring a $6.2M Amazon business.", href: "/work" },
  },
  {
    slug: "analytics",
    name: "Analytics and Forecasting",
    h1: "Forecasts a CFO can plan against.",
    intro:
      "Custom dashboards from marketplace, Amazon Marketing Cloud and advertising data, and sales, budget and inventory forecasts in conservative, standard and reach scenarios.",
    metric: { value: "5.0x → 6.8x", label: "ROAS across reporting" },
    heroStats: [
      { value: "5.0x → 6.8x", label: "Blended ROAS" },
      { value: "3", label: "Forecast scenarios" },
      { value: "+20%", label: "Ad spend, plan held" },
    ],
    services: [
      { title: "Reporting and dashboards", body: "Ordered and shipped revenue, units, glance views, conversion, Buy Box percentage, TACoS and ROAS in one cross-channel view. Dashboards are built for your readers: the brand manager who acts on them and the executive who approves the plan." },
      { title: "Sales and budget forecasts", body: "Month-by-month forecasts by product group and channel, in conservative, standard and reach scenarios. Each scenario carries revenue and contribution margin, so leadership can choose a plan on profit as well as growth." },
      { title: "Inventory and PO forecasts", body: "Demand, cover and order-by dates per SKU, tied to the promotion and ad calendar. They build around your manufacturing cadence, minimum order quantities, case packs and lead times." },
      { title: "Fiscal year planning", body: "Annual plans that align sales targets, inventory, ad budgets, promotions and launches. Plans are grounded in the account’s own history, competitive data and seasonal demand, including tent-pole events such as Prime Day and Black Friday." },
      { title: "Account audits", body: "Catalog, advertising, content and compliance audits at onboarding, then on a recurring schedule. Each audit ranks what it finds by revenue at stake, so the first fixes are the ones that matter most." },
      { title: "Incrementality and AMC analysis", body: "Lift studies and AMC queries that separate email advertising caused from what it touched. The results set budgets and correct platform attribution, which credits the last ad a shopper touched." },
    ],
    caseStudy: { eyebrow: "Case study · analytics", title: "Unified reporting across two marketplaces.", href: "/work" },
  },
  {
    slug: "ai-commerce",
    name: "AI Commerce",
    h1: "Be the answer when shoppers ask AI.",
    intro:
      "Shoppers increasingly ask Amazon Rufus, ChatGPT, Gemini and Claude what to buy. We structure product data and content so your brand is the one these assistants can read, trust and recommend.",
    metric: { value: "4", label: "AI assistants, one feed" },
    heroStats: [
      { value: "100%", label: "Attribute coverage" },
      { value: "Rufus-ready", label: "Content model" },
      { value: "24/7", label: "Assistant monitoring" },
    ],
    services: [
      { title: "Structured product data", body: "Complete, consistent attributes, materials, use cases and compatibility across the catalog, so an assistant can match your product to the question a shopper actually asked." },
      { title: "Answer-shaped content", body: "A+ Content, bullets and descriptions written the way shoppers phrase questions, so Rufus and chat assistants can quote your listing instead of a competitor’s." },
      { title: "Review and Q&A signals", body: "Review themes and answered questions aligned to the attributes assistants weigh, because an assistant reads the social proof as closely as the spec." },
      { title: "Assistant monitoring", body: "We track how Rufus, ChatGPT, Gemini and Claude describe your products and your category, and correct the data behind a wrong or missing answer." },
      { title: "Agentic commerce readiness", body: "Feeds, pricing and availability prepared for assistant-driven and agentic checkout, so a recommendation can become an order without friction." },
      { title: "Category positioning", body: "Where your brand should win the recommendation, where it should not compete, and the content that moves you from unranked to the first answer." },
    ],
    caseStudy: { eyebrow: "Perspective · AI commerce", title: "Content structured for AI shopping assistants.", href: "/perspectives" },
  },
  {
    slug: "revenue-recovery",
    name: "Revenue Recovery",
    h1: "Recover what marketplaces owe you.",
    intro:
      "Shortage, price-claim and chargeback audits and disputes for vendor accounts — the revenue that quietly leaks out of 1P relationships, found and returned.",
    metric: { value: "71% → 92%", label: "PO fill rate" },
    heroStats: [
      { value: "71% → 92%", label: "PO fill rate" },
      { value: "$14.0M", label: "Recovered, one account" },
      { value: "100%", label: "Disputes worked" },
    ],
    services: [
      { title: "Shortage claims", body: "We audit every purchase order for shortage discrepancies, assemble the proof of delivery and dispute what Amazon under-received or under-paid — then track each claim to resolution." },
      { title: "Price-claim recovery", body: "Cost and price disputes, co-op and accrual reconciliation, and corrections where Amazon’s records disagree with your agreed terms." },
      { title: "Chargeback disputes", body: "Operational chargebacks — ASN, routing, labeling and prep — disputed where they are wrong and prevented where they are not, because the fastest recovery is the chargeback that never issues." },
      { title: "Fill-rate and PO health", body: "Purchase-order acceptance, confirmation and fill-rate tracking that lifts the rate Amazon buys and you ship, the number under most 1P revenue." },
      { title: "Freight and logistics claims", body: "Freight, routing and compliance deductions reviewed and recovered, and the operational causes fixed so they do not recur." },
      { title: "Recovery reporting", body: "Every claim, its status and its dollars in one ledger, reported beside the operational fixes that stop the leak at the source." },
    ],
    caseStudy: { eyebrow: "Case study · vendor", title: "$14.0M recovered across a 1P account.", href: "/work" },
  },
];

export function getCapability(slug: string) {
  return capabilitiesContent.find((c) => c.slug === slug);
}
