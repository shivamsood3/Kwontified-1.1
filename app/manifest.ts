import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kwontified",
    short_name: "Kwontified",
    description:
      "Ecommerce agency for Amazon, Walmart, Target Plus and global marketplaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1320",
    theme_color: "#0d1320",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
