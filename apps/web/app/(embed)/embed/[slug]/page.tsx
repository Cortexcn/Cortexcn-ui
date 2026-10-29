import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentEmbed } from "@/components/embed/component-embed";
import { componentDocsUrl } from "@/lib/component-families";
import {
  EMBED_CHART_LOADING,
  EMBED_SLUGS,
  EMBED_THEME_SCRIPT,
  isEmbedSlug,
} from "@/lib/embeds";
import { pageMetadata } from "@/lib/seo";
import { canonicalUrlFor } from "@/lib/site-url";

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return EMBED_SLUGS.map((slug) => ({ slug }));
}

async function findSlug(params: EmbedPageProps["params"]) {
  const { slug } = await params;
  if (!isEmbedSlug(slug)) {
    notFound();
  }
  return slug;
}

export async function generateMetadata({
  params,
}: EmbedPageProps): Promise<Metadata> {
  const slug = await findSlug(params);
  return {
    ...pageMetadata({
      title: `${slug} preview`,
      description: `A live preview of the Cortexcn ${slug} component.`,
      path: `/embed/${slug}`,
    }),
    // The component's docs page is the one to index.
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrlFor(
        componentDocsUrl(EMBED_CHART_LOADING.get(slug)?.chart ?? slug),
      ),
    },
  };
}

/**
 * One component's live demo and nothing else, for other sites to show in an
 * iframe. The parent passes `?theme=dark|light` so the demo matches it.
 */
export default async function EmbedPage({ params }: EmbedPageProps) {
  const slug = await findSlug(params);

  return (
    <main className="w-full" data-cortexcn-embed="">
      {/* Before the demo paints, so it never flashes the wrong theme. */}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed inline script, no user input
        dangerouslySetInnerHTML={{ __html: EMBED_THEME_SCRIPT }}
      />
      <ComponentEmbed slug={slug} />
    </main>
  );
}
