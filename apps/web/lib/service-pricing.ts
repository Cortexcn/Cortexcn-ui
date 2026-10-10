import { contactHref } from "@/lib/contact/prefill";
import { CHECKOUT_URLS } from "@/lib/site-config";

/**
 * Prices in US dollars for the component plans and for client work. The
 * landing pricing section, the /pricing page and its estimator, the FAQ, and
 * /index.md all read from here, so a price changes in one place. Client work
 * prices are starting points; every project still gets a written quote.
 */

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$1,500" */
export function formatUsd(amount: number) {
  return USD.format(amount);
}

export type Cadence = "once" | "project" | "month";

export function cadenceLabel(cadence: Cadence) {
  if (cadence === "once") {
    return "";
  }
  return cadence === "month" ? "/month" : "/project";
}

export interface PlanAction {
  label: string;
  href: string;
}

export interface PricedPackage {
  name: string;
  summary: string;
  /** In USD: the exact price of a component plan, or where a quote starts. */
  price: number;
  cadence: Cadence;
  /** The tag at the top of the card: how long it takes, or what it covers. */
  tag: string;
  features: string[];
  action: PlanAction;
  /** Only the highlighted card in each group has one. */
  badge?: string;
}

/** Opens the contact form with a quote request already started. */
export function quoteHref(subject: string) {
  return contactHref(
    "custom-work",
    `Hi, I would like a quote for ${subject}.\n\nAbout the project: `,
  );
}

function quoteAction(subject: string): PlanAction {
  return { label: "Get a quote", href: quoteHref(subject) };
}

/* ------------------------------------------------------------------------ */
/* Component plans                                                           */
/* ------------------------------------------------------------------------ */

export const FREE_PLAN_LIMITS = { components: 20, templates: 2 } as const;

export const COMPONENT_PLAN_PRICES = { pro: 149, ultra: 449 } as const;

/** Days after purchase that a component plan can be refunded in full. */
export const PLAN_REFUND_DAYS = 14;

/**
 * "Buy Pro: $149". Goes to the plan's checkout link in `lib/site-config.ts`,
 * or, until that is set, to the contact form with the order written out.
 */
function buyAction(plan: "Pro" | "Ultra", price: number): PlanAction {
  const checkout = plan === "Pro" ? CHECKOUT_URLS.pro : CHECKOUT_URLS.ultra;
  return {
    label: `Buy ${plan}: ${formatUsd(price)}`,
    href:
      checkout ||
      contactHref(
        "question",
        `Hi, I would like to buy the Cortexcn ${plan} plan (${formatUsd(price)}). Please send me a payment link.`,
      ),
  };
}

/** Every paid plan is a single payment, with no subscription. */
export const COMPONENT_PLANS: PricedPackage[] = [
  {
    name: "Free",
    summary: "The basics, to try Cortexcn in a real project.",
    price: 0,
    cadence: "once",
    tag: `${FREE_PLAN_LIMITS.components} components`,
    features: [
      `${FREE_PLAN_LIMITS.components} components with full source`,
      `${FREE_PLAN_LIMITS.templates} page templates`,
      "Install with the shadcn CLI or your agent",
      "Use in personal and client projects",
    ],
    action: { label: "Get started", href: "/docs/installation" },
  },
  {
    name: "Pro",
    summary: "Every component, chart, and block, paid once.",
    price: COMPONENT_PLAN_PRICES.pro,
    cadence: "once",
    tag: "All components",
    features: [
      "Every component, chart, and block",
      "Fixes and updates to all of them",
      "Unlimited projects",
      "Email support",
    ],
    action: buyAction("Pro", COMPONENT_PLAN_PRICES.pro),
    badge: "Recommended",
  },
  {
    name: "Ultra",
    summary: "Everything we make, now and later, for life.",
    price: COMPONENT_PLAN_PRICES.ultra,
    cadence: "once",
    tag: "Lifetime access",
    features: [
      "Everything in Pro",
      "Every template, now and later",
      "Every new component, for life",
      "Priority email support",
    ],
    action: buyAction("Ultra", COMPONENT_PLAN_PRICES.ultra),
  },
];

