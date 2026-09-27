import Link from "next/link";

import { Container } from "@/components/landing/primitives";
import {
  cadenceLabel,
  formatUsd,
  quoteHref,
  SERVICE_PRICES,
} from "@/lib/service-pricing";

/** Every service on one list, each row linking to the contact form. */
export function ServicePriceList() {
  return (
    <section aria-labelledby="every-service" className="w-full pb-20 md:pb-24">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            className="scroll-mt-[calc(var(--site-header-height)+1.5rem)] font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
            id="every-service"
          >
            Every service
          </h2>
          <span className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            Starting prices in USD
          </span>
        </div>

        <ol className="border-border border-t">
          {SERVICE_PRICES.map((service, index) => (
            <li
              className="group relative isolate overflow-hidden border-border border-b"
              key={service.title}
            >
              {/* The same accent sweep as the square buttons across the site. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-1 -translate-x-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within:translate-x-0 group-hover:translate-x-0 motion-reduce:transition-none"
              />
              <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 px-2 py-6 sm:px-4 lg:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1.5fr)_9rem_12rem]">
                <span
                  aria-hidden="true"
                  className="row-span-2 font-pixel text-3xl text-primary leading-none transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground lg:row-span-1"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-2xl leading-[1.2] tracking-[-0.05em] transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground">
                  <Link
                    className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-foreground/70 focus-visible:after:ring-inset"
                    href={quoteHref(`this service: ${service.title}`)}
                  >
                    <span className="sr-only">Get a quote for </span>
                    {service.title}
                  </Link>
                </h3>
                <ul className="col-start-2 flex flex-wrap gap-1.5 lg:col-start-auto">
                  {service.includes.map((item) => (
                    <li
                      className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em] transition-colors duration-300 group-focus-within:bg-primary-foreground/15 group-focus-within:text-primary-foreground group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="col-start-2 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em] transition-colors duration-300 group-focus-within:text-primary-foreground/80 group-hover:text-primary-foreground/80 lg:col-start-auto">
                  {service.timeline}
                </span>
                <p className="col-start-2 flex items-baseline gap-1.5 lg:col-start-auto lg:justify-end">
                  <span className="font-medium font-mono text-label-strong text-xs uppercase tracking-[-0.04em] transition-colors duration-300 group-focus-within:text-primary-foreground/80 group-hover:text-primary-foreground/80">
                    From
                  </span>
                  <span className="text-3xl tabular-nums leading-none tracking-[-0.05em] transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground">
                    {formatUsd(service.price)}
                  </span>
                  <span className="text-muted-foreground text-sm tracking-[-0.03em] transition-colors duration-300 group-focus-within:text-primary-foreground/80 group-hover:text-primary-foreground/80">
                    {cadenceLabel(service.cadence)}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
