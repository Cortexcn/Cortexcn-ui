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
    // The markdown routes read the MDX sources at build time.
    "/llms-full.txt": ["./content/docs/**"],
    "/llms.md/[[...slug]]": ["./content/docs/**"],
  },
  experimental: {
    // Keeps dev/prod from pulling the entire charts package per MDX page.
    optimizePackageImports: ["@bklitui/ui", "@bklitui/ui/charts"],
  },
  async rewrites() {
    return {
      // Markdown copies of docs pages for AI agents: append `.md` to any URL.
      beforeFiles: [
        { source: "/docs.md", destination: "/llms.md" },
        { source: "/docs/:path*.md", destination: "/llms.md/:path*" },
      ],
    };
  },
  async headers() {
    return [
      {
        // Baseline hardening for every page except the embeddable studio views.
        source: "/:path((?!studio/embed|studio/demo).*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
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
    ],
  },
};

export default withMDX(nextConfig);
