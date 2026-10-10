import { CLIENT_TESTIMONIALS } from "@/lib/testimonials";

import { SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

/**
 * "What clients say", from `lib/testimonials.ts`. In production it renders
 * nothing until that list holds a real quote; in dev it also shows the
 * placeholders, each marked as one.
 */
export function TestimonialsSection() {
  if (CLIENT_TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full scroll-mt-(--site-header-height) py-20 md:py-24"
      id="testimonials"
    >
      <Container className="flex flex-col gap-12">
        <SectionLabel label="Testimonials" section="testimonials" />
        <div id="testimonials-heading">
          <TypeHeading lines={["What clients say."]} />
        </div>

        <ul className="grid border-border border-t border-l md:grid-cols-2 lg:grid-cols-3">
          {CLIENT_TESTIMONIALS.map((item) => (
            <li
              className="flex flex-col justify-between gap-10 border-border border-r border-b p-6"
              key={item.quote}
            >
              <div className="flex flex-col gap-4">
                {item.placeholder ? (
                  <span className="self-start bg-primary/10 px-1.5 py-1 font-medium font-mono text-primary text-xs uppercase leading-none">
                    Placeholder, dev only
                  </span>
                ) : null}
                <blockquote className="text-foreground text-xl leading-[1.35] tracking-[-0.04em]">
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
              </div>
              <div className="flex flex-col gap-1 border-border border-t pt-4">
                <p className="font-medium text-base tracking-[-0.03em]">
                  {item.url ? (
                    <a
                      className="underline underline-offset-4 transition-colors hover:text-primary"
                      href={item.url}
                      rel="noopener"
                      target="_blank"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </p>
                <p className="text-muted-foreground text-sm tracking-[-0.03em]">
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </p>
                {item.project ? (
                  <p className="mt-2 self-start bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
                    {item.project}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
