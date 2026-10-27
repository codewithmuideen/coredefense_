import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CoreDefense",
    short_name: "CoreDefense",
    description: "Cybersecurity, process transformation, digital engineering and AI from one senior UK team.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0B1220",
    icons: [{ src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" }],
  };
}
