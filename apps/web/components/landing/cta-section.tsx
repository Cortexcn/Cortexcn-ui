"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { cn } from "@/lib/utils";

import {
  accentButtonClassName,
  Container,
  linkButtonBaseClassName,
  Section,
} from "./primitives";

const inputClassName =
  "h-12 w-full rounded-[12px] border border-border bg-background/60 px-4 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50";

export function CtaSection() {
  const [submitted, setSubmitted] = useState(false);

  // Placeholder handler. Wire this to your form backend or CRM before launch.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Section id="contact">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-6 md:p-12">
          {/* Warm glow echoing the hero artwork. */}
          <div
            aria-hidden
            className="-z-0 -translate-x-1/2 pointer-events-none absolute top-0 left-1/2 h-[320px] w-[720px] max-w-none rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--syntiq-accent)_22%,transparent),transparent)] blur-3xl"
          />

          <div className="relative grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="text-balance font-semibold text-3xl leading-[1.1] tracking-[-0.02em] md:text-4xl">
                Ready to build AI that actually works?
              </h2>
              <p className="text-balance text-muted-foreground md:text-lg">
                Let&apos;s design a structured AI system built around your
                workflows, tools, and business goals. No chaos, no throwaway
                experiments.
              </p>
              <p className="text-muted-foreground text-sm">
                We reply within 24 hours. Every conversation is confidential.
              </p>

              <dl className="mt-2 flex flex-col gap-3 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-foreground">hello@cortexcn.dev</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Placeholder</dt>
                  <dd className="text-foreground">
                    Replace contact details before launch
                  </dd>
                </div>
              </dl>
            </div>

            {submitted ? (
              <div className="flex items-center justify-center rounded-[16px] border border-border bg-background/40 p-8 text-center">
                <p className="text-foreground">
                  Thanks. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <input
                  aria-label="Full name"
                  className={inputClassName}
                  placeholder="Full name"
                  required
                  type="text"
                />
                <input
                  aria-label="Work email"
                  className={inputClassName}
                  placeholder="Work email"
                  required
                  type="email"
                />
                <input
                  aria-label="Company name"
                  className={inputClassName}
                  placeholder="Company name"
                  type="text"
                />
                <textarea
                  aria-label="Tell us about your workflows or challenges"
                  className="min-h-28 w-full rounded-[12px] border border-border bg-background/60 px-4 py-3 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Tell us about your workflows or challenges"
                />
                <button
                  className={cn(linkButtonBaseClassName, accentButtonClassName)}
                  type="submit"
                >
                  Get started
                </button>
                <p className="text-muted-foreground text-xs">
                  By submitting, you agree to our{" "}
                  <Link className="text-foreground underline" href="#">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link className="text-foreground underline" href="#">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
