import type { Metadata } from "next";
import { PerspectivesBrowser } from "@/components/sections/PerspectivesBrowser";

export const metadata: Metadata = {
  title: "Perspectives",
  description:
    "What we learn running marketplaces for premium brands — written by the people doing the work, and dated so you know it is current.",
  alternates: { canonical: "/perspectives" },
};

export default function PerspectivesPage() {
  return (
    <section className="bg-white">
      <div className="container-kw py-16">
        <p className="eyebrow">Perspectives</p>
        <h1 className="h-display mt-3 text-4xl text-ink md:text-5xl">
          What we’re seeing in the market.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          What we learn running marketplaces for premium brands, written by the
          people doing the work and dated so you know it is current.
        </p>

        <div className="mt-10">
          <PerspectivesBrowser />
        </div>
      </div>
    </section>
  );
}
