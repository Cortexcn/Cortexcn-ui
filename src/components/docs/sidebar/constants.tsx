import {
  BlocksIcon,
  BookOpenIcon,
  ComponentIcon,
  DownloadIcon,
  HistoryIcon,
} from "lucide-react";

export interface SidebarOption {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export const getStartedOptions: SidebarOption[] = [
  { name: "Introduction", url: "/docs", icon: <BookOpenIcon /> },
  { name: "Installation", url: "/docs/installation", icon: <DownloadIcon /> },
  { name: "Changelog", url: "/docs/changelog", icon: <HistoryIcon /> },
];

// Folder landing pages + pages already surfaced in the static groups above are
// hidden from the auto-generated nav so they don't render twice.
export const EXCLUDED_PAGES: string[] = [
  "/docs",
  "/docs/installation",
  "/docs/changelog",
  "/docs/components",
  "/docs/blocks",
];

export function getNavItemIcon(name: string) {
  switch (name.toLowerCase()) {
    case "components":
      return <ComponentIcon />;
    case "blocks":
      return <BlocksIcon />;
    default:
      return null;
  }
}
