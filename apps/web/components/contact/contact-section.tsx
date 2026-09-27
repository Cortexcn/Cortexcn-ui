import type { ReactNode } from "react";

import { CortexcnMark } from "@/components/icons/cortexcn-mark";
import { Container } from "@/components/landing/primitives";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
} from "@/lib/contact-details";
import { cn } from "@/lib/utils";

import { ContactForm } from "./contact-form";

type InfoIcon = "email" | "phone" | "location";

const INFO_ICON_PATHS: Record<InfoIcon, string> = {
  email:
    "M3.5 4.5h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zM3 5.5l7 5 7-5",
  phone:
    "M7 2.5h6a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1zM9 15h2",
  location:
    "M10 17.5s5.5-4.9 5.5-9.25a5.5 5.5 0 0 0-11 0c0 4.35 5.5 9.25 5.5 9.25zM10 10.25a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
};

const valueClassName = "text-lg leading-[1.3] tracking-[-0.05em]";

const linkClassName = cn(
  valueClassName,
  "underline decoration-1 underline-offset-4 transition-colors hover:text-primary",
);

function InfoCell({
  icon,
  label,
  className,
  children,
}: {
  icon: InfoIcon;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-10 p-6 sm:p-10", className)}>
      <span className="flex size-10 items-center justify-center border border-border text-foreground">
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.25"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={INFO_ICON_PATHS[icon]} />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-body text-sm leading-[1.3] tracking-[-0.03em]">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <section
      aria-label="Contact form and details"
      className="w-full pt-16 pb-20 md:pt-24 md:pb-24"
    >
      <div className="border-border border-y">
        <Container>
          <div className="grid border-border border-x lg:grid-cols-2">
            <div className="flex flex-col justify-between gap-12 p-6 sm:p-10">
              <div className="flex max-w-120 flex-col gap-6 text-xl leading-[1.3] tracking-[-0.05em] sm:text-2xl">
                <p>
                  Questions, support, bug reports, custom work, or just a hello.
                  Every message reaches the people who build Cortexcn.
                </p>
                <p className="text-body">
                  We work remotely from {CONTACT_LOCATION}, so email is the
                  fastest way to reach us. This form lands in the same inbox.
                </p>
              </div>
              <CortexcnMark className="size-32 text-primary sm:size-40 lg:size-48" />
            </div>
            <div className="border-border border-t p-6 sm:p-10 lg:border-t-0 lg:border-l">
              <ContactForm />
            </div>
          </div>
        </Container>
      </div>

      <div className="border-border border-b">
        <Container>
          <div className="grid border-border border-x sm:grid-cols-2 lg:grid-cols-4">
            <InfoCell
              className="border-border border-b sm:border-r lg:border-b-0"
              icon="email"
              label="Email"
            >
              <a className={linkClassName} href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </InfoCell>
            <InfoCell
              className="border-border border-b lg:border-r lg:border-b-0"
              icon="phone"
              label="Phone"
            >
              <a className={linkClassName} href={`tel:${CONTACT_PHONE.e164}`}>
                {CONTACT_PHONE.display}
              </a>
            </InfoCell>
            <InfoCell
              className="sm:col-span-2"
              icon="location"
              label="Location"
            >
              <p className={valueClassName}>{CONTACT_LOCATION}</p>
            </InfoCell>
          </div>
        </Container>
      </div>
    </section>
  );
}
