"use client";

import * as React from "react";

import { uMiniMapOpenSound } from "@/lib/soundcn/u-mini-map-open";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/soundcn/use-sound";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type TOCItemType = {
  title: React.ReactNode;
  url: string;
  depth: number;
};

export type TOCMinimapProps = {
  /** Table-of-contents entries. Each `url` should be a `#hash` to a section id. */
  items: TOCItemType[];
  className?: string;
  /** IntersectionObserver options for scroll-spy. */
  options?: IntersectionObserverInit;
  /** Play a soft sound when the outline expands on hover. Default: `true`. */
  sound?: boolean;
};

/**
 * A compact, hoverable table-of-contents minimap. Renders the page outline as a
 * stack of dashes (indented by heading depth) that expands into a clickable list
 * on hover. The dash matching the section currently in view is highlighted.
 */
export function TOCMinimap({
  items,
  className,
  options,
  sound = true,
}: TOCMinimapProps) {
  const itemIds = React.useMemo(
    () => items.map((item) => item.url.replace("#", "")),
    [items],
  );

  const activeHeading = useActiveHeading(itemIds, options);

  const [play] = useSound(uMiniMapOpenSound, { volume: 0.3 });

  if (!items.length) {
    return null;
  }

  return (
    <div className={cn("ml-auto w-18", className)}>
      <HoverCard
        openDelay={0}
        closeDelay={0}
        onOpenChange={(open) => {
          if (open && sound) {
            play();
          }
        }}
      >
        <HoverCardTrigger asChild>
          <div className="flex flex-col gap-3 py-3 pl-6 transition-opacity duration-200 data-[state=open]:opacity-0">
            {items.map((item) => (
              <div
                key={item.url}
                data-depth={item.depth}
                data-active={item.url === `#${activeHeading}`}
                className={cn(
                  "pointer-events-none h-0.5 w-6 shrink-0 rounded-xs bg-muted-foreground/40 transition-colors duration-200",
                  "data-[depth=3]:ml-2 data-[depth=3]:w-4",
                  "data-[depth=4]:ml-4 data-[depth=4]:w-2",
                  "data-[active=true]:bg-foreground",
                )}
                aria-hidden
              />
            ))}
          </div>
        </HoverCardTrigger>

        <HoverCardContent
          align="start"
          side="left"
          sideOffset={-60}
          className="w-56 overflow-hidden p-0"
        >
          <ul className="flex max-h-[60dvh] flex-col overflow-y-auto overscroll-contain px-6 py-4 text-sm">
            {items.map((item) => (
              <li key={item.url} className="flex py-1">
                <a
                  href={item.url}
                  data-depth={item.depth}
                  data-active={item.url === `#${activeHeading}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToHeading(item.url);
                  }}
                  className={cn(
                    "line-clamp-2 w-full text-muted-foreground transition-colors duration-200 hover:text-foreground",
                    "data-[active=true]:text-foreground",
                    "data-[depth=3]:pl-4 data-[depth=4]:pl-8",
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function useActiveHeading(
  itemIds: string[],
  options?: IntersectionObserverInit,
) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      options ?? { rootMargin: "0% 0% -80% 0%" },
    );

    for (const id of itemIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIds]);

  return activeId;
}

function scrollToHeading(url: string) {
  history.pushState(null, "", url);
  document.getElementById(url.replace("#", ""))?.scrollIntoView({
    behavior: "smooth",
  });
}
