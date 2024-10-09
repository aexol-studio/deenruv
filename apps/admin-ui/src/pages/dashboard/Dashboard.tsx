import { apiCall } from '@/graphql/client';
import { useSettings } from '@/state';
import { BetterMetricInterval, BetterMetricType, ResolverInputTypes } from '@/zeus';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pl, enGB } from 'date-fns/locale';
import { getZonedDate } from '@/utils';
import {
  BetterMetricsCustomDates,
  BetterMetricsIntervalSelect,
  LatestOrders,
  MetricTypeSelect,
  OrdersSummary,
} from './_components';
import { Card, CardTitle, Stack } from '@/components';
import { Chart } from '@/pages/dashboard/_components/Chart';

type AdditionalEntryData = { id: string; name: string; quantity: number };
type BetterMetricsChartDataType = {
  title: string;
  type: BetterMetricType;
  interval: BetterMetricInterval;
  entries: { label: string; value: number; additionalData?: AdditionalEntryData[] }[];
}[];

const getBetterMetrics = async (input: ResolverInputTypes['BetterMetricSummaryInput']) => {
  const { betterMetricSummary } = await apiCall()('query')({
    betterMetricSummary: [
      { input },
      {
        title: true,
        interval: true,
        type: true,
        entries: { label: true, value: true, additionalData: { id: true, name: true, quantity: true } },
      },
    ],
  });

  return betterMetricSummary;
};

export const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const language = useSettings((p) => p.language);
  const [metricLoading, setMetricLoading] = useState(false);
  const [metricSelectValue, setMetricSelectValue] = useState(BetterMetricInterval.Weekly);

  const [betterMetricsSettings, setBetterMetricsSettings] = useState<ResolverInputTypes['BetterMetricSummaryInput']>({
    interval: { type: BetterMetricInterval.Weekly },
    types: [BetterMetricType.OrderCount],
    refresh: false,
  });

  const [betterMetrics, setBetterMetrics] = useState<BetterMetricsChartDataType>([]);

  const getCustomIntervalDates = useCallback((interval: BetterMetricInterval): { start: Date; end: Date } => {
    switch (interval) {
      case BetterMetricInterval.ThisWeek:
        return {
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        };

      case BetterMetricInterval.LastWeek:
        return {
          start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
          end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        };

      case BetterMetricInterval.ThisMonth:
        return {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        };

      case BetterMetricInterval.LastMonth:
        return {
          start: startOfMonth(subMonths(new Date(), 1)),
          end: endOfMonth(subMonths(new Date(), 1)),
        };

      default:
        return {
          start: startOfWeek(new Date(), { weekStartsOn: 1 }),
          end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        };
    }
  }, []);

  useEffect(() => {
    const metricSettings = betterMetricsSettings;

    if (
      [
        BetterMetricInterval.LastMonth,
        BetterMetricInterval.ThisMonth,
        BetterMetricInterval.LastWeek,
        BetterMetricInterval.ThisWeek,
      ].includes(betterMetricsSettings.interval.type)
    ) {
      metricSettings.interval = {
        type: BetterMetricInterval.Custom,
        ...getCustomIntervalDates(betterMetricsSettings.interval.type),
      };
    }

    (async () => {
      try {
        setMetricLoading(true);
        const metric = await getBetterMetrics(metricSettings);

        setBetterMetrics(metric);
      } catch (e) {
        console.log(e);
      } finally {
        setMetricLoading(false);
      }
    })();
  }, [betterMetricsSettings, getCustomIntervalDates]);

  const changeBetterMetricType = (type: BetterMetricType) => {
    setBetterMetricsSettings((prev) => ({ ...prev, types: [type] }));
  };
  const changeMetricsInterval = (interval: BetterMetricInterval) => {
    setMetricSelectValue(interval);
    setBetterMetricsSettings((p) => ({ ...p, interval: { type: interval } }));
  };
  const changeCustomIntervalDate = (date: Date | undefined, key: 'end' | 'start') => {
    setBetterMetricsSettings((p) => ({ ...p, interval: { ...p.interval, [key]: date } }));
  };

  const betterData = useMemo(() => {
    return betterMetrics
      .map((metric) => {
        return metric.entries.map((entry) => ({
          name: format(getZonedDate(entry.label), 'PPP', {
            locale: language === 'pl' ? pl : enGB,
          }),
          value:
            metric.type === BetterMetricType.AverageOrderValue || metric.type === BetterMetricType.OrderTotal
              ? entry.value / 100
              : entry.value,
          type: metric.type,
          additionalData: entry.additionalData,
        }));
      })
      .flat();
  }, [betterMetrics, language]);

  return (
    <Stack className="gap-4" column>
      <OrdersSummary />
      <Card className="p-6">
        <Stack className="mb-3 justify-between gap-4" column>
          <CardTitle className="flex items-center gap-8 text-lg">
            <span>{t('metrics')}</span>
            <Stack className="gap-3">
              <MetricTypeSelect changeMetricType={changeBetterMetricType} loading={metricLoading} />
              <Stack className="gap-3">
                <BetterMetricsIntervalSelect
                  value={metricSelectValue}
                  changeMetricInterval={changeMetricsInterval}
                  loading={metricLoading}
                />
                <BetterMetricsCustomDates
                  isVisible={metricSelectValue === BetterMetricInterval.Custom}
                  endDate={betterMetricsSettings.interval.end as Date | undefined}
                  startDate={betterMetricsSettings.interval.start as Date | undefined}
                  setDate={changeCustomIntervalDate}
                />
              </Stack>
            </Stack>
          </CardTitle>
        </Stack>
        <Chart data={betterData} />
      </Card>
      <Stack className="items-start gap-6">
        <LatestOrders />
      </Stack>
    </Stack>
  );
};
