import { cn } from "@/lib/cn";

/** §4.10 — blue-100 panel with a 2px blue-600 left rule. */
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
      className={cn("border-l-2 border-brand-600 bg-brand-100 px-5 py-4", className)}
    >
      {label && (
        <p className="text-[13px] font-medium text-brand-700">{label}</p>
      )}
      <div className={cn("text-small leading-relaxed text-ink-700", label && "mt-1")}>
        {children}
      </div>
    </div>
  );
}
