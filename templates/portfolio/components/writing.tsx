import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";

import { site } from "@/config/site";
import { publicPath } from "@/lib/utils";

import { ArrowLink } from "./arrow-link";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function Writing() {
  return (
    <section className="px-6 py-24 md:py-32" id="writing">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading label="Thoughts">Writing</SectionHeading>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {site.writing.posts.map((post, index) => (
            <Reveal delay={index * 0.08} key={post.href}>
              <a
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card"
                href={post.href}
                rel="noopener"
                target="_blank"
              >
                <div className="overflow-hidden">
                  <Image
                    alt=""
                    className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    height={360}
                    src={publicPath(post.cover)}
                    width={640}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <time
                    className="font-mono text-muted-foreground text-xs uppercase tracking-widest"
                    dateTime={post.date}
                  >
                    {DATE_FORMAT.format(new Date(post.date))}
                  </time>
                  <h3 className="font-semibold text-2xl tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <ArrowUpRightIcon className="mt-auto size-5 self-end text-muted-foreground transition-[color,transform] duration-300 group-hover:rotate-45 group-hover:text-foreground" />
                </div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.16}>
            <div className="flex h-full flex-col justify-between gap-10 rounded-3xl bg-foreground p-6 text-background md:p-8">
              <p className="text-balance font-semibold text-3xl leading-tight tracking-tight">
                {site.writing.blurb}
              </p>
              <ArrowLink href={site.writing.allHref} inverted>
                Read the blog
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
