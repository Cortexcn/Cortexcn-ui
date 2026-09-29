/** Source of each example on the Kbd docs page, as it reads after install. */
export const code: Record<string, string> = {
  KbdBasic:
    'import { Kbd } from "@/components/kbd"\n\nexport function KbdBasic() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-2">\n        <Kbd>Ctrl</Kbd>\n        <Kbd>⌘K</Kbd>\n        <Kbd>Ctrl + B</Kbd>\n      </div>\n    </div>\n  )\n}\n',
  KbdModifierKeys:
    'import { Kbd } from "@/components/kbd"\n\nexport function KbdModifierKeys() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-2">\n        <Kbd>⌘</Kbd>\n        <Kbd>C</Kbd>\n      </div>\n    </div>\n  )\n}\n',
  KbdGroupExample:
    'import { Kbd, KbdGroup } from "@/components/kbd"\n\nexport function KbdGroupExample() {\n  return (\n    <div className="flex flex-col gap-6">\n      <KbdGroup>\n        <Kbd>Ctrl</Kbd>\n        <Kbd>Shift</Kbd>\n        <Kbd>P</Kbd>\n      </KbdGroup>\n    </div>\n  )\n}\n',
  KbdArrowKeys:
    'import { Kbd } from "@/components/kbd"\n\nexport function KbdArrowKeys() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-2">\n        <Kbd>↑</Kbd>\n        <Kbd>↓</Kbd>\n        <Kbd>←</Kbd>\n        <Kbd>→</Kbd>\n      </div>\n    </div>\n  )\n}\n',
  KbdWithIcons:
    'import { Kbd, KbdGroup } from "@/components/kbd"\nimport { ArrowLeftIcon, ArrowRightIcon, CircleDashedIcon } from "lucide-react"\n\nexport function KbdWithIcons() {\n  return (\n    <div className="flex flex-col gap-6">\n      <KbdGroup>\n        <Kbd>\n          <CircleDashedIcon />\n        </Kbd>\n        <Kbd>\n          <ArrowLeftIcon />\n        </Kbd>\n        <Kbd>\n          <ArrowRightIcon />\n        </Kbd>\n      </KbdGroup>\n    </div>\n  )\n}\n',
  KbdWithIconsAndText:
    'import { Kbd, KbdGroup } from "@/components/kbd"\nimport { ArrowLeftIcon, CircleDashedIcon } from "lucide-react"\n\nexport function KbdWithIconsAndText() {\n  return (\n    <div className="flex flex-col gap-6">\n      <KbdGroup>\n        <Kbd>\n          <ArrowLeftIcon />\n          Left\n        </Kbd>\n        <Kbd>\n          <CircleDashedIcon />\n          Voice Enabled\n        </Kbd>\n      </KbdGroup>\n    </div>\n  )\n}\n',
  KbdInInputGroup:
    'import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"\nimport { Kbd } from "@/components/kbd"\n\nexport function KbdInInputGroup() {\n  return (\n    <div className="flex flex-col gap-6">\n      <InputGroup>\n        <InputGroupInput />\n        <InputGroupAddon>\n          <Kbd>Space</Kbd>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
  KbdInTooltip:
    'import { Button } from "@/components/button"\nimport { Kbd } from "@/components/kbd"\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@/components/tooltip"\nimport { SaveIcon } from "lucide-react"\n\nexport function KbdInTooltip() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Tooltip>\n        <TooltipTrigger asChild>\n          <Button size="icon-sm" variant="outline">\n            <SaveIcon />\n          </Button>\n        </TooltipTrigger>\n        <TooltipContent className="pr-1.5">\n          <div className="flex items-center gap-2">\n            Save Changes <Kbd>S</Kbd>\n          </div>\n        </TooltipContent>\n      </Tooltip>\n    </div>\n  )\n}\n',
  KbdWithSamp:
    'import { Kbd } from "@/components/kbd"\n\nexport function KbdWithSamp() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Kbd>\n        <samp>File</samp>\n      </Kbd>\n    </div>\n  )\n}\n',
};
