/** Source of each example on the Label docs page, as it reads after install. */
export const code: Record<string, string> = {
  LabelWithCheckbox:
    'import { Checkbox } from "@/components/checkbox"\nimport { Field } from "@/components/field"\nimport { Label } from "@/components/label"\n\nexport function LabelWithCheckbox() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field orientation="horizontal">\n        <Checkbox id="label-demo-terms" />\n        <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>\n      </Field>\n    </div>\n  )\n}\n',
  LabelWithInput:
    'import { Field } from "@/components/field"\nimport { Input } from "@/components/input"\nimport { Label } from "@/components/label"\n\nexport function LabelWithInput() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field>\n        <Label htmlFor="label-demo-username">Username</Label>\n        <Input id="label-demo-username" placeholder="Username" />\n      </Field>\n    </div>\n  )\n}\n',
  LabelDisabled:
    'import { Field } from "@/components/field"\nimport { Input } from "@/components/input"\nimport { Label } from "@/components/label"\n\nexport function LabelDisabled() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field data-disabled={true}>\n        <Label htmlFor="label-demo-disabled">Disabled</Label>\n        <Input id="label-demo-disabled" placeholder="Disabled" disabled />\n      </Field>\n    </div>\n  )\n}\n',
  LabelWithTextarea:
    'import { Field } from "@/components/field"\nimport { Label } from "@/components/label"\nimport { Textarea } from "@/components/textarea"\n\nexport function LabelWithTextarea() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field>\n        <Label htmlFor="label-demo-message">Message</Label>\n        <Textarea id="label-demo-message" placeholder="Message" />\n      </Field>\n    </div>\n  )\n}\n',
};
