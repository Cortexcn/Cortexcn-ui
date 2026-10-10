import type { Metadata } from "next";

import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-details";
import { canonicalUrlFor, DOCS_URL, SITE_URL } from "@/lib/site-url";

/*
 * Search and sharing metadata shared by every page. Titles use a hyphen, not a
 * dash, and every page gets an absolute canonical URL on the domain that owns
 * it (docs on ui.cortexcn.dev, everything else on www.cortexcn.dev).
 */

export const SITE_NAME = "Cortexcn";

export const SITE_TITLE = "Cortexcn - shadcn/ui components, charts, and blocks";

export const SITE_DESCRIPTION =
  "Cortexcn is a shadcn/ui registry of React components, charts, and blocks. Install them with one command, or let your AI agent build with them. Built for freelancers, developers, and startups who ship fast.";

/** The www home page, which sells client work first. */
export const HOME_TITLE = "Cortexcn - Websites and web apps by Syed Moinuddin";

export const HOME_DESCRIPTION =
  "I design and build landing pages, websites, online stores, web apps, and AI features on Next.js. You get a written quote before work starts, a preview link every week, and code that lives in your repo.";

export const SITE_KEYWORDS = [
  "Cortexcn",
  "shadcn/ui",
  "shadcn registry",
  "React components",
  "React charts",
  "Tailwind CSS components",
  "Next.js components",
  "UI blocks",
  "landing page components",
  "dashboard components",
  "AI agent",
  "MCP",
];

export const AUTHOR = {
  name: "Syed Moinuddin",
  url: "https://syedmoinuddin.com",
};

/** Square brand mark (356 x 356), crawlable, for structured data. */
export const LOGO_URL = `${SITE_URL}/img/cortexcn/icon-light.png`;

interface PageMetadataInput {
  /** Page title; the root template adds " | Cortexcn". */
  title: string;
  description: string;
  /** Pathname, e.g. "/blocks"; resolved to the owning domain. */
  path: string;
  /** Use the title as is, without the site suffix. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
}

/** Canonical, Open Graph, and Twitter metadata for one page. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = canonicalUrlFor(path);
  const shareTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
    },
  };
}

/* ------------------------------------------------------------------------ */
/* Structured data (schema.org JSON-LD)                                      */
/* ------------------------------------------------------------------------ */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${AUTHOR.url}/#person`;

/** Home page graph: the site, the organization behind it, and its founder. */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: ["Cortexcn UI", "cortexcn.dev"],
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
          width: 356,
          height: 356,
        },
        description: SITE_DESCRIPTION,
        founder: { "@id": FOUNDER_ID },
        sameAs: [DOCS_URL],
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
    ],
  };
}

/** Contact page: how to reach the organization behind the site. */
export function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: `Contact ${SITE_NAME}`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE.e164,
        availableLanguage: ["English"],
      },
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList for a page, from the home page down. */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrlFor(crumb.path),
    })),
  };
}

/** A documentation page, published by Cortexcn. */
export function docsArticleJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: canonicalUrlFor(path),
    inLanguage: "en",
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    isPartOf: { "@type": "WebSite", name: `${SITE_NAME} Docs`, url: DOCS_URL },
  };
}
