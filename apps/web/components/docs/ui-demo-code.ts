/**
 * Code shown next to the UI component previews. Kept out of MDX because MDX
 * strips leading whitespace from multi-line JSX attributes, which flattens
 * anything that is not plain JSX (imports, function bodies).
 */

export const marqueeRowsCode = `<div className="relative flex w-full flex-col overflow-hidden">
  <Marquee pauseOnHover className="[--duration:30s]">
    {firstRow.map((logo) => (
      <LogoCard key={logo.name} {...logo} />
    ))}
  </Marquee>
  <Marquee reverse pauseOnHover className="[--duration:30s]">
    {secondRow.map((logo) => (
      <LogoCard key={logo.name} {...logo} />
    ))}
  </Marquee>
  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background" />
</div>`;

export const marqueeVerticalCode = `<div className="relative flex h-72 w-full items-center justify-center gap-4 overflow-hidden">
  <Marquee vertical pauseOnHover className="[--duration:20s]">
    {features.map((feature) => (
      <Card key={feature}>{feature}</Card>
    ))}
  </Marquee>
  <Marquee vertical reverse pauseOnHover className="[--duration:20s]">
    {features.map((feature) => (
      <Card key={feature}>{feature}</Card>
    ))}
  </Marquee>
</div>`;

export const lineNavControlledCode = `"use client";

import { useState } from "react";
import { LineNav } from "@/components/line-nav";

const items = [
  { title: "Introduction", href: "#introduction" },
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "API Reference", href: "#api-reference" },
];

export function DocsNav() {
  const [activeHref, setActiveHref] = useState("#introduction");

  return (
    <LineNav
      items={items}
      activeHref={activeHref}
      scrollActiveIntoView={false}
      onItemClick={(item) => setActiveHref(item.href)}
    />
  );
}`;

export const logosCarouselRtlCode = `<LogosCarousel className="h-16" direction="rtl">
  {logos.map((logo) => (
    <Logo key={logo.name} {...logo} />
  ))}
</LogosCarousel>`;

export const logosCarouselColumnsCode = `<LogosCarousel className="h-16" columnCount={3}>
  {logos.map((logo) => (
    <Logo key={logo.name} {...logo} />
  ))}
</LogosCarousel>`;

export const themeToggleEffectDemoCode = `"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import {
  startThemeTransition,
  THEME_TOGGLE_EFFECTS,
  type ThemeToggleEffect,
} from "@/components/theme-toggle-effect";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeToggleEffectDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const [effect, setEffect] = useState<ThemeToggleEffect>("circle");
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Select
        value={effect}
        onValueChange={(value) => setEffect(value as ThemeToggleEffect)}
      >
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEME_TOGGLE_EFFECTS.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        onClick={() =>
          startThemeTransition(
            () => setTheme(isDark ? "light" : "dark"),
            effect,
          )
        }
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}`;

export const workExperienceDemoCode = `import { CodeXmlIcon, GraduationCapIcon } from "lucide-react";

import {
  type ExperienceItemType,
  WorkExperience,
} from "@/components/work-experience";

const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "acme",
    companyName: "Acme Inc.",
    positions: [
      {
        id: "senior-frontend-engineer",
        title: "Senior Frontend Engineer",
        employmentPeriod: { start: "03.2024" },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: \`Leads the web app's front end, from the design system to the release.

- **Design system:** Built the shared component library.
- **Analytics dashboard:** Shipped live charts, filters, and exports.\`,
        skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "education",
    companyName: "Education",
    positions: [
      {
        id: "university",
        title: "State University",
        employmentPeriod: { start: "08.2018", end: "05.2022" },
        icon: <GraduationCapIcon />,
        description: "Bachelor of Science, Computer Science.",
        skills: ["Algorithms", "Databases"],
      },
    ],
  },
];

export function WorkExperienceDemo() {
  return <WorkExperience className="w-full" experiences={WORK_EXPERIENCE} />;
}`;

export const perspectiveMarqueeDemoCode = `import { PerspectiveMarquee } from "@/components/perspective-marquee";

const images = [
  { src: "/screens/dashboard.png", alt: "Dashboard" },
  { src: "/screens/pricing.png", alt: "Pricing page" },
  { src: "/screens/checkout.png", alt: "Checkout" },
  { src: "/screens/settings.png", alt: "Settings" },
  // ...more images
];

export function ScreensWall() {
  return <PerspectiveMarquee images={images} />;
}`;

