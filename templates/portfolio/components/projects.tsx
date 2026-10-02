import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import { site } from "@/config/site";
import { publicPath } from "@/lib/utils";

import { ArrowLink } from "./arrow-link";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

export function Projects() {
  return (
    <section className="px-6 py-24 md:py-32" id="work">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading label="Selected work">Projects</SectionHeading>
          <ArrowLink href={site.projects.allHref}>View all work</ArrowLink>
        </Reveal>
        <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {site.projects.items.map((project, index) => (
            <Reveal delay={(index % 2) * 0.08} key={project.title}>
              <a
                className="group block"
                href={project.href}
                rel="noopener"
                target="_blank"
              >
                <div className="overflow-hidden rounded-3xl border border-border bg-muted">
                  <Image
                    alt={`${project.title} preview`}
                    className="aspect-[29/20] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    height={800}
                    src={publicPath(project.cover)}
                    width={1160}
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-2xl tracking-tight">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <ArrowUpRightIcon className="mt-1 size-5 shrink-0 text-muted-foreground transition-[color,transform] duration-300 group-hover:rotate-45 group-hover:text-foreground" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
