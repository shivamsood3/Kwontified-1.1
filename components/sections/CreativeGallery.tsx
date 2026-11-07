"use client";

import { useState } from "react";
import { Figure } from "@/components/ui/Figure";
import { cn } from "@/lib/cn";

type Item = {
  category: string;
  label: string;
  caption: string;
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
  { category: "Storefronts", label: "Storefront hero, luxury swimwear, Amazon Luxury Stores", caption: "Luxury swimwear, Amazon US, EU and UK. +204% over three years.", ratio: "4/3" },
  { category: "A+ Content", label: "Premium A+ comparison module, premium skincare", caption: "Premium skincare, Amazon US. Conversion from 8.2% to 12.1%.", ratio: "1/1" },
  { category: "Photography", label: "Main image set, accessories brand", caption: "Global accessories, Amazon and Target Plus. 11.1x Amazon ROAS.", ratio: "3/4" },
  { category: "Photography", label: "Lifestyle photography, beauty", caption: "National beauty brand, Amazon US. Prospecting creative for DSP.", ratio: "4/3" },
  { category: "AI image and video", label: "AI product scenes, home goods", caption: "Home goods, Amazon. On-brand volume for A+ and ads.", ratio: "1/1" },
  { category: "Video", label: "DSP video, luxury swimwear", caption: "Streaming TV and online video for in-market audiences.", ratio: "16/9" },
  { category: "Social", label: "Creator content, TikTok Shop", caption: "Creator partnerships briefed from what converts.", ratio: "3/4" },
  { category: "Storefronts", label: "Brand Store refresh, outdoor gear", caption: "Rebuilt navigation around best sellers and new launches.", ratio: "4/3" },
  { category: "A+ Content", label: "Premium A+ brand story, supplements", caption: "Review-led modules that answer the shopper’s real questions.", ratio: "1/1" },
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
            <Figure ratio={i.ratio} label={i.label} />
            <figcaption className="mt-2 text-sm text-muted">{i.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
