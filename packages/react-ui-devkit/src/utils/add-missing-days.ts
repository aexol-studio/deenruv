import { getZonedDate } from '@/utils';
import { BetterMetricType } from '@/zeus';
import { eachDayOfInterval, format } from 'date-fns';
import { pl, enGB } from 'date-fns/locale';

type AdditionalEntryData = { id: string; name: string; quantity: number };

interface MetricData {
    name: string;
    value: number;
    additionalData: undefined | AdditionalEntryData[];
    type: BetterMetricType;
}

export const addMissingDays = (
    start: string,
    end: string,
    type: BetterMetricType,
    language: string,
    partialData: { label: string; value: number; additionalData?: AdditionalEntryData[] }[] = [],
): MetricData[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const mappedPartialData = partialData.map(item => ({
        name: item.label,
        value: item.value,
        additionalData: item.additionalData ?? undefined,
        type,
    }));

    const dataMap = new Map(mappedPartialData.map(item => [item.name, item]));
    return days.map(day => {
        const matchingDate = format(getZonedDate(day), 'yyyy-MM-dd');
        const displayDate = format(getZonedDate(day), 'PPP', {
            locale: language === 'pl' ? pl : enGB,
        });

        return (
            dataMap.get(matchingDate) || {
                name: displayDate,
                value: 0,
                additionalData: undefined,
                type,
            }
        );
    });
};
