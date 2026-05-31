import type { Metadata } from "next"

import { fontVariables } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Cortexcn",
  description: "Cortexcn — a studio by Syed Moinuddin.",
  metadataBase: new URL("https://cortexcn.studio"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
