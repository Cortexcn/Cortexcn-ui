"use client";

import { type ReactNode, useEffect, useId, useState } from "react";

import { ActionLink, useScrambleText } from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import { contactHref } from "@/lib/contact/prefill";
import {
  clampPages,
  countLabel,
  ESTIMATOR_OPTIONS,
  ESTIMATOR_PROJECTS,
  type Estimate,
  type EstimatorOptionId,
  type EstimatorProject,
  type EstimatorProjectId,
  estimateProject,
  estimatorProject,
  formatUsd,
  formatWeeks,
  optionPriceLabel,
  RUSH,
} from "@/lib/service-pricing";
import { cn } from "@/lib/utils";

const monoLabelClassName =
  "font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]";

/** Fixed, so the phone bar can link to it; the page has one estimator. */
const SUMMARY_ID = "estimate-summary";

const tileFocusClassName =
  "has-focus-visible:z-1 has-focus-visible:outline-2 has-focus-visible:outline-ring has-focus-visible:-outline-offset-2";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.75"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 8.5l3.25 3.25L13 5" />
    </svg>
  );
}

function StepIcon({ kind }: { kind: "minus" | "plus" }) {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={kind === "plus" ? "M8 3v10M3 8h10" : "M3 8h10"} />
    </svg>
  );
}

function Step({
  index,
  title,
  titleId,
  children,
}: {
  index: number;
  title: string;
  titleId: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-border border-b py-8">
      <h3
        className="flex items-baseline gap-3 font-medium text-2xl leading-[1.2] tracking-[-0.05em]"
        id={titleId}
      >
        <span
          aria-hidden="true"
          className="font-pixel text-primary text-xl leading-none"
        >
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

/** A radio button drawn as a tile, for the project and timeline choices. */
function ChoiceTile({
  name,
  checked,
  onSelect,
  title,
  detail,
  meta,
}: {
  name: string;
  checked: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  meta: string;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col gap-3 bg-background p-5 transition-colors",
        tileFocusClassName,
        checked ? "z-1 ring-1 ring-primary ring-inset" : "hover:bg-muted/60",
      )}
    >
      <input
        checked={checked}
        className="sr-only"
        name={name}
        onChange={onSelect}
        type="radio"
      />
      <span className="flex items-center justify-between gap-4">
        <span className="font-medium text-xl leading-[1.2] tracking-[-0.05em]">
          {title}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center border transition-colors",
            checked ? "border-primary" : "border-border",
          )}
        >
          <span
            className={cn(
              "size-2 bg-primary transition-transform duration-200",
              checked ? "scale-100" : "scale-0",
            )}
          />
        </span>
      </span>
      <span className="text-base text-body leading-[1.3] tracking-[-0.05em]">
        {detail}
      </span>
      <span className={cn(monoLabelClassName, "mt-auto")}>{meta}</span>
    </label>
  );
}

function PageStepper({
  project,
  pages,
  labelledBy,
  onChange,
}: {
  project: EstimatorProject;
  pages: number;
  labelledBy: string;
  onChange: (pages: number) => void;
}) {
  // What they are typing, so an empty or half-typed field is not snapped back.
  const [draft, setDraft] = useState<string | null>(null);
  const buttonClassName =
    "flex size-12 shrink-0 items-center justify-center border border-border bg-background outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:z-1 focus-visible:border-primary disabled:pointer-events-none disabled:text-faint";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex">
        <button
          aria-label={`One ${project.unit.one} less`}
          className={buttonClassName}
          disabled={pages <= project.basePages}
          onClick={() => onChange(pages - 1)}
          type="button"
        >
          <StepIcon kind="minus" />
        </button>
        <input
          aria-labelledby={labelledBy}
          className="-mx-px h-12 w-20 border border-border bg-background text-center text-2xl tabular-nums tracking-[-0.05em] outline-none [appearance:textfield] focus-visible:z-1 focus-visible:border-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          inputMode="numeric"
          max={project.maxPages}
          min={project.basePages}
          onBlur={() => setDraft(null)}
          onChange={(event) => {
            setDraft(event.target.value);
            const next = Number.parseInt(event.target.value, 10);
            if (Number.isFinite(next)) {
              onChange(next);
            }
          }}
          // Typing replaces the count instead of adding digits to it.
          onFocus={(event) => event.target.select()}
          type="number"
          value={draft ?? String(pages)}
        />
        <button
          aria-label={`One more ${project.unit.one}`}
          className={buttonClassName}
          disabled={pages >= project.maxPages}
          onClick={() => onChange(pages + 1)}
          type="button"
        >
          <StepIcon kind="plus" />
        </button>
      </div>
      <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
        {countLabel(project, project.basePages)} included. Each extra{" "}
        {project.unit.one} is {formatUsd(project.pagePrice)}.
      </p>
    </div>
  );
}

