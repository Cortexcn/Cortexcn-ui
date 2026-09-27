import type { StaticImageData } from "next/image";
import portfolioCardDark from "@/assets/templates/portfolio/card-dark.webp";
import portfolioCardLight from "@/assets/templates/portfolio/card-light.webp";
import portfolioDesktopDark from "@/assets/templates/portfolio/desktop-dark.webp";
import portfolioDesktopLight from "@/assets/templates/portfolio/desktop-light.webp";
import portfolioMobileDark from "@/assets/templates/portfolio/mobile-dark.webp";
import portfolioMobileLight from "@/assets/templates/portfolio/mobile-light.webp";

export interface ThemedImage {
  light: StaticImageData;
  dark: StaticImageData;
}

/**
 * Full-website templates listed on /templates. Each one is a standalone
 * Next.js project in apps/cortexcn/templates/<slug>, zipped at build time by
 * the download route next to its page.
 */
export interface SiteTemplate {
  slug: string;
  name: string;
  /** One line for the listing and the page hero. */
  summary: string;
  price: "Free";
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
  /** A live deployment of the template, once there is one. */
  previewUrl?: string;
  /** The public source repository, once there is one. */
  repoUrl?: string;
}

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    slug: "portfolio",
    name: "Portfolio",
    summary: "A one-page portfolio for developers and designers",
    price: "Free",
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
  },
];

export function getSiteTemplate(slug: string) {
  return SITE_TEMPLATES.find((template) => template.slug === slug);
}

/** Folder name inside the zip, and the zip's file name. */
export function templateArchiveName(template: SiteTemplate) {
  return `cortexcn-${template.slug}`;
}

export function templateDownloadPath(template: SiteTemplate) {
  return `/templates/${template.slug}/download`;
}
