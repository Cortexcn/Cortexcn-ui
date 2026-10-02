"use client";

import { Icon } from "@cortexcn/icons";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BLOCK_PREVIEWS } from "@/blocks/previews";
import { FitToFrame } from "@/components/blocks/fit-to-frame";
import { useSmoothScrollTo } from "@/components/smooth-scroll/use-smooth-scroll-to";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  filterGalleryBlocks,
  type GalleryBlock,
  type GalleryCategory,
} from "@/lib/blocks/gallery";
import { cn } from "@/lib/utils";

/** Clears the fixed site header, which floats a little lower once scrolled. */
const HEADER_OFFSET = 112;

const BAND_HATCH =
  "bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]";

interface BlockGalleryProps {
  blocks: GalleryBlock[];
  categories: GalleryCategory[];
}

type Orientation = "vertical" | "horizontal";

/** The /blocks gallery, with its category and search kept in the URL. */
export function BlockGallery(props: BlockGalleryProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const scrollTo = useSmoothScrollTo();
  const resultsRef = useRef<HTMLElement>(null);

  const category = searchParams.get("category") ?? "";
  const query = searchParams.get("q") ?? "";

  // Shallow URL updates: Next.js syncs useSearchParams with the History API,
  // so filtering never refetches the page.
  const setParams = (next: { category?: string | null; q?: string | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `${pathname}?${search}` : pathname,
    );
  };

  return (
    <BlockGalleryView
      {...props}
      category={category}
      onCategoryChange={(value) => {
        setParams({ category: value });
        const results = resultsRef.current;
        const top = results?.getBoundingClientRect().top ?? 0;
        if (results && top < HEADER_OFFSET) {
          scrollTo(window.scrollY + top - HEADER_OFFSET);
        }
      }}
      onClearFilters={() => setParams({ category: null, q: null })}
      onQueryChange={(value) => setParams({ q: value })}
      query={query}
      resultsRef={resultsRef}
    />
  );
}

/**
 * The layout of the gallery. Rendered without handlers, it is the static
 * first paint: every block, no filters, every category a plain link.
 */
