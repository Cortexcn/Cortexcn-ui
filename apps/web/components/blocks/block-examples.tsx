import { getCategoryBlockElements } from "@/blocks";
import type { BlockCategory } from "@/blocks/categories";
import { FeaturedBlocks } from "@/components/blocks/featured-blocks";

/** Every block in one category, with preview, code, and install actions. */
export function BlockCategoryList({ category }: { category: BlockCategory }) {
  return <FeaturedBlocks blocks={getCategoryBlockElements(category)} />;
}
