import type { StaticImageData } from "next/image";
import travelCardDark from "@/assets/templates/ai-travel-app/card-dark.webp";
import travelCardLight from "@/assets/templates/ai-travel-app/card-light.webp";
import travelDesktopDark from "@/assets/templates/ai-travel-app/desktop-dark.webp";
import travelDesktopLight from "@/assets/templates/ai-travel-app/desktop-light.webp";
import travelMobileDark from "@/assets/templates/ai-travel-app/mobile-dark.webp";
import travelMobileLight from "@/assets/templates/ai-travel-app/mobile-light.webp";
import growthCardDark from "@/assets/templates/growth-agency/card-dark.webp";
import growthCardLight from "@/assets/templates/growth-agency/card-light.webp";
import growthDesktopDark from "@/assets/templates/growth-agency/desktop-dark.webp";
import growthDesktopLight from "@/assets/templates/growth-agency/desktop-light.webp";
import growthMobileDark from "@/assets/templates/growth-agency/mobile-dark.webp";
import growthMobileLight from "@/assets/templates/growth-agency/mobile-light.webp";
import portfolioCardDark from "@/assets/templates/portfolio/card-dark.webp";
import portfolioCardLight from "@/assets/templates/portfolio/card-light.webp";
import portfolioDesktopDark from "@/assets/templates/portfolio/desktop-dark.webp";
import portfolioDesktopLight from "@/assets/templates/portfolio/desktop-light.webp";
import portfolioMobileDark from "@/assets/templates/portfolio/mobile-dark.webp";
import portfolioMobileLight from "@/assets/templates/portfolio/mobile-light.webp";
import saasCardDark from "@/assets/templates/simplistic-saas/card-dark.webp";
import saasCardLight from "@/assets/templates/simplistic-saas/card-light.webp";
import saasDesktopDark from "@/assets/templates/simplistic-saas/desktop-dark.webp";
import saasDesktopLight from "@/assets/templates/simplistic-saas/desktop-light.webp";
import saasMobileDark from "@/assets/templates/simplistic-saas/mobile-dark.webp";
import saasMobileLight from "@/assets/templates/simplistic-saas/mobile-light.webp";
import trekCardDark from "@/assets/templates/trek-agency/card-dark.webp";
import trekCardLight from "@/assets/templates/trek-agency/card-light.webp";
import trekDesktopDark from "@/assets/templates/trek-agency/desktop-dark.webp";
import trekDesktopLight from "@/assets/templates/trek-agency/desktop-light.webp";
import trekMobileDark from "@/assets/templates/trek-agency/mobile-dark.webp";
import trekMobileLight from "@/assets/templates/trek-agency/mobile-light.webp";
import { contactHref } from "@/lib/contact/prefill";
import { formatUsd } from "@/lib/service-pricing";

export interface ThemedImage {
  light: StaticImageData;
  dark: StaticImageData;
}

/**
 * Full-website templates listed on /templates. Each one is a standalone
 * Next.js project: free ones in templates/<slug> in this repo, paid ones in
 * the private cortexcn-templates repo next to it. Free templates are
 * zipped at build time by the download route next to their page; paid ones
 * are sold through `checkoutUrl` and never served from this site.
 */
