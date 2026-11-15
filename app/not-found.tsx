import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/site/Button";
import { Img } from "@/components/ui/Img";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Img id="error-404" priority sizes="100vw" position="center" />
      <div className="absolute inset-0 bg-navy-900/80" aria-hidden="true" />
      <header className="relative">
        <div className="container-kw flex h-16 items-center">
          <Logo tone="light" />
        </div>
      </header>
      <main className="relative flex flex-1 items-center">
        <div className="container-kw py-24 text-center">
          <p className="eyebrow-light justify-center">404</p>
          <h1 className="h-display mx-auto mt-4 max-w-xl text-4xl text-white md:text-5xl">
            Page not found.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-white/75">
            The page you’re looking for may have moved. Try the homepage, or request a
            marketplace review and we’ll point you the right way.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/" variant="primary">Back to home</Button>
            <Button href="/contact" variant="outline-light">Request a review</Button>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <Link href="/capabilities" className="hover:text-white">Capabilities</Link>
            <Link href="/channels" className="hover:text-white">Channels</Link>
            <Link href="/work" className="hover:text-white">Work</Link>
            <Link href="/perspectives" className="hover:text-white">Perspectives</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
