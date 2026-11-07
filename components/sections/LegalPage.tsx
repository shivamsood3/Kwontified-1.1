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
    <section className="bg-white">
      <div className="container-kw py-16">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="text-line">/</span>
          <span className="text-ink">{title}</span>
        </nav>

        <h1 className="h-display text-4xl text-ink md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>

        <div className="mt-8 max-w-3xl">
          <p className="text-[1.0625rem] leading-relaxed text-slate-600">{intro}</p>

          {sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="h-display text-xl text-ink">{s.h}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-[1.0625rem] leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <p className="mt-12 rounded-xl border border-line bg-paper p-5 text-sm text-muted">
            This page is a template for the Kwontified 1.1 build and should be
            reviewed and finalized by legal counsel before launch.
          </p>
        </div>
      </div>
    </section>
  );
}
