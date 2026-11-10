import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Chip } from "@/components/ui/Chip";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { perspectivePosts, getPerspectivePost } from "@/lib/content/perspectivePosts";

export function generateStaticParams() {
  return perspectivePosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/perspectives/${post.slug}` },
  };
}

export default async function PerspectivePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: post.title, path: `/perspectives/${post.slug}` },
        ])}
      />
      <article className="bg-white">
        <div className="container-kw py-14">
          <nav className="mb-6 flex items-center gap-2 text-small text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <Link href="/perspectives" className="hover:text-ink">Perspectives</Link>
            <span className="text-line">/</span>
            <span className="text-ink">{post.topic}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <Chip>{post.topic}</Chip>
            <Chip>{post.channel}</Chip>
          </div>
          <h1 className="h-display mt-4 max-w-3xl text-h1 text-ink">{post.title}</h1>
          <p className="mt-5 max-w-2xl text-lead text-ink-700">{post.dek}</p>

          {post.comingSoon && (
            <div className="mt-10 max-w-2xl border-l-2 border-brand-600 bg-brand-100 px-5 py-4">
              <p className="text-[13px] font-medium text-brand-700">Full article coming soon</p>
              <p className="mt-1 text-small leading-relaxed text-ink-700">
                We’re finishing this piece. In the meantime, read the published
                guide on DSP incrementality or ask us about this topic directly.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href="/perspectives/amazon-dsp-incrementality" className="link-underline">
                  Read: Is your Amazon DSP spend incremental?
                </Link>
                <Link href="/contact" className="link-underline">
                  Ask us about this
                </Link>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-line pt-8">
            <Link href="/perspectives" className="link-underline text-sm">
              ← All Perspectives
            </Link>
          </div>
        </div>
      </article>

      <CtaBand />
    </>
  );
}