function OptionTile({
  label,
  detail,
  price,
  checked,
  included,
  onToggle,
}: {
  label: string;
  detail: string;
  price: string;
  checked: boolean;
  included: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "relative flex gap-4 border-border border-r border-b p-5 transition-colors",
        tileFocusClassName,
        included ? "cursor-default" : "cursor-pointer hover:bg-muted/60",
      )}
    >
      <input
        checked={checked}
        className="sr-only"
        disabled={included}
        onChange={onToggle}
        type="checkbox"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
          included && "border-border bg-muted text-muted-foreground",
          !included &&
            (checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-transparent"),
        )}
      >
        <CheckIcon className="size-3.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-medium text-lg leading-[1.2] tracking-[-0.05em]">
            {label}
          </span>
          <span className={monoLabelClassName}>
            {included ? "Included" : price}
          </span>
        </span>
        <span className="text-base text-body leading-[1.3] tracking-[-0.05em]">
          {detail}
        </span>
      </span>
    </label>
  );
}

/** The total, re-typed on every change, with a quiet copy for screen readers. */
function EstimateTotal({ estimate }: { estimate: Estimate }) {
  const text = formatUsd(estimate.total);
  const [display, play] = useScrambleText(text, 45);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <div className="flex flex-col gap-1">
      <span className={monoLabelClassName}>Estimated total</span>
      <p
        aria-hidden="true"
        className="whitespace-pre text-[3.5rem] tabular-nums leading-[1.1] tracking-[-0.06em]"
      >
        {display}
      </p>
      <p aria-live="polite" className="sr-only">
        {`Estimated total ${text}. ${formatWeeks(estimate.weeks)}.`}
      </p>
    </div>
  );
}

const VOWEL_START_RE = /^[aeiou]/;

function estimateMessage(
  project: EstimatorProject,
  pages: number,
  chosen: ReadonlySet<EstimatorOptionId>,
  rush: boolean,
  estimate: Estimate,
) {
  const extras = ESTIMATOR_OPTIONS.filter(
    (option) => chosen.has(option.id) && !project.included.includes(option.id),
  ).map((option) => option.label);
  const needs =
    extras.length > 0 ? ` It also needs: ${extras.join(", ")}.` : "";
  const timing = rush ? " We would like rush delivery." : "";
  const kind = project.label.toLowerCase();
  const article = VOWEL_START_RE.test(kind) ? "an" : "a";
  return [
    `Hi, I would like a quote for ${article} ${kind} with ${countLabel(project, pages)}.${needs}${timing}`,
    `The pricing page estimate was ${formatUsd(estimate.total)}, ${formatWeeks(estimate.weeks).toLowerCase()}.`,
    "",
    "About the project: ",
  ].join("\n");
}

/**
 * Pick a kind of project, the page count, and extras, and the price adds up
 * as you go. The result opens the contact form with the choices written out.
 */
