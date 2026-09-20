"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { CortexcnLogo } from "@/components/icons/cortexcn";
import { DiscordIcon } from "@/components/icons/discord";
import { GitHubIcon } from "@/components/icons/github";
import { XIcon } from "@/components/icons/x";

import { Container } from "./primitives";

const GITHUB_URL = "https://github.com/bklit/bklit-ui";
const DISCORD_URL = "https://discord.gg/75s4frfE8X";
const X_URL = "https://x.com";

const columns = [
  {
    title: "Product",
    links: [
      { text: "Components", href: "/docs/components" },
      { text: "Blocks", href: "/blocks" },
      { text: "Showcase", href: "/showcase" },
      { text: "Studio", href: "/studio" },
    ],
  },
  {
    title: "Developers",
    links: [
      { text: "Docs", href: "/docs" },
      { text: "Charts", href: "/charts/area-chart" },
      { text: "GitHub", href: GITHUB_URL, external: true },
    ],
  },
  {
    title: "Explore",
    links: [
      { text: "Features", href: "#features" },
      { text: "How it works", href: "#how-it-works" },
      { text: "Use cases", href: "#use-cases" },
      { text: "FAQ", href: "#faq" },
    ],
  },
] as const;

const socials = [
  { label: "GitHub", href: GITHUB_URL, Icon: GitHubIcon },
  { label: "X", href: X_URL, Icon: XIcon },
  { label: "Discord", href: DISCORD_URL, Icon: DiscordIcon },
];

export function LandingFooter() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <footer className="border-border/60 border-t pt-16 pb-10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link
              className="inline-flex w-fit items-center gap-2.5 no-underline"
              href="/"
            >
              <CortexcnLogo size={28} theme={logoTheme} />
              <span className="font-semibold text-foreground text-lg tracking-tight">
                Cortexcn
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground text-sm">
              Components your AI agent can build with.
            </p>
            <div className="mt-1 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <Link
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-colors hover:text-foreground"
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
                      {...("external" in link && link.external
                        ? { rel: "noopener noreferrer", target: "_blank" }
                        : {})}
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
          <p className="font-mono text-muted-foreground/70 text-xs">
            Built for people who ship fast.
          </p>
        </div>
      </Container>
    </footer>
  );
}
