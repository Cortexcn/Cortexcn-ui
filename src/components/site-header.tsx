"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { FOUNDER_URL, MAIN_NAV } from "@/config/site";
import { cn } from "@/lib/utils";
import { CortexcnMark } from "@/components/cortexcn-mark";
import { CommandMenu } from "@/components/command-menu";
import { NavDesktop } from "@/components/nav-desktop";
import { ThemeToggle } from "@/components/theme-toggle";

// Shared floating-surface styles for the pill + the search/theme cluster.
const FLOAT_BASE =
  "transition-[background-color,border-color,border-radius,box-shadow] duration-300 ease-out";
const FLOAT_ON =
  "rounded-2xl border border-border bg-background/85 shadow-lg backdrop-blur-md";
const FLOAT_OFF =
  "rounded-none border border-transparent bg-transparent shadow-none";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,padding] duration-300 ease-out",
        scrolled
          ? "border-b border-transparent bg-transparent py-2.5"
          : "border-b border-border bg-background/80 py-0 backdrop-blur-md",
      )}
    >
      <div className="flex w-full items-center gap-3 px-4 sm:px-6">
        {/* Pill: logo (far left) · built by (center) · nav (far right).
            Collapses into a rounded, floating bar on scroll. */}
        <div
          className={cn(
            "grid h-14 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4",
            FLOAT_BASE,
            scrolled ? FLOAT_ON : FLOAT_OFF,
          )}
        >
          {/* Left: logo */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Home"
              className="transition-[scale] ease-out active:scale-[0.98]"
            >
              <CortexcnMark />
            </Link>
          </div>

          {/* Center: built by */}
          <div className="hidden items-center justify-center gap-1.5 text-sm sm:flex">
            <span className="text-muted-foreground">Built by</span>
            <a
              href={FOUNDER_URL}
              target="_blank"
              rel="noopener"
              className="link-underline font-medium text-foreground"
            >
              Syed Moinuddin
            </a>
          </div>

          {/* Right: nav */}
          <div className="flex items-center justify-end">
            <NavDesktop items={MAIN_NAV} />
          </div>
        </div>

        {/* Outside the pill: search + theme. Gets its own floating surface on
            scroll so it stays visible against the page behind it. */}
        <div
          className={cn(
            "flex h-14 items-center gap-1 px-1.5",
            FLOAT_BASE,
            scrolled ? FLOAT_ON : FLOAT_OFF,
            "max-sm:**:data-[slot=command-menu-trigger]:hidden",
          )}
        >
          <CommandMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
