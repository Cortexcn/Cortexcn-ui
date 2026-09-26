import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOCK_CATEGORIES, getBlockCategory } from "@/blocks/categories";
import { BlockCategoryList } from "@/components/blocks/block-examples";
import { GridPageHero } from "@/components/design/grid-page-hero";
import { Button } from "@/components/ui/button";

interface BlockCategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return BLOCK_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: BlockCategoryPageProps): Promise<Metadata> {
  const category = getBlockCategory((await params).category);
  if (!category) {
    notFound();
  }
  return {
    title: `${category.name} blocks`,
    description: category.description,
  };
}

export default async function BlockCategoryPage({
  params,
}: BlockCategoryPageProps) {
  const category = getBlockCategory((await params).category);
  if (!category) {
    notFound();
  }

  const count = category.blocks.length;

  return (
    <main className="flex flex-1 flex-col space-y-24">
      <section className="relative w-full">
        <div className="container mx-auto w-full overflow-visible">
          <GridPageHero
            action={
              <Button
                nativeButton={false}
                render={<Link href="/blocks" />}
                size="lg"
                variant="outline"
              >
                All blocks
              </Button>
            }
            subtitle={`${category.description} ${count} ${count === 1 ? "block" : "blocks"}.`}
            title={category.name}
          />
        </div>
      </section>

      <section
        className="relative w-full pt-8 pb-16 md:pt-12 md:pb-24"
        id="blocks"
      >
        <div className="container mx-auto w-full overflow-visible">
          <BlockCategoryList category={category} />
        </div>
      </section>
    </main>
  );
}
