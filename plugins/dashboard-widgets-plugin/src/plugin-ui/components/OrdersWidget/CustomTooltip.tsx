import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
import { ChartMetricType } from '../../zeus';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import React from 'react';
import { format } from 'date-fns';

type AdditionalEntryData = { id: string; name: string; quantity: number };
type DataTKeys = 'averageOrderValue' | 'orderCount' | 'orderTotal' | 'orderTotalProductsCount';

const metricTypeLabels: Record<ChartMetricType, DataTKeys> = {
    [ChartMetricType.AverageOrderValue]: 'averageOrderValue',
    [ChartMetricType.OrderCount]: 'orderCount',
    [ChartMetricType.OrderTotal]: 'orderTotal',
    [ChartMetricType.OrderTotalProductsCount]: 'orderTotalProductsCount',
};

interface CustomTooltipProps {
    chartProps: TooltipProps<ValueType, NameType>;
    language: string;
}
export const CustomTooltip: React.FC<CustomTooltipProps> = ({ chartProps, language }) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const payload = chartProps.payload?.[0]?.payload;
    const value = payload?.value;
    const additionalData = payload?.additionalData as AdditionalEntryData[];
    const metricType = payload?.type as ChartMetricType;
    const labelKey = metricTypeLabels[metricType];
    const currencyFormatter = new Intl.NumberFormat(language === 'pl' ? 'pl-PL' : 'en-GB', {
        style: 'currency',
        currency: 'PLN',
    });
    const formattedValue =
        metricType === ChartMetricType.AverageOrderValue || metricType === ChartMetricType.OrderTotal
            ? currencyFormatter.format(value as number)
            : value;

    return (
        <Card className="flex flex-col bg-muted">
            <CardHeader className="pb-2">
                <CardDescription>{payload?.name}</CardDescription>
                <CardTitle className="border-b border-muted-foreground pb-2 text-xl">
                    <span>
                        {t(labelKey)}: {formattedValue}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <span className="h-[1px] w-full bg-border" />
                {additionalData
                    ?.sort((a, b) => b.quantity - a.quantity)
                    ?.map(d => (
                        <div key={d.id} className="flex justify-between gap-4">
                            <span className="text-muted-foreground">{d.name}:</span>
                            <span>{d.quantity}</span>
                        </div>
                    ))}
            </CardContent>
        </Card>
    );
};
