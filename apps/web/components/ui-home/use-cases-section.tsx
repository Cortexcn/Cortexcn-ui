import { Painting } from "./painting";
import { Container } from "./primitives";
import { type HeadingLine, Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { UseCasesDashboardWindow } from "./use-cases-section-dashboard";
import { UseCasesHelpWindow } from "./use-cases-section-help";
import {
  AppUiIcon,
  BlocksIcon,
  BoltIcon,
  BriefcaseIcon,
  CommandIcon,
  ContrastIcon,
  DashboardsIcon,
  LandingPagesIcon,
  LayersIcon,
  LineNavIcon,
  MarqueeIcon,
  PieIcon,
  PortfoliosIcon,
  QuestionIcon,
  StackedCardsIcon,
  StatCardIcon,
} from "./use-cases-section-icons";
import { UseCasesLandingWindow } from "./use-cases-section-landing";
import { UseCasesPortfolioWindow } from "./use-cases-section-portfolio";
import { type UseCase, UseCasesTabs } from "./use-cases-section-tabs";

const HEADING: HeadingLine[] = [
  { text: "Pick a project." },
  { text: "Start from components that work.", muted: true },
];

const tabIconClassName = "size-[18px] shrink-0";

/** The painted panel is about two thirds of the container on desktop. */
const ART_SIZES = "(min-width: 1280px) 780px, (min-width: 1024px) 65vw, 100vw";

const USE_CASES: UseCase[] = [
  {
    id: "dashboards",
    label: "Dashboards",
    icon: <DashboardsIcon className={tabIconClassName} />,
    title: "Dashboards your team checks every morning.",
    features: [
      {
        title: "Stat cards with live charts",
        description:
          "Area, line, and map stat cards whose numbers follow your pointer.",
        icon: <StatCardIcon />,
      },
      {
        title: "Every common chart",
        description:
          "Area, bar, line, pie, radar, heatmap, sankey, and more, in one style.",
        icon: <PieIcon />,
      },
      {
        title: "Parts that fit together",
        description:
          "Tooltips, legends, axes, and brushes are separate parts you add to a chart.",
        icon: <LayersIcon />,
      },
    ],
    cta: { label: "Browse charts", href: "/charts/area-chart" },
    art: <Painting art="pastel-meadow-flowers" sizes={ART_SIZES} />,
    window: <UseCasesDashboardWindow />,
  },
  {
    id: "landing-pages",
    label: "Landing pages",
    icon: <LandingPagesIcon className={tabIconClassName} />,
    title: "Landing pages that look finished on day one.",
    features: [
      {
        title: "Feature blocks",
        description:
          "Spotlight grids, media cards, and image columns, ready for your copy.",
        icon: <BlocksIcon />,
      },
      {
        title: "Marquees and logo rows",
        description:
          "Loop logos, quotes, or screenshots, with a perspective option for depth.",
        icon: <MarqueeIcon />,
      },
      {
        title: "Animated background",
        description:
          "Light Speed, a WebGL tunnel of light streaks for heroes that need motion.",
        icon: <BoltIcon />,
      },
    ],
    cta: { label: "Browse blocks", href: "/blocks" },
    art: <Painting art="pastel-wildflowers" sizes={ART_SIZES} />,
    window: <UseCasesLandingWindow />,
  },
  {
    id: "portfolios",
    label: "Portfolios",
    icon: <PortfoliosIcon className={tabIconClassName} />,
    title: "Portfolios that put the work first.",
    features: [
      {
        title: "Work experience",
        description:
          "Roles grouped by company, with dates, durations, skills, and notes that expand.",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Theme toggle effects",
        description:
          "Light and dark switches that reveal the new theme as a circle, triangle, or polygon.",
        icon: <ContrastIcon />,
      },
      {
        title: "Line nav",
        description:
          "A vertical nav whose line marker grows on hover and on the active item.",
        icon: <LineNavIcon />,
      },
    ],
    cta: {
      label: "Browse components",
      href: "/docs/components/work-experience",
    },
    art: <Painting art="white-blooms" sizes={ART_SIZES} />,
    window: <UseCasesPortfolioWindow />,
  },
  {
    id: "app-ui",
    label: "App UI",
    icon: <AppUiIcon className={tabIconClassName} />,
    title: "App screens people enjoy using.",
    features: [
      {
        title: "Command palette",
        description:
          "Types out your queries and filters grouped results, with arrow-key navigation.",
        icon: <CommandIcon />,
      },
      {
        title: "FAQ tabs card",
        description:
          "Tabbed questions with answers that slide open, and a support button.",
        icon: <QuestionIcon />,
      },
      {
        title: "Accordion and card",
        description:
          "A Radix accordion, and a card with header, content, and footer.",
        icon: <StackedCardsIcon />,
      },
    ],
    cta: { label: "Browse components", href: "/docs/components" },
    art: <Painting art="soft-meadow-grass" sizes={ART_SIZES} />,
    window: <UseCasesHelpWindow />,
  },
];

/**
 * Four kinds of project, each with what the library gives it and a live
 * window built from the real registry items.
 */
export function UseCasesSection() {
  return (
    <section className="py-20 md:py-28" id="use-cases">
      <Container>
        <SectionHeader badge="Use cases" lines={HEADING} />
        <Reveal className="mt-12 md:mt-16">
          <UseCasesTabs useCases={USE_CASES} />
        </Reveal>
      </Container>
    </section>
  );
}
