import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsHeader } from "@/components/docs/sidebar/header";
import { DecorativeBorder } from "@/components/docs/layout/decorative-border-svg";
import { cn } from "@/lib/utils";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    // The app root layout already provides next-themes; keep Fumadocs' RootProvider
    // (theme disabled) for its search context, used by the command menu.
    <RootProvider theme={{ enabled: false }}>
      <SidebarProvider>
        <DocsSidebar />
        <div className="w-full bg-sidebar p-0 sm:p-2">
          <DecorativeBorder />
          <div
            className={cn(
              "no-scrollbar overflow-scroll bg-background sm:h-[calc(100vh-1rem)] sm:overscroll-none sm:border",
              // bottom-right XL to echo a mac-style window radius
              "sm:rounded-tl-md sm:rounded-br-xl sm:rounded-bl-md",
            )}
          >
            <SidebarInset>
              <DocsHeader />
              {children}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </RootProvider>
  );
}
