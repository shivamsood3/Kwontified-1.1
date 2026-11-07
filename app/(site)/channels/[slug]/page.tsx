import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChannelTemplate } from "@/components/sections/ChannelTemplate";
import { channelsContent, getChannel } from "@/lib/content/channels";

export function generateStaticParams() {
  return channelsContent
    .filter((c) => c.slug !== "amazon")
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getChannel(slug);
  if (!c) return {};
  return { title: c.name, description: c.intro };
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getChannel(slug);
  if (!c || c.slug === "amazon") notFound();

  return (
    <ChannelTemplate
      name={c.name}
      h1={c.h1}
      intro={c.intro}
      metric={c.metric}
      reviewLabel={c.reviewLabel}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Channels", href: "/channels" },
        { label: c.name },
      ]}
      accountTypes={c.accountTypes}
      problems={c.problems}
      related={[
        { label: "All channels", href: "/channels" },
        { label: "Our work", href: "/work" },
      ]}
    />
  );
}
