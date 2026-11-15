import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first, then WebP, from the WebP sources in /public/images.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
