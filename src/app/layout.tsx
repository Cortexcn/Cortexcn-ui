import type { Metadata, Viewport } from "next";

import { META_THEME_COLORS } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import { Providers } from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cortexcn",
  description: "Cortexcn — a studio by Syed Moinuddin.",
  metadataBase: new URL("https://cortexcn.studio"),
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.dark,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
