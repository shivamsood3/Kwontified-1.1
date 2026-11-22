import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { Button } from "@/components/site/Button";
import { jobs, getJob } from "@/lib/content/careers";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = getJob(slug);
  if (!j) return {};
  return { title: `${j.title} — Careers`, description: j.summary, alternates: { canonical: `/about/careers/${j.slug}` } };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);
  if (!job) notFound();

  const applyHref = `mailto:careers@kwontified.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
  const glance = [
    ["Team", job.team],
    ["Location", job.location],
    ["Employment type", job.type],
    ["Reports to", job.reportsTo],
    ["Direct reports", job.directReports],
    ["Book of business", job.book],
    ["Experience", job.experience],
  ].filter(([, v]) => v);
  const others = jobs.filter((j) => j.slug !== job.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/about/careers" },
          { name: job.title, path: `/about/careers/${job.slug}` },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: job.title,
          description: job.summary,
          employmentType: job.type,
          hiringOrganization: { "@type": "Organization", name: "Kwontified" },
          jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" } },
          applicantLocationRequirements: { "@type": "Country", name: "US" },
        }}
      />

      {/* Header (cream) */}
      <section className="border-b border-sand-300 bg-cream-50">
        <div className="container-kw py-12 md:py-16">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-small text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <Link href="/about/careers" className="hover:text-navy-900">Careers</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">{job.title}</span>
          </nav>
          <p className="text-small font-medium uppercase tracking-wide text-gold-700">{job.team}</p>
          <h1 className="h-display mt-2 max-w-3xl text-h1 text-navy-900">{job.title}</h1>
          <p className="mt-5 max-w-2xl text-lead text-ink-muted">{job.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={applyHref} variant="primary">Apply for this role</Button>
            <Button href="/about/careers" variant="outline">All open roles</Button>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-kw py-16">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_2fr] lg:items-start">
            {/* At a glance */}
            <aside className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-sand-300 bg-cream-50 p-6">
                <h2 className="eyebrow">At a glance</h2>
                <dl className="mt-4 space-y-4">
                  {glance.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-small font-medium text-navy-900">{k}</dt>
                      <dd className="mt-0.5 text-small text-ink-muted">{v}</dd>
                    </div>
                  ))}
                </dl>
                <Button href={applyHref} variant="navy" className="mt-6 w-full justify-center">Apply for this role</Button>
              </div>
            </aside>

            {/* Body */}
            <div className="max-w-[720px] space-y-12">
              <div>
                <h2 className="h-display text-h2 text-navy-900">The role</h2>
                <div className="mt-5 space-y-5">
                  {job.roleParas.map((p, i) => (
                    <p key={i} className="text-body leading-relaxed text-ink-700">{p}</p>
                  ))}
                </div>
              </div>

              {job.owns.length > 0 && (
                <div>
                  <h2 className="h-display text-h2 text-navy-900">What you’ll own</h2>
                  <div className="mt-6 space-y-5">
                    {job.owns.map((o) => (
                      <div key={o.h} className="border-l-2 border-gold-500 pl-5">
                        <h3 className="text-body font-medium text-navy-900">{o.h}</h3>
                        {o.d && <p className="mt-1 text-small leading-relaxed text-ink-muted">{o.d}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(job.required.length > 0 || job.preferred.length > 0) && (
                <div>
                  <h2 className="h-display text-h2 text-navy-900">What you bring</h2>
                  {job.required.length > 0 && (
                    <>
                      <h3 className="mt-6 text-small font-medium uppercase tracking-wide text-gold-700">Required</h3>
                      <ul className="mt-3 space-y-2">
                        {job.required.map((r, i) => (
                          <li key={i} className="flex gap-3 text-body leading-relaxed text-ink-700">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {job.preferred.length > 0 && (
                    <>
                      <h3 className="mt-6 text-small font-medium uppercase tracking-wide text-ink-faint">Preferred</h3>
                      <ul className="mt-3 space-y-2">
                        {job.preferred.map((r, i) => (
                          <li key={i} className="flex gap-3 text-body leading-relaxed text-ink-muted">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-300" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {job.success.length > 0 && (
                <div>
                  <h2 className="h-display text-h2 text-navy-900">What success looks like</h2>
                  <div className="mt-6 space-y-5">
                    {job.success.map((s) => (
                      <div key={s.at}>
                        <h3 className="text-body font-medium text-navy-900">{s.at}</h3>
                        {s.d && <p className="mt-1 text-small leading-relaxed text-ink-muted">{s.d}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-sand-300 bg-cream-50 p-6">
                <h2 className="h-display text-h3 text-navy-900">Apply for {job.title}</h2>
                <p className="mt-2 text-body text-ink-muted">
                  Send your résumé and a short cover letter to{" "}
                  <a href="mailto:careers@kwontified.com" className="link-underline">careers@kwontified.com</a> with the role title in the subject line.
                </p>
                <Button href={applyHref} variant="primary" className="mt-5">Apply for this role</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other roles (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-16">
          <h2 className="h-display text-h2 text-navy-900">Other open roles</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {others.map((j) => (
              <Link key={j.slug} href={`/about/careers/${j.slug}`} className="group rounded-2xl border border-sand-300 bg-white p-6 shadow-card transition-shadow hover:shadow-lift">
                <p className="text-small text-ink-faint">{j.team}</p>
                <h3 className="h-display mt-1 text-h3 text-navy-900 group-hover:text-gold-700">{j.title}</h3>
                <p className="mt-2 text-small text-ink-muted">{j.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
