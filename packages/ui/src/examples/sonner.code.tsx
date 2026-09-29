/** Source of each example on the Sonner docs page, as it reads after install. */
export const code: Record<string, string> = {
  SonnerBasic:
    'import { toast } from "sonner"\nimport { Button } from "@/components/button"\n\nexport function SonnerBasic() {\n  return (\n    <div className="flex flex-col gap-6 items-center justify-center">\n      <Button\n        onClick={() => toast("Event has been created")}\n        variant="outline"\n        className="w-fit"\n      >\n        Show Toast\n      </Button>\n    </div>\n  )\n}\n',
  SonnerWithDescription:
    'import { toast } from "sonner"\nimport { Button } from "@/components/button"\n\nexport function SonnerWithDescription() {\n  return (\n    <div className="flex flex-col gap-6 items-center justify-center">\n      <Button\n        onClick={() =>\n          toast("Event has been created", {\n            description: "Monday, January 3rd at 6:00pm",\n          })\n        }\n        variant="outline"\n        className="w-fit"\n      >\n        Show Toast\n      </Button>\n    </div>\n  )\n}\n',
};
