// Single source of truth for the homepage "Results" cards (fix 1).
// Each card's headline value, before/after bars and fallback stats are read
// from the case study itself (lib/content/caseStudies.ts), so the homepage
// can never drift from the published case study. An unknown slug throws at
// module load, which fails the build.

import { getCaseStudyDetail } from "@/lib/content/caseStudies";

export type ResultCard = {
  slug: string;
  value: string;
  chip: string;
  body: string;
  link: string;
  href: string;
  beforeAfter?: {
    before: { label: string; value: string; height: number };
    after: { label: string; value: string; height: number };
  };
  stats?: { value: string; label: string }[];
};

function card(slug: string, chip: string, body: string, link: string): ResultCard {
  const cs = getCaseStudyDetail(slug);
  if (!cs) throw new Error(`metrics.ts: no case study for slug "${slug}"`);
  return {
    slug,
    chip,
    body,
    link,
    href: `/work/${slug}`,
    value: cs.stats[0].value,
    beforeAfter: cs.beforeAfter
      ? { before: cs.beforeAfter.before, after: cs.beforeAfter.after }
      : undefined,
    // When there is no verified before/after pair, show the confirmed stats.
    stats: cs.beforeAfter ? undefined : cs.stats.slice(0, 2),
  };
}

export const homepageResults: ResultCard[] = [
  card(
    "walmart-sku-transition",
    "Walmart",
    "Combined Walmart revenue for a consumer health brand through a major SKU transition, with supplier ROAS up from 3.0x to 4.2x.",
    "Read the Walmart case study",
  ),
  card(
    "international-expansion",
    "UK · EU · CA",
    "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    "Read the international case study",
  ),
  card(
    "account-health-restore",
    "Amazon",
    "A leading CPG brand’s collapsed $6.2M Amazon business, restored, with annualized revenue up 68%.",
    "Read the account health case study",
  ),
];
