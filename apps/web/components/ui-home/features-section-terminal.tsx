"use client";

import { cn } from "@/lib/utils";

import { usePlayback } from "./features-section-playback";

const DIRECTORY = "~/acme-app";
const COMMAND = "npx shadcn@latest add @cortexcn/marquee";

interface OutputLine {
  text: string;
  /** Milliseconds the line stays on screen before the next one prints. */
  duration: number;
  /** Shows a spinner first, like the CLI does while a step runs. */
  spins: boolean;
  files?: string[];
}

/**
 * What the shadcn CLI prints for this item, in order, minus its note on the
 * project's existing `lib/utils.ts`. There is no npm step: a shadcn project
 * already has the only packages it needs (clsx and tailwind-merge), and the
 * CSS update adds the marquee animations.
 */
const OUTPUT: OutputLine[] = [
  { text: "Checking registry.", duration: 650, spins: true },
  {
    text: "Created 1 file:",
    duration: 420,
    spins: false,
    files: ["components/marquee.tsx"],
  },
  { text: "Updating app/globals.css", duration: 800, spins: true },
];

const START_DELAY = 600;
const KEYSTROKE = 42;
const ENTER_PAUSE = 380;

/** A pause, one step per keystroke, the enter key, then one step per output line. */
const DURATIONS = [
  START_DELAY,
  ...Array.from(COMMAND, () => KEYSTROKE),
  ENTER_PAUSE,
  ...OUTPUT.map((line) => line.duration),
];

/** The step at which the first output line prints. */
const OUTPUT_STEP = COMMAND.length + 2;

/** A block cursor that takes no space, so the command never reflows. */
function Cursor({ blink }: { blink: boolean }) {
  return (
    <span aria-hidden="true" className="relative">
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-[1ch] bg-foreground/70",
          blink && "animate-caret-blink motion-reduce:animate-none",
        )}
      />
    </span>
  );
}

function CheckGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-2.5 text-emerald-600 dark:text-emerald-400"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SpinnerGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-2.5 animate-spin text-muted-foreground motion-reduce:animate-none"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 12a9 9 0 1 1-9-9" />
    </svg>
  );
}

function PromptPath() {
  return <p className="font-medium text-foreground">{DIRECTORY}</p>;
}

/**
 * A terminal that types the install command once it scrolls into view, then
 * prints the CLI output line by line. The full command is always laid out
 * (the untyped part is transparent), so it wraps the same way throughout.
 */
export function FeatureTerminal() {
  const { ref, step, last } = usePlayback<HTMLDivElement>(DURATIONS);
  const typed = Math.min(Math.max(step - 1, 0), COMMAND.length);
  const entered = step >= OUTPUT_STEP;
  const printed = Math.max(0, Math.min(step - OUTPUT_STEP + 1, OUTPUT.length));

  return (
    <div
      className="min-h-0 flex-1 overflow-hidden px-3.5 py-3 font-mono text-[12px] leading-5"
      ref={ref}
    >
      <PromptPath />
      <p className="whitespace-pre-wrap pl-[2ch] indent-[-2ch] text-foreground">
        <span className="text-muted-foreground">$ </span>
        {COMMAND.slice(0, typed)}
        {entered ? null : <Cursor blink={step === 0} />}
        <span className="opacity-0">{COMMAND.slice(typed)}</span>
      </p>

      {OUTPUT.slice(0, printed).map((line, index) => {
        const done = !line.spins || step > OUTPUT_STEP + index;
        return (
          <div key={line.text}>
            <p className="flex items-center text-body">
              <span className="flex w-[2ch] shrink-0 items-center">
                {done ? <CheckGlyph /> : <SpinnerGlyph />}
              </span>
              {line.text}
            </p>
            {line.files?.map((file) => (
              <p className="pl-[2ch] text-muted-foreground" key={file}>
                - {file}
              </p>
            ))}
          </div>
        );
      })}

      {step >= last ? (
        <div className="mt-5 @max-[250px]:hidden">
          <PromptPath />
          <p className="whitespace-pre-wrap">
            <span className="text-muted-foreground">$ </span>
            <Cursor blink />
          </p>
        </div>
      ) : null}
    </div>
  );
}
