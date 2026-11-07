import type { Metadata } from "next";
import { ChannelTemplate } from "@/components/sections/ChannelTemplate";
import { brandPrograms } from "@/lib/content/channels";

export const metadata: Metadata = {
  title: brandPrograms.name,
  description: brandPrograms.intro,
  alternates: { canonical: "/channels/amazon/brand-programs" },
};

export default function BrandProgramsPage() {
  return (
    <ChannelTemplate
      eyebrow="Amazon programs"
      name={brandPrograms.name}
      h1={brandPrograms.h1}
      intro={brandPrograms.intro}
      metric={brandPrograms.metric}
      reviewLabel={brandPrograms.reviewLabel}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Channels", href: "/channels" },
        { label: "Amazon", href: "/channels/amazon" },
        { label: "Brand programs" },
      ]}
      problems={[...brandPrograms.problems]}
      showCapabilities={false}
      related={[
        { label: "Amazon", href: "/channels/amazon" },
        { label: "Creative Studio", href: "/capabilities/creative-studio" },
      ]}
    />
  );
}
