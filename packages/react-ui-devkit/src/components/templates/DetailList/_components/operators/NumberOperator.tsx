import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import {
    Button,
    Checkbox,
    Input,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components';
import React from 'react';

type NumberOperator = Omit<FilterInputType['NumberOperators'], '__typename'>;
const TYPES = ['eq', 'lt', 'lte', 'gt', 'gte', 'between', 'isNull'] as (keyof NumberOperator)[];

type NumberRange = { start: number; end: number };

function isNumberRange(data: undefined | number | NumberRange | boolean): data is NumberRange {
    return !!data && typeof data === 'object' && 'start' in data;
}

type Props<T extends NumberOperator> = {
    currentValue?: T;
    onSubmit: (value: T) => void;
    isCurrency?: boolean;
};

export const NumberOperator: React.FC<Props<NumberOperator>> = ({
    onSubmit,
    currentValue,
    isCurrency = false,
}) => {
    const { t } = useTranslation('table');
    const defaultType = currentValue ? (Object.keys(currentValue)[0] as keyof NumberOperator) : 'eq';
    const [type, setType] = useState(defaultType);
    const [value, setValue] = useState<number | NumberRange | boolean | undefined>(() => {
        if (!currentValue) return undefined;
        const curr = Object.values(currentValue)[0] ?? undefined;
        return isNumberRange(curr)
            ? isCurrency
                ? { start: curr.start / 100, end: curr.end / 100 }
                : curr
            : typeof curr === 'number'
              ? isCurrency
                  ? curr / 100
                  : curr
              : undefined;
    });

    return (
        <div className="flex flex-col gap-2">
            <Label>{t('types.filter')}</Label>
            <Select
                value={type}
                onValueChange={e => {
                    if (e === 'between') {
                        setType(e);
                        setValue({ start: 0, end: 0 });
                    } else {
                        setType(e as keyof NumberOperator);
                        setValue(0);
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t('types.select')} />
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
            {type === 'isNull' ? (
                <>
                    <Checkbox checked={!!value} onCheckedChange={e => setValue(!!e)}>
                        {t('operators.isNull')}
                    </Checkbox>
                </>
            ) : (
                <>
                    {type === 'between' ? (
                        <>
                            <Label>{t('from')}</Label>
                            <Input
                                disabled={!type}
                                type="number"
                                value={isNumberRange(value) ? value.start : 0}
                                onChange={e =>
                                    setValue(p => ({
                                        end: isNumberRange(p) ? p.end : 0,
                                        start: parseFloat(e.currentTarget.value),
                                    }))
                                }
                            />
                            <Label>{t('to')}</Label>
                            <Input
                                disabled={!type}
                                type="number"
                                value={isNumberRange(value) ? value.end : 0}
                                onChange={e =>
                                    setValue(p => ({
                                        start: isNumberRange(p) ? p.start : 0,
                                        end: parseFloat(e.currentTarget.value),
                                    }))
                                }
                            />
                        </>
                    ) : (
                        <>
                            <Label>{t('value')}</Label>
                            <Input
                                disabled={!type}
                                type="number"
                                value={typeof value === 'number' ? value : 0}
                                onChange={e => setValue(parseFloat(e.currentTarget.value))}
                            />
                        </>
                    )}
                </>
            )}
            <Button
                disabled={!type || value === undefined}
                onClick={() => {
                    if (type && value !== undefined) {
                        if (isNumberRange(value)) {
                            onSubmit({
                                between: isCurrency
                                    ? {
                                          start: Math.round(value.start * 100),
                                          end: Math.round(value.end * 100),
                                      }
                                    : value,
                            });
                        } else {
                            onSubmit({ [type]: isCurrency ? Math.round((value as number) * 100) : value });
                        }
                    }
                }}
                variant="outline"
                className="w-fit self-end"
            >
                {t('buttons.apply')}
            </Button>
        </div>
    );
};
