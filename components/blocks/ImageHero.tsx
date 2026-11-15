import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";

/**
 * §5.0-1 — homepage hero. Full-bleed diptych: two square images 50/50, edge to
 * edge. Gradient over the left image; eyebrow, H1, intro and buttons in white,
 * vertically centred over the left. Mobile shows the left image at 4:5.
 */
export function ImageHero({
  eyebrow,
  title,
  intro,
  leftId,
  rightId,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  leftId: string;
  rightId: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="relative w-full border-b border-gold-500 bg-navy-900">
      <div className="relative grid min-h-[72vh] grid-cols-1 md:min-h-[min(90vh,900px)] md:grid-cols-2">
        {/* Left image + copy */}
        <div className="relative aspect-[4/5] md:aspect-auto">
          <Img
            id={leftId}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            position="center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(14,26,48,.82), rgba(14,26,48,.35) 70%, rgba(14,26,48,.15))",
            }}
            aria-hidden="true"
          />
          {/* bottom gradient helps mobile legibility */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: "linear-gradient(0deg, rgba(14,26,48,.85), transparent 60%)" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-end md:items-center">
            <div className="container-kw md:px-16">
              <div className="max-w-xl pb-10 md:pb-0">
                {eyebrow && <p className="eyebrow-light">{eyebrow}</p>}
                <h1 className="h-display mt-4 text-[clamp(34px,5vw,64px)] leading-[1.03] text-white">
                  {title}
                </h1>
                {intro && (
                  <p className="mt-5 max-w-lg text-lead text-white/80">{intro}</p>
                )}
                {(primary || secondary) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {primary && (
                      <Button href={primary.href} variant="primary" size="lg">
                        {primary.label}
                      </Button>
                    )}
                    {secondary && (
                      <Button href={secondary.href} variant="outline-light" size="lg">
                        {secondary.label}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Right image (hidden on mobile) */}
        <div className="relative hidden md:block">
          <Img id={rightId} priority sizes="50vw" position="center" />
        </div>
      </div>
    </section>
  );
}
