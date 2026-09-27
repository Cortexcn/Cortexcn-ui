import { ActionLink } from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import { ADD_ONS, PRICING_STEPS } from "@/lib/service-pricing";

/** Add-ons, how a project runs from quote to handover, and a way to start. */
export function PricingDetails() {
  return (
    <section
      aria-label="Add-ons and how it works"
      className="band-dark dark w-full bg-background py-20 text-foreground"
    >
      <Container className="flex flex-col gap-20">
        <div className="flex flex-col gap-8">
          <h2 className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl">
            Add-ons
          </h2>
          {/* Each card spans three shared rows (price, name, detail), so names
              and details line up across a row even when one of them wraps. */}
          <ul className="grid border-border border-t border-l sm:grid-cols-2 lg:grid-cols-5">
            {ADD_ONS.map((addOn) => (
              <li
                className="row-span-3 grid grid-rows-subgrid gap-y-1.5 border-border border-r border-b p-6"
                key={addOn.name}
              >
                <p className="mb-14 flex flex-wrap items-baseline gap-x-1 font-pixel text-primary leading-none">
                  <span className="text-4xl">{addOn.price}</span>
                  {addOn.unit ? (
                    <span className="text-xl">{addOn.unit}</span>
                  ) : null}
                </p>
                <h3 className="font-medium text-xl leading-[1.2] tracking-[-0.05em]">
                  {addOn.name}
                </h3>
                <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
                  {addOn.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl">
            How it works
          </h2>
          <ol className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {PRICING_STEPS.map((step, index) => (
              <li
                className="row-span-3 grid grid-rows-subgrid gap-y-1.5 bg-background p-6"
                key={step.title}
              >
                <span className="mb-16 font-medium font-mono text-label-strong text-sm uppercase leading-[1.3] tracking-[-0.04em]">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-xl leading-[1.2] tracking-[-0.05em]">
                  {step.title}
                </h3>
                <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col items-start justify-between gap-8 border border-border bg-card p-6 sm:p-10 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-3xl leading-[1.2] tracking-[-0.05em]">
              Have a project in mind?
            </p>
            <p className="max-w-lg text-body text-lg leading-[1.3] tracking-[-0.05em]">
              Tell us what you are building. You get a written quote with scope,
              price, and timeline.
            </p>
          </div>
          <ActionLink href="/contact" label="Get a quote" />
        </div>
      </Container>
    </section>
  );
}
