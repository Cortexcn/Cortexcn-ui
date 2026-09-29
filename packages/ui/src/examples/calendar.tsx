"use client";

// Examples adapted from the shadcn/ui Calendar docs (MIT, https://ui.shadcn.com).

import { addDays, format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, Clock2Icon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import { Calendar, CalendarDayButton } from "../components/calendar";
import { Card, CardContent, CardFooter } from "../components/card";
import { Field, FieldGroup, FieldLabel } from "../components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../components/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";

/** Stands in for the shadcn docs frame; the docs page draws its own. */
function Example({
  className,
  children,
}: React.ComponentProps<"div"> & {
  title?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-6 *:[div:not([class*='w-'])]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CalendarInCard() {
  return (
    <Example title="In Card">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar mode="single" />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarInPopover() {
  return (
    <Example title="In Popover">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="px-2.5 font-normal" variant="outline">
            <CalendarIcon data-icon="inline-start" />
            Open Calendar
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar mode="single" />
        </PopoverContent>
      </Popover>
    </Example>
  );
}

export function CalendarSingle() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );
  return (
    <Example title="Single">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            captionLayout="dropdown"
            mode="single"
            onSelect={setDate}
            selected={date}
          />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarMultiple() {
  return (
    <Example title="Multiple">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar mode="multiple" />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarRange() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });

  return (
    <Example
      className="p-12"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      title="Range"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultMonth={dateRange?.from}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            mode="range"
            numberOfMonths={2}
            onSelect={setDateRange}
            selected={dateRange}
          />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarRangeMultipleMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 3, 12),
    to: addDays(new Date(new Date().getFullYear(), 3, 12), 60),
  });

  return (
    <Example
      className="p-12"
      containerClassName="lg:col-span-full 2xl:col-span-full"
      title="Range Multiple Months"
    >
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultMonth={range?.from}
            fixedWeeks
            locale={es}
            mode="range"
            numberOfMonths={3}
            onSelect={setRange}
            selected={range}
          />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarBookedDates() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i),
  );

  return (
    <Example title="Booked Dates">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultMonth={date}
            disabled={bookedDates}
            mode="single"
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
            onSelect={setDate}
            selected={date}
          />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  return (
    <Example title="With Time">
      <Card className="mx-auto w-fit" size="sm">
        <CardContent>
          <Calendar
            className="p-0"
            mode="single"
            onSelect={setDate}
            selected={date}
          />
        </CardContent>
        <CardFooter className="border-t bg-card">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  defaultValue="10:30:00"
                  id="time-from"
                  step="1"
                  type="time"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel htmlFor="time-to">End Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  defaultValue="12:30:00"
                  id="time-to"
                  step="1"
                  type="time"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </Example>
  );
}

export function CalendarCustomDays() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  });

  return (
    <Example title="Custom Days">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            captionLayout="dropdown"
            className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
            components={{
              DayButton: ({ children, modifiers, day, ...props }) => {
                const isWeekend =
                  day.date.getDay() === 0 || day.date.getDay() === 6;

                return (
                  <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                    {children}
                    {!modifiers.outside && (
                      <span>{isWeekend ? "$120" : "$100"}</span>
                    )}
                  </CalendarDayButton>
                );
              },
            }}
            defaultMonth={range?.from}
            formatters={{
              formatMonthDropdown: (date) => {
                return date.toLocaleString("default", { month: "long" });
              },
            }}
            mode="range"
            numberOfMonths={1}
            onSelect={setRange}
            selected={range}
          />
        </CardContent>
      </Card>
    </Example>
  );
}

export function CalendarWithPresets() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12),
  );
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  return (
    <Example title="With Presets">
      <Card className="mx-auto w-fit max-w-[300px]" size="sm">
        <CardContent className="px-4">
          <Calendar
            className="p-0 [--cell-size:--spacing(9.5)]"
            fixedWeeks
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            onSelect={setDate}
            selected={date}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t">
          {[
            { label: "Today", value: 0 },
            { label: "Tomorrow", value: 1 },
            { label: "In 3 days", value: 3 },
            { label: "In a week", value: 7 },
            { label: "In 2 weeks", value: 14 },
          ].map((preset) => (
            <Button
              className="flex-1"
              key={preset.value}
              onClick={() => {
                const newDate = addDays(new Date(), preset.value);
                setDate(newDate);
                setCurrentMonth(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1),
                );
              }}
              size="sm"
              variant="outline"
            >
              {preset.label}
            </Button>
          ))}
        </CardFooter>
      </Card>
    </Example>
  );
}

export function DatePickerSimple() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Example title="Date Picker Simple">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-simple">Date</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="justify-start px-2.5 font-normal"
              id="date-picker-simple"
              variant="outline"
            >
              <CalendarIcon data-icon="inline-start" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar mode="single" onSelect={setDate} selected={date} />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  );
}

export function DatePickerWithRange() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

  return (
    <Example title="Date Picker Range">
      <Field className="mx-auto w-72">
        <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="justify-start px-2.5 font-normal"
              id="date-picker-range"
              variant="outline"
            >
              <CalendarIcon data-icon="inline-start" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              defaultMonth={date?.from}
              mode="range"
              numberOfMonths={2}
              onSelect={setDate}
              selected={date}
            />
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  );
}

export function DataPickerWithDropdowns() {
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);

  return (
    <Example title="Date Picker with Dropdowns">
      <Field className="mx-auto w-72">
        <Popover onOpenChange={setOpen} open={open}>
          <FieldLabel htmlFor="date-picker-with-dropdowns-desktop">
            Date
          </FieldLabel>
          <PopoverTrigger asChild>
            <Button
              className="justify-start px-2.5 font-normal"
              id="date-picker-with-dropdowns-desktop"
              variant="outline"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <ChevronDownIcon className="ml-auto" data-icon="inline-start" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              captionLayout="dropdown"
              mode="single"
              onSelect={setDate}
              selected={date}
            />
            <div className="flex gap-2 border-t p-2">
              <Button
                className="w-full"
                onClick={() => setOpen(false)}
                size="sm"
                variant="outline"
              >
                Done
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </Field>
    </Example>
  );
}

export function CalendarWeekNumbers() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );

  return (
    <Example className="justify-center" title="Week Numbers">
      <Card className="mx-auto w-fit p-0">
        <CardContent className="p-0">
          <Calendar
            defaultMonth={date}
            mode="single"
            onSelect={setDate}
            selected={date}
            showWeekNumber
          />
        </CardContent>
      </Card>
    </Example>
  );
}
