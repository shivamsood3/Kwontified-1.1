import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Kwontified LLC collects, uses and protects personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 28, 2026"
      intro="Kwontified LLC (“Kwontified,” “we,” “us”) respects your privacy. This policy explains what information we collect through kwontified.com, how we use it, and the choices you have."
      sections={[
        {
          h: "Information we collect",
          body: [
            "We collect the information you provide directly — for example, your name, work email, company and the details you share when you request a marketplace review or subscribe to Perspectives.",
            "We also collect limited technical information automatically, such as IP address, device and browser type, and pages visited, through cookies and similar technologies.",
          ],
        },
        {
          h: "How we use information",
          body: [
            "We use the information to respond to your request, provide and improve our services, send Perspectives if you opt in, and maintain the security of our site. We use what you share only to prepare for and hold our conversation, and we do not sell it.",
          ],
        },
        {
          h: "Sharing",
          body: [
            "We share personal information only with service providers who process it on our behalf under contract, or when required by law. We do not share your information with third parties for their own marketing.",
          ],
        },
        {
          h: "Your choices",
          body: [
            "You can unsubscribe from Perspectives at any time using the link in any email. You may request access to, correction of, or deletion of your personal information by contacting us.",
          ],
        },
        {
          h: "Contact",
          body: [
            "Questions about this policy can be sent to hello@kwontified.com, or by mail to Kwontified LLC, 7000 Central Parkway, Suite 1100, Sandy Springs, GA 30328.",
          ],
        },
      ]}
    />
  );
}
