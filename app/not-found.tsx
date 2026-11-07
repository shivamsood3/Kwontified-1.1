import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/site/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="container-kw flex h-16 items-center">
          <Logo tone="dark" />
        </div>
      </header>
      <main className="flex flex-1 items-center">
        <div className="container-kw py-24 text-center">
          <p className="eyebrow">404</p>
          <h1 className="h-display mt-3 text-4xl text-ink md:text-5xl">
            This page isn’t here.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            The page you’re looking for may have moved. Try the homepage, or
            request a marketplace review and we’ll point you the right way.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/">Back to home</Button>
            <Button href="/contact" variant="outline">
              Request a review
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <Link href="/capabilities" className="hover:text-ink">Capabilities</Link>
            <Link href="/channels" className="hover:text-ink">Channels</Link>
            <Link href="/work" className="hover:text-ink">Work</Link>
            <Link href="/perspectives" className="hover:text-ink">Perspectives</Link>
            <Link href="/about" className="hover:text-ink">About</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
