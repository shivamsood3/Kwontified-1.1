import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/site/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Client sign-in",
  description: "Sign in to see your Kwontified dashboards and reports. Each user sees only the accounts their organization manages with Kwontified.",
  alternates: { canonical: "/client-sign-in" },
  robots: { index: false, follow: false },
};

export default function ClientSignInPage() {
  return (
    <section className="bg-cream-50">
      <div className="container-kw py-20 lg:py-28">
        <div className="mx-auto max-w-md">
          <nav className="mb-8 flex items-center gap-2 text-small text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">Client sign-in</span>
          </nav>

          <h1 className="h-display text-h1 text-navy-900">Client sign-in</h1>
          <p className="mt-4 text-body leading-relaxed text-ink-muted">
            Sign in to see your dashboards and reports. Each user sees only the accounts their organization
            manages with Kwontified.
          </p>

          <div className="mt-8 rounded-2xl border border-sand-300 bg-white p-7 shadow-card">
            <Button href={site.clientSignInUrl} variant="navy" className="w-full justify-center">
              Go to the client portal
            </Button>
            <p className="mt-4 text-small text-ink-muted">
              <a href={`${site.clientSignInUrl.replace(/\/sign-in$/, "")}/forgot-password`} className="link-underline">
                Forgot your password?
              </a>
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-sand-300 bg-cream-100 p-6">
            <h2 className="text-base font-medium text-navy-900">Need access for yourself or a colleague?</h2>
            <p className="mt-2 text-small leading-relaxed text-ink-muted">
              Email{" "}
              <a href="mailto:support@kwontified.com" className="link-underline">support@kwontified.com</a>{" "}
              and your Kwontified team will set it up.
            </p>
          </div>

          <p className="mt-8 text-small text-ink-faint">
            We’re upgrading the client portal with new dashboards. If anything looks different from your last
            visit, or you can’t reach a report you expect, write to{" "}
            <a href="mailto:support@kwontified.com" className="link-underline">support@kwontified.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
