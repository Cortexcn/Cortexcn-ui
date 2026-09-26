import type * as PageTree from "fumadocs-core/page-tree";
import Link from "next/link";
import { source } from "@/lib/source";

/**
 * Pages listed under a sidebar separator (e.g. `---Charts---` in
 * content/docs/components/meta.json), up to the next separator.
 */
function getCategoryPages(category: string): PageTree.Item[] {
  const nodes = source.pageTree.children;
  const start = nodes.findIndex(
    (node) => node.type === "separator" && node.name === category,
  );
  if (start === -1) {
    return [];
  }

  const pages: PageTree.Item[] = [];
  for (const node of nodes.slice(start + 1)) {
    if (node.type === "separator") {
      break;
    }
    if (node.type === "page") {
      pages.push(node);
    }
  }
  return pages;
}

export function ComponentsList({ category }: { category: string }) {
  const pages = getCategoryPages(category).sort((a, b) =>
    String(a.name).localeCompare(String(b.name)),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
      {pages.map((page) => (
        <Link
          className="font-medium text-lg underline-offset-4 hover:underline md:text-base"
          href={page.url}
          key={page.url}
        >
          {page.name}
        </Link>
      ))}
    </div>
  );
}
