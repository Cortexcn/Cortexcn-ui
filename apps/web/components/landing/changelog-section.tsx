import {
  CHANGELOG,
  type ChangelogRelease,
  formatChangelogDate,
} from "@/lib/changelog";

import { ActionLink, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

/** The landing shows the latest releases; /changelog on the library site has them all. */
const LATEST_COUNT = 3;

const ENTRIES = CHANGELOG.slice(0, LATEST_COUNT);

function EntryIcon({ kind }: { kind: ChangelogRelease["kind"] }) {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.1"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={
          kind === "components"
            ? "M5 4L2 7l3 3M9 4l3 3-3 3"
            : "M1.5 7.5l2.5 2.5 5-6M6.5 8.5l1.5 1.5 5-6"
        }
      />
    </svg>
  );
}

function Entry({
  entry,
  showDate,
}: {
  entry: ChangelogRelease;
  /** Off for a later release on the same day, so the date shows once. */
  showDate: boolean;
}) {
  return (
    <li className="relative flex flex-col lg:pl-41">
      {showDate ? (
        <span className="mb-3 self-start bg-muted px-0.5 font-medium font-mono text-body text-sm uppercase leading-[1.3] tracking-[-0.04em] lg:hidden">
          {formatChangelogDate(entry.date)}
        </span>
      ) : null}
      <h3 className="pb-2 text-2xl leading-[1.3] tracking-[-0.05em]">
        {entry.title}
      </h3>

      {/* Timeline row: date on the center line, dashes, icon, dashes. */}
      <div aria-hidden="true" className="relative -ml-41 hidden h-px lg:block">
        {showDate ? (
          <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-muted px-0.5 font-medium font-mono text-body text-sm uppercase leading-[1.3] tracking-[-0.04em]">
            {formatChangelogDate(entry.date)}
          </span>
        ) : null}
        <span className="absolute top-0 left-12 w-15.5 border-border border-t border-dashed" />
        <span className="absolute top-1/2 left-27.25 flex size-8 -translate-y-1/2 items-center justify-center border border-border bg-background text-body">
          <EntryIcon kind={entry.kind} />
        </span>
        <span className="absolute top-0 right-0 left-35.25 border-border border-t border-dashed" />
      </div>
      <div
        aria-hidden="true"
        className="h-px border-border border-t border-dashed lg:hidden"
      />

      <p className="max-w-80 pt-2 text-body text-sm leading-[1.3] tracking-[-0.05em]">
        {entry.summary}
      </p>
    </li>
  );
}

export function ChangelogSection() {
  return (
    <section aria-label="Changelog" className="w-full py-20">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Changelog" section="changelog" />
        <div className="relative grid gap-12 border-border border-b pb-10 lg:grid-cols-2 lg:gap-0">
          {/* Center line, starting at the label rule above. */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 hidden w-px bg-border lg:block"
            style={{ top: "-33px" }}
          />
          <div className="flex flex-col gap-10 lg:pr-12">
            <TypeHeading lines={["We ship often.", "Here is what is new."]} />
            <div className="mt-auto flex flex-col gap-6">
              <ActionLink
                className="self-start"
                href="/changelog"
                label="Full changelog"
              />
              <div className="flex max-w-90 flex-col gap-3 text-body text-lg leading-[1.3] tracking-[-0.05em]">
                <p>New components, blocks, and fixes land every week.</p>
                <p>Everything listed here is live in the registry today.</p>
              </div>
            </div>
          </div>
          <ol className="flex flex-col gap-12 lg:pt-4">
            {ENTRIES.map((entry, index) => (
              <Entry
                entry={entry}
                key={`${entry.date}-${entry.title}`}
                showDate={
                  index === 0 || ENTRIES[index - 1]?.date !== entry.date
                }
              />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
