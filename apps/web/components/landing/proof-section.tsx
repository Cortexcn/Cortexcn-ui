import Image from "next/image";
import type { ReactNode } from "react";

import { COMPONENT_COUNT_LABEL } from "@/lib/component-count";
import {
  PROOF_STATS,
  SHOW_PLACEHOLDERS,
  TRUSTED_BY,
  TRUSTED_BY_PLACEHOLDER_SLOTS,
} from "@/lib/site-config";

import { Container } from "./primitives";

/** The proof line, from `lib/site-config.ts`; a stat set to null is left out. */
function proofItems() {
  const { components, installsThisMonth, clientProjects, templatesSold } =
    PROOF_STATS;
  const items = [
    `${components ?? COMPONENT_COUNT_LABEL} components`,
    installsThisMonth === null
      ? null
      : `${installsThisMonth.toLocaleString("en-US")} installs this month`,
    clientProjects === null
      ? null
      : `${clientProjects} client projects shipped`,
    templatesSold === null
      ? null
      : `${templatesSold.toLocaleString("en-US")} templates sold`,
  ];
  return items.filter((item): item is string => item !== null);
}

interface StackLogo {
  name: string;
  slug: string;
  /** Width over height of the logo file. */
  ratio: number;
  /** Wordmarks already spell the name; icons get it written next to them. */
  label: boolean;
}

/** The one row of tech-stack logos: what client projects are built with. */
const STACK_LOGOS: StackLogo[] = [
  { name: "Next.js", slug: "nextjs", ratio: 1, label: true },
  { name: "React", slug: "react", ratio: 600 / 180.32, label: false },
  { name: "Tailwind CSS", slug: "tailwindcss", ratio: 262 / 33, label: false },
  { name: "shadcn/ui", slug: "shadcn", ratio: 1, label: true },
  { name: "Vercel", slug: "vercel", ratio: 262 / 52, label: false },
  { name: "Claude", slug: "claude", ratio: 512 / 110, label: false },
];

function StackLogoImage({
  logo,
  variant,
}: {
  logo: StackLogo;
  variant: "light" | "dark";
}) {
  const height = logo.label ? 20 : 18;
  return (
    <Image
      alt={!logo.label && variant === "light" ? logo.name : ""}
      className={variant === "light" ? "dark:hidden" : "hidden dark:block"}
      height={height}
      src={`/logos/stack/${logo.slug}-${variant}.svg`}
      style={{ height, width: "auto", maxWidth: 120 }}
      unoptimized
      width={Math.round(height * logo.ratio)}
    />
  );
}

const rowLabelClassName =
  "w-28 shrink-0 font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]";

const cellClassName =
  "flex h-20 min-w-36 flex-1 shrink-0 items-center justify-center gap-2 border-border border-r px-4";

function LogoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col border-border border-b md:flex-row md:items-center">
      <p className={`${rowLabelClassName} px-4 pt-4 md:pt-0 md:pl-0`}>
        {label}
      </p>
      {/* One row on every screen; it scrolls sideways on phones. */}
      <ul className="no-scrollbar flex flex-1 overflow-x-auto border-border md:border-l">
        {children}
      </ul>
    </div>
  );
}

/**
 * The strip under the hero: the proof line, one row of the stack, and the
 * "Trusted by" row, which shows once a client logo is added (and as empty
 * slots in dev).
 */
export function ProofSection() {
  const items = proofItems();
  const showTrustedBy = TRUSTED_BY.length > 0 || SHOW_PLACEHOLDERS;

  return (
    <section aria-label="Proof" className="w-full border-border border-y">
      <Container className="flex flex-col">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-border border-b py-5 text-center font-medium font-mono text-foreground text-sm uppercase tracking-[-0.04em]">
          {items.map((item, index) => (
            <span className="flex items-center gap-3" key={item}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-faint">
                  ·
                </span>
              ) : null}
              {item}
            </span>
          ))}
        </p>

        <LogoRow label="Built with">
          {STACK_LOGOS.map((logo) => (
            <li className={cellClassName} key={logo.slug}>
              <StackLogoImage logo={logo} variant="light" />
              <StackLogoImage logo={logo} variant="dark" />
              {logo.label ? (
                <span className="whitespace-nowrap font-semibold text-foreground text-sm tracking-tight">
                  {logo.name}
                </span>
              ) : null}
            </li>
          ))}
        </LogoRow>

        {showTrustedBy ? (
          <LogoRow label="Trusted by">
            {TRUSTED_BY.length > 0
              ? TRUSTED_BY.map((logo) => (
                  <li className={cellClassName} key={logo.name}>
                    {logo.url ? (
                      <a href={logo.url} rel="noopener" target="_blank">
                        <Image
                          alt={logo.name}
                          className="h-6 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                          height={24}
                          src={logo.src}
                          unoptimized
                          width={96}
                        />
                      </a>
                    ) : (
                      <Image
                        alt={logo.name}
                        className="h-6 w-auto opacity-80 grayscale"
                        height={24}
                        src={logo.src}
                        unoptimized
                        width={96}
                      />
                    )}
                  </li>
                ))
              : Array.from(
                  { length: TRUSTED_BY_PLACEHOLDER_SLOTS },
                  (_, slot) => (
                    <li
                      className={cellClassName}
                      // biome-ignore lint/suspicious/noArrayIndexKey: empty slots never reorder
                      key={slot}
                    >
                      <span className="flex h-10 w-full items-center justify-center border border-border border-dashed font-mono text-label-weak text-xs uppercase">
                        Client logo
                      </span>
                    </li>
                  ),
                )}
          </LogoRow>
        ) : null}
      </Container>
    </section>
  );
}
