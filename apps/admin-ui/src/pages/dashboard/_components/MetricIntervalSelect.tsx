import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';
import { BetterMetricInterval } from '@/zeus';
import { useTranslation } from 'react-i18next';

export const BetterMetricsIntervalSelect: React.FC<{
  value: BetterMetricInterval;
  changeMetricInterval: (interval: BetterMetricInterval) => void;
  loading: boolean;
}> = ({ changeMetricInterval, value, loading }) => {
  const { t } = useTranslation('dashboard');
  return (
    <div className="flex gap-4">
      <div className="relative">
        {loading ? <Skeleton className="absolute left-0 top-0 h-full w-full" /> : null}
        <Select
          value={value}
          onValueChange={(value) => changeMetricInterval(value as BetterMetricInterval)}
          defaultValue={BetterMetricInterval.Weekly}
        >
          <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
            <SelectValue placeholder={t('selectDataType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={BetterMetricInterval.ThisWeek}>{t('thisWeekInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.Weekly}>{t('weeklyInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.LastWeek}>{t('lastWeekInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.ThisMonth}>{t('thisMonthInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.Monthly}>{t('mothlyInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.LastMonth}>{t('lastMonthInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.Yearly}>{t('yearlyInterval')}</SelectItem>
              <SelectItem value={BetterMetricInterval.Custom}>{t('customInterval')}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
