"use client";

import { Marquee } from "@cortexcn/ui/components/marquee";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

export interface WalkthroughStep {
  title: string;
  description: string;
  /** The painting behind the window. It is decorative, so `alt` can stay empty. */
  image: { src: string; alt: string };
  /** Shown in the window's title bar, such as an app or file name. */
  windowTitle: string;
  /** What the window shows while this step is open. It mounts fresh each time. */
  screen: ReactNode;
}

export interface FeatureWalkthroughProps {
  eyebrow?: string;
  heading?: string;
  /** A second line under the heading, in the muted color. */
  subheading?: string;
  steps?: WalkthroughStep[];
  /** How long each step stays open before the next one, in milliseconds. */
  interval?: number;
  className?: string;
}

/** The flower paintings from the Cortexcn site. */
const ART_BASE = "https://www.cortexcn.dev/images/ui-home";

/**
 * Plays a short script: the returned step goes up by one after each delay.
 * Visitors who ask for reduced motion get the last step straight away.
 */
function useScript(delays: readonly number[]) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) {
      return;
    }
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const next = () => {
      const delay = delays[index];
      if (delay === undefined) {
        return;
      }
      timer = setTimeout(() => {
        index += 1;
        setStep(index);
        next();
      }, delay);
    };
    next();
    return () => clearTimeout(timer);
  }, [reduce, delays]);

  return reduce ? delays.length : step;
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-3 shrink-0 animate-spin rounded-full border border-current border-t-transparent"
    />
  );
}

/** A blinking block cursor that takes no space, so text never reflows. */
function Caret() {
  return (
    <span aria-hidden="true" className="relative">
      <motion.span
        animate={{ opacity: [1, 1, 0, 0] }}
        className="absolute top-0 left-0 h-[1.2em] w-[0.6em] bg-foreground/70"
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          times: [0, 0.5, 0.5, 1],
        }}
      />
    </span>
  );
}

const COMMAND = "npx shadcn@latest add @cortexcn/marquee";

/** What the shadcn CLI prints when it adds the Marquee. */
const TERMINAL_OUTPUT: { text: string; file?: string }[] = [
  { text: "Checking registry." },
  { text: "Created 1 file:", file: "components/marquee.tsx" },
  { text: "Updating app/globals.css" },
];

/** A pause, one beat per keystroke, the enter key, then each line's spinner. */
const TERMINAL_SCRIPT = [
  450,
  ...Array.from(COMMAND, () => 26),
  320,
  700,
  520,
  780,
] as const;

function TerminalScreen() {
  const reduce = useReducedMotion();
  const step = useScript(TERMINAL_SCRIPT);
  const typed = Math.min(Math.max(step - 1, 0), COMMAND.length);
  const entered = step >= COMMAND.length + 2;
  // How many output lines have finished their spinner.
  const finished = Math.max(0, step - (COMMAND.length + 2));

  return (
    <div className="h-full p-4 font-mono text-xs leading-relaxed">
      <p className="sr-only">
        The terminal runs {COMMAND}. The CLI checks the registry, creates
        components/marquee.tsx, and updates app/globals.css.
      </p>
      <div aria-hidden="true" className="flex flex-col gap-2">
        <p>
          <span className="select-none text-muted-foreground">
            <span className="hidden sm:inline">~/acme-app </span>${" "}
          </span>
          {COMMAND.slice(0, typed)}
          {entered ? null : <Caret />}
        </p>
        {entered
          ? TERMINAL_OUTPUT.slice(0, finished + 1).map((line, index) => {
              const done = index < finished;
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  key={line.text}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <p className="flex items-center gap-2">
                    {done ? <CheckIcon /> : <Spinner />}
                    <span
                      className={done ? undefined : "text-muted-foreground"}
                    >
                      {line.text}
                    </span>
                  </p>
                  {done && line.file ? (
                    <p className="pl-5 text-muted-foreground">- {line.file}</p>
                  ) : null}
                </motion.div>
              );
            })
          : null}
      </div>
    </div>
  );
}

interface CodeLine {
  number: number;
  code: string;
}

/** The real Marquee source around the default that changes. */
const LINES_BEFORE: CodeLine[] = [
  { number: 36, code: "export function Marquee({" },
  { number: 37, code: "  className," },
  { number: 38, code: "  reverse = false," },
];

