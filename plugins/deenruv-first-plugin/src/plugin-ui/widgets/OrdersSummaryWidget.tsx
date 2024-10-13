import { Badge, Card, CardTitle } from '@deenruv/react-ui-devkit';
import { client, scalars } from '../client';
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
                text: 'today',
                start: startOfToday(),
                end: endOfToday(),
            },
            {
                period: Periods.Yesterday,
                text: 'yesterday',
                start: startOfYesterday(),
                end: endOfYesterday(),
            },
            {
                period: Periods.ThisWeek,
                text: 'thisWeek',
                start: startOfWeek(new Date(), { weekStartsOn: 1 }),
                end: endOfWeek(new Date(), { weekStartsOn: 1 }),
            },
            {
                period: Periods.ThisMonth,
                text: 'thisMonth',
                start: startOfMonth(new Date()),
                end: endOfMonth(new Date()),
            },
            {
                period: Periods.ThisYear,
                text: 'thisYear',
                start: startOfYear(new Date()),
                end: endOfYear(new Date()),
            },
        ],
        [],
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
            text: 'gross',
        },
        {
            type: 'net',
            text: 'net',
        },
    ];

    const getOrders = async (range: { start: Date; end: Date }) => {
        const response = await client('query', { scalars })({
            orders: [
                { options: { filter: { orderPlacedAt: { between: range } } } },
                { items: { totalWithTax: true, total: true, currencyCode: true }, totalItems: true },
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
                    <CardTitle className="text-lg">{'ordersSummary'}</CardTitle>
                    <Select
                        onValueChange={value => handlePeriodChange(value as Periods)}
                        value={selectedPeriod}
                        defaultValue={_periods[0].period}
                    >
                        <SelectTrigger className="h-[30px] w-[180px] text-[13px]">
                            <SelectValue placeholder={'selectDataType'} />
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
                        <div className="mt-1">{'totalOrdersCount'}</div>
                        <h3 className="text-3xl">{orders?.totalCount}</h3>
                    </div>
                    <div className="items-center gap-4 lg:gap-6">
                        <div className="mt-1">{'totalOrdersValue'}</div>
                        <h3 className="text-3xl">
                            {/* {priceFormatter(
                                grossOrNet === 'gross' ? orders?.totalWithTax || 0 : orders?.total || 0,
                                orders?.currencyCode || CurrencyCode.PLN,
                            )} */}
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
