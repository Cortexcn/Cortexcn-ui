"use client";

import { Icon } from "@cortexcn/icons";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { useEffect, useState } from "react";
import { markSearchOpenedFromClick } from "@/lib/analytics/search-source";
import { cn } from "@/lib/utils";

function SearchShortcut() {
  const [modifier, setModifier] = useState("⌘");

  useEffect(() => {
    if (window.navigator.userAgent.includes("Windows")) {
      setModifier("Ctrl");
    }
  }, []);

  return (
    <kbd className="pointer-events-none ml-auto hidden items-center gap-0.5 rounded-[0.3rem] border border-border bg-muted/60 px-1.5 py-0.5 font-medium font-mono text-[0.625rem] text-muted-foreground sm:inline-flex">
      <span>{modifier}</span>
      <span>K</span>
    </kbd>
  );
}

interface DocsSearchTriggerProps {
  className?: string;
  hideIfDisabled?: boolean;
}

export function DocsSearchTrigger({
  className,
  hideIfDisabled,
}: DocsSearchTriggerProps) {
  const { setOpenSearch, enabled } = useSearchContext();

  if (hideIfDisabled && !enabled) {
    return null;
  }

  return (
    <button
      aria-label="Open search"
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-shell-sm border border-border bg-background/70 px-2.5 text-muted-foreground text-sm shadow-xs outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-input/30",
        className,
      )}
      data-search-full=""
      onClick={() => {
        markSearchOpenedFromClick();
        setOpenSearch(true);
      }}
      type="button"
    >
      <Icon className="size-4 shrink-0" name="IconMagnifyingGlass" />
      <span>Search docs</span>
      <SearchShortcut />
    </button>
  );
}
