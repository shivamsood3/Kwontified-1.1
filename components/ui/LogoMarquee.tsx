"use client";

import { useState } from "react";
import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

export type LogoItem = { src: string; label: string };

function Row({
  logos,
  reverse,
  paused,
  h,
}: {
  logos: LogoItem[];
  reverse?: boolean;
  paused: boolean;
  h: number;
}) {
  // Duplicate the set so the loop is seamless; the copy is hidden from AT.
  const render = (ariaHidden: boolean) =>
    logos.map((l, i) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={(ariaHidden ? "b" : "a") + i}
        src={l.src}
        alt={ariaHidden ? "" : l.label}
        aria-hidden={ariaHidden || undefined}
        loading="lazy"
        style={{ height: h }}
        className="mx-8 w-auto max-w-[150px] shrink-0 object-contain opacity-60 grayscale transition hover:opacity-100"
      />
    ));
  return (
    <div className="marquee">
      <div className={cn("marquee-track items-center", reverse && "rev", paused && "paused")}>
        {render(false)}
        {render(true)}
      </div>
    </div>
  );
}

/** Static wrapped grid (Featured-in, full client grid on /about and /work). */
export function LogoGrid({
  logos,
  height = 28,
  className,
}: {
  logos: LogoItem[];
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-6",
        className,
      )}
    >
      {logos.map((l) => (
        <div key={l.src} className="flex min-w-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={l.src}
            alt={l.label}
            loading="lazy"
            style={{ height }}
            className="w-auto max-w-full object-contain opacity-60 grayscale transition hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}

export function LogoMarquee({
  logos,
  rows = 2,
  height = 28,
  label,
}: {
  logos: LogoItem[];
  rows?: 1 | 2;
  height?: number;
  label?: string;
}) {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(logos.length / 2);
  const rowSets = rows === 2 ? [logos.slice(0, half), logos.slice(half)] : [logos];

  return (
    <div>
      <div className="flex items-center justify-between">
        {label && <p className="text-caption text-muted">{label}</p>}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="ml-auto inline-flex items-center gap-1.5 border border-ink-300 px-2.5 py-1 text-[13px] text-muted transition hover:border-brand-600 hover:text-ink"
        >
          {paused ? <ui.Play size={14} weight="fill" /> : <ui.Pause size={14} weight="fill" />}
          {paused ? "Play logos" : "Pause logos"}
        </button>
      </div>
      <div className="mt-6 space-y-6">
        {rowSets.map((set, i) => (
          <Row key={i} logos={set} reverse={i % 2 === 1} paused={paused} h={height} />
        ))}
      </div>
    </div>
  );
}
