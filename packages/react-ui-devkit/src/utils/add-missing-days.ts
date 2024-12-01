import { eachDayOfInterval, format } from 'date-fns';
import { pl, enGB } from 'date-fns/locale';

type AdditionalEntryData = { id: string; name: string; quantity: number };

interface MetricData<T> {
    name: string;
    value: number;
    additionalData: undefined | AdditionalEntryData[];
    type: T;
}

export const addMissingDays = <T>(
    start: string,
    end: string,
    type: T,
    language: string,
    partialData: {
        label: string;
        value: number;
        additionalData?: AdditionalEntryData[];
    }[] = [],
): MetricData<T>[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const mappedPartialData = partialData.map(item => ({
        name: item.label,
        value: item.value,
        additionalData: item.additionalData ?? undefined,
        type,
    }));

    const dataMap = new Map(
        mappedPartialData.map(item => [
            new Date(item.name).toISOString(),
            {
                ...item,
                name: format(new Date(item.name), 'PPP', {
                    locale: language === 'pl' ? pl : enGB,
                }),
            },
        ]),
    );
    return days.map(day => {
        const matchingDate = day.toISOString();
        const displayDate = format(new Date(day), 'PPP', {
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
