import { cn } from "@/lib/cn";

/** §2.4 — cream-100 panel with a 3px gold-500 left rule. */
export function Callout({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-lg border-l-[3px] border-gold-500 bg-cream-100 px-5 py-4", className)}
    >
      {label && (
        <p className="text-[13px] font-medium text-gold-700">{label}</p>
      )}
      <div className={cn("text-small leading-relaxed text-ink-700", label && "mt-1")}>
        {children}
      </div>
    </div>
  );
}
