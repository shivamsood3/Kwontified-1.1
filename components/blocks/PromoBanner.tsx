import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";

/**
 * §5.0-6 — the single CTA before the footer. Contained, rounded (16px), ~560px
 * tall. Flat-lay image background with a navy overlay at 70%, centred white H2,
 * one line of copy and an outline-dark button.
 */
export function PromoBanner({
  imageId,
  title = "See what your marketplaces could return.",
  body = "Share your channels and goals. A member of our team replies within one business day with a first read on where the growth is.",
  cta = { href: "/contact", label: "Request a marketplace review" },
}: {
  imageId: string;
  title?: string;
  body?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="container-kw py-16 md:py-20">
      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl md:min-h-[520px]">
        <Img id={imageId} sizes="(max-width: 1312px) 100vw, 1312px" position="center" />
        <div className="absolute inset-0 bg-navy-900/75" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-6 py-16 text-center">
          <h2 className="h-display text-[clamp(28px,3.4vw,44px)] leading-[1.08] text-white">
            {title}
          </h2>
          {body && <p className="mx-auto mt-5 max-w-xl text-lead text-white/80">{body}</p>}
          <div className="mt-8 flex justify-center">
            <Button href={cta.href} variant="outline-light" size="lg">
              {cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
