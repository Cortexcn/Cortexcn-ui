import { Fragment } from "react";

import { site } from "@/config/site";

import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Services() {
  return (
    <section className="px-6 py-24 md:py-32" id="services">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading label="What I do">Services</SectionHeading>
        </Reveal>
        <ul className="mt-14 border-border border-t">
          {site.services.map((service, index) => (
            <li key={service.title}>
              <Reveal
                className="group grid gap-3 border-border border-b py-7 md:grid-cols-[4rem_1fr_auto] md:items-center md:gap-8"
                delay={index * 0.05}
              >
                <span className="font-mono text-muted-foreground text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-semibold text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-2 md:text-4xl">
                  {service.title}
                </h3>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                  {service.tags.map((tag, tagIndex) => (
                    <Fragment key={tag}>
                      {tagIndex > 0 ? (
                        <span
                          aria-hidden="true"
                          className="size-1 rounded-full bg-foreground/50"
                        />
                      ) : null}
                      <span>{tag}</span>
                    </Fragment>
                  ))}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