export interface SiteTemplate {
  slug: string;
  name: string;
  /** One line for the listing and the page hero. */
  summary: string;
  /** In US dollars, paid once. 0 makes it a free MIT download. */
  price: number;
  stack: string[];
  sections: string[];
  features: string[];
  /** Where to put your own content, for the "Make it yours" step. */
  customize: string;
  /** Captured from the template's production build. */
  screenshots: {
    /** The first screen on a desktop. */
    card: ThemedImage;
    /** The whole page on a desktop. */
    desktop: ThemedImage;
    /** The whole page on a phone. */
    mobile: ThemedImage;
  };
  /**
   * A live copy of the template. Templates built with
   * scripts/build-template-preview.mjs live at /previews/<slug>.
   */
  previewUrl?: string;
  /** The public source repository, once there is one. */
  repoUrl?: string;
  /**
   * The hosted checkout for a paid template (Lemon Squeezy, Gumroad, Polar,
   * or a Stripe Payment Link) that hands buyers the zip. Until it is set, Buy
   * opens the contact form with the order written out.
   */
  checkoutUrl?: string;
}

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    slug: "simplistic-saas",
    name: "Simplistic SaaS",
    summary:
      "A SaaS landing page for AI and agentic startups, with bento grids, isometric illustrations, and microinteractions",
    price: 130,
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    sections: [
      "Announcement bar",
      "Hero",
      "Logo wall",
      "Problem",
      "How it works",
      "Features bento",
      "Testimonials",
      "Pricing",
      "FAQ",
      "Call to action",
      "Footer",
    ],
    features: [
      "Every word, link, plan, and quote comes from one file, config/site.ts.",
      "Isometric SVG illustrations that move on their own and react to hover: a work pipeline, a stacking how-it-works, six bento cards, and a tile floor.",
      "A how-it-works section that pins while you scroll through the steps, and two testimonial marquees.",
      "Microinteractions throughout: rolling button text, corner brackets that grow into frames, decoding section labels, and prices that roll when billing changes.",
      "Light and dark mode, a mobile menu, keyboard support, and reduced motion respected everywhere.",
      "Builds as a Next.js app or a static site for any host, with a share image, sitemap, and robots file.",
    ],
    customize:
      "Put your product name, copy, plans, and quotes in config/site.ts, swap the brand mark in components/logo.tsx, and change the accent color in app/globals.css.",
    screenshots: {
      card: { light: saasCardLight, dark: saasCardDark },
      desktop: { light: saasDesktopLight, dark: saasDesktopDark },
      mobile: { light: saasMobileLight, dark: saasMobileDark },
    },
    previewUrl: "/previews/simplistic-saas",
  },
  {
    slug: "ai-travel-app",
    name: "AI Travel App",
    summary:
      "A launch site for an AI trip planner app, with a typing prompt bar, glassy itinerary mockups, and painted landscapes",
    price: 99,
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    sections: [
      "Hero",
      "Feature carousel",
      "Intro",
      "Desktop app",
      "Testimonials",
      "Integrations",
      "Stays",
      "Partners",
      "Value banner",
      "Pricing",
      "Journal",
      "FAQ",
      "Call to action",
      "Footer",
    ],
    features: [
      "Every word, link, plan, and quote comes from one file, config/site.ts.",
      "A hero prompt bar that types out example trips, with itinerary chips and a live re-route card above it.",
      "Landscapes painted in SVG from seeded scenes in place of photos, so there are no images to license.",
      "A swipeable feature carousel of app mockups, and a desktop app window whose route draws itself as you scroll.",
      "Pricing with a monthly and yearly toggle, a newsletter form, and an FAQ accordion.",
      "Light and dark mode, a mobile menu, corners set by one radius token, and reduced motion respected everywhere.",
    ],
    customize:
      "Put your app name, copy, plans, and quotes in config/site.ts, swap the mark in components/logo.tsx, and change the colors and radius in app/globals.css.",
    screenshots: {
      card: { light: travelCardLight, dark: travelCardDark },
      desktop: { light: travelDesktopLight, dark: travelDesktopDark },
      mobile: { light: travelMobileLight, dark: travelMobileDark },
    },
    previewUrl: "/previews/ai-travel-app",
  },
  {
    slug: "trek-agency",
    name: "Trek Agency",
    summary:
      "A website for a guided hiking company, with editorial serif type, trek cards, and painted mountain scenes",
    price: 99,
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    sections: [
      "Hero",
      "About",
      "Treks",
      "What's included",
      "Gallery",
      "Guides",
      "How it works",
      "Reviews",
      "Journal",
      "FAQ",
      "Call to action",
      "Footer",
    ],
    features: [
      "Every word, link, trek, guide, and quote comes from one file, config/site.ts.",
      "Terrain buttons in the hero that switch the landscape behind the headline.",
      "Landscapes painted in SVG from seeded scenes in place of photos, so there are no images to license.",
      "Trek cards with terrain filters, a gallery, guide cards, and stats that count up.",
      "An enquiry form in the closing section, and an FAQ accordion.",
      "Light and dark mode, a mobile menu, corners set by one radius token, and reduced motion respected everywhere.",
    ],
    customize:
      "Put your company name, treks, guides, and quotes in config/site.ts, swap the mark in components/logo.tsx, and change the colors and radius in app/globals.css.",
    screenshots: {
      card: { light: trekCardLight, dark: trekCardDark },
      desktop: { light: trekDesktopLight, dark: trekDesktopDark },
      mobile: { light: trekMobileLight, dark: trekMobileDark },
    },
    previewUrl: "/previews/trek-agency",
  },
  {
    slug: "growth-agency",
    name: "Growth Agency",
    summary:
      "A website for a growth marketing agency, with giant condensed type, generative art, and case studies that stack as you scroll",
    price: 99,
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    sections: [
      "Hero",
      "Clients",
      "Process",
      "Principles",
      "Services",
      "Selected work",
      "Numbers",
      "Testimonials",
      "Pricing",
      "FAQ",
      "Journal",
      "Call to action",
      "Footer",
    ],
    features: [
      "Every word, link, plan, and quote comes from one file, config/site.ts.",
      "A hero word that fills the page width at every screen size, with letters that rise in and a slowly drifting gradient.",
      "Seeded generative art in place of photos: color fields with grain, light streaks, poster shapes, and ripples, so there are no images to license.",
      "Process cards that widen on hover or focus, and four case studies that stack on top of each other as you scroll.",
      "Counters, floating testimonials, a monthly and yearly pricing toggle, and an FAQ with keyboard-friendly topic tabs.",
      "Light and dark mode, a mobile menu, corners set by one radius token, and reduced motion respected everywhere.",
    ],
    customize:
      "Put your studio name, copy, clients, plans, and quotes in config/site.ts, swap the mark in components/logo.tsx, and change the accent, highlight, and art colors in app/globals.css.",
    screenshots: {
      card: { light: growthCardLight, dark: growthCardDark },
      desktop: { light: growthDesktopLight, dark: growthDesktopDark },
      mobile: { light: growthMobileLight, dark: growthMobileDark },
    },
    previewUrl: "/previews/growth-agency",
  },
  {
    slug: "portfolio",
    name: "Portfolio",
    summary: "A one-page portfolio for developers and designers",
    price: 0,
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    sections: [
      "Hero",
      "About",
      "Services",
      "Projects",
      "Testimonials",
      "Writing",
      "Contact",
    ],
    features: [
      "Every name, link, project, and quote comes from one file, config/site.ts.",
      "Hero stickers visitors can drag around, and a statement that lights up as you scroll.",
      "A contact form that posts to any form service, or opens the visitor's email app.",
      "Light and dark mode, a mobile menu, and support for reduced motion.",
      "Share image, sitemap, and robots file generated from your details.",
      "Set up for the shadcn CLI, so any Cortexcn component installs in one command.",
    ],
    customize:
      "Put your name, links, projects, and quotes in config/site.ts, then swap the covers in public/projects and public/posts.",
    screenshots: {
      card: { light: portfolioCardLight, dark: portfolioCardDark },
      desktop: { light: portfolioDesktopLight, dark: portfolioDesktopDark },
      mobile: { light: portfolioMobileLight, dark: portfolioMobileDark },
    },
    previewUrl: "/previews/portfolio",
  },
];

export function getSiteTemplate(slug: string) {
  return SITE_TEMPLATES.find((template) => template.slug === slug);
}

export function isFreeTemplate(template: SiteTemplate) {
  return template.price === 0;
}

/** "Free" or "$130". */
export function templatePriceLabel(template: SiteTemplate) {
  return isFreeTemplate(template) ? "Free" : formatUsd(template.price);
}

export function templateLicenseLabel(template: SiteTemplate) {
  return isFreeTemplate(template)
    ? "MIT licensed"
    : "Cortexcn template license";
}

/** Folder name inside the zip, and the zip's file name. */
export function templateArchiveName(template: SiteTemplate) {
  return `cortexcn-${template.slug}`;
}

export function templateDownloadPath(template: SiteTemplate) {
  return `/templates/${template.slug}/download`;
}

/** Where Buy goes: the hosted checkout, or a prefilled order email for now. */
export function templateBuyHref(template: SiteTemplate) {
  return (
    template.checkoutUrl ??
    contactHref(
      "question",
      `Hi, I would like to buy the ${template.name} template (${templatePriceLabel(template)}). Please send me a payment link.`,
    )
  );
}
