import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";
import { StatRow, type StatItem } from "./StatRow";
import { cn } from "@/lib/cn";

/**
 * §5.0-4 — image on one side (4:5, radius 16), text on the other: eyebrow with
 * rule, H2, paragraph, optional stat row with dividers, then an outline button.
 * Alternate image left/right down a page with `reverse`.
 */
export function FeatureSplit({
  eyebrow,
  title,
  children,
  imageId,
  imageRatio = "aspect-[4/5]",
  stats,
  cta,
  reverse,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  imageId: string;
  imageRatio?: string;
  stats?: StatItem[];
  cta?: { href: string; label: string };
  reverse?: boolean;
  tone?: "light" | "navy";
  className?: string;
}) {
  const dark = tone === "navy";
  return (
    <div className={cn("grid items-center gap-10 md:grid-cols-2 md:gap-16", className)}>
      <div className={cn("relative overflow-hidden rounded-2xl", imageRatio, reverse && "md:order-2")}>
        <Img id={imageId} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        {eyebrow && <p className={dark ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>}
        <h2 className={cn("h-display mt-4 text-h2", dark ? "text-white" : "text-navy-900")}>
          {title}
        </h2>
        {children && (
          <div className={cn("prose-kw mt-5 space-y-4 text-body", dark && "[&_p]:text-white/75")}>
            {children}
          </div>
        )}
        {stats && stats.length > 0 && (
          <StatRow stats={stats} tone={tone} className="mt-8" />
        )}
        {cta && (
          <div className="mt-8">
            <Button href={cta.href} variant={dark ? "outline-light" : "outline"} arrow>
              {cta.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
