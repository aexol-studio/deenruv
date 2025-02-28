import { endOfDay, format, startOfDay } from 'date-fns';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import { Button, Calendar, Checkbox, Popover, PopoverContent, PopoverTrigger } from '@/components';
import React from 'react';
import { OperatorSelect } from '@/components/templates/DetailList/useDetailList/OperatorSelect.js';
import { cn } from '@/lib/utils.js';
import { CalendarIcon } from 'lucide-react';

type DateOperator = Omit<FilterInputType['DateOperators'], '__typename'>;
const TYPES = ['eq', 'before', 'after', 'between', 'isNull'] as (keyof DateOperator)[];
function isDateRange(data: undefined | Date | boolean | DateRange): data is DateRange {
    return !!data && typeof data === 'object' && 'from' in data;
}

type Props<T extends DateOperator> = {
    currentValue?: T;
    onSubmit: (value: T) => void;
};

export const DateOperator: React.FC<Props<DateOperator>> = ({ currentValue, onSubmit }) => {
    const { t } = useTranslation('table');
    const defaultType = currentValue ? (Object.keys(currentValue)[0] as keyof DateOperator) : 'eq';
    const [type, setType] = useState(defaultType);
    const [value, setValue] = useState<Date | DateRange | boolean | undefined>(() => {
        if (currentValue) {
            const curr = Object.values(currentValue)[0];
            if (curr && typeof curr === 'object' && 'start' in curr && 'end' in curr) {
                return { from: new Date(curr.start), to: new Date(curr.end) };
            } else if (typeof curr === 'boolean') {
                return !!curr;
            } else {
                return curr ? new Date(curr as string) : undefined;
            }
        } else {
            return undefined;
        }
    });

    const handleSubmit = useCallback(
        (value?: Date | DateRange) => {
            setTimeout(() => {
                if (type && value && type === 'between' && isDateRange(value) && value.to && value.from) {
                    onSubmit({
                        between: { start: startOfDay(value.from), end: endOfDay(value.to) },
                    });
                } else if (type && value && !isDateRange(value)) {
                    onSubmit(
                        type === 'before'
                            ? { before: endOfDay(value as Date) }
                            : { after: startOfDay(value as Date) },
                    );
                }
            });
        },
        [type, value, onSubmit],
    );

    return (
        <div className="flex gap-2">
            <OperatorSelect
                type="DateOperators"
                currentValue={type as keyof DateOperator}
                onChange={e => {
                    if (e === 'between') {
                        setType(e);
                        setValue({ from: new Date() });
                    } else {
                        setType(e as keyof DateOperator);
                        setValue(new Date());
                    }
                    onSubmit({ [e as keyof DateOperator]: value });
                }}
            />

            {type === 'isNull' && typeof value === 'boolean' ? (
                <Checkbox
                    checked={!!value}
                    onCheckedChange={e => {
                        setValue(!!e);
                        onSubmit({ [type]: !!e });
                    }}
                >
                    {t('operators.isNull')}
                </Checkbox>
            ) : (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            disabled={!type}
                            variant={'outline'}
                            className={cn(
                                'w-[182px] pl-3 text-left font-normal h-8 rounded',
                                !value && 'text-muted-foreground',
                            )}
                        >
                            {!isDateRange(value) && value ? (
                                format(value as Date, 'PPP')
                            ) : value ? (
                                <span>Data range</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        {type === 'between' ? (
                            <Calendar
                                disabled={!type}
                                mode="range"
                                numberOfMonths={2}
                                showOutsideDays={false}
                                selected={value as DateRange | undefined}
                                onSelect={e => {
                                    setValue(e);
                                    handleSubmit(e);
                                }}
                                className="rounded-md border bg-white dark:bg-black"
                            />
                        ) : (
                            <Calendar
                                disabled={!type}
                                mode="single"
                                showOutsideDays={false}
                                selected={value as Date | undefined}
                                onSelect={e => {
                                    setValue(e);
                                    handleSubmit(e);
                                }}
                                className="rounded-md border bg-white dark:bg-black"
                            />
                        )}
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};
