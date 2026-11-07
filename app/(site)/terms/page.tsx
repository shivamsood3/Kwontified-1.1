import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of kwontified.com.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="October 28, 2026"
      intro="These Terms of Use govern your access to and use of kwontified.com, operated by Kwontified LLC. By using the site, you agree to these terms."
      sections={[
        {
          h: "Use of the site",
          body: [
            "You may use the site for lawful purposes only. You agree not to misuse the site, interfere with its operation, or attempt to access it in any way other than through the interface we provide.",
          ],
        },
        {
          h: "Intellectual property",
          body: [
            "The content on this site, including text, graphics, logos and case studies, is owned by Kwontified LLC or its licensors and is protected by applicable intellectual-property laws. Client results are shared with permission and remain the property of their respective owners.",
          ],
        },
        {
          h: "No professional advice",
          body: [
            "Content on this site, including Perspectives, is provided for general information and does not constitute professional, legal or financial advice. Figures reflect specific engagements and are not a guarantee of future results.",
          ],
        },
        {
          h: "Disclaimers and limitation of liability",
          body: [
            "The site is provided “as is” without warranties of any kind. To the fullest extent permitted by law, Kwontified LLC is not liable for any indirect or consequential damages arising from your use of the site.",
          ],
        },
        {
          h: "Contact",
          body: [
            "Questions about these terms can be sent to hello@kwontified.com, or by mail to Kwontified LLC, 7000 Central Parkway, Suite 1100, Sandy Springs, GA 30328.",
          ],
        },
      ]}
    />
  );
}
