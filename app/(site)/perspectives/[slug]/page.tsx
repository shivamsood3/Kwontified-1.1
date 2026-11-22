import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Chip } from "@/components/ui/Chip";
import { ImageCard } from "@/components/blocks/ImageCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/site/Button";
import { articles, getArticle, articleImage } from "@/lib/content/perspectives";
import { getPerspectiveAuthor, authorSlug } from "@/lib/content/perspectiveAuthors";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return { title: a.title, description: a.dek, alternates: { canonical: `/perspectives/${a.slug}` } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const author = getPerspectiveAuthor(authorSlug(article.author) ?? "");
  const related = articles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => (a.topic === article.topic ? -1 : 0) - (b.topic === article.topic ? -1 : 0))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: article.title, path: `/perspectives/${article.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.dek,
          datePublished: article.date,
          author: { "@type": "Person", name: article.author },
          publisher: { "@type": "Organization", name: "Kwontified" },
        }}
      />

      <article>
        {/* Title block (cream) + hero */}
        <section className="border-b border-sand-300 bg-cream-50">
          <div className="container-kw py-12 md:py-16">
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-small text-ink-muted">
              <Link href="/" className="hover:text-navy-900">Home</Link>
              <span className="text-sand-300">/</span>
              <Link href="/perspectives" className="hover:text-navy-900">Perspectives</Link>
              <span className="text-sand-300">/</span>
              <span className="text-navy-900">{article.topic}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="brand">Article</Chip>
              <Chip>{article.topic}</Chip>
              <Chip>{article.channel}</Chip>
            </div>
            <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{article.title}</h1>
            <p className="mt-5 max-w-2xl text-lead text-ink-muted">{article.dek}</p>
            <p className="mt-6 text-small text-ink-muted">
              By{" "}
              <Link href={`/perspectives/authors/${authorSlug(article.author)}`} className="font-medium text-navy-900 hover:text-gold-700">
                {article.author}
              </Link>
              {author ? `, ${author.role}` : ""}. Published{" "}
              <time dateTime={article.date}>{article.displayDate}</time>.
            </p>
            <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-2xl">
              <Img id={articleImage(article.slug)} priority sizes="(max-width: 1312px) 100vw, 1312px" />
            </div>
          </div>
        </section>

        {/* Reading column (white) */}
        <section className="bg-white">
          <div className="container-kw py-16">
            <div className="mx-auto max-w-[720px]">
              {article.body ? (
                <div className="space-y-6">
                  {article.body.map((b, i) =>
                    b.type === "h2" ? (
                      <h2 key={i} className="h-display pt-4 text-h3 text-navy-900">{b.text}</h2>
                    ) : (
                      <p key={i} className="text-body leading-relaxed text-ink-700">{b.text}</p>
                    ),
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-lead leading-relaxed text-navy-900">{article.dek}</p>
                  <p className="text-body leading-relaxed text-ink-muted">
                    This piece is part of the Kwontified Briefing, where our team writes up what it is
                    seeing across the marketplaces we run. {article.author} covers {article.topic.toLowerCase()} on{" "}
                    {article.channel.toLowerCase() === "all channels" ? "the marketplaces we manage" : article.channel}.
                  </p>
                  <div className="rounded-2xl border border-sand-300 bg-cream-50 p-6">
                    <p className="text-body text-ink-muted">
                      Want our full read on this for your brand? Tell us where you sell and what you want to
                      grow, and a member of our team will reply within one business day.
                    </p>
                    <Button href={`/contact?topic=${encodeURIComponent(article.topic)}`} variant="navy" className="mt-5">
                      Request a marketplace review
                    </Button>
                  </div>
                </div>
              )}

              {/* Author card */}
              {author && (
                <div className="mt-12 flex flex-col gap-2 border-t border-sand-300 pt-8">
                  <p className="eyebrow">Written by</p>
                  <Link href={`/perspectives/authors/${author.slug}`} className="group">
                    <h3 className="h-display text-h3 text-navy-900 group-hover:text-gold-700">{author.name}</h3>
                  </Link>
                  <p className="text-small font-medium text-gold-700">{author.role}</p>
                  <p className="mt-2 max-w-2xl text-small leading-relaxed text-ink-muted">{author.bio}</p>
                  <Link href={`/perspectives/authors/${author.slug}`} className="learn-more mt-3">
                    More from {author.name.split(" ")[0]} →
                  </Link>
                </div>
              )}

              <div className="mt-10">
                <Link href="/perspectives" className="learn-more">← All Perspectives</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Keep reading (cream) */}
        {related.length > 0 && (
          <section className="bg-cream-50">
            <div className="container-kw py-16">
              <h2 className="h-display text-h2 text-navy-900">Keep reading</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((a) => (
                  <ImageCard
                    key={a.slug}
                    href={`/perspectives/${a.slug}`}
                    imageId={articleImage(a.slug)}
                    ratio="3/2"
                    chip={a.topic}
                    meta={`${a.author} · ${a.displayDate}`}
                    title={a.title}
                    excerpt={a.dek}
                    cta="Read"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA band (navy) */}
        <section className="bg-navy-900">
          <div className="container-kw py-16 text-center">
            <h2 className="h-display text-h2 text-white">Plan your next move with us.</h2>
            <p className="mx-auto mt-4 max-w-xl text-body text-white/70">
              Tell us where you sell and what you want to grow. A member of our team replies within one business day.
            </p>
            <Button href="/contact" variant="primary" className="mt-8">Request a marketplace review</Button>
          </div>
        </section>
      </article>
    </>
  );
}
