import {
  Doto,
  Geist,
  Inter,
  JetBrains_Mono,
  Space_Mono,
} from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";

import { cn } from "@/lib/utils";

// Primary docs typography (evilcharts-style visual clone).
const fontGeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const fontJetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Retained for the marketing home's pixel identity (referenced via
// --font-doto / --font-space-mono); not used by the docs.
const fontDoto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
});

const fontSpaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

// globals.css `@theme` maps --font-sans → --font-geist-sans and
// --font-mono → --font-jetbrains-mono, so we no longer override them inline.
export const fontVariables = cn(
  fontGeistSans.variable,
  fontJetBrainsMono.variable,
  fontInter.variable,
  fontDoto.variable,
  fontSpaceMono.variable,
  GeistPixelSquare.variable,
);
