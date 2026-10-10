import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge, taught the design-system utilities from
 * styles/cortexcn-recipes.css (rounded-button, h-input, shadow-menu, ...),
 * so a className such as "h-12" still overrides a component's default.
 * Keep these lists in step with that file.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "button",
        "button-xs",
        "button-sm",
        "button-lg",
        "button-x",
        "button-x-xs",
        "input",
        "input-x",
        "badge-x",
        "accordion",
        "dialog",
      ],
      radius: [
        "button",
        "button-xs",
        "button-sm",
        "input",
        "input-inner",
        "card",
        "badge",
        "tabs",
        "tabs-trigger",
        "dialog",
        "menu",
        "menu-lg",
        "menu-xl",
        "menu-item",
        "menu-item-md",
        "menu-item-lg",
        "control",
        "tooltip",
        "tooltip-arrow",
        "alert",
        "inherit",
        "app-icon",
        "command",
        "faq",
        "faq-inner",
        "lanyard",
      ],
      shadow: [
        "button",
        "input",
        "card",
        "tabs",
        "dialog",
        "menu",
        "menu-lg",
        "sidebar-border",
        "sidebar-accent",
        "command",
        "command-dark",
        "faq",
        "faq-dark",
        "lanyard",
        "lanyard-slot",
      ],
      "drop-shadow": ["command"],
      "font-weight": ["button", "badge", "accordion"],
    },
    classGroups: {
      duration: [{ duration: ["fast", "base", "slow", "accordion"] }],
      ease: [{ ease: ["ds"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
