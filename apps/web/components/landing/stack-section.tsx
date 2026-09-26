"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  DotTexture,
  scrambleChar,
  TypedText,
  typedCount,
  useTypeInOnView,
} from "./kit";
import { Container } from "./primitives";

interface StackLogo {
  name: string;
  slug: string;
  /** Wordmarks already contain the name; icons get a text label beside them. */
  kind: "wordmark" | "icon";
  /** Intrinsic viewBox ratio (width / height). */
  ratio: number;
  /** Rendered height in px, tuned per logo so they read at a similar size. */
  height: number;
}

/**
 * Themed logos ship `<slug>-light.svg` (for light backgrounds) and
 * `<slug>-dark.svg` (for dark backgrounds) in this folder.
 */
const LOGO_DIR = "/logos/stack";

/** Six cells, one row on desktop: the stack Cortexcn is built on and the agents it works with. */
const LOGOS: StackLogo[] = [
  { name: "Next.js", slug: "nextjs", kind: "icon", ratio: 1, height: 24 },
  {
    name: "React",
    slug: "react",
    kind: "wordmark",
    ratio: 600 / 180.32,
    height: 26,
  },
  {
    name: "Tailwind CSS",
    slug: "tailwindcss",
    kind: "wordmark",
    ratio: 262 / 33,
    height: 17,
  },
  { name: "shadcn/ui", slug: "shadcn", kind: "icon", ratio: 1, height: 22 },
  {
    name: "Cursor",
    slug: "cursor",
    kind: "icon",
    ratio: 466.73 / 532.09,
    height: 24,
  },
  {
    name: "Claude",
    slug: "claude",
    kind: "wordmark",
    ratio: 512 / 110,
    height: 22,
  },
];

function LogoImage({
  logo,
  variant,
  className,
}: {
  logo: StackLogo;
  variant: "light" | "dark";
  className?: string;
}) {
  return (
    <Image
      alt={logo.kind === "wordmark" && variant === "light" ? logo.name : ""}
      className={className}
      height={logo.height}
      src={`${LOGO_DIR}/${logo.slug}-${variant}.svg`}
      style={{ height: logo.height, width: "auto" }}
      unoptimized
      width={Math.round(logo.height * logo.ratio)}
    />
  );
}

function LogoCell({ logo }: { logo: StackLogo }) {
  return (
    <div className="group flex h-28 items-center justify-center bg-background px-4 md:h-32">
      {/* Gray at rest like the rest of the page; brand color on hover. */}
      <span className="flex items-center gap-2 opacity-60 grayscale transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:grayscale-0">
        <LogoImage className="dark:hidden" logo={logo} variant="light" />
        <LogoImage className="hidden dark:block" logo={logo} variant="dark" />
        {logo.kind === "icon" ? (
          <span className="whitespace-nowrap font-semibold text-foreground text-lg tracking-tight">
            {logo.name}
          </span>
        ) : null}
      </span>
    </div>
  );
}

/*
 * Tagline glyphs. The arrow and the two drop-shadowed squares are drawn as SVG
 * so they look the same on every OS (as text they fall back to whatever symbol
 * font the system has). Units are 400 per em, traced from the glyphs at 400px;
 * each viewBox ends on the text baseline and includes the -0.06em tracking, so
 * the SVGs sit and space exactly like the characters they replace.
 */

/**
 * "→": the ink runs into the tracking, so the SVG is the full 0.55em advance
 * and a negative margin gives back the -0.06em, like the letter spacing would.
 */
function ArrowGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="-mr-[0.06em] inline-block h-[0.485em] w-[0.55em] align-baseline"
      fill="currentColor"
      viewBox="0 146 220 194"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 209h156l-51-38 18-22 89 75-89 75-18-22 51-38H4z" />
    </svg>
  );
}

/** "❏" (shadow lower right) then "❐" (shadow upper right), 0.825em apart. */
function SquaresGlyph({ visible }: { visible: number }) {
  return (
    <svg
      aria-hidden="true"
      className="inline-block h-[0.715em] w-[1.65em] align-baseline"
      fill="currentColor"
      fillRule="evenodd"
      viewBox="0 80 660 286"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn(visible < 1 && "invisible")}
        d="M37 86h244v244H37zm11.5 11.5v221h221v-221zM281 122h36v244H73v-36h208z"
      />
      <path
        className={cn(visible < 2 && "invisible")}
        d="M367 122h244v244H367zm11.5 11.5v221h221v-221zM403 86h244v244h-36V122H403z"
      />
    </svg>
  );
}

