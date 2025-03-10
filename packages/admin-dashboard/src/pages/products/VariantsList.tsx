import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  deepMerge,
  DetailList,
  PaginationInput,
  ProductVariantListSelector,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(
    deepMerge(ProductVariantListSelector, customFieldsSelector ?? {}),
    additionalSelector ?? {},
  );
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
      { items: selector, totalItems: true },
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
      type={'productVariants'}
      route={{
        edit: (variantId, productId) => {
          navigate(`/admin-ui/products/${productId}?tab=variants&variantId=${variantId}`, { viewTransition: true });
        },
      }}
      noCreateButton
      tableId="productVariants-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateProduct}
      deletePermission={Permission.DeleteProduct}
      additionalColumns={[
        {
          id: 'stock',
          accessorKey: 'stock',
          header: () => t('table.stock'),
          cell: ({ row }) => {
            return (
              <Badge variant={'outline'}>
                {row.original.stockOnHand}{' '}
                {row.original.stockAllocated > 0 && `(${row.original.stockAllocated} ${t('table.allocated')})`}
              </Badge>
            );
          },
        },
      ]}
    />
  );
};
