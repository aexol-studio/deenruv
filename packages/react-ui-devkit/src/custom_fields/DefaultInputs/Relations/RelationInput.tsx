import { useEffect, useState } from 'react';
import { CustomFieldsModal } from '@/components';
import { useCustomFields } from '@/custom_fields';
import { useList } from '@/useList';
import React from 'react';
import { type ResolverInputTypes } from '@deenruv/admin-types';
import { apiClient } from '@/zeus_client';
import { CustomFieldSelectorsType, customFieldSelectors } from '@/selectors';
import { useDebounce } from '@/hooks';

type CF = CustomFieldSelectorsType;

type CommonFields = {
    [K in keyof CF]: CF[K];
}[keyof CF];

export const RelationInput = <K extends keyof CF>({ entityName }: { entityName: K }) => {
    const { value } = useCustomFields<'RelationCustomFieldConfig', CommonFields | undefined>();
    const [modalOpened, setModalOpened] = useState(false);
    const [searchString, setSearchString] = useState<string>('');
    const debouncedSearch = useDebounce(searchString, 500);

    useEffect(() => {
        setFilterField('name', { contains: searchString });
    }, [debouncedSearch]);

    const [selected, setSelected] = useState<typeof value>();

    const onOpenChange = (open: boolean) => {
        if (value) setSelected(value);
        setModalOpened(open);
    };

    const getEntities = async (options: ResolverInputTypes['AssetListOptions']) => {
        const responseEntityField = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 's';

        const { [responseEntityField]: response } = await apiClient('query')({
            [responseEntityField]: [
                { options },
                {
                    totalItems: true,
                    items: customFieldSelectors[entityName],
                },
            ],
            // eslint-disable-next-line
        } as any);
        return response as { items: CommonFields[]; totalItems: number };
    };

    const {
        objects: entities,
        Paginate,
        refetch,
        setFilterField,
    } = useList({
        route: async ({ page, perPage, filter }) => {
            const entities = await getEntities({
                skip: (page - 1) * perPage,
                take: perPage,
                ...(filter && { filter }),
            });
            return { items: entities.items, totalItems: entities.totalItems };
        },
        listType: `modal-assets-list`,
        options: {
            skip: !modalOpened,
        },
    });

    return (
        <CustomFieldsModal
            Paginate={Paginate}
            entities={entities}
            entityName={entityName}
            modalOpened={modalOpened}
            onOpenChange={onOpenChange}
            refetch={refetch}
            searchString={searchString}
            selected={selected}
            setModalOpened={setModalOpened}
            setSearchString={setSearchString}
            setSelected={setSelected}
        />
    );
};
