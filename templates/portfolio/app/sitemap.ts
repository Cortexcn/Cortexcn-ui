import type { MetadataRoute } from "next";

import { site } from "@/config/site";

// Generated once at build time, which also lets `NEXT_OUTPUT=export` work.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url }];
}
