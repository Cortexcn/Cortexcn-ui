import Link from "next/link";

import { ActionLink, ArrowUpRightIcon, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

interface Service {
  title: string;
  description: string;
  tags: [string, string];
}

const SERVICES: Service[] = [
  {
    title: "Websites",
    description:
      "Company sites and portfolios on Next.js, fast to load and easy to update.",
    tags: ["Next.js", "CMS"],
  },
  {
    title: "Landing pages",
    description:
      "Launch and campaign pages, from the first sketch to the live URL.",
    tags: ["Design", "Launch"],
  },
  {
    title: "E-commerce stores",
    description:
      "Product pages, cart, checkout, and payments, ready for real orders.",
    tags: ["Checkout", "Payments"],
  },
  {
    title: "Web applications",
    description:
      "Dashboards, portals, and SaaS products with sign-in, roles, and data.",
    tags: ["Auth", "Dashboards"],
  },
  {
    title: "Backend and APIs",
    description:
      "APIs, databases, auth, and background jobs that hold up in production.",
    tags: ["APIs", "Databases"],
  },
  {
    title: "Microservices",
    description:
      "Split a monolith or design new services, with queues and clean deploys.",
    tags: ["Queues", "Deploys"],
  },
  {
    title: "AI pipelines",
    description:
      "AI features built into your product: retrieval, agents, and tool calls.",
    tags: ["RAG", "Agents"],
  },
  {
    title: "SEO",
    description:
      "Technical SEO: metadata, structured data, sitemaps, and page speed.",
    tags: ["Schema", "Speed"],
  },
  {
    title: "Research papers",
    description:
      "Support for research papers: code, experiments, figures, and editing.",
    tags: ["Experiments", "Editing"],
  },
  {
    title: "Freelance work",
    description:
      "An extra engineer on your team, for a sprint or on a monthly retainer.",
    tags: ["Sprints", "Retainer"],
  },
];

/** A service tile. The whole tile links to the contact form. */
function ServiceCell({ service, index }: { service: Service; index: number }) {
  return (
    <div className="group relative isolate flex min-h-64 flex-col gap-10 overflow-hidden border-border border-r border-b p-6">
      {/* The same accent sweep as the square buttons on the rest of the page. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-1 -translate-x-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-focus-within:translate-x-0 group-hover:translate-x-0 motion-reduce:transition-none"
      />
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="font-pixel text-5xl text-primary leading-none transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRightIcon className="size-4 text-faint transition-[color,translate] duration-300 group-focus-within:text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-foreground" />
      </div>

      {/* Titles line up across a row; the tags take up any spare height. */}
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-2xl leading-[1.2] tracking-[-0.05em] transition-colors duration-300 group-focus-within:text-primary-foreground group-hover:text-primary-foreground">
          <Link
            className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-foreground/70 focus-visible:after:ring-inset"
            href="/contact"
          >
            <span className="sr-only">Ask about </span>
            {service.title}
          </Link>
        </h3>
        <p className="text-base text-body leading-[1.3] tracking-[-0.05em] transition-colors duration-300 group-focus-within:text-primary-foreground/85 group-hover:text-primary-foreground/85">
          {service.description}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {service.tags.map((tag) => (
          <span
            className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em] transition-colors duration-300 group-focus-within:bg-primary-foreground/15 group-focus-within:text-primary-foreground group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section
      aria-label="Services"
      className="band-dark dark w-full bg-background py-20 text-foreground"
      id="services"
    >
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Services" section="services" />

        <div className="flex flex-col gap-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
            <TypeHeading
              lines={[
                "Need more than components?",
                "Hire the team behind them.",
              ]}
            />
            <div className="flex flex-col items-start gap-5">
              <p className="text-body text-lg leading-[1.4] tracking-[-0.04em]">
                We build for clients too, from a single landing page to a full
                product, an AI pipeline, or a research paper. Every build ships
                with its code in your repo.
              </p>
              <span className="bg-muted px-1 py-0.5 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
                Per project or on retainer
              </span>
            </div>
          </div>

          <div className="grid border-border border-t border-l sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, index) => (
              <ServiceCell
                index={index}
                key={service.title}
                service={service}
              />
            ))}
            <div className="flex min-h-64 flex-col justify-between gap-8 border-border border-r border-b bg-card p-6 sm:col-span-2">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-2xl leading-[1.2] tracking-[-0.05em]">
                  Something else in mind?
                </p>
                <p className="max-w-md text-base text-body leading-[1.3] tracking-[-0.05em]">
                  Tell us what you are building and where you are stuck. We will
                  reply by email.
                </p>
              </div>
              <ActionLink href="/contact" label="Start a project" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
