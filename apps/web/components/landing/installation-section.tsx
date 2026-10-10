"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { type ReactNode, useRef, useState } from "react";

import { useSmoothScrollTo } from "@/components/smooth-scroll/use-smooth-scroll-to";
import { cn } from "@/lib/utils";

import { ActionLink, DotTexture, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

interface InstallStep {
  title: string;
  description: string;
  code: string;
}

/** Connecting an AI agent to the hosted Cortexcn MCP server, in three steps. */
const STEPS: InstallStep[] = [
  {
    title: "Claude Code",
    description:
      "Connect the hosted Cortexcn MCP server with one command. There is nothing to install and no sign-in.",
    code: `# Connect the Cortexcn MCP server
claude mcp add --transport http cortexcn https://ui.cortexcn.dev/mcp

# Or connect it once for every project
claude mcp add --transport http --scope user cortexcn https://ui.cortexcn.dev/mcp

# The project needs shadcn set up (skip if it has components.json)
npx shadcn@latest init`,
  },
  {
    title: "Cursor, VS Code, and Codex",
    description:
      "Every client uses the same URL. Add it to your editor's MCP config, or run one command in Codex.",
    code: `# Cursor: .cursor/mcp.json
{
  "mcpServers": {
    "cortexcn": {
      "url": "https://ui.cortexcn.dev/mcp"
    }
  }
}

# VS Code with Copilot: .vscode/mcp.json
{
  "servers": {
    "cortexcn": {
      "type": "http",
      "url": "https://ui.cortexcn.dev/mcp"
    }
  }
}

# Codex
codex mcp add cortexcn --url https://ui.cortexcn.dev/mcp`,
  },
  {
    title: "Ask for it",
    description:
      "Ask in plain words. Your agent searches the registry, reads the docs, and runs the install command in your project.",
    code: `# Ask your agent in plain words
> Add the Lanyard 3D component to the about page.

● cortexcn  search_items         "lanyard"
● cortexcn  get_item             lanyard-3d
● cortexcn  get_install_command  lanyard-3d
● Bash      npx shadcn@latest add https://ui.cortexcn.dev/r/lanyard-3d.json
● Edit      app/about/page.tsx

✔ Added the Lanyard 3D component to the about page.

# Other tools: list_items, list_categories,
# get_item_source, get_setup_guide, get_design_guide`,
  },
];

/* ------------------------------------------------------------------------ */
/* Code window                                                               */
/* ------------------------------------------------------------------------ */

/**
 * One alternative per token kind, in priority order. JSX tags are the one case
 * with two groups: the bracket stays plain and the name is colored.
 */
const TOKEN_PATTERN =
  /((?<=^|\s)(?:#|\/\/).*$)|("[^"]*"|'[^']*')|\b(import|from|export|function|return|const|new)\b|(--[a-z][\w-]*)|(@cortexcn[\w./-]*)|(<\/?)([A-Za-z]+)|\b([a-zA-Z]+)(?==)|(^>)|(^✔)|(^●)|(?<=:\s)(\d+(?:\.\d+)?)\b/g;

/** Class per capture group, by group number (group 6 is the JSX bracket). */
const GROUP_CLASS: Record<number, string> = {
  1: "text-[#7a7a7a]",
  2: "text-[#c3e88d]",
  3: "text-[#c792ea]",
  4: "text-[#82aaff]",
  5: "text-[#ffcb6b]",
  7: "text-[#82aaff]",
  8: "text-[#ffcb6b]",
  9: "text-[#9d7bff]",
  10: "text-[#c3e88d]",
  11: "text-[#9d7bff]",
  12: "text-[#f78c6c]",
};
const COLORED_GROUPS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];

function highlightLine(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push(line.slice(last, index));
    }
    if (match[6]) {
      parts.push(match[6]);
    }
    const group = COLORED_GROUPS.find((number) => match[number]);
    if (group) {
      parts.push(
        <span className={GROUP_CLASS[group]} key={`${index}-${group}`}>
          {match[group]}
        </span>,
      );
    }
    last = index + match[0].length;
  }
  if (last < line.length) {
    parts.push(line.slice(last));
  }
  return parts;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5.5 5.5h8v8h-8z" />
      <path d="M10.5 5.5v-3h-8v8h3" />
    </svg>
  );
}

