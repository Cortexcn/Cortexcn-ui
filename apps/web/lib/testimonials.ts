import { SHOW_PLACEHOLDERS } from "@/lib/site-config";

/**
 * What clients say about working with me, shown on the www home page.
 *
 * Only add real quotes from real clients, with their permission to publish
 * their name, role, and words. Placeholder entries show while you run
 * `bun run dev`, so you can see the layout, and never in a production build;
 * the section stays hidden there until a real quote is added.
 */
export interface ClientTestimonial {
  quote: string;
  name: string;
  /** Their job title, such as "Founder" or "Head of Marketing". */
  role: string;
  company?: string;
  /** What I built for them, such as "Landing page" or "Web app". */
  project?: string;
  /** Their site or profile, if they want it linked. */
  url?: string;
  /** Sample content for the layout. Never shown in production. */
  placeholder?: boolean;
}

const ENTRIES: ClientTestimonial[] = [
  {
    quote:
      "[A short quote from a client about what you built and what changed for them.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    project: "[Startup site]",
    placeholder: true,
  },
  {
    quote:
      "[A short quote from a client about how the project ran, from the quote to launch.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    project: "[Law firm site]",
    placeholder: true,
  },
  {
    quote:
      "[A short quote from a client about the result, ideally with a number.]",
    name: "[Client name]",
    role: "[Role]",
    company: "[Company]",
    project: "[Web app]",
    placeholder: true,
  },
];

/** The quotes this build shows: real ones, plus placeholders in dev. */
export const CLIENT_TESTIMONIALS: ClientTestimonial[] = ENTRIES.filter(
  (entry) => SHOW_PLACEHOLDERS || !entry.placeholder,
);
