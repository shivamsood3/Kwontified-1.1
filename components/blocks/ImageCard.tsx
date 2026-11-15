import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { img } from "@/lib/content/images";
import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

const ratioClass: Record<string, string> = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
};

/**
 * §5.0-5 — white card (radius 16), image on top, a chip, title, 2-line excerpt
 * and "LEARN MORE →". The image fills the card top with its radius on the top
 * corners only; hover scales the image to 1.03.
 */
export function ImageCard({
  href,
  imageId,
  imageAlt,
  ratio = "4/3",
  chip,
  meta,
  title,
  excerpt,
  cta = "Learn more",
  className,
}: {
  href: string;
  imageId: string;
  imageAlt?: string;
  ratio?: keyof typeof ratioClass;
  chip?: string;
  meta?: string;
  title: string;
  excerpt?: string;
  cta?: string;
  className?: string;
}) {
  const external = href.startsWith("http");
  const Cmp = external ? "a" : Link;
  const props = external ? { href, target: "_blank", rel: "noreferrer" } : { href };
  return (
    <Cmp
      {...(props as { href: string })}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-lift",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", ratioClass[ratio])}>
        <Img
          id={imageId}
          alt={imageAlt ?? img(imageId).alt}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {(chip || meta) && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {chip && (
              <span className="inline-flex items-center rounded-full border border-sand-300 px-2.5 py-1 text-[12px] leading-none text-ink-muted">
                {chip}
              </span>
            )}
            {meta && <span className="text-[12px] text-ink-faint">{meta}</span>}
          </div>
        )}
        <h3 className="h-display text-h3 text-navy-900">{title}</h3>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-small text-ink-muted">{excerpt}</p>
        )}
        <span className="learn-more mt-5 pt-1">
          {cta}
          <ui.ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Cmp>
  );
}
