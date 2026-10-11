import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlockElement } from "@/blocks";
import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { BlocksPageHeader } from "@/components/blocks/blocks-page-header";
import { FeaturedBlocks } from "@/components/blocks/featured-blocks";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { blockPagePath, getGalleryBlock } from "@/lib/blocks/gallery";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

interface BlockPageProps {
  params: Promise<{ category: string; block: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCK_CATEGORIES.flatMap((category) =>
    category.blocks.map((block) => ({ category: category.slug, block })),
  );
}

async function findBlock(params: BlockPageProps["params"]) {
  const { category, block } = await params;
  const found = getGalleryBlock(block);
  if (!found || found.categorySlug !== category) {
    notFound();
  }
  return found;
}

export async function generateMetadata({
  params,
}: BlockPageProps): Promise<Metadata> {
  const block = await findBlock(params);
  return pageMetadata({
    title: `${block.title} ${block.categoryName.toLowerCase()} block`,
    description: block.description,
    path: block.href,
    image: {
      title: block.title,
      section: `Blocks / ${block.categoryName}`,
      item: block.slug,
    },
  });
}

export default async function BlockPage({ params }: BlockPageProps) {
  const block = await findBlock(params);
  const categoryHref = `/blocks?category=${block.categorySlug}`;

  return (
    <main className="flex flex-1 flex-col space-y-12 md:space-y-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blocks", path: "/blocks" },
          { name: block.categoryName, path: categoryHref },
          {
            name: block.title,
            path: blockPagePath(block.categorySlug, block.slug),
          },
        ])}
      />
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 pt-10 text-muted-foreground text-sm md:pt-16"
          >
            <Link
              className="transition-colors hover:text-foreground"
              href="/blocks"
            >
              Blocks
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              className="transition-colors hover:text-foreground"
              href={categoryHref}
            >
              {block.categoryName}
            </Link>
          </nav>
          <BlocksPageHeader
            action={
              <Button
                nativeButton={false}
                render={<Link href={categoryHref} />}
                size="lg"
                variant="outline"
              >
                More {block.categoryName.toLowerCase()} blocks
              </Button>
            }
            className="pt-4 md:pt-5"
            description={block.description}
            title={block.title}
          />
        </div>
      </section>

      <section className="relative w-full pb-16 md:pb-24">
        <div className="container mx-auto w-full overflow-visible">
          <FeaturedBlocks blocks={[getBlockElement(block.slug)]} />
        </div>
      </section>
    </main>
  );
}
