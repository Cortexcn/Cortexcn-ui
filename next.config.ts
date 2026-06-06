import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
