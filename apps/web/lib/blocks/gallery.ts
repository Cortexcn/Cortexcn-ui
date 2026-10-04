import { BLOCK_CATEGORIES } from "@/blocks/categories";
import type { BlockSlug } from "@/blocks/manifest";
import { BLOCK_METAS } from "@/blocks/metas";

export interface GalleryBlock {
  slug: BlockSlug;
  /** The name without its category prefix, e.g. "Spotlight Grid". */
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  /** Its place in its category, two digits: "01", "02", and so on. */
  number: string;
  /** The block's own page, with its preview, code, and install command. */
  href: string;
}

/**
 * What ends the category prefix of a block name, as in "Feature: Studio
 * Grid": a colon, or a hyphen or em dash between spaces.
 */
const CATEGORY_PREFIX = /\s+[\u2014-]\s+|:\s+/;

export interface GalleryCategory {
  slug: string;
  name: string;
  count: number;
}

/** Drops the category prefix, so "Feature: Studio Grid" reads "Studio Grid". */
function shortTitle(name: string) {
  return name.split(CATEGORY_PREFIX).at(-1) ?? name;
}

/** One block's page: its preview, code, and install command. */
export function blockPagePath(categorySlug: string, slug: string) {
  return `/blocks/${categorySlug}/${slug}`;
}

/** Every block, in category order, as a card for the /blocks gallery. */
export function getGalleryBlocks(): GalleryBlock[] {
  return BLOCK_CATEGORIES.flatMap((category) =>
    category.blocks.map((slug, index) => ({
      slug,
      title: shortTitle(BLOCK_METAS[slug].name),
      description: BLOCK_METAS[slug].description,
      categorySlug: category.slug,
      categoryName: category.name,
      number: String(index + 1).padStart(2, "0"),
      href: blockPagePath(category.slug, slug),
    })),
  );
}

export function getGalleryBlock(slug: string) {
  return getGalleryBlocks().find((block) => block.slug === slug);
}

export function getGalleryCategories(): GalleryCategory[] {
  return BLOCK_CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: category.blocks.length,
  }));
}

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "");

export function filterGalleryBlocks(
  blocks: GalleryBlock[],
  { category, query }: { category: string; query: string },
) {
  const inCategory = category
    ? blocks.filter((block) => block.categorySlug === category)
    : blocks;

  if (!query) {
    return inCategory;
  }

  const normalizedQuery = normalize(query);
  return inCategory.filter((block) =>
    [block.title, block.description, block.categoryName].some((text) =>
      normalize(text).includes(normalizedQuery),
    ),
  );
}
