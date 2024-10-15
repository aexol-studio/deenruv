import React from 'react';
import { useTranslation } from 'react-i18next';
import { BetterMetricType } from '../../zeus';
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
    changeMetricType: (type: BetterMetricType) => void;
    loading: boolean;
}> = ({ changeMetricType, loading }) => {
    const { t } = useTranslation('dashboard');
    return (
        <div className="relative flex gap-4">
            <div className="relative">
                {loading ? <Skeleton className="absolute left-0 top-0 h-full w-full" /> : null}
                <Select
                    onValueChange={value => changeMetricType(value as BetterMetricType)}
                    defaultValue={BetterMetricType.OrderTotal}
                >
                    <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
                        <SelectValue placeholder={t('selectDataType')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={BetterMetricType.AverageOrderValue}>
                                {t('averageOrderValue')}
                            </SelectItem>
                            <SelectItem value={BetterMetricType.OrderCount}>{t('orderCount')}</SelectItem>
                            <SelectItem value={BetterMetricType.OrderTotal}>{t('orderTotal')}</SelectItem>
                            <SelectItem value={BetterMetricType.OrderTotalProductsCount}>
                                {t('orderTotalProductsCount')}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
