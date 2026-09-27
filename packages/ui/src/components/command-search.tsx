"use client";

/*
 * Adapted from the Spectrum UI Command Search and its useTypewriter hook
 * (https://ui.spectrumhq.in/docs/command-search), licensed under the Apache
 * License 2.0 (https://www.apache.org/licenses/LICENSE-2.0).
 * Changes: the typewriter hook is bundled into this file, the Inter font class
 * is dropped so the palette uses your font, and keyboard navigation guards
 * against an empty list.
 */

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Search,
  SearchX,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface CommandSearchItem {
  label: string;
  icon?: ReactNode;
}

export interface CommandSearchGroup {
  label: string;
  items: CommandSearchItem[];
}

export interface CommandSearchProps {
  /** Static text for the search field, used when `autoType` is false. */
  query?: string;
  /** Queries the palette types out and filters by. */
  queries?: string[];
  /** Type the queries automatically and filter the results as they type. */
  autoType?: boolean;
  placeholder?: string;
  /** Grouped results shown below the search field. */
  groups?: CommandSearchGroup[];
  /** Called with the item when a row is clicked or chosen with Enter. */
  onSelect?: (item: CommandSearchItem) => void;
  /** Fixed height of the palette in pixels. Longer lists scroll inside it. */
  height?: number;
  className?: string;
}

const DEFAULT_QUERIES = ["anim", "chart", "dialog", "side"];