/* ------------------------------------------------------------------------ */
/* Client work                                                               */
/* ------------------------------------------------------------------------ */

/** Where each kind of project starts. Packages, services, and the estimator share them. */
export const PROJECT_STARTING_PRICES = {
  landing: 1200,
  website: 3500,
  store: 6500,
  app: 12_000,
} as const;

/** Each page past the ones a site or store includes. */
const SITE_PAGE_PRICE = 350;
/** Each screen past the ones a web app includes. */
const APP_SCREEN_PRICE = 600;
const COPY_PAGE_PRICE = 150;
export const CARE_PLAN_MONTHLY_PRICE = 250;
/** Technical SEO, sold as an add-on to any project. */
const SEO_PRICE = 900;
const RUSH_SHARE = 0.4;

export const PROJECT_PACKAGES: PricedPackage[] = [
  {
    name: "Landing page",
    summary: "One page for a launch, a campaign, or a product.",
    price: PROJECT_STARTING_PRICES.landing,
    cadence: "project",
    tag: "1 to 2 weeks",
    features: [
      `1 custom page, more at ${formatUsd(SITE_PAGE_PRICE)} each`,
      "Scroll and hover animations",
      "Contact or waitlist form",
      "SEO basics and analytics",
      "Two rounds of revisions",
      "30 days of fixes after launch",
    ],
    action: quoteAction("a landing page"),
  },
  {
    name: "Website",
    summary: "Five pages and a CMS your team can edit on its own.",
    price: PROJECT_STARTING_PRICES.website,
    cadence: "project",
    tag: "3 to 4 weeks",
    features: [
      `5 custom pages, more at ${formatUsd(SITE_PAGE_PRICE)} each`,
      "A CMS for pages and blog posts",
      "SEO basics and sitemaps",
      "Contact form and analytics",
      "Three rounds of revisions",
      "30 days of fixes after launch",
    ],
    action: quoteAction("a website"),
    badge: "Most popular",
  },
  {
    name: "Web app",
    summary: "A product with accounts, data, and an admin.",
    price: PROJECT_STARTING_PRICES.app,
    cadence: "project",
    tag: "8 to 12 weeks",
    features: [
      `8 screens, more at ${formatUsd(APP_SCREEN_PRICE)} each`,
      "Sign-in, roles, and permissions",
      "Database and API",
      "Admin dashboard",
      "Automated tests and deploys",
      "30 days of fixes after launch",
    ],
    action: quoteAction("a web app"),
  },
];

export const RETAINERS: PricedPackage[] = [
  {
    name: "Part time",
    summary: "Steady help for a small product.",
    price: 3600,
    cadence: "month",
    tag: "40 hours a month",
    features: [
      "Any service on the pricing page",
      "Work in your repo and tools",
      "Weekly progress updates",
      "Pause or cancel with 2 weeks notice",
    ],
    action: quoteAction("the Part time retainer, 40 hours a month"),
  },
  {
    name: "Half time",
    summary: "A regular engineer on your team.",
    price: 6800,
    cadence: "month",
    tag: "80 hours a month",
    features: [
      "Everything in Part time",
      "A planning call every week",
      "Code reviews for your team",
      "Unused hours roll over one month",
    ],
    action: quoteAction("the Half time retainer, 80 hours a month"),
    badge: "Most popular",
  },
  {
    name: "Full time",
    summary: "A dedicated engineer, all month.",
    price: 12_800,
    cadence: "month",
    tag: "160 hours a month",
    features: [
      "Everything in Half time",
      "Joins your standups",
      "Updates in your team chat every day",
      "On hand for launches and incidents",
    ],
    action: quoteAction("the Full time retainer, 160 hours a month"),
  },
];

export interface ServicePrice {
  title: string;
  price: number;
  cadence: Cadence;
  timeline: string;
  includes: [string, string, string];
}

