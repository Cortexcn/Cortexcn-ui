import {
  Bebas_Neue,
  Cormorant_Garamond,
  DM_Mono,
  Figtree,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Manrope,
  Mona_Sans,
  Outfit,
  Playfair_Display,
  Rubik,
  Source_Code_Pro,
  Space_Grotesk,
  Ubuntu_Mono,
  Unbounded,
} from "next/font/google";

/*
 * The open-licensed fonts the design systems fall back to. None preload:
 * a font downloads only once a system that uses it is on screen. Geist,
 * Geist Mono, and Instrument Serif already load in the root layout.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ds-inter",
  preload: false,
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-ds-jetbrains-mono",
  preload: false,
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-ds-cormorant-garamond",
  preload: false,
});
const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-ds-unbounded",
  preload: false,
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-ds-figtree",
  preload: false,
});
const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-ds-mona-sans",
  preload: false,
});
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ds-ibm-plex-sans",
  preload: false,
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ds-ibm-plex-mono",
  preload: false,
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-ds-outfit",
  preload: false,
});
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-ds-source-code-pro",
  preload: false,
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ds-bebas-neue",
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-ds-space-grotesk",
  preload: false,
});
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-ds-rubik",
  preload: false,
});
const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ds-ubuntu-mono",
  preload: false,
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ds-dm-mono",
  preload: false,
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-ds-playfair-display",
  preload: false,
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-ds-manrope",
  preload: false,
});

/** Class names that define every --font-ds-* variable. */
export const systemFontVariables = [
  inter,
  jetbrainsMono,
  cormorant,
  unbounded,
  figtree,
  monaSans,
  plexSans,
  plexMono,
  outfit,
  sourceCodePro,
  bebasNeue,
  spaceGrotesk,
  rubik,
  ubuntuMono,
  dmMono,
  playfair,
  manrope,
]
  .map((font) => font.variable)
  .join(" ");

/** The CSS variable each fallback family loads under. */
export const FONT_VARIABLES: Record<string, string> = {
  Inter: "--font-ds-inter",
  "JetBrains Mono": "--font-ds-jetbrains-mono",
  "Cormorant Garamond": "--font-ds-cormorant-garamond",
  Unbounded: "--font-ds-unbounded",
  Figtree: "--font-ds-figtree",
  "Mona Sans": "--font-ds-mona-sans",
  "IBM Plex Sans": "--font-ds-ibm-plex-sans",
  "IBM Plex Mono": "--font-ds-ibm-plex-mono",
  Outfit: "--font-ds-outfit",
  "Source Code Pro": "--font-ds-source-code-pro",
  "Bebas Neue": "--font-ds-bebas-neue",
  "Space Grotesk": "--font-ds-space-grotesk",
  Rubik: "--font-ds-rubik",
  "Ubuntu Mono": "--font-ds-ubuntu-mono",
  "DM Mono": "--font-ds-dm-mono",
  "Playfair Display": "--font-ds-playfair-display",
  Manrope: "--font-ds-manrope",
  Geist: "--font-geist-sans",
  "Geist Mono": "--font-geist-mono",
  "Instrument Serif": "--font-instrument-serif",
};
