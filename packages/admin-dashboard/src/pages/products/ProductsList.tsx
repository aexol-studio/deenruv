import { SortOrder } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  deepMerge,
  DetailList,
  PaginationInput,
  ProductListSelector,
  Routes,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(ProductListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
    ['products']: [
      {
        options: {
          take: perPage,
          skip: (page - 1) * perPage,
          filterOperator: filterOperator,
          sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
          ...(filter && { filter }),
        },
      },
      { items: selector, totalItems: true },
    ],
  });
  return response['products'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProducts } = await apiClient('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const ProductsList = () => {
  const { t } = useTranslation('products');

  return (
    <DetailList
      filterFields={[{ key: 'languageCode', operator: 'StringOperators' }]}
      detailLinkColumn="id"
      searchFields={['name']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'Product'}
      type={'products'}
      route={Routes['products']}
      tableId="products-list-view"
      fetch={fetch}
      onRemove={onRemove}
      additionalColumns={[
        {
          id: 'variants',
          accessorKey: 'variants',
          header: () => t('table.variants'),
          cell: ({ row }) => row.original.variantList.totalItems,
        },
        {
          id: 'allVariantsStock',
          accessorKey: 'allVariantsStock',
          header: () => t('table.allVariantsStock'),
          cell: ({ row }) => {
            const { stockOnHandTotal, stockAllocatedTotal } = row.original.variantList.items.reduce(
              (totals, item) => {
                totals.stockOnHandTotal += item.stockOnHand;
                totals.stockAllocatedTotal += item.stockAllocated;
                return totals;
              },
              { stockOnHandTotal: 0, stockAllocatedTotal: 0 },
            );

            return (
              <Badge variant={'outline'}>
                {stockOnHandTotal} ({stockAllocatedTotal} {t('table.allocated')})
              </Badge>
            );
          },
        },
      ]}
    />
  );
};
