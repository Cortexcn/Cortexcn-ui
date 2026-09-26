import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/*
 * Served on both hosts. Everything stays crawlable: pages that should not be
 * indexed (studio embeds, OG previews, demos) say so with a noindex tag, which
 * crawlers can only read if they are allowed to fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
