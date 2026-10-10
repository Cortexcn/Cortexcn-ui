import Link from "next/link";

import { TemplateScreenshot } from "@/components/templates/template-screenshot";
import { type CaseStudy, WORK } from "@/lib/work";

import { ActionLink, ArrowUpRightIcon, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

/** The case study's screenshot, or an empty frame while it is a draft. */
export function CaseStudyShot({
  study,
  sizes,
}: {
  study: CaseStudy;
  sizes: string;
}) {
  if (study.screenshot) {
    return <TemplateScreenshot alt="" image={study.screenshot} sizes={sizes} />;
  }
  return (
    <div className="flex aspect-[16/10] items-center justify-center border border-border border-dashed bg-muted font-medium font-mono text-label-weak text-xs uppercase">
      [Screenshot]
    </div>
  );
}

/** One case study as a card that links to its page. */
export function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <li className="group relative flex flex-col border-border border-r border-b">
      <div className="overflow-hidden border-border border-b bg-muted">
        <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none">
          <CaseStudyShot
            sizes="(min-width: 1024px) 33vw, 100vw"
            study={study}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <span className="self-start bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            {study.clientType}
          </span>
          <h3 className="font-medium text-2xl leading-[1.2] tracking-[-0.05em]">
            <Link
              className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-inset"
              href={`/work/${study.slug}`}
            >
              {study.title}
            </Link>
          </h3>
          <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
            {study.summary}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 border-border border-t pt-4">
          <p className="flex flex-col gap-1">
            <span className="text-3xl tabular-nums leading-none tracking-[-0.05em]">
              {study.result.value}
            </span>
            <span className="text-muted-foreground text-sm tracking-[-0.03em]">
              {study.result.label}
            </span>
          </p>
          <ArrowUpRightIcon className="size-4 shrink-0 text-faint transition-[color,translate] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary motion-reduce:transition-none" />
        </div>
      </div>
    </li>
  );
}

/** "Built with Cortexcn": the case studies from `lib/work.ts`, each linking to its page. */
export function WorkSection() {
  if (WORK.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="work-heading"
      className="w-full scroll-mt-(--site-header-height) py-20 md:py-24"
      id="work"
    >
      <Container className="flex flex-col gap-12">
        <SectionLabel label="Built with Cortexcn" section="work" />

        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div id="work-heading">
            <TypeHeading lines={["Built with Cortexcn."]} />
          </div>
          <ActionLink href="/work" label="All work" variant="outline" />
        </div>

        <ul className="grid border-border border-t border-l md:grid-cols-2 lg:grid-cols-3">
          {WORK.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </ul>
      </Container>
    </section>
  );
}
