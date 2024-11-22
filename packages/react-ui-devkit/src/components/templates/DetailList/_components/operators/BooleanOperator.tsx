import {
    Button,
    Label,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
} from '@/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import React from 'react';

type BooleanOperator = Omit<FilterInputType['BooleanOperators'], '__typename'>;
const TYPES = ['eq', 'isNull'] as (keyof BooleanOperator)[];
type Props<T extends BooleanOperator> = {
    currentValue?: T;
    onSubmit: (value: T) => void;
};

export const BooleanOperator: React.FC<Props<BooleanOperator>> = ({ onSubmit, currentValue }) => {
    const { t } = useTranslation('table');
    const defaultType = currentValue ? (Object.keys(currentValue)[0] as keyof BooleanOperator) : 'eq';
    const [currentType, setCurrentType] = useState(defaultType);
    const [value, setValue] = useState<boolean>(() => {
        if (!currentValue) return false;
        return currentValue[defaultType] as boolean;
    });

    return (
        <div className="flex flex-col gap-2">
            <Label>{t('types.filter')}</Label>
            <div className="flex items-center gap-4">
                <Select
                    value={currentType as string}
                    onValueChange={e => setCurrentType(e as keyof BooleanOperator)}
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
                <Switch checked={value} onCheckedChange={setValue} />
                {t(value ? 'true' : 'false')}
            </div>
            <Button
                onClick={() => onSubmit({ [currentType]: value })}
                variant="outline"
                className="w-fit self-end"
            >
                {t('buttons.apply')}
            </Button>
        </div>
    );
};
