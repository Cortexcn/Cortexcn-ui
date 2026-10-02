import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cortexcn/ui/components/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CardDemo() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button type="button" variant="link">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="card-demo-email">Email</Label>
            <Input
              id="card-demo-email"
              placeholder="m@example.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="card-demo-password">Password</Label>
              <button
                className="ml-auto text-sm underline-offset-4 hover:underline"
                type="button"
              >
                Forgot your password?
              </button>
            </div>
            <Input id="card-demo-password" type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" type="button">
          Login
        </Button>
        <Button className="w-full" type="button" variant="outline">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardSmall() {
  return (
    <Card className="mx-auto w-full max-w-xs" size="sm">
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
        <Button className="w-full" size="sm" type="button" variant="outline">
          Manage schedule
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardSpacing() {
  return (
    <Card className="mx-auto w-full max-w-sm [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle>More room to breathe</CardTitle>
        <CardDescription>
          This card sets --card-spacing to 1.5rem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The gap between sections and the inset of every card part follow the
          same variable, so one class changes them all.
        </p>
      </CardContent>
      <CardFooter>
        <Button type="button">Continue</Button>
      </CardFooter>
    </Card>
  );
}

const SETTINGS = [
  { label: "Email notifications", value: "On" },
  { label: "Weekly digest", value: "Off" },
  { label: "Product updates", value: "On" },
];

export function CardEdgeToEdge() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what we email you about.</CardDescription>
      </CardHeader>
      <CardContent className="-mx-(--card-spacing) -mb-(--card-spacing)">
        <ul className="divide-y border-t">
          {SETTINGS.map((setting) => (
            <li
              className="flex items-center justify-between px-(--card-spacing) py-3"
              key={setting.label}
            >
              <span>{setting.label}</span>
              <span className="text-muted-foreground">{setting.value}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="button" variant="outline">
          Edit preferences
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CardImage() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      {/* biome-ignore lint/performance/noImgElement: plain img keeps the example copy-pasteable outside Next.js */}
      <img
        alt="Area chart preview"
        className="aspect-video w-full object-cover"
        height={400}
        src="/svgs/area-chart.svg"
        width={720}
      />
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>
          A composable area chart with gradient fills and tooltips.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" type="button">
          View component
        </Button>
      </CardFooter>
    </Card>
  );
}
