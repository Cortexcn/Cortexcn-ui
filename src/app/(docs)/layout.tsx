import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";

import { source } from "@/lib/source";
import { CortexcnMark } from "@/components/cortexcn-mark";

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    // The app root layout already provides next-themes, so disable Fumadocs' own.
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        tree={source.pageTree}
        nav={{ title: <CortexcnMark />, url: "/" }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
