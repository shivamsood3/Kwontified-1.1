import { cn } from "@/lib/cn";

/** §4.5 — square tag. 1px border, 13px, 4/8px padding. */
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
        "inline-flex items-center border px-2 py-1 text-[13px] leading-none",
        tone === "dark" && "border-white/25 text-white/80",
        tone === "brand" && "border-brand-600 text-brand-600",
        tone === "light" && "border-ink-300 text-ink-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
