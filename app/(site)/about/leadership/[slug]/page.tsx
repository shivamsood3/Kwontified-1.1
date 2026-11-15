import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { InitialsTile } from "@/components/ui/InitialsTile";
import { JsonLd } from "@/components/seo/JsonLd";
import { personLd, breadcrumbLd } from "@/lib/seo";
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
  return {
    title: l.name,
    description: `${l.name} — ${l.role} at Kwontified.`,
    alternates: { canonical: `/about/leadership/${l.slug}` },
  };
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
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Leadership", path: "/about/leadership" },
            { name: l.name, path: `/about/leadership/${l.slug}` },
          ]),
          personLd({ name: l.name, role: l.role, bio: l.bio, path: `/about/leadership/${l.slug}` }),
        ]}
      />
      <section className="bg-cream-50">
        <div className="container-kw py-16">
          <nav className="mb-8 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <Link href="/about" className="hover:text-navy-900">About</Link>
            <span className="text-sand-300">/</span>
            <Link href="/about/leadership" className="hover:text-navy-900">Leadership</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">{l.name}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-[0.4fr_1fr] md:items-start">
            <InitialsTile name={l.name} className="max-w-[220px]" />
            <div>
              <h1 className="h-display text-4xl text-navy-900 md:text-5xl">{l.name}</h1>
              <p className="mt-2 text-lg text-gold-700">{l.role}</p>
              <p className="mt-6 text-[1.125rem] leading-relaxed text-ink-muted">
                {l.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="container-kw py-16">
          <h2 className="eyebrow">Speaks and writes on</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {l.topics.map((t) => (
              <div
                key={t}
                className="rounded-2xl bg-white p-6 text-base font-medium text-navy-900 shadow-card"
              >
                {t}
              </div>
            ))}
          </div>
          <Link href="/perspectives" className="learn-more mt-8">
            Articles and commentary →
          </Link>
        </div>
      </section>

      <PromoBanner imageId="promo-about" />
    </>
  );
}
