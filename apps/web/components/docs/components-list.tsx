import Link from "next/link";
import { COMPONENT_GROUPS } from "@/lib/component-families";
import { componentGroupPages } from "@/lib/component-groups";
import { source } from "@/lib/source";
import { ComponentArt } from "./component-art";

const DOCS_PREFIX = /^\/docs\//;

function slugOf(url: string) {
  return url.split("/").filter(Boolean).at(-1) ?? "";
}

/**
 * A family's pages as cards: a drawing of each component, its name, and the
 * first line of its description. Used on the family overview pages.
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
        name: data?.title ?? String(page.name),
        description: data?.description ?? "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul className="not-prose m-0 my-8 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3">
      {pages.map((page) => (
        <li className="flex" key={page.url}>
          <Link
            className="group/card flex w-full flex-col rounded-shell-xl border border-border bg-muted/50 p-1.5 no-underline shadow-xs outline-none transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            href={page.url}
          >
            <span className="block overflow-hidden rounded-shell-lg border border-border bg-card">
              <ComponentArt
                className="transition-transform duration-300 group-hover/card:scale-[1.04] motion-reduce:transition-none"
                family={family?.category}
                name={slugOf(page.url)}
              />
            </span>
            <span className="flex flex-col gap-1.5 px-2.5 pt-3.5 pb-2.5">
              <span className="font-semibold text-[15px] text-foreground tracking-tight">
                {page.name}
              </span>
              {page.description ? (
                <span className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                  {page.description}
                </span>
              ) : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
