import { FilterIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ListType, ListTypeKeys } from './types';
import { ModelTypes } from '@deenruv/admin-types';
import { FilterInputType, FilterInputTypeUnion } from '../_components/types';
import { useTranslation } from 'react-i18next';
import {
    Button,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components';
import React from 'react';

export const FiltersButton = <T extends keyof ListType>({
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
    const { t } = useTranslation('table');
    const labels = t('filterLabels', { returnObjects: true });

    const allFilterFields = useMemo(() => {
        return filterLabels.map(({ name, type }) => {
            let label = '';
            if (typeof name === 'string') {
                label = labels[name as keyof typeof labels];
            }
            if (label === '' || label === undefined) {
                label = String(name);
            }
            return {
                name: name as keyof ModelTypes[(typeof ListTypeKeys)[T]],
                label: label as keyof ModelTypes[(typeof ListTypeKeys)[T]],
                type: type as keyof FilterInputType,
                value:
                    filter && Object.keys(filter).includes(name.toString())
                        ? filter[name as keyof ModelTypes[(typeof ListTypeKeys)[T]]]
                        : undefined,
            };
        });
    }, [filter, type]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <FilterIcon size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-[400px] overflow-y-auto">
                {allFilterFields.map((i, index) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={index}
                            checked={filter && filter[i.name] ? true : false}
                            onCheckedChange={value => {
                                if (value) setFilterField(i.name, {});
                                else removeFilterField(i.name);
                            }}
                        >
                            {i.label as string}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
