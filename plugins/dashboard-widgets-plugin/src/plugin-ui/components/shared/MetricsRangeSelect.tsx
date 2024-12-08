import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@deenruv/react-ui-devkit';
import { BetterMetricInterval } from '../../zeus';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MetricTypeSelectProps {
  value?: BetterMetricInterval;
  changeMetricInterval: (interval: BetterMetricInterval) => void;
  loading: boolean;
  withoutCustom?: boolean;
}

export const MetricsRangeSelect: React.FC<MetricTypeSelectProps> = ({
  changeMetricInterval,
  value,
  loading,
  withoutCustom = false,
}) => {
  const { t } = useTranslation('dashboard-widgets-plugin', {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  return (
    <div className="relative w-full max-w-[240px] xl:w-[240px]">
      {loading ? (
        <Skeleton className="absolute left-0 top-0 h-full w-full" />
      ) : null}
      <Select
        value={value}
        onValueChange={(value) =>
          changeMetricInterval(value as BetterMetricInterval)
        }
        defaultValue={BetterMetricInterval.Weekly}
      >
        <SelectTrigger className="h-[30px] w-full  text-[13px]">
          <SelectValue placeholder={t('selectDataType')} />
        </SelectTrigger>
        <SelectContent className="max-h-none w-full">
          <SelectGroup>
            <SelectItem value={BetterMetricInterval.Today}>
              {t('today')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.Yesterday}>
              {t('yesterday')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.Weekly}>
              {t('thisWeekInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.LastWeek}>
              {t('lastWeekInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.Monthly}>
              {t('thisMonthInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.LastMonth}>
              {t('lastMonthInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.Yearly}>
              {t('yearlyInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.FirstQuarter}>
              {t('firstYearQuarterInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.SecondQuarter}>
              {t('secondYearQuarterInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.ThirdQuarter}>
              {t('thirdYearQuarterInterval')}
            </SelectItem>
            <SelectItem value={BetterMetricInterval.FourthQuarter}>
              {t('fourthYearQuarterInterval')}
            </SelectItem>
            {!withoutCustom ? (
              <SelectItem value={BetterMetricInterval.Custom}>
                {t('customInterval')}
              </SelectItem>
            ) : null}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
