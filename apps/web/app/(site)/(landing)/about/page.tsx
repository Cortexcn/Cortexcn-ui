import Image from "next/image";
import Link from "next/link";

import { ActionLink, ArrowUpRightIcon } from "@/components/landing/kit";
import { LandingFooter } from "@/components/landing/landing-footer";
import { Container } from "@/components/landing/primitives";
import { TitleBand } from "@/components/landing/title-band";
import { BUILD_IN_PUBLIC } from "@/components/product-credit";
import { ServicesLabel } from "@/components/services/services-label";
import { COMPONENT_COUNT_LABEL } from "@/lib/component-count";
import { CONTACT_EMAIL, CONTACT_LOCATION } from "@/lib/contact-details";
import { pageMetadata } from "@/lib/seo";
import { ABOUT_PHOTO, PROOF_STATS } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "About",
  description: `Syed Moinuddin, a software engineer in ${CONTACT_LOCATION}. I build websites, web apps, and AI features for clients, and the Cortexcn component library they are built from.`,
  path: "/about",
});

const SHIPPED = [
  PROOF_STATS.clientProjects === null
    ? null
    : {
        value: PROOF_STATS.clientProjects,
        label: "Client projects",
        body: "Landing pages, websites, stores, and web apps, each with its code in the client's repo.",
        href: "/work",
      },
  {
    value: PROOF_STATS.components ?? COMPONENT_COUNT_LABEL,
    label: "Components",
    body: "The Cortexcn library of React components, charts, and blocks, installed with the shadcn CLI.",
    href: "/docs/components",
  },
  {
    value: "MCP",
    label: "MCP server",
    body: "A hosted server that lets AI agents search, read, and install Cortexcn components.",
    href: "/docs/integration/mcp",
  },
].filter((item) => item !== null);

const STACK = ["Go", "TypeScript", "Next.js", "AWS", "AI pipelines"];

const LINKS = [
  {
    label: "GitHub",
    value: "SyedMoin-Lab",
    href: "https://github.com/SyedMoin-Lab",
  },
  { label: "X", value: BUILD_IN_PUBLIC.handle, href: BUILD_IN_PUBLIC.url },
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

/** The photo, or a framed monogram until `ABOUT_PHOTO.src` is set. */
function Photo() {
  if (ABOUT_PHOTO.src) {
    return (
      <Image
        alt={ABOUT_PHOTO.alt}
        className="aspect-[4/5] h-auto w-full border border-border object-cover"
        height={500}
        priority
        src={ABOUT_PHOTO.src}
        width={400}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[4/5] w-full items-center justify-center border border-border border-dashed bg-muted"
    >
      <span className="font-pixel text-7xl text-primary">SM</span>
    </div>
  );
}

const labelClassName =
  "font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]";

export default function AboutPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="About" />

        <section aria-label="Introduction" className="w-full py-20 md:py-24">
          <Container className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div className="max-w-sm">
              <Photo />
            </div>
            <div className="flex flex-col justify-end gap-8">
              <p className="max-w-3xl text-balance text-[2rem] leading-[1.15] tracking-[-0.05em] sm:text-[2.5rem]">
                I am Syed Moinuddin, a software engineer in {CONTACT_LOCATION}.{" "}
                <span className="text-muted-foreground">
                  I build websites, web apps, and AI features for clients, and
                  the Cortexcn component library they are built from.
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <ActionLink href="/contact" label="Start a project" />
                <Link
                  className="font-medium font-mono text-foreground text-sm uppercase underline underline-offset-4 transition-colors hover:text-primary"
                  href="/work"
                >
                  See the work
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section
          aria-labelledby="shipped"
          className="w-full border-border border-t py-20 md:py-24"
        >
          <Container className="flex flex-col gap-12">
            <ServicesLabel label="Shipped" />
            <h2
              className="font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
              id="shipped"
            >
              What I&apos;ve shipped.
            </h2>
            <ul className="grid border-border border-t border-l md:grid-cols-3">
              {SHIPPED.map((item) => (
                <li
                  className="group relative flex min-h-56 flex-col justify-between gap-8 border-border border-r border-b p-6"
                  key={item.label}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-5xl tabular-nums leading-none tracking-[-0.05em]">
                      {item.value}
                    </span>
                    <ArrowUpRightIcon className="size-4 text-faint transition-colors group-hover:text-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-xl leading-[1.2] tracking-[-0.05em]">
                      <Link
                        className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary focus-visible:after:ring-inset"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </h3>
                    <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section
          aria-label="Stack and links"
          className="w-full border-border border-t py-20 md:py-24"
        >
          <Container className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <ServicesLabel label="Stack" />
              <ul className="flex flex-wrap gap-2">
                {STACK.map((item) => (
                  <li
                    className="border border-border px-2.5 py-1.5 font-medium font-mono text-foreground text-sm uppercase leading-[1.3] tracking-[-0.04em]"
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <ServicesLabel label="Links" />
              <ul className="flex flex-col gap-2">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      className="group flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]"
                      href={link.href}
                      rel={
                        link.href.startsWith("http") ? "noopener" : undefined
                      }
                      target={
                        link.href.startsWith("http") ? "_blank" : undefined
                      }
                    >
                      <span className={`w-16 shrink-0 ${labelClassName}`}>
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px min-w-6 flex-1 border-border border-t border-dashed"
                      />
                      <span className="text-foreground transition-colors group-hover:text-primary">
                        {link.value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
