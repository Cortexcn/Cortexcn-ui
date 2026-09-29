/** Source of each example on the Slider docs page, as it reads after install. */
export const code: Record<string, string> = {
  SliderBasic:
    'import { Slider } from "@/components/slider"\n\nexport function SliderBasic() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Slider defaultValue={[50]} max={100} step={1} />\n    </div>\n  )\n}\n',
  SliderRange:
    'import { Slider } from "@/components/slider"\n\nexport function SliderRange() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Slider defaultValue={[25, 50]} max={100} step={5} />\n    </div>\n  )\n}\n',
  SliderMultiple:
    'import { Slider } from "@/components/slider"\n\nexport function SliderMultiple() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Slider defaultValue={[10, 20, 70]} max={100} step={10} />\n    </div>\n  )\n}\n',
  SliderVertical:
    'import { Slider } from "@/components/slider"\n\nexport function SliderVertical() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-6">\n        <Slider\n          defaultValue={[50]}\n          max={100}\n          step={1}\n          orientation="vertical"\n          className="h-40"\n        />\n        <Slider\n          defaultValue={[25]}\n          max={100}\n          step={1}\n          orientation="vertical"\n          className="h-40"\n        />\n      </div>\n    </div>\n  )\n}\n',
  SliderControlled:
    'import * as React from "react"\nimport { Label } from "@/components/label"\nimport { Slider } from "@/components/slider"\n\nexport function SliderControlled() {\n  const [value, setValue] = React.useState([0.3, 0.7])\n\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="grid w-full gap-3">\n        <div className="flex items-center justify-between gap-2">\n          <Label htmlFor="slider-demo-temperature">Temperature</Label>\n          <span className="text-sm text-muted-foreground">\n            {value.join(", ")}\n          </span>\n        </div>\n        <Slider\n          id="slider-demo-temperature"\n          value={value}\n          onValueChange={setValue}\n          min={0}\n          max={1}\n          step={0.1}\n        />\n      </div>\n    </div>\n  )\n}\n',
  SliderDisabled:
    'import { Slider } from "@/components/slider"\n\nexport function SliderDisabled() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Slider defaultValue={[50]} max={100} step={1} disabled />\n    </div>\n  )\n}\n',
};