export function BlockGalleryView({
  blocks,
  categories,
  category = "",
  query = "",
  resultsRef,
  onCategoryChange,
  onQueryChange,
  onClearFilters,
}: BlockGalleryProps & {
  category?: string;
  query?: string;
  resultsRef?: React.Ref<HTMLElement>;
  onCategoryChange?: (category: string | null) => void;
  onQueryChange?: (query: string | null) => void;
  onClearFilters?: () => void;
}) {
  const results = filterGalleryBlocks(blocks, { category, query });
  const categoryName = categories.find((item) => item.slug === category)?.name;
  const onClear = category || query ? onClearFilters : undefined;

  const filters = (orientation: Orientation) => (
    <CategoryFilters
      active={category}
      categories={categories}
      onChange={onCategoryChange}
      orientation={orientation}
      total={blocks.length}
    />
  );

  return (
    <div className="border border-border">
      <div
        className={cn(
          "flex items-center gap-3 border-border border-b p-3",
          BAND_HATCH,
        )}
      >
        <div className="min-w-0 flex-1 sm:ml-auto sm:max-w-80 sm:flex-none sm:basis-80">
          <SearchField onChange={onQueryChange} value={query} />
        </div>
      </div>

      <div className="border-border border-b p-3 lg:hidden">
        {filters("horizontal")}
      </div>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="border-border border-r max-lg:hidden">
          <div className="sticky top-28 px-5 pt-8 pb-10">
            <h2 className="mb-5 px-3 font-semibold text-xl tracking-tight">
              Categories
            </h2>
            {filters("vertical")}
          </div>
        </aside>

        <section
          aria-label="Blocks"
          className="min-w-0 p-3 sm:p-6"
          ref={resultsRef}
        >
          <div className="mb-4 flex min-h-8 items-center justify-between gap-2">
            <p
              aria-live="polite"
              className="font-mono text-muted-foreground text-xs uppercase tracking-wider"
            >
              {results.length} {results.length === 1 ? "block" : "blocks"}
              {categoryName && ` in ${categoryName}`}
              {query && ` matching "${query}"`}
            </p>
            {onClear && (
              <Button onClick={onClear} size="sm" variant="ghost">
                <Icon className="size-3.5" name="IconCrossSmall" />
                Clear filters
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border border-dashed px-4 py-16 text-center">
              <p className="text-sm">No blocks match.</p>
              {onClear && (
                <Button onClick={onClear} size="sm" variant="outline">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {results.map((block) => (
                <GalleryCard block={block} key={block.slug} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function GalleryCard({ block }: { block: GalleryBlock }) {
  const Preview = BLOCK_PREVIEWS[block.slug];

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl bg-muted/50 p-3 transition-colors hover:bg-muted sm:p-4">
      <div className="overflow-hidden rounded-xl border bg-background shadow-xs transition-shadow group-hover:shadow-md">
        <FitToFrame>
          <Preview />
        </FitToFrame>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pb-1 sm:px-2">
        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
          {block.categoryName}
        </p>
        <h3 className="font-semibold text-xl tracking-tight">{block.title}</h3>
        <p className="line-clamp-2 text-muted-foreground text-sm">
          {block.description}
        </p>
      </div>

      {/* Full-card link, outside the thumbnail so no interactive element nests inside it. */}
      <Link
        className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        href={block.href}
      >
        <span className="sr-only">
          View {block.title}, {block.categoryName}
        </span>
      </Link>
    </div>
  );
}

function CategoryFilters({
  categories,
  total,
  active,
  orientation,
  onChange,
}: {
  categories: GalleryCategory[];
  total: number;
  active: string;
  orientation: Orientation;
  onChange?: (category: string | null) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // A deep link such as /blocks?category=stat-cards can land on a chip that
  // is scrolled out of sight, so center the active one in the row.
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>("[aria-current=page]");
    if (orientation !== "horizontal" || !list || !current || !active) {
      return;
    }
    list.scrollLeft =
      current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2;
  }, [active, orientation]);

  const options = [
    { slug: "", name: "All blocks", count: total },
    ...categories,
  ];

  return (
    <nav aria-label="Categories">
      <ul
        className={
          orientation === "vertical"
            ? "flex flex-col gap-1"
            : "no-scrollbar relative flex gap-2 overflow-x-auto"
        }
        ref={listRef}
      >
        {options.map((option) => {
          const isActive = option.slug === active;
          return (
            <li className="shrink-0" key={option.slug || "all"}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-4 transition-colors",
                  orientation === "vertical"
                    ? "justify-between rounded-lg px-3 py-2 text-[15px]"
                    : "h-9 rounded-full border border-border px-4 text-sm",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  isActive &&
                    orientation === "horizontal" &&
                    "border-transparent",
                )}
                href={
                  option.slug ? `/blocks?category=${option.slug}` : "/blocks"
                }
                onClick={(event) => {
                  if (
                    !onChange ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  ) {
                    return;
                  }
                  event.preventDefault();
                  onChange(option.slug || null);
                }}
                prefetch={false}
                scroll={false}
              >
                <span className="truncate">{option.name}</span>
                <span className="font-mono text-xs tabular-nums">
                  {option.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string | null) => void;
}) {
  return (
    <InputGroup className="border-border bg-white dark:bg-background">
      <InputGroupAddon align="inline-start">
        <Icon className="size-4" name="IconMagnifyingGlass" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search blocks"
        onChange={(event) => onChange?.(event.target.value || null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onChange?.(null);
          }
        }}
        placeholder="Search blocks..."
        readOnly={!onChange}
        value={value}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear search"
            onClick={() => onChange?.(null)}
            size="icon-xs"
          >
            <Icon className="size-3.5" name="IconCrossSmall" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
