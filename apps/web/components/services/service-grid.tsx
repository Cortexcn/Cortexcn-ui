import Link from "next/link";

import {
  ActionLink,
  ArrowUpRightIcon,
  type NumberedSection,
  SectionLabel,
} from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import { cadenceLabel, formatUsd, quoteHref } from "@/lib/service-pricing";
import { SERVICES, type Service, servicePrice } from "@/lib/services";

import { ServicesLabel } from "./services-label";

const onHover =
  "transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground";

/** A service tile. The whole tile opens the contact form with a quote request. */
function ServiceTile({ service, index }: { service: Service; index: number }) {
  const price = servicePrice(service.title);

  return (
    <li className="group relative isolate flex min-h-72 flex-col gap-10 overflow-hidden border-border border-r border-b p-6">
      {/* The same accent sweep as the square buttons across the site. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-1 -translate-x-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within:translate-x-0 group-hover:translate-x-0 motion-reduce:transition-none"
      />
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className={`font-pixel text-5xl text-primary leading-none ${onHover}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRightIcon className="size-4 text-faint transition-[color,translate] duration-300 group-focus-within:text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-foreground motion-reduce:transition-none" />
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className={`font-medium text-2xl leading-[1.2] tracking-[-0.05em] ${onHover}`}
        >
          <Link
            className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-foreground/70 focus-visible:after:ring-inset"
            href={quoteHref(`this service: ${service.title}`)}
          >
            <span className="sr-only">Get a quote for </span>
            {service.title}
          </Link>
        </h3>
        <p className="text-base text-body leading-[1.3] tracking-[-0.05em] transition-colors duration-300 group-focus-within:text-primary-foreground/85 group-hover:text-primary-foreground/85">
          {service.description}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <ul className="flex flex-wrap gap-1.5">
          {service.tags.map((tag) => (
            <li
              className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em] transition-colors duration-300 group-focus-within:bg-primary-foreground/15 group-focus-within:text-primary-foreground group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground"
              key={tag}
            >
              {tag}
            </li>
          ))}
        </ul>
        {price ? (
          <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-border border-t pt-4 transition-colors duration-300 group-focus-within:border-primary-foreground/30 group-hover:border-primary-foreground/30">
            <span className="flex items-baseline gap-1.5">
              <span
                className={`font-medium font-mono text-label-strong text-xs uppercase tracking-[-0.04em] ${onHover}`}
              >
                From
              </span>
              <span
                className={`text-xl tabular-nums leading-none tracking-[-0.05em] ${onHover}`}
              >
                {formatUsd(price.price)}
              </span>
              <span
                className={`text-muted-foreground text-sm tracking-[-0.03em] ${onHover}`}
              >
                {cadenceLabel(price.cadence)}
              </span>
            </span>
            <span
              className={`font-medium font-mono text-label-strong text-xs uppercase tracking-[-0.04em] ${onHover}`}
            >
              {price.timeline}
            </span>
          </p>
        ) : null}
      </div>
    </li>
  );
}

/**
 * Every service as a tile, on the dark band, with a tile for anything else.
 * On the home page it takes a numbered label and the `#services` anchor.
 */
export function ServiceGrid({ section }: { section?: NumberedSection }) {
  return (
    <section
      aria-labelledby="what-we-build"
      className="band-dark dark w-full scroll-mt-(--site-header-height) bg-background py-20 text-foreground md:py-24"
      id={section ? "services" : undefined}
    >
      <Container className="flex flex-col gap-12">
        {section ? (
          <SectionLabel label="What I build" section={section} />
        ) : (
          <ServicesLabel label="What I build" />
        )}

        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
            id="what-we-build"
          >
            From a landing page to a full product.
          </h2>
          <span className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            Starting prices in USD
          </span>
        </div>

        <ul className="grid border-border border-t border-l sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <ServiceTile index={index} key={service.title} service={service} />
          ))}
          <li className="flex min-h-72 flex-col justify-between gap-8 border-border border-r border-b bg-card p-6 sm:col-span-2">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-2xl leading-[1.2] tracking-[-0.05em]">
                Something else in mind?
              </p>
              <p className="max-w-md text-base text-body leading-[1.3] tracking-[-0.05em]">
                Tell me what you are building and where you are stuck. I will
                reply by email.
              </p>
            </div>
            <ActionLink href="/contact" label="Start a project" />
          </li>
        </ul>
      </Container>
    </section>
  );
}
