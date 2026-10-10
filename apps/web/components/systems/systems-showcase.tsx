"use client";

import { Badge } from "@cortexcn/ui/components/badge";
import { Button } from "@cortexcn/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ShowcaseSystem } from "@/lib/design-systems";
import { cn } from "@/lib/utils";
import { ComponentGallery } from "./component-gallery";
import { systemFontVariables } from "./fonts";

/** No data-theme: the base Cortexcn tokens. */
const BASE = "cortexcn";
const STORAGE_KEY = "cortexcn.systems.theme";
const BASE_SCALE = [12, 14, 16, 18, 24, 30, 48];

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

export function SystemsShowcase({ systems }: { systems: ShowcaseSystem[] }) {
  const [active, setActive] = useState(BASE);
  const { resolvedTheme, setTheme } = useTheme();
  const system = systems.find((entry) => entry.id === active);

  useEffect(() => {
    const stored = readStoredSystem();
    if (stored && systems.some((entry) => entry.id === stored)) {
      setActive(stored);
    }
  }, [systems]);

  // The system applies to the whole page while it is open, and only here.
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
  };

  const dark = resolvedTheme === "dark";

  return (
    <div className={cn("ds-fonts flex flex-col gap-8", systemFontVariables)}>
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-2">
            <h1 className="ds-heading text-3xl md:text-4xl">Design systems</h1>
            <p className="text-muted-foreground">
              Pick a system to restyle every component on this page. The
              components are unchanged; only the tokens behind them switch.
            </p>
          </div>
          <Button
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
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
        </div>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Design system</legend>
          {[{ id: BASE, name: "Cortexcn" }, ...systems].map((entry) => (
            <Button
              aria-pressed={entry.id === active}
              key={entry.id}
              onClick={() => choose(entry.id)}
              size="sm"
              variant={entry.id === active ? "default" : "outline"}
            >
              {entry.name}
            </Button>
          ))}
        </fieldset>
      </header>

      <SystemDetails system={system} />

      <ComponentGallery scale={system?.scale ?? BASE_SCALE} />
    </div>
  );
}

function SystemDetails({ system }: { system: ShowcaseSystem | undefined }) {
  if (!system) {
    return (
      <p className="border-t pt-6 text-muted-foreground text-sm">
        Cortexcn's own tokens: square corners, neutral surfaces, Geist.
      </p>
    );
  }
  const documented =
    system.sourceMode === "both"
      ? "Both modes are documented."
      : `Only ${system.sourceMode} mode is documented; the other is derived.`;
  return (
    <section
      aria-label={`About ${system.name}`}
      className="flex flex-col gap-3 border-t pt-6 text-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="ds-heading text-xl">{system.name}</h2>
        {system.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      <p>{system.description}</p>
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
    </section>
  );
}
