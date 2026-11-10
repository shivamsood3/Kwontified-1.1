import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import {
  perspectiveAuthors,
  getPerspectiveAuthor,
} from "@/lib/content/perspectiveAuthors";
import { perspectives } from "@/lib/content/perspectives";

export function generateStaticParams() {
  return perspectiveAuthors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getPerspectiveAuthor(slug);
  if (!a) return {};
  return {
    title: `${a.name} — Perspectives author`,
    description: a.bio,
    alternates: { canonical: `/perspectives/authors/${a.slug}` },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getPerspectiveAuthor(slug);
  if (!author) notFound();

  const posts = perspectives.filter((p) => p.author === author.name);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Perspectives", path: "/perspectives" },
          { name: author.name, path: `/perspectives/authors/${author.slug}` },
        ])}
      />
      <section className="bg-white">
        <div className="container-kw py-16">
          <nav className="mb-8 flex items-center gap-2 text-small text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <Link href="/perspectives" className="hover:text-ink">Perspectives</Link>
            <span className="text-line">/</span>
            <span className="text-ink">{author.name}</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Image
              src={author.image}
              alt={author.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div>
              <h1 className="h-display text-h1 text-ink">{author.name}</h1>
              <p className="mt-1 text-lead text-brand-700">{author.role}</p>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-lead leading-relaxed text-ink-700">
            {author.bio}
          </p>

          {posts.length > 0 && (
            <div className="mt-12 border-t border-line pt-8">
              <h2 className="h-display text-h3 text-ink">Posts by {author.name.split(" ")[0]}</h2>
              <ul className="mt-6 space-y-5">
                {posts.map((p) => (
                  <li key={p.title}>
                    <Link
                      href={p.slug ? `/perspectives/${p.slug}` : "/perspectives"}
                      className="group block"
                    >
                      <p className="eyebrow">{p.topic} · {p.channel}</p>
                      <h3 className="h-display mt-1 text-h3 text-ink group-hover:text-brand-700">
                        {p.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
