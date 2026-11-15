import Link from "next/link";

export type LegalSection = { h: string; body: string[] };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      {/* Navy title band (§5.3) */}
      <section className="flex min-h-[240px] items-center border-b border-gold-500 bg-navy-900">
        <div className="container-kw py-14">
          <nav className="mb-5 flex items-center gap-2 text-sm text-white/55">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/80">{title}</span>
          </nav>
          <h1 className="h-display text-4xl text-white md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-white/60">Last updated {updated}</p>
        </div>
      </section>

      {/* Content on cream */}
      <section className="bg-cream-50">
        <div className="container-kw py-16">
          <div className="max-w-3xl">
            <p className="text-[1.0625rem] leading-relaxed text-ink-muted">{intro}</p>

            {sections.map((s) => (
              <section key={s.h} className="mt-10">
                <h2 className="h-display text-xl text-navy-900">{s.h}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-[1.0625rem] leading-relaxed text-ink-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <p className="mt-12 rounded-2xl border-l-[3px] border-gold-500 bg-cream-100 p-5 text-sm text-ink-muted">
              This page is a template for the Kwontified 1.1 build and should be reviewed and
              finalized by legal counsel before launch.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
