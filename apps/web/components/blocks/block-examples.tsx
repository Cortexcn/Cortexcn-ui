import { getCategoryBlockElements } from "@/blocks";
import { BLOCK_CATEGORIES, type BlockCategory } from "@/blocks/categories";
import { BlockCategoryCard } from "@/components/blocks/block-category-card";
import { FeaturedBlocks } from "@/components/blocks/featured-blocks";

/** Category cards for /blocks. */
export function BlockCategoryGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {BLOCK_CATEGORIES.map((category) => (
        <BlockCategoryCard category={category} key={category.slug} />
      ))}
    </div>
  );
}

/** Every block in one category, with preview, code, and install actions. */
export function BlockCategoryList({ category }: { category: BlockCategory }) {
  return <FeaturedBlocks blocks={getCategoryBlockElements(category)} />;
}
