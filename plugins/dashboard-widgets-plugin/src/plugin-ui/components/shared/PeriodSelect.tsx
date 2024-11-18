import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    endOfMonth,
    endOfToday,
    endOfWeek,
    endOfYear,
    endOfYesterday,
    startOfMonth,
    startOfToday,
    startOfWeek,
    startOfYear,
    startOfYesterday,
} from 'date-fns';

export enum Periods {
    Today = 'today',
    Yesterday = 'yesterday',
    ThisWeek = 'thisWeek',
    ThisMonth = 'thisMonth',
    ThisYear = 'thisYear',
}

export type Period = {
    period: Periods;
    text: string;
    start: Date;
    end: Date;
};

interface PeriodSelectProps {
    selectedPeriod: Periods;
    onPeriodChange: (period: Period) => void;
}

export const PeriodSelect: React.FC<PeriodSelectProps> = ({ selectedPeriod, onPeriodChange }) => {
    const { t } = useTranslation('dashboard');

    const _periods = useMemo(
        (): Period[] => [
            {
                period: Periods.Today,
                text: t('today'),
                start: startOfToday(),
                end: endOfToday(),
            },
            {
                period: Periods.Yesterday,
                text: t('yesterday'),
                start: startOfYesterday(),
                end: endOfYesterday(),
            },
            {
                period: Periods.ThisWeek,
                text: t('thisWeek'),
                start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                end: endOfWeek(new Date(), { weekStartsOn: 1 }),
            },
            {
                period: Periods.ThisMonth,
                text: t('thisMonth'),
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date()),
            },
            {
                period: Periods.ThisYear,
                text: t('thisYear'),
                start: startOfYear(new Date()),
                end: endOfYear(new Date()),
            },
        ],
        [t],
    );

    const handlePeriodChange = useCallback(
        (period: Periods) => {
            const periodData = _periods.find(p => p.period === period);
            if (periodData) onPeriodChange(periodData);
        },
        [onPeriodChange, _periods],
    );

    return (
        <Select
            onValueChange={value => handlePeriodChange(value as Periods)}
            value={selectedPeriod}
            defaultValue={_periods[0].period}
        >
            <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
                <SelectValue placeholder={t('selectDataType')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {_periods.map(p => (
                        <SelectItem key={p.period} value={p.period}>
                            {p.text}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