const DEFAULT_GROUPS: CommandSearchGroup[] = [
  {
    label: "Pages",
    items: [
      { label: "Animated Drawer" },
      { label: "Docs" },
      { label: "Components" },
      { label: "Blocks" },
      { label: "Charts" },
      { label: "Directory" },
      { label: "Create" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Accordion" },
      { label: "Alert" },
      { label: "Alert Dialog" },
      { label: "Animated Beam" },
      { label: "Avatar" },
      { label: "Badge" },
      { label: "Breadcrumb" },
      { label: "Button" },
      { label: "Calendar" },
      { label: "Card" },
      { label: "Carousel" },
      { label: "Chart" },
      { label: "Checkbox" },
      { label: "Combobox" },
      { label: "Command" },
      { label: "Dialog" },
      { label: "Drawer" },
      { label: "Dropdown Menu" },
      { label: "Input" },
      { label: "Navigation Menu" },
      { label: "Popover" },
      { label: "Select" },
      { label: "Sidebar" },
      { label: "Table" },
      { label: "Tabs" },
      { label: "Tooltip" },
    ],
  },
];

const ROW_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
const WHITESPACE_RE = /\s+/g;

interface TypewriterOptions {
  typeMs: number;
  deleteMs: number;
  holdMs: number;
  gapMs: number;
  startDelayMs?: number;
  enabled: boolean;
}

interface TypingLoop {
  isCancelled: () => boolean;
  setText: (text: string) => void;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Types the phrase in one character at a time; false if it was cancelled. */
async function typeIn(phrase: string, loop: TypingLoop, delay: () => number) {
  for (let length = 1; length <= phrase.length; length += 1) {
    if (loop.isCancelled()) {
      return false;
    }
    loop.setText(phrase.slice(0, length));
    await sleep(delay());
  }
  return true;
}

/** Deletes the phrase one character at a time; false if it was cancelled. */
async function eraseOut(phrase: string, loop: TypingLoop, deleteMs: number) {
  for (let length = phrase.length - 1; length >= 0; length -= 1) {
    if (loop.isCancelled()) {
      return false;
    }
    loop.setText(phrase.slice(0, length));
    await sleep(deleteMs);
  }
  return true;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Cycles through the phrases: types one in, holds it, deletes it, and moves on.
 * With reduced motion it shows the first phrase and stays still.
 */
function useTypewriter(
  phrases: string[],
  {
    typeMs,
    deleteMs,
    holdMs,
    gapMs,
    startDelayMs = 400,
    enabled,
  }: TypewriterOptions,
) {
  const [text, setText] = useState("");
  const reduced = usePrefersReducedMotion();
  const phrasesKey = phrases.join(" ");
  const phrasesRef = useRef(phrases);
  phrasesRef.current = phrases;

  // biome-ignore lint/correctness/useExhaustiveDependencies: phrasesKey restarts the loop when the phrases change
  useEffect(() => {
    const list = phrasesRef.current;
    if (!enabled || list.length === 0) {
      return;
    }
    if (reduced) {
      setText(list[0] ?? "");
      return;
    }

    let cancelled = false;
    const loop: TypingLoop = { isCancelled: () => cancelled, setText };
    // A little randomness in the typing speed reads as a person typing.
    const typingDelay = () => typeMs * (0.6 + Math.random() * 0.8);

    const run = async () => {
      await sleep(startDelayMs);
      for (let index = 0; !cancelled; index += 1) {
        const phrase = list[index % list.length] ?? "";
        if (!(await typeIn(phrase, loop, typingDelay))) {
          return;
        }
        await sleep(holdMs);
        if (!(await eraseOut(phrase, loop, deleteMs))) {
          return;
        }
        await sleep(gapMs);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    reduced,
    phrasesKey,
    typeMs,
    deleteMs,
    holdMs,
    gapMs,
    startDelayMs,
  ]);

  return text;
}

function optionId(label: string) {
  return `command-search-option-${label.replace(WHITESPACE_RE, "-").toLowerCase()}`;
}

function Caret() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      aria-hidden
      className="ml-[2px] h-[18px] w-[1.5px] shrink-0 rounded-full bg-foreground"
      transition={{
        duration: 1.1,
        repeat: Number.POSITIVE_INFINITY,
        times: [0, 0.5, 0.5, 1],
      }}
    />
  );
}

function Highlighted({ label, needle }: { label: string; needle: string }) {
  if (!needle) {
    return <>{label}</>;
  }
  const start = label.toLowerCase().indexOf(needle);
  if (start === -1) {
    return <>{label}</>;
  }
  const end = start + needle.length;
  return (
    <>
      {label.slice(0, start)}
      <span className="rounded-[3px] bg-amber-200/40 dark:bg-amber-400/15">
        {label.slice(start, end)}
      </span>
      {label.slice(end)}
    </>
  );
}

/**
 * A command palette that types out queries and filters grouped results as it
 * goes, with a highlight that glides between rows and arrow-key navigation.
 */
export function CommandSearch({
  query = "anim",
  queries,
  autoType = true,
  placeholder = "Search…",
  groups = DEFAULT_GROUPS,
  onSelect,
  height = 408,
  className,
}: CommandSearchProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-10% 0px" });

  const typed = useTypewriter(queries ?? DEFAULT_QUERIES, {
    typeMs: 170,
    deleteMs: 80,
    holdMs: 2800,
    gapMs: 1000,
    enabled: autoType && inView,
  });

  const displayQuery = autoType ? typed : query;
  const needle = displayQuery.trim().toLowerCase();

  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: needle
            ? group.items.filter((item) =>
                item.label.toLowerCase().includes(needle),
              )
            : group.items,
        }))
        .filter((group) => group.items.length > 0),
    [groups, needle],
  );

  // The highlight follows the item's label, never a numeric index, so it
  // stays right while rows animate in and out. When the hovered row is
  // filtered away, it falls back to the first visible row.
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const visibleLabels = useMemo(
    () =>
      new Set(
        filteredGroups.flatMap((group) =>
          group.items.map((item) => item.label),
        ),
      ),
    [filteredGroups],
  );
  const activeLabel =
    hoveredLabel && visibleLabels.has(hoveredLabel)
      ? hoveredLabel
      : (filteredGroups[0]?.items[0]?.label ?? null);

  // One highlight element for the whole list, measured from the DOM whenever
  // the active row or the filter changes. A shared layoutId pill goes stale
  // here, because the list reflows under the animation.
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const [pillY, setPillY] = useState<number | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: filteredGroups moves the rows, so the pill has to measure again
  useLayoutEffect(() => {
    const row = activeLabel ? rowRefs.current.get(activeLabel) : undefined;
    const next = row ? row.offsetTop : null;
    setPillY((previous) => (previous === next ? previous : next));
  }, [activeLabel, filteredGroups]);

  const flatItems = useMemo(
    () => filteredGroups.flatMap((group) => group.items),
    [filteredGroups],
  );

  const moveTo = useCallback((item: CommandSearchItem | undefined) => {
    if (!item) {
      return;
    }
    setHoveredLabel(item.label);
    rowRefs.current.get(item.label)?.scrollIntoView({ block: "nearest" });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (flatItems.length === 0) {
        return;
      }
      const currentIndex = Math.max(
        0,
        flatItems.findIndex((item) => item.label === activeLabel),
      );
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveTo(flatItems[(currentIndex + 1) % flatItems.length]);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveTo(
          flatItems[(currentIndex - 1 + flatItems.length) % flatItems.length],
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        const selected = flatItems[currentIndex] ?? flatItems[0];
        if (selected) {
          onSelect?.(selected);
        }
      }
    },
    [activeLabel, flatItems, moveTo, onSelect],
  );

  return (
    <div
      aria-activedescendant={activeLabel ? optionId(activeLabel) : undefined}
      aria-label="Command search"
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[14px] bg-white p-2 pb-11 outline-hidden",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_0_0_1px_rgba(10,10,10,0.05)] drop-shadow-[0_4px_14.2px_rgba(108,108,108,0.25)]",
        "focus-visible:ring-2 focus-visible:ring-neutral-400/40 dark:focus-visible:ring-neutral-500/40",
        "dark:bg-neutral-950 dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.12)]",
        className,
      )}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoveredLabel(null)}
      ref={rootRef}
      role="listbox"
      style={{ height }}
      tabIndex={0}
    >
      <div className="flex h-9 shrink-0 items-center gap-3 rounded-lg border border-border bg-neutral-200/50 px-3 dark:bg-neutral-800/50">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="flex min-w-0 flex-1 items-center text-[#020202] text-base dark:text-neutral-50">
          <span className="whitespace-pre">{displayQuery}</span>
          <Caret />
          {displayQuery ? null : (
            <span className="ml-1 truncate text-muted-foreground/60">
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {/* Filtering is instant, like a native palette; the animated piece is
          the highlight gliding between rows. */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
        <motion.span
          animate={{ y: pillY ?? 0, opacity: pillY === null ? 0 : 1 }}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-9 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/60"
          initial={false}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
        />

        {filteredGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pt-4 pb-1 font-medium text-muted-foreground text-xs leading-4">
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = item.label === activeLabel;
              return (
                <motion.button
                  aria-selected={active}
                  className="relative flex h-9 w-full items-center gap-3 rounded-lg px-3 text-left outline-hidden"
                  id={optionId(item.label)}
                  key={item.label}
                  onClick={() => onSelect?.(item)}
                  onFocus={() => setHoveredLabel(item.label)}
                  onMouseEnter={() => setHoveredLabel(item.label)}
                  ref={(element) => {
                    if (element) {
                      rowRefs.current.set(item.label, element);
                    } else {
                      rowRefs.current.delete(item.label);
                    }
                  }}
                  role="option"
                  tabIndex={-1}
                  type="button"
                  whileTap={{ scale: 0.985 }}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <motion.span
                      animate={{ x: active ? 2 : 0 }}
                      className="shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
                      transition={ROW_SPRING}
                    >
                      {item.icon ?? <ArrowRight />}
                    </motion.span>
                    <span
                      className={cn(
                        "truncate font-medium text-sm leading-5 transition-colors duration-150",
                        active
                          ? "text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-900/80 dark:text-neutral-100/80",
                      )}
                    >
                      <Highlighted label={item.label} needle={needle} />
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        ))}

        <AnimatePresence>
          {filteredGroups.length === 0 ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2 pt-10 text-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <SearchX className="h-5 w-5 text-muted-foreground/60" />
              <p className="text-muted-foreground text-sm">
                No results for&nbsp;
                <span className="font-medium text-foreground">
                  “{displayQuery}”
                </span>
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-11 items-center gap-2 rounded-b-[14px] border-border border-t bg-neutral-50 px-4 dark:bg-neutral-900/60">
        <kbd className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900">
          <ArrowUp className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <kbd className="flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900">
          <ArrowDown className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <span className="font-medium text-[#71717a] text-xs dark:text-neutral-400">
          Navigate
        </span>
        <kbd className="ml-2 flex h-[22px] w-[22px] items-center justify-center rounded-md border border-border bg-white dark:bg-neutral-900">
          <CornerDownLeft className="h-3 w-3 text-muted-foreground" />
        </kbd>
        <span className="font-medium text-[#71717a] text-xs dark:text-neutral-400">
          Select
        </span>
      </div>
    </div>
  );
}
