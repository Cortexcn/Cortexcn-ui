import { GithubStatsProvider } from "@/components/providers/github-stats-provider";
import "./globals.css";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { RootProvider } from "fumadocs-ui/provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import type { ReactNode } from "react";
import { ChartThemeProvider } from "@/components/chart-theme/chart-theme-provider";
import { ChartThemeScript } from "@/components/chart-theme/chart-theme-script";
import { SiteLeftDotGrid } from "@/components/design/site-left-dot-grid";
import { DocsSearchDialog } from "@/components/docs/docs-search-dialog";
import { PageScrollbar } from "@/components/smooth-scroll/page-scrollbar";
import { SmoothScroll } from "@/components/smooth-scroll/smooth-scroll";
import { getChartThemeIdFromCookie } from "@/lib/chart-theme-cookie.server";
import { getOpenPanelClientId } from "@/lib/openpanel-env";
import {
  AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

/*
 * Only the Square cut of Geist Pixel is used (landing headlines). Loaded
 * directly because `geist/font/pixel` registers, and preloads, all five cuts.
 */
const geistPixelSquare = localFont({
  src: "../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
  display: "swap",
  fallback: ["Geist Mono", "ui-monospace", "monospace"],
  adjustFontFallback: false,
});

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

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
/** Cloudflare Web Analytics: visits and page views, read by the portfolio's Insights. */
const cloudflareBeaconToken =
  process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN;
const bingVerification = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [AUTHOR],
  creator: AUTHOR.name,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    url: `${SITE_URL}/`,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // Search Console and Bing Webmaster verification tokens, set per deployment.
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification
      ? { other: { "msvalidate.01": bingVerification } }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  colorScheme: "light dark",
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
        geistPixelSquare.variable,
        GeistSans.className,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body className="relative flex min-h-screen flex-col">
        <ChartThemeScript />
        <SmoothScroll />
        {cloudflareBeaconToken ? (
          <Script
            data-cf-beacon={JSON.stringify({ token: cloudflareBeaconToken })}
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
          />
        ) : null}
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
        <PageScrollbar />
      </body>
    </html>
  );
}
