import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blockSlugs } from "@/blocks/manifest";
import { BlockLivePreview } from "@/components/blocks/block-live-preview";
import { blockLivePreviewPath } from "@/lib/blocks/block-links";
import { getGalleryBlock } from "@/lib/blocks/gallery";
import { pageMetadata } from "@/lib/seo";

interface BlockLivePreviewPageProps {
  params: Promise<{ block: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return blockSlugs.map((block) => ({ block }));
}

async function findBlock(params: BlockLivePreviewPageProps["params"]) {
  const block = getGalleryBlock((await params).block);
  if (!block) {
    notFound();
  }
  return block;
}

export async function generateMetadata({
  params,
}: BlockLivePreviewPageProps): Promise<Metadata> {
  const block = await findBlock(params);
  return {
    ...pageMetadata({
      title: `${block.title} live preview`,
      description: block.description,
      path: blockLivePreviewPath(block.slug),
    }),
    // The block's own page is the one to index.
    robots: { index: false, follow: true },
  };
}

export default async function BlockLivePreviewPage({
  params,
}: BlockLivePreviewPageProps) {
  const block = await findBlock(params);

  return (
    <BlockLivePreview
      pageHref={block.href}
      slug={block.slug}
      title={block.title}
    />
  );
}
