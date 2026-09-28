import { Painting } from "./painting";
import { Container, PrimaryLink, SecondaryLink } from "./primitives";
import { HeadingWords } from "./reveal";

/** The closing call to action, on a painted panel. */
export function CtaSection() {
  return (
    <section className="pb-20 md:pb-28" id="get-started">
      <Container>
        <div className="relative isolate overflow-hidden rounded-2xl border border-border px-6 py-20 text-center md:py-28">
          <Painting
            art="meadow-grass"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
          {/* A veil over the painting keeps the copy readable in both themes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/55 dark:bg-background/70"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="font-light font-sentient text-[38px] leading-[1.05] tracking-[-0.05em] md:text-[40px] lg:text-[48px]">
              <HeadingWords
                breakLines
                lines={[
                  { text: "Ship your next screen" },
                  { text: "from real components.", muted: true },
                ]}
                mutedClassName="text-body"
              />
            </h2>
            <p className="mt-6 max-w-md text-base text-body leading-[1.45] md:text-lg">
              Pick a component, install it with one command, and make it yours
              in your own code.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PrimaryLink href="/docs/components">
                Browse components
              </PrimaryLink>
              <SecondaryLink href="/docs/installation">
                Read the docs
              </SecondaryLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
