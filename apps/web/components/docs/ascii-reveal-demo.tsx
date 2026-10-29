"use client";

import {
  AsciiReveal,
  AsciiSkeleton,
} from "@cortexcn/ui/components/ascii-reveal";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/** How long each demo pretends to wait for its data, in milliseconds. */
const LOAD_MS = 1400;

/** Loads on mount and again on every reload, then settles after `ms`. */
function useDemoLoad(ms = LOAD_MS) {
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, [loading, ms]);

  const reload = () => {
    setLoading(true);
    setRound((current) => current + 1);
  };

  return { loading, round, reload };
}

function DemoFrame({
  children,
  loading,
  onReload,
}: {
  children: ReactNode;
  loading: boolean;
  onReload: () => void;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      {children}
      <Button disabled={loading} onClick={onReload} size="sm" variant="outline">
        {loading ? "Loading" : "Reload"}
      </Button>
    </div>
  );
}

/** Profile card: a glyph skeleton holds the card's shape, then it decodes in. */
export function AsciiRevealDemo() {
  const { loading, reload } = useDemoLoad();

  return (
    <DemoFrame loading={loading} onReload={reload}>
      <AsciiReveal className="w-full" loading={loading}>
        <div className="flex w-full items-center gap-3 border border-border p-4">
          {loading ? (
            <>
              <AsciiSkeleton height={44} rows={5} width={44} />
              <AsciiSkeleton
                className="min-w-0 flex-1"
                lines={2}
                widths={["70%", "92%"]}
              />
            </>
          ) : (
            <>
              <div className="flex size-11 shrink-0 items-center justify-center bg-muted font-medium text-sm">
                JL
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">Jordan Lee</p>
                <p className="truncate text-muted-foreground text-sm">
                  Design engineer, Lisbon
                </p>
              </div>
            </>
          )}
        </div>
      </AsciiReveal>
    </DemoFrame>
  );
}

const STATS = [
  { label: "Latency", values: ["42 ms", "38 ms", "51 ms"] },
  { label: "Uptime", values: ["99.98%", "99.95%", "100%"] },
  { label: "Requests", values: ["12,480", "13,102", "11,876"] },
];

/** Live stats: only the values scramble out and decode in on each refresh. */
export function AsciiRevealStatsDemo() {
  const { loading, round, reload } = useDemoLoad(900);

  return (
    <DemoFrame loading={loading} onReload={reload}>
      <AsciiReveal
        as="dl"
        className="grid w-full border border-border sm:grid-cols-3"
        loading={loading}
        revealOnMount={false}
        selector="[data-value]"
      >
        {STATS.map((stat) => (
          <div
            className="border-border border-b p-3 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
            key={stat.label}
          >
            <dt className="text-muted-foreground text-xs">{stat.label}</dt>
            <dd className="mt-1 font-medium font-mono" data-value="">
              {stat.values[round % stat.values.length]}
            </dd>
          </div>
        ))}
      </AsciiReveal>
    </DemoFrame>
  );
}

/** Article: a scan skeleton for the headline and body, then the text. */
export function AsciiRevealArticleDemo() {
  const { loading, reload } = useDemoLoad();

  return (
    <DemoFrame loading={loading} onReload={reload}>
      <AsciiReveal className="w-full" loading={loading}>
        {loading ? (
          <div className="flex flex-col gap-4">
            <AsciiSkeleton lines={1} variant="scan" widths={["64%"]} />
            <AsciiSkeleton lines={3} variant="scan" />
          </div>
        ) : (
          <article className="flex flex-col gap-2">
            <h3 className="font-medium text-lg">Loading states, in glyphs</h3>
            <p className="text-muted-foreground text-sm">
              The card keeps its size while it loads, then the text decodes in
              place. Screen readers get the real text the whole time.
            </p>
          </article>
        )}
      </AsciiReveal>
    </DemoFrame>
  );
}

const LOG_LINES = [
  "$ bun run build",
  "Compiled 214 modules",
  "Generated 96 static pages",
  "Build finished",
];

/** Command output: the terminal preset types each line in behind a cursor. */
export function AsciiRevealTerminalDemo() {
  const { loading, reload } = useDemoLoad();

  return (
    <DemoFrame loading={loading} onReload={reload}>
      <AsciiReveal
        className="w-full border border-border bg-muted/40 p-4 font-mono text-xs"
        loading={loading}
        preset="terminal"
      >
        {loading ? (
          <AsciiSkeleton lines={4} variant="terminal" />
        ) : (
          LOG_LINES.map((line) => (
            <p className="leading-6" key={line}>
              {line}
            </p>
          ))
        )}
      </AsciiReveal>
    </DemoFrame>
  );
}

const NOTIFICATIONS = [
  "Build passed on main",
  "Preview deployed",
  "Two new comments",
];

/** Mascot: a ghost drawn in glyphs plays while the list loads. */
export function AsciiRevealMascotDemo() {
  const { loading, reload } = useDemoLoad(2200);

  return (
    <DemoFrame loading={loading} onReload={reload}>
      <AsciiReveal
        as="ul"
        className="w-full border border-border"
        loading={loading}
        mascot="ghost"
      >
        {NOTIFICATIONS.map((item) => (
          <li
            className="border-border border-b px-4 py-3 text-sm last:border-b-0"
            key={item}
          >
            {item}
          </li>
        ))}
      </AsciiReveal>
    </DemoFrame>
  );
}

const SKELETON_VARIANTS = ["dither", "scan", "braille", "terminal"] as const;

/** The four skeleton styles side by side. */
export function AsciiSkeletonVariantsDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6 sm:grid-cols-2">
      {SKELETON_VARIANTS.map((variant, index) => (
        <div className="flex flex-col gap-2" key={variant}>
          <span className="font-mono text-muted-foreground text-xs">
            {variant}
          </span>
          <AsciiSkeleton lines={3} seed={index + 1} variant={variant} />
        </div>
      ))}
    </div>
  );
}
