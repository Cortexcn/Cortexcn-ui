"use client";

import * as React from "react";
import { BluetoothIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const content = {
  ltr: {
    dir: "ltr" as const,
    smallTitle: "Allow accessory to connect?",
    smallDescription:
      "Do you want to allow the USB accessory to connect to this device?",
    dontAllow: "Don't allow",
    allow: "Allow",
    trigger: "Show Dialog",
  },
  rtl: {
    dir: "rtl" as const,
    smallTitle: "السماح للملحق بالاتصال؟",
    smallDescription: "هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟",
    dontAllow: "عدم السماح",
    allow: "السماح",
    trigger: "إظهار الحوار",
  },
};

export default function AlertDialogRtl() {
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{t.trigger}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm" dir={t.dir}>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <BluetoothIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>{t.smallTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.smallDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t.dontAllow}</AlertDialogCancel>
              <AlertDialogAction>{t.allow}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
