"use client";

// Examples adapted from the shadcn/ui Input OTP docs (MIT, https://ui.shadcn.com).

import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../components/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/input-otp";

/** Stands in for the shadcn docs frame; the docs page draws its own. */
function Example({
  className,
  children,
}: React.ComponentProps<"div"> & {
  title?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-6 *:[div:not([class*='w-'])]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function InputOTPSimple() {
  return (
    <Example title="Simple">
      <Field>
        <FieldLabel htmlFor="simple">Simple</FieldLabel>
        <InputOTP id="simple" maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPPattern() {
  return (
    <Example title="Digits Only">
      <Field>
        <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
        <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPWithSeparator() {
  const [value, setValue] = React.useState("123456");

  return (
    <Example title="With Separator">
      <Field>
        <FieldLabel htmlFor="with-separator">With Separator</FieldLabel>
        <InputOTP
          id="with-separator"
          maxLength={6}
          onChange={setValue}
          value={value}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPAlphanumeric() {
  return (
    <Example title="Alphanumeric">
      <Field>
        <FieldLabel htmlFor="alphanumeric">Alphanumeric</FieldLabel>
        <FieldDescription>Accepts both letters and numbers.</FieldDescription>
        <InputOTP
          id="alphanumeric"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
        <InputOTP disabled id="disabled" maxLength={6} value="123456">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPFourDigits() {
  return (
    <Example title="4 Digits">
      <Field>
        <FieldLabel htmlFor="four-digits">4 Digits</FieldLabel>
        <FieldDescription>Common pattern for PIN codes.</FieldDescription>
        <InputOTP id="four-digits" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  );
}

export function InputOTPInvalid() {
  const [value, setValue] = React.useState("000000");

  return (
    <Example title="Invalid State">
      <Field>
        <FieldLabel htmlFor="invalid">Invalid State</FieldLabel>
        <FieldDescription>
          Example showing the invalid error state.
        </FieldDescription>
        <InputOTP id="invalid" maxLength={6} onChange={setValue} value={value}>
          <InputOTPGroup>
            <InputOTPSlot aria-invalid index={0} />
            <InputOTPSlot aria-invalid index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot aria-invalid index={2} />
            <InputOTPSlot aria-invalid index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot aria-invalid index={4} />
            <InputOTPSlot aria-invalid index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldError errors={[{ message: "Invalid code. Please try again." }]} />
      </Field>
    </Example>
  );
}

export function InputOTPForm() {
  return (
    <Example title="Form">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:{" "}
            <span className="font-medium">m@example.com</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  Verification code
                </FieldLabel>
                <Button size="xs" variant="outline">
                  <RefreshCwIcon data-icon="inline-start" />
                  Resend Code
                </Button>
              </div>
              <InputOTP id="otp-verification" maxLength={6} required>
                <InputOTPGroup className="style-luma:*:data-[slot=input-otp-slot]:h-16 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-maia:*:data-[slot=input-otp-slot]:h-16 style-mira:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-sera:*:data-[slot=input-otp-slot]:h-14 style-vega:*:data-[slot=input-otp-slot]:h-16 style-luma:*:data-[slot=input-otp-slot]:w-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:w-11 style-nova:*:data-[slot=input-otp-slot]:w-11 style-sera:*:data-[slot=input-otp-slot]:w-10 style-vega:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="style-luma:*:data-[slot=input-otp-slot]:h-16 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-maia:*:data-[slot=input-otp-slot]:h-16 style-mira:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-sera:*:data-[slot=input-otp-slot]:h-14 style-vega:*:data-[slot=input-otp-slot]:h-16 style-luma:*:data-[slot=input-otp-slot]:w-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:w-11 style-nova:*:data-[slot=input-otp-slot]:w-11 style-sera:*:data-[slot=input-otp-slot]:w-10 style-vega:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                <a href="#">I no longer have access to this email address.</a>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full" type="submit">
            Verify
          </Button>
          <div className="text-muted-foreground text-sm">
            Having trouble signing in?{" "}
            <a
              className="underline underline-offset-4 transition-colors hover:text-primary"
              href="#"
            >
              Contact support
            </a>
          </div>
        </CardFooter>
      </Card>
    </Example>
  );
}
