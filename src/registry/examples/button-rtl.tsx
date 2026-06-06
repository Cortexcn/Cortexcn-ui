"use client";

import * as React from "react";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const content = {
  ltr: {
    button: "Button",
    delete: "Delete",
    submit: "Submit",
    loading: "Loading",
  },
  rtl: {
    button: "زر",
    delete: "حذف",
    submit: "إرسال",
    loading: "جاري التحميل",
  },
} as const;

export default function ButtonRtl() {
  const [dir, setDir] = React.useState<"ltr" | "rtl">("rtl");
  const t = content[dir];

  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDir((d) => (d === "rtl" ? "ltr" : "rtl"))}
      >
        Toggle dir ({dir})
      </Button>

      <div className="flex flex-wrap items-center gap-2 md:flex-row" dir={dir}>
        <Button variant="outline">{t.button}</Button>
        <Button variant="destructive">{t.delete}</Button>
        <Button variant="outline">
          {t.submit}{" "}
          <ArrowRightIcon className="rtl:rotate-180" data-icon="inline-end" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button variant="secondary" disabled>
          <Spinner data-icon="inline-start" /> {t.loading}
        </Button>
      </div>
    </div>
  );
}
