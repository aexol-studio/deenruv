import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Command } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useSettings,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { TRANSLATION_NAMESPACE } from "../constants";

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));
const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: i.toString(),
}));
const dayOfMonthOptions = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const monthOptionsPolish = [
  { value: "1", label: "Styczeń" },
  { value: "2", label: "Luty" },
  { value: "3", label: "Marzec" },
  { value: "4", label: "Kwiecień" },
  { value: "5", label: "Maj" },
  { value: "6", label: "Czerwiec" },
  { value: "7", label: "Lipiec" },
  { value: "8", label: "Sierpień" },
  { value: "9", label: "Wrzesień" },
  { value: "10", label: "Październik" },
  { value: "11", label: "Listopad" },
  { value: "12", label: "Grudzień" },
];

const dayOfWeekOptions = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const dayOfWeekOptionsPolish = [
  { value: "0", label: "Niedziela" },
  { value: "1", label: "Poniedziałek" },
  { value: "2", label: "Wtorek" },
  { value: "3", label: "Środa" },
  { value: "4", label: "Czwartek" },
  { value: "5", label: "Piątek" },
  { value: "6", label: "Sobota" },
];

interface CronScheduleProps {
  onChange?: (expression: string) => void;
  defaultValue?: string;
  className?: string;
  isValid?: boolean;
}

