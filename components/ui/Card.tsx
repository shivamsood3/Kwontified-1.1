import Link from "next/link";
import { Figure } from "./Figure";
import { Chip } from "./Chip";
import { cn } from "@/lib/cn";

type Ratio = "3/2" | "4/5" | "16/9" | "1/1";

/**
 * §4.7 — editorial card. No radius/shadow. Image on top, meta chips, h3 title,
 * excerpt. Hover: image scales 1.03 inside a clipped frame.
 */
export function Card({
  href,
  img,
  imgAlt,
  ratio = "3/2",
  visual,
  chips,
  meta,
  title,
  excerpt,
  className,
}: {
  href: string;
  img?: string;
  imgAlt?: string;
  ratio?: Ratio;
  /** Render a custom node (e.g. a chart) in the image slot instead of a photo. */
  visual?: React.ReactNode;
  chips?: string[];
  meta?: string;
  title: string;
  excerpt?: string;
  className?: string;
}) {
  const external = href.startsWith("http");
  const Cmp = external ? "a" : Link;
  const props = external ? { href, target: "_blank", rel: "noreferrer" } : { href };
  return (
    <Cmp {...(props as { href: string })} className={cn("group flex flex-col", className)}>
      <div className="overflow-hidden">
        {visual ? (
          visual
        ) : (
          <Figure
            src={img}
            alt={imgAlt ?? title}
            ratio={ratio}
            rounded=""
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      {(chips?.length || meta) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {chips?.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
          {meta && <span className="text-[13px] text-muted">{meta}</span>}
        </div>
      )}
      <h3 className="h-display mt-3 text-h3 text-ink group-hover:text-brand-700">
        {title}
      </h3>
      {excerpt && <p className="mt-2 text-small text-muted">{excerpt}</p>}
    </Cmp>
  );
}
