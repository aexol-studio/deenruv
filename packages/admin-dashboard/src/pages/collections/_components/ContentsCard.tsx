import {
  CustomCard,
  CardIcons,
  DetailList,
  Routes,
  apiClient,
  PaginationInput,
  deepMerge,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React, { useCallback } from 'react';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { CollectionProductVariantsSelector } from '@/graphql/collections.js';

interface ContentsCardProps {
  collectionId: string | undefined;
}

export const ContentsCard: React.FC<ContentsCardProps> = ({ collectionId }) => {
  const { t } = useTranslation('collections');

  const fetch = useCallback(
    async <T, K>(
      { page, perPage, filter, filterOperator, sort }: PaginationInput,
      customFieldsSelector?: T,
      additionalSelector?: K,
    ) => {
      const selector = deepMerge(CollectionProductVariantsSelector, additionalSelector ?? {});

      const response = await apiClient('query')({
        collection: [
          { id: collectionId },
          {
            productVariants: [
              {
                options: {
                  take: perPage,
                  skip: (page - 1) * perPage,
                  filterOperator: filterOperator,
                  sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
                  ...(filter && { filter }),
                },
              },
              { totalItems: true, items: selector },
            ],
          },
        ],
      });
      return (
        response['collection']?.productVariants ?? {
          items: [],
          totalItems: 0,
        }
      );
    },
    [collectionId],
  );

  return (
    <CustomCard title={t('details.contents.title')} color="green" icon={<CardIcons.group />}>
      <DetailList
        noPaddings
        detailLinkColumn="id"
        filterFields={[{ key: 'id', operator: 'IDOperators' }]}
        searchFields={['code', 'name']}
        hideColumns={['customFields', 'product', 'updatedAt', 'createdAt']}
        entityName={'Product'}
        route={Routes['products']}
        tableId="products-list-view"
        fetch={fetch}
        noCreateButton
        createPermissions={[Permission.CreateProduct]}
        deletePermissions={[Permission.DeleteProduct]}
        additionalColumns={[
          {
            accessorKey: 'product',
            enableSorting: false,
            enableColumnFilter: false,
            header: () => t('table.product'),
            cell: ({ row }) => <div className="flex gap-1">{row.original.product.name}</div>,
          },
        ]}
      />
    </CustomCard>
  );
};