export function CronSchedule({
  onChange,
  defaultValue = "* * * * *",
  className,
  isValid = true,
}: CronScheduleProps) {
  const language = useSettings((p) => p.language);
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

  const [minutes, setMinutes] = useState("*");
  const [hours, setHours] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");

  const [minuteType, setMinuteType] = useState("every");
  const [hourType, setHourType] = useState("every");
  const [dayOfMonthType, setDayOfMonthType] = useState("every");
  const [monthType, setMonthType] = useState("every");
  const [dayOfWeekType, setDayOfWeekType] = useState("every");

  const [specificMinute, setSpecificMinute] = useState("");
  const [specificHour, setSpecificHour] = useState("");
  const [specificDayOfMonth, setSpecificDayOfMonth] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificDayOfWeek, setSpecificDayOfWeek] = useState("");

  const [minuteRange, setMinuteRange] = useState({ from: "0", to: "59" });
  const [hourRange, setHourRange] = useState({ from: "0", to: "23" });
  const [dayOfMonthRange, setDayOfMonthRange] = useState({
    from: "1",
    to: "31",
  });
  const [monthRange, setMonthRange] = useState({ from: "1", to: "12" });
  const [dayOfWeekRange, setDayOfWeekRange] = useState({ from: "0", to: "6" });

  const [multipleMinutes, setMultipleMinutes] = useState<string[]>([]);
  const [multipleHours, setMultipleHours] = useState<string[]>([]);
  const [multipleDaysOfMonth, setMultipleDaysOfMonth] = useState<string[]>([]);
  const [multipleMonths, setMultipleMonths] = useState<string[]>([]);
  const [multipleDaysOfWeek, setMultipleDaysOfWeek] = useState<string[]>([]);

  const [cronExpression, setCronExpression] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      const parts = defaultValue.split(" ");
      if (parts.length === 5) {
        updateFromExpression(parts);
      }
    }
  }, [defaultValue]);

  useEffect(() => {
    updateCronExpression();
  }, [
    minuteType,
    hourType,
    dayOfMonthType,
    monthType,
    dayOfWeekType,
    specificMinute,
    specificHour,
    specificDayOfMonth,
    specificMonth,
    specificDayOfWeek,
    minuteRange,
    hourRange,
    dayOfMonthRange,
    monthRange,
    dayOfWeekRange,
    multipleMinutes,
    multipleHours,
    multipleDaysOfMonth,
    multipleMonths,
    multipleDaysOfWeek,
  ]);

  const updateCronExpression = () => {
    let minuteValue = "*";
    if (minuteType === "specific" && specificMinute) {
      minuteValue = specificMinute;
    } else if (minuteType === "range" && minuteRange.from && minuteRange.to) {
      minuteValue = `${minuteRange.from}-${minuteRange.to}`;
    } else if (minuteType === "multiple" && multipleMinutes.length > 0) {
      minuteValue = multipleMinutes.join(",");
    }

    let hourValue = "*";
    if (hourType === "specific" && specificHour) {
      hourValue = specificHour;
    } else if (hourType === "range" && hourRange.from && hourRange.to) {
      hourValue = `${hourRange.from}-${hourRange.to}`;
    } else if (hourType === "multiple" && multipleHours.length > 0) {
      hourValue = multipleHours.join(",");
    }

    let dayOfMonthValue = "*";
    if (dayOfMonthType === "specific" && specificDayOfMonth) {
      dayOfMonthValue = specificDayOfMonth;
    } else if (
      dayOfMonthType === "range" &&
      dayOfMonthRange.from &&
      dayOfMonthRange.to
    ) {
      dayOfMonthValue = `${dayOfMonthRange.from}-${dayOfMonthRange.to}`;
    } else if (
      dayOfMonthType === "multiple" &&
      multipleDaysOfMonth.length > 0
    ) {
      dayOfMonthValue = multipleDaysOfMonth.join(",");
    }

    let monthValue = "*";
    if (monthType === "specific" && specificMonth) {
      monthValue = specificMonth;
    } else if (monthType === "range" && monthRange.from && monthRange.to) {
      monthValue = `${monthRange.from}-${monthRange.to}`;
    } else if (monthType === "multiple" && multipleMonths.length > 0) {
      monthValue = multipleMonths.join(",");
    }

    let dayOfWeekValue = "*";
    if (dayOfWeekType === "specific" && specificDayOfWeek) {
      dayOfWeekValue = specificDayOfWeek;
    } else if (
      dayOfWeekType === "range" &&
      dayOfWeekRange.from &&
      dayOfWeekRange.to
    ) {
      dayOfWeekValue = `${dayOfWeekRange.from}-${dayOfWeekRange.to}`;
    } else if (dayOfWeekType === "multiple" && multipleDaysOfWeek.length > 0) {
      dayOfWeekValue = multipleDaysOfWeek.join(",");
    }

    const expression = `${minuteValue} ${hourValue} ${dayOfMonthValue} ${monthValue} ${dayOfWeekValue}`;
    setCronExpression(expression);
    setMinutes(minuteValue);
    setHours(hourValue);
    setDayOfMonth(dayOfMonthValue);
    setMonth(monthValue);
    setDayOfWeek(dayOfWeekValue);

    if (onChange) {
      onChange(expression);
    }
  };

  const updateFromExpression = (parts: string[]) => {
    const [min, hour, dom, mon, dow] = parts;

    if (min === "*") {
      setMinuteType("every");
    } else if (min.includes("-")) {
      setMinuteType("range");
      const [from, to] = min.split("-");
      setMinuteRange({ from, to });
    } else if (min.includes(",")) {
      setMinuteType("multiple");
      setMultipleMinutes(min.split(","));
    } else {
      setMinuteType("specific");
      setSpecificMinute(min);
    }

    if (hour === "*") {
      setHourType("every");
    } else if (hour.includes("-")) {
      setHourType("range");
      const [from, to] = hour.split("-");
      setHourRange({ from, to });
    } else if (hour.includes(",")) {
      setHourType("multiple");
      setMultipleHours(hour.split(","));
    } else {
      setHourType("specific");
      setSpecificHour(hour);
    }

    if (dom === "*") {
      setDayOfMonthType("every");
    } else if (dom.includes("-")) {
      setDayOfMonthType("range");
      const [from, to] = dom.split("-");
      setDayOfMonthRange({ from, to });
    } else if (dom.includes(",")) {
      setDayOfMonthType("multiple");
      setMultipleDaysOfMonth(dom.split(","));
    } else {
      setDayOfMonthType("specific");
      setSpecificDayOfMonth(dom);
    }

    if (mon === "*") {
      setMonthType("every");
    } else if (mon.includes("-")) {
      setMonthType("range");
      const [from, to] = mon.split("-");
      setMonthRange({ from, to });
    } else if (mon.includes(",")) {
      setMonthType("multiple");
      setMultipleMonths(mon.split(","));
    } else {
      setMonthType("specific");
      setSpecificMonth(mon);
    }

    if (dow === "*") {
      setDayOfWeekType("every");
    } else if (dow.includes("-")) {
      setDayOfWeekType("range");
      const [from, to] = dow.split("-");
      setDayOfWeekRange({ from, to });
    } else if (dow.includes(",")) {
      setDayOfWeekType("multiple");
      setMultipleDaysOfWeek(dow.split(","));
    } else {
      setDayOfWeekType("specific");
      setSpecificDayOfWeek(dow);
    }
  };

  const getNextRunDates = () => {
    const now = new Date();
    const dates = [];

    try {
      const [minPart, hourPart, domPart, monPart, dowPart] =
        cronExpression.split(" ");

      const matchesCronPart = (value: number, cronPart: string) => {
        if (cronPart === "*") return true;

        if (cronPart.includes(",")) {
          return cronPart.split(",").includes(value.toString());
        }

        if (cronPart.includes("-")) {
          const [start, end] = cronPart.split("-").map(Number);
          return value >= start && value <= end;
        }

        return Number(cronPart) === value;
      };

      let currentDate = new Date(now);
      let count = 0;

      const maxIterations = 1000;
      let iterations = 0;

      while (count < 5 && iterations < maxIterations) {
        iterations++;

        if (!matchesCronPart(currentDate.getMinutes(), minPart)) {
          currentDate.setMinutes(currentDate.getMinutes() + 1);
          currentDate.setSeconds(0);
          continue;
        }

        if (!matchesCronPart(currentDate.getHours(), hourPart)) {
          currentDate.setHours(currentDate.getHours() + 1);
          currentDate.setMinutes(0);
          continue;
        }

        if (!matchesCronPart(currentDate.getDate(), domPart)) {
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(0);
          currentDate.setMinutes(0);
          continue;
        }

        if (!matchesCronPart(currentDate.getMonth() + 1, monPart)) {
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(1);
          currentDate.setHours(0);
          currentDate.setMinutes(0);
          continue;
        }

        if (!matchesCronPart(currentDate.getDay(), dowPart)) {
          currentDate.setDate(currentDate.getDate() + 1);
          currentDate.setHours(0);
          currentDate.setMinutes(0);
          continue;
        }

        dates.push(new Date(currentDate));
        count++;

        currentDate = new Date(currentDate);
        currentDate.setMinutes(currentDate.getMinutes() + 1);
      }

      if (dates.length === 0) {
        for (let i = 0; i < 5; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() + i);
          dates.push(date);
        }
      }
    } catch (error) {
      for (let i = 0; i < 5; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() + i * 4);
        dates.push(date);
      }
    }

    return dates;
  };

  const getCronSummary = () => {
    if (cronExpression === "* * * * *") {
      return language === "en"
        ? "Every minute, every hour, every day"
        : "Co minutę, każdej godziny, codziennie";
    }

    if (cronExpression === "0 * * * *") {
      return language === "en"
        ? "At minute 0, every hour, every day"
        : "O minucie 0, każdej godziny, codziennie";
    }

    if (cronExpression === "0 0 * * *") {
      return language === "en"
        ? "At midnight (00:00), every day"
        : "O północy (00:00), codziennie";
    }

    if (
      minutes !== "*" &&
      hours !== "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek === "*"
    ) {
      return language === "en"
        ? `At ${hours}:${minutes.padStart(2, "0")}, every day`
        : `O ${hours}:${minutes.padStart(2, "0")}, codziennie`;
    }

    if (
      minutes !== "*" &&
      hours !== "*" &&
      dayOfMonth === "*" &&
      month === "*" &&
      dayOfWeek !== "*"
    ) {
      const days =
        language === "en"
          ? dayOfWeek
              .split(",")
              .map(
                (d) =>
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][Number.parseInt(d)],
              )
              .join(", ")
          : dayOfWeek
              .split(",")
              .map(
                (d) =>
                  [
                    "Niedziela",
                    "Poniedziałek",
                    "Wtorek",
                    "Środa",
                    "Czwartek",
                    "Piątek",
                    "Sobota",
                  ][Number.parseInt(d)],
              )
              .join(", ");

      return language === "en"
        ? `At ${hours}:${minutes.padStart(2, "0")}, only on ${days}`
        : `O ${hours}:${minutes.padStart(2, "0")}, tylko w ${days}`;
    }

    return language === "en"
      ? `Custom schedule: ${cronExpression}`
      : `Niestandardowy harmonogram: ${cronExpression}`;
  };

  return (
    <Card className={cn("w-full max-w-4xl", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("schedule.title")}</CardTitle>
            <CardDescription>{t("schedule.description")}</CardDescription>
            {!isValid && (
              <p className="text-sm text-red-500">
                {t("Nieprawidłowy format harmonogramu")}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="minutes" className="w-full" orientation="vertical">
          <TabsList
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
            }}
          >
            <TabsTrigger value="minutes">{t("schedule.minutes")}</TabsTrigger>
            <TabsTrigger value="hours">{t("schedule.hours")}</TabsTrigger>
            <TabsTrigger value="dayOfMonth">
              {t("schedule.dayOfMonth")}
            </TabsTrigger>
            <TabsTrigger value="month">{t("schedule.month")}</TabsTrigger>
            <TabsTrigger value="dayOfWeek">
              {t("schedule.dayOfWeek")}
            </TabsTrigger>
          </TabsList>

          {/* Minutes Tab */}
          <TabsContent value="minutes" className="space-y-4">
            <RadioGroup
              value={minuteType}
              onValueChange={setMinuteType}
              className="gap-4 pt-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every" id="minutes-every" />
                <Label htmlFor="minutes-every">{t("schedule.every")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="minutes-specific" />
                <Label htmlFor="minutes-specific">
                  {t("schedule.specific")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="minutes-range" />
                <Label htmlFor="minutes-range">{t("schedule.range")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="minutes-multiple" />
                <Label htmlFor="minutes-multiple">
                  {t("schedule.multiple")}
                </Label>
              </div>
            </RadioGroup>

            {minuteType === "specific" && (
              <Select value={specificMinute} onValueChange={setSpecificMinute}>
                <SelectTrigger>
                  <SelectValue placeholder={t("schedule.select")} />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {minuteType === "range" && (
              <div className="flex items-center space-x-2">
                <Label>{t("schedule.from")}</Label>
                <Select
                  value={minuteRange.from}
                  onValueChange={(value) =>
                    setMinuteRange({ ...minuteRange, from: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>{t("schedule.to")}</Label>
                <Select
                  value={minuteRange.to}
                  onValueChange={(value) =>
                    setMinuteRange({ ...minuteRange, to: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {minuteType === "multiple" && (
              <MultipleSelector
                options={minuteOptions}
                selected={multipleMinutes}
                onChange={setMultipleMinutes}
                placeholder={t("schedule.select")}
                noResults={t("schedule.noResults")}
              />
            )}
          </TabsContent>

          {/* Hours Tab */}
          <TabsContent value="hours" className="space-y-4">
            <RadioGroup
              value={hourType}
              onValueChange={setHourType}
              className="gap-4 pt-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every" id="hours-every" />
                <Label htmlFor="hours-every">{t("schedule.every")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="hours-specific" />
                <Label htmlFor="hours-specific">{t("schedule.specific")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="hours-range" />
                <Label htmlFor="hours-range">{t("schedule.range")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="hours-multiple" />
                <Label htmlFor="hours-multiple">{t("schedule.multiple")}</Label>
              </div>
            </RadioGroup>

            {hourType === "specific" && (
              <Select value={specificHour} onValueChange={setSpecificHour}>
                <SelectTrigger>
                  <SelectValue placeholder={t("schedule.select")} />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hourType === "range" && (
              <div className="flex items-center space-x-2">
                <Label>{t("schedule.from")}</Label>
                <Select
                  value={hourRange.from}
                  onValueChange={(value) =>
                    setHourRange({ ...hourRange, from: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>{t("schedule.to")}</Label>
                <Select
                  value={hourRange.to}
                  onValueChange={(value) =>
                    setHourRange({ ...hourRange, to: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {hourType === "multiple" && (
              <MultipleSelector
                options={hourOptions}
                selected={multipleHours}
                onChange={setMultipleHours}
                placeholder={t("schedule.select")}
                noResults={t("schedule.noResults")}
              />
            )}
          </TabsContent>

          {/* Day of Month Tab */}
          <TabsContent value="dayOfMonth" className="space-y-4">
            <RadioGroup
              value={dayOfMonthType}
              onValueChange={setDayOfMonthType}
              className="gap-4 pt-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every" id="dom-every" />
                <Label htmlFor="dom-every">{t("schedule.every")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="dom-specific" />
                <Label htmlFor="dom-specific">{t("schedule.specific")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="dom-range" />
                <Label htmlFor="dom-range">{t("schedule.range")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="dom-multiple" />
                <Label htmlFor="dom-multiple">{t("schedule.multiple")}</Label>
              </div>
            </RadioGroup>

            {dayOfMonthType === "specific" && (
              <Select
                value={specificDayOfMonth}
                onValueChange={setSpecificDayOfMonth}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("schedule.select")} />
                </SelectTrigger>
                <SelectContent>
                  {dayOfMonthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {dayOfMonthType === "range" && (
              <div className="flex items-center space-x-2">
                <Label>{t("schedule.from")}</Label>
                <Select
                  value={dayOfMonthRange.from}
                  onValueChange={(value) =>
                    setDayOfMonthRange({ ...dayOfMonthRange, from: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOfMonthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>{t("schedule.to")}</Label>
                <Select
                  value={dayOfMonthRange.to}
                  onValueChange={(value) =>
                    setDayOfMonthRange({ ...dayOfMonthRange, to: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOfMonthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {dayOfMonthType === "multiple" && (
              <MultipleSelector
                options={dayOfMonthOptions}
                selected={multipleDaysOfMonth}
                onChange={setMultipleDaysOfMonth}
                placeholder={t("schedule.select")}
                noResults={t("schedule.noResults")}
              />
            )}
          </TabsContent>

          {/* Month Tab */}
          <TabsContent value="month" className="space-y-4">
            <RadioGroup
              value={monthType}
              onValueChange={setMonthType}
              className="gap-4 pt-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every" id="month-every" />
                <Label htmlFor="month-every">{t("schedule.every")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="month-specific" />
                <Label htmlFor="month-specific">{t("schedule.specific")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="month-range" />
                <Label htmlFor="month-range">{t("schedule.range")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="month-multiple" />
                <Label htmlFor="month-multiple">{t("schedule.multiple")}</Label>
              </div>
            </RadioGroup>

            {monthType === "specific" && (
              <Select value={specificMonth} onValueChange={setSpecificMonth}>
                <SelectTrigger>
                  <SelectValue placeholder={t("schedule.select")} />
                </SelectTrigger>
                <SelectContent>
                  {(language === "en" ? monthOptions : monthOptionsPolish).map(
                    (option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}

            {monthType === "range" && (
              <div className="flex items-center space-x-2">
                <Label>{t("schedule.from")}</Label>
                <Select
                  value={monthRange.from}
                  onValueChange={(value) =>
                    setMonthRange({ ...monthRange, from: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(language === "en"
                      ? monthOptions
                      : monthOptionsPolish
                    ).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>{t("schedule.to")}</Label>
                <Select
                  value={monthRange.to}
                  onValueChange={(value) =>
                    setMonthRange({ ...monthRange, to: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(language === "en"
                      ? monthOptions
                      : monthOptionsPolish
                    ).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {monthType === "multiple" && (
              <MultipleSelector
                options={language === "en" ? monthOptions : monthOptionsPolish}
                selected={multipleMonths}
                onChange={setMultipleMonths}
                placeholder={t("schedule.select")}
                noResults={t("schedule.noResults")}
              />
            )}
          </TabsContent>

          {/* Day of Week Tab */}
          <TabsContent value="dayOfWeek" className="space-y-4">
            <RadioGroup
              value={dayOfWeekType}
              onValueChange={setDayOfWeekType}
              className="gap-4 pt-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="every" id="dow-every" />
                <Label htmlFor="dow-every">{t("schedule.every")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="dow-specific" />
                <Label htmlFor="dow-specific">{t("schedule.specific")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="dow-range" />
                <Label htmlFor="dow-range">{t("schedule.range")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="dow-multiple" />
                <Label htmlFor="dow-multiple">{t("schedule.multiple")}</Label>
              </div>
            </RadioGroup>

            {dayOfWeekType === "specific" && (
              <Select
                value={specificDayOfWeek}
                onValueChange={setSpecificDayOfWeek}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("schedule.select")} />
                </SelectTrigger>
                <SelectContent>
                  {(language === "en"
                    ? dayOfWeekOptions
                    : dayOfWeekOptionsPolish
                  ).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {dayOfWeekType === "range" && (
              <div className="flex items-center space-x-2">
                <Label>{t("schedule.from")}</Label>
                <Select
                  value={dayOfWeekRange.from}
                  onValueChange={(value) =>
                    setDayOfWeekRange({ ...dayOfWeekRange, from: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(language === "en"
                      ? dayOfWeekOptions
                      : dayOfWeekOptionsPolish
                    ).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Label>{t("schedule.to")}</Label>
                <Select
                  value={dayOfWeekRange.to}
                  onValueChange={(value) =>
                    setDayOfWeekRange({ ...dayOfWeekRange, to: value })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(language === "en"
                      ? dayOfWeekOptions
                      : dayOfWeekOptionsPolish
                    ).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {dayOfWeekType === "multiple" && (
              <MultipleSelector
                options={
                  language === "en" ? dayOfWeekOptions : dayOfWeekOptionsPolish
                }
                selected={multipleDaysOfWeek}
                onChange={setMultipleDaysOfWeek}
                placeholder={t("schedule.select")}
                noResults={t("schedule.noResults")}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t("schedule.preview")}</CardTitle>
              <CardDescription>{getCronSummary()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {t("schedule.expression")}
                  </h4>
                  <div
                    className="gap-2 text-center bg-muted/50 p-3 rounded-lg"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        {t("schedule.minutes")}
                      </span>
                      <span className="p-2 bg-background border rounded-md font-mono text-sm">
                        {minutes}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        {t("schedule.hours")}
                      </span>
                      <span className="p-2 bg-background border rounded-md font-mono text-sm">
                        {hours}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        {t("schedule.dayOfMonth")}
                      </span>
                      <span className="p-2 bg-background border rounded-md font-mono text-sm">
                        {dayOfMonth}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        {t("schedule.month")}
                      </span>
                      <span className="p-2 bg-background border rounded-md font-mono text-sm">
                        {month}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        {t("schedule.dayOfWeek")}
                      </span>
                      <span className="p-2 bg-background border rounded-md font-mono text-sm">
                        {dayOfWeek}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next runs */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {t("schedule.nextRuns")}
                  </h4>
                  <div className="space-y-2">
                    {getNextRunDates().map((date, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-muted/30 rounded-md"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                        <span className="text-sm">
                          {date.toLocaleString(
                            language === "en" ? "en-US" : "pl-PL",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for multiple selection
function MultipleSelector({
  options,
  selected,
  onChange,
  placeholder,
  noResults,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  noResults: string;
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
