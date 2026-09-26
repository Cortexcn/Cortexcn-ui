"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { CortexcnLogo } from "@/components/icons/cortexcn";

import { ArrowUpRightIcon } from "./kit";
import { Container } from "./primitives";

const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Introduction", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  { label: "Components", href: "/docs/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Charts", href: "/charts/area-chart" },
  { label: "Theming", href: "/docs/theming" },
  { label: "Studio", href: "/studio" },
];

type ResourceIcon = "docs" | "registry" | "agents" | "portfolio";

const RESOURCES: { label: string; href: string; icon: ResourceIcon }[] = [
  { label: "Documentation", href: "https://ui.cortexcn.dev", icon: "docs" },
  {
    label: "Registry",
    href: "https://ui.cortexcn.dev/r/registry.json",
    icon: "registry",
  },
  { label: "llms.txt", href: "/llms.txt", icon: "agents" },
  { label: "Portfolio", href: "https://syedmoinuddin.com", icon: "portfolio" },
];

const RESOURCE_ICON_PATHS: Record<ResourceIcon, string> = {
  docs: "M4 2.5h8.5v15H4zM6.5 6h4M6.5 9h4M6.5 12h2.5",
  registry: "M3 5.5l7-3.5 7 3.5-7 3.5zM3 10l7 3.5 7-3.5M3 14.5l7 3.5 7-3.5",
  agents: "M5 2.5h7l3 3v12H5zM12 2.5v3h3M7.5 10h5M7.5 13h5",
  portfolio:
    "M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15zM2.5 10h15M10 2.5c2.2 2.4 2.2 12.6 0 15M10 2.5c-2.2 2.4-2.2 12.6 0 15",
};

/** Sites and people whose craft shaped Cortexcn. */
const INSPIRATIONS = [
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
  { name: "Vercel", href: "https://vercel.com" },
  { name: "Evil Charts", href: "https://evilcharts.com" },
  { name: "Devouring Details", href: "https://devouringdetails.com" },
  { name: "Skiper UI", href: "https://skiper-ui.com" },
  { name: "Making Software", href: "https://www.makingsoftware.com" },
  { name: "shadcncraft", href: "https://shadcncraft.com" },
];

function Newsletter() {
  const [note, setNote] = useState<string | null>(null);

  // Signups are not wired to a mailing list yet, so say so instead of faking it.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNote("Email updates open at launch. Check back soon.");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-medium text-2xl leading-[1.3] tracking-[-0.05em]">
          <span className="text-primary">@</span> Stay in the loop.
        </p>
        <p className="max-w-100 text-body text-lg leading-[1.3] tracking-[-0.05em]">
          New components, blocks, and release notes. One short email when
          something ships.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <form
          className="flex h-12 w-full max-w-105 items-center bg-muted p-1"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="footer-email">
            Email
          </label>
          <input
            autoComplete="email"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-foreground tracking-[-0.05em] outline-none placeholder:text-faint"
            id="footer-email"
            name="email"
            placeholder="Enter your email"
            required
            type="email"
          />
          <button
            className="h-10 shrink-0 bg-foreground px-3 font-mono font-semibold text-background text-base uppercase tracking-[-0.05em] transition-colors hover:bg-primary hover:text-primary-foreground"
            type="submit"
          >
            Join
          </button>
        </form>
        <p aria-live="polite" className="min-h-5 text-muted-foreground text-sm">
          {note}
        </p>
      </div>
    </div>
  );
}

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="font-semibold text-sm uppercase leading-[1.3] tracking-[-0.05em]">
      {children}
    </p>
  );
}

export function LandingFooter() {
  return (
    <footer className="w-full border-border border-t bg-background">
      <Container>
        <div className="grid border-border border-b lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-16 border-border border-x p-6 sm:p-10">
            <Newsletter />
            <div className="flex items-center gap-4">
              <CortexcnLogo
                className="size-16 rounded-[10px] sm:size-22"
                size={88}
                theme="auto"
              />
              <span className="font-medium text-[3.5rem] leading-none tracking-[-0.06em] sm:text-[5.5rem]">
                Cortexcn
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-border border-x border-t lg:border-t-0 lg:border-l-0">
            <div className="grid gap-2 border-border border-b sm:grid-cols-2">
              <div className="flex flex-col gap-4 border-border p-6 sm:border-r sm:p-10">
                <FooterHeading>Pages</FooterHeading>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {PAGE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="text-base text-body leading-[1.3] tracking-[-0.05em] transition-colors hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4 border-border border-t p-6 sm:border-t-0 sm:border-l sm:p-10">
                <FooterHeading>Resources</FooterHeading>
                <ul className="flex flex-col gap-2">
                  {RESOURCES.map((resource) => (
                    <li key={resource.href}>
                      <a
                        className="group flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]"
                        href={resource.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <svg
                          aria-hidden="true"
                          className="size-5 shrink-0 text-body"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.25"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d={RESOURCE_ICON_PATHS[resource.icon]} />
                        </svg>
                        <span
                          aria-hidden="true"
                          className="h-px min-w-6 flex-1 border-border border-t border-dashed"
                        />
                        <span className="transition-colors group-hover:text-primary">
                          {resource.label}
                        </span>
                        <ArrowUpRightIcon className="size-3.5 shrink-0 text-faint transition-colors group-hover:text-primary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 border-border border-t p-6 sm:p-10">
              <FooterHeading>Inspired by</FooterHeading>
              <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {INSPIRATIONS.map((item, index) => (
                  <li key={item.href}>
                    <a
                      className="group flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]"
                      href={item.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="w-5 shrink-0 font-medium font-mono text-label-weak text-xs tracking-[-0.04em]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="transition-colors group-hover:text-primary">
                        {item.name}
                      </span>
                      <ArrowUpRightIcon className="size-3.5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-10 text-sm leading-[1.3] tracking-[-0.05em] md:flex-row md:items-center md:justify-between">
          <p>© Cortexcn 2026. All rights reserved.</p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              href="/docs"
            >
              Docs
            </Link>
            <span>/</span>
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              href="/docs/components"
            >
              Components
            </Link>
          </p>
          <a
            className="flex items-center gap-2 text-muted-foreground"
            href="https://syedmoinuddin.com"
            rel="noreferrer"
            target="_blank"
          >
            Created by
            <span className="flex size-6 items-center justify-center rounded-full bg-foreground font-semibold text-[10px] text-background">
              SM
            </span>
            <span className="font-semibold text-foreground">
              Syed Moinuddin
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
