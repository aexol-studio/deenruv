import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  useTranslation,
  apiClient,
  Badge,
  deepMerge,
  DetailList,
  ListLocations,
  PaginationInput,
} from '@deenruv/react-ui-devkit';
import { useNavigate } from 'react-router-dom';

const tableId = 'productVariants-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
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
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response.productVariants;
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

export const VariantsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  return (
    <DetailList
      filterFields={[
        { key: 'sku', operator: 'StringOperators' },
        { key: 'name', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
        { key: 'price', operator: 'NumberOperators' },
        { key: 'priceWithTax', operator: 'NumberOperators' },
        { key: 'stockOnHand', operator: 'NumberOperators' },
        { key: 'stockAllocated', operator: 'NumberOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['name', 'sku']}
      hideColumns={['customFields', 'stockOnHand', 'stockAllocated', 'productId']}
      entityName={'ProductVariant'}
      route={{
        edit: (variantId, productId) => {
          navigate(`/admin-ui/products/${productId}?tab=variants&variantId=${variantId}`, { viewTransition: true });
        },
      }}
      noCreateButton
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateProduct]}
      deletePermissions={[Permission.DeleteProduct]}
      additionalColumns={[
        {
          id: 'stock',
          accessorKey: 'stock',
          header: () => t('table.stock'),
          cell: ({ row }) => {
            return (
              <Badge variant={'outline'}>
                {row.original.stockOnHand}
                {row.original.stockAllocated > 0 && `(${row.original.stockAllocated} ${t('table.allocated')})`}
              </Badge>
            );
          },
        },
      ]}
    />
  );
};
