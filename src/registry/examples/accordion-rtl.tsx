"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const content = {
  ltr: {
    dir: "ltr" as const,
    items: [
      {
        value: "item-1",
        q: "How do I reset my password?",
        a: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password.",
      },
      {
        value: "item-2",
        q: "Can I change my subscription plan?",
        a: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
      },
      {
        value: "item-3",
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
      },
    ],
  },
  rtl: {
    dir: "rtl" as const,
    items: [
      {
        value: "item-1",
        q: "كيف يمكنني إعادة تعيين كلمة المرور؟",
        a: "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.",
      },
      {
        value: "item-2",
        q: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
        a: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.",
      },
      {
        value: "item-3",
        q: "ما هي طرق الدفع التي تقبلونها؟",
        a: "نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية.",
      },
    ],
  },
};

export default function AccordionRtl() {
  const [mode, setMode] = React.useState<"rtl" | "ltr">("rtl");
  const { dir, items } = content[mode];

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode((m) => (m === "rtl" ? "ltr" : "rtl"))}
      >
        Toggle dir ({mode})
      </Button>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
        dir={dir}
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
