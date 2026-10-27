import type { ReactNode } from "react";
import { PageCanvasShell } from "@/components/design/page-canvas-shell";
import { ScrollToTopOnNavigate } from "@/components/docs/scroll-to-top-on-navigate";
import { SiteHeader } from "@/components/docs/site-header";
import {
  LIBRARY_CTA,
  libraryNavItems,
  SITE_CTA,
  siteNavItems,
} from "@/lib/nav-menus";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTopOnNavigate />
      <SiteHeader
        cta={SITE_CTA}
        items={siteNavItems()}
        libraryCta={LIBRARY_CTA}
        libraryItems={libraryNavItems()}
      />
      <div className="flex-1 pt-(--site-header-height)">
        <PageCanvasShell>{children}</PageCanvasShell>
      </div>
    </div>
  );
}
