import { cn } from "@/lib/cn";

type Bar = { label: string; value: string; height: number };

/**
 * §4.9 — before/after column chart with value labels at the bar tops.
 * grey "before", blue "after". Themed by tone; carries an aria-label summary.
 */
export function BeforeAfterBars({
  before,
  after,
  tone = "dark",
  ariaLabel,
  height = 120,
}: {
  before: Bar;
  after: Bar;
  tone?: "dark" | "light";
  ariaLabel?: string;
  height?: number;
}) {
  const dark = tone === "dark";
  const bars = [
    { ...before, fill: dark ? "rgba(255,255,255,0.22)" : "#C9CACC" },
    { ...after, fill: dark ? "#99C0D1" : "#00618D", accent: true },
  ];
  return (
    <div
      role="img"
      aria-label={
        ariaLabel ??
        `${before.label} ${before.value} rising to ${after.label} ${after.value}`
      }
      className="flex items-end gap-5"
    >
      {bars.map((b) => (
        <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
          <span className={cn("h-display text-[18px]", dark ? "text-white" : "text-ink")}>
            {b.value}
          </span>
          <div className="flex w-full items-end" style={{ height }}>
            <div className="w-full" style={{ height: `${b.height}%`, background: b.fill }} />
          </div>
          <span className={cn("text-micro", dark ? "text-white/55" : "text-muted")}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
