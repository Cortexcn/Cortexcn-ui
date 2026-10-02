import type { StaticImageData } from "next/image";
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
import { contactHref } from "@/lib/contact/prefill";
import { formatUsd } from "@/lib/service-pricing";

export interface ThemedImage {
  light: StaticImageData;
  dark: StaticImageData;
}

/**
 * Full-website templates listed on /templates. Each one is a standalone
 * Next.js project in apps/cortexcn/templates/<slug>. Free templates are
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
    price: 49,
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

/** "Free" or "$49". */
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
