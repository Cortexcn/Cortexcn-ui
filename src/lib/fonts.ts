import {
  Doto,
  Geist,
  Inter,
  JetBrains_Mono,
  Space_Mono,
} from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

// evilcharts typography
const fontGeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const fontJetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
const fontInter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// kept for the marketing home (referenced via --font-doto / --font-space-mono)
const fontDoto = Doto({
  subsets: ["latin"],
  variable: "--font-doto",
});
const fontSpaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

// Satoshi (self-hosted variable font) — applied only on the hero section.
const fontSatoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

// globals.css @theme maps --font-sans → geist and --font-mono → jetbrains,
// so we no longer override them inline.
export const fontVariables = cn(
  fontGeistSans.variable,
  fontJetBrainsMono.variable,
  fontInter.variable,
  fontDoto.variable,
  fontSpaceMono.variable,
  fontSatoshi.variable,
  GeistPixelSquare.variable,
);
