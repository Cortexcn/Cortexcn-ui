import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudioAction {
  label: string;
  href: string;
}

interface StudioImage {
  src: string;
  /** Shown in dark mode instead of `src`, for a logo with a light version. */
  srcDark?: string;
  alt: string;
}

export interface StudioPost {
  /** Shown as written, for example "September 18, 2026". */
  date: string;
  title: string;
  description: string;
  href: string;
  image: StudioImage;
}

export interface StudioFeature {
  /** Small label in the tile's top corner, such as a brand or series name. */
  label: string;
  title: string;
  href: string;
  image: StudioImage;
}

export interface FeatureStudioGridProps {
  heading?: string;
  action?: StudioAction;
  /** Two compact cards sit beside the feature tile on large screens. */
  posts?: StudioPost[];
  feature?: StudioFeature;
  className?: string;
}

const CORTEXCN_LOGO: StudioImage = {
  src: "https://www.cortexcn.dev/img/cortexcn/icon-light.png",
  srcDark: "https://www.cortexcn.dev/img/cortexcn/icon-dark.png",
  alt: "Cortexcn logo",
};

/** Sample photo from Unsplash (free to use under the Unsplash License). */
function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

const DEFAULT_POSTS: StudioPost[] = [
  {
    date: "September 18, 2026",
    title: "Motion that knows when to rest",
    description:
      "How we pace animation so it guides the eye, and keep it still when a visitor asks for reduced motion.",
    href: "#",
    image: CORTEXCN_LOGO,
  },
  {
    date: "August 29, 2026",
    title: "One set of tokens for every theme",
    description:
      "The shared color tokens that keep charts, cards, and blocks consistent in light and dark mode.",
    href: "#",
    image: CORTEXCN_LOGO,
  },
];

const DEFAULT_FEATURE: StudioFeature = {
  label: "Studio",
  title: "How a component goes from sketch to registry",
  href: "#",
  image: {
    src: unsplash("1581291518857-4e27b48ff24e", 1400),
    alt: "A hand sketching app wireframes on paper",
  },
};

function PlusIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-90",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 12h14M12 5v14" />
      </svg>
    </span>
  );
}

function ArrowUpRightIcon() {
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
      <path d="M7 7h10v10M7 17 17 7" />
    </svg>
  );
}

const thumbnailClassName =
  "size-24 rounded-xl border bg-muted object-cover lg:size-32";

function Thumbnail({ image }: { image: StudioImage }) {
  if (!image.srcDark) {
    return (
      // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
      <img
        alt={image.alt}
        className={thumbnailClassName}
        decoding="async"
        height={128}
        loading="lazy"
        src={image.src}
        width={128}
      />
    );
  }

  return (
    <>
      {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
      <img
        alt={image.alt}
        className={cn(thumbnailClassName, "dark:hidden")}
        decoding="async"
        height={128}
        loading="lazy"
        src={image.src}
        width={128}
      />
      {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
      <img
        alt=""
        className={cn(thumbnailClassName, "hidden dark:block")}
        decoding="async"
        height={128}
        loading="lazy"
        src={image.srcDark}
        width={128}
      />
    </>
  );
}

function PostCard({ post }: { post: StudioPost }) {
  return (
    <a
      className="group flex h-full flex-col justify-between gap-10 rounded-xl bg-card p-4 text-card-foreground outline-none ring-1 ring-foreground/10 transition-shadow hover:ring-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
      href={post.href}
    >
      <div className="flex items-start justify-between gap-4">
        <Thumbnail image={post.image} />
        <PlusIcon className="bg-secondary text-secondary-foreground" />
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-muted-foreground text-xs">{post.date}</span>
          <h3 className="mt-1 text-balance font-medium text-xl tracking-tight">
            {post.title}
          </h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {post.description}
        </p>
      </div>
    </a>
  );
}

function FeatureTile({ feature }: { feature: StudioFeature }) {
  return (
    <a
      className="group relative flex h-full min-h-[30rem] flex-col justify-between overflow-hidden rounded-xl bg-neutral-950 text-white outline-none ring-1 ring-foreground/10 focus-visible:ring-2 focus-visible:ring-ring md:min-h-[32rem]"
      href={feature.href}
    >
      {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
      <img
        alt={feature.image.alt}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        decoding="async"
        height={1050}
        loading="lazy"
        src={feature.image.src}
        width={1400}
      />
      {/* Keeps the label readable on light photos. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/50 to-transparent"
      />

      <div className="relative flex items-center justify-between p-6 md:p-8">
        <span className="font-bold text-lg tracking-tight">
          {feature.label}
        </span>
        <PlusIcon className="bg-white/15 text-white backdrop-blur-sm" />
      </div>

      <div className="relative flex justify-end bg-linear-to-t from-black/80 via-black/40 to-transparent p-6 pt-24 text-right md:p-10 md:pt-32">
        <h3 className="max-w-md text-balance font-semibold text-2xl tracking-tight md:text-3xl lg:text-4xl">
          {feature.title}
        </h3>
      </div>
    </a>
  );
}

export function FeatureStudioGrid({
  heading = "Stories from the studio.",
  action = { label: "Get in touch", href: "#" },
  posts = DEFAULT_POSTS,
  feature = DEFAULT_FEATURE,
  className,
}: FeatureStudioGridProps) {
  return (
    <section
      className={cn(
        "bg-muted px-6 py-24 sm:py-32 dark:bg-background",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-8">
          <h2 className="max-w-lg text-balance font-bold text-3xl tracking-tight md:text-5xl">
            {heading}
          </h2>
          <a
            className={cn(buttonVariants(), "gap-1.5 self-start md:self-auto")}
            href={action.href}
          >
            {action.label}
            <ArrowUpRightIcon />
          </a>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <li key={post.title}>
              <PostCard post={post} />
            </li>
          ))}
          <li className="sm:col-span-2">
            <FeatureTile feature={feature} />
          </li>
        </ul>
      </div>
    </section>
  );
}
