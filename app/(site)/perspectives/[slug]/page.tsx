import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Chip } from "@/components/ui/Chip";
import { Callout } from "@/components/ui/Callout";
import { ImageCard } from "@/components/blocks/ImageCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { perspectivePosts, getPerspectivePost } from "@/lib/content/perspectivePosts";

export function generateStaticParams() {
  return perspectivePosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post) return {};
  return { title: post.title, description: post.dek, alternates: { canonical: `/perspectives/${post.slug}` } };
}

const postImage: Record<string, string> = {
  "rufus-listing-signals": "post-rufus",
  "conversion-8-to-12": "post-conversion",
  "vendor-central-chargebacks": "post-chargebacks",
};

export default async function PerspectivePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post) notFound();

  const img = postImage[post.slug] ?? "post-rufus";
  const related = perspectivePosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: post.title, path: `/perspectives/${post.slug}` },
        ])}
      />

      {/* Contained title on cream + 16:9 image */}
      <article>
        <section className="border-b border-sand-300 bg-cream-50">
          <div className="container-kw py-12 md:py-16">
            <nav className="mb-5 flex items-center gap-2 text-small text-ink-muted">
              <Link href="/" className="hover:text-navy-900">Home</Link>
              <span className="text-sand-300">/</span>
              <Link href="/perspectives" className="hover:text-navy-900">Perspectives</Link>
              <span className="text-sand-300">/</span>
              <span className="text-navy-900">{post.topic}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="brand">{post.topic}</Chip>
              <Chip>{post.channel}</Chip>
            </div>
            <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{post.title}</h1>
            <p className="mt-5 max-w-2xl text-lead text-ink-muted">{post.dek}</p>
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Img id={img} priority sizes="(max-width: 1312px) 100vw, 1312px" />
            </div>
          </div>
        </section>

        {/* Reading column */}
        <section className="bg-white">
          <div className="container-kw py-16">
            <div className="mx-auto max-w-[720px]">
              {post.comingSoon ? (
                <Callout label="Full article coming soon">
                  We’re finishing this piece. In the meantime, read the published guide on DSP
                  incrementality, or ask us about this topic directly.
                  <span className="mt-4 flex flex-wrap gap-4">
                    <Link href="/perspectives/amazon-dsp-incrementality" className="link-underline">
                      Read: Is your Amazon DSP spend incremental?
                    </Link>
                    <Link href="/contact" className="link-underline">Ask us about this</Link>
                  </span>
                </Callout>
              ) : (
                <p className="text-body leading-relaxed text-ink-muted">{post.dek}</p>
              )}
              <div className="mt-12 border-t border-sand-300 pt-8">
                <Link href="/perspectives" className="learn-more">← All Perspectives</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related (cream) */}
        {related.length > 0 && (
          <section className="bg-cream-50">
            <div className="container-kw py-16">
              <h2 className="h-display text-h2 text-navy-900">Related</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((p) => (
                  <ImageCard
                    key={p.slug}
                    href={`/perspectives/${p.slug}`}
                    imageId={postImage[p.slug] ?? "post-rufus"}
                    ratio="4/3"
                    chip={p.topic}
                    title={p.title}
                    excerpt={p.dek}
                    cta="Read"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
