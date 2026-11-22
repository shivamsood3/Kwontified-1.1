import type { Metadata } from "next";

// Every page is served straight from the HTML exports in public/_kq (see
// next.config.ts). This layout only wraps app/not-found.tsx, so it adds no
// styles of its own that could differ from the design.
export const metadata: Metadata = {
  metadataBase: new URL("https://kwontified.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
