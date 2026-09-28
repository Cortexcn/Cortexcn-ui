import { Onest } from "next/font/google";

/**
 * Body and UI type of the library home, as in the Solva template. Headings use
 * Sentient, which the layout loads from Fontshare (see `SENTIENT_STYLESHEET`).
 */
export const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

/**
 * Sentient Light for headings. Its license (ITF Free Font License) allows use
 * on our own site but not sharing the font files through a public repository,
 * so Fontshare serves them instead of this repo.
 */
export const SENTIENT_STYLESHEET =
  "https://api.fontshare.com/v2/css?f[]=sentient@300&display=swap";
