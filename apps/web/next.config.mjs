import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This workspace is nested inside the syedmoinuddin monorepo, so root
  // inference picks the outer lockfile and watches the whole parent repo.
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  transpilePackages: ["@bklitui/ui", "@bklitui/studio", "geist"],
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/og/studio": ["./lib/og-fonts/**"],
  },
  experimental: {
    // Keeps dev/prod from pulling the entire charts package per MDX page.
    optimizePackageImports: ["@bklitui/ui", "@bklitui/ui/charts"],
    viewTransition: true,
  },
  async headers() {
    return [
      {
        source: "/studio/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
      {
        source: "/studio/demo",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        // Landing hero artwork.
        protocol: "https",
        hostname: "framerusercontent.com",
      },
    ],
  },
};

export default withMDX(nextConfig);
