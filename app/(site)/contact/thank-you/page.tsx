import { redirect } from "next/navigation";

// Canonical thank-you page now lives at /thank-you (fix 6).
export default function ContactThankYouRedirect() {
  redirect("/thank-you");
}
