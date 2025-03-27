import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { CircleX } from 'lucide-react';

import { BooleanOperator } from './BooleanOperator';
import { DateOperator } from './DateOperator';
import { IDOperator } from './IDOperator';
import { NumberOperator } from './NumberOperator';
import { StringOperator } from './StringOperator';
import { FilterInputType, FilterInputTypeUnion } from '../types';
import { ModelTypes } from '@deenruv/admin-types';
import React from 'react';
import { cn } from '@/lib';
import { ListType, ListTypeKeys } from '../../useDetailListHook/types';

type FilterKey<T extends keyof ListType> = keyof ModelTypes[(typeof ListTypeKeys)[T]];

export function RenderOperators<T extends keyof ListType, F extends ModelTypes[(typeof ListTypeKeys)[T]]>({
    filter,
    currentFilter,
    setCurrentFilter,
    setFilterField,
    removeFilterField,
    filters,
}: {
    filter?: F;
    currentFilter: FilterKey<T> | undefined;
    setCurrentFilter: (value: FilterKey<T> | undefined) => void;
    removeFilterField: (field: FilterKey<T>) => void;
    filters: {
        name: FilterKey<T>;
        type: keyof FilterInputType;
        value?: FilterInputTypeUnion;
        label: string;
    }[];
    setFilterField: (field: FilterKey<T>, value: FilterInputTypeUnion) => void;
}) {
    return filters.map(({ name, type, label, value: _value }, i) => {
        let validValue = undefined;
        try {
            const value = JSON.parse(JSON.stringify(_value));
            const key = Object.keys(value)[0];
            validValue = value[key];
        } catch {
            try {
                validValue = JSON.stringify(_value);
            } catch {
                validValue = undefined;
            }
        }

        return (
            <Popover
                open={currentFilter === name}
                onOpenChange={e => setCurrentFilter(e ? name : undefined)}
                key={i}
            >
                <PopoverTrigger asChild className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentFilter(name)}
                        className={cn('h-8 border-dashed', !validValue && 'border-red-600')}
                    >
                        {typeof label === 'string' ? label : ''}
                        {validValue && (
                            <span className="text-primary-600 text-xs font-normal">{validValue}</span>
                        )}
                        <CircleX
                            size={14}
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeFilterField(name);
                            }}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="bg-secondary flex w-auto min-w-60 flex-col gap-2">
                    <RenderOperator
                        filter={{ __typename: type as keyof FilterInputType, ...(filter && filter[name]) }}
                        name={name as string}
                        onSubmit={value => {
                            setFilterField(name, value);
                            setCurrentFilter(undefined);
                        }}
                    />
                </PopoverContent>
            </Popover>
        );
    });
}

function RenderOperator<T extends keyof FilterInputType>({
    filter: _filter,
    name,
    onSubmit,
}: {
    name: string;
    filter: FilterInputType[T];
    onSubmit: (value: FilterInputTypeUnion) => void;
}) {
    if (!_filter) return null;
    const { __typename, ...currentValue } = _filter;
    if (!__typename) return null;
    const props = { currentValue, onSubmit };
    const components = {
        StringOperators: StringOperator,
        IDOperators: IDOperator,
        NumberOperators: NumberOperator,
        DateOperators: DateOperator,
        BooleanOperators: BooleanOperator,
    };
    const Component = components[__typename] ? components[__typename] : null;
    return Component ? <Component {...props} /> : null;
}
