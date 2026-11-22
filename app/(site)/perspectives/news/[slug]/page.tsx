import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { news, getNews } from "@/lib/content/perspectives";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNews(slug);
  if (!n) return {};
  return { title: n.title, description: n.dek ?? n.title, alternates: { canonical: `/perspectives/news/${n.slug}` } };
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) notFound();
  const more = news.filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: "News", path: "/perspectives" },
          { name: item.title, path: `/perspectives/news/${item.slug}` },
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
              <span className="text-navy-900">News</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="brand">News</Chip>
              <Chip>{item.topic}</Chip>
              <Chip>{item.channel}</Chip>
            </div>
            <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{item.title}</h1>
            {item.dek && <p className="mt-5 max-w-2xl text-lead text-ink-muted">{item.dek}</p>}
            <p className="mt-6 text-small text-ink-muted">
              By Kwontified. Published <time dateTime={item.date}>{item.displayDate}</time>
              {item.readTime ? `. ${item.readTime}` : ""}.
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
                  {item.sources && item.sources.length > 0 && (
                    <div className="border-t border-sand-300 pt-6">
                      <h2 className="eyebrow">Sources</h2>
                      <p className="mt-2 text-small text-ink-muted">{item.sources.join(" · ")}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-lead leading-relaxed text-navy-900">{item.dek}</p>
                  <div className="rounded-2xl border border-sand-300 bg-cream-50 p-6">
                    <p className="text-body text-ink-muted">
                      See what this news means for your account. Tell us where you sell and a member of our team
                      will reply within one business day.
                    </p>
                    <Button href="/contact" variant="navy" className="mt-5">Request a marketplace review</Button>
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
              <h2 className="h-display text-h2 text-navy-900">More news</h2>
              <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
                {more.map((n) => (
                  <li key={n.slug} className="py-5">
                    <Link href={`/perspectives/news/${n.slug}`} className="group block">
                      <span className="text-small text-ink-faint">News · {n.channel} · {n.displayDate}</span>
                      <span className="mt-1 block text-body font-medium text-navy-900 group-hover:text-gold-700">{n.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-navy-900">
          <div className="container-kw py-16 text-center">
            <h2 className="h-display text-h2 text-white">See what this means for your account.</h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-white/70">
              Tell us where you sell and what your quarter looks like. A member of our team replies within one business day.
            </p>
            <Button href="/contact" variant="primary" className="mt-8">Request a marketplace review</Button>
          </div>
        </section>
      </article>
    </>
  );
}
