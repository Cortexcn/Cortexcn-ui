/**
 * Nav for the services site on www.cortexcn.dev. Components and Templates
 * live on ui.cortexcn.dev; the proxy sends those paths there in production.
 * The library has its own nav in `lib/library-nav-links.ts`.
 */
export const siteNavLinks = [
  { text: "Components", url: "/docs/components" },
  { text: "Templates", url: "/templates" },
  { text: "Work", url: "/work" },
  { text: "Services", url: "/services" },
  { text: "Pricing", url: "/pricing" },
  { text: "About", url: "/about" },
  { text: "Contact", url: "/contact" },
] as const;
