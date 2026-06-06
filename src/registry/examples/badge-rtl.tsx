"use client";

import * as React from "react";
import { BadgeCheck, BookmarkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const content = {
  ltr: {
    dir: "ltr" as const,
    badge: "Badge",
    secondary: "Secondary",
    verified: "Verified",
    bookmark: "Bookmark",
  },
  rtl: {
    dir: "rtl" as const,
    badge: "شارة",
    secondary: "ثانوي",
    verified: "متحقق",
    bookmark: "إشارة مرجعية",
  },
};

export default function BadgeRtl() {
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
      <div className="flex flex-wrap justify-center gap-2" dir={t.dir}>
        <Badge>{t.badge}</Badge>
        <Badge variant="secondary">{t.secondary}</Badge>
        <Badge variant="secondary">
          <BadgeCheck data-icon="inline-start" />
          {t.verified}
        </Badge>
        <Badge variant="outline">
          {t.bookmark}
          <BookmarkIcon data-icon="inline-end" />
        </Badge>
      </div>
    </div>
  );
}
