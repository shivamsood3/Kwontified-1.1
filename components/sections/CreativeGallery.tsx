"use client";

import { useState } from "react";
import { Figure } from "@/components/ui/Figure";
import { cn } from "@/lib/cn";

type Item = {
  category: string;
  label: string;
  caption: string;
  img: string;
  ratio: "4/3" | "1/1" | "3/4" | "16/9";
};

const categories = [
  "All",
  "Photography",
  "AI image and video",
  "Video",
  "A+ Content",
  "Storefronts",
  "Social",
];

const items: Item[] = [
  { category: "A+ Content", label: "Premium A+ module, skincare", caption: "Premium skincare, Amazon US. Conversion from 8.2% to 12.1%.", img: "/work-img/cs-beauty.jpg", ratio: "4/3" },
  { category: "Photography", label: "Product and packaging, DTC launch", caption: "Launch photography, kept on brand across the catalog.", img: "/work-img/cs-launch.jpg", ratio: "3/4" },
  { category: "Video", label: "Video and streaming, Amazon DSP", caption: "Streaming TV and online video for in-market audiences.", img: "/work-img/cs-creator.jpg", ratio: "4/3" },
  { category: "Social", label: "Creator content, TikTok Shop", caption: "Creator partnerships briefed from what converts.", img: "/stock/tiktok-hero.jpg", ratio: "3/4" },
  { category: "Storefronts", label: "Storefront and retail, home & lifestyle", caption: "Storefront design mirrored to the retail environment.", img: "/stock/target-hero.jpg", ratio: "4/3" },
  { category: "AI image and video", label: "AI-generated scenes", caption: "On-brand volume for A+ and advertising, test-and-learn.", img: "/stock/ai-hero.jpg", ratio: "1/1" },
  { category: "Storefronts", label: "Marketplace storefront, grocery & retail", caption: "Navigation rebuilt around best sellers and new launches.", img: "/stock/walmart-hero.jpg", ratio: "4/3" },
  { category: "A+ Content", label: "Comparison modules, dashboard-driven", caption: "Modules briefed from the conversion data, not guesswork.", img: "/stock/mk-hero.jpg", ratio: "1/1" },
  { category: "Photography", label: "Creative review and reporting", caption: "Every piece measured on what it does to the numbers.", img: "/stock/ourwork-hero.jpg", ratio: "3/4" },
];

export function CreativeGallery() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition",
              active === c
                ? "border-ink bg-ink text-white"
                : "border-line text-muted hover:border-brand-300 hover:text-ink",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {filtered.map((i) => (
          <figure key={i.label}>
            <Figure ratio={i.ratio} src={i.img} alt={i.label} />
            <figcaption className="mt-2 text-sm text-muted">{i.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
