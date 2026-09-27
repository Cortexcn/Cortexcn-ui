import { site } from "@/config/site";

import { ArrowLink } from "./arrow-link";
import { Reveal } from "./reveal";

export function Bio() {
  return (
    <section className="border-border border-t px-6 py-24 md:py-32" id="about">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <Reveal>
          <h2 className="font-semibold text-6xl tracking-tight md:text-8xl">
            {site.bio.greeting}
          </h2>
        </Reveal>
        <div className="flex flex-col gap-8">
          <Reveal delay={0.05}>
            <p className="text-balance text-2xl leading-snug tracking-tight md:text-3xl">
              {site.bio.intro}
            </p>
          </Reveal>
          <Reveal
            className="flex flex-col gap-4 text-muted-foreground md:text-lg"
            delay={0.1}
          >
            {site.bio.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <ArrowLink href={site.bio.cta.href}>{site.bio.cta.label}</ArrowLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
