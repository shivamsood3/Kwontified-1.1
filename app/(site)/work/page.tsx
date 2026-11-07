import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { Stat } from "@/components/ui/Stat";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across Amazon, Walmart and Target Plus — each with its starting point, what we did, and the outcome in numbers.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Results, with the numbers."
        intro="Engagements across Amazon, Walmart and Target Plus — each with its starting point, what we did, and the outcome."
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        cta={{ href: "/work/amazon-dsp", label: "Read the featured case study" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
            Featured · Amazon DSP, national beauty brand
          </p>
          <p className="h-display mt-3 text-xl text-white">
            $1.8M from DSP, with search intact.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <Stat value="9.4x" label="DSP ROAS" tone="dark" />
            <Stat value="+28%" label="New-to-brand" tone="dark" />
            <Stat value="+19%" label="Account revenue" tone="dark" />
          </div>
        </div>
      </PageHero>

      <section className="bg-white">
        <div className="container-kw py-16">
          <WorkGrid />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
