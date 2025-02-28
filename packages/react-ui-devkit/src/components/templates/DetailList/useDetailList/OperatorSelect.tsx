import { Option } from '@/components/atoms/multiple-selector.js';
import { SimpleSelect } from '@/components/molecules/SimpleSelect.js';
import { FilterInputType } from '@/components/templates/DetailList/_components/types.js';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type IDOperator = Omit<FilterInputType['IDOperators'], '__typename'>;
type StringOperator = Omit<FilterInputType['StringOperators'], '__typename'>;
type NumberOperator = Omit<FilterInputType['NumberOperators'], '__typename'>;
type DateOperator = Omit<FilterInputType['DateOperators'], '__typename'>;
type BooleanOperator = Omit<FilterInputType['BooleanOperators'], '__typename'>;

const ID_TYPES = ['eq', 'notEq', 'in', 'notIn', 'isNull'] as (keyof IDOperator)[];
const STRING_TYPES = [
    'eq',
    'notEq',
    'in',
    'notIn',
    'contains',
    'notContains',
    'regex',
    'isNull',
] as (keyof StringOperator)[];
const NUMBER_TYPES = ['eq', 'lt', 'lte', 'gt', 'gte', 'between', 'isNull'] as (keyof NumberOperator)[];
const DATE_TYPES = ['eq', 'before', 'after', 'between', 'isNull'] as (keyof DateOperator)[];
const BOOLEAN_TYPES = ['eq', 'isNull'] as (keyof BooleanOperator)[];

export type Operator = StringOperator | IDOperator | NumberOperator | DateOperator | BooleanOperator;

interface OperatorSelectProps {
    type:
        | 'IDOperators'
        | 'DateOperators'
        | 'StringOperators'
        | 'NumberOperators'
        | 'BooleanOperators'
        | undefined;
    currentValue:
        | keyof StringOperator
        | keyof IDOperator
        | keyof NumberOperator
        | keyof DateOperator
        | keyof BooleanOperator;
    onChange: (value: string) => void;
}

export const OperatorSelect: React.FC<OperatorSelectProps> = ({ type, currentValue, onChange }) => {
    const { t } = useTranslation('table');

    const options: Option[] = useMemo(() => {
        switch (type) {
            case 'IDOperators':
                return ID_TYPES.map(type => ({
                    value: type,
                    label: t(`operators.${type}`),
                }));
            case 'DateOperators':
                return DATE_TYPES.map(type => ({
                    value: type,
                    label: t(`operators.${type}`),
                }));
            case 'StringOperators':
                return STRING_TYPES.map(type => ({
                    value: type,
                    label: t(`operators.${type}`),
                }));
            case 'NumberOperators':
                return NUMBER_TYPES.map(type => ({
                    value: type,
                    label: t(`operators.${type}`),
                }));
            case 'BooleanOperators':
                return BOOLEAN_TYPES.map(type => ({
                    value: type,
                    label: t(`operators.${type}`),
                }));
            default:
                return [];
        }
    }, [type, t]);

    return (
        <SimpleSelect
            value={currentValue as string}
            onValueChange={onChange}
            options={options}
            placeholder="Pick operator"
            wrapperClassName="w-36 max-w-36"
            className="h-8 rounded lowercase"
        />
    );
};
