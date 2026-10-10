import { ActionLink } from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import { CONTACT_EMAIL } from "@/lib/contact-details";

/** Closing band: one way to start, and the email for anyone who prefers it. */
export function ServicesCta() {
  return (
    <section
      aria-labelledby="start-a-project"
      className="band-dark dark w-full bg-background py-20 text-foreground md:py-24"
    >
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <h2
            className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
            id="start-a-project"
          >
            Have a project in mind?
          </h2>
          <p className="text-body text-lg leading-[1.4] tracking-[-0.04em]">
            Tell me what you are building and where you are stuck. I reply by
            email with next steps.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4">
          <ActionLink href="/contact" label="Start a project" />
          <a
            className="font-medium font-mono text-body text-sm underline underline-offset-4 transition-colors hover:text-primary"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </Container>
    </section>
  );
}
