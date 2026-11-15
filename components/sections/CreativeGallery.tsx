"use client";

import { useState } from "react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

type Item = {
  category: string;
  label: string;
  caption: string;
  id: string;
  ratio: "4/3" | "1/1" | "3/4" | "16/9" | "4/5";
};

const categories = ["All", "Photography", "AI image and video", "Video", "A+ Content", "Storefronts", "Social"];

const ratioClass: Record<Item["ratio"], string> = {
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-video",
  "4/5": "aspect-[4/5]",
};

const items: Item[] = [
  { category: "A+ Content", label: "Premium A+ module, skincare", caption: "Premium skincare, Amazon US. Conversion from 8.2% to 12.1%.", id: "creative-skincare", ratio: "4/5" },
  { category: "Photography", label: "Product and packaging, DTC launch", caption: "Launch photography, kept on brand across the catalog.", id: "creative-beauty", ratio: "4/3" },
  { category: "Video", label: "Video and streaming, Amazon DSP", caption: "Streaming TV and online video for in-market audiences.", id: "case-creative", ratio: "16/9" },
  { category: "Social", label: "Creator content, TikTok Shop", caption: "Creator partnerships briefed from what converts.", id: "creative-swimwear", ratio: "4/5" },
  { category: "Storefronts", label: "Storefront and retail, home & lifestyle", caption: "Storefront design mirrored to the retail environment.", id: "creative-accessories", ratio: "4/3" },
  { category: "AI image and video", label: "AI-generated scenes", caption: "On-brand volume for A+ and advertising, test-and-learn.", id: "case-tula", ratio: "4/5" },
  { category: "Storefronts", label: "Marketplace storefront, grocery & retail", caption: "Navigation rebuilt around best sellers and new launches.", id: "case-kipling", ratio: "16/9" },
  { category: "A+ Content", label: "Comparison modules, dashboard-driven", caption: "Modules briefed from the conversion data, not guesswork.", id: "case-divi", ratio: "16/9" },
  { category: "Photography", label: "Creative review and reporting", caption: "Every piece measured on what it does to the numbers.", id: "creative-outdoor", ratio: "4/5" },
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
              "rounded-full border px-4 py-1.5 text-sm transition",
              active === c
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-sand-300 text-ink-muted hover:border-navy-900 hover:text-navy-900",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {filtered.map((i) => (
          <figure key={i.label}>
            <div className={cn("relative overflow-hidden rounded-2xl", ratioClass[i.ratio])}>
              <Img id={i.id} sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
            <figcaption className="mt-2 text-sm text-ink-muted">{i.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
