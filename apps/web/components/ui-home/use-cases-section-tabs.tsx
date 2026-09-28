"use client";

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { PrimaryLink } from "./primitives";

export interface UseCaseFeature {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface UseCase {
  id: string;
  label: string;
  icon: ReactNode;
  title: string;
  features: UseCaseFeature[];
  cta: { label: string; href: string };
  /** The painting behind this tab's window. */
  art: ReactNode;
  /** Live UI for the art panel, mounted the first time its tab opens. */
  window: ReactNode;
}

/** Arrow keys move along the rail and wrap; Home and End jump to its ends. */
function nextIndexForKey(key: string, current: number, count: number) {
  switch (key) {
    case "ArrowRight":
      return (current + 1) % count;
    case "ArrowLeft":
      return (current - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}

/**
 * A tab rail over one panel: the copy for the selected use case on the left,
 * and on the right a painted panel whose painting and live window crossfade
 * together. Arrow keys move focus and select, as in the WAI-ARIA tabs pattern
 * with automatic activation.
 */
export function UseCasesTabs({ useCases }: { useCases: UseCase[] }) {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;

  const [activeIndex, setActiveIndex] = useState(0);
  // Windows mount on first visit and then stay, so a crossfade has both
  // sides and each window keeps its state.
  const [visited, setVisited] = useState<ReadonlySet<number>>(
    () => new Set([0]),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    setActiveIndex(index);
    setVisited((previous) =>
      previous.has(index) ? previous : new Set(previous).add(index),
    );
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const next = nextIndexForKey(event.key, index, useCases.length);
    if (next === null) {
      return;
    }
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const active = useCases[activeIndex] ?? useCases[0];
  if (!active) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-(--surface) p-2">
      <div
        aria-label="Use cases"
        className="grid grid-cols-2 gap-2 md:grid-cols-4"
        role="tablist"
      >
        {useCases.map((useCase, index) => {
          const selected = index === activeIndex;
          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={cn(
                "flex h-11 min-w-0 items-center justify-center gap-2 rounded-[10px] px-3 font-medium text-sm outline-none transition-[background-color,color,box-shadow] duration-300 ease-(--ui-ease) focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-(--surface) focus-visible:ring-offset-2 motion-reduce:transition-none",
                selected
                  ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                  : "bg-(--surface-strong) text-body hover:text-foreground",
              )}
              id={tabId(index)}
              key={useCase.id}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {useCase.icon}
              <span className="truncate">{useCase.label}</span>
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={tabId(activeIndex)}
        className="mt-2 grid overflow-hidden rounded-[10px] bg-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-(--surface) focus-visible:ring-offset-2 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]"
        id={panelId}
        role="tabpanel"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the WAI-ARIA tabs pattern makes a tabpanel focusable when its first content (the heading) is not
        tabIndex={0}
      >
        {/* Keyed, so the copy fades in again for each tab. */}
        <div
          className="flex starting:translate-y-1.5 flex-col p-6 starting:opacity-0 transition-[opacity,translate] duration-500 ease-(--ui-ease) motion-reduce:transition-none md:p-8 lg:p-7 xl:p-9"
          key={active.id}
        >
          <h3 className="text-balance font-light font-sentient text-[26px] leading-[1.25] tracking-[-0.05em] md:text-[30px]">
            {active.title}
          </h3>
          <ul className="mt-7 mb-9 flex flex-col gap-5 md:mt-8">
            {active.features.map((feature) => (
              <li className="flex gap-3.5" key={feature.title}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-muted text-foreground [&_svg]:size-4">
                  {feature.icon}
                </span>
                <div className="min-w-0 pt-1">
                  <h4 className="text-[17px] leading-6 tracking-[-0.01em]">
                    {feature.title}
                  </h4>
                  <p className="mt-0.5 text-pretty text-body text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <PrimaryLink className="mt-auto w-full" href={active.cta.href}>
            {active.cta.label}
          </PrimaryLink>
        </div>

        <div className="relative m-2 mt-0 min-h-[400px] overflow-hidden rounded-lg border border-border md:min-h-[460px] lg:mt-2 lg:ml-0 lg:min-h-[520px]">
          {useCases.map((useCase, index) => {
            if (!visited.has(index)) {
              return null;
            }
            return (
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-[400ms] ease-(--ui-ease) motion-reduce:transition-none",
                  index === activeIndex ? "opacity-100" : "opacity-0",
                )}
                key={`${useCase.id}-art`}
              >
                {useCase.art}
              </div>
            );
          })}
          {useCases.map((useCase, index) => {
            if (!visited.has(index)) {
              return null;
            }
            const shown = index === activeIndex;
            return (
              <div
                className={cn(
                  "absolute inset-4 starting:opacity-0 transition-opacity duration-[400ms] ease-(--ui-ease) motion-reduce:transition-none sm:inset-6 md:inset-8 lg:inset-10",
                  shown ? "opacity-100" : "opacity-0",
                )}
                inert={!shown}
                key={useCase.id}
              >
                {useCase.window}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