/** Every service, with the price a quote starts at. */
export const SERVICE_PRICES: ServicePrice[] = [
  {
    title: "Landing pages",
    price: PROJECT_STARTING_PRICES.landing,
    cadence: "project",
    timeline: "1 to 2 weeks",
    includes: ["Custom design", "Animations", "Form and SEO basics"],
  },
  {
    title: "Websites",
    price: PROJECT_STARTING_PRICES.website,
    cadence: "project",
    timeline: "3 to 4 weeks",
    includes: ["5 pages", "CMS", "SEO basics"],
  },
  {
    title: "E-commerce",
    price: PROJECT_STARTING_PRICES.store,
    cadence: "project",
    timeline: "5 to 7 weeks",
    includes: ["Catalog and cart", "Checkout and payments", "Orders admin"],
  },
  {
    title: "Web apps + APIs",
    price: PROJECT_STARTING_PRICES.app,
    cadence: "project",
    timeline: "8 to 12 weeks",
    includes: [
      "Auth, roles, and dashboards",
      "APIs and databases",
      "Services and deploys",
    ],
  },
  {
    title: "AI features",
    price: 6000,
    cadence: "project",
    timeline: "4 to 8 weeks",
    includes: ["Retrieval over your data", "Agents and tools", "Evals"],
  },
  {
    title: "Retainer",
    price: 3600,
    cadence: "month",
    timeline: "40+ hours a month",
    includes: ["Any service here", "Weekly updates", "Pause any time"],
  },
];

export interface AddOn {
  name: string;
  price: string;
  /** Shown smaller after the price, such as "/month". */
  unit?: string;
  detail: string;
}

export const ADD_ONS: AddOn[] = [
  {
    name: "Rush delivery",
    price: `+${RUSH_SHARE * 100}%`,
    detail: "About half the usual timeline.",
  },
  {
    name: "Extra revision round",
    price: "$250",
    detail: "One more round of changes on any project.",
  },
  {
    name: "Care plan",
    price: formatUsd(CARE_PLAN_MONTHLY_PRICE),
    unit: "/month",
    detail: "Updates, backups, and up to 2 hours of fixes a month.",
  },
  {
    name: "Copywriting",
    price: formatUsd(COPY_PAGE_PRICE),
    unit: "/page",
    detail: "Clear, plain copy written for each page.",
  },
  {
    name: "Domain and hosting",
    price: "$200",
    detail: "Domain, DNS, hosting, and email set up for you.",
  },
  {
    name: "SEO",
    price: formatUsd(SEO_PRICE),
    detail: "Technical audit, structured data, and page speed fixes.",
  },
];

export const PRICING_STEPS = [
  {
    title: "Tell us what you need",
    detail:
      "Send an estimate from this page, or write to us. We reply by email.",
  },
  {
    title: "Get a written quote",
    detail: "Scope, price, and timeline, agreed before any work starts.",
  },
  {
    title: "Pay in two parts",
    detail: "50% to start and 50% before launch. Retainers bill monthly.",
  },
  {
    title: "Get your code",
    detail: "It lives in your repo, with a walkthrough and 30 days of fixes.",
  },
];

/* ------------------------------------------------------------------------ */
/* Estimator                                                                 */
/* ------------------------------------------------------------------------ */

export type EstimatorProjectId = "landing" | "website" | "store" | "app";

const ESTIMATOR_OPTION_IDS = [
  "cms",
  "copy",
  "languages",
  "seo",
  "crm",
  "payments",
  "accounts",
  "ai",
] as const;

export type EstimatorOptionId = (typeof ESTIMATOR_OPTION_IDS)[number];

export interface EstimatorProject {
  id: EstimatorProjectId;
  label: string;
  summary: string;
  /** What one "page" is for this kind of project. */
  unit: { one: string; many: string };
  base: number;
  basePages: number;
  pagePrice: number;
  maxPages: number;
  weeks: [number, number];
  /** Options that come with this kind of project at no extra cost. */
  included: EstimatorOptionId[];
}

