import { cn } from "@/lib/cn";

/** §5.3 — navy tile with gold initials. No headshots, no generated people. */
export function InitialsTile({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex aspect-square items-center justify-center rounded-2xl bg-navy-900",
        className,
      )}
    >
      <span className="h-display text-[clamp(32px,6vw,56px)] font-medium text-gold-300">{initials}</span>
    </div>
  );
}
