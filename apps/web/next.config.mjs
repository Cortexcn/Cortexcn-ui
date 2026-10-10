import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The workspace root holds the lockfile and the shared packages, so
  // Turbopack resolves and watches from there rather than from apps/web.
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
  transpilePackages: ["@cortexcn/ui", "geist"],
  serverExternalPackages: ["puppeteer-core"],
  outputFileTracingIncludes: {
    // The markdown routes read the MDX sources at build time.
    "/llms-full.txt": ["./content/docs/**"],
    "/llms.md/[[...slug]]": ["./content/docs/**"],
    // The MCP server reads the docs and the published registry files.
    "/mcp": ["./content/docs/**", "./public/r/**"],
  },
  experimental: {
    // Keeps dev/prod from pulling the entire charts package per MDX page.
    optimizePackageImports: ["@cortexcn/ui", "@cortexcn/ui/charts"],
  },
  async redirects() {
    // The AI Assistant components moved from the docs to Blocks.
    const movedToBlocks = [
      ["reasoning", "ai-reasoning-01"],
      ["chain-of-thought", "ai-chain-of-thought-01"],
      ["shimmer", "ai-shimmer-01"],
    ].map(([component, block]) => ({
      source: `/docs/components/${component}`,
      destination: `/blocks/ai-assistant/${block}`,
      permanent: true,
    }));
    // Cortex, Backgrounds, and Charts moved out of /docs/components into
    // sections of their own. Pages added since then never had the old URL.
    const movedSections = {
      cortex: [
        "command-search",
        "fan-out-diagram",
        "faq-tabs-card",
        "gooey-nav",
        "lanyard-3d",
        "lanyard-badge",
        "line-nav",
        "logos-carousel",
        "marquee",
        "number-ticker",
        "perspective-marquee",
        "sphere-menu",
        "theme-toggle-effect",
        "work-experience",
      ],
      backgrounds: ["light-speed"],
      charts: [
        "area-chart",
        "bar-chart",
        "candlestick-chart",
        "choropleth-chart",
        "composed-chart",
        "funnel-chart",
        "gauge-chart",
        "heatmap-chart",
        "line-chart",
        "profit-loss-line",
        "live-line-chart",
        "pie-chart",
        "radar-chart",
        "ring-chart",
        "scatter-chart",
        "sankey-chart",
        "sunburst-chart",
      ],
    };
    const movedToSections = Object.entries(movedSections).flatMap(
      ([section, slugs]) =>
        slugs.flatMap((slug) =>
          // The page, and its markdown copy for AI agents.
          ["", ".md"].map((suffix) => ({
            source: `/docs/components/${slug}${suffix}`,
            destination: `/docs/${section}/${slug}${suffix}`,
            permanent: true,
          })),
        ),
    );
    return [
      ...movedToBlocks,
      ...movedToSections,
      // Skills moved under Integration, next to the MCP server and DESIGN.md.
      {
        source: "/docs/skills",
        destination: "/docs/integration/skills",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      // Markdown copies of docs pages for AI agents: append `.md` to any URL.
      beforeFiles: [
        { source: "/docs.md", destination: "/llms.md" },
        { source: "/docs/:path*.md", destination: "/llms.md/:path*" },
      ],
      // Template live previews are static exports in public/previews/<slug>.
      afterFiles: [
        {
          source: "/previews/:slug",
          destination: "/previews/:slug/index.html",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Baseline hardening for every page.
        source: "/:path*",
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
        // The previews are sample sites; keep them out of search results.
        source: "/previews/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
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