const LINES_AFTER: CodeLine[] = [
  { number: 40, code: "  children," },
  { number: 41, code: "  vertical = false," },
  { number: 42, code: "  repeat = 4," },
];

const EDITED_PREFIX = "  pauseOnHover = ";
const OLD_VALUE = "false";
const NEW_VALUE = "true";

/** Cursor in, select the old value, type the new one, show the diff, save. */
const EDITOR_SCRIPT = [700, 450, 110, 90, 90, 90, 520, 380] as const;

const ROW = "grid grid-cols-[2.25rem_1rem_1fr] pr-3";

function CodeRow({
  line,
  marker = "",
  className,
  children,
}: {
  line: CodeLine;
  marker?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <motion.span className={cn(ROW, className)} layout="position">
      <span className="select-none pr-3 text-right text-muted-foreground">
        {line.number}
      </span>
      <span className="select-none text-muted-foreground">{marker}</span>
      <span className="whitespace-pre">{children ?? line.code}</span>
    </motion.span>
  );
}

function EditorScreen() {
  const reduce = useReducedMotion();
  const step = useScript(EDITOR_SCRIPT);
  const typedValue = step >= 3 ? NEW_VALUE.slice(0, step - 2) : null;
  const diffed = step >= 7;
  const saved = step >= 8;
  const column = EDITED_PREFIX.length + 1 + (typedValue ?? OLD_VALUE).length;

  let status: ReactNode = "TypeScript JSX";
  if (saved) {
    status = (
      <>
        <CheckIcon />
        Saved
      </>
    );
  } else if (typedValue !== null) {
    status = (
      <>
        <span className="size-1.5 rounded-full bg-foreground/60" />
        Unsaved
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <p className="sr-only">
        components/marquee.tsx, lines 36 to 42. Line 39 changes from
        pauseOnHover = false to pauseOnHover = true, and the file is saved.
      </p>
      <pre
        aria-hidden="true"
        className="flex-1 overflow-hidden py-2 font-mono text-xs leading-5.5"
      >
        <code className="block">
          {LINES_BEFORE.map((line) => (
            <CodeRow key={line.number} line={line} />
          ))}
          {diffed ? (
            <>
              <CodeRow
                className="bg-destructive/10 text-destructive"
                line={{ number: 39, code: `${EDITED_PREFIX}${OLD_VALUE},` }}
                marker="-"
              />
              <motion.span
                animate={{ opacity: 1, height: 22 }}
                className={cn(ROW, "overflow-hidden bg-foreground/[0.07]")}
                initial={reduce ? false : { opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="select-none pr-3 text-right text-muted-foreground">
                  39
                </span>
                <span className="select-none text-muted-foreground">+</span>
                <span className="whitespace-pre">
                  {EDITED_PREFIX}
                  {NEW_VALUE},
                </span>
              </motion.span>
            </>
          ) : (
            <CodeRow
              className={cn(step >= 1 && "bg-muted")}
              line={{ number: 39, code: "" }}
            >
              {EDITED_PREFIX}
              {typedValue === null ? (
                <span className="relative">
                  {step >= 2 ? (
                    <motion.span
                      animate={{ scaleX: 1 }}
                      className="absolute inset-0 origin-left bg-foreground/15"
                      initial={{ scaleX: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  ) : null}
                  {OLD_VALUE}
                  {step === 1 ? <Caret /> : null}
                </span>
              ) : (
                <>
                  {typedValue}
                  <Caret />
                </>
              )}
              ,
            </CodeRow>
          )}
          {LINES_AFTER.map((line) => (
            <CodeRow key={line.number} line={line} />
          ))}
        </code>
      </pre>
      <div
        aria-hidden="true"
        className="flex h-7 shrink-0 items-center justify-between border-border border-t px-3 font-mono text-[10px] text-muted-foreground"
      >
        <span>Ln 39, Col {column}</span>
        <span className="flex items-center gap-1.5">{status}</span>
      </div>
    </div>
  );
}

const SHIPPED = [
  "Marquee",
  "Number Ticker",
  "Area Chart",
  "Gooey Nav",
  "Lanyard Badge",
  "Sphere Menu",
];

/** Page loads, content settles, the Marquee starts, a pointer rests on it, ready. */
const SHIP_SCRIPT = [700, 500, 900, 700, 600] as const;

function PointerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 drop-shadow-sm"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-foreground stroke-background"
        d="M5 3.5 18.5 11l-6 1.6-3 5.9z"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ShipScreen() {
  const reduce = useReducedMotion();
  const step = useScript(SHIP_SCRIPT);
  const loaded = step >= 1;
  const playing = step >= 2;
  const pointing = step >= 3;
  const resting = step >= 4;
  const ready = step >= 5;
  const enter = reduce ? false : { opacity: 0, y: 6 };

  return (
    <div className="relative flex h-full flex-col justify-center gap-5 py-4">
      <p className="sr-only">
        The app runs on localhost:3000. Cortexcn component names scroll across
        the page, and they stop while the pointer rests on them.
      </p>
      <motion.span
        animate={{ scaleX: 1, opacity: loaded ? 0 : 1 }}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-foreground"
        initial={reduce ? false : { scaleX: 0, opacity: 1 }}
        transition={{
          scaleX: { duration: 0.7, ease: "easeOut" },
          opacity: { duration: 0.3 },
        }}
      />
      <div aria-hidden="true" className="flex flex-col gap-2 px-4">
        {[
          "w-2/5 h-2.5 bg-foreground/80",
          "w-3/5 h-2 bg-muted",
          "w-1/2 h-2 bg-muted",
        ].map((bar, index) => (
          <motion.span
            animate={loaded ? { opacity: 1, y: 0 } : undefined}
            className={bar}
            initial={enter}
            key={bar}
            transition={{ delay: index * 0.08, duration: 0.3 }}
          />
        ))}
      </div>
      <motion.div
        animate={playing ? { opacity: 1, y: 0 } : undefined}
        aria-hidden="true"
        className="relative border-border border-y"
        initial={enter}
        transition={{ duration: 0.35 }}
      >
        <Marquee
          className={cn(
            "[--duration:18s] [--gap:0.5rem] motion-reduce:**:animate-none",
            resting && "**:paused",
          )}
          pauseOnHover
          repeat={3}
        >
          {SHIPPED.map((name) => (
            <span
              className="whitespace-nowrap border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground"
              key={name}
            >
              {name}
            </span>
          ))}
        </Marquee>
        {pointing ? (
          <motion.span
            animate={{ opacity: 1, x: 0, y: 0 }}
            className="absolute top-1/2 left-1/2"
            initial={reduce ? false : { opacity: 0, x: 110, y: 70 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <PointerIcon />
          </motion.span>
        ) : null}
        {resting ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-[calc(50%+1.5rem)] left-[calc(50%+0.75rem)] border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-sm"
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            pauseOnHover
          </motion.span>
        ) : null}
      </motion.div>
      <motion.p
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        aria-hidden="true"
        className="flex items-center gap-2 px-4 font-mono text-[11px] text-muted-foreground"
        initial={enter}
        transition={{ duration: 0.3 }}
      >
        <CheckIcon />
        Ready on localhost:3000
      </motion.p>
    </div>
  );
}

const DEFAULT_STEPS: WalkthroughStep[] = [
  {
    title: "Install with one command",
    description:
      "Run the shadcn CLI and the source lands in your project, with the styles it needs.",
    image: { src: `${ART_BASE}/blue-cream-florals.webp`, alt: "" },
    windowTitle: "Terminal",
    screen: <TerminalScreen />,
  },
  {
    title: "Change any line",
    description:
      "The code is yours to read and edit, so a default you don't like is one line away.",
    image: { src: `${ART_BASE}/white-blossoms.webp`, alt: "" },
    windowTitle: "components/marquee.tsx",
    screen: <EditorScreen />,
  },
  {
    title: "Ship it with your app",
    description:
      "It builds with the rest of your code, with no Cortexcn package to keep up to date.",
    image: { src: `${ART_BASE}/blue-white-flowers.webp`, alt: "" },
    windowTitle: "localhost:3000",
    screen: <ShipScreen />,
  },
];

const RULE = "absolute bg-muted-foreground/40";

const HATCH =
  "absolute size-5 bg-[repeating-linear-gradient(45deg,color-mix(in_oklch,var(--muted-foreground)_40%,transparent)_0,color-mix(in_oklch,var(--muted-foreground)_40%,transparent)_1px,transparent_0,transparent_50%)] bg-size-[5px_5px] opacity-80";

const DOT =
  "absolute z-20 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background";

/** Ruler ticks past each corner, two hatched corners, and a dot on each corner. */
function RulerFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className={cn(RULE, "-top-6 left-0 h-8 w-px")} />
        <span className={cn(RULE, "top-0 -left-6 h-px w-8")} />
        <span className={cn(RULE, "-top-6 right-0 h-8 w-px")} />
        <span className={cn(RULE, "top-0 -right-6 h-px w-8")} />
        <span className={cn(RULE, "-bottom-6 left-0 h-8 w-px")} />
        <span className={cn(RULE, "bottom-0 -left-6 h-px w-8")} />
        <span className={cn(RULE, "right-0 -bottom-6 h-8 w-px")} />
        <span className={cn(RULE, "-right-6 bottom-0 h-px w-8")} />
        <span className={cn(HATCH, "-top-6 -right-6")} />
        <span className={cn(HATCH, "-bottom-6 -left-6")} />
        <span className={cn(DOT, "top-0 left-0")} />
        <span className={cn(DOT, "top-0 left-full")} />
        <span className={cn(DOT, "top-full left-0")} />
        <span className={cn(DOT, "top-full left-full")} />
      </div>
    </div>
  );
}

type PaintingRole = "active" | "previous" | "idle";

/** The new painting wipes in from the left over the one before it. */
const PAINTING_STATE = {
  active: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
  previous: { clipPath: "inset(0% 0% 0% 0%)" },
  idle: { clipPath: "inset(0% 100% 0% 0%)", scale: 1.14 },
} as const;

const PAINTING_LAYER = {
  active: "z-10",
  previous: "z-0",
  idle: "invisible",
} as const;

function paintingRole(index: number, active: number, previous: number) {
  if (index === active) {
    return "active";
  }
  return index === previous ? "previous" : "idle";
}

/** How far the window tilts toward the pointer, in degrees. */
const MAX_TILT = 10;

export function FeatureWalkthrough({
  eyebrow = "How it works",
  heading = "Add it, change it,",
  subheading = "and ship it as yours.",
  steps = DEFAULT_STEPS,
  interval = 6000,
  className,
}: FeatureWalkthroughProps) {
  const [{ active, previous }, setView] = useState({ active: 0, previous: 0 });
  const reduce = useReducedMotion();
  const baseId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const elapsed = useRef(0);
  const inView = useInView(rootRef, { amount: 0.35 });

  const tiltX = useSpring(0, { stiffness: 140, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 140, damping: 18 });
  // The painting drifts against the tilt, so the window seems to float.
  const driftX = useTransform(tiltY, (value) => value * -1.4);
  const driftY = useTransform(tiltX, (value) => value * 1.4);

  const autoplay = !reduce && steps.length > 1;
  const running = autoplay && inView;

  // Grows the active step's progress line, then opens the next step. The
  // clock holds while the pointer or focus is inside the section, and picks
  // up where it stopped.
  useEffect(() => {
    if (!running) {
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const held = rootRef.current?.matches(":hover, :focus-within") ?? false;
      if (!held) {
        elapsed.current += now - last;
      }
      last = now;
      const progress = Math.min(elapsed.current / interval, 1);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      if (progress >= 1) {
        elapsed.current = 0;
        setView((view) => ({
          active: (view.active + 1) % steps.length,
          previous: view.active,
        }));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, interval, steps.length]);

  // Tilts the window toward a mouse pointer over the stage.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) {
      return;
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      const rect = stage.getBoundingClientRect();
      tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * MAX_TILT);
      tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * MAX_TILT);
    };
    const reset = () => {
      tiltX.set(0);
      tiltY.set(0);
    };
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerleave", reset);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", reset);
    };
  }, [reduce, tiltX, tiltY]);

  const current = steps[active] ?? steps[0];
  if (!current) {
    return null;
  }

  const panelId = `${baseId}-panel`;
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const kenBurns = (interval + 1500) / 1000;

  function select(index: number) {
    elapsed.current = 0;
    setView((view) =>
      view.active === index ? view : { active: index, previous: view.active },
    );
  }

  function onTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = steps.length - 1;
    const targets: Record<string, number> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    select(target);
    tabRefs.current[target]?.focus();
  }

  return (
    <section
      className={cn("overflow-hidden px-6 py-24 sm:py-32", className)}
      ref={rootRef}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:gap-16">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            {eyebrow}
          </p>
          <h2 className="text-balance font-semibold text-3xl tracking-tight md:text-5xl">
            {heading}
            {subheading ? (
              <span className="block text-muted-foreground">{subheading}</span>
            ) : null}
          </h2>
        </div>

        <div className="grid gap-14 lg:grid-cols-5 lg:items-center lg:gap-16">
          <div
            aria-label={eyebrow}
            aria-orientation="vertical"
            className="flex flex-col border-border border-b lg:col-span-2"
            role="tablist"
          >
            {steps.map((step, index) => {
              const selected = index === active;
              return (
                <button
                  aria-controls={panelId}
                  aria-selected={selected}
                  className="group relative grid grid-cols-[2rem_1fr] gap-x-3 border-border border-t py-5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  id={tabId(index)}
                  key={step.title}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  role="tab"
                  tabIndex={selected ? 0 : -1}
                  type="button"
                >
                  {selected ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-px h-px origin-left bg-foreground"
                      ref={barRef}
                      style={{ transform: autoplay ? "scaleX(0)" : undefined }}
                    />
                  ) : null}
                  <span className="pt-1 font-mono text-muted-foreground text-xs tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span
                      className={cn(
                        "font-medium text-lg tracking-tight transition-colors",
                        selected
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <RulerFrame className="lg:col-span-3">
            <div
              className="relative isolate aspect-square overflow-hidden border border-border bg-muted sm:aspect-4/3"
              ref={stageRef}
            >
              <motion.div
                className="absolute -inset-4 z-0"
                style={{ x: driftX, y: driftY }}
              >
                {steps.map((step, index) => {
                  const role: PaintingRole = paintingRole(
                    index,
                    active,
                    previous,
                  );
                  return (
                    // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
                    <motion.img
                      alt={step.image.alt}
                      animate={PAINTING_STATE[role]}
                      className={cn(
                        "absolute inset-0 size-full object-cover",
                        PAINTING_LAYER[role],
                      )}
                      decoding="async"
                      height={896}
                      initial={false}
                      key={step.title}
                      src={step.image.src}
                      transition={
                        reduce || role !== "active"
                          ? { duration: 0 }
                          : {
                              clipPath: {
                                duration: 0.9,
                                ease: [0.65, 0, 0.35, 1],
                              },
                              scale: { duration: kenBurns, ease: "easeOut" },
                            }
                      }
                      width={1344}
                    />
                  );
                })}
              </motion.div>

              <div className="absolute inset-0 z-10 flex items-center justify-center p-4 sm:p-8">
                <motion.div
                  aria-labelledby={tabId(active)}
                  className="relative h-69 w-full max-w-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  id={panelId}
                  role="tabpanel"
                  style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformPerspective: 1200,
                  }}
                  tabIndex={0}
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      className="absolute inset-0 flex flex-col overflow-hidden border border-border bg-background text-foreground shadow-2xl"
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: -28,
                              rotateX: -10,
                              scale: 0.94,
                              filter: "blur(6px)",
                            }
                      }
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: 48,
                              rotateX: 16,
                              scale: 0.92,
                              filter: "blur(8px)",
                            }
                      }
                      key={active}
                      transition={{
                        type: "spring",
                        stiffness: 210,
                        damping: 26,
                        mass: 0.9,
                        opacity: { duration: 0.25 },
                        filter: { duration: 0.35 },
                      }}
                    >
                      <div className="flex h-9 shrink-0 items-center gap-3 border-border border-b bg-muted/60 px-3.5">
                        <span aria-hidden="true" className="flex gap-1.5">
                          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                          <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                        </span>
                        <span className="truncate font-medium text-muted-foreground text-xs">
                          {current.windowTitle}
                        </span>
                      </div>
                      <div className="min-h-0 flex-1">{current.screen}</div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </RulerFrame>
        </div>
      </div>
    </section>
  );
}
