import { Doto, Space_Mono } from "next/font/google"
import { GeistPixelSquare } from "geist/font/pixel"

import { cn } from "@/lib/utils"

const fontDoto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
})

const fontSpaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const fontVariables = cn(
  GeistPixelSquare.variable,
  fontDoto.variable,
  fontSpaceMono.variable,
  "[--font-sans:var(--font-space-mono)]",
  "[--font-mono:var(--font-space-mono)]"
)
