/** Source of each example on the Textarea docs page, as it reads after install. */
export const code: Record<string, string> = {
  TextareaBasic:
    'import { Textarea } from "@/components/textarea"\n\nexport function TextareaBasic() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Textarea placeholder="Type your message here." />\n    </div>\n  )\n}\n',
  TextareaInvalid:
    'import { Textarea } from "@/components/textarea"\n\nexport function TextareaInvalid() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Textarea placeholder="Type your message here." aria-invalid="true" />\n    </div>\n  )\n}\n',
  TextareaWithLabel:
    'import { Field, FieldLabel } from "@/components/field"\nimport { Textarea } from "@/components/textarea"\n\nexport function TextareaWithLabel() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field>\n        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>\n        <Textarea\n          id="textarea-demo-message"\n          placeholder="Type your message here."\n          rows={6}\n        />\n      </Field>\n    </div>\n  )\n}\n',
  TextareaWithDescription:
    'import { Field, FieldDescription, FieldLabel } from "@/components/field"\nimport { Textarea } from "@/components/textarea"\n\nexport function TextareaWithDescription() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field>\n        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>\n        <Textarea\n          id="textarea-demo-message-2"\n          placeholder="Type your message here."\n          rows={6}\n        />\n        <FieldDescription>\n          Type your message and press enter to send.\n        </FieldDescription>\n      </Field>\n    </div>\n  )\n}\n',
  TextareaDisabled:
    'import { Field, FieldLabel } from "@/components/field"\nimport { Textarea } from "@/components/textarea"\n\nexport function TextareaDisabled() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Field>\n        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>\n        <Textarea\n          id="textarea-demo-disabled"\n          placeholder="Type your message here."\n          disabled\n        />\n      </Field>\n    </div>\n  )\n}\n',
};
