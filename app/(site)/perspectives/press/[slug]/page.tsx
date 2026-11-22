import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { pressReleases, getPress } from "@/lib/content/perspectives";

export function generateStaticParams() {
  return pressReleases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPress(slug);
  if (!p) return {};
  return { title: p.title, description: p.dek ?? p.title, alternates: { canonical: `/perspectives/press/${p.slug}` } };
}

export default async function PressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPress(slug);
  if (!item) notFound();
  const more = pressReleases.filter((p) => p.slug !== item.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: "Press releases", path: "/perspectives" },
          { name: item.title, path: `/perspectives/press/${item.slug}` },
        ])}
      />
      <article>
        <section className="border-b border-sand-300 bg-cream-50">
          <div className="container-kw py-12 md:py-16">
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-small text-ink-muted">
              <Link href="/" className="hover:text-navy-900">Home</Link>
              <span className="text-sand-300">/</span>
              <Link href="/perspectives" className="hover:text-navy-900">Perspectives</Link>
              <span className="text-sand-300">/</span>
              <span className="text-navy-900">Press releases</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="brand">Press release</Chip>
              <Chip>For immediate release</Chip>
            </div>
            <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{item.fullTitle ?? item.title}</h1>
            <p className="mt-6 text-small text-ink-muted">
              {item.location ? `${item.location}. ` : ""}
              <time dateTime={item.date}>{item.displayDate}</time>.
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="container-kw py-16">
            <div className="mx-auto max-w-[720px]">
              {item.body ? (
                <div className="space-y-6">
                  {item.body.map((b, i) =>
                    b.type === "h2" ? (
                      <h2 key={i} className="h-display pt-4 text-h3 text-navy-900">{b.text}</h2>
                    ) : (
                      <p key={i} className="text-body leading-relaxed text-ink-700">{b.text}</p>
                    ),
                  )}
                  <div className="border-t border-sand-300 pt-6">
                    <h2 className="eyebrow">Media contact</h2>
                    <p className="mt-2 text-small text-ink-muted">
                      Press inquiries: <a href="mailto:press@kwontified.com" className="link-underline">press@kwontified.com</a>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-lead leading-relaxed text-navy-900">{item.dek}</p>
                  <div className="rounded-2xl border border-sand-300 bg-cream-50 p-6">
                    <p className="text-body text-ink-muted">
                      Reporters and editors: for the full release, interviews or press materials, write to{" "}
                      <a href="mailto:press@kwontified.com" className="link-underline">press@kwontified.com</a> and a member of
                      our team will reply within one business day.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-10">
                <Link href="/perspectives" className="learn-more">← All Perspectives</Link>
              </div>
            </div>
          </div>
        </section>

        {more.length > 0 && (
          <section className="bg-cream-50">
            <div className="container-kw py-16">
              <h2 className="h-display text-h2 text-navy-900">More press releases</h2>
              <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
                {more.map((p) => (
                  <li key={p.slug} className="py-5">
                    <Link href={`/perspectives/press/${p.slug}`} className="group block">
                      <span className="text-small text-ink-faint">Press release · {p.displayDate}</span>
                      <span className="mt-1 block text-body font-medium text-navy-900 group-hover:text-gold-700">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-navy-900">
          <div className="container-kw py-16 text-center">
            <h2 className="h-display text-h2 text-white">Press and media inquiries.</h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-white/70">
              Reporters and editors: send your questions or interview requests and a member of our team will reply within one business day.
            </p>
            <Button href="mailto:press@kwontified.com" variant="primary" className="mt-8">Contact Kwontified</Button>
          </div>
        </section>
      </article>
    </>
  );
}
