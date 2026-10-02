"use client";

import { ShimmeringText } from "@cortexcn/ui/components/shimmering-text";

import { cn } from "@/lib/utils";

import { usePlayback } from "./features-section-playback";

const REQUEST = "Add a revenue chart to the dashboard.";
const REPLY = "Added an area chart of monthly revenue to the dashboard.";

interface ToolCall {
  tool: string;
  call: string;
  args: string;
  /** Milliseconds the call runs before the next one starts. */
  duration: number;
}

/** shadcn MCP server tools, then the CLI, the way an agent installs an item. */
const TOOL_CALLS: ToolCall[] = [
  {
    tool: "shadcn",
    call: "search_items_in_registries",
    args: '"area chart"',
    duration: 900,
  },
  {
    tool: "shadcn",
    call: "get_add_command_for_items",
    args: "@cortexcn/area-chart",
    duration: 750,
  },
  {
    tool: "Bash",
    call: "npx shadcn@latest add",
    args: "@cortexcn/area-chart",
    duration: 1300,
  },
];

const THINKING = 800;

/** The agent thinks, then each tool call runs in turn. */
const DURATIONS = [THINKING, ...TOOL_CALLS.map((call) => call.duration)];

function ArrowUpGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

/**
 * A compact agent chat that works through its tool calls once it scrolls into
 * view, with a shimmering status line (the registry's `ShimmeringText`) until
 * it replies. The composer only shows when the tile has room for it.
 */
export function FeatureAgent() {
  const { ref, step, last } = usePlayback<HTMLDivElement>(DURATIONS);
  const calls = TOOL_CALLS.slice(0, step);
  const replied = step >= last;

  return (
    <div className="flex min-h-0 flex-1 flex-col" ref={ref}>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-3 pt-3 pb-2">
        <p className="ml-auto max-w-[92%] rounded-xl rounded-br-[4px] bg-muted px-2.5 py-1.5 text-[12px] text-foreground leading-4">
          {REQUEST}
        </p>

        {calls.length > 0 ? (
          <ul className="flex flex-col gap-1 font-mono text-[11px] leading-3.75">
            {calls.map((call, index) => {
              const done = step > index + 1;
              return (
                <li className="flex gap-2" key={call.call}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1.25 size-1.25 shrink-0 rounded-full",
                      done
                        ? "bg-emerald-500"
                        : "animate-pulse bg-muted-foreground motion-reduce:animate-none",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">
                      <span className="font-medium text-foreground">
                        {call.tool}
                      </span>{" "}
                      <span className="text-body">{call.call}</span>
                    </span>
                    <span className="block @max-[250px]:hidden truncate text-muted-foreground">
                      {call.args}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {replied ? (
          <p className="text-[12px] text-foreground leading-4.25">{REPLY}</p>
        ) : (
          <span aria-hidden="true" className="flex h-4.25 items-center">
            <ShimmeringText className="text-[12px]" text="Working" />
          </span>
        )}
      </div>

      <div className="@min-[280px]:block hidden shrink-0 px-3 pb-3">
        <div className="flex h-8 items-center justify-between rounded-lg border border-border pr-1 pl-2.5 text-[12px] text-muted-foreground">
          Ask for a component
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <ArrowUpGlyph />
          </span>
        </div>
      </div>
    </div>
  );
}
