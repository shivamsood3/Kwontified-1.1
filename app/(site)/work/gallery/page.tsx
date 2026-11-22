import type { Metadata } from "next";
import { InnerHero } from "@/components/blocks/InnerHero";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { CreativeGallery } from "@/components/sections/CreativeGallery";

export const metadata: Metadata = {
  title: "Work gallery",
  description:
    "A visual index of the work — photography, video, A+ Content, Storefronts and social — filterable by type, each piece shown with its channel and result.",
  alternates: { canonical: "/work/gallery" },
};

export default function WorkGalleryPage() {
  return (
    <>
      <InnerHero
        eyebrow="Work · Gallery"
        title="The work, at a glance."
        intro="A visual index of what the Creative Studio makes — photography, video, A+ Content, Storefronts and social. Filter by type, or see it all."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: "Gallery" }]}
        imageId="home12-pillar-made"
      />
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <CreativeGallery />
        </div>
      </section>
      <PromoBanner imageId="promo-work" />
    </>
  );
}
