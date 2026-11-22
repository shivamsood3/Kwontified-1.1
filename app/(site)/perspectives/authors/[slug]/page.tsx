import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { InitialsTile } from "@/components/ui/InitialsTile";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { perspectiveAuthors, getPerspectiveAuthor } from "@/lib/content/perspectiveAuthors";
import { articles } from "@/lib/content/perspectives";

export function generateStaticParams() {
  return perspectiveAuthors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getPerspectiveAuthor(slug);
  if (!a) return {};
  return {
    title: `${a.name} — Perspectives author`,
    description: a.bio,
    alternates: { canonical: `/perspectives/authors/${a.slug}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getPerspectiveAuthor(slug);
  if (!author) notFound();

  const posts = articles.filter((p) => p.author === author.name);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: author.name, path: `/perspectives/authors/${author.slug}` },
        ])}
      />
      <section className="bg-cream-50">
        <div className="container-kw py-16">
          <nav className="mb-8 flex items-center gap-2 text-small text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <Link href="/perspectives" className="hover:text-navy-900">Perspectives</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">{author.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <InitialsTile name={author.name} className="h-24 w-24 shrink-0" />
            <div>
              <h1 className="h-display text-h1 text-navy-900">{author.name}</h1>
              <p className="mt-1 text-lead text-gold-700">{author.role}</p>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-lead leading-relaxed text-ink-muted">{author.bio}</p>

          {/* Writes about */}
          <div className="mt-10">
            <h2 className="eyebrow">Writes about</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {author.topics.map((t) => (
                <span key={t} className="rounded-full border border-sand-300 px-3 py-1 text-small text-ink-muted">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles by author (white) */}
      {posts.length > 0 && (
        <section className="bg-white">
          <div className="container-kw py-16">
            <h2 className="h-display text-h2 text-navy-900">Articles</h2>
            <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
              {posts.map((p) => (
                <li key={p.slug} className="py-6">
                  <Link href={`/perspectives/${p.slug}`} className="group block">
                    <p className="eyebrow">{p.topic} · {p.channel} · {p.displayDate}</p>
                    <h3 className="h-display mt-1 text-h3 text-navy-900 group-hover:text-gold-700">{p.title}</h3>
                    <p className="mt-2 max-w-2xl text-small text-ink-muted">{p.dek}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* In the press (cream) */}
      {author.press.length > 0 && (
        <section className="bg-cream-50">
          <div className="container-kw py-16">
            <h2 className="h-display text-h2 text-navy-900">In the press</h2>
            <p className="mt-2 max-w-2xl text-small text-ink-muted">Articles that quote or profile {author.name} by name.</p>
            <ul className="mt-8 divide-y divide-sand-300 border-t border-sand-300">
              {author.press.map((pr) => (
                <li key={pr.title + pr.date} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="order-2 shrink-0 text-small text-ink-faint sm:order-1 sm:w-28">{pr.date}</span>
                  <span className="order-1 sm:order-2 sm:flex-1">
                    <span className="text-small font-medium uppercase tracking-wide text-gold-700">{pr.outlet}</span>
                    <span className="mt-1 block text-body text-navy-900">{pr.title}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <PromoBanner imageId="promo-about" />
    </>
  );
}
