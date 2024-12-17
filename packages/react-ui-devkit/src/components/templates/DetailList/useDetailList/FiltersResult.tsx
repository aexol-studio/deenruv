import { RenderOperators } from '../_components/operators';
import { useMemo, useState } from 'react';
import { ListType, ListTypeKeys } from './types';
import { ModelTypes } from '@deenruv/admin-types';
import { FilterInputType, FilterInputTypeUnion } from '../_components/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

type FilterKey<T extends keyof ListType> = keyof ModelTypes[(typeof ListTypeKeys)[T]];

export const FiltersResult = <T extends keyof ListType>({
    filterLabels,
    type,
    filter,
    setFilterField,
    removeFilterField,
}: {
    filterLabels: { name: string | number | symbol; type: string }[];
    type: T;
    filter: ModelTypes[(typeof ListTypeKeys)[T]] | undefined;
    setFilterField: (
        field: keyof ModelTypes[(typeof ListTypeKeys)[T]],
        value: FilterInputTypeUnion | undefined,
    ) => void;
    removeFilterField: (field: keyof ModelTypes[(typeof ListTypeKeys)[T]]) => void;
}) => {
    const [currentFilter, setCurrentFilter] = useState<FilterKey<T> | undefined>(undefined);
    const { t } = useTranslation('table');
    const labels = t('filterLabels', { returnObjects: true });

    const activatedFilters = useMemo(() => {
        if (!filter) return [];

        return filterLabels
            .map(({ name, type }) => {
                let label = '';
                if (typeof name === 'string') {
                    label = labels[name as keyof typeof labels];
                }
                if (label === '' || label === undefined) {
                    label = String(name);
                }
                return {
                    name: name as keyof ModelTypes[(typeof ListTypeKeys)[T]],
                    type: type as keyof FilterInputType,
                    label,
                    value:
                        filter && Object.keys(filter).includes(name.toString())
                            ? (filter[
                                  name as keyof ModelTypes[(typeof ListTypeKeys)[T]]
                              ] as FilterInputTypeUnion)
                            : undefined,
                };
            })
            .filter(i => Object.keys(filter || {}).includes(i.name as string));
    }, [filter, type]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 place-self-start">
            <RenderOperators
                filters={activatedFilters}
                setFilterField={setFilterField}
                removeFilterField={removeFilterField}
                filter={filter}
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
            />
        </div>
    );
};
