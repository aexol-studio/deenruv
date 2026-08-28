import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React from "react";
import { GroupBy } from "../../types";

interface GroupBySelectProps {
  value?: GroupBy;
  changeGroupBy: (groupBy: GroupBy) => void;
}

export const GroupBySelect: React.FC<GroupBySelectProps> = ({
  changeGroupBy,
  value,
}) => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  return (
    <Select
      value={value}
      onValueChange={(value) => changeGroupBy(value as GroupBy)}
      defaultValue="day"
    >
      <SelectTrigger className="h-[30px] w-full  text-[13px]">
        <SelectValue placeholder={t("groupBy")} />
      </SelectTrigger>
      <SelectContent className="max-h-none w-full">
        <SelectGroup>
          <SelectItem value="day">{t("byDay")}</SelectItem>
          <SelectItem value="week">{t("byWeek")}</SelectItem>
          <SelectItem value="quarter">{t("byQuarter")}</SelectItem>
          <SelectItem value="month">{t("byMonth")}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
