import type { MetadataRoute } from "next";

import { site } from "@/config/site";

// Generated once at build time, which also lets `NEXT_OUTPUT=export` work.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
