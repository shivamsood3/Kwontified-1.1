import { Button } from "./Button";

export function CtaBand({
  title = "See what your marketplaces could return.",
  body = "Share your channels and goals. A member of our team replies within one business day with a first read on where the growth is.",
  cta = { href: "/contact", label: "Request a marketplace review" },
}: {
  title?: string;
  body?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="relative overflow-hidden bg-brand-700">
      <div className="bg-ecom-blue absolute inset-0 opacity-45" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 120% at 85% 0%, rgba(255,255,255,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="container-kw relative flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h2 className="h-display text-3xl text-white md:text-4xl">{title}</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-white/80">
            {body}
          </p>
        </div>
        <Button href={cta.href} variant="light" size="lg" className="shrink-0">
          {cta.label}
        </Button>
      </div>
    </section>
  );
}
