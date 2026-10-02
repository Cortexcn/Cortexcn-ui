import {
  openInV0Href,
  registryJsonUrlForName,
  registryV0ExampleJsonUrl,
  shadcnAddItem,
} from "@/lib/registry-links";

export function blockRegistryJsonUrl(name: string) {
  return registryJsonUrlForName(name);
}

export function blockOpenInV0Href(name: string) {
  return openInV0Href(registryV0ExampleJsonUrl(name));
}

/** The block alone, full screen, for a new tab. */
export function blockLivePreviewPath(name: string) {
  return `/blocks/live/${name}`;
}

export function blockShadcnAddCommand(name: string) {
  return `npx shadcn@latest add ${shadcnAddItem(name)}`;
}
