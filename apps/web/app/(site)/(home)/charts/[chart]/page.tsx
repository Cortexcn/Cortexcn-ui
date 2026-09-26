import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChartExamplesGrid } from "@/components/charts/chart-examples";
import { validChartSlugs } from "@/components/charts/chart-slugs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { source } from "@/lib/source";

interface ChartPageProps {
  params: Promise<{ chart: string }>;
}

export function generateStaticParams() {
  return validChartSlugs.map((slug) => ({ chart: slug }));
}

/** Title and description come from the chart's docs page. */
function chartInfo(slug: string) {
  const doc = source.getPage(["components", slug]);
  const fallback = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    name: doc?.data.title ?? fallback,
    description: doc?.data.description,
  };
}

export async function generateMetadata({
  params,
}: ChartPageProps): Promise<Metadata> {
  const { chart } = await params;
  if (!(validChartSlugs as readonly string[]).includes(chart)) {
    notFound();
  }
  const { name, description } = chartInfo(chart);
  return pageMetadata({
    title: `${name} examples`,
    description:
      description ??
      `Live ${name} examples for React and shadcn/ui. Open any example in Studio or copy the code.`,
    path: `/charts/${chart}`,
  });
}

export default async function ChartPage({ params }: ChartPageProps) {
  const { chart } = await params;

  if (!(validChartSlugs as readonly string[]).includes(chart)) {
    notFound();
  }

  const { name } = chartInfo(chart);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Charts", path: "/charts/area-chart" },
          { name, path: `/charts/${chart}` },
        ])}
      />
      <ChartExamplesGrid chartSlug={chart} />
    </>
  );
}
