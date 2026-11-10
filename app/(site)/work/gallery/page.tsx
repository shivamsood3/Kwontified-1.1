import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
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
      <PageHero
        eyebrow="Work · Gallery"
        title="The work, at a glance."
        intro="A visual index of what the Creative Studio makes — photography, video, A+ Content, Storefronts and social. Filter by type, or see it all."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: "Gallery" },
        ]}
        cta={{ href: "/work", label: "See case studies with figures" }}
        secondaryCta={{ href: "/contact", label: "Request a creative review" }}
      />
      <section className="bg-white">
        <div className="container-kw py-16">
          <CreativeGallery />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
