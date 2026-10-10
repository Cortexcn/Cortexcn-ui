import Link from "next/link";
import type { ReactNode } from "react";

import { UserMenu } from "@/components/auth/user-menu";
import { CortexcnLogo } from "@/components/icons/cortexcn";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

/**
 * The admin dashboard's own shell: a slim top bar instead of the site header,
 * in the default shadcn theme. `isolate` and the background cover the site's
 * fixed dot grid.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-border border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 font-semibold tracking-tight"
              href="/"
            >
              <CortexcnLogo size={20} theme="auto" />
              Cortexcn
            </Link>
            <Badge variant="secondary">Admin</Badge>
            <nav aria-label="Admin" className="flex items-center gap-1 text-sm">
              <Link
                className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href="/admin"
              >
                Users
              </Link>
              <Link
                className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href="/admin/stats"
              >
                Stats
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
