import { cn } from "@/lib/cn";

/** §2.4 — pill tag. 1px sand-300 border, 13px, 4/8px padding. */
export function Chip({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "brand";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[13px] leading-none",
        tone === "dark" && "border-white/25 text-white/80",
        tone === "brand" && "border-gold-500 text-gold-700",
        tone === "light" && "border-sand-300 text-ink-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
