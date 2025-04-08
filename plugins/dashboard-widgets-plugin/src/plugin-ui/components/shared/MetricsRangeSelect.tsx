import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { MetricRangeType } from "../../zeus";
import React from "react";

interface MetricTypeSelectProps {
  value?: MetricRangeType;
  changeMetricInterval: (interval: MetricRangeType) => void;
  loading: boolean;
  withoutCustom?: boolean;
}

export const MetricsRangeSelect: React.FC<MetricTypeSelectProps> = ({
  changeMetricInterval,
  value,
  loading,
  withoutCustom = false,
}) => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  return (
    <div className="relative w-full max-w-[240px] xl:w-[240px]">
      {loading ? (
        <Skeleton className="absolute left-0 top-0 size-full" />
      ) : null}
      <Select
        value={value}
        onValueChange={(value) =>
          changeMetricInterval(value as MetricRangeType)
        }
        defaultValue={MetricRangeType.ThisWeek}
      >
        <SelectTrigger className="h-[30px] w-full  text-[13px]">
          <SelectValue placeholder={t("selectDataType")} />
        </SelectTrigger>
        <SelectContent className="max-h-none w-full">
          <SelectGroup>
            <SelectItem value={MetricRangeType.Today}>{t("today")}</SelectItem>
            <SelectItem value={MetricRangeType.Yesterday}>
              {t("yesterday")}
            </SelectItem>
            <SelectItem value={MetricRangeType.ThisWeek}>
              {t("thisWeek")}
            </SelectItem>
            <SelectItem value={MetricRangeType.LastWeek}>
              {t("lastWeek")}
            </SelectItem>
            <SelectItem value={MetricRangeType.ThisMonth}>
              {t("thisMonth")}
            </SelectItem>
            <SelectItem value={MetricRangeType.LastMonth}>
              {t("lastMonth")}
            </SelectItem>
            <SelectItem value={MetricRangeType.ThisYear}>
              {t("thisYear")}
            </SelectItem>
            <SelectItem value={MetricRangeType.LastYear}>
              {t("lastYear")}
            </SelectItem>
            <SelectItem value={MetricRangeType.FirstQuarter}>
              {t("firstYearQuarterInterval")}
            </SelectItem>
            <SelectItem value={MetricRangeType.SecondQuarter}>
              {t("secondYearQuarterInterval")}
            </SelectItem>
            <SelectItem value={MetricRangeType.ThirdQuarter}>
              {t("thirdYearQuarterInterval")}
            </SelectItem>
            <SelectItem value={MetricRangeType.FourthQuarter}>
              {t("fourthYearQuarterInterval")}
            </SelectItem>
            {!withoutCustom ? (
              <SelectItem value={MetricRangeType.Custom}>
                {t("customInterval")}
              </SelectItem>
            ) : null}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
