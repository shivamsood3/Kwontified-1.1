import { cn } from "@/lib/cn";

/**
 * §5.0-8 — a tablet frame built in CSS holding a coded skeleton dashboard:
 * navy top bar, a card title, grey skeleton lines, a small gold bar chart and a
 * sage "Healthy" pill. No AI-generated UI. On a channel page the top bar shows
 * the marketplace logo (white) via `logo`; capability pages pass the wordmark.
 */
export function DeviceFrame({
  title = "Account Health",
  logo,
  className,
}: {
  title?: string;
  logo?: React.ReactNode;
  className?: string;
}) {
  const bars = [38, 56, 44, 72, 60, 88];
  return (
    <div
      className={cn(
        "rounded-[22px] bg-navy-950 p-3 shadow-pop md:p-4",
        className,
      )}
    >
      <div className="overflow-hidden rounded-xl bg-white">
        {/* top bar */}
        <div className="flex items-center justify-between bg-navy-900 px-4 py-3">
          <div className="flex h-5 items-center">
            {logo ?? <span className="text-[13px] font-medium tracking-tight text-white">Kwontified</span>}
          </div>
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="h-2 w-2 rounded-full bg-gold-500" />
          </div>
        </div>
        {/* body */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-small font-medium text-navy-900">{title}</p>
            <span className="rounded-full bg-[#E4EEDF] px-2.5 py-1 text-[11px] font-medium text-[#3F6B45]">
              Healthy
            </span>
          </div>
          {/* skeleton lines */}
          <div className="mt-4 space-y-2.5" aria-hidden="true">
            <div className="h-2.5 w-3/4 rounded-full bg-sand-200" />
            <div className="h-2.5 w-2/3 rounded-full bg-sand-200" />
            <div className="h-2.5 w-1/2 rounded-full bg-sand-200" />
          </div>
          {/* gold bar chart */}
          <div className="mt-6 flex h-24 items-end gap-2" aria-hidden="true">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gold-500"
                style={{ height: `${h}%`, opacity: 0.55 + i * 0.07 }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg bg-cream-100 p-3">
                <div className="h-2 w-8 rounded-full bg-sand-300" />
                <div className="mt-2 h-3 w-12 rounded-full bg-navy-900/70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
