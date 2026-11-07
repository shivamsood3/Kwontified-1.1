import type { Metadata } from "next";
import { ChannelTemplate } from "@/components/sections/ChannelTemplate";
import { getChannel } from "@/lib/content/channels";

const amazon = getChannel("amazon")!;

export const metadata: Metadata = {
  title: amazon.name,
  description: amazon.intro,
};

export default function AmazonChannelPage() {
  return (
    <ChannelTemplate
      name={amazon.name}
      h1={amazon.h1}
      intro={amazon.intro}
      metric={amazon.metric}
      reviewLabel={amazon.reviewLabel}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Channels", href: "/channels" },
        { label: "Amazon" },
      ]}
      accountTypes={amazon.accountTypes}
      problems={amazon.problems}
      related={[
        { label: "Amazon brand programs", href: "/channels/amazon/brand-programs" },
        { label: "Revenue Recovery", href: "/capabilities/revenue-recovery" },
        { label: "Amazon DSP case study", href: "/work/amazon-dsp" },
      ]}
    />
  );
}
