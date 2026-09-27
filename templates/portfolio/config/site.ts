/**
 * Everything on the page comes from this file. Replace the sample content
 * with your own; no component needs to change.
 */
export const site = {
  name: "Riley Park",
  role: "Software Engineer",
  url: "https://example.com",
  email: "hello@example.com",
  location: "Lisbon, Portugal",
  since: 2019,

  hero: {
    tagline: "Shipping since",
  },

  bio: {
    greeting: "Hi there!",
    intro:
      "I'm Riley, a software engineer who turns rough ideas into fast, dependable web products.",
    paragraphs: [
      "I work across the stack with React, TypeScript, and Node, and I care about the details people feel: speed, clear interfaces, and code a team can keep changing.",
      "Lately I've been helping early-stage teams ship their first version, then staying around to make it faster and easier to maintain.",
    ],
    cta: { label: "Get in touch", href: "#contact" },
  },

  statement:
    "Good software feels simple. I plan, build, and ship products that load fast, read clearly, and keep working long after launch day.",

  services: [
    { title: "Web Applications", tags: ["React", "Next.js", "TypeScript"] },
    { title: "Design Systems", tags: ["Components", "Tokens", "Docs"] },
    { title: "Performance", tags: ["Core Web Vitals", "Audits", "Caching"] },
    {
      title: "Technical Advice",
      tags: ["Architecture", "Code Review", "Mentoring"],
    },
  ],

  projects: {
    allHref: "https://github.com/",
    items: [
      {
        title: "Lumen",
        description: "Analytics dashboard",
        href: "https://example.com",
        cover: "/projects/lumen.svg",
      },
      {
        title: "Harbor",
        description: "Booking platform",
        href: "https://example.com",
        cover: "/projects/harbor.svg",
      },
      {
        title: "Fieldnote",
        description: "Writing app",
        href: "https://example.com",
        cover: "/projects/fieldnote.svg",
      },
      {
        title: "Orbit",
        description: "Developer portal",
        href: "https://example.com",
        cover: "/projects/orbit.svg",
      },
    ],
  },

  // Sample quotes. Swap in real ones from people you've worked with.
  testimonials: [
    {
      quote:
        "Riley took our half-finished prototype and turned it into something we were proud to launch.",
      name: "Maya",
      role: "Product Manager",
    },
    {
      quote:
        "Clear updates every week, clean code, and no surprises at the end. Easy to work with.",
      name: "Daniel",
      role: "Startup Founder",
    },
    {
      quote:
        "Our dashboard went from sluggish to instant. Riley found problems we didn't know we had.",
      name: "Priya",
      role: "Engineering Lead",
    },
    {
      quote:
        "The design system Riley built still holds up two years and three redesigns later.",
      name: "Tom",
      role: "Design Director",
    },
    {
      quote:
        "Riley explains technical trade-offs in plain words, which made every decision faster.",
      name: "Lena",
      role: "Operations Manager",
    },
    {
      quote:
        "Shipped on time, documented everything, and handed over a codebase the team loves.",
      name: "Sam",
      role: "CTO",
    },
  ],

  writing: {
    allHref: "https://example.com/blog",
    blurb: "Notes on building, shipping, and the small details in between.",
    posts: [
      {
        title: "Making slow pages fast",
        excerpt:
          "A practical checklist for finding and fixing the things that slow a page down.",
        date: "2026-08-12",
        href: "https://example.com/blog/slow-pages",
        cover: "/posts/fast-pages.svg",
      },
      {
        title: "Design systems for small teams",
        excerpt:
          "How to start a component library without stopping product work.",
        date: "2026-06-03",
        href: "https://example.com/blog/design-systems",
        cover: "/posts/design-systems.svg",
      },
    ],
  },

  contact: {
    heading: "Let's talk.",
    description:
      "Have a project in mind or just want to say hi? Send a message and I'll get back to you.",
    // Optional. Paste a form endpoint (Formspree, Web3Forms, your own API)
    // to receive messages. Left empty, the form opens the visitor's email app.
    formEndpoint: "",
  },

  socials: [
    { label: "GitHub", href: "https://github.com/", icon: "github" },
    { label: "X", href: "https://x.com/", icon: "x" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  ],
} as const;

export type Site = typeof site;
