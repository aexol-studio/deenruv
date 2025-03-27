import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import { Checkbox, Input } from '@/components';
import React from 'react';
import { OperatorSelect } from '@/components/templates/DetailList/useDetailListHook/OperatorSelect.js';

type NumberOperator = Omit<FilterInputType['NumberOperators'], '__typename'>;
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
        <div className="flex gap-2">
            <OperatorSelect
                type="NumberOperators"
                currentValue={type as keyof NumberOperator}
                onChange={e => {
                    if (e === 'between') {
                        setType(e);
                        setValue({ start: 0, end: 0 });
                    } else {
                        setType(e as keyof NumberOperator);
                        setValue(0);
                    }
                    onSubmit({ [e as keyof NumberOperator]: value });
                }}
            />
            {type === 'isNull' ? (
                <>
                    <Checkbox
                        checked={!!value}
                        onCheckedChange={e => {
                            setValue(!!e);
                            onSubmit({ [type]: !!e });
                        }}
                    >
                        {t('operators.isNull')}
                    </Checkbox>
                </>
            ) : (
                <>
                    {type === 'between' ? (
                        <>
                            <Input
                                disabled={!type}
                                className="h-8 w-full rounded"
                                type="number"
                                placeholder={t('from')}
                                value={isNumberRange(value) ? value.start : 0}
                                onChange={e => {
                                    setValue(p => ({
                                        end: isNumberRange(p) ? p.end : 0,
                                        start: parseFloat(e.currentTarget.value),
                                    }));
                                    onSubmit({
                                        [type]: {
                                            end: isNumberRange(value) ? value.end : 0,
                                            start: parseFloat(e.currentTarget.value),
                                        },
                                    });
                                }}
                            />
                            <Input
                                disabled={!type}
                                className="h-8 w-full rounded"
                                placeholder={t('to')}
                                type="number"
                                value={isNumberRange(value) ? value.end : 0}
                                onChange={e => {
                                    setValue(p => ({
                                        start: isNumberRange(p) ? p.start : 0,
                                        end: parseFloat(e.currentTarget.value),
                                    }));
                                    onSubmit({
                                        [type]: {
                                            start: isNumberRange(value) ? value.start : 0,
                                            end: parseFloat(e.currentTarget.value),
                                        },
                                    });
                                }}
                            />
                        </>
                    ) : (
                        <Input
                            disabled={!type}
                            type="number"
                            className="h-8 w-full rounded"
                            value={typeof value === 'number' ? value : 0}
                            onChange={e => {
                                setValue(parseFloat(e.currentTarget.value));
                                onSubmit({ [type]: parseFloat(e.currentTarget.value) });
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};
