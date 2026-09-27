/**
 * Prices for client work, in US dollars. The landing pricing section, the
 * /pricing page, and /index.md all read from here, so a price changes in one
 * place. Every price is a starting point; each project gets a written quote.
 */

export type Cadence = "project" | "month";

export interface PricedPackage {
  name: string;
  summary: string;
  /** Starting price in USD. */
  price: number;
  cadence: Cadence;
  /** How long it takes, or how many hours a month. */
  timeline: string;
  features: string[];
  featured?: boolean;
}

export const PROJECT_PACKAGES: PricedPackage[] = [
  {
    name: "Landing page",
    summary: "One page for a launch, a campaign, or a product.",
    price: 600,
    cadence: "project",
    timeline: "About 1 week",
    features: [
      "Custom design for desktop and mobile",
      "Scroll and hover animations",
      "Contact or waitlist form",
      "SEO basics and analytics",
      "Two rounds of revisions",
      "30 days of fixes after launch",
    ],
  },
  {
    name: "Website",
    summary: "A multi-page site your team can edit on its own.",
    price: 1500,
    cadence: "project",
    timeline: "2 to 3 weeks",
    features: [
      "Up to 5 custom pages",
      "A CMS for pages and posts",
      "Blog or case studies",
      "Technical SEO and sitemaps",
      "Three rounds of revisions",
      "30 days of fixes after launch",
    ],
    featured: true,
  },
  {
    name: "Web app or store",
    summary: "A product with accounts, data, and payments.",
    price: 3500,
    cadence: "project",
    timeline: "4 to 8 weeks",
    features: [
      "Sign-in, roles, and permissions",
      "Database and API",
      "Checkout and payments",
      "Admin dashboard",
      "Automated tests and deploys",
      "30 days of fixes after launch",
    ],
  },
];

export const RETAINERS: PricedPackage[] = [
  {
    name: "Part time",
    summary: "Steady help for a small product.",
    price: 2200,
    cadence: "month",
    timeline: "40 hours a month",
    features: [
      "Any service on the pricing page",
      "Work in your repo and tools",
      "Weekly progress updates",
      "Pause or cancel with 2 weeks notice",
    ],
  },
  {
    name: "Half time",
    summary: "A regular engineer on your team.",
    price: 4000,
    cadence: "month",
    timeline: "80 hours a month",
    features: [
      "Everything in Part time",
      "A planning call every week",
      "Code reviews for your team",
      "Unused hours roll over one month",
    ],
    featured: true,
  },
  {
    name: "Full time",
    summary: "A dedicated engineer, all month.",
    price: 7500,
    cadence: "month",
    timeline: "160 hours a month",
    features: [
      "Everything in Half time",
      "Joins your standups",
      "Updates in your team chat every day",
      "On hand for launches and incidents",
    ],
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
    price: 600,
    cadence: "project",
    timeline: "About 1 week",
    includes: ["Custom design", "Animations", "Form and SEO basics"],
  },
  {
    title: "Websites",
    price: 1500,
    cadence: "project",
    timeline: "2 to 3 weeks",
    includes: ["Up to 5 pages", "CMS", "Technical SEO"],
  },
  {
    title: "E-commerce stores",
    price: 3500,
    cadence: "project",
    timeline: "4 to 6 weeks",
    includes: ["Catalog and cart", "Checkout and payments", "Orders admin"],
  },
  {
    title: "Web applications",
    price: 6000,
    cadence: "project",
    timeline: "6 to 10 weeks",
    includes: ["Auth and roles", "Dashboard and API", "Tests and deploys"],
  },
  {
    title: "Backend and APIs",
    price: 2500,
    cadence: "project",
    timeline: "3 to 5 weeks",
    includes: ["API design and docs", "Database and auth", "Background jobs"],
  },
  {
    title: "Microservices",
    price: 5000,
    cadence: "project",
    timeline: "4 to 8 weeks",
    includes: ["Service design", "Queues and events", "Containers and CI"],
  },
  {
    title: "AI pipelines",
    price: 3000,
    cadence: "project",
    timeline: "3 to 6 weeks",
    includes: ["Retrieval over your data", "Agents and tools", "Evals"],
  },
  {
    title: "SEO",
    price: 500,
    cadence: "project",
    timeline: "1 to 2 weeks",
    includes: ["Technical audit", "Structured data", "Page speed fixes"],
  },
  {
    title: "Research papers",
    price: 800,
    cadence: "project",
    timeline: "2 to 4 weeks",
    includes: ["Code and experiments", "Figures and tables", "Editing"],
  },
  {
    title: "Freelance work",
    price: 2200,
    cadence: "month",
    timeline: "40+ hours a month",
    includes: ["Any service here", "Weekly updates", "Pause any time"],
  },
];

export interface AddOn {
  name: string;
  price: string;
  detail: string;
}

export const ADD_ONS: AddOn[] = [
  {
    name: "Rush delivery",
    price: "+30%",
    detail: "About half the usual timeline.",
  },
  {
    name: "Extra revision round",
    price: "$150",
    detail: "One more round of changes on any project.",
  },
  {
    name: "Care plan",
    price: "$150/month",
    detail: "Updates, backups, and up to 2 hours of fixes a month.",
  },
  {
    name: "Copywriting",
    price: "$80/page",
    detail: "Clear, plain copy written for each page.",
  },
  {
    name: "Domain and hosting setup",
    price: "$100",
    detail: "Domain, DNS, hosting, and email set up for you.",
  },
];

export const PRICING_STEPS = [
  {
    title: "Tell us what you need",
    detail: "Send the contact form. We reply by email with questions.",
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

/** The cheapest way in, quoted in the FAQ and the markdown copy. */
export const LOWEST_PROJECT_PRICE = Math.min(
  ...SERVICE_PRICES.filter((service) => service.cadence === "project").map(
    (service) => service.price,
  ),
);
export const LOWEST_RETAINER_PRICE = Math.min(
  ...RETAINERS.map((retainer) => retainer.price),
);

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$1,500" */
export function formatUsd(amount: number) {
  return USD.format(amount);
}

export function cadenceLabel(cadence: Cadence) {
  return cadence === "month" ? "/month" : "/project";
}
