"use client";

import { type FormEvent, useState } from "react";

import { cn } from "@/lib/utils";

import {
  accentButtonClassName,
  Container,
  linkButtonBaseClassName,
  Section,
  Surface,
} from "./primitives";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Placeholder handler. Wire this to your email provider before launch.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <Section id="newsletter">
      <Container>
        <Surface className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-balance font-semibold text-3xl tracking-tight md:text-4xl">
              Stay ahead in AI operations
            </h2>
            <p className="mx-auto max-w-xl text-balance text-muted-foreground">
              Occasional deep dives on automation, analytics, and AI, roughly
              every Friday. No spam. Unsubscribe anytime.
            </p>
          </div>

          {submitted ? (
            <p className="font-medium text-primary">
              Thanks. You are on the list.
            </p>
          ) : (
            <form
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={handleSubmit}
            >
              <input
                aria-label="Email address"
                className="h-12 flex-1 rounded-full border border-border bg-background/60 px-5 text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={email}
              />
              <button
                className={cn(
                  linkButtonBaseClassName,
                  accentButtonClassName,
                  "sm:w-auto",
                )}
                type="submit"
              >
                Get AI tips
              </button>
            </form>
          )}
        </Surface>
      </Container>
    </Section>
  );
}