const accordionImports = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";`;

export const accordionBasicCode = `${accordionImports}

const items = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
];

export function AccordionBasic() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="max-w-lg"
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export const accordionMultipleCode = `${accordionImports}

const items = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
];

export function AccordionMultiple() {
  return (
    <Accordion
      type="multiple"
      className="max-w-lg"
      defaultValue={["notifications"]}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export const accordionDisabledCode = `${accordionImports}

const items = [
  {
    value: "account",
    trigger: "Account details",
    content:
      "Update your name, email address, and profile photo from the account page.",
  },
  {
    value: "team",
    trigger: "Team seats (available on the Team plan)",
    content: "Invite teammates and manage their roles.",
    disabled: true,
  },
  {
    value: "export",
    trigger: "Export your data",
    content:
      "Download a copy of your projects and settings as a ZIP file at any time.",
  },
];

export function AccordionDisabled() {
  return (
    <Accordion type="single" collapsible className="max-w-lg">
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export const accordionCardCode = `${accordionImports}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";

const items = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
    content:
      "We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
  },
  {
    value: "billing",
    trigger: "How does billing work?",
    content:
      "Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.",
  },
  {
    value: "cancel",
    trigger: "How do I cancel my subscription?",
    content:
      "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.",
  },
];

export function AccordionCard() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, payments and
          cancellations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="plans">
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}`;

export const cardDemoCode = `import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}`;

export const cardSmallCode = `<Card size="sm" className="w-full max-w-xs">
  <CardHeader>
    <CardTitle>Weekly report</CardTitle>
    <CardDescription>Sent every Monday at 9:00 AM.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>
      A summary of new signups, active users, and revenue for the past seven
      days.
    </p>
  </CardContent>
  <CardFooter>
    <Button size="sm" variant="outline" className="w-full">
      Manage schedule
    </Button>
  </CardFooter>
</Card>`;

export const cardSpacingCode = `<Card className="w-full max-w-sm [--card-spacing:--spacing(6)]">
  <CardHeader>
    <CardTitle>More room to breathe</CardTitle>
    <CardDescription>This card sets --card-spacing to 1.5rem.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>
      The gap between sections and the inset of every card part follow the
      same variable, so one class changes them all.
    </p>
  </CardContent>
  <CardFooter>
    <Button>Continue</Button>
  </CardFooter>
</Card>`;

export const cardEdgeToEdgeCode = `const settings = [
  { label: "Email notifications", value: "On" },
  { label: "Weekly digest", value: "Off" },
  { label: "Product updates", value: "On" },
];

<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Choose what we email you about.</CardDescription>
  </CardHeader>
  <CardContent className="-mx-(--card-spacing) -mb-(--card-spacing)">
    <ul className="divide-y border-t">
      {settings.map((setting) => (
        <li
          key={setting.label}
          className="flex items-center justify-between px-(--card-spacing) py-3"
        >
          <span>{setting.label}</span>
          <span className="text-muted-foreground">{setting.value}</span>
        </li>
      ))}
    </ul>
  </CardContent>
  <CardFooter>
    <Button variant="outline" className="w-full">
      Edit preferences
    </Button>
  </CardFooter>
</Card>`;

export const cardImageCode = `<Card className="w-full max-w-sm">
  <img
    src="/images/cover.jpg"
    alt="Cover"
    className="aspect-video w-full object-cover"
  />
  <CardHeader>
    <CardTitle>Area Chart</CardTitle>
    <CardDescription>
      A composable area chart with gradient fills and tooltips.
    </CardDescription>
  </CardHeader>
  <CardFooter>
    <Button className="w-full">View component</Button>
  </CardFooter>
</Card>`;

export const lightSpeedColorCode = `<section className="relative isolate flex h-[420px] items-center justify-center overflow-hidden">
  <LightSpeed lightColor="#33b2ff" particleCount={600} speed={1.2} />
  <h2 className="relative text-4xl font-medium text-white">Ship at light speed</h2>
</section>`;
