import { SHOW_PLACEHOLDERS } from "@/lib/site-config";
import { getSiteTemplate, type ThemedImage } from "@/lib/site-templates";

/**
 * Case studies for /work and the "Built with Cortexcn" section on the home
 * page. Write only what is true, and get the client's permission before
 * naming them or quoting them.
 *
 * Entries marked `draft` are placeholders: they show while you run
 * `bun run dev` and never in a production build. Fill in every bracketed
 * field, then delete `draft: true` to publish one.
 */
export interface CaseStudy {
  slug: string;
  /** The card title, such as "Startup site". */
  title: string;
  /** One line for the cards. */
  summary: string;
  clientType: string;
  problem: string;
  /** What I built, one item per line. */
  built: string[];
  stack: string[];
  /** The one number that shows the result. */
  result: { value: string; label: string };
  quote?: { text: string; name: string; role: string };
  screenshot?: ThemedImage;
  /** The live site, if it is public. */
  liveUrl?: string;
  draft?: boolean;
}

const templateScreenshot = getSiteTemplate("growth-agency")?.screenshots.card;

/** A template from site-templates.ts. A wrong slug fails the build. */
function siteTemplate(slug: string) {
  const template = getSiteTemplate(slug);
  if (!template) {
    throw new Error(`No template with the slug "${slug}"`);
  }
  return template;
}

const legalAi = siteTemplate("legal-ai");
const marketingOps = siteTemplate("marketing-ops");

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "startup-site",
    title: "Startup site",
    summary: "[One line: who the client is and what I built for them.]",
    clientType: "[Startup, such as a seed-stage SaaS]",
    problem:
      "[What the client needed, and why their old site or process was not working.]",
    built: [
      "[The pages or features I built]",
      "[Anything technical worth naming, such as a CMS or a waitlist]",
      "[How it launched]",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    result: { value: "[+00%]", label: "[What changed, in one number]" },
    quote: {
      text: "[A short quote from the client, with their permission.]",
      name: "[Client name]",
      role: "[Role, Company]",
    },
    draft: true,
  },
  {
    slug: "law-firm-site",
    title: "Law firm site",
    summary: "[One line: who the client is and what I built for them.]",
    clientType: "[Law firm, such as a ten-person practice]",
    problem:
      "[What the firm needed, and why their old site or process was not working.]",
    built: [
      "[The pages or features I built]",
      "[Anything technical worth naming, such as intake forms or SEO]",
      "[How it launched]",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    result: { value: "[00]", label: "[What changed, in one number]" },
    quote: {
      text: "[A short quote from the client, with their permission.]",
      name: "[Client name]",
      role: "[Role, Company]",
    },
    draft: true,
  },
  {
    slug: "template",
    title: "Template",
    summary:
      "Four complete Next.js sites, sold as templates with live previews.",
    clientType: "My own product",
    problem:
      "Founders and small teams want a finished site they can launch this week, not a blank page or a site builder they cannot leave.",
    built: [
      "Four complete sites: AI Travel App, Growth Agency, Trek Agency, and Simplistic SaaS.",
      "Every word, link, and price in one config file, so a buyer edits one file.",
      "Art drawn in SVG and CSS, so there are no stock images to license.",
      "Light and dark mode, keyboard support, reduced motion, and a static export for any host.",
    ],
    stack: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "TypeScript"],
    result: { value: "4", label: "complete sites, each with a live preview" },
    screenshot: templateScreenshot,
    liveUrl: "/templates",
  },
  {
    slug: legalAi.slug,
    title: legalAi.name,
    summary:
      "A launch site for an AI research platform for law firms, sold as a template with a live preview.",
    clientType: "My own product",
    problem:
      "Law firms check the source before they trust an answer, so a legal AI site has to show where each answer comes from. I wanted a template built around that, in a calm palette that suits the field.",
    built: [
      "A research card where each numbered citation brings its highlighted passage forward in the source document.",
      "Watercolor landscapes painted in SVG from seeded scenes, and product mockups in HTML and CSS: a review table, a redline, and a precedent search.",
      "Tabs for law firms, in-house teams, and small practices, customer stories that stack as you scroll, and pricing with a monthly and annual toggle.",
      "Every word, link, plan, and quote in one config file, with light and dark mode and reduced motion respected.",
    ],
    stack: legalAi.stack,
    result: {
      value: String(legalAi.sections.length),
      label: "sections, from the hero to the footer",
    },
    screenshot: legalAi.screenshots.card,
    liveUrl: legalAi.previewUrl,
  },
  {
    slug: marketingOps.slug,
    title: marketingOps.name,
    summary:
      "A launch site for a marketing platform, with dark campaign dashboards, sold as a template with a live preview.",
    clientType: "My own product",
    problem:
      "A marketing platform sells on its dashboards, so its site has to show the product at work. I wanted a template that does that without a single stock screenshot.",
    built: [
      "Dark campaign dashboards set on halftone landscapes drawn in SVG, so there are no images to license.",
      "Feature cards that stack as you scroll, and feature tabs that advance on their own and pause on hover or focus.",
      "A comparison table, testimonials in staggered columns, and pricing with a monthly and yearly toggle.",
      "Every word, link, plan, and quote in one config file, with light and dark mode and reduced motion respected.",
    ],
    stack: marketingOps.stack,
    result: {
      value: String(marketingOps.sections.length),
      label: "sections, from the hero to the footer",
    },
    screenshot: marketingOps.screenshots.card,
    liveUrl: marketingOps.previewUrl,
  },
];

/** The case studies this build shows: published ones, plus drafts in dev. */
export const WORK: CaseStudy[] = CASE_STUDIES.filter(
  (study) => SHOW_PLACEHOLDERS || !study.draft,
);

export function getCaseStudy(slug: string) {
  return WORK.find((study) => study.slug === slug);
}
