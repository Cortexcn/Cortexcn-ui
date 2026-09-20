import { GithubStatsProvider } from "@/components/providers/github-stats-provider";
import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Instrument_Serif, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";
import { ChartThemeProvider } from "@/components/chart-theme/chart-theme-provider";
import { ChartThemeScript } from "@/components/chart-theme/chart-theme-script";
import { SiteLeftDotGrid } from "@/components/design/site-left-dot-grid";
import { DocsSearchDialog } from "@/components/docs/docs-search-dialog";
import { getChartThemeIdFromCookie } from "@/lib/chart-theme-cookie.server";
import { getOpenPanelClientId } from "@/lib/openpanel-env";
import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

/** Paired serif until `geist/font/serif` ships in the geist package. */
const geistSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

/** High-contrast display serif for large editorial headings (AgentLab-style hero). */
const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const SITE_NAME = "Cortexcn";
const SITE_TITLE = "Cortexcn - Components your AI agent can build with";
const SITE_DESCRIPTION =
  "Cortexcn connects your AI coding agent to a real component library over MCP. Pick a component, describe the page, and your agent ships it. Built for freelancers, developers, and startups who move fast.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const openPanelClientId = getOpenPanelClientId();
  const chartThemeId = await getChartThemeIdFromCookie();

  return (
    <html
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        geistSerif.variable,
        instrumentSerif.variable,
        GeistSans.className,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative flex min-h-screen flex-col">
        <ChartThemeScript />
        <SiteLeftDotGrid />
        {openPanelClientId ? (
          <OpenPanelComponent
            apiUrl="/api/op"
            clientId={openPanelClientId}
            scriptUrl="/api/op/op1.js"
            trackAttributes
            trackOutgoingLinks
            trackScreenViews
          />
        ) : null}
        <GithubStatsProvider>
          <RootProvider
            search={{
              SearchDialog: DocsSearchDialog,
              options: {
                api: "/api/search",
              },
            }}
            theme={{
              attribute: "class",
              defaultTheme: "system",
              disableTransitionOnChange: true,
              enableSystem: true,
            }}
          >
            <ChartThemeProvider initialThemeId={chartThemeId}>
              {children}
            </ChartThemeProvider>
          </RootProvider>
        </GithubStatsProvider>
      </body>
    </html>
  );
}
