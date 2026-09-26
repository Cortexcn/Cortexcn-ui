import Link from "next/link";

import { CortexcnLogo } from "@/components/icons/cortexcn";
import { XIcon } from "@/components/icons/x";

import { Container } from "./primitives";

const X_URL = "https://x.com";
const LINKEDIN_URL = "https://linkedin.com";
const INSTAGRAM_URL = "https://instagram.com";

const columns = [
  {
    title: "Navigation",
    links: [
      { text: "About", href: "#problem" },
      { text: "Services", href: "#services" },
      { text: "Process", href: "#process" },
      { text: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Explore",
    links: [
      { text: "Impact", href: "#impact" },
      { text: "Reviews", href: "#reviews" },
      { text: "FAQs", href: "#faq" },
      { text: "Contact", href: "#contact" },
    ],
  },
] as const;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

const socials = [
  { label: "X (Twitter)", href: X_URL, Icon: XIcon },
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: LinkedInIcon },
  { label: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
];

export function LandingFooter() {
  return (
    <footer className="border-border/60 border-t pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link
              className="inline-flex w-fit items-center gap-2.5 no-underline"
              href="/"
            >
              <CortexcnLogo size={28} theme="dark" />
              <span className="font-semibold text-foreground text-lg tracking-tight">
                Cortexcn
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground text-sm">
              Structured AI systems for teams that value clarity, logic, and
              scale.
            </p>
            <div className="mt-1 flex flex-col gap-1 text-sm">
              <span className="text-foreground">hello@cortexcn.dev</span>
              <span className="text-muted-foreground text-xs">
                Replace contact details before launch
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <Link
                  aria-label={label}
                  className="flex size-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div className="flex flex-col gap-4" key={column.title}>
              <p className="font-medium font-mono text-muted-foreground/60 text-xs uppercase tracking-widest">
                {column.title}
              </p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {column.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      className="text-muted-foreground text-sm no-underline transition-colors hover:text-foreground"
                      href={link.href}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-border/60 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Cortexcn. All rights reserved.
          </p>
          <Link
            className="text-muted-foreground text-sm no-underline transition-colors hover:text-foreground"
            href="#"
          >
            Terms of Service
          </Link>
        </div>
      </Container>
    </footer>
  );
}