export interface EstimatorOption {
  id: EstimatorOptionId;
  label: string;
  detail: string;
  /** Flat, or charged for every page of the project. */
  price: { amount: number; perPage: boolean };
  /** Weeks it adds to the timeline. */
  weeks: number;
}

const PAGE_UNIT = { one: "page", many: "pages" };

/*
 * A website is a landing page with 4 more pages and a CMS, and it costs the
 * same either way, so no path through the estimator is cheaper than another.
 */
export const ESTIMATOR_PROJECTS: EstimatorProject[] = [
  {
    id: "landing",
    label: "Landing page",
    summary: "One page for a launch or a campaign.",
    unit: PAGE_UNIT,
    base: PROJECT_STARTING_PRICES.landing,
    basePages: 1,
    pagePrice: SITE_PAGE_PRICE,
    maxPages: 40,
    weeks: [1, 2],
    included: [],
  },
  {
    id: "website",
    label: "Website",
    summary: "5 pages and a CMS to edit them.",
    unit: PAGE_UNIT,
    base: PROJECT_STARTING_PRICES.website,
    basePages: 5,
    pagePrice: SITE_PAGE_PRICE,
    maxPages: 40,
    weeks: [3, 4],
    included: ["cms"],
  },
  {
    id: "store",
    label: "E-commerce store",
    summary: "Catalog, cart, checkout, and 5 pages.",
    unit: PAGE_UNIT,
    base: PROJECT_STARTING_PRICES.store,
    basePages: 5,
    pagePrice: SITE_PAGE_PRICE,
    maxPages: 40,
    weeks: [5, 7],
    included: ["cms", "payments"],
  },
  {
    id: "app",
    label: "Web application",
    summary: "8 screens with sign-in and a database.",
    unit: { one: "screen", many: "screens" },
    base: PROJECT_STARTING_PRICES.app,
    basePages: 8,
    pagePrice: APP_SCREEN_PRICE,
    maxPages: 60,
    weeks: [8, 12],
    included: ["accounts"],
  },
];

export const ESTIMATOR_OPTIONS: EstimatorOption[] = [
  {
    id: "cms",
    label: "CMS",
    detail: "Edit pages and posts yourself, without touching code.",
    price: { amount: 900, perPage: false },
    weeks: 1,
  },
  {
    id: "copy",
    label: "Copywriting",
    detail: "We write the words for every page.",
    price: { amount: COPY_PAGE_PRICE, perPage: true },
    weeks: 0,
  },
  {
    id: "languages",
    label: "A second language",
    detail: "Every page in one more language, with a switcher.",
    price: { amount: 200, perPage: true },
    weeks: 1,
  },
  {
    id: "seo",
    label: "Advanced SEO",
    detail: "Structured data, a search audit, and page speed work.",
    price: { amount: 900, perPage: false },
    weeks: 0,
  },
  {
    id: "crm",
    label: "CRM or email hookup",
    detail: "Send leads and sign-ups to your CRM or mailing list.",
    price: { amount: 600, perPage: false },
    weeks: 0,
  },
  {
    id: "payments",
    label: "Payments",
    detail: "Checkout, subscriptions, or one-off payments.",
    price: { amount: 1500, perPage: false },
    weeks: 1,
  },
  {
    id: "accounts",
    label: "Sign-in and accounts",
    detail: "Email or social sign-in, with roles and permissions.",
    price: { amount: 2000, perPage: false },
    weeks: 1,
  },
  {
    id: "ai",
    label: "AI assistant",
    detail: "A chat or search feature that answers from your content.",
    price: { amount: 3000, perPage: false },
    weeks: 2,
  },
];

export const RUSH = {
  label: "Rush delivery",
  detail: "About half the timeline.",
  priceLabel: `+${RUSH_SHARE * 100}%`,
} as const;

