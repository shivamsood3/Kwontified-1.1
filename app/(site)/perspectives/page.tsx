import type { Metadata } from "next";
import { CollageHero } from "@/components/blocks/CollageHero";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { perspectivePosts } from "@/lib/content/perspectivePosts";

export const metadata: Metadata = {
  title: "Perspectives",
  description:
    "What we learn running marketplaces for premium brands — written by the people doing the work, and dated so you know it is current.",
  alternates: { canonical: "/perspectives" },
};

const postImage: Record<string, string> = {
  "rufus-listing-signals": "post-rufus",
  "conversion-8-to-12": "post-conversion",
  "vendor-central-chargebacks": "post-chargebacks",
};

export default function PerspectivesPage() {
  return (
    <>
      <CollageHero
        eyebrow="Perspectives"
        title="What we’re seeing in the market."
        intro="What we learn running marketplaces for premium brands, written by the people doing the work and dated so you know it is current."
        crumbs={[{ label: "Home", href: "/" }, { label: "Perspectives" }]}
        ids={["persp-a", "persp-b", "persp-c"]}
      />

      {/* Featured article split (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <FeatureSplit
            eyebrow="This month’s featured article · Priyanka Shah"
            title="Is your Amazon DSP spend incremental?"
            imageId="post-dsp"
            cta={{ href: "/perspectives/amazon-dsp-incrementality", label: "Read the guide" }}
          >
            <p>
              Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show
              what it caused — the test design we use before scaling a DSP budget.
            </p>
          </FeatureSplit>
        </div>
      </section>

      {/* Latest posts (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Latest</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {perspectivePosts.map((p) => (
              <ImageCard
                key={p.slug}
                href={`/perspectives/${p.slug}`}
                imageId={postImage[p.slug] ?? "post-rufus"}
                ratio="4/3"
                chip={p.topic}
                title={p.title}
                excerpt={p.dek}
                cta="Read"
              />
            ))}
          </div>
        </div>
      </section>

      <PromoBanner
        imageId="promo-about"
        title="Want this read on your own channels?"
        body="Share where you sell and what you want to grow. We reply within one business day."
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      />
    </>
  );
}
