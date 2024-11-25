import { RenderOperators } from '../_components/operators';
import { useMemo, useState } from 'react';
import { ListType, ListTypeKeys } from './types';
import { ModelTypes } from '@deenruv/admin-types';
import { FilterInputType } from '../_components/types';
import React from 'react';

type FilterKey<T extends keyof ListType> = keyof ModelTypes[(typeof ListTypeKeys)[T]];

export const FiltersResult = <T extends keyof ListType, K extends (string | number | symbol)[]>({
    columnsLabels,
    type,
    filter,
    setFilterField,
    removeFilterField,
}: {
    columnsLabels: string[];
    type: T;
    filter: ModelTypes[(typeof ListTypeKeys)[T]] | undefined;
    setFilterField: any;
    removeFilterField: any;
}) => {
    const [currentFilter, setCurrentFilter] = useState<FilterKey<T> | undefined>(undefined);

    const activatedFilters = useMemo(() => {
        if (!filter) return [];
        return [
            {
                name: 'id',
                type: 'IDOperators',
                value: filter && filter['id'],
            },
            {
                name: 'createdAt',
                type: 'DateOperators',
                value: filter && filter['createdAt'],
            },
            {
                name: 'updatedAt',
                type: 'DateOperators',
                value: filter && filter['updatedAt'],
            },
            {
                name: 'name',
                type: 'StringOperators',
                value: filter && 'name' in filter ? filter['name'] : undefined,
            },
            {
                name: 'enabled',
                type: 'BooleanOperators',
                value: filter && 'enabled' in filter ? filter['enabled'] : undefined,
            },
        ].filter(i => Object.keys(filter || {}).includes(i.name)) as {
            name: keyof ModelTypes[(typeof ListTypeKeys)[T]];
            type: keyof FilterInputType;
            value: ModelTypes[(typeof ListTypeKeys)[T]];
        }[];
    }, [filter, type]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 place-self-start">
            <RenderOperators
                filters={activatedFilters}
                setFilterField={(field, value) => {
                    console.log(field, value);
                    setFilterField(field, value as any);
                }}
                removeFilterField={removeFilterField}
                filter={filter}
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
            />
        </div>
    );
};
