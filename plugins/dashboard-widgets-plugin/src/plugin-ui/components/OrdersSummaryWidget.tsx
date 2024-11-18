import { priceFormatter, Badge, Card, CardTitle, useQuery } from '@deenruv/react-ui-devkit';
import { createClient, scalars } from '../graphql/client';
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
import { CurrencyCode, LanguageCode } from '../zeus';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { SummaryOrdersSelector } from '../graphql/selectors';
import { translationNS } from '../translation-ns';
import { A, TEST } from '../graphql/queries';

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

export const OrdersSummaryWidget = () => {
    const { data } = useQuery(A, { id: '1' });
    const { t } = useTranslation(translationNS);
    const [selectedPeriod, setSelectedPeriod] = useState<Periods>(Periods.Today);
    const [grossOrNet, setGrossOrNet] = useState<'gross' | 'net'>('gross');
    const [orders, setOrders] = useState<{
        totalCount: number;
        totalWithTax: number;
        total: number;
        currencyCode: CurrencyCode;
    }>();

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

    const getOrders = async (range: { start: Date; end: Date }) => {
        const response = await createClient(LanguageCode.en)('query', { scalars })({
            orders: [
                { options: { filter: { orderPlacedAt: { between: range } } } },
                { items: SummaryOrdersSelector, totalItems: true },
            ],
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

    return (
        <Card className="relative p-6">
            <div className="items-center justify-between">
                <div className="gap-12">
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
                <div className="items-center gap-6 lg:gap-12">
                    <div className="items-center gap-2 lg:gap-4">
                        <div className="mt-1">{t('totalOrdersCount')}</div>
                        <h3 className="text-3xl">{orders?.totalCount}</h3>
                    </div>
                    <div className="items-center gap-4 lg:gap-6">
                        <div className="mt-1">{t('totalOrdersValue')}</div>
                        <h3 className="text-3xl">
                            {priceFormatter(
                                grossOrNet === 'gross' ? orders?.totalWithTax || 0 : orders?.total || 0,
                                orders?.currencyCode || CurrencyCode.PLN,
                            )}
                        </h3>
                        <div className="mt-2 gap-2">
                            {_grossNet.map(e => (
                                <Badge
                                    key={e.type}
                                    className="cursor-pointer"
                                    onClick={() => setGrossOrNet(e.type)}
                                    variant={grossOrNet === e.type ? 'default' : 'outline'}
                                >
                                    {e.text}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
