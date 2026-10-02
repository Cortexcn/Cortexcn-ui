import Link from "next/link";

import { CortexcnLogo } from "@/components/icons/cortexcn";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { AUTHOR } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";

import { Container } from "./primitives";

interface FooterLink {
  label: string;
  href: string;
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Library",
    links: [
      { label: "Components", href: "/docs/components" },
      { label: "Charts", href: "/charts/area-chart" },
      { label: "Blocks", href: "/blocks" },
      { label: "AI Assistant", href: "/blocks?category=ai-assistant" },
      { label: "Backgrounds", href: "/docs/components/light-speed" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Changelog", href: "/changelog" },
      { label: "Registry index", href: "/r/registry.json" },
      { label: "llms.txt", href: "/llms.txt" },
    ],
  },
  {
    title: "Cortexcn",
    links: [
      { label: "Pricing", href: "#pricing" },
      { label: "Services", href: `${SITE_URL}/` },
      { label: "Contact", href: `${SITE_URL}/contact` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: `${SITE_URL}/privacy` },
      { label: "Terms", href: `${SITE_URL}/terms` },
      { label: "Refunds", href: `${SITE_URL}/refunds` },
    ],
  },
];

/** Ends in a file extension, like /llms.txt or /r/registry.json. */
const FILE_PATH_RE = /\.\w+$/;

/** Static files and other domains need a plain anchor; pages get client navigation. */
function FooterAnchor({ link }: { link: FooterLink }) {
  const className = "text-body text-sm transition-colors hover:text-foreground";
  const isPage = link.href.startsWith("/") && !FILE_PATH_RE.test(link.href);

  return isPage ? (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  ) : (
    <a className={className} href={link.href}>
      {link.label}
    </a>
  );
}

export function LibraryFooter() {
  return (
    <footer className="border-border border-t">
      <Container className="grid gap-12 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] md:py-16">
        <div className="flex flex-col items-start gap-4">
          <Link className="flex items-center gap-2.5" href="/">
            <CortexcnLogo size={24} theme="auto" />
            <span className="font-medium text-lg tracking-[-0.02em]">
              Cortexcn
            </span>
          </Link>
          <p className="max-w-xs text-body text-sm leading-[1.5]">
            React components, charts, and blocks for shadcn/ui. Install them
            with the CLI or your AI agent, and own the code.
          </p>
          <a
            className="text-foreground text-sm underline-offset-4 hover:underline"
            href={`mailto:${CONTACT_EMAIL}`}
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {COLUMNS.map((column) => (
            <div className="flex flex-col gap-3" key={column.title}>
              <h2 className="font-medium text-sm">{column.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </Container>

      <Container className="flex flex-col gap-2 border-border border-t py-6 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© Cortexcn 2026. All rights reserved.</p>
        <p>
          Built by{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href={AUTHOR.url}
          >
            {AUTHOR.name}
          </a>
        </p>
      </Container>
    </footer>
  );
}
