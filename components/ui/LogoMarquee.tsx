"use client";

import { useState } from "react";
import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

export type LogoItem = { src: string; label: string };

function Row({
  logos,
  reverse,
  paused,
}: {
  logos: LogoItem[];
  reverse?: boolean;
  paused: boolean;
}) {
  // Each logo is normalised into the same box: 32×120 on mobile, 40×150 on
  // desktop, object-contain so none renders oversized (fix 14).
  const render = (ariaHidden: boolean) =>
    logos.map((l, i) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={(ariaHidden ? "b" : "a") + i}
        src={l.src}
        alt={ariaHidden ? "" : l.label}
        aria-hidden={ariaHidden || undefined}
        loading="lazy"
        className="mx-6 h-8 w-auto max-w-[120px] shrink-0 object-contain opacity-60 grayscale transition hover:opacity-100 sm:mx-8 sm:h-10 sm:max-w-[150px]"
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
  height = 32,
  boxed = false,
  className,
}: {
  logos: LogoItem[];
  /** Desktop height in px; capped to 32px on mobile so nothing renders oversized. */
  height?: number;
  /** Render each logo in a uniform bordered cell for a balanced, calm grid. */
  boxed?: boolean;
  className?: string;
}) {
  if (boxed) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
        {logos.map((l) => (
          <div
            key={l.src}
            className="flex aspect-[5/2] items-center justify-center border border-line p-5 transition-colors hover:border-ink-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={l.src}
              alt={l.label}
              loading="lazy"
              className="max-h-7 w-auto max-w-[72%] object-contain opacity-70 grayscale transition hover:opacity-100 sm:max-h-8"
            />
          </div>
        ))}
      </div>
    );
  }
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
            className="max-h-8 w-auto max-w-full object-contain opacity-70 grayscale transition hover:opacity-100 sm:max-h-none"
          />
        </div>
      ))}
    </div>
  );
}

export function LogoMarquee({
  logos,
  rows = 2,
  label,
}: {
  logos: LogoItem[];
  rows?: 1 | 2;
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
          <Row key={i} logos={set} reverse={i % 2 === 1} paused={paused} />
        ))}
      </div>
    </div>
  );
}
