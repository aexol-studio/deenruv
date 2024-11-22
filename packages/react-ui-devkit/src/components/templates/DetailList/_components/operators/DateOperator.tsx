import { endOfDay, startOfDay } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import {
    Button,
    Calendar,
    Checkbox,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components';
import React from 'react';

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
    return (
        <div className="flex flex-col gap-2">
            <Label>{t('types.filter')}</Label>
            <Select
                value={type}
                onValueChange={e => {
                    if (e === 'between') {
                        setType(e);
                        setValue({ from: new Date() });
                    } else {
                        setType(e as keyof DateOperator);
                        setValue(new Date());
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t('placeholders.operatorInput')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {TYPES.map((i, index) => (
                            <SelectItem key={index} value={i}>
                                {t(`operators.${i}`)}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Label htmlFor="string-input">{t('placeholders.operatorInput')}</Label>
            {type === 'isNull' && typeof value === 'boolean' ? (
                <>
                    <Checkbox checked={!!value} onCheckedChange={e => setValue(!!e)}>
                        {t('operators.isNull')}
                    </Checkbox>
                    <Button
                        disabled={!type || value === undefined}
                        onClick={() => {
                            if (!type) return;
                            onSubmit({ [type]: value });
                        }}
                        variant="outline"
                        className="w-fit self-end"
                    >
                        {t('buttons.apply')}
                    </Button>
                </>
            ) : (
                <>
                    {type === 'between' ? (
                        <Calendar
                            disabled={!type}
                            mode="range"
                            numberOfMonths={2}
                            showOutsideDays={false}
                            selected={value as DateRange | undefined}
                            onSelect={setValue}
                            className="rounded-md border bg-white dark:bg-black"
                        />
                    ) : (
                        <Calendar
                            disabled={!type}
                            mode="single"
                            showOutsideDays={false}
                            selected={value as Date | undefined}
                            onSelect={setValue}
                            className="rounded-md border bg-white dark:bg-black"
                        />
                    )}
                    <Button
                        disabled={
                            !type ||
                            (type === 'between' && isDateRange(value) ? !value.to || !value.from : !value)
                        }
                        onClick={() => {
                            if (
                                type &&
                                value &&
                                type === 'between' &&
                                isDateRange(value) &&
                                value.to &&
                                value.from
                            ) {
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
                        }}
                        variant="outline"
                        className="w-fit self-end"
                    >
                        {t('buttons.apply')}
                    </Button>
                </>
            )}
        </div>
    );
};
