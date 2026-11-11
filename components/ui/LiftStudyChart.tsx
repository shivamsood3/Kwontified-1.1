// On-palette lift-study illustration (§7.8, fixes 9 + blue-box request).
// Light: used in the featured Perspectives card on the homepage (16/9).
// Dark + fill: fills the featured card's right panel on /perspectives.
import { cn } from "@/lib/cn";

export function LiftStudyChart({
  tone = "light",
  fill = false,
}: {
  tone?: "light" | "dark";
  fill?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between p-6",
        fill ? "h-full min-h-[260px]" : "aspect-video",
        dark ? "bg-white/[0.03]" : "bg-brand-50",
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-[13px] font-medium", dark ? "text-brand-300" : "text-brand-700")}>
          Lift study
        </p>
        <p className={cn("text-micro", dark ? "text-white/50" : "text-muted")}>
          Purchase rate · illustrative
        </p>
      </div>

      <div className="flex items-end justify-center gap-12">
        <Bar
          heightPct={52}
          label="Unexposed"
          value="2.1%"
          fill={dark ? "rgba(255,255,255,0.22)" : "#C9CACC"}
          valueClass={dark ? "text-white/80" : "text-ink"}
          dark={dark}
        />
        <Bar
          heightPct={100}
          label="Exposed"
          value="4.0%"
          fill={dark ? "#99C0D1" : "#00618D"}
          valueClass={dark ? "text-white" : "text-brand-700"}
          dark={dark}
        />
      </div>

      <p
        className={cn(
          "flex items-center justify-center gap-2 text-[12px] font-medium",
          dark ? "text-brand-300" : "text-brand-700",
        )}
      >
        <span
          className="inline-block h-2 w-2"
          style={{ background: dark ? "#99C0D1" : "#00618D" }}
          aria-hidden="true"
        />
        Incremental lift: the gap between exposed and unexposed
      </p>
    </div>
  );
}

function Bar({
  heightPct,
  label,
  value,
  fill,
  valueClass = "text-ink",
  dark,
}: {
  heightPct: number;
  label: string;
  value: string;
  fill: string;
  valueClass?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <span className={cn("h-display text-[18px]", valueClass)}>{value}</span>
      <div className="flex h-28 w-full items-end">
        <div className="w-full" style={{ height: `${heightPct}%`, background: fill }} />
      </div>
      <span className={cn("text-micro", dark ? "text-white/55" : "text-muted")}>{label}</span>
    </div>
  );
}
