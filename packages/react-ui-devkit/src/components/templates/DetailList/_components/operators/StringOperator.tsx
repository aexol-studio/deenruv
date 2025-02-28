import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import { ArrayInput } from './ArrayInput';
import { Checkbox, Input } from '@/components';
import React from 'react';
import { OperatorSelect } from '@/components/templates/DetailList/useDetailList/OperatorSelect.js';

type StringOperator = Omit<FilterInputType['StringOperators'], '__typename'>;
const ARRAY_TYPES = ['in', 'notIn'] as (keyof StringOperator)[];

type Props<T extends StringOperator> = {
    currentValue?: T;
    onSubmit: (value: T) => void;
};

export const StringOperator: React.FC<Props<StringOperator>> = ({ currentValue, onSubmit }) => {
    const { t } = useTranslation('table');
    const defaultType = currentValue ? (Object.keys(currentValue)[0] as keyof StringOperator) : 'eq';
    const [type, setType] = useState(defaultType);
    const [value, setValue] = useState<string | string[] | boolean | undefined>(() => {
        if (
            !currentValue ||
            (currentValue &&
                Object.keys(currentValue).length &&
                !Object.keys(Object.values(currentValue)[0] || {}).length)
        )
            return undefined;
        if (ARRAY_TYPES.includes(type)) return (Object.values(currentValue)[0] as string[]).join(',');
        else return currentValue[defaultType] as string;
    });
    useEffect(() => {
        if (!currentValue || !type) return;
        setValue(currentValue[type as keyof StringOperator] as string);
    }, [currentValue, type]);

    return (
        <div className="flex gap-2">
            <OperatorSelect
                type="StringOperators"
                currentValue={type as keyof StringOperator}
                onChange={e => {
                    setType(e as keyof StringOperator);
                    onSubmit({ [e as keyof StringOperator]: value });
                }}
            />
            <div className="flex gap-2">
                {type === 'isNull' ? (
                    <Checkbox
                        checked={!!value}
                        onCheckedChange={e => {
                            setValue(!!e);
                            onSubmit({ [type as keyof StringOperator]: e });
                        }}
                    >
                        {t('operators.isNull')}
                    </Checkbox>
                ) : ARRAY_TYPES.includes(type) ? (
                    <ArrayInput
                        type="string"
                        className="h-8 w-full rounded"
                        value={Array.isArray(value) && value.length ? value : []}
                        onChange={e => {
                            if (Array.isArray(e)) {
                                setValue(e);
                                onSubmit({ [type as keyof StringOperator]: e });
                            } else {
                                setValue([e.target.value]);
                                onSubmit({ [type as keyof StringOperator]: e.target.value });
                            }
                        }}
                    />
                ) : (
                    <Input
                        id="string-input"
                        className="h-8 w-full rounded"
                        disabled={!type}
                        value={value as string}
                        onChange={e => {
                            setValue(e.currentTarget.value);
                            onSubmit({ [type as keyof StringOperator]: e.target.value });
                        }}
                    />
                )}
            </div>
        </div>
    );
};
