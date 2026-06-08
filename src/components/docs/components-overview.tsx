import Link from "next/link";

import { cn } from "@/lib/utils";
import { source } from "@/lib/source";

// Lists every component page under `/docs/components` as a grid of links,
// derived from the Fumadocs source tree so it stays in sync automatically.
export function ComponentsOverview() {
  const components = source
    .getPages()
    .filter((page) => page.slugs[0] === "components" && page.slugs.length === 2)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return (
    <div className="not-prose mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
      {components.map((page) => (
        <Link
          key={page.url}
          href={page.url}
          className={cn(
            "text-base font-medium text-fd-foreground/90 transition-colors",
            "hover:text-fd-primary",
          )}
        >
          {page.data.title}
        </Link>
      ))}
    </div>
  );
}
