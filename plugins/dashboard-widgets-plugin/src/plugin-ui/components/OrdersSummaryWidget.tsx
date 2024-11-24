import { priceFormatter, Card, CardTitle, useLazyQuery, SimpleSelect } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { CurrencyCode } from '../zeus';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

import { OrdersSummaryQuery } from '../graphql/queries';

enum Periods {
    Today = 'today',
    Yesterday = 'yesterday',
    ThisWeek = 'thisWeek',
    ThisMonth = 'thisMonth',
    ThisYear = 'thisYear',
}

type Period = {
    period: Periods;
    text: string;
    start: Date;
    end: Date;
};

type GrossNet = 'gross' | 'net';

export const OrdersSummaryWidget = () => {
    const [fetchOrders] = useLazyQuery(OrdersSummaryQuery);

    const { t } = useTranslation('dashboard-widgets-plugin');
    const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.Today);
    const [grossOrNet, setGrossOrNet] = useState<'gross' | 'net'>('gross');
    const [orders, setOrders] = useState<{
        totalCount: number;
        totalWithTax: number;
        total: number;
        currencyCode: CurrencyCode;
    }>();

    const getOrders = async (range: { start: Date; end: Date }) => {
        const response = await fetchOrders({
            options: { filter: { orderPlacedAt: { between: range } } },
        });

        setOrders({
            totalCount: response.orders.totalItems,
            totalWithTax: response.orders.items
                .map(i => i.totalWithTax)
                .reduce((accumulator, totalWithTax) => accumulator + totalWithTax, 0),
            total: response.orders.items
                .map(i => i.total)
                .reduce((accumulator, total) => accumulator + total, 0),
            currencyCode: response.orders.items[0]?.currencyCode || CurrencyCode.PLN,
        });
    };

    useEffect(() => {
        getOrders({ start: startOfToday(), end: endOfToday() });
    }, []);

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
            setSelectedPeriod(period);
            const periodData = _periods.find(p => p.period === period);

            if (periodData)
                getOrders({
                    start: periodData.start,
                    end: periodData.end,
                });
        },
        [_periods],
    );

    const _grossNet: { type: 'gross' | 'net'; text: string }[] = [
        {
            type: 'gross',
            text: t('gross'),
        },
        {
            type: 'net',
            text: t('net'),
        },
    ];

    return (
        <Card className="relative border-0 shadow-none p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-8 items-center">
                    <CardTitle className="text-lg">{t('ordersSummary')}</CardTitle>
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
                </div>
                <div className="flex items-center gap-6 lg:gap-8">
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="mt-1 whitespace-nowrap">{t('totalOrdersCount')}</div>
                        <h3 className="text-2xl">{orders?.totalCount || 0}</h3>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                        <div className="mt-1 whitespace-nowrap">{t('totalOrdersValue')}</div>
                        <h3 className="text-2xl">
                            {priceFormatter(
                                grossOrNet === 'gross' ? orders?.totalWithTax || 0 : orders?.total || 0,
                                orders?.currencyCode || CurrencyCode.PLN,
                            )}
                        </h3>
                        <SimpleSelect
                            size="sm"
                            options={_grossNet.map(e => ({ label: e.text, value: e.type }))}
                            value={grossOrNet}
                            onValueChange={e => setGrossOrNet(e as GrossNet)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
