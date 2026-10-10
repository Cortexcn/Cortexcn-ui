"use client";

import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useCallback,
  useRef,
} from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDownIcon,
  type ChevronsUpDownIconHandle,
} from "./chevrons-up-down-icon";

export interface ExperiencePositionItemType {
  /** Unique identifier for the position */
  id: string;
  /** The job title or position name */
  title: string;
  /**
   * Employment period of the position.
   * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
   */
  employmentPeriod: {
    /** Start date (e.g., "10.2022" or "2020"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string;
  /** A brief description of the position or responsibilities (Markdown) */
  description?: string;
  /** An icon representing the position */
  icon?: ReactElement;
  /** A list of skills associated with the position */
  skills?: string[];
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean;
}

export interface ExperienceItemType {
  /** Unique identifier for the experience item */
  id: string;
  /** Name of the company where the experience was gained */
  companyName: string;
  /** URL or path to the company's logo image */
  companyLogo?: string;
  /** URL to the company's website. */
  companyWebsite?: string;
  /**
   * List of positions held at the company
   * @fumadocsHref #experiencepositionitemtype
   */
  positions: ExperiencePositionItemType[];
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean;
}

export interface WorkExperienceProps {
  className?: string;
  /** @fumadocsHref #experienceitemtype */
  experiences: ExperienceItemType[];
}

export function WorkExperience({
  className,
  experiences,
}: WorkExperienceProps) {
  return (
    <div className={cn("bg-background px-4 text-foreground", className)}>
      {experiences.map((experience) => (
        <ExperienceItem experience={experience} key={experience.id} />
      ))}
    </div>
  );
}

export interface ExperienceItemProps {
  experience: ExperienceItemType;
}

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="not-prose flex items-center gap-3">
        <div className="flex size-6 shrink-0 items-center justify-center">
          {experience.companyLogo ? (
            // biome-ignore lint/performance/noImgElement: framework-agnostic registry component
            <img
              alt={experience.companyName}
              aria-hidden
              className="size-6 rounded-full"
              height={24}
              src={experience.companyLogo}
              width={24}
            />
          ) : (
            <span className="flex size-2 rounded-full bg-muted-foreground/40" />
          )}
        </div>

        <h3 className="font-semibold text-lg/snug">
          {experience.companyWebsite ? (
            <a
              className="decoration-1 underline-offset-3 hover:underline"
              href={experience.companyWebsite}
              rel="noopener noreferrer"
              target="_blank"
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <span
            aria-label="Current Employer"
            className="relative flex items-center justify-center"
            role="img"
          >
            <span className="absolute inline-flex size-3 animate-ping rounded-full bg-live opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-live" />
          </span>
        )}
      </div>

      <div className="relative space-y-4 before:absolute before:left-3 before:h-full before:w-px before:bg-border">
        {experience.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </div>
  );
}

export interface ExperiencePositionItemProps {
  position: ExperiencePositionItemType;
}

export function ExperiencePositionItem({
  position,
}: ExperiencePositionItemProps) {
  const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsUpDownIconRef.current;
    if (!controls) {
      return;
    }

    if (open) {
      controls.startAnimation();
    } else {
      controls.stopAnimation();
    }
  }, []);

  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;
  const duration = formatDuration(start, end);

  return (
    <Collapsible
      className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background"
      defaultOpen={position.isExpanded}
      disabled={!position.description}
      onOpenChange={handleOpenChange}
    >
      <CollapsibleTrigger
        className={cn(
          "group/experience-position not-prose block w-full select-none text-left",
          "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/30",
          "data-disabled:before:content-none",
        )}
      >
        <div className="relative z-1 mb-1 flex items-start gap-3 text-base">
          <div
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-lg",
              "bg-muted text-muted-foreground",
              "border border-muted-foreground/15 ring-1 ring-border ring-offset-1 ring-offset-background",
              "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
            )}
          >
            {position.icon ?? <BriefcaseBusinessIcon />}
          </div>

          <h4 className="flex-1 text-balance font-medium text-foreground">
            {position.title}
          </h4>

          <div className="shrink-0 text-muted-foreground group-data-disabled/experience-position:hidden [&_svg]:h-lh [&_svg]:w-4">
            <ChevronsUpDownIcon duration={0.15} ref={chevronsUpDownIconRef} />
          </div>
        </div>

        {/* Separators are aria-hidden: a dl may only expose dt/dd groups, and these dividers are decorative. */}
        <dl className="relative z-1 flex items-center gap-2 pl-9 text-muted-foreground text-sm">
          {position.employmentType && (
            <>
              <div>
                <dt className="sr-only">Employment Type</dt>
                <dd>{position.employmentType}</dd>
              </div>

              <Separator
                aria-hidden
                className="data-vertical:h-4 data-vertical:self-center"
                orientation="vertical"
              />
            </>
          )}

          <div>
            <dt className="sr-only">Employment Period</dt>
            <dd className="flex items-center gap-0.5 tabular-nums">
              <span>{start}</span>
              <span className="font-mono">–</span>
              {isOngoing ? (
                <InfinityIcon
                  aria-label="Present"
                  className="size-4.5 translate-y-[0.5px]"
                />
              ) : (
                <span>{end}</span>
              )}
            </dd>
          </div>

          {duration && (
            <>
              <Separator
                aria-hidden
                className="data-vertical:h-4 data-vertical:self-center"
                orientation="vertical"
              />
              <div>
                <dt className="sr-only">Duration</dt>
                <dd className="tabular-nums">{duration}</dd>
              </div>
            </>
          )}
        </dl>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden">
        {position.description && (
          <Markdown className="pt-2 pl-9">{position.description}</Markdown>
        )}
      </CollapsibleContent>

      {Array.isArray(position.skills) && position.skills.length > 0 && (
        <ul className="not-prose flex flex-wrap gap-1.5 pt-3 pl-9">
          {position.skills.map((skill) => (
            <li className="flex" key={skill}>
              <Skill>{skill}</Skill>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  );
}

function Skill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-muted-foreground text-xs",
        className,
      )}
      {...props}
    />
  );
}