/** Three 4px squares, 33px wide, beside each chevron. */
function DotsGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-1 w-[33px] shrink-0"
      fill="currentColor"
      viewBox="0 0 33 4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h4v4H0zm14.25 0h4v4h-4zM28.5 0h4v4h-4z" />
    </svg>
  );
}

type TaglineSegment =
  | { kind: "text"; text: string }
  | { kind: "arrow" }
  | { kind: "squares" };

/**
 * Flex items; lines wrap only between them. The arrow shares an item with the
 * words before it and the squares with the words after, so neither is left
 * alone at the edge of a line.
 */
const TAGLINE_GROUPS: TaglineSegment[][] = [
  [{ kind: "text", text: "SHADCN REGISTRY" }, { kind: "arrow" }],
  [{ kind: "text", text: "UI LAYER FOR" }],
  [{ kind: "squares" }, { kind: "text", text: "YOUR AI AGENT" }],
];

const TAGLINE_TEXT = "shadcn registry, the UI layer for your AI agent";

const CHAR_MS = 50;
/** Each segment starts typing this long after the previous one starts. */
const SEGMENT_STAGGER_MS = 250;

function segmentLength(segment: TaglineSegment) {
  if (segment.kind === "text") {
    return segment.text.length;
  }
  return segment.kind === "squares" ? 2 : 1;
}

const SEGMENTS = TAGLINE_GROUPS.flat();
const TYPE_DURATION_MS =
  (SEGMENTS.length - 1) * SEGMENT_STAGGER_MS +
  Math.max(...SEGMENTS.map(segmentLength)) * CHAR_MS +
  CHAR_MS;

function Tagline() {
  const { ref, elapsed } = useTypeInOnView<HTMLDivElement>(TYPE_DURATION_MS);
  let segmentIndex = 0;

  const renderSegment = (segment: TaglineSegment, key: string): ReactNode => {
    const index = segmentIndex;
    segmentIndex += 1;
    const typed = typedCount(
      elapsed,
      index * SEGMENT_STAGGER_MS,
      segmentLength(segment),
      CHAR_MS,
    );

    if (segment.kind === "arrow") {
      return (
        <span className="px-4 text-foreground" key={key}>
          <span className={cn(typed < 1 && "invisible")}>
            <ArrowGlyph />
          </span>
        </span>
      );
    }
    if (segment.kind === "squares") {
      return (
        <span className="px-4 text-foreground" key={key}>
          <SquaresGlyph visible={typed} />
        </span>
      );
    }
    const scramble = scrambleChar(elapsed, index * 5);
    return (
      <span key={key}>
        <TypedText scramble={scramble} text={segment.text} typed={typed} />
      </span>
    );
  };

  return (
    <div
      className="flex min-w-0 flex-1 flex-wrap items-baseline justify-center text-[2rem] text-primary uppercase leading-[1.1] tracking-[-0.06em] lg:font-mono"
      ref={ref}
    >
      <span className="sr-only">{TAGLINE_TEXT}</span>
      {TAGLINE_GROUPS.map((group, groupIndex) => {
        const groupKey = `group-${groupIndex}`;
        return (
          <span aria-hidden="true" className="whitespace-nowrap" key={groupKey}>
            {group.map((segment, index) =>
              renderSegment(segment, `${groupKey}-${index}`),
            )}
          </span>
        );
      })}
    </div>
  );
}

/** The dots-and-chevron cap on each side of the tagline (desktop only). */
function TaglineCap({ side }: { side: "left" | "right" }) {
  const chevron = (
    <span className="font-mono text-[2rem] leading-[1.3] tracking-[-0.8px]">
      {side === "left" ? ">" : "<"}
    </span>
  );
  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center gap-8 text-foreground lg:flex"
    >
      {side === "left" ? (
        <>
          <DotsGlyph />
          {chevron}
        </>
      ) : (
        <>
          {chevron}
          <DotsGlyph />
        </>
      )}
    </div>
  );
}

export function StackSection() {
  return (
    <section aria-label="Built on your stack" className="relative w-full">
      <Container>
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((logo) => (
            <LogoCell key={logo.slug} logo={logo} />
          ))}
        </div>

        <div className="relative flex min-h-70 items-center bg-muted p-8">
          <DotTexture />
          <div className="relative flex w-full items-center gap-8">
            <TaglineCap side="left" />
            <Tagline />
            <TaglineCap side="right" />
          </div>
        </div>
      </Container>
    </section>
  );
}
