import { Card, CardContent, useTranslation } from "@deenruv/react-ui-devkit";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import React from "react";

interface CustomBarChartTooltipProps {
  chartProps: TooltipProps<ValueType, NameType>;
  currencyCode: string;
}
export const CustomBarChartTooltip: React.FC<CustomBarChartTooltipProps> = ({
  chartProps,
  currencyCode,
}) => {
  const { t } = useTranslation("dashboard-widgets-plugin");
  const payload = chartProps.payload?.[0]?.payload;

  return (
    <Card className="bg-muted flex p-2">
      <CardContent className="flex flex-col gap-1 p-0">
        <span>
          {t("sold")}
          {payload?.value}
        </span>
      </CardContent>
    </Card>
  );
};
