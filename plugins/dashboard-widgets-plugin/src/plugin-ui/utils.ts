import {
    addDays,
    addQuarters,
    eachDayOfInterval,
    endOfMonth,
    endOfQuarter,
    endOfToday,
    endOfWeek,
    endOfYear,
    endOfYesterday,
    format,
    startOfMonth,
    startOfQuarter,
    startOfToday,
    startOfWeek,
    startOfYear,
    startOfYesterday,
    subMonths,
    subWeeks,
} from 'date-fns';

import { pl, enGB } from 'date-fns/locale';
import { BetterMetricInterval, ChartMetricType, GraphQLTypes, ModelTypes } from './zeus';

export const getQuartersForYear = () => {
    const quarters = [];

    // Start of the first quarter
    let currentQuarterStart = startOfYear(new Date());

    for (let i = 0; i < 4; i++) {
        const quarterStart = startOfQuarter(currentQuarterStart);
        const quarterEnd = endOfQuarter(currentQuarterStart);
        quarters.push({
            start: quarterStart,
            end: quarterEnd,
        });
        // Move to the next quarter
        currentQuarterStart = addQuarters(currentQuarterStart, 1);
    }

    return quarters;
};
export const getCustomIntervalDates = (interval?: BetterMetricInterval): { start: Date; end: Date } => {
    const quarters = getQuartersForYear();
    switch (interval) {
        case BetterMetricInterval.Today: {
            return {
                start: startOfToday(),
                end: endOfToday(),
            };
        }
        case BetterMetricInterval.Yesterday: {
            return {
                start: startOfYesterday(),
                end: endOfYesterday(),
            };
        }
        case BetterMetricInterval.Monthly: {
            return {
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date()),
            };
        }
        case BetterMetricInterval.Weekly: {
            return {
                start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                end: endOfWeek(new Date(), { weekStartsOn: 1 }),
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
        case BetterMetricInterval.FirstQuarter:
            return quarters[0];
        case BetterMetricInterval.SecondQuarter:
            return quarters[1];
        case BetterMetricInterval.ThirdQuarter:
            return quarters[2];
        case BetterMetricInterval.FourthQuarter:
            return quarters[3];
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
                    type === ChartMetricType.AverageOrderValue ||
                    type === ChartMetricType.OrderTotal ||
                    type === ChartMetricType.OrderTotalProductsValue
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

export const getRandomColor = (colorsArray: string[]) => {
    const randomIndex = Math.floor(Math.random() * colorsArray.length);
    return colorsArray[randomIndex];
};

export const generateBrightRandomColor = () => {
    // Losujemy wartości RGB w zakresie 150-255, co zapewni jasne kolory
    const r = Math.floor(Math.random() * 106) + 150; // Czerwony (150-255)
    const g = Math.floor(Math.random() * 106) + 150; // Zielony (150-255)
    const b = Math.floor(Math.random() * 106) + 150; // Niebieski (150-255)

    // Konwertujemy wartości RGB na format HEX
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return hexColor;
};

export const sortBySelected = (selectedIds: string[]) => (a: { id: string }, b: { id: string }) => {
    const indexA = selectedIds.indexOf(a.id);
    const indexB = selectedIds.indexOf(b.id);

    // Elementy, które są w selectedAvailableProducts, idą na początek
    // Pozostałe pozostają na końcu w oryginalnej kolejności
    if (indexA === -1 && indexB === -1) return 0; // Obydwa nie są wybrane
    if (indexA === -1) return 1; // `a` nie jest wybrany, więc idzie dalej
    if (indexB === -1) return -1; // `b` nie jest wybrany, więc idzie dalej
    return indexA - indexB; // Porównujemy po kolejności w selectedAvailableProducts
};
