"use client";

import { LineNav, type LineNavItem } from "@bklitui/ui/components/line-nav";
import { startThemeTransition } from "@bklitui/ui/components/theme-toggle-effect";
import {
  type ExperienceItemType,
  WorkExperience,
} from "@bklitui/ui/components/work-experience";
import { useTheme } from "next-themes";
import { useState } from "react";

import { AppWindow, RegistryTag } from "./app-window";
import {
  CodeIcon,
  LayoutIcon,
  MoonIcon,
  PenToolIcon,
  SunIcon,
} from "./use-cases-section-icons";

const SECTIONS: LineNavItem[] = [
  { title: "About", href: "#about" },
  { title: "Work", href: "#work" },
  { title: "Projects", href: "#projects" },
  { title: "Writing", href: "#writing" },
  { title: "Contact", href: "#contact" },
];

/** A sample career for the mock portfolio. */
const EXPERIENCE: ExperienceItemType[] = [
  {
    id: "acme",
    companyName: "Acme",
    isCurrentEmployer: true,
    positions: [
      {
        id: "design-engineer",
        title: "Design engineer",
        employmentPeriod: { start: "03.2023" },
        icon: <PenToolIcon />,
        description:
          "Owns the design system and the dashboard UI.\n\n- Rebuilt the chart library on shared tokens.\n- Cut the time to ship a new report page from days to hours.",
        skills: ["React", "Next.js", "Tailwind CSS", "Motion"],
      },
      {
        id: "front-end-developer",
        title: "Front-end developer",
        employmentPeriod: { start: "06.2021", end: "02.2023" },
        icon: <CodeIcon />,
        description:
          "Built the onboarding flow and the billing pages, and wrote the first component tests.",
        skills: ["TypeScript", "Storybook"],
      },
    ],
  },
  {
    id: "freelance",
    companyName: "Freelance",
    positions: [
      {
        id: "ui-developer",
        title: "UI developer",
        employmentPeriod: { start: "2019", end: "2021" },
        icon: <LayoutIcon />,
        description: "Marketing sites and small web apps for local studios.",
        skills: ["HTML", "CSS", "JavaScript"],
      },
    ],
  },
];

/** Flips the site theme with the circle reveal from the registry. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    startThemeTransition(() => setTheme(next), "circle");
  };

  return (
    <button
      aria-label="Switch between light and dark mode"
      className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toggle}
      type="button"
    >
      <MoonIcon className="size-4 dark:hidden" />
      <SunIcon className="hidden size-4 dark:block" />
    </button>
  );
}

/**
 * A personal site: a line nav down the side, the live work experience
 * timeline, and a theme switch that plays the circle reveal on the page.
 */
export function UseCasesPortfolioWindow() {
  const [activeHref, setActiveHref] = useState("#work");

  return (
    <AppWindow className="flex h-full flex-col" title="Portfolio">
      <div className="@container flex min-h-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-border border-b @md:px-5 px-4">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-full bg-muted font-medium text-[11px] text-foreground"
          >
            AC
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-sm leading-5">
              Alex Chen
            </span>
            <span className="truncate text-muted-foreground text-xs">
              Design engineer
            </span>
          </span>
          <span className="ml-auto flex items-center gap-2">
            <RegistryTag
              className="@xl:inline-flex hidden"
              name="theme-toggle-effect-circle"
            />
            <ThemeToggle />
          </span>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="relative @xl:block hidden w-36 shrink-0 border-border border-r px-5">
            <LineNav
              activeHref={activeHref}
              className="py-6"
              items={SECTIONS}
              onItemClick={(item, event) => {
                // Stays in the window instead of jumping the page to an anchor.
                event.preventDefault();
                setActiveHref(item.href);
              }}
              scrollActiveIntoView={false}
            />
            <RegistryTag className="absolute bottom-3 left-4" name="line-nav" />
          </div>

          <div className="scrollbar-thin relative min-w-0 flex-1 overflow-y-auto [scrollbar-color:var(--border)_transparent]">
            <p className="@md:px-5 px-4 pt-4 font-medium text-muted-foreground text-xs">
              Experience
            </p>
            <WorkExperience
              className="@md:px-5 px-4 pb-2"
              experiences={EXPERIENCE}
            />
            <RegistryTag
              className="absolute top-3.5 right-4"
              name="work-experience"
            />
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
