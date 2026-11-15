import { cn } from "@/lib/cn";

/**
 * §2.4 — service check list. A 20px navy filled-circle check, 15px text, and a
 * sand-300 hairline under each row, in two columns on desktop.
 */
export function CheckList({
  items,
  columns = 2,
  tone = "light",
  className,
}: {
  items: { title: string; body?: string }[];
  columns?: 1 | 2;
  tone?: "light" | "navy";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <ul className={cn("grid gap-x-10", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((it) => (
        <li
          key={it.title}
          className={cn(
            "flex gap-3 border-b py-4",
            dark ? "border-white/12" : "border-sand-300",
          )}
        >
          <Check dark={dark} />
          <div className="min-w-0">
            <p className={cn("text-[15px] font-medium", dark ? "text-white" : "text-navy-900")}>
              {it.title}
            </p>
            {it.body && (
              <p className={cn("mt-1 text-small leading-relaxed", dark ? "text-white/65" : "text-ink-muted")}>
                {it.body}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Check({ dark }: { dark: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        dark ? "bg-gold-500 text-navy-900" : "bg-navy-900 text-white",
      )}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
