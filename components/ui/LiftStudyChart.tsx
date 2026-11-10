// On-palette lift-study illustration for the featured Perspectives card (§7.8,
// fix 9). Built from simple DataViz primitives — no stock photography.

export function LiftStudyChart() {
  return (
    <div className="relative flex aspect-video w-full flex-col justify-between bg-brand-50 p-6">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-brand-700">Lift study</p>
        <p className="text-micro text-muted">Purchase rate · illustrative</p>
      </div>

      <div className="flex items-end justify-center gap-12">
        <Bar heightPct={52} label="Unexposed" value="2.1%" fill="#C9CACC" />
        <Bar heightPct={100} label="Exposed" value="4.0%" fill="#00618D" valueClass="text-brand-700" />
      </div>

      <p className="flex items-center justify-center gap-2 text-[12px] font-medium text-brand-700">
        <span className="inline-block h-2 w-2 bg-brand-600" aria-hidden="true" />
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
}: {
  heightPct: number;
  label: string;
  value: string;
  fill: string;
  valueClass?: string;
}) {
  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <span className={`h-display text-[18px] ${valueClass}`}>{value}</span>
      <div className="flex h-28 w-full items-end">
        <div className="w-full" style={{ height: `${heightPct}%`, background: fill }} />
      </div>
      <span className="text-micro text-muted">{label}</span>
    </div>
  );
}
