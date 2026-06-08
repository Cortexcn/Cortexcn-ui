import Link from "next/link";

import { cn } from "@/lib/utils";
import { source } from "@/lib/source";

// Lists every block category page under `/docs/blocks` as a grid of links,
// derived from the Fumadocs source tree so it stays in sync automatically.
export function BlocksOverview() {
  const blocks = source
    .getPages()
    .filter((page) => page.slugs[0] === "blocks" && page.slugs.length === 2)
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return (
    <div className="not-prose mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((page) => (
        <Link
          key={page.url}
          href={page.url}
          className={cn(
            "group flex flex-col gap-1 rounded-lg border border-fd-border p-4 transition-colors",
            "hover:border-fd-primary/50 hover:bg-fd-accent/40",
          )}
        >
          <span className="text-base font-medium text-fd-foreground transition-colors group-hover:text-fd-primary">
            {page.data.title}
          </span>
          {page.data.description ? (
            <span className="text-sm text-fd-muted-foreground">
              {page.data.description}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