function CodeWindow({ step }: { step: InstallStep }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(step.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1a1a1a] text-[#e0e0e0]">
      <div className="flex h-10.5 shrink-0 items-center justify-between bg-[#262626] px-3.5">
        <span className="font-semibold text-sm tracking-[-0.03em]">
          CORTEXCN
        </span>
        <button
          className="flex items-center gap-1.5 font-semibold text-sm tracking-[-0.03em] outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/40"
          onClick={copy}
          type="button"
        >
          {copied ? "Copied" : "Copy"}
          <CopyIcon className="size-3.5" />
        </button>
      </div>
      <pre className="no-scrollbar min-h-0 flex-1 overflow-auto p-4 font-mono text-[13px] leading-5">
        <code>
          {step.code.split("\n").map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines are static and positional
            <span className="block min-h-5" key={index}>
              {highlightLine(line)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/** Pairs of tiny squares at the four corners of the code frame. */
function CornerDots() {
  const dot = "absolute size-1 bg-foreground";
  return (
    <span aria-hidden="true">
      <span className={cn(dot, "top-2 left-3")} />
      <span className={cn(dot, "top-2 left-6")} />
      <span className={cn(dot, "top-2 right-3")} />
      <span className={cn(dot, "top-2 right-6")} />
      <span className={cn(dot, "bottom-2 left-3")} />
      <span className={cn(dot, "bottom-2 left-6")} />
      <span className={cn(dot, "right-3 bottom-2")} />
      <span className={cn(dot, "right-6 bottom-2")} />
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

const DESKTOP_QUERY = "(min-width: 1024px)";

export function InstallationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTo = useSmoothScrollTo();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // On desktop the section is three screens tall and each screen is one step.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      return;
    }
    setActive(Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length)));
  });

  const select = (index: number) => {
    const section = sectionRef.current;
    if (!(section && window.matchMedia(DESKTOP_QUERY).matches)) {
      setActive(index);
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const top =
      section.getBoundingClientRect().top +
      window.scrollY +
      ((index + 0.5) / STEPS.length) * travel;
    scrollTo(top);
  };

  const step = STEPS[active] ?? STEPS[0];

  return (
    <section
      aria-label="Use Cortexcn with your AI agent"
      className="relative w-full lg:h-[300vh]"
      ref={sectionRef}
    >
      <div className="py-20 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:py-0 lg:pt-(--site-header-height)">
        <Container className="flex flex-col gap-6">
          <SectionLabel label="For developers" section="mcp" />
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
            <div className="relative order-2 flex min-w-0 items-center justify-center bg-muted px-4 py-10 sm:px-10 lg:order-1 lg:h-[min(45rem,calc(100svh-12rem))]">
              <DotTexture />
              <div className="relative h-105 w-full max-w-130 border border-border px-3 py-5 lg:h-full lg:max-h-140">
                <CornerDots />
                {step ? <CodeWindow step={step} /> : null}
              </div>
            </div>

            <div className="order-1 flex min-w-0 flex-col gap-12 lg:order-2 lg:pl-12">
              <div className="flex flex-col items-start gap-11">
                <TypeHeading
                  lines={["Connect your agent.", "Ask for any component."]}
                />
                <ActionLink href="/docs/integration/mcp" label="Set up MCP" />
              </div>

              <div className="relative mt-auto flex flex-col gap-4 pl-8">
                {/* Rail: dashed track, accent progress, square caps. The 2px
                    track and bar sit at 3px so they center on the 8px caps. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-0.75 border-border border-l-2 border-dashed"
                />
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-1 left-0.75 hidden w-0.5 origin-top bg-primary lg:block"
                  style={{ scaleY: scrollYProgress }}
                />
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 size-2 bg-primary"
                />
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 size-2 bg-primary"
                />

                {STEPS.map((item, index) => {
                  const selected = index === active;
                  return (
                    <button
                      aria-pressed={selected}
                      className="flex flex-col items-start text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      key={item.title}
                      onClick={() => select(index)}
                      type="button"
                    >
                      <span
                        className={cn(
                          "text-2xl leading-[1.3] tracking-[-0.05em] transition-colors duration-300",
                          selected ? "text-primary" : "text-label-weak",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                          selected
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="block max-w-100 pt-1 text-base text-body leading-[1.3] tracking-[-0.05em]">
                            {item.description}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
