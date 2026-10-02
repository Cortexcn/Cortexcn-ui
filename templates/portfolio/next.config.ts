import type { NextConfig } from "next";

/**
 * `pnpm build` makes a regular Next.js app. Set NEXT_OUTPUT=export to get a
 * static site in `out/` that any file host can serve, and BASE_PATH when it
 * lives under a subpath such as /portfolio.
 */
const staticExport = process.env.NEXT_OUTPUT === "export";
const basePath = (staticExport && process.env.BASE_PATH) || "";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      basePath: basePath || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
      // next/image leaves plain string paths alone, so covers add it themselves.
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
    }
  : {};

export default nextConfig;
