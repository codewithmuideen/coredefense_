import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Static media is fingerprint-free, so cache it for a week and revalidate in the background.
        source: "/:dir(images|video)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
  outputFileTracingRoot: path.join(__dirname),
  // Pages merged during the content clean-up; keep old links working.
  async redirects() {
    return [
      { source: "/careers/talent-hub", destination: "/careers", permanent: true },
      { source: "/book-consultation", destination: "/contact", permanent: true },
      { source: "/resources/case-studies", destination: "/platform/use-cases", permanent: true },
      { source: "/business-transformation/workflow-automation", destination: "/ai-automation/intelligent-automation", permanent: true },
    ];
  },
};

export default nextConfig;