/* Icons (inlined so the component needs no icon library) */

function BriefcaseBusinessIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 12h.01" />
      <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M22 13a18.15 18.15 0 0 1-20 0" />
      <rect height="14" rx="2" width="20" x="2" y="6" />
    </svg>
  );
}

function InfinityIcon(props: ComponentProps<"svg">) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: callers label it with aria-label ("Present")
    <svg
      fill="none"
      role="img"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
  );
}

/* Markdown (the small subset position descriptions need) */

const BULLET_ITEM_RE = /^\s*[-*+]\s+(.*)$/;
const ORDERED_ITEM_RE = /^\s*\d+[.)]\s+(.*)$/;
const INLINE_TOKEN_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)\s]+)\)$/;
/** Only render links that cannot run script (`javascript:` and friends). */
const SAFE_HREF_RE = /^(?:https?:|mailto:|\/|#)/i;

type MarkdownBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

function parseMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (const line of source.split("\n")) {
    const bullet = BULLET_ITEM_RE.exec(line);
    const item = bullet ?? ORDERED_ITEM_RE.exec(line);

    if (item) {
      flushParagraph();
      const ordered = !bullet;
      const text = item[1] ?? "";
      const last = blocks.at(-1);
      if (last?.kind === "list" && last.ordered === ordered) {
        last.items.push(text);
      } else {
        blocks.push({ kind: "list", ordered, items: [text] });
      }
    } else if (line.trim() === "") {
      flushParagraph();
    } else {
      paragraph.push(line.trim());
    }
  }

  flushParagraph();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_TOKEN_RE).map((part, index) => {
    const key = `${index}-${part}`;
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    const link = LINK_RE.exec(part);
    if (link) {
      const [, label = "", href = ""] = link;
      return SAFE_HREF_RE.test(href) ? (
        <a href={href} key={key} rel="noopener noreferrer" target="_blank">
          {label}
        </a>
      ) : (
        label
      );
    }
    return part;
  });
}

function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose space-y-2 text-foreground/80 text-sm leading-relaxed",
        "[&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4",
        "[&_li]:pl-1 [&_li]:marker:text-muted-foreground",
        "[&_a:hover]:decoration-current [&_a]:break-words [&_a]:text-foreground [&_a]:underline [&_a]:decoration-1 [&_a]:decoration-current/30 [&_a]:underline-offset-3 [&_a]:transition-colors",
        "[&_strong]:font-medium [&_strong]:text-foreground",
        "[&_code]:rounded-md [&_code]:border [&_code]:bg-muted/50 [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-xs",
        className,
      )}
    >
      {parseMarkdown(children).map((block, index) => {
        const key = `${block.kind}-${index}`;
        if (block.kind === "paragraph") {
          return <p key={key}>{renderInline(block.text)}</p>;
        }
        const List = block.ordered ? "ol" : "ul";
        return (
          <List key={key}>
            {block.items.map((item, itemIndex) => (
              <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

/* Duration ("1y 4m") from "MM.YYYY" or "YYYY" periods */

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes(".");
  const endHasMonth = end ? end.includes(".") : true;

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = Number.parseInt(end, 10) - Number.parseInt(start, 10);
    if (years <= 0) {
      return "";
    }
    return `${years}y`;
  }

  const startMonth = toMonthIndex(start, "first");
  const now = new Date();
  const endMonth = end
    ? toMonthIndex(end, "last")
    : now.getFullYear() * 12 + now.getMonth();

  // +1 to count both the start and end months inclusively.
  const totalMonths = endMonth - startMonth + 1;
  if (totalMonths <= 0) {
    return "";
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) {
    return `${years}y`;
  }
  return `${years}y ${months}m`;
}

/**
 * Months since year 0 for "MM.YYYY", or for "YYYY" using January ("first")
 * or December ("last") of that year.
 */
function toMonthIndex(value: string, fallbackMonth: "first" | "last"): number {
  const [monthOrYear = "", year] = value.split(".");
  if (year !== undefined) {
    return (
      Number.parseInt(year, 10) * 12 + Number.parseInt(monthOrYear, 10) - 1
    );
  }
  const month = fallbackMonth === "last" ? 11 : 0;
  return Number.parseInt(monthOrYear, 10) * 12 + month;
}
