import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  apiClient,
  deepMerge,
  DetailList,
  ListBadge,
  ListLocations,
  PaginationInput,
  Routes,
  TableLabel,
  useTranslation,
  FacetIdsSelector,
} from '@deenruv/react-ui-devkit';
// import { FacetValueSelector } from '@deenruv/react-ui-devkit/FacetValueSelector.js';
const tableId = 'products-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
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
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response['products'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteProducts } = await apiClient('mutation')({
      deleteProducts: [{ ids }, { message: true, result: true }],
    });
    return !!deleteProducts.length;
  } catch (error) {
    return error;
  }
};

export const ProductsListPage = () => {
  const { t } = useTranslation('products');

  return (
    <DetailList
      filterFields={[
        { key: 'slug', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
        { key: 'sku', operator: 'StringOperators' },
        { key: 'name', operator: 'StringOperators' },
        {
          key: 'facetValueId',
          component: (props) => {
            return (
              <FacetIdsSelector
                onChange={(facetValuesId: string[]) => {
                  if (facetValuesId.length === 0) {
                    props.onChange(undefined);
                    return;
                  }
                  props.onChange({ in: facetValuesId.map((o) => o) });
                }}
                facetValuesIds={props.value.in}
              />
            );
          },
        },
      ]}
      detailLinkColumn="id"
      searchFields={['name', 'slug', 'sku']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      entityName={'Product'}
      route={Routes['products']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateProduct]}
      deletePermissions={[Permission.DeleteProduct]}
      additionalColumns={[
        {
          id: 'variants',
          accessorKey: 'variants',
          header: () => <TableLabel>{t('table.variants')}</TableLabel>,
          cell: ({ row }) => row.original.variantList.totalItems,
        },
        {
          id: 'allVariantsStock',
          accessorKey: 'allVariantsStock',
          header: () => <TableLabel>{t('table.allVariantsStock')}</TableLabel>,
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
              <ListBadge>
                {stockOnHandTotal} ({stockAllocatedTotal} {t('table.allocated')})
              </ListBadge>
            );
          },
        },
      ]}
    />
  );
};
