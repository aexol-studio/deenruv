import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  useTranslation,
  apiClient,
  Badge,
  deepMerge,
  DetailList,
  ListLocations,
  PaginationInput,
  Routes,
  TableLabel,
  FacetIdsSelector,
  EntityChannelManagementBulkAction,
  EntityFacetManagementBulkAction,
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

export const ProductVariantsListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  return (
    <DetailList
      additionalBulkActions={[...EntityChannelManagementBulkAction(tableId), EntityFacetManagementBulkAction(tableId)]}
      filterFields={[
        { key: 'sku', operator: 'StringOperators' },
        { key: 'name', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
        { key: 'price', operator: 'NumberOperators' },
        { key: 'priceWithTax', operator: 'NumberOperators' },
        { key: 'stockOnHand', operator: 'NumberOperators' },
        { key: 'stockAllocated', operator: 'NumberOperators' },
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
      searchFields={['name', 'sku']}
      hideColumns={['customFields', 'productId', 'stockOnHand', 'stockAllocated']}
      entityName={'ProductVariant'}
      route={{
        ...Routes.productVariants,
        edit: (variantId, row) => {
          navigate(`/admin-ui/products/${row.original['productId']}?tab=variants&variantId=${variantId}`, {
            viewTransition: true,
          });
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
          header: () => <TableLabel>{t('table.stock')}</TableLabel>,
          cell: ({ row }) => {
            return (
              <div className="flex flex-col gap-1">
                <Badge
                  className="flex justify-between gap-1"
                  variant={row.original.stockOnHand <= 0 ? 'destructive' : 'outline'}
                >
                  <span>{t('table.stockOnHand')}</span>
                  <span>{row.original.stockOnHand}</span>
                </Badge>
                <Badge className="flex justify-between gap-1" variant={'outline'}>
                  <span>{t('table.stockAllocated')}</span>
                  <span>{row.original.stockAllocated}</span>
                </Badge>
              </div>
            );
          },
        },
      ]}
    />
  );
};
