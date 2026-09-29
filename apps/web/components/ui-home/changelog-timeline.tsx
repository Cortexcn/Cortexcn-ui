import Link from "next/link";

import {
  CHANGELOG,
  type ChangelogKind,
  type ChangelogRelease,
  formatChangelogDate,
} from "@/lib/changelog";
import { cn } from "@/lib/utils";

import { Painting } from "./painting";
import { Container } from "./primitives";
import { Reveal } from "./reveal";

const KIND_LABEL: Record<ChangelogKind, string> = {
  components: "Components",
  blocks: "Blocks",
  site: "Site",
};

function ReleaseCard({
  release,
  latest,
}: {
  release: ChangelogRelease;
  latest: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-(--surface)">
      {latest ? (
        <div className="relative h-28 md:h-36">
          <Painting
            art="pastel-daisies"
            sizes="(min-width: 1024px) 860px, 100vw"
          />
          <span className="absolute top-4 left-4 rounded-full bg-background/85 px-3 py-1 font-medium text-foreground text-xs backdrop-blur-sm">
            Latest release
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-4 p-6 md:p-8">
        <h2 className="text-balance font-light font-sentient text-[28px] leading-[1.15] tracking-[-0.05em] md:text-[32px]">
          {release.title}
        </h2>
        <p className="max-w-2xl text-base text-body leading-[1.45]">
          {release.summary}
        </p>
        <ul className="flex flex-wrap gap-2 pt-2">
          {release.items.map((item) => (
            <li key={item.href}>
              <Link
                className="inline-flex h-8 items-center rounded-full border border-border bg-background px-3 text-foreground text-sm transition-colors hover:bg-muted"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Every release, newest first, on a dated line down the left. */
export function ChangelogTimeline() {
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <ol className="relative flex flex-col gap-10 md:gap-14">
          {/* The timeline rule, from the first date to the last. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[5px] hidden w-px bg-border lg:block"
          />
          {CHANGELOG.map((release, index) => (
            <li
              className="relative grid gap-4 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
              key={`${release.date}-${release.title}`}
            >
              <div className="flex items-center gap-3 lg:sticky lg:top-[calc(var(--site-header-height)+2rem)] lg:flex-col lg:items-start lg:gap-2 lg:self-start lg:pl-8">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 left-0 hidden size-[11px] rounded-full border-2 border-background lg:block",
                    index === 0 ? "bg-foreground" : "bg-(--faint)",
                  )}
                />
                <time
                  className="font-medium text-foreground text-sm tabular-nums"
                  dateTime={release.date}
                >
                  {formatChangelogDate(release.date)}
                </time>
                <span className="rounded-[4px] bg-muted px-1.5 py-1 font-medium text-muted-foreground text-xs leading-none">
                  {KIND_LABEL[release.kind]}
                </span>
              </div>
              <Reveal>
                <ReleaseCard latest={index === 0} release={release} />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
