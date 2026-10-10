import type { Metadata } from "next";
import { FONT_VARIABLES } from "@/components/systems/fonts";
import { SystemsShowcase } from "@/components/systems/systems-showcase";
import {
  getShowcaseSystems,
  getThemesCss,
  type ShowcaseSystem,
} from "@/lib/design-systems";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Design systems",
  description:
    "Switch every Cortexcn component between 25 DESIGN.md design systems, in light and dark mode. Colors, fonts, corners, sizes, shadows, and motion change; the component code does not.",
  path: "/design-systems",
});

const CLOSING_TAG = /<\//g;

/** Points each system's font stacks at the next/font variables. */
function fontCss(systems: ShowcaseSystem[]) {
  return systems
    .map((system) => {
      const declarations = (["display", "body", "mono"] as const).map(
        (role) => {
          const fallback = system.fonts.find(
            (font) => font.role === role,
          )?.fallback;
          const variable = fallback ? FONT_VARIABLES[fallback] : undefined;
          const stack = variable
            ? system.stacks[role].replace(`"${fallback}"`, `var(${variable})`)
            : system.stacks[role];
          return `--ds-font-${role}: ${stack};`;
        },
      );
      return `[data-theme="${system.id}"] .ds-fonts { ${declarations.join(" ")} }`;
    })
    .join("\n");
}

const SHOWCASE_CSS = `
.ds-fonts {
  font-family: var(--ds-font-body, var(--font-geist-sans));
  letter-spacing: var(--ds-tracking-body, normal);
  line-height: var(--ds-leading-body, 1.5);
}
.ds-fonts .ds-heading {
  font-family: var(--ds-font-display, var(--font-geist-sans));
  font-weight: var(--ds-weight-bold, 600);
  letter-spacing: var(--ds-tracking-display, -0.025em);
  line-height: var(--ds-leading-display, 1.1);
}
.ds-fonts .ds-mono {
  font-family: var(--ds-font-mono, var(--font-geist-mono));
}
`;

export default function SystemsPage() {
  const systems = getShowcaseSystems();
  const css = `${getThemesCss()}\n${fontCss(systems)}\n${SHOWCASE_CSS}`;
  return (
    <main className="container mx-auto flex w-full flex-col px-4 py-10 md:py-14">
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: our own theme.css files from design-systems/, read at build time
        dangerouslySetInnerHTML={{ __html: css.replace(CLOSING_TAG, "<\\/") }}
      />
      <SystemsShowcase systems={systems} />
    </main>
  );
}
