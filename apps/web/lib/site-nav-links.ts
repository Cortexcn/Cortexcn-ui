/**
 * Nav for the services site on www.cortexcn.dev: only its own pages and
 * landing sections. The components live on ui.cortexcn.dev, with their own
 * nav in `lib/library-nav-links.ts`.
 */
export const siteNavLinks = [
  { text: "Services", url: "/#services" },
  { text: "Pricing", url: "/pricing" },
  { text: "FAQ", url: "/#faq" },
  { text: "Contact", url: "/contact" },
] as const;
