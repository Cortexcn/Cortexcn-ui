import { ActionLink } from "@/components/landing/kit";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Container } from "@/components/landing/primitives";
import { TitleBand } from "@/components/landing/title-band";
import { WorkCard } from "@/components/landing/work-section";
import { ServicesCta } from "@/components/services/services-cta";
import { pageMetadata } from "@/lib/seo";
import { WORK } from "@/lib/work";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Case studies of sites and products I built with Cortexcn: who they were for, the problem, what I built, the stack, and the result.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Work" />
        <section aria-label="Case studies" className="w-full py-20 md:py-24">
          <Container className="flex flex-col gap-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
              <p className="max-w-2xl text-balance text-[2rem] leading-[1.15] tracking-[-0.05em] sm:text-[2.5rem]">
                Built with Cortexcn.{" "}
                <span className="text-muted-foreground">
                  Who each project was for, the problem, what I built, and the
                  one number that changed.
                </span>
              </p>
              <ActionLink
                className="lg:justify-self-end"
                href="/contact"
                label="Start a project"
              />
            </div>
            <ul className="grid border-border border-t border-l md:grid-cols-2 lg:grid-cols-3">
              {WORK.map((study) => (
                <WorkCard key={study.slug} study={study} />
              ))}
            </ul>
          </Container>
        </section>
        <ServicesCta />
      </main>
      <LandingFooter />
    </>
  );
}
