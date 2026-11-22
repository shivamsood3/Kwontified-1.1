import type { Metadata } from "next";
import { InnerHero } from "@/components/blocks/InnerHero";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { CreativeGallery } from "@/components/sections/CreativeGallery";

export const metadata: Metadata = {
  title: "Creative work",
  description:
    "Photography, video, A+ Content and Storefronts from the Creative Studio — every piece shown with the client, the channel and the result.",
  alternates: { canonical: "/work/creative" },
};

export default function CreativePage() {
  return (
    <>
      <InnerHero
        eyebrow="Work · Creative"
        title="The work behind the numbers."
        intro="Photography, video, A+ Content and Storefronts from the Creative Studio. Every piece is shown with the client, the channel and the result."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: "Creative" }]}
        imageId="home12-pillar-made"
      />
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <CreativeGallery />
        </div>
      </section>
      <PromoBanner
        imageId="promo-work"
        title="Want creative that moves the numbers?"
        body="Tell us the channel and the goal. We’ll show you what we would make and what it should do."
        cta={{ href: "/contact", label: "Request a creative review" }}
      />
    </>
  );
}
