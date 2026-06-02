import Link from "next/link";

import { MAIN_NAV } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { CortexcnMark } from "@/components/cortexcn-mark";
import { CommandMenu } from "@/components/command-menu";
import { NavDesktop } from "@/components/nav-desktop";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-12 items-center justify-between gap-2 border-x border-line px-2 sm:gap-4 md:max-w-3xl">
        <Link
          className="transition-[scale] ease-out active:scale-[0.98]"
          href="/"
          aria-label="Home"
        >
          <CortexcnMark />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center *:first:mr-2 max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <CommandMenu />
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-4 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
