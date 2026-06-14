import Link from "next/link";

import { FOUNDER_URL, MAIN_NAV } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { CortexcnMark } from "@/components/cortexcn-mark";
import { CommandMenu } from "@/components/command-menu";
import { NavDesktop } from "@/components/nav-desktop";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Left: logo + context */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Home"
            className="transition-[scale] ease-out active:scale-[0.98]"
          >
            <CortexcnMark />
          </Link>

          <Separator
            orientation="vertical"
            className="hidden data-vertical:h-4 data-vertical:self-center sm:block"
          />

          <div className="hidden items-center gap-1.5 text-sm sm:flex">
            <span className="text-muted-foreground">Built by</span>
            <a
              href={FOUNDER_URL}
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground link-underline"
            >
              Syed Moinuddin
            </a>
          </div>
        </div>

        {/* Right: nav + actions */}
        <div className="flex items-center gap-2">
          <NavDesktop items={MAIN_NAV} />

          <Separator
            orientation="vertical"
            className="mx-1 hidden data-vertical:h-4 data-vertical:self-center sm:block"
          />

          <div className="flex items-center gap-1 max-sm:**:data-[slot=command-menu-trigger]:hidden">
            <CommandMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
