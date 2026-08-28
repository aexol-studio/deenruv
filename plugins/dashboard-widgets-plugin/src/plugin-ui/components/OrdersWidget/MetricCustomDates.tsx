import {
  Button,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { endOfDay, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { formatCustomMetricDate } from "../../translation-formatters";

interface MetricsCustomDatesProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setDate: (date: Date | undefined, key: "start" | "end") => void;
  isVisible: boolean;
}

export const MetricsCustomDates: React.FC<MetricsCustomDatesProps> = ({
  endDate,
  startDate,
  setDate,
  isVisible,
}) => {
  const { t, i18n } = useTranslation("dashboard-widgets-plugin");
  const language = i18n.resolvedLanguage ?? i18n.language;
  if (!isVisible) return null;
  return (
    <div className="!mt-0 flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "h-[30px] w-full max-w-[240px] justify-start text-left text-[13px] font-normal",
              !startDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {startDate ? (
              formatCustomMetricDate(startDate, language)
            ) : (
              <span>{t("chooseStartDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(e) => setDate(e ? startOfDay(e) : e, "start")}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "h-[30px] w-full max-w-[240px] justify-start text-left text-[13px] font-normal",
              !endDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {endDate ? (
              formatCustomMetricDate(endDate, language)
            ) : (
              <span>{t("chooseEndDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(e) => setDate(e ? endOfDay(e) : e, "end")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
