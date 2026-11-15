import { cn } from "@/lib/cn";

export type StatItem = { value: string; label: string; prefix?: string; suffix?: string };

/**
 * §2.2 — big stats with 1px vertical dividers. 64–72px, weight 500, ink on
 * light / gold-300 on navy, a small super prefix/suffix, 14px ink-muted labels.
 */
export function StatRow({
  stats,
  tone = "light",
  className,
}: {
  stats: StatItem[];
  tone?: "light" | "navy";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <dl
      className={cn(
        "grid",
        stats.length >= 4 ? "grid-cols-2 md:grid-cols-4" : stats.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "px-0 py-3 sm:px-6 sm:py-0",
            i > 0 && "sm:border-l",
            dark ? "sm:border-white/15" : "sm:border-sand-300",
            i === 0 && "sm:pl-0",
          )}
        >
          <dd
            className={cn(
              "font-medium leading-none tracking-tightish",
              "text-[clamp(44px,5vw,68px)]",
              dark ? "text-gold-300" : "text-ink",
            )}
          >
            {s.prefix && <sup className="top-[-0.5em] text-[0.42em] font-medium">{s.prefix}</sup>}
            {s.value}
            {s.suffix && <sup className="top-[-0.5em] text-[0.42em] font-medium">{s.suffix}</sup>}
          </dd>
          <dt className={cn("mt-3 text-caption", dark ? "text-white/65" : "text-ink-muted")}>
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
