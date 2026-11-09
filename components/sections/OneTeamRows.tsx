"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IconTile } from "@/components/ui/IconTile";
import { Callout } from "@/components/ui/Callout";
import { capabilityIcons, pillarToCapability, ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

export type Pillar = {
  k: string;
  cap: string;
  href: string;
  desc: string;
  connect: string;
};

/** §7.5 — six pillar rows, white panels on grey, scroll-spy blue left rule. */
export function OneTeamRows({ rows }: { rows: Pillar[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.i);
            setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      {rows.map((r, i) => {
        const Icon = capabilityIcons[pillarToCapability[r.k]];
        const on = active === i;
        return (
          <div
            key={r.k}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "border-l-2 bg-white p-6 transition-colors sm:p-7",
              on ? "border-brand-600" : "border-transparent",
            )}
          >
            <div className="flex items-start gap-4">
              <IconTile icon={Icon} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="h-display text-h3 text-ink">{r.k}</h3>
                  <Link
                    href={r.href}
                    className="inline-flex shrink-0 items-center gap-1 text-small font-medium text-brand-600 hover:text-brand-700"
                  >
                    {r.cap}
                    <ui.ArrowRight size={14} />
                  </Link>
                </div>
                <p className="mt-2 text-small leading-relaxed text-ink-700">{r.desc}</p>
                <Callout label="How it connects." className="mt-4">
                  {r.connect}
                </Callout>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
