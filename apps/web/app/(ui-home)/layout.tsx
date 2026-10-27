import type { ReactNode } from "react";

import { ScrollToTopOnNavigate } from "@/components/docs/scroll-to-top-on-navigate";
import { SiteHeader } from "@/components/docs/site-header";
import { onest, SENTIENT_STYLESHEET } from "@/components/ui-home/fonts";
import { LibraryFooter } from "@/components/ui-home/library-footer";
import { LIBRARY_CTA, libraryNavItems } from "@/lib/nav-menus";
import { cn } from "@/lib/utils";

/** Keeps revealed content visible for visitors without JavaScript. */
const NO_SCRIPT_CSS =
  ".ui-home [data-reveal] .ui-word, .ui-home .ui-rise { opacity: 1 !important; transform: none !important; filter: none !important; }";

export default function LibraryHomeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // Own theme scope (see `.ui-home` in globals.css), so the services landing
    // and the docs keep theirs. `isolate` lifts the page over the fixed dot grid.
    <div
      className={cn(
        "ui-home relative isolate flex min-h-screen flex-col overflow-x-clip bg-background text-foreground",
        onest.variable,
      )}
    >
      <link href={SENTIENT_STYLESHEET} precedence="default" rel="stylesheet" />
      <ScrollToTopOnNavigate />
      {/* The page is served at `/` through a rewrite, so the URL cannot pick the style. */}
      <SiteHeader cta={LIBRARY_CTA} items={libraryNavItems()} variant="plain" />
      <div className="flex-1">{children}</div>
      <LibraryFooter />
      <noscript>
        <style>{NO_SCRIPT_CSS}</style>
      </noscript>
    </div>
  );
}
