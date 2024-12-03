import {
    addDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
} from 'date-fns';

import { pl, enGB } from 'date-fns/locale';
import { BetterMetricInterval, ChartMetricType, GraphQLTypes, ModelTypes } from './zeus';
export const getCustomIntervalDates = (interval: BetterMetricInterval): { start: Date; end: Date } => {
    switch (interval) {
        case BetterMetricInterval.Monthly: {
            return {
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date()),
            };
        }
        case BetterMetricInterval.Weekly: {
            return {
                start: startOfWeek(new Date()),
                end: endOfWeek(new Date()),
            };
        }
        case BetterMetricInterval.Yearly: {
            return {
                start: startOfYear(new Date()),
                end: endOfYear(new Date()),
            };
        }
        case BetterMetricInterval.LastWeek:
            return {
                start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
            };

        case BetterMetricInterval.ThisMonth:
            return {
                start: addDays(startOfMonth(new Date()), 1),
                end: endOfMonth(new Date()),
            };

        case BetterMetricInterval.LastMonth:
            return {
                start: startOfMonth(subMonths(new Date(), 1)),
                end: endOfMonth(subMonths(new Date(), 1)),
            };

        default:
            return {
                start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                end: endOfWeek(new Date(), { weekStartsOn: 1 }),
            };
    }
};

export const convertBackedDataToChartData = (
    type: GraphQLTypes['ChartMetricType'],
    entries: ModelTypes['ChartEntry'][],
    language: string,
    start: Date,
    end?: Date,
) => {
    const lastDay = entries.reduce((acc, curr) => (curr.day > acc ? curr.day : acc), 0);
    const rangeDays = eachDayOfInterval({
        start,
        end: end ?? addDays(start, lastDay),
    });
    const entriesMap = new Map(entries.map(entry => [entry.day, entry]));
    const convertedData = rangeDays.map((day, i) => {
        const entryFromMap = entriesMap.get(i + 1);
        if (entryFromMap)
            return {
                name: format(day, 'PPP', {
                    locale: language === 'pl' ? pl : enGB,
                }),
                value:
                    type === ChartMetricType.AverageOrderValue || type === ChartMetricType.OrderTotal
                        ? entryFromMap.value / 100
                        : entryFromMap.value,
                additionalData: entryFromMap.additionalData ?? undefined,
                type,
            };
        else
            return {
                name: format(day, 'PPP', {
                    locale: language === 'pl' ? pl : enGB,
                }),
                value: 0,
                additionalData: undefined,
                type,
            };
    });
    return convertedData;
};
