// Case-study detail pages reachable from the homepage results and the work
// library. Figures are representative (see CONTENT_TODO.md); narrative steps
// describe method, not invented client facts. Client quotes are TODO(content).

export type CaseStudyDetail = {
  slug: string;
  category: string;
  channel: string;
  title: string;
  intro: string;
  capabilities: string[];
  stats: { value: string; label: string }[];
  beforeAfter?: {
    metric: string;
    before: { label: string; value: string; height: number };
    after: { label: string; value: string; height: number };
  };
  challenge: string;
  whatWeDid: { title: string; body: string }[];
  results: string;
};

export const caseStudyDetails: CaseStudyDetail[] = [
  {
    slug: "walmart-sku-transition",
    category: "Consumer health",
    channel: "Walmart",
    title: "+19% Walmart revenue through a major SKU transition.",
    intro:
      "A consumer-health brand moved its assortment to a new SKU line on Walmart without losing the ranking, reviews and supplier scorecard it had built.",
    capabilities: ["Marketplace Operations", "Retail Media and Advertising", "Analytics and Forecasting"],
    stats: [
      { value: "+19%", label: "Combined Walmart revenue" },
      { value: "3.0x → 4.2x", label: "Supplier ROAS" },
      { value: "−34%", label: "Ad budget" },
    ],
    beforeAfter: {
      metric: "Combined Walmart revenue",
      before: { label: "Before", value: "$2.83M", height: 84 },
      after: { label: "After", value: "$3.38M", height: 100 },
    },
    challenge:
      "A SKU transition risks resetting item history: ranking, reviews and the Walmart supplier scorecard. The brand needed to migrate without a revenue dip and without overspending on Walmart Connect to prop up the new items.",
    whatWeDid: [
      { title: "Mapped the migration", body: "We set up the new items with complete attributes and carried over content and review strategy so the catalog stayed clean through the switch." },
      { title: "Protected the scorecard", body: "Fill rate, on-time shipping and EDI compliance were monitored through the transition so visibility held while the new line ramped." },
      { title: "Moved budget on return", body: "Walmart Connect spend was planned against margin, which let us grow revenue on a smaller ad budget rather than buying the ramp." },
    ],
    results:
      "Combined Walmart revenue rose 19% through the transition, supplier ROAS improved from 3.0x to 4.2x, and the result came on a 34% smaller ad budget.",
  },
  {
    slug: "international-expansion",
    category: "Premium fashion",
    channel: "International",
    title: "$1.4M in international revenue, from a US-only start.",
    intro:
      "A premium fashion brand that had sold only in the US launched across the UK, EU and Canada from the catalog we already managed.",
    capabilities: ["Marketplace Operations", "Creative Studio", "Analytics and Forecasting"],
    stats: [
      { value: "$1.4M", label: "International revenue" },
      { value: "3", label: "New regions live" },
      { value: "1", label: "Catalog, localized" },
    ],
    beforeAfter: {
      metric: "International revenue",
      before: { label: "Before", value: "$0", height: 4 },
      after: { label: "After", value: "$1.4M", height: 100 },
    },
    challenge:
      "A US catalog does not simply copy abroad: sizing, content, compliance and search all differ by market, and VAT and EPR registration can stall a launch for months.",
    whatWeDid: [
      { title: "Localized the catalog", body: "Content, sizing and search were adapted per market rather than translated, so listings read natively in each region." },
      { title: "Cleared compliance", body: "We managed VAT, EPR and labeling per market so items went live and stayed live." },
      { title: "Planned in-market media", body: "Advertising was planned per locale against local demand and reported in one cross-border view." },
    ],
    results:
      "The brand reached $1.4M in international revenue across three new regions, run from the single catalog we already maintained.",
  },
  {
    slug: "account-health-restore",
    category: "Leading CPG brand",
    channel: "Amazon",
    title: "Restoring a collapsed $6.2M Amazon business.",
    intro:
      "A leading CPG brand’s Amazon business had collapsed under suppressed listings and broken variation families. We restored account health and the revenue that depended on it.",
    capabilities: ["Marketplace Operations", "Revenue Recovery", "Analytics and Forecasting"],
    stats: [
      { value: "$6.2M", label: "Business restored" },
      { value: "+68%", label: "Annualized revenue" },
      { value: "147", label: "Listings restored" },
    ],
    // No verified before/after pair for this account — the Results strip
    // shows the confirmed stats ($6.2M restored, +68%, 147 listings) instead. (fix 1)
    challenge:
      "Suppressed listings, broken parent-child families and account-health flags had capped a $6.2M business. Advertising could not scale against a catalog that kept breaking.",
    whatWeDid: [
      { title: "Audited and triaged", body: "Every suppression and compliance flag was ranked by revenue at stake, so the first fixes were the ones that mattered most." },
      { title: "Rebuilt the catalog", body: "Variation families, attributes and content were restored so listings stayed live and ad spend reached working pages." },
      { title: "Held account health", body: "Policy, listing-quality and fulfillment metrics were monitored continuously so the business stayed stable as it recovered." },
    ],
    results:
      "147 listings were restored, annualized revenue grew 68%, and the $6.2M business was brought back to health.",
  },
  {
    slug: "vendor-central-recovery",
    category: "Home goods brand",
    channel: "Amazon Vendor Central",
    title: "Restoring PO fill rate on a 1P account.",
    intro:
      "A home goods brand’s Amazon Vendor Central business was losing margin to low fill rates, chargebacks and unclaimed shortages. We fixed the operations and recovered the revenue they covered.",
    capabilities: ["Revenue Recovery", "Marketplace Operations", "Analytics and Forecasting"],
    stats: [
      { value: "71% → 92%", label: "PO fill rate" },
      { value: "$14.0M", label: "Annual revenue" },
      { value: "$450K", label: "Shortage claims recovered" },
    ],
    beforeAfter: {
      metric: "Annual revenue",
      before: { label: "Before", value: "$10.5M", height: 75 },
      after: { label: "After", value: "$14.0M", height: 100 },
    },
    challenge:
      "Purchase-order fill rate sat at 71%, chargebacks were eroding margin, and shortage claims were going unfiled inside Amazon’s windows. Revenue could not grow while operations leaked at every step.",
    whatWeDid: [
      { title: "Lifted fill rate", body: "We fixed the catalog, cost and lead-time data behind PO confirmations so the account could accept and ship a far larger share of what Amazon ordered." },
      { title: "Stopped the chargebacks", body: "The most expensive chargeback causes were traced to their operational source and corrected, so the same deductions stopped recurring." },
      { title: "Recovered what was owed", body: "Shortage and price-claim disputes were audited, filed and followed inside Amazon’s claim windows, returning cash the account had written off." },
    ],
    results:
      "PO fill rate rose from 71% to 92%, shortage disputes recovered $450K, and annual revenue grew from $10.5M to $14.0M.",
  },
];

export function getCaseStudyDetail(slug: string) {
  return caseStudyDetails.find((c) => c.slug === slug);
}
