import { DetailList, ListLocations, PaginationInput, TableLabel, apiClient, deepMerge } from '@deenruv/react-ui-devkit';
import { Routes } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'zones-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['zones']: [
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
  return response['zones'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteZones } = await apiClient('mutation')({
      deleteZones: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteZones.length;
  } catch (error) {
    return error;
  }
};

export const ZonesListPage = () => {
  const { t } = useTranslation('zones');

  return (
    <DetailList
      filterFields={[{ key: 'name', operator: 'StringOperators' }]}
      detailLinkColumn="id"
      searchFields={['name']}
      hideColumns={['customFields', 'translations']}
      additionalColumns={[
        {
          accessorKey: 'members',
          enableColumnFilter: false,
          header: () => <TableLabel>{t('table.members')}</TableLabel>,
          cell: ({ row }) => row.original.members.length,
        },
      ]}
      entityName={'Zone'}
      route={Routes['zones']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateZone]}
      deletePermissions={[Permission.DeleteZone]}
    />
  );
};
