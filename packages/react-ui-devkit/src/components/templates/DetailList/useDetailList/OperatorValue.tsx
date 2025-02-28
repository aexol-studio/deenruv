import { BooleanOperator as BooleanOperatorInput } from '@/components/templates/DetailList/_components/operators/BooleanOperator.js';
import { DateOperator as DateOperatorInput } from '@/components/templates/DetailList/_components/operators/DateOperator.js';
import { IDOperator as IDOperatorInput } from '@/components/templates/DetailList/_components/operators/IDOperator.js';
import { NumberOperator } from '@/components/templates/DetailList/_components/operators/NumberOperator.js';
import { StringOperator as StringOperatorInput } from '@/components/templates/DetailList/_components/operators/StringOperator.js';
import { FilterInputType } from '@/components/templates/DetailList/_components/types.js';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type IDOperator = Omit<FilterInputType['IDOperators'], '__typename'>;
export type StringOperator = Omit<FilterInputType['StringOperators'], '__typename'>;
export type NumberOperator = Omit<FilterInputType['NumberOperators'], '__typename'>;
export type DateOperator = Omit<FilterInputType['DateOperators'], '__typename'>;
export type BooleanOperator = Omit<FilterInputType['BooleanOperators'], '__typename'>;

export type Operator = StringOperator | IDOperator | NumberOperator | DateOperator | BooleanOperator;

interface OperatorValueProps<T extends Operator> {
    currentValue?: T;
    onChange: (value: T) => void;
    filterType: string | undefined;
}

export const OperatorValue: React.FC<OperatorValueProps<Operator>> = ({
    filterType,
    currentValue,
    onChange,
}) => {
    const { t } = useTranslation('table');

    const operatorValueInput = useMemo(() => {
        switch (filterType) {
            case 'DateOperators':
                return (
                    <DateOperatorInput
                        currentValue={currentValue as DateOperator}
                        onSubmit={e => {
                            onChange(e);
                        }}
                    />
                );
            case 'BooleanOperators':
                return (
                    <BooleanOperatorInput
                        currentValue={currentValue as BooleanOperator}
                        onSubmit={e => {
                            onChange(e);
                        }}
                    />
                );
            case 'NumberOperators':
                return (
                    <NumberOperator
                        currentValue={currentValue as NumberOperator}
                        onSubmit={e => {
                            onChange(e);
                        }}
                    />
                );
            case 'IDOperators':
                return (
                    <IDOperatorInput
                        currentValue={currentValue as IDOperator}
                        onSubmit={e => {
                            onChange(e);
                        }}
                    />
                );
            case 'StringOperators':
            default:
                return (
                    <StringOperatorInput
                        currentValue={currentValue as StringOperator}
                        onSubmit={e => {
                            onChange(e);
                        }}
                    />
                );
        }
    }, [filterType, t]);

    return operatorValueInput;
};