export interface EstimateLine {
  label: string;
  /** Null when the project already includes it. */
  amount: number | null;
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
  weeks: [number, number];
}

/** Totals round to $50, so an estimate does not look more exact than it is. */
const ROUND_TO = 50;
/** Roughly how many extra pages add a week. */
const PAGES_PER_WEEK = 4;

function roundPrice(amount: number) {
  return Math.round(amount / ROUND_TO) * ROUND_TO;
}

function sumLines(lines: EstimateLine[]) {
  return lines.reduce((sum, line) => sum + (line.amount ?? 0), 0);
}

export function estimatorProject(id: EstimatorProjectId): EstimatorProject {
  return (
    ESTIMATOR_PROJECTS.find((project) => project.id === id) ??
    (ESTIMATOR_PROJECTS[0] as EstimatorProject)
  );
}

/** "1 page", "5 pages", "8 screens" */
export function countLabel(project: EstimatorProject, count: number) {
  return `${count} ${count === 1 ? project.unit.one : project.unit.many}`;
}

export function clampPages(project: EstimatorProject, pages: number) {
  if (!Number.isFinite(pages)) {
    return project.basePages;
  }
  return Math.min(
    Math.max(Math.round(pages), project.basePages),
    project.maxPages,
  );
}

export function optionPriceLabel(
  option: EstimatorOption,
  project: EstimatorProject,
) {
  const amount = formatUsd(option.price.amount);
  return option.price.perPage ? `${amount}/${project.unit.one}` : amount;
}

/** Adds up a project from its base price, extra pages, and chosen options. */
export function estimateProject(
  projectId: EstimatorProjectId,
  requestedPages: number,
  chosen: ReadonlySet<EstimatorOptionId>,
  rush: boolean,
): Estimate {
  const project = estimatorProject(projectId);
  const pages = clampPages(project, requestedPages);
  const extraPages = pages - project.basePages;
  let [minWeeks, maxWeeks] = project.weeks;

  const lines: EstimateLine[] = [
    {
      label: `${project.label}, ${countLabel(project, project.basePages)}`,
      amount: project.base,
    },
  ];
  if (extraPages > 0) {
    const unit = extraPages === 1 ? project.unit.one : project.unit.many;
    lines.push({
      label: `${extraPages} more ${unit}`,
      amount: extraPages * project.pagePrice,
    });
    const extraWeeks = Math.ceil(extraPages / PAGES_PER_WEEK);
    minWeeks += extraWeeks;
    maxWeeks += extraWeeks;
  }

  for (const option of ESTIMATOR_OPTIONS) {
    if (project.included.includes(option.id)) {
      lines.push({ label: option.label, amount: null });
    } else if (chosen.has(option.id)) {
      lines.push(
        option.price.perPage
          ? {
              label: `${option.label}, ${countLabel(project, pages)}`,
              amount: option.price.amount * pages,
            }
          : { label: option.label, amount: option.price.amount },
      );
      minWeeks += option.weeks;
      maxWeeks += option.weeks;
    }
  }

  // Rush is a share of everything above it, so it is added last.
  if (rush) {
    lines.push({
      label: `${RUSH.label}, ${RUSH.priceLabel}`,
      amount: roundPrice(sumLines(lines) * RUSH_SHARE),
    });
    minWeeks = Math.max(1, Math.ceil(minWeeks / 2));
    maxWeeks = Math.max(1, Math.ceil(maxWeeks / 2));
  }

  return {
    lines,
    total: roundPrice(sumLines(lines)),
    weeks: [minWeeks, maxWeeks],
  };
}

/** "About 1 week", "About 3 to 4 weeks" */
export function formatWeeks([min, max]: [number, number]) {
  if (min === max) {
    return `About ${min} ${min === 1 ? "week" : "weeks"}`;
  }
  return `About ${min} to ${max} weeks`;
}

export const LOWEST_RETAINER_PRICE = Math.min(
  ...RETAINERS.map((retainer) => retainer.price),
);
