import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { CreativeGallery } from "@/components/sections/CreativeGallery";

export const metadata: Metadata = {
  title: "Creative work",
  description:
    "Photography, video, A+ Content and Storefronts from the Creative Studio — every piece shown with the client, the channel and the result.",
};

export default function CreativePage() {
  return (
    <>
      <PageHero
        eyebrow="Work · Creative"
        title="The work behind the numbers."
        intro="Photography, video, A+ Content and Storefronts from the Creative Studio. Every piece is shown with the client, the channel and the result."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/work" },
          { label: "Creative" },
        ]}
        cta={{ href: "/contact", label: "Request a creative review" }}
      />
      <section className="bg-white">
        <div className="container-kw py-16">
          <CreativeGallery />
        </div>
      </section>
      <CtaBand
        title="Want creative that moves the numbers?"
        body="Tell us the channel and the goal. We’ll show you what we would make and what it should do."
        cta={{ href: "/contact", label: "Request a creative review" }}
      />
    </>
  );
}
