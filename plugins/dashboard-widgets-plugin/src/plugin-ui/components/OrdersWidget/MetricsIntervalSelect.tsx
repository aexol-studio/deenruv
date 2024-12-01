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

export const MetricsIntervalSelect: React.FC<{
    value: BetterMetricInterval;
    changeMetricInterval: (interval: BetterMetricInterval) => void;
    loading: boolean;
}> = ({ changeMetricInterval, value, loading }) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    return (
        <div className="flex gap-4">
            <div className="relative">
                {loading ? <Skeleton className="absolute left-0 top-0 h-full w-full" /> : null}
                <Select
                    value={value}
                    onValueChange={value => changeMetricInterval(value as BetterMetricInterval)}
                    defaultValue={BetterMetricInterval.Weekly}
                >
                    <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
                        <SelectValue placeholder={t('selectDataType')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
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
                            <SelectItem value={BetterMetricInterval.Yearly}>{t('yearlyInterval')}</SelectItem>
                            <SelectItem value={BetterMetricInterval.Custom}>{t('customInterval')}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
