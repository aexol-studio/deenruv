import { useFormContext } from "react-hook-form";
import { PredictionType } from "../zeus/index.js";
import React, { useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@deenruv/react-ui-devkit";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Button,
} from "@deenruv/react-ui-devkit";
import { CalendarIcon } from "lucide-react";

type Formvalues = {
  num_prospects: number;
  start_date: string;
  end_date: string;
  predict_type: PredictionType;
  show_metrics: boolean;
};

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setValue, watch } = useFormContext<Formvalues>();
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (date?.from) {
      setValue("start_date", format(date.from, "yyyy-MM-dd"));
    }
    if (date?.to) {
      setValue("end_date", format(date.to, "yyyy-MM-dd"));
    }
  }, [date, setValue]);

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  useEffect(() => {
    if (startDate || endDate) {
      setDate({
        from: startDate ? new Date(startDate) : undefined,
        to: endDate ? new Date(endDate) : undefined,
      });
    }
  }, [startDate, endDate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
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
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function exportToCsv(predictions: any) {
  const rowName = "email";
  const rowContent = predictions
    .map((prediction: any) => `${prediction.customer?.emailAddress}`)
    .join("\n");
  const csv = `${rowName}\n${rowContent}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toLocaleString();
  a.download = `predictions-${timestamp}.csv`;
  a.click();
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
