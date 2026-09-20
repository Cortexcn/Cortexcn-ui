import Link from "next/link";

import { cn } from "@/lib/utils";

import { Container, linkButtonBaseClassName, Section } from "./primitives";

export function CtaSection() {
  return (
    <Section id="cta">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] bg-foreground px-6 py-16 text-center text-background md:px-16 md:py-24">
          {/* Soft violet wash echoing the hero artwork. */}
          <div
            aria-hidden
            className="-z-0 -translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-[320px] w-[720px] max-w-none rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--color-violet-500)_30%,transparent),transparent)] blur-2xl"
          />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance font-display font-normal text-4xl leading-[1.05] tracking-[-0.02em] md:text-5xl">
              Start building with your agent
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-background/70">
              Connect Cortexcn in one command and ship your next page today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className={cn(
                  linkButtonBaseClassName,
                  "w-full bg-background text-foreground hover:bg-background/90 sm:w-auto",
                )}
                href="/docs"
              >
                Get started
              </Link>
              <Link
                className={cn(
                  linkButtonBaseClassName,
                  "w-full border-background/30 bg-transparent text-background hover:bg-background/10 sm:w-auto",
                )}
                href="/docs/components"
              >
                Browse components
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
