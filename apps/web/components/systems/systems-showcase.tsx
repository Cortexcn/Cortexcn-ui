"use client";

import { Icon } from "@cortexcn/icons";
import { Badge } from "@cortexcn/ui/components/badge";
import { Button } from "@cortexcn/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ShowcaseSystem } from "@/lib/design-systems";
import { cn } from "@/lib/utils";
import { ComponentGallery } from "./component-gallery";
import { systemFontVariables } from "./fonts";
import { BASE_SYSTEM, SystemMark } from "./system-logo";

const BASE = BASE_SYSTEM;
const STORAGE_KEY = "cortexcn.systems.theme";
/** `?system=<id>` makes a system shareable as a link. */
const SYSTEM_PARAM = "system";
const BASE_SCALE = [12, 14, 16, 18, 24, 30, 48];

const BAND_HATCH =
  "bg-[repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]";

type Orientation = "vertical" | "horizontal";

interface ListEntry {
  id: string;
  name: string;
  tags: string[];
  description: string;
}

const BASE_ENTRY: ListEntry = {
  id: BASE,
  name: "Cortexcn",
  tags: ["default"],
  description:
    "Cortexcn's own tokens: rounded corners, neutral surfaces, Geist.",
};

function readStoredSystem() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeSystem(id: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Private windows and blocked storage just don't remember the choice.
  }
}

function systemHref(id: string) {
  return id === BASE ? "?" : `?${SYSTEM_PARAM}=${id}`;
}

/** Keeps the address bar on the chosen system without a navigation. */
function writeSystemParam(id: string) {
  const url = new URL(window.location.href);
  if (id === BASE) {
    url.searchParams.delete(SYSTEM_PARAM);
  } else {
    url.searchParams.set(SYSTEM_PARAM, id);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

function matches(entry: ListEntry, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return [entry.name, entry.description, ...entry.tags].some((text) =>
    text.toLowerCase().includes(needle),
  );
}

/**
 * The /design-systems showcase, laid out like the Blocks gallery: the systems
 * listed on the left, and the components in the chosen one on the right.
 */
export function SystemsShowcase({ systems }: { systems: ShowcaseSystem[] }) {
  const [active, setActive] = useState(BASE);
  const [query, setQuery] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  // The server can't know the visitor's mode, so the toggle shows it only
  // after hydration; otherwise the first render would not match.
  const [mounted, setMounted] = useState(false);
  const system = systems.find((entry) => entry.id === active);

  useEffect(() => {
    setMounted(true);
  }, []);

  // A shared link wins over the last system this browser picked.
  useEffect(() => {
    const isSystem = (id: string | null) =>
      Boolean(id && systems.some((entry) => entry.id === id));
    const linked = new URLSearchParams(window.location.search).get(
      SYSTEM_PARAM,
    );
    const stored = readStoredSystem();
    if (isSystem(linked)) {
      setActive(linked as string);
    } else if (isSystem(stored)) {
      setActive(stored as string);
    }
  }, [systems]);

  // The system applies to the whole page while it is open, and only here, so
  // dialogs and menus that portal to the body get it too.
  useEffect(() => {
    const root = document.documentElement;
    if (active === BASE) {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = active;
    }
    return () => {
      delete root.dataset.theme;
    };
  }, [active]);

  const choose = (id: string) => {
    setActive(id);
    storeSystem(id);
    writeSystemParam(id);
  };

  const entries: ListEntry[] = [BASE_ENTRY, ...systems];
  const results = entries.filter((entry) => matches(entry, query));
  const dark = mounted && resolvedTheme === "dark";

  const list = (orientation: Orientation) => (
    <SystemList
      active={active}
      entries={results}
      onChoose={choose}
      onClear={() => setQuery("")}
      orientation={orientation}
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
        <Button
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="shrink-0"
          onClick={() => setTheme(dark ? "light" : "dark")}
          variant="outline"
        >
          {dark ? (
            <Sun data-icon="inline-start" />
          ) : (
            <Moon data-icon="inline-start" />
          )}
          {dark ? "Light" : "Dark"}
        </Button>
        <div className="min-w-0 flex-1 sm:ml-auto sm:max-w-80 sm:flex-none sm:basis-80">
          <SearchField onChange={setQuery} value={query} />
        </div>
      </div>

      <div className="border-border border-b p-3 lg:hidden">
        {list("horizontal")}
      </div>

      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="border-border border-r max-lg:hidden">
          <div className="sticky top-28 flex max-h-[calc(100dvh-8rem)] flex-col px-5 pt-8 pb-6">
            <h2 className="mb-5 flex items-baseline justify-between gap-2 px-3 font-semibold text-xl tracking-tight">
              Design systems
              <span className="font-mono font-normal text-muted-foreground text-xs tabular-nums">
                {entries.length}
              </span>
            </h2>
            {list("vertical")}
          </div>
        </aside>

        <section
          aria-label={`Components in ${system?.name ?? BASE_ENTRY.name}`}
          className={cn(
            "ds-fonts flex min-w-0 flex-col gap-10 p-3 sm:p-6",
            systemFontVariables,
          )}
        >
          <SystemDetails system={system} />
          <ComponentGallery scale={system?.scale ?? BASE_SCALE} />
        </section>
      </div>
    </div>
  );
}

function SystemList({
  entries,
  active,
  orientation,
  onChoose,
  onClear,
}: {
  entries: ListEntry[];
  active: string;
  orientation: Orientation;
  onChoose: (id: string) => void;
  onClear: () => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // A shared link can pick a system far down the list, so scroll the list
  // (never the page) until it shows.
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>(
      `[data-system="${active}"]`,
    );
    if (!(list && current)) {
      return;
    }
    if (orientation === "horizontal") {
      const start = current.offsetLeft;
      const end = start + current.offsetWidth;
      if (start < list.scrollLeft || end > list.scrollLeft + list.clientWidth) {
        list.scrollLeft = start - (list.clientWidth - current.offsetWidth) / 2;
      }
    } else {
      const start = current.offsetTop;
      const end = start + current.offsetHeight;
      if (start < list.scrollTop || end > list.scrollTop + list.clientHeight) {
        list.scrollTop = start - (list.clientHeight - current.offsetHeight) / 2;
      }
    }
  }, [active, orientation]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 px-3 py-2 text-sm">
        <p className="text-muted-foreground">No design systems match.</p>
        <Button onClick={onClear} size="sm" variant="outline">
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <nav
      aria-label="Design systems"
      className={
        orientation === "vertical" ? "flex min-h-0 flex-col" : undefined
      }
    >
      <ul
        className={
          orientation === "vertical"
            ? "relative -m-1 flex min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain p-1"
            : "no-scrollbar relative -m-1 flex gap-2 overflow-x-auto p-1"
        }
        ref={listRef}
      >
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <li className="shrink-0" key={entry.id}>
              <a
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none",
                  orientation === "vertical"
                    ? "rounded-lg px-3 py-2 text-[15px]"
                    : "h-9 rounded-lg border border-border px-3 text-sm",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  isActive &&
                    orientation === "horizontal" &&
                    "border-transparent",
                )}
                data-system={entry.id}
                href={systemHref(entry.id)}
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  ) {
                    return;
                  }
                  event.preventDefault();
                  onChoose(entry.id);
                }}
              >
                <SystemMark id={entry.id} />
                <span className="truncate">{entry.name}</span>
              </a>
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
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup className="border-border bg-white dark:bg-background">
      <InputGroupAddon align="inline-start">
        <Icon className="size-4" name="IconMagnifyingGlass" />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search design systems"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onChange("");
          }
        }}
        placeholder="Search design systems..."
        value={value}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear search"
            onClick={() => onChange("")}
            size="icon-xs"
          >
            <Icon className="size-3.5" name="IconCrossSmall" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

