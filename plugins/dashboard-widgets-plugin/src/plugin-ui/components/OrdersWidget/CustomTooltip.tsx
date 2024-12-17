import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  cn,
} from '@deenruv/react-ui-devkit';
import { ChartMetricType } from '../../zeus';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import React from 'react';
import { CurrencyCode } from '@deenruv/admin-types';
import { AdditionalEntryData, DataTKeys } from '../../types';
import { RatioBadge } from './RatioBadge';
import { calculatePercentage } from '../../utils';

const metricTypeLabels: Record<ChartMetricType, DataTKeys> = {
  [ChartMetricType.AverageOrderValue]: 'averageOrderValue',
  [ChartMetricType.OrderCount]: 'orderCount',
  [ChartMetricType.OrderTotal]: 'orderTotal',
  [ChartMetricType.OrderTotalProductsCount]: 'orderTotalProductsCount',
};

interface CustomTooltipProps {
  chartProps: TooltipProps<ValueType, NameType>;
  language: string;
  selectedAvailableProducts: { id: string; color: string }[];
  shouldShowCompare: boolean;
  valueStroke: string;
  prevValueStroke: string;
}
export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  chartProps,
  language,
  selectedAvailableProducts,
  shouldShowCompare,
  prevValueStroke,
  valueStroke,
}) => {
  const { t } = useTranslation('dashboard-widgets-plugin', {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const payload = chartProps.payload?.[0]?.payload;

  const value = payload?.value;
  const prevValue = payload?.prevValue;
  const additionalData = payload?.additionalData as AdditionalEntryData[];
  const metricType = payload?.type as ChartMetricType;
  const labelKey = metricTypeLabels[metricType];
  const currencyFormatter = new Intl.NumberFormat(
    language === 'pl' ? 'pl-PL' : 'en-GB',
    {
      style: 'currency',
      currency: 'PLN',
    },
  );
  const formattedValue =
    metricType === ChartMetricType.AverageOrderValue ||
    metricType === ChartMetricType.OrderTotal
      ? currencyFormatter.format(value as number)
      : value;
  const formattedPrevValue =
    metricType === ChartMetricType.AverageOrderValue ||
    metricType === ChartMetricType.OrderTotal
      ? currencyFormatter.format(prevValue as number)
      : prevValue;
  return (
    <Card className="flex flex-col bg-muted">
      <CardHeader className="pb-2">
        <CardDescription className="border-b border-muted-foreground flex items-center justify-between pb-2">
          {payload?.name}
          {shouldShowCompare ? (
            <RatioBadge
              ratio={+calculatePercentage(value, prevValue).toFixed(2)}
            />
          ) : null}
        </CardDescription>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2  !text-xl">
            {shouldShowCompare ? (
              <div className="pr-1 flex items-center">
                <span
                  style={{
                    background: valueStroke,
                    display: 'block',
                    width: 14,
                    height: 14,
                    borderRadius: '100%',
                  }}
                />
              </div>
            ) : null}
            <span>
              {t(labelKey)}: {formattedValue}
            </span>
          </div>
          {shouldShowCompare ? (
            <div className="flex items-center gap-2 !text-md">
              <div className="pr-1 flex items-center">
                <span
                  style={{
                    background: prevValueStroke,
                    display: 'block',
                    width: 14,
                    height: 14,
                    borderRadius: '100%',
                  }}
                />
              </div>
              <span>
                {t('previous')}: {formattedPrevValue}
              </span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {additionalData
          ?.filter((d) =>
            selectedAvailableProducts?.length
              ? selectedAvailableProducts?.some((sap) => sap.id === d.id)
              : true,
          )
          ?.sort((a, b) => b.quantity - a.quantity)
          ?.map((d) => {
            const isSelected = selectedAvailableProducts.some(
              (p) => p.id === d.id,
            );
            const color = selectedAvailableProducts.find(
              (p) => p.id === d.id,
            )?.color;
            return (
              <div key={d.id} className="flex justify-between gap-4">
                <div
                  style={{
                    color,
                  }}
                  className={cn(
                    'flex items-center gap-1 ',
                    !isSelected && 'text-muted-foreground',
                  )}
                >
                  {isSelected ? (
                    <div className="pr-1 flex items-center">
                      <span
                        style={{
                          background: color,
                          display: 'block',
                          width: 14,
                          height: 2,
                        }}
                      />
                    </div>
                  ) : null}
                  <span>{d.name}</span>
                  <span className="opacity-70">
                    {`( ${t('variantID')}: ${d.id} ) `}:
                  </span>
                </div>
                <span
                  style={{
                    color,
                  }}
                >
                  {d.quantity}
                </span>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};
