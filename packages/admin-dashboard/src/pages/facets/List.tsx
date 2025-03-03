import { Permission, SortOrder } from '@deenruv/admin-types';
import { Badge, Routes, apiClient, DetailList, PaginationInput, deepMerge } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { FacetListSelector } from '@/graphql/facets';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(FacetListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
    facets: [
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
  return response.facets;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteFacets } = await apiClient('mutation')({
      deleteFacets: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteFacets.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const FacetsListPage = () => {
  const { t } = useTranslation('facets');

  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'code', operator: 'StringOperators' },
        { key: 'isPrivate', operator: 'BooleanOperators' },
      ]}
      detailLinkColumn="code"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations']}
      entityName={'Facet'}
      type={'facets'}
      additionalColumns={[
        {
          accessorKey: 'values',
          enableHiding: true,
          enableColumnFilter: false,
          header: t('table.values'),
          cell: ({ row }) => <Badge variant={'secondary'}>{row.original.values.length}</Badge>,
        },
        {
          accessorKey: 'isPrivate',
          header: t('table.isPrivate'),
          cell: ({ row }) =>
            row.original.isPrivate ? (
              <Badge
                variant={'outline'}
                className="flex items-center justify-center border-orange-200 bg-orange-200 text-orange-800"
              >
                {t('visibility.private')}
              </Badge>
            ) : (
              <Badge className="flex items-center justify-center border-green-200 bg-green-200 text-green-800">
                {t('visibility.public')}
              </Badge>
            ),
        },
      ]}
      route={Routes['facets']}
      tableId="facets-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateFacet}
      deletePermission={Permission.DeleteFacet}
    />
  );
};
