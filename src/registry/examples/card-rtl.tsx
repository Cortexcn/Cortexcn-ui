"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const content = {
  ltr: {
    dir: "ltr" as const,
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    login: "Login",
  },
  rtl: {
    dir: "rtl" as const,
    title: "تسجيل الدخول إلى حسابك",
    description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
    signUp: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
  },
};

export default function CardRtl() {
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
      <Card className="w-full max-w-sm" dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
          <CardAction>
            <Button variant="link">{t.signUp}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email-rtl">{t.email}</Label>
              <Input id="email-rtl" type="email" placeholder="m@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-rtl">{t.password}</Label>
              <Input id="password-rtl" type="password" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {t.login}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
