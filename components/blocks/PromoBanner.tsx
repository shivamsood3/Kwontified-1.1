/**
 * v1.2 — the pre-footer CTA now lives in the global Footer, so the per-page
 * PromoBanner is a no-op to avoid a duplicate call-to-action. Kept as a
 * component so existing page imports continue to compile.
 */
export function PromoBanner(_props: {
  imageId?: string;
  title?: string;
  body?: string;
  cta?: { href: string; label: string };
}) {
  return null;
}
