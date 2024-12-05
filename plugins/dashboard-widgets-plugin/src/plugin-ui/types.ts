import { ChartMetricType } from './zeus';

export type AdditionalEntryData = {
    id: string;
    name: string;
    quantity: number;
    priceWithTax: number;
};
export type DataTKeys =
    | 'averageOrderValue'
    | 'orderCount'
    | 'orderTotal'
    | 'orderTotalProductsCount'
    | 'orderTotalProductsValue';

export type BetterMetricsChartDataType = {
    data: {
        title: string;
        type: ChartMetricType;
        entries: {
            type: ChartMetricType;
            name: string;
            value: number;
            additionalData?: AdditionalEntryData[];
        }[];
    }[];
    lastCacheRefreshTime?: string;
};

export type AvailableProductData = {
    id: string;
    name: string;
    label: string;
    value: number;
    priceWithTax: number;
}[];

export type SortBy = 'BY_COUNT' | 'BY_NET_WORTH';
export type ShowData = 'FIRST_FIVE' | 'ALL';

export enum Periods {
    Today = 'today',
    Yesterday = 'yesterday',
    ThisWeek = 'thisWeek',
    LastWeek = 'lastWeek',
    ThisMonth = 'thisMonth',
    lastMonth = 'lastMonth',
    ThisYear = 'thisYear',
    FirstYearQuarter = 'firstYearQuarterInterval',
    SecondYearQuarter = 'secondYearQuarterInterval',
    ThirdYearQuarter = 'thirdYearQuarterInterval',
    FourthYearQuarter = 'fourthYearQuarterInterval',
}

export type Period = {
    period: Periods;
    text: string;
    start: Date;
    end: Date;
};
export type GrossNet = 'gross' | 'net';
