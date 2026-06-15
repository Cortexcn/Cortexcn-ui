"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { MAIN_NAV } from "@/config/site";
import { cn } from "@/lib/utils";
import { CortexcnMark } from "@/components/cortexcn-mark";
import { CommandMenu } from "@/components/command-menu";
import { NavDesktop } from "@/components/nav-desktop";
import { ThemeToggle } from "@/components/theme-toggle";

// Floating-surface styles for the pill: a rounded, blurred bar on scroll.
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
      {/* Full width at the top; collapses to a centered, compact bar on scroll. */}
      <div
        className={cn(
          "mx-auto flex w-full items-center gap-3 px-4 transition-[max-width] duration-300 ease-out sm:px-6",
          scrolled ? "max-w-5xl" : "max-w-none",
        )}
      >
        {/* Pill: logo (left) · nav + theme toggle (right). */}
        <div
          className={cn(
            "flex h-14 flex-1 items-center justify-between gap-3 px-4",
            FLOAT_BASE,
            scrolled ? FLOAT_ON : FLOAT_OFF,
          )}
        >
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center transition-[scale] ease-out active:scale-[0.98]"
          >
            <CortexcnMark />
          </Link>

          <div className="flex items-center gap-1">
            <NavDesktop items={MAIN_NAV} />
            <ThemeToggle />
          </div>
        </div>

        {/* Search: standalone, no background of its own. */}
        <div className="flex h-14 items-center max-sm:**:data-[slot=command-menu-trigger]:hidden **:data-[slot=command-menu-trigger]:border-transparent **:data-[slot=command-menu-trigger]:bg-transparent **:data-[slot=command-menu-trigger]:shadow-none">
          <CommandMenu />
        </div>
      </div>
    </header>
  );
}
