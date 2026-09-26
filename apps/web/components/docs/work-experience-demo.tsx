import { Icon } from "@bklitui/icons";
import {
  type ExperienceItemType,
  WorkExperience,
} from "@bklitui/ui/components/work-experience";

/** Trimmed from the experience section of syedmoinuddin.com. */
const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "virallens",
    companyName: "Virallens",
    positions: [
      {
        id: "software-engineer",
        title: "Software Engineer",
        employmentPeriod: {
          start: "06.2025",
        },
        employmentType: "Full-time",
        icon: <Icon name="IconCode" />,
        description: `I build complete digital products end to end, where AI meets polished software people use every day.

- **Citera:** Built the pipeline that extracts factual claims from any text, link, or file and verifies each one against trusted sources with word-for-word evidence.
- **L-K Drop Analysis:** Built the front-end over the analysis engine, with hover-to-source citations and a live AI chat that streams its reasoning.
- **Perssonify Website 3:** Shipped a responsive, animated site for four brands from one codebase with a shared design system.`,
        skills: [
          "TypeScript",
          "React 19",
          "Next.js 16",
          "Tailwind CSS",
          "shadcn/ui",
          "Framer Motion",
          "Node.js",
          "Vercel AI SDK",
          "Turborepo",
        ],
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
        id: "reva-university",
        title: "REVA University",
        employmentPeriod: {
          start: "08.2019",
          end: "08.2023",
        },
        icon: <Icon name="IconGraduateCap" />,
        description:
          "Bachelor of Technology, Mechatronics, Robotics, and Automation Engineering.",
        skills: ["C++", "Python", "Control Systems", "Embedded Systems"],
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
