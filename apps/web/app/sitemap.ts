import type { MetadataRoute } from "next";
import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { validChartSlugs } from "@/components/charts/chart-slugs";
import { canonicalUrlFor, SITE_URL } from "@/lib/site-url";
import { source } from "@/lib/source";

/*
 * Every indexable page, at its canonical URL: marketing pages on
 * www.cortexcn.dev and docs on ui.cortexcn.dev (both hosts belong to the same
 * Search Console domain property, so one sitemap can list both). Redirects
 * such as /charts and /playground are left out. `lastmod` is omitted rather
 * than guessed, since Google only trusts it when it is accurate.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blocks`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/studio`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const blockRoutes: MetadataRoute.Sitemap = BLOCK_CATEGORIES.map(
    (category) => ({
      url: `${SITE_URL}/blocks/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  const chartRoutes: MetadataRoute.Sitemap = validChartSlugs.map((slug) => ({
    url: `${SITE_URL}/charts/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const docRoutes: MetadataRoute.Sitemap = source
    .getPages()
    .map((page) => ({
      url: canonicalUrlFor(page.url),
      changeFrequency: "weekly" as const,
      priority: page.url === "/docs" ? 0.9 : 0.8,
    }))
    .sort((a, b) => a.url.localeCompare(b.url));

  return [...pages, ...blockRoutes, ...chartRoutes, ...docRoutes];
}
