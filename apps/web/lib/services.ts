import { SERVICE_PRICES, type ServicePrice } from "@/lib/service-pricing";

/**
 * What we build for clients, shown on /services. Prices and timelines come
 * from `SERVICE_PRICES`, matched by title, so they change in one place.
 */
export interface Service {
  title: string;
  description: string;
  tags: [string, string];
}

export const SERVICES: Service[] = [
  {
    title: "Websites",
    description:
      "Company sites and portfolios on Next.js, fast to load and easy to update.",
    tags: ["Next.js", "CMS"],
  },
  {
    title: "Landing pages",
    description:
      "Launch and campaign pages, from the first sketch to the live URL.",
    tags: ["Design", "Launch"],
  },
  {
    title: "E-commerce stores",
    description:
      "Product pages, cart, checkout, and payments, ready for real orders.",
    tags: ["Checkout", "Payments"],
  },
  {
    title: "Web applications",
    description:
      "Dashboards, portals, and SaaS products with sign-in, roles, and data.",
    tags: ["Auth", "Dashboards"],
  },
  {
    title: "Backend and APIs",
    description:
      "APIs, databases, auth, and background jobs that hold up in production.",
    tags: ["APIs", "Databases"],
  },
  {
    title: "Microservices",
    description:
      "Split a monolith or design new services, with queues and clean deploys.",
    tags: ["Queues", "Deploys"],
  },
  {
    title: "AI pipelines",
    description:
      "AI features built into your product: retrieval, agents, and tool calls.",
    tags: ["RAG", "Agents"],
  },
  {
    title: "SEO",
    description:
      "Technical SEO: metadata, structured data, sitemaps, and page speed.",
    tags: ["Schema", "Speed"],
  },
  {
    title: "Research papers",
    description:
      "Support for research papers: code, experiments, figures, and editing.",
    tags: ["Experiments", "Editing"],
  },
  {
    title: "Freelance work",
    description:
      "An extra engineer on your team, for a sprint or on a monthly retainer.",
    tags: ["Sprints", "Retainer"],
  },
];

/** The starting price and timeline for a service, if it has one. */
export function servicePrice(title: string): ServicePrice | undefined {
  return SERVICE_PRICES.find((price) => price.title === title);
}
