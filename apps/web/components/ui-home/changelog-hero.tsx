import Link from "next/link";

import { blockSlugs } from "@/blocks/manifest";
import { COMPONENT_GROUPS, componentGroupPages } from "@/lib/component-groups";
import { libraryNavLinks } from "@/lib/library-nav-links";
import { SITE_TEMPLATES } from "@/lib/site-templates";
import { cn } from "@/lib/utils";

import { Container, SectionBadge } from "./primitives";
import { HeadingWords } from "./reveal";

const TEMPLATES_URL = "/templates";

/**
 * What the library holds today, counted from the docs, the block list, and
 * the templates. Templates count once the library nav links to them, so the
 * tile never points at a page that is not live yet.
 */
function libraryCounts() {
  const families = COMPONENT_GROUPS.map((group) => ({
    label: group.name,
    count: componentGroupPages(group.name).length,
    href: `/docs/components#${group.category}`,
  }));
  const libraryPaths: readonly string[] = libraryNavLinks.map(
    (link) => link.url,
  );
  const templatesLive = libraryPaths.includes(TEMPLATES_URL);
  return [
    ...families,
    { label: "Blocks", count: blockSlugs.length, href: "/blocks" },
    ...(templatesLive
      ? [
          {
            label: "Templates",
            count: SITE_TEMPLATES.length,
            href: TEMPLATES_URL,
          },
        ]
      : []),
  ];
}

export function ChangelogHero() {
  const counts = libraryCounts();

  return (
    <section className="pt-28 pb-14 md:pt-36 md:pb-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-5">
          <SectionBadge>Changelog</SectionBadge>
          <h1 className="text-balance font-light font-sentient text-[46px] leading-[1.05] tracking-[-0.05em] md:text-5xl lg:text-[56px]">
            <HeadingWords
              breakLines
              enterOnLoad
              lines={[
                { text: "Every release," },
                { text: "in one place.", muted: true },
              ]}
              mutedClassName="text-body"
            />
          </h1>
          <p className="max-w-xl text-pretty text-body text-lg leading-[1.4]">
            New components, blocks, and fixes, newest first, with a link to
            everything that shipped. Everything listed here is in the registry.
          </p>
        </div>

        <ul
          className={cn(
            "grid grid-cols-2 gap-2 sm:grid-cols-3",
            counts.length > 5 ? "lg:grid-cols-6" : "lg:grid-cols-5",
          )}
        >
          {counts.map((item) => (
            <li key={item.label}>
              <Link
                className="flex h-full flex-col gap-1 rounded-2xl border border-border bg-(--surface) p-5 transition-colors hover:bg-(--surface-strong)"
                href={item.href}
              >
                <span className="font-light font-sentient text-4xl tabular-nums tracking-[-0.04em]">
                  {item.count}
                </span>
                <span className="text-body text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
