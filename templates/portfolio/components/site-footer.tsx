import { site } from "@/config/site";

import { SocialIcon } from "./social-icon";

export function SiteFooter() {
  return (
    <footer className="border-border border-t px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex items-center gap-2">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground"
                href={social.href}
                rel="noopener"
                target="_blank"
              >
                <SocialIcon className="size-4" name={social.icon} />
              </a>
            </li>
          ))}
        </ul>
        <p>
          Template by{" "}
          <a
            className="text-foreground underline-offset-4 hover:underline"
            href="https://www.cortexcn.dev"
            rel="noopener"
            target="_blank"
          >
            Cortexcn
          </a>
        </p>
      </div>
    </footer>
  );
}
