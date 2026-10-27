import { Toaster } from "@cortexcn/ui/components/sonner";
import { TooltipProvider } from "@cortexcn/ui/components/tooltip";
import { NextProvider } from "fumadocs-core/framework/next";
import type { ReactNode } from "react";
import { DocsLayout } from "@/components/docs/docs-layout";
import { docsSidebarGroups } from "@/lib/docs-sidebar-groups";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      {/* shadcn/ui tooltips need a provider above them, as in any app that uses them. */}
      <TooltipProvider>
        <DocsLayout groups={docsSidebarGroups(source.pageTree)}>
          {children}
        </DocsLayout>
      </TooltipProvider>
      {/* The Sonner, Combobox, and other examples show their toasts here. */}
      <Toaster />
    </NextProvider>
  );
}
