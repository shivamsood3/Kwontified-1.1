import type { Metadata } from "next";
import { CollageHero } from "@/components/blocks/CollageHero";
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
      <CollageHero
        eyebrow="Work · Gallery"
        title="The work, at a glance."
        intro="A visual index of what the Creative Studio makes — photography, video, A+ Content, Storefronts and social. Filter by type, or see it all."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: "Gallery" }]}
        ids={["creative-skincare", "creative-accessories", "creative-outdoor", "creative-beauty"]}
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
