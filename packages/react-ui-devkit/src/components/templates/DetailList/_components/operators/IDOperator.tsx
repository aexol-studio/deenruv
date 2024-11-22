import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import { ArrayInput } from './ArrayInput';
import {
    Button,
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

type IDOperator = Omit<FilterInputType['IDOperators'], '__typename'>;
const ARRAY_TYPES = ['in', 'notIn'] as (keyof IDOperator)[];
const TYPES = ['eq', 'notEq', 'in', 'notIn', 'isNull'] as (keyof IDOperator)[];

type Props<T extends IDOperator> = {
    currentValue?: T;
    onSubmit: (value: T) => void;
};

export const IDOperator: React.FC<Props<IDOperator>> = ({ currentValue, onSubmit }) => {
    const { t } = useTranslation('table');
    const defaultType = currentValue ? (Object.keys(currentValue || {})[0] as keyof IDOperator) : 'eq';
    const [type, setType] = useState(defaultType);
    const [value, setValue] = useState<string | string[] | undefined>(() => {
        if (!currentValue || !Object.keys(currentValue || {}).length) return undefined;
        if (ARRAY_TYPES.includes(defaultType)) return (currentValue[defaultType] as string[]).join(',');
        else return currentValue[defaultType] as string;
    });

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="string-input">{t('placeholders.operatorInput')}</Label>
            <Select value={type as string} onValueChange={e => setType(e as keyof IDOperator)}>
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
            <div className="flex flex-col gap-2">
                {!ARRAY_TYPES.includes(type) ? (
                    <Input id="string-input" value={value} onChange={e => setValue(e.currentTarget.value)} />
                ) : (
                    <ArrayInput
                        type="number"
                        value={Array.isArray(value) && value.length ? value : []}
                        onChange={e => {
                            if (Array.isArray(e)) setValue(e);
                            else setValue([e.target.value]);
                        }}
                    />
                )}
                <Button
                    onClick={() => onSubmit({ [type]: value })}
                    variant="outline"
                    className="w-fit self-end"
                >
                    {t('buttons.apply')}
                </Button>
            </div>
        </div>
    );
};
