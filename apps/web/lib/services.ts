import { SERVICE_PRICES, type ServicePrice } from "@/lib/service-pricing";

/**
 * What I build for clients, shown on /services. Prices and timelines come
 * from `SERVICE_PRICES`, matched by title, so they change in one place.
 */
export interface Service {
  title: string;
  description: string;
  tags: [string, string];
}

export const SERVICES: Service[] = [
  {
    title: "Landing pages",
    description:
      "Launch and campaign pages, from the first sketch to the live URL.",
    tags: ["Design", "Launch"],
  },
  {
    title: "Websites",
    description:
      "Company sites and portfolios on Next.js, fast to load and easy to update.",
    tags: ["Next.js", "CMS"],
  },
  {
    title: "E-commerce",
    description:
      "Product pages, cart, checkout, and payments, ready for real orders.",
    tags: ["Checkout", "Payments"],
  },
  {
    title: "Web apps + APIs",
    description:
      "Dashboards, portals, and SaaS products, with the APIs, databases, and services behind them.",
    tags: ["Auth", "APIs"],
  },
  {
    title: "AI features",
    description:
      "AI built into your product: retrieval over your data, agents, and tool calls.",
    tags: ["RAG", "Agents"],
  },
  {
    title: "Retainer",
    description:
      "I join your team for 40 or more hours a month, for a sprint or for as long as you need.",
    tags: ["Monthly", "Any service"],
  },
];

/** The starting price and timeline for a service, if it has one. */
export function servicePrice(title: string): ServicePrice | undefined {
  return SERVICE_PRICES.find((price) => price.title === title);
}
