import { redirect } from "next/navigation";
import { BLOCK_CATEGORIES } from "@/blocks/categories";

interface BlockCategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOCK_CATEGORIES.map((category) => ({ category: category.slug }));
}

/**
 * Each category now lives in the gallery, filtered to it, and every block has
 * its own page. This keeps older links to a category working.
 */
export default async function BlockCategoryPage({
  params,
}: BlockCategoryPageProps) {
  const { category } = await params;
  redirect(`/blocks?category=${category}`);
}
