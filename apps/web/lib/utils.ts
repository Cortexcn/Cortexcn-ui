import { cn as registryCn } from "@cortexcn/ui/lib/utils";
import type { ClassValue } from "clsx";

/**
 * The cn the registry ships, so the site merges the design-system utilities
 * (rounded-button, h-input, ...) the same way installs do.
 */
export function cn(...inputs: ClassValue[]) {
  return registryCn(...inputs);
}
