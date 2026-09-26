"use client";

import { Marquee } from "@bklitui/ui/components/marquee";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DashedLine } from "./dashed-line";
import { Container } from "./primitives";

const HERO_IMAGE =
  "https://framerusercontent.com/images/uJE8NQyYXC4kBsQ6uhdSVoUQPzM.png";
const SIDE_IMAGE =
  "https://framerusercontent.com/images/wJo5NFOD9xOtFS68OXbtzXivQ0.png";

/** Prompts the demo input types out, one after another. */
const PROMPTS = [
  "How can I automate support tickets?",
  "Qualify the leads in my inbox",
  "Summarize this week's sales data",
  "Draft replies to customer emails",
];

const AGENTS = [
  "Customer support agent",
  "Sales Lead Qualifier",
  "Data Analysis Agent",
  "Email Responder",
];

const TYPE_DELAY = 60;
const DELETE_DELAY = 30;
const HOLD_DELAY = 1600;

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(phrases[0] ?? "");
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndex] ?? "";
      if (deleting) {
        charIndex -= 1;
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      } else {
        charIndex += 1;
        if (charIndex >= phrase.length) {
          deleting = true;
          setText(phrase);
          timer = setTimeout(tick, HOLD_DELAY);
          return;
        }
      }
      setText(phrase.slice(0, Math.max(charIndex, 0)));
      timer = setTimeout(tick, deleting ? DELETE_DELAY : TYPE_DELAY);
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

/** Letters roll up on hover, revealing a copy drawn with text-shadow below. */
function RollingText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="flex overflow-hidden font-medium text-sm uppercase leading-none"
      >
        {Array.from(text).map((char, index) => (
          <span
            className="block whitespace-pre transition-transform duration-300 ease-out [text-shadow:0_1em_0_currentColor] group-hover:-translate-y-full motion-reduce:transition-none"
            // biome-ignore lint/suspicious/noArrayIndexKey: letters are positional and never reorder
            key={index}
            style={{ transitionDelay: `${index * 15}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
    </>
  );
}

function SparkleIcon() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white">
      <svg
        aria-hidden="true"
        className="size-3.5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 2l1.6 4.4a6 6 0 0 0 3.6 3.6L19.6 11.6l-4.4 1.6a6 6 0 0 0-3.6 3.6L10 21.2l-1.6-4.4a6 6 0 0 0-3.6-3.6L.4 11.6l4.4-1.6a6 6 0 0 0 3.6-3.6L10 2z" />
        <path d="M19 15l.8 2.2a3 3 0 0 0 1.9 1.9l2.2.8-2.2.8a3 3 0 0 0-1.9 1.9L19 24.8l-.8-2.2a3 3 0 0 0-1.9-1.9l-2.2-.8 2.2-.8a3 3 0 0 0 1.9-1.9L19 15z" />
      </svg>
    </span>
  );
}

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12L3.5 4.5l17 7.5-17 7.5L5 12zm0 0h7" />
    </svg>
  );
}

/** Glass card over the hero image: a typing prompt and a scrolling list of agents. */
function AgentCard() {
  const typed = useTypewriter(PROMPTS);

  return (
    <div className="w-full max-w-[380px] scale-90 rounded-xl bg-white/15 p-2 shadow-[1px_1px_0_0_rgba(255,255,255,0.5),-1px_-1px_0_0_rgba(255,255,255,0.5)] backdrop-blur-[10px]">
      <div className="rounded-lg bg-white p-4 text-left text-neutral-950">
        <p className="font-medium text-sm">Automate Tasks with AI Agent</p>

        <div className="mt-3 flex items-center gap-2 rounded border border-black/10 bg-white py-1.5 pr-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate text-black/70 text-sm">
            {typed}
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-caret-blink bg-black/60"
            />
          </span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-white">
            <SendIcon />
          </span>
        </div>

        <p className="mt-4 text-black/50 text-xs">Actions</p>
        <div className="relative mt-2 h-36 overflow-hidden">
          <Marquee
            className="h-full p-0 [--duration:14s] [--gap:0.625rem]"
            repeat={3}
            vertical
          >
            {AGENTS.map((agent) => (
              <div
                className="flex items-center gap-2.5 rounded border border-neutral-100 bg-neutral-50 p-2 text-sm"
                key={agent}
              >
                <SparkleIcon />
                {agent}
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-32 md:pt-40">
      {/* Bottom padding lives on the Container so the frame lines reach the logo strip below. */}
      <Container className="relative pb-16 md:pb-24">
        <DashedLine className="left-0 hidden lg:block" orientation="vertical" />
        <DashedLine
          className="right-0 hidden lg:block"
          orientation="vertical"
        />

        <div className="flex flex-col items-center text-center lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            Components your AI agent can build with
          </span>

          <h1 className="mt-7 max-w-4xl text-balance font-semibold text-5xl leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl">
            Turn Your AI Product Into a Website That Sells
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Create intelligent agents that understand context, automate
            workflows, and execute tasks reliably across your operations.
          </p>

          <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              className="group inline-flex h-12 w-full items-center justify-center rounded-lg border border-border bg-background px-6 text-foreground transition-colors hover:bg-muted sm:w-auto"
              href="#contact"
            >
              <RollingText text="Talk to sales" />
            </Link>
            <Link
              className="group inline-flex h-12 w-full items-center justify-center rounded-lg bg-foreground px-6 text-background transition-opacity hover:opacity-90 sm:w-auto"
              href="#pricing"
            >
              <RollingText text="Start for free" />
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-[2.05fr_1fr] lg:px-10">
          {/* Taller on phones so the agent card fits inside the image. */}
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-muted sm:aspect-1690/1160">
            <Image
              alt="AI agent automation interface over an abstract blue digital background"
              className="object-cover"
              fill
              priority
              sizes="(min-width: 768px) 66vw, 100vw"
              src={HERO_IMAGE}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <AgentCard />
            </div>
          </div>
          <div className="relative hidden overflow-hidden rounded-2xl bg-muted md:block">
            <Image
              alt="Professional working with AI automation tools"
              className="object-cover"
              fill
              sizes="33vw"
              src={SIDE_IMAGE}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
