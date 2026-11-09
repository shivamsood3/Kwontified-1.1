import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kwontified",
    short_name: "Kwontified",
    description:
      "Ecommerce agency for Amazon, Walmart, Target Plus and global marketplaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#262524",
    theme_color: "#262524",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
