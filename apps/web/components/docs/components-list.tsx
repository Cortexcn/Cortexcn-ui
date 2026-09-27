import Link from "next/link";

import { componentGroupPages } from "@/lib/component-groups";

export function ComponentsList({ category }: { category: string }) {
  const pages = componentGroupPages(category).sort((a, b) =>
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
