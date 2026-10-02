import { Toaster } from "@cortexcn/ui/components/sonner";
import { TooltipProvider } from "@cortexcn/ui/components/tooltip";
import { NextProvider } from "fumadocs-core/framework/next";
import type { ReactNode } from "react";
import { DocsLayout } from "@/components/docs/docs-layout";
import { libraryNavLinks } from "@/lib/library-nav-links";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      {/* shadcn/ui tooltips need a provider above them, as in any app that uses them. */}
      <TooltipProvider>
        <DocsLayout
          nav={{
            links: [{ text: "Introduction", url: "/docs" }, ...libraryNavLinks],
          }}
          tree={source.pageTree}
        >
          {children}
        </DocsLayout>
      </TooltipProvider>
      {/* The Sonner, Combobox, and other examples show their toasts here. */}
      <Toaster />
    </NextProvider>
  );
}