export function ProjectEstimator() {
  const [projectId, setProjectId] = useState<EstimatorProjectId>("website");
  const [pages, setPages] = useState(
    () => estimatorProject("website").basePages,
  );
  const [chosen, setChosen] = useState<ReadonlySet<EstimatorOptionId>>(
    () => new Set(),
  );
  const [rush, setRush] = useState(false);
  const ids = {
    project: useId(),
    pages: useId(),
    options: useId(),
    timeline: useId(),
  };

  const project = estimatorProject(projectId);
  const standard = estimateProject(projectId, pages, chosen, false);
  const rushed = estimateProject(projectId, pages, chosen, true);
  const estimate = rush ? rushed : standard;
  const href = contactHref(
    "custom-work",
    estimateMessage(project, pages, chosen, rush, estimate),
  );

  const selectProject = (id: EstimatorProjectId) => {
    setProjectId(id);
    setPages(estimatorProject(id).basePages);
  };

  const toggleOption = (id: EstimatorOptionId) => {
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section
      aria-labelledby="estimate-heading"
      className="w-full scroll-mt-[calc(var(--site-header-height)+1.5rem)] pb-20 md:pb-24"
      id="estimate"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2
              className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
              id="estimate-heading"
            >
              Estimate your project
            </h2>
            <p className="text-body text-lg leading-[1.3] tracking-[-0.05em]">
              Choose what you need and watch the price add up. Send it to us,
              and your written quote starts from there.
            </p>
          </div>
          <span
            className={cn(
              monoLabelClassName,
              "self-start bg-muted px-1 py-0.5 md:self-auto",
            )}
          >
            Live estimate in USD
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12">
          <div className="flex min-w-0 flex-col border-border border-t">
            <Step index={1} title="What are we building?" titleId={ids.project}>
              <div
                aria-labelledby={ids.project}
                className="grid gap-px border border-border bg-border sm:grid-cols-2"
                role="radiogroup"
              >
                {ESTIMATOR_PROJECTS.map((option) => (
                  <ChoiceTile
                    checked={option.id === projectId}
                    detail={option.summary}
                    key={option.id}
                    meta={`From ${formatUsd(option.base)}`}
                    name={ids.project}
                    onSelect={() => selectProject(option.id)}
                    title={option.label}
                  />
                ))}
              </div>
            </Step>

            <Step
              index={2}
              title={`How many ${project.unit.many}?`}
              titleId={ids.pages}
            >
              <PageStepper
                labelledBy={ids.pages}
                onChange={(next) => setPages(clampPages(project, next))}
                pages={pages}
                project={project}
              />
            </Step>

            <Step
              index={3}
              title="What else does it need?"
              titleId={ids.options}
            >
              <fieldset
                aria-labelledby={ids.options}
                className="grid min-w-0 border-border border-t border-l sm:grid-cols-2"
              >
                {ESTIMATOR_OPTIONS.map((option) => {
                  const included = project.included.includes(option.id);
                  return (
                    <OptionTile
                      checked={included || chosen.has(option.id)}
                      detail={option.detail}
                      included={included}
                      key={option.id}
                      label={option.label}
                      onToggle={() => toggleOption(option.id)}
                      price={optionPriceLabel(option, project)}
                    />
                  );
                })}
              </fieldset>
            </Step>

            <Step
              index={4}
              title="How soon do you need it?"
              titleId={ids.timeline}
            >
              <div
                aria-labelledby={ids.timeline}
                className="grid gap-px border border-border bg-border sm:grid-cols-2"
                role="radiogroup"
              >
                <ChoiceTile
                  checked={!rush}
                  detail={formatWeeks(standard.weeks)}
                  meta="No extra cost"
                  name={ids.timeline}
                  onSelect={() => setRush(false)}
                  title="Standard"
                />
                <ChoiceTile
                  checked={rush}
                  detail={formatWeeks(rushed.weeks)}
                  meta={RUSH.priceLabel}
                  name={ids.timeline}
                  onSelect={() => setRush(true)}
                  title="Rush"
                />
              </div>
            </Step>

            {/* Keeps the total in sight on phones, where the summary sits below the steps. */}
            <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-4 border-border border-t bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6 lg:hidden">
              <div className="flex flex-col">
                <span className={monoLabelClassName}>Estimate</span>
                <span className="text-2xl tabular-nums leading-[1.2] tracking-[-0.05em]">
                  {formatUsd(estimate.total)}
                </span>
              </div>
              <a
                className="font-medium font-mono text-sm uppercase leading-[1.3] tracking-[-0.04em] underline decoration-1 underline-offset-4 transition-colors hover:text-primary"
                href={`#${SUMMARY_ID}`}
              >
                See breakdown
              </a>
            </div>
          </div>

          <aside
            aria-labelledby={`${SUMMARY_ID}-title`}
            className="flex scroll-mt-[calc(var(--site-header-height)+1.5rem)] flex-col border border-border bg-card lg:sticky lg:top-[calc(var(--site-header-height)+1.5rem)]"
            id={SUMMARY_ID}
          >
            <div className="flex items-center justify-between gap-4 border-border border-b px-6 py-4">
              <h3 className={monoLabelClassName} id={`${SUMMARY_ID}-title`}>
                Your estimate
              </h3>
              <span className={monoLabelClassName}>
                {formatWeeks(estimate.weeks)}
              </span>
            </div>
            <ul className="flex flex-col gap-3 px-6 py-6">
              {estimate.lines.map((line) => (
                <li
                  className="flex items-baseline justify-between gap-4 text-base leading-[1.3] tracking-[-0.05em]"
                  key={line.label}
                >
                  <span className="text-body">{line.label}</span>
                  {line.amount === null ? (
                    <span className={cn(monoLabelClassName, "shrink-0")}>
                      Included
                    </span>
                  ) : (
                    <span className="shrink-0 tabular-nums">
                      {formatUsd(line.amount)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-8 border-border border-t px-6 pt-6 pb-8">
              <EstimateTotal estimate={estimate} />
              <div className="flex flex-col gap-3">
                <ActionLink block href={href} label="Send this estimate" />
                <p className="text-muted-foreground text-sm leading-[1.3] tracking-[-0.03em]">
                  An estimate, not a quote. The written quote sets the final
                  scope and price before any work starts.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
