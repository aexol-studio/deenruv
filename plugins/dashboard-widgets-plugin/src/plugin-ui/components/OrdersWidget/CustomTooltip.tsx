import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    cn,
    priceFormatter,
} from '@deenruv/react-ui-devkit';
import { ChartMetricType } from '../../zeus';
import { useTranslation } from 'react-i18next';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import React from 'react';
import { CurrencyCode } from '@deenruv/admin-types';
import { AdditionalEntryData, DataTKeys } from '../../types';

const metricTypeLabels: Record<ChartMetricType, DataTKeys> = {
    [ChartMetricType.AverageOrderValue]: 'averageOrderValue',
    [ChartMetricType.OrderCount]: 'orderCount',
    [ChartMetricType.OrderTotal]: 'orderTotal',
    [ChartMetricType.OrderTotalProductsCount]: 'orderTotalProductsCount',
    [ChartMetricType.OrderTotalProductsValue]: 'orderTotalProductsValue',
};

interface CustomTooltipProps {
    chartProps: TooltipProps<ValueType, NameType>;
    language: string;
    selectedAvailableProducts: { id: string; color: string }[];
    currencyCode: CurrencyCode;
}
export const CustomTooltip: React.FC<CustomTooltipProps> = ({
    chartProps,
    language,
    selectedAvailableProducts,
    currencyCode,
}) => {
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
        metricType === ChartMetricType.AverageOrderValue ||
        metricType === ChartMetricType.OrderTotal ||
        metricType === ChartMetricType.OrderTotalProductsValue
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
                {additionalData
                    ?.filter(d =>
                        selectedAvailableProducts?.length
                            ? selectedAvailableProducts?.some(sap => sap.id === d.id)
                            : true,
                    )
                    ?.sort((a, b) =>
                        metricType === ChartMetricType.OrderTotalProductsCount
                            ? b.quantity - a.quantity
                            : b.priceWithTax - a.priceWithTax,
                    )
                    ?.map(d => {
                        const isSelected = selectedAvailableProducts.some(p => p.id === d.id);
                        const color = selectedAvailableProducts.find(p => p.id === d.id)?.color;
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
                                    <span className="opacity-70">{`( ${t('variantID')}: ${d.id} ) `}:</span>
                                </div>
                                <span
                                    style={{
                                        color,
                                    }}
                                >
                                    {metricType === ChartMetricType.OrderTotalProductsCount
                                        ? d.quantity
                                        : priceFormatter(d.priceWithTax, currencyCode)}
                                </span>
                            </div>
                        );
                    })}
            </CardContent>
        </Card>
    );
};
