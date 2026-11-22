import type { Metadata } from "next";
import { InnerHero } from "@/components/blocks/InnerHero";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PerspectivesExplorer } from "@/components/sections/PerspectivesExplorer";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { featuredArticle, perspectiveFaqs, articleImage } from "@/lib/content/perspectives";

export const metadata: Metadata = {
  title: "Perspectives: Marketplace Insights",
  description:
    "What we learn running marketplaces for premium brands, written by the people doing the work and dated so you know it is current. Articles, news, white papers and press releases.",
  alternates: { canonical: "/perspectives" },
};

export default function PerspectivesPage() {
  const f = featuredArticle;
  return (
    <>
      <InnerHero
        eyebrow="Perspectives"
        title="What we’re seeing in the market."
        intro="What we learn running marketplaces for premium brands, written by the people doing the work and dated so you know it is current. You’ll find articles on how we run marketplaces, news on platform changes, white papers built on our own data, and press releases."
        crumbs={[{ label: "Home", href: "/" }, { label: "Perspectives" }]}
        imageId="persp12-hero"
      />

      {/* Featured article (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <FeatureSplit
            eyebrow={`Featured · ${f.topic} · ${f.author}`}
            title={f.title}
            imageId={articleImage(f.slug)}
            cta={{ href: `/perspectives/${f.slug}`, label: "Read the article" }}
          >
            <p>{f.dek}</p>
          </FeatureSplit>
        </div>
      </section>

      {/* Explorer: search + filters + articles + news + press (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <PerspectivesExplorer />
        </div>
      </section>

      {/* FAQ (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <FaqAccordion items={perspectiveFaqs} heading="Questions readers ask" />
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
