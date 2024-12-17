import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChartMetricType } from '../../zeus';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '@deenruv/react-ui-devkit';

interface MetricTypeSelectProps {
  changeMetricType: (type: ChartMetricType) => void;
  metricType: ChartMetricType;
  loading: boolean;
}
export const MetricTypeSelect: React.FC<MetricTypeSelectProps> = ({
  changeMetricType,
  metricType,
  loading,
}) => {
  const { t } = useTranslation('dashboard-widgets-plugin', {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  return (
    <div className="relative w-full max-w-[240px]">
      {loading ? (
        <Skeleton className="absolute left-0 top-0 h-full w-full" />
      ) : null}
      <Select
        value={metricType}
        onValueChange={(value) => changeMetricType(value as ChartMetricType)}
        defaultValue={ChartMetricType.OrderTotal}
      >
        <SelectTrigger className="h-[30px] text-[13px]">
          <SelectValue placeholder={t('selectDataType')} />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectGroup>
            <SelectItem value={ChartMetricType.AverageOrderValue}>
              {t('averageOrderValue')}
            </SelectItem>
            <SelectItem value={ChartMetricType.OrderCount}>
              {t('orderCount')}
            </SelectItem>
            <SelectItem value={ChartMetricType.OrderTotal}>
              {t('orderTotal')}
            </SelectItem>
            <SelectItem value={ChartMetricType.OrderTotalProductsCount}>
              {t('orderTotalProductsCount')}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
