import Link from "next/link";
import { COMPONENT_GROUPS } from "@/lib/component-families";
import { componentGroupPages } from "@/lib/component-groups";
import { source } from "@/lib/source";
import { ComponentArt } from "./component-art";
import {
  ComponentThumbnail,
  hasComponentThumbnail,
} from "./component-thumbnails";

const DOCS_PREFIX = /^\/docs\//;

function slugOf(url: string) {
  return url.split("/").filter(Boolean).at(-1) ?? "";
}

/**
 * A family's pages as cards: a live preview of each component (or a drawing,
 * for families without previews), its name, and the first line of its
 * description. Used on the family overview pages.
 *
 * The preview sits outside the link, since it holds buttons and links of its
 * own; the title's link stretches over the whole card instead.
 */
export function ComponentsList({ category }: { category: string }) {
  const family = COMPONENT_GROUPS.find((group) => group.name === category);
  const pages = componentGroupPages(category)
    .map((page) => {
      const data = source.getPage(
        page.url.replace(DOCS_PREFIX, "").split("/"),
      )?.data;
      return {
        url: page.url,
        slug: slugOf(page.url),
        name: data?.title ?? String(page.name),
        description: data?.description ?? "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const livePreviews = family?.category === "components";

  return (
    <ul className="not-prose m-0 my-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
      {pages.map((page) => (
        <li
          className="relative flex flex-col rounded-shell-xl border border-border bg-muted/50 p-1.5 shadow-xs transition-[box-shadow,border-color] duration-200 hover:border-foreground/15 hover:shadow-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring/50 motion-reduce:transition-none"
          key={page.url}
        >
          <div className="overflow-hidden rounded-shell-lg border border-border bg-card">
            {livePreviews && hasComponentThumbnail(page.slug) ? (
              <ComponentThumbnail slug={page.slug} />
            ) : (
              <ComponentArt family={family?.category} name={page.slug} />
            )}
          </div>
          <div className="flex flex-col gap-1.5 px-2.5 pt-3.5 pb-2.5">
            <Link
              className="font-semibold text-[15px] text-foreground tracking-tight no-underline outline-none after:absolute after:inset-0 after:rounded-shell-xl"
              href={page.url}
            >
              {page.name}
            </Link>
            {page.description ? (
              <span className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                {page.description}
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
