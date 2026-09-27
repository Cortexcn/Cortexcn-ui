import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/landing/primitives";
import { CONTACT_EMAIL } from "@/lib/contact-details";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

/**
 * Layout shared by the privacy policy and the terms: a rail with the date,
 * a short summary, and the section list, next to the numbered sections.
 */
export function LegalDocument({
  label,
  updated,
  summary,
  sections,
}: {
  label: string;
  updated: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <section
      aria-label={label}
      className="w-full pt-16 pb-20 md:pt-24 md:pb-24"
    >
      <div className="border-border border-y">
        <Container>
          <div className="grid border-border border-x lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <aside className="border-border border-b p-6 sm:p-10 lg:border-r lg:border-b-0">
              <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--site-header-height)+2.5rem)]">
                <span className="self-start bg-muted px-1 py-0.5 font-medium font-mono text-body text-xs uppercase leading-[1.3] tracking-[-0.04em]">
                  Last updated {updated}
                </span>
                <p className="text-xl leading-[1.3] tracking-[-0.05em]">
                  {summary}
                </p>
                <nav aria-label="Sections">
                  <ol className="flex flex-col gap-2">
                    {sections.map((section, index) => (
                      <li key={section.id}>
                        <a
                          className="group flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]"
                          href={`#${section.id}`}
                        >
                          <span className="w-5 shrink-0 font-medium font-mono text-label-weak text-xs tracking-[-0.04em]">
                            {indexLabel(index)}
                          </span>
                          <span className="transition-colors group-hover:text-primary">
                            {section.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <p className="text-body text-sm leading-[1.3] tracking-[-0.03em]">
                  Questions? Write to{" "}
                  <LegalLink href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </LegalLink>
                  .
                </p>
              </div>
            </aside>

            <div className="flex min-w-0 flex-col">
              {sections.map((section, index) => (
                <section
                  aria-labelledby={`${section.id}-title`}
                  className="flex scroll-mt-(--site-header-height) flex-col gap-4 border-border border-t p-6 first:border-t-0 sm:p-10"
                  id={section.id}
                  key={section.id}
                >
                  <h2
                    className="flex items-baseline gap-3 font-medium text-2xl leading-[1.2] tracking-[-0.05em]"
                    id={`${section.id}-title`}
                  >
                    <span className="font-medium font-mono text-label-weak text-sm tracking-[-0.04em]">
                      {indexLabel(index)}
                    </span>
                    {section.title}
                  </h2>
                  <div className="flex flex-col gap-4 text-body text-lg leading-[1.45] tracking-[-0.03em]">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-3">{children}</ul>;
}

export function LegalItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-[0.6em] size-1.5 shrink-0 bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}

const legalLinkClassName =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-primary";

/** Site pages go through the router; other sites open in a new tab. */
export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link className={legalLinkClassName} href={href}>
        {children}
      </Link>
    );
  }
  const isExternal = href.startsWith("http");
  return (
    <a
      className={legalLinkClassName}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}
