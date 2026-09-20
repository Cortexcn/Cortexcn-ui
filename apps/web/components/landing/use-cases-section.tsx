import type * as React from "react";

import Image from "next/image";

import { Container, Section, SectionHeading, Surface } from "./primitives";

function LandingPagesIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <rect height={16} rx={2} width={18} x={3} y={4} />
      <path d="M3 9h18" />
      <path d="M7 13h10" />
      <path d="M7 16h6" />
    </svg>
  );
}

function EcommerceIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <circle cx={9} cy={20} r={1} />
      <circle cx={18} cy={20} r={1} />
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20 8H6" />
    </svg>
  );
}

function DashboardsIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path d="M5 20V11" />
      <path d="M12 20V4" />
      <path d="M19 20v-7" />
    </svg>
  );
}

function PortfoliosIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <rect height={18} rx={2} width={18} x={3} y={3} />
      <circle cx={8.5} cy={8.5} r={1.5} />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function BlogsIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function AdminPanelsIcon() {
  return (
    <svg
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <line x1={4} x2={4} y1={21} y2={14} />
      <line x1={4} x2={4} y1={10} y2={3} />
      <line x1={12} x2={12} y1={21} y2={12} />
      <line x1={12} x2={12} y1={8} y2={3} />
      <line x1={20} x2={20} y1={21} y2={16} />
      <line x1={20} x2={20} y1={12} y2={3} />
      <line x1={2} x2={6} y1={14} y2={14} />
      <line x1={10} x2={14} y1={8} y2={8} />
      <line x1={18} x2={22} y1={16} y2={16} />
    </svg>
  );
}

interface UseCase {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const useCases: UseCase[] = [
  {
    title: "Landing pages",
    body: "Hero, features, pricing, and FAQ, assembled and themed.",
    icon: <LandingPagesIcon />,
  },
  {
    title: "E-commerce",
    body: "Product grids, carts, and checkout flows your agent can wire up.",
    icon: <EcommerceIcon />,
  },
  {
    title: "Dashboards",
    body: "Charts, tables, and stat cards from the Cortexcn chart library.",
    icon: <DashboardsIcon />,
  },
  {
    title: "Portfolios",
    body: "A clean personal site in an afternoon.",
    icon: <PortfoliosIcon />,
  },
  {
    title: "Blogs",
    body: "Post layouts, indexes, and reading views.",
    icon: <BlogsIcon />,
  },
  {
    title: "Admin panels",
    body: "Forms, filters, and data views that match.",
    icon: <AdminPanelsIcon />,
  },
];

interface IntegrationLogo {
  name: string;
  content: React.ReactNode;
}

const integrationLogos: IntegrationLogo[] = [
  {
    name: "Next.js",
    content: (
      <Image
        alt="Next.js"
        className="h-6 w-auto opacity-70 dark:invert"
        height={24}
        src="/logos/nextjs.svg"
        width={24}
      />
    ),
  },
  {
    name: "React",
    content: (
      <span className="inline-flex opacity-70">
        <Image
          alt="React"
          className="h-6 w-auto dark:hidden"
          height={24}
          src="/logos/react-light.svg"
          width={27}
        />
        <Image
          alt=""
          aria-hidden
          className="hidden h-6 w-auto dark:block"
          height={24}
          src="/logos/react-dark.svg"
          width={27}
        />
      </span>
    ),
  },
  {
    name: "Tailwind CSS",
    content: (
      <Image
        alt="Tailwind CSS"
        className="h-6 w-auto opacity-70"
        height={24}
        src="/logos/tailwindcss.svg"
        width={40}
      />
    ),
  },
  {
    name: "Vercel",
    content: (
      <span className="inline-flex opacity-70">
        <Image
          alt="Vercel"
          className="h-6 w-auto dark:hidden"
          height={24}
          src="/logos/vercel-light.svg"
          width={28}
        />
        <Image
          alt=""
          aria-hidden
          className="hidden h-6 w-auto dark:block"
          height={24}
          src="/logos/vercel-dark.svg"
          width={28}
        />
      </span>
    ),
  },
  {
    name: "Supabase",
    content: (
      <Image
        alt="Supabase"
        className="h-6 w-auto opacity-70"
        height={24}
        src="/logos/supabase.svg"
        width={24}
      />
    ),
  },
  {
    name: "Stripe",
    content: (
      <Image
        alt="Stripe"
        className="h-6 w-auto opacity-70"
        height={24}
        src="/logos/stripe.svg"
        width={24}
      />
    ),
  },
  {
    name: "TypeScript",
    content: (
      <Image
        alt="TypeScript"
        className="h-6 w-auto opacity-70"
        height={24}
        src="/logos/typescript.svg"
        width={24}
      />
    ),
  },
];

export function UseCasesSection() {
  return (
    <Section id="use-cases">
      <Container>
        <SectionHeading
          description="Start from a prompt and ship a full project."
          eyebrow="Use cases"
          title="Build the whole site, not just a button"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Surface className="flex flex-col gap-4 p-6" key={useCase.title}>
              <div className="flex size-10 items-center justify-center rounded-[10px] border border-border text-muted-foreground">
                {useCase.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-medium text-foreground">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.body}</p>
              </div>
            </Surface>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 border-border/60 border-t pt-10 md:mt-20">
          <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Fits your stack
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {integrationLogos.map((logo) => (
              <span className="inline-flex" key={logo.name}>
                {logo.content}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
