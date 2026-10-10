"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

import { CortexcnLogo } from "@/components/icons/cortexcn";
import { SyedMoinMark } from "@/components/icons/syedmoin-mark";
import { ProductCredit } from "@/components/product-credit";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
} from "@/lib/contact-details";
import { DOCS_URL } from "@/lib/site-url";

import { ArrowUpRightIcon } from "./kit";
import { Container } from "./primitives";

const PAGE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Introduction", href: "/docs" },
  { label: "Installation", href: "/docs/installation" },
  { label: "Components", href: "/docs/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Charts", href: "/charts/area-chart" },
  { label: "Theming", href: "/docs/theming" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Newsletter() {
  const [note, setNote] = useState<string | null>(null);

  // Signups are not wired to a mailing list yet, so say so instead of faking it.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNote("Email updates open at launch. Check back soon.");
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-medium text-2xl leading-[1.3] tracking-[-0.05em]">
          <span className="text-primary">@</span> Stay in the loop.
        </p>
        <p className="max-w-100 text-body text-lg leading-[1.3] tracking-[-0.05em]">
          New components, blocks, and release notes. One short email when
          something ships.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <form
          className="flex h-12 w-full max-w-105 items-center bg-muted p-1"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="footer-email">
            Email
          </label>
          <input
            autoComplete="email"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-base text-foreground tracking-[-0.05em] outline-none placeholder:text-faint"
            id="footer-email"
            name="email"
            placeholder="Enter your email"
            required
            type="email"
          />
          <button
            className="h-10 shrink-0 bg-foreground px-3 font-mono font-semibold text-background text-base uppercase tracking-[-0.05em] transition-colors hover:bg-primary hover:text-primary-foreground"
            type="submit"
          >
            Join
          </button>
        </form>
        <p aria-live="polite" className="min-h-5 text-muted-foreground text-sm">
          {note}
        </p>
      </div>
    </div>
  );
}

function FooterHeading({ children }: { children: string }) {
  return (
    <p className="font-semibold text-sm uppercase leading-[1.3] tracking-[-0.05em]">
      {children}
    </p>
  );
}

const productRowClassName =
  "flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]";

/** What Cortexcn makes. */
function Products() {
  return (
    <div className="flex flex-col gap-4 border-border border-t p-6 sm:p-10">
      <FooterHeading>Products</FooterHeading>
      <ul className="flex flex-col gap-2">
        <li>
          <a
            className={`group ${productRowClassName}`}
            href={`${DOCS_URL}/`}
            rel="noreferrer"
            target="_blank"
          >
            <CortexcnLogo size={20} theme="auto" />
            <span className="font-medium text-foreground transition-colors group-hover:text-primary">
              Cortexcn
            </span>
            <span
              aria-hidden="true"
              className="h-px min-w-6 flex-1 border-border border-t border-dashed"
            />
            <span className="hidden text-right sm:inline">
              Components, charts, and blocks
            </span>
            <ArrowUpRightIcon className="size-3.5 shrink-0 text-faint transition-colors group-hover:text-primary" />
          </a>
        </li>
      </ul>
    </div>
  );
}

const CONTACT_ROWS = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  {
    label: "Phone",
    value: CONTACT_PHONE.display,
    href: `tel:${CONTACT_PHONE.e164}`,
  },
  { label: "Location", value: CONTACT_LOCATION },
];

const contactRowClassName =
  "flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]";

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="w-18 shrink-0 font-medium text-foreground">{label}</span>
      <span
        aria-hidden="true"
        className="h-px min-w-6 flex-1 border-border border-t border-dashed"
      />
      <span className="text-right transition-colors group-hover:text-primary">
        {value}
      </span>
    </>
  );
}

function GetInTouch() {
  return (
    <div className="flex flex-col gap-4 border-border border-t p-6 sm:p-10">
      <FooterHeading>Get in touch</FooterHeading>
      <ul className="flex flex-col gap-2">
        {CONTACT_ROWS.map((row) => (
          <li key={row.label}>
            {row.href ? (
              <a className={`group ${contactRowClassName}`} href={row.href}>
                <ContactRow label={row.label} value={row.value} />
              </a>
            ) : (
              <p className={contactRowClassName}>
                <ContactRow label={row.label} value={row.value} />
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="w-full border-border border-t bg-background">
      <Container>
        <div className="grid border-border border-b lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-16 border-border border-x p-6 sm:p-10">
            <Newsletter />
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <CortexcnLogo
                  className="size-16 rounded-[10px] sm:size-22"
                  size={88}
                  theme="auto"
                />
                <span className="font-medium text-[3.5rem] leading-none tracking-[-0.06em] sm:text-[5.5rem]">
                  Cortexcn
                </span>
              </div>
              <ProductCredit className="text-base leading-[1.3] tracking-[-0.05em]" />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-border border-x border-t lg:border-t-0 lg:border-l-0">
            <div className="flex flex-col gap-4 border-border border-b p-6 sm:p-10">
              <FooterHeading>Pages</FooterHeading>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {PAGE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-base text-body leading-[1.3] tracking-[-0.05em] transition-colors hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Products />
            <GetInTouch />
          </div>
        </div>

        <div className="flex flex-col gap-4 py-10 text-sm leading-[1.3] tracking-[-0.05em] md:flex-row md:items-center md:justify-between">
          <p>© Cortexcn 2026. All rights reserved.</p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              href="/privacy"
            >
              Privacy policy
            </Link>
            <span>/</span>
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              href="/terms"
            >
              Terms and conditions
            </Link>
            <span>/</span>
            <Link
              className="underline underline-offset-2 hover:text-foreground"
              href="/refunds"
            >
              Refund policy
            </Link>
          </p>
          <a
            className="flex items-center gap-2 text-muted-foreground"
            href="https://syedmoinuddin.com"
            rel="noreferrer"
            target="_blank"
          >
            Created by
            <SyedMoinMark
              aria-hidden="true"
              className="h-2.5 w-auto text-foreground"
            />
            <span className="font-semibold text-foreground">
              Syed Moinuddin
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
