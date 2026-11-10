// Perspectives posts that have a page but whose body copy is not yet written.
// They render as a titled "full article coming soon" page so the homepage and
// listing links resolve instead of 404ing (fix 5). Logged in CONTENT_TODO.md.
// The DSP guide has its own hand-written route and is not listed here.

export type PerspectivePost = {
  slug: string;
  title: string;
  dek: string;
  topic: string;
  channel: string;
  author?: string;
  comingSoon?: boolean;
};

export const perspectivePosts: PerspectivePost[] = [
  {
    slug: "rufus-listing-signals",
    title: "What Rufus reads on a listing, and what it ignores",
    dek: "How shopping assistants parse your detail page.",
    topic: "AI commerce",
    channel: "Amazon",
    comingSoon: true,
  },
  {
    slug: "conversion-8-to-12",
    title: "What moved conversion from 8.2% to 12.1%",
    dek: "The image tests and A+ modules behind a skincare lift.",
    topic: "Creative",
    channel: "Amazon",
    comingSoon: true,
  },
  {
    slug: "vendor-central-chargebacks",
    title: "The five Vendor Central chargeback causes that cost the most",
    dek: "Where 1P deductions come from, and how to stop them.",
    topic: "Operations",
    channel: "Amazon Vendor Central",
    comingSoon: true,
  },
];

export function getPerspectivePost(slug: string) {
  return perspectivePosts.find((p) => p.slug === slug);
}
