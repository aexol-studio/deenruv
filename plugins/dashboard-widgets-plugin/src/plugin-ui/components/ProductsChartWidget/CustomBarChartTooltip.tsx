import { Card, CardContent, priceFormatter } from '@deenruv/react-ui-devkit';

import { useTranslation } from 'react-i18next';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import React from 'react';

interface CustomBarChartTooltipProps {
    chartProps: TooltipProps<ValueType, NameType>;
    currencyCode: string;
}
export const CustomBarChartTooltip: React.FC<CustomBarChartTooltipProps> = ({ chartProps, currencyCode }) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const payload = chartProps.payload?.[0]?.payload;

    return (
        <Card className="flex bg-muted p-2">
            <CardContent className="flex flex-col gap-1 p-0">
                <span>
                    {t('sold')}
                    {payload?.value}
                </span>
                <span className="h-[1px] w-full bg-muted-foreground" />
                <span>
                    {t('soldValue')}
                    {priceFormatter(payload?.priceValue ?? 0, currencyCode)}
                </span>
            </CardContent>
        </Card>
    );
};
