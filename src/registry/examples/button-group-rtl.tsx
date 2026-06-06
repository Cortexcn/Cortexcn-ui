"use client";

import * as React from "react";
import { ArrowLeftIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const content = {
  ltr: {
    dir: "ltr" as const,
    archive: "Archive",
    report: "Report",
    snooze: "Snooze",
    markAsRead: "Mark as Read",
  },
  rtl: {
    dir: "rtl" as const,
    archive: "أرشفة",
    report: "تقرير",
    snooze: "تأجيل",
    markAsRead: "وضع علامة كمقروء",
  },
};

export default function ButtonGroupRtl() {
  const [mode, setMode] = React.useState<"rtl" | "ltr">("rtl");
  const t = content[mode];

  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode((m) => (m === "rtl" ? "ltr" : "rtl"))}
      >
        Toggle dir ({mode})
      </Button>
      <div dir={t.dir}>
        <ButtonGroup>
          <Button variant="outline" size="icon" aria-label="Go Back">
            <ArrowLeftIcon className="rtl:rotate-180" />
          </Button>
          <Button variant="outline">{t.archive}</Button>
          <Button variant="outline">{t.report}</Button>
          <Button variant="outline">{t.snooze}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More Options">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>{t.markAsRead}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
}
