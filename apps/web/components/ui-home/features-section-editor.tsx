import { cn } from "@/lib/utils";

type Tone = "keyword" | "name" | "prop" | "punct" | "literal";
type Change = "removed" | "added";
type Token = readonly [text: string, tone: Tone];

/** Monochrome syntax tones, from the page tokens. */
const TONE: Record<Tone, string> = {
  keyword: "text-muted-foreground",
  name: "font-medium text-foreground",
  prop: "text-body",
  punct: "text-(--heading-muted)",
  literal: "text-foreground",
};

const CHANGE_ROW: Record<Change, string> = {
  removed:
    "bg-red-500/[0.08] before:bg-red-500/70 dark:bg-red-500/[0.12] dark:before:bg-red-400/70",
  added:
    "bg-emerald-500/[0.09] before:bg-emerald-500/70 dark:bg-emerald-500/[0.12] dark:before:bg-emerald-400/70",
};

const CHANGE_MARK: Record<Change, { sign: string; className: string }> = {
  removed: { sign: "-", className: "text-red-600 dark:text-red-400" },
  added: { sign: "+", className: "text-emerald-600 dark:text-emerald-400" },
};

/** The changed value itself, a shade stronger than its row. */
const CHANGE_WORD: Record<Change, string> = {
  removed: "rounded-[3px] bg-red-500/20 dark:bg-red-500/25",
  added: "rounded-[3px] bg-emerald-500/25",
};

interface CodeRow {
  id: string;
  /** Line number in the edited file. A removed line has none. */
  line?: number;
  change?: Change;
  tokens: Token[];
}

function prop(name: string, value?: string): Token[] {
  const tokens: Token[] = [[`  ${name}`, "prop"]];
  if (value) {
    tokens.push([" = ", "punct"], [value, "literal"]);
  }
  tokens.push([",", "punct"]);
  return tokens;
}

/**
 * Lines 57 to 67 of the installed `components/number-ticker.tsx`, with the
 * `duration` default changed as a local edit. The code area clips the rest,
 * the way an editor does.
 */
const ROWS: CodeRow[] = [
  {
    id: "57",
    line: 57,
    tokens: [
      ["export", "keyword"],
      [" ", "punct"],
      ["function", "keyword"],
      [" ", "punct"],
      ["NumberTicker", "name"],
      ["({", "punct"],
    ],
  },
  { id: "58", line: 58, tokens: prop("value") },
  { id: "59", line: 59, tokens: prop("pad") },
  { id: "60-removed", change: "removed", tokens: prop("duration", "0.9") },
  { id: "60", line: 60, change: "added", tokens: prop("duration", "1.4") },
  { id: "61", line: 61, tokens: prop("stagger", "0.04") },
  { id: "62", line: 62, tokens: prop("startOnView", "true") },
  { id: "63", line: 63, tokens: prop("prefix") },
  { id: "64", line: 64, tokens: prop("suffix") },
  { id: "65", line: 65, tokens: prop("blur", "false") },
  { id: "66", line: 66, tokens: prop("className") },
  { id: "67", line: 67, tokens: prop("digitClassName") },
];

/** Where the edit left the cursor: after the new value on line 60. */
const CURSOR = { row: "60", position: "Ln 60, Col 17" };

function ReactGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" fill="currentColor" r="1.6" stroke="none" />
    </svg>
  );
}

function BranchGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M6 7v10M18 9c0 5-12 3-12 8" />
    </svg>
  );
}

/** A text cursor that takes no space, placed right after the edited value. */
function EditCursor() {
  return (
    <span aria-hidden="true" className="relative">
      <span className="absolute inset-y-0 left-0 w-px animate-caret-blink bg-foreground motion-reduce:animate-none" />
    </span>
  );
}

function CodeLine({ row }: { row: CodeRow }) {
  const mark = row.change ? CHANGE_MARK[row.change] : null;
  const hasCursor = row.id === CURSOR.row;

  return (
    <div
      className={cn(
        "relative flex pr-3",
        row.change && [
          "before:absolute before:inset-y-0 before:left-0 before:w-0.5",
          CHANGE_ROW[row.change],
        ],
      )}
    >
      <span className="@max-[250px]:w-6 w-8 shrink-0 @max-[250px]:pr-1.5 pr-2 text-right text-(--heading-muted) tabular-nums">
        {row.line}
      </span>
      <span
        className={cn(
          "@max-[250px]:w-[1.5ch] w-[2ch] shrink-0",
          mark?.className,
        )}
      >
        {mark?.sign}
      </span>
      <span className="whitespace-pre">
        {row.tokens.map(([text, tone], index) => (
          <span
            className={cn(
              TONE[tone],
              row.change && tone === "literal" && CHANGE_WORD[row.change],
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional and never reorder
            key={index}
          >
            {text}
            {hasCursor && tone === "literal" ? <EditCursor /> : null}
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * A tiny editor with the installed Number Ticker source open and one default
 * changed, shown the way an inline diff shows a local edit.
 */
export function FeatureEditor() {
  return (
    <>
      <div className="flex h-8 shrink-0 items-center gap-0.5 border-border border-b px-1.5 text-[11px]">
        <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-medium text-foreground">
          <ReactGlyph className="size-3 text-muted-foreground" />
          number-ticker.tsx
        </span>
        <span className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground">
          <ReactGlyph className="size-3" />
          page.tsx
        </span>
      </div>

      <div className="mask-b-from-[calc(100%-1rem)] min-h-0 flex-1 overflow-hidden pt-2 font-mono @max-[250px]:text-[10.5px] text-[11.5px] leading-4.75">
        {ROWS.map((row) => (
          <CodeLine key={row.id} row={row} />
        ))}
      </div>

      <div className="flex h-6 shrink-0 items-center justify-between border-border border-t bg-muted/60 px-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <BranchGlyph className="size-3" />
          main
        </span>
        <span>{CURSOR.position}</span>
      </div>
    </>
  );
}
