import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "23% Club",
    short_name: "23% Club",
    description: "Learn how money works. Financial education, tools and tracking for India.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fd",
    theme_color: "#2f43c7",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
