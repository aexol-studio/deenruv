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

export const MetricTypeSelect: React.FC<{
    changeMetricType: (type: ChartMetricType) => void;
    loading: boolean;
}> = ({ changeMetricType, loading }) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    return (
        <div className="relative flex gap-4">
            <div className="relative">
                {loading ? <Skeleton className="absolute left-0 top-0 h-full w-full" /> : null}
                <Select
                    onValueChange={value => changeMetricType(value as ChartMetricType)}
                    defaultValue={ChartMetricType.OrderTotal}
                >
                    <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
                        <SelectValue placeholder={t('selectDataType')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={ChartMetricType.AverageOrderValue}>
                                {t('averageOrderValue')}
                            </SelectItem>
                            <SelectItem value={ChartMetricType.OrderCount}>{t('orderCount')}</SelectItem>
                            <SelectItem value={ChartMetricType.OrderTotal}>{t('orderTotal')}</SelectItem>
                            <SelectItem value={ChartMetricType.OrderTotalProductsCount}>
                                {t('orderTotalProductsCount')}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
