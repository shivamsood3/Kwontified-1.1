import type { Metadata } from "next";
import { InnerHero } from "@/components/blocks/InnerHero";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Quote } from "@/components/ui/Quote";
import { LogoGrid } from "@/components/ui/LogoMarquee";
import { clientLogos } from "@/lib/logos";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across Amazon, Walmart and Target Plus — each with its starting point, what we did, and the outcome in numbers.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <InnerHero
        eyebrow="Work"
        title="Results, with the numbers."
        intro="Engagements across Amazon, Walmart and Target Plus — each with its starting point, what we did, and the outcome."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        imageId="work12-hero" cta={{ href: "/contact", label: "Request a marketplace review" }}
      />

      <section className="bg-cream-50">
        <div className="container-kw py-16 lg:py-20">
          <WorkGrid />
        </div>
      </section>

      {/* Featured-in / clients (white) */}
      <section className="border-y border-line bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-h2 text-navy-900">Brands behind the numbers.</h2>
          <p className="mt-3 max-w-xl text-body text-ink-muted">
            A selection of the consumer brands whose marketplace businesses we run.
          </p>
          <LogoGrid logos={clientLogos} boxed className="mt-10" />
        </div>
      </section>

      {/* Testimonial (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-20">
          <Quote tone="dark">
            “One team, one plan, and the numbers finally reconcile against our margin.”
          </Quote>
        </div>
      </section>

      <PromoBanner imageId="promo-work" />
    </>
  );
}
