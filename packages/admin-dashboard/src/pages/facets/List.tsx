import { Permission, SortOrder } from '@deenruv/admin-types';
import {
  Routes,
  apiClient,
  DetailList,
  PaginationInput,
  deepMerge,
  ListBadge,
  TableLabel,
  ListLocations,
  useTranslation,
} from '@deenruv/react-ui-devkit';

const tableId = 'facets-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
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
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response.facets;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
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
    return error;
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
      additionalColumns={[
        {
          accessorKey: 'values',
          enableHiding: true,
          enableColumnFilter: false,
          header: () => <TableLabel>{t('table.values')}</TableLabel>,
          cell: ({ row }) => <ListBadge>{row.original.values.length}</ListBadge>,
        },
        {
          accessorKey: 'isPrivate',
          header: () => <TableLabel>{t('table.isPrivate')}</TableLabel>,
          cell: ({ row }) =>
            row.original.isPrivate ? (
              <ListBadge className="flex items-center justify-center border-orange-200 bg-orange-200 text-orange-800">
                {t('visibility.private')}
              </ListBadge>
            ) : (
              <ListBadge className="flex items-center justify-center border-green-200 bg-green-200 text-green-800">
                {t('visibility.public')}
              </ListBadge>
            ),
        },
      ]}
      route={Routes['facets']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateFacet]}
      deletePermissions={[Permission.DeleteFacet]}
    />
  );
};
