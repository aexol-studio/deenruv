import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListBadge } from '@deenruv/react-ui-devkit';
import { AdminListSelector } from '@/graphql/admins';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(AdminListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
  const response = await apiClient('query')({
    administrators: [
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
  return response.administrators;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteAdministrators } = await apiClient('mutation')({
      deleteAdministrators: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteAdministrators.length;
  } catch (error) {
    return error;
  }
};

export const AdminsListPage = () => {
  const { t } = useTranslation('admins');

  return (
    <DetailList
      filterFields={[
        { key: 'firstName', operator: 'StringOperators' },
        { key: 'emailAddress', operator: 'StringOperators' },
        { key: 'lastName', operator: 'StringOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['firstName', 'lastName', 'emailAddress']}
      hideColumns={['customFields', 'translations', 'user']}
      additionalColumns={[
        {
          accessorKey: 'role',
          enableSorting: false,
          enableColumnFilter: false,
          header: () => t('table.role'),
          cell: ({ row }) => (
            <div className="flex gap-1">
              {row.original.user.roles.map((r) => (
                <ListBadge key={r.description}>{r.description}</ListBadge>
              ))}
            </div>
          ),
        },
      ]}
      entityName={'Administrator'}
      type={'administrators'}
      route={Routes['admins']}
      tableId="admins-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateAdministrator}
      deletePermission={Permission.DeleteAdministrator}
    />
  );
};
