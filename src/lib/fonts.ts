import {
  Doto,
  Geist,
  Inter,
  JetBrains_Mono,
  Space_Mono,
} from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";

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

// globals.css @theme maps --font-sans → geist and --font-mono → jetbrains,
// so we no longer override them inline.
export const fontVariables = cn(
  fontGeistSans.variable,
  fontJetBrainsMono.variable,
  fontInter.variable,
  fontDoto.variable,
  fontSpaceMono.variable,
  GeistPixelSquare.variable,
);