function SystemDetails({ system }: { system: ShowcaseSystem | undefined }) {
  if (!system) {
    return (
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <SystemMark id={BASE} size="lg" />
          <h2 className="ds-heading text-2xl md:text-3xl">{BASE_ENTRY.name}</h2>
        </div>
        <p className="text-muted-foreground">{BASE_ENTRY.description}</p>
      </header>
    );
  }
  const documented =
    system.sourceMode === "both"
      ? "Both modes are documented."
      : `Only ${system.sourceMode} mode is documented; the other is derived.`;
  return (
    <header className="flex flex-col gap-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <SystemMark id={system.id} size="lg" />
        <h2 className="ds-heading mr-1 ml-1 text-2xl md:text-3xl">
          {system.name}
        </h2>
        {system.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="text-base">{system.description}</p>
      <p className="text-muted-foreground">
        {system.disclaimer} Source:{" "}
        <a
          className="underline underline-offset-3 hover:text-foreground"
          href={system.sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {system.sourceUrl.replace("https://", "")}
        </a>
        . {documented}
      </p>
      <ul className="flex flex-col gap-1 text-muted-foreground">
        {system.fonts.map((font) => (
          <li key={font.role}>
            <span className="font-mono text-xs">{font.role}</span>:{" "}
            {font.referenced === font.fallback
              ? font.fallback
              : `${font.referenced}, shown in ${font.fallback}`}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground">
        Gaps in meta.json:{" "}
        {Object.entries(system.gaps)
          .map(([kind, count]) => `${count} ${kind}`)
          .join(", ")}
        .
        {system.contrast.length > 0
          ? ` Contrast below AA: ${system.contrast
              .map(
                (gap) =>
                  `${gap.path} on ${gap.against} is ${gap.ratio}:1 (${gap.suggested} would pass)`,
              )
              .join("; ")}.`
          : " Every checked text pair passes AA."}
      </p>
    </header>
  );
}
