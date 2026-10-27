import { Icon } from "@cortexcn/icons";
import {
  type ExperienceItemType,
  WorkExperience,
} from "@cortexcn/ui/components/work-experience";

/** Sample data: a placeholder company and a generic degree. */
const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "acme",
    companyName: "Acme Inc.",
    positions: [
      {
        id: "senior-frontend-engineer",
        title: "Senior Frontend Engineer",
        employmentPeriod: {
          start: "03.2024",
        },
        employmentType: "Full-time",
        icon: <Icon name="IconCode" />,
        description: `Leads the web app's front end, from the design system to the release.

- **Design system:** Built the shared component library the product and marketing sites use.
- **Analytics dashboard:** Shipped live charts, filters, and exports for the customer dashboard.
- **Performance:** Cut the app's first load by splitting routes and streaming data.`,
        skills: [
          "TypeScript",
          "React",
          "Next.js",
          "Tailwind CSS",
          "shadcn/ui",
          "Motion",
        ],
        isExpanded: true,
      },
      {
        id: "frontend-engineer",
        title: "Frontend Engineer",
        employmentPeriod: {
          start: "06.2022",
          end: "02.2024",
        },
        employmentType: "Full-time",
        icon: <Icon name="IconCode" />,
        description:
          "Built onboarding, billing, and settings pages, and the tests that cover them.",
        skills: ["React", "TypeScript", "Playwright"],
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
        employmentPeriod: {
          start: "08.2018",
          end: "05.2022",
        },
        icon: <Icon name="IconGraduateCap" />,
        description: "Bachelor of Science, Computer Science.",
        skills: ["Algorithms", "Databases", "Human-Computer Interaction"],
      },
    ],
  },
];

export function WorkExperienceDemo() {
  return (
    <WorkExperience
      className="w-full max-w-2xl"
      experiences={WORK_EXPERIENCE}
    />
  );
}
