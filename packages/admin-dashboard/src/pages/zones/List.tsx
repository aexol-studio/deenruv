import { DetailList, PaginationInput, apiClient, deepMerge } from '@deenruv/react-ui-devkit';
import { Routes } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { ZoneListSelector } from '@/graphql/zones';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(ZoneListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
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
      { items: selector, totalItems: true },
    ],
  });
  return response['zones'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
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
    console.error(error);
    return false;
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
          header: () => t('table.members'),
          cell: ({ row }) => row.original.members.length,
        },
      ]}
      entityName={'Zone'}
      type={'zones'}
      route={Routes['zones']}
      tableId="zones-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateZone}
      deletePermission={Permission.DeleteZone}
    />
  );
};
