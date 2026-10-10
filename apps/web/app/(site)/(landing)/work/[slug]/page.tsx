import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowUpRightIcon } from "@/components/landing/kit";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Container } from "@/components/landing/primitives";
import { TitleBand } from "@/components/landing/title-band";
import { CaseStudyShot } from "@/components/landing/work-section";
import { ServicesCta } from "@/components/services/services-cta";
import { ServicesLabel } from "@/components/services/services-label";
import { pageMetadata } from "@/lib/seo";
import { getCaseStudy, WORK } from "@/lib/work";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

// Drafts exist only in dev builds, so only the listed slugs have pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return WORK.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const study = getCaseStudy((await params).slug);
  if (!study) {
    return {};
  }
  return pageMetadata({
    title: `${study.title} case study`,
    description: study.summary,
    path: `/work/${study.slug}`,
    type: "article",
  });
}

const labelClassName =
  "font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]";

const bodyClassName = "text-body text-lg leading-[1.4] tracking-[-0.04em]";

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const study = getCaseStudy((await params).slug);
  if (!study) {
    notFound();
  }

  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title={study.title} />

        <article className="w-full py-20 md:py-24">
          <Container className="flex flex-col gap-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                className="font-medium font-mono text-body text-sm uppercase underline underline-offset-4 transition-colors hover:text-primary"
                href="/work"
              >
                All work
              </Link>
              {study.draft ? (
                <span className="bg-primary/10 px-1.5 py-1 font-medium font-mono text-primary text-xs uppercase leading-none">
                  Draft, dev only
                </span>
              ) : null}
            </div>

            <dl className="grid border-border border-t border-l sm:grid-cols-3">
              <div className="flex flex-col gap-3 border-border border-r border-b p-6">
                <dt className={labelClassName}>Client type</dt>
                <dd className="text-xl leading-[1.2] tracking-[-0.05em]">
                  {study.clientType}
                </dd>
              </div>
              <div className="flex flex-col gap-3 border-border border-r border-b p-6">
                <dt className={labelClassName}>Stack</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {study.stack.map((item) => (
                      <li
                        className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]"
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="flex flex-col gap-3 border-border border-r border-b p-6">
                <dt className={labelClassName}>Result</dt>
                <dd className="flex flex-col gap-1">
                  <span className="text-5xl tabular-nums leading-none tracking-[-0.05em]">
                    {study.result.value}
                  </span>
                  <span className="text-muted-foreground text-sm tracking-[-0.03em]">
                    {study.result.label}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="border border-border bg-muted p-2 sm:p-4">
              <CaseStudyShot
                sizes="(min-width: 1280px) 1200px, 100vw"
                study={study}
              />
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              <section
                aria-labelledby="problem"
                className="flex flex-col gap-4"
              >
                <ServicesLabel label="Problem" />
                <h2 className="sr-only" id="problem">
                  Problem
                </h2>
                <p className={bodyClassName}>{study.problem}</p>
              </section>
              <section aria-labelledby="built" className="flex flex-col gap-4">
                <ServicesLabel label="What I built" />
                <h2 className="sr-only" id="built">
                  What I built
                </h2>
                <ul className="flex flex-col gap-3">
                  {study.built.map((item) => (
                    <li className={`flex gap-3 ${bodyClassName}`} key={item}>
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-2 shrink-0 bg-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                {study.liveUrl ? (
                  <a
                    className="inline-flex items-center gap-1.5 self-start font-medium font-mono text-foreground text-sm uppercase underline underline-offset-4 transition-colors hover:text-primary"
                    href={study.liveUrl}
                  >
                    See it live
                    <ArrowUpRightIcon className="size-3" />
                  </a>
                ) : null}
              </section>
            </div>

            {study.quote ? (
              <figure className="flex flex-col gap-6 border-border border-t pt-12">
                <blockquote className="max-w-4xl text-balance text-[2rem] leading-[1.2] tracking-[-0.05em] sm:text-[2.5rem]">
                  <p>&ldquo;{study.quote.text}&rdquo;</p>
                </blockquote>
                <figcaption className="flex flex-col gap-1">
                  <span className="font-medium text-base tracking-[-0.03em]">
                    {study.quote.name}
                  </span>
                  <span className="text-muted-foreground text-sm tracking-[-0.03em]">
                    {study.quote.role}
                  </span>
                </figcaption>
              </figure>
            ) : null}
          </Container>
        </article>

        <ServicesCta />
      </main>
      <LandingFooter />
    </>
  );
}
