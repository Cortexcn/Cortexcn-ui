"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { getNavItemIcon } from "./constants";

export interface NavGroup {
  id: string;
  name: string;
  pages: { name: string; url: string }[];
}

// Sub-item stride (button h-7 = 28px + menu gap-1 = 4px) used to position the
// animated diamond against the active page.
const ITEM_STRIDE = 32;
const ITEM_OFFSET = 16;

function TreeIndicator({ activeIndex }: { activeIndex: number }) {
  const hasActive = activeIndex >= 0;
  const y = activeIndex * ITEM_STRIDE + ITEM_OFFSET;
  const spring = {
    type: "spring" as const,
    stiffness: 200 - activeIndex * 10,
    damping: 20,
  };

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 z-10 ml-[5px] h-full w-5! text-muted duration-200"
    >
      <ellipse
        className="text-path"
        cx="50%"
        cy="calc(100% - 15px)"
        rx="2"
        ry="2"
        fill="currentColor"
      />
      <rect
        className="text-path"
        x="9.5"
        y="0"
        width="1"
        height="calc(100% - 15px)"
        fill="currentColor"
      />
      {hasActive && (
        <>
          <motion.line
            className="text-primary"
            x1="50%"
            y1="0"
            x2="50%"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ y2: 0, opacity: 0 }}
            animate={{ y2: y, opacity: 1 }}
            transition={spring}
          />
          <motion.rect
            className="text-primary"
            x="32.1%"
            width="7"
            height="7"
            rx="1"
            fill="currentColor"
            style={{
              rotate: 45,
              transformOrigin: "center",
              transformBox: "fill-box",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y, opacity: 1 }}
            transition={spring}
          />
        </>
      )}
    </svg>
  );
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      {groups.map((group) => {
        if (group.pages.length === 0) return null;

        const activeIndex = group.pages.findIndex((p) => p.url === pathname);
        const hasActiveChild = activeIndex >= 0;
        const defaultOpen =
          hasActiveChild || group.name.toLowerCase() === "components";

        return (
          <SidebarGroup key={group.id}>
            <SidebarMenu>
              <Collapsible
                asChild
                defaultOpen={defaultOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={hasActiveChild}
                      className={cn(
                        !hasActiveChild &&
                          "text-muted-foreground/90 hover:text-primary dark:text-muted-foreground/80 dark:hover:text-primary",
                      )}
                    >
                      {getNavItemIcon(group.name)}
                      <span className="capitalize">{group.name}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="relative">
                      <TreeIndicator activeIndex={activeIndex} />
                      {group.pages.map((page) => {
                        const isActive = page.url === pathname;

                        return (
                          <SidebarMenuSubItem key={page.url}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive}
                              className={cn(
                                "pl-4",
                                !isActive &&
                                  "text-muted-foreground/90 hover:text-primary dark:text-muted-foreground/80 dark:hover:text-primary",
                              )}
                            >
                              <Link href={page.url} onClick={handleLinkClick}>
                                <span className="capitalize">{page.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
