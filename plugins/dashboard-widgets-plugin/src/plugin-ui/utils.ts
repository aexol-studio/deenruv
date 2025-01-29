import {
    addDays,
    addQuarters,
    eachDayOfInterval,
    eachHourOfInterval,
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
    subDays,
    subMonths,
    subWeeks,
    subYears,
    parse,
    isValid,
    getQuarter,
    getISOWeek,
} from 'date-fns';

import { pl, enGB } from 'date-fns/locale';
import { MetricRangeType, ChartMetricType, GraphQLTypes, ModelTypes, MetricIntervalType } from './zeus';
import { fromZonedTime } from 'date-fns-tz';
import { AdditionalEntryData, GroupByPeriodArgs } from './types.js';

export const getQuartersForYear = (previous?: boolean) => {
    const quarters = [];

    // Start of the first quarter
    let currentQuarterStart = previous ? subYears(startOfYear(new Date()), 1) : startOfYear(new Date());

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
export const getCustomIntervalDates = (
    rangeType?: MetricRangeType,
): {
    range: { start: Date; end: Date };
    prevRange: { start: Date; end: Date };
} => {
    const quarters = getQuartersForYear();
    const previousQuarters = getQuartersForYear(true);
    switch (rangeType) {
        case MetricRangeType.Today: {
            return {
                range: { start: startOfToday(), end: endOfToday() },
                prevRange: { start: startOfYesterday(), end: endOfYesterday() },
            };
        }
        case MetricRangeType.Yesterday: {
            return {
                range: { start: startOfYesterday(), end: endOfYesterday() },
                prevRange: {
                    start: subDays(startOfYesterday(), 1),
                    end: subDays(endOfYesterday(), 1),
                },
            };
        }
        case MetricRangeType.ThisWeek: {
            return {
                range: {
                    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                },
                prevRange: {
                    start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                    end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                },
            };
        }
        case MetricRangeType.LastWeek:
            return {
                range: {
                    start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                    end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                },
                prevRange: {
                    start: startOfWeek(subWeeks(new Date(), 2), { weekStartsOn: 1 }),
                    end: endOfWeek(subWeeks(new Date(), 2), { weekStartsOn: 1 }),
                },
            };
        case MetricRangeType.ThisMonth: {
            return {
                range: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
                prevRange: {
                    start: startOfMonth(subMonths(new Date(), 1)),
                    end: endOfMonth(subMonths(new Date(), 1)),
                },
            };
        }
        case MetricRangeType.LastMonth:
            return {
                range: {
                    start: startOfMonth(subMonths(new Date(), 1)),
                    end: endOfMonth(subMonths(new Date(), 1)),
                },
                prevRange: {
                    start: startOfMonth(subMonths(new Date(), 2)),
                    end: endOfMonth(subMonths(new Date(), 2)),
                },
            };
        case MetricRangeType.ThisYear: {
            return {
                range: { start: startOfYear(new Date()), end: endOfYear(new Date()) },
                prevRange: {
                    start: startOfYear(subYears(new Date(), 1)),
                    end: endOfYear(subYears(new Date(), 1)),
                },
            };
        }
        case MetricRangeType.LastYear: {
            return {
                range: {
                    start: startOfYear(subYears(new Date(), 1)),
                    end: endOfYear(subYears(new Date(), 1)),
                },
                prevRange: {
                    start: startOfYear(subYears(new Date(), 2)),
                    end: endOfYear(subYears(new Date(), 2)),
                },
            };
        }
        case MetricRangeType.FirstQuarter:
            return { range: quarters[0], prevRange: previousQuarters[0] };
        case MetricRangeType.SecondQuarter:
            return { range: quarters[1], prevRange: previousQuarters[1] };
        case MetricRangeType.ThirdQuarter:
            return { range: quarters[2], prevRange: previousQuarters[2] };
        case MetricRangeType.FourthQuarter:
            return { range: quarters[3], prevRange: previousQuarters[3] };
        default:
            return {
                range: {
                    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
                },
                prevRange: {
                    start: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                    end: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
                },
            };
    }
};

interface ConvertBackendDataToChartDataProps {
    type: GraphQLTypes['ChartMetricType'];
    entries: ModelTypes['ChartEntry'][];
    prevEntries: ModelTypes['ChartEntry'][];
    interval: MetricIntervalType;
    language: string;
    start: Date;
    end?: Date;
}

export const convertBackedDataToChartData = (args: ConvertBackendDataToChartDataProps) => {
    const { entries, prevEntries, interval, language, start, type, end } = args;
    const isDayInteval = interval === MetricIntervalType.Day;

    const lastDay = entries.reduce((acc, curr) => (curr.intervalTick > acc ? curr.intervalTick : acc), 0);
    const prevLastDay = prevEntries.reduce(
        (acc, curr) => (curr.intervalTick > acc ? curr.intervalTick : acc),
        0,
    );
    const rangeDays = eachDayOfInterval({
        start,
        end: end ?? addDays(start, Math.max(lastDay, prevLastDay)),
    });
    const entriesMap = new Map(entries.map(entry => [entry.intervalTick, entry]));
    const prevEntriesMap = new Map(prevEntries.map(entry => [entry.intervalTick, entry]));

    const rangeHours = eachHourOfInterval({
        start: fromZonedTime(start, 'UTC'),
        end: end
            ? fromZonedTime(end, 'UTC')
            : addDays(fromZonedTime(start, 'UTC'), Math.max(lastDay, prevLastDay)),
    });

    const convertedData = (isDayInteval ? rangeDays : rangeHours).map((intervalTick, i) => {
        const entryFromMap = entriesMap.get(isDayInteval ? i + 1 : i);
        const prevEntryFromMap = prevEntriesMap.get(isDayInteval ? i + 1 : i);
        if (entryFromMap)
            return {
                name: format(intervalTick, isDayInteval ? 'PPP' : 'HH:mm', {
                    locale: language === 'pl' ? pl : enGB,
                }),
                value:
                    type === ChartMetricType.AverageOrderValue || type === ChartMetricType.OrderTotal
                        ? entryFromMap.value / 100
                        : entryFromMap.value,
                prevValue: prevEntryFromMap
                    ? type === ChartMetricType.AverageOrderValue || type === ChartMetricType.OrderTotal
                        ? prevEntryFromMap.value / 100
                        : prevEntryFromMap.value
                    : 0,
                additionalData: entryFromMap.additionalData ?? undefined,
                type,
            };
        else
            return {
                name: format(intervalTick, isDayInteval ? 'PPP' : 'HH:mm', {
                    locale: language === 'pl' ? pl : enGB,
                }),
                value: 0,
                prevValue: prevEntryFromMap
                    ? type === ChartMetricType.AverageOrderValue || type === ChartMetricType.OrderTotal
                        ? prevEntryFromMap.value / 100
                        : prevEntryFromMap.value
                    : 0,
                additionalData: undefined,
                type,
            };
    });
    return convertedData;
};

export const generateBrightRandomColor = () => {
    const r = Math.floor(Math.random() * 106) + 150;
    const g = Math.floor(Math.random() * 106) + 150;
    const b = Math.floor(Math.random() * 106) + 150;

    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return hexColor;
};

export const sortBySelected = (selectedIds: string[]) => (a: { id: string }, b: { id: string }) => {
    const indexA = selectedIds.indexOf(a.id);
    const indexB = selectedIds.indexOf(b.id);

    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
};

export const getRandomColor = (colorsArray: string[]) => {
    const randomIndex = Math.floor(Math.random() * colorsArray.length);
    return colorsArray[randomIndex];
};

export const calculatePercentage = (part: number, total: number) => {
    if (total === 0 && part === 0) return 0;
    if (total === 0) return 100;
    const percentage = (part / total) * 100;
    return percentage - 100;
};

export const giveSummaryMetricsRatio = (
    metric: ModelTypes['OrderSummaryDataMetric'],
    prevMetric: ModelTypes['OrderSummaryDataMetric'],
) => {
    const prevRatio: ModelTypes['OrderSummaryDataMetric'] = {
        ...prevMetric,
        averageOrderValue: +calculatePercentage(
            metric.averageOrderValue,
            prevMetric.averageOrderValue,
        ).toFixed(2),
        averageOrderValueWithTax: +calculatePercentage(
            metric.averageOrderValueWithTax,
            prevMetric.averageOrderValueWithTax,
        ).toFixed(2),
        orderCount: +calculatePercentage(metric.orderCount, prevMetric.orderCount).toFixed(2),
        productCount: +calculatePercentage(metric.productCount, prevMetric.productCount).toFixed(2),
        total: +calculatePercentage(metric.total, prevMetric.total).toFixed(2),
        totalWithTax: +calculatePercentage(metric.totalWithTax, prevMetric.totalWithTax).toFixed(2),
    };
    return prevRatio;
};

const groupByPeriodsInitialValue = (name: string, type: ChartMetricType) => ({
    name,
    value: 0,
    prevValue: 0,
    type,
    additionalData: [],
});
const quarterMap = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
const monthsMap = {
    stycznia: 'Styczeń',
    lutego: 'Luty',
    marca: 'Marzec',
    kwietnia: 'Kwiecień',
    maja: 'Maj',
    czerwca: 'Czerwiec',
    lipca: 'Lipiec',
    sierpnia: 'Sierpień',
    września: 'Wrzesień',
    października: 'Październik',
    listopada: 'Listopad',
    grudnia: 'Grudzień',
};

export const groupByPeriods = (args: GroupByPeriodArgs) => {
    const { data, language, groupBy } = args;

    if (groupBy === 'day') return data;
    return data.reduce(
        (acc, item) => {
            const safeName = parseNameToCurrentLanguage(item.name, language);
            const date = parse(safeName, 'd MMMM yyyy', new Date(), {
                locale: language === 'pl' ? pl : enGB,
            });

            switch (groupBy) {
                case 'week': {
                    const week = `W${getISOWeek(date)}`;
                    if (!acc[week]) acc[week] = groupByPeriodsInitialValue(week, item.type);
                    acc[week].value += item?.value ?? 0;
                    acc[week].prevValue += item?.prevValue ?? 0;
                    item.additionalData?.forEach(data => {
                        const existingRecord = acc[week].additionalData?.find(item => item.id === data.id);
                        if (existingRecord) {
                            const withoutExistingRecord = acc[week].additionalData?.filter(
                                item => item.id !== data.id,
                            );
                            acc[week].additionalData = [
                                ...(withoutExistingRecord ?? []),
                                {
                                    ...existingRecord,
                                    quantity: existingRecord.quantity + data.quantity,
                                },
                            ];
                        } else {
                            acc[week].additionalData?.push(data);
                        }
                    });
                    return acc;
                }
                case 'month': {
                    const monthDate = `${format(date, 'MMMM', {
                        locale: language === 'pl' ? pl : enGB,
                    })}`;
                    const month =
                        language === 'pl' ? monthsMap[monthDate as keyof typeof monthsMap] : monthDate;
                    if (!acc[month]) acc[month] = groupByPeriodsInitialValue(month, item.type);
                    acc[month].value += item?.value ?? 0;
                    acc[month].prevValue += item?.prevValue ?? 0;
                    item.additionalData?.forEach(data => {
                        const existingRecord = acc[month].additionalData?.find(item => item.id === data.id);
                        if (existingRecord) {
                            const withoutExistingRecord = acc[month].additionalData?.filter(
                                item => item.id !== data.id,
                            );
                            acc[month].additionalData = [
                                ...(withoutExistingRecord ?? []),
                                {
                                    ...existingRecord,
                                    quantity: existingRecord.quantity + data.quantity,
                                },
                            ];
                        } else {
                            acc[month].additionalData?.push(data);
                        }
                    });
                    return acc;
                }
                case 'quarter': {
                    const quarterDesc = language === 'pl' ? 'kwartał' : 'quarter';
                    const quarter = `${quarterMap[getQuarter(date) as keyof typeof quarterMap]} ${quarterDesc} ${format(date, 'yyyy')}`;
                    if (!acc[quarter]) acc[quarter] = groupByPeriodsInitialValue(quarter, item.type);
                    acc[quarter].value += item?.value ?? 0;
                    acc[quarter].prevValue += item?.prevValue ?? 0;
                    item.additionalData?.forEach(data => {
                        const existingRecord = acc[quarter].additionalData?.find(item => item.id === data.id);
                        if (existingRecord) {
                            const withoutExistingRecord = acc[quarter].additionalData?.filter(
                                item => item.id !== data.id,
                            );
                            acc[quarter].additionalData = [
                                ...(withoutExistingRecord ?? []),
                                {
                                    ...existingRecord,
                                    quantity: existingRecord.quantity + data.quantity,
                                },
                            ];
                        } else {
                            acc[quarter].additionalData?.push(data);
                        }
                    });
                    return acc;
                }
            }
        },
        {} as {
            [key: string]: {
                name: string;
                value: number;
                prevValue: number;
                type: ChartMetricType;
                additionalData?: AdditionalEntryData[];
            };
        },
    );
};

export const parseNameToCurrentLanguage = (name: string, language: string) => {
    const namePL = parse(name, 'd MMMM yyyy', new Date(), {
        locale: pl,
    });
    const nameEN = parse(name, 'd MMMM yyyy', new Date(), {
        locale: enGB,
    });
    if (isValid(namePL)) {
        if (language === 'en') {
            const parsedToEn = format(namePL, 'd MMMM yyyy', {
                locale: enGB,
            });
            return parsedToEn;
        } else return name;
    }
    if (isValid(nameEN)) {
        if (language === 'pl') {
            const parsedToEn = format(nameEN, 'd MMMM yyyy', {
                locale: pl,
            });
            return parsedToEn;
        } else return name;
    }
    return name;
};
