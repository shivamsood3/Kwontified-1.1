import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { leaders, getLeader } from "@/lib/content/leadership";

export function generateStaticParams() {
  return leaders.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getLeader(slug);
  if (!l) return {};
  return { title: l.name, description: `${l.name} — ${l.role} at Kwontified.` };
}

export default async function LeaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getLeader(slug);
  if (!l) notFound();

  return (
    <>
      <section className="bg-white">
        <div className="container-kw py-14">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <Link href="/about" className="hover:text-ink">About</Link>
            <span className="text-line">/</span>
            <Link href="/about/leadership" className="hover:text-ink">Leadership</Link>
            <span className="text-line">/</span>
            <span className="text-ink">{l.name}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-[0.4fr_1fr] md:items-start">
            <Figure ratio="3/4" label={`Portrait — ${l.name}`} />
            <div>
              <h1 className="h-display text-4xl text-ink md:text-5xl">{l.name}</h1>
              <p className="mt-2 text-lg text-brand-600">{l.role}</p>
              <p className="mt-6 text-[1.125rem] leading-relaxed text-slate-700">
                {l.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-kw py-14">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Speaks and writes on
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {l.topics.map((t) => (
              <div
                key={t}
                className="rounded-xl border border-line bg-white p-6 text-base font-medium text-ink"
              >
                {t}
              </div>
            ))}
          </div>
          <Link href="/perspectives" className="link-underline mt-8 inline-flex text-sm">
            Articles and commentary →
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
