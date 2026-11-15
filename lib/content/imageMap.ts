// Maps capability/channel page slugs to their generated image-id stems.
// Page slugs (lib/nav.ts) differ from the short stems used in images.ts.

const capStem: Record<string, string> = {
  "retail-media": "cap-retail-media",
  "creative-studio": "cap-creative",
  "marketplace-operations": "cap-ops",
  analytics: "cap-analytics",
  "ai-commerce": "cap-ai-commerce",
  "revenue-recovery": "cap-revenue-recovery",
};

const chStem: Record<string, string> = {
  amazon: "ch-amazon",
  walmart: "ch-walmart",
  "target-plus": "ch-target-plus",
  international: "ch-international",
  zalando: "ch-zalando",
  "mercado-libre": "ch-mercado-libre",
  temu: "ch-temu",
  "tiktok-shop": "ch-tiktok",
  "instagram-shop": "ch-instagram",
};

/** Image stem for a capability slug, e.g. "retail-media" → "cap-retail-media". */
export function capImage(slug: string): string | null {
  return capStem[slug] ?? null;
}

/** Image stem for a channel slug, e.g. "tiktok-shop" → "ch-tiktok". */
export function chImage(slug: string): string | null {
  return chStem[slug] ?? null;
}
