import { Row } from '@tanstack/react-table';
import { useCallback } from 'react';
import {
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  DEFAULT_CHANNEL_CODE,
  ListBadge,
  ListLocations,
  useTranslation,
  Routes,
  TableLabel,
  RoleListType,
  EntityChannelManagementBulkAction,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'roles-list-view';
const { selector } = ListLocations[tableId];

const DEFAULT_ROLE_CODES = ['__customer_role__', '__super_admin_role__'];

const isDefaultRole = (row: Row<RoleListType>) => DEFAULT_ROLE_CODES.includes(row.original.code);

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    roles: [
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
  return response.roles;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteRoles } = await apiClient('mutation')({
      deleteRoles: [{ ids }, { message: true, result: true }],
    });
    return !!deleteRoles.length;
  } catch (error) {
    return error;
  }
};

export const RolesListPage = () => {
  const { t } = useTranslation('roles');

  const renderElements = useCallback((elements: string[]) => {
    const LIMIT_TO = 3;
    const elementsRemain = elements.length - LIMIT_TO;
    const renderedElements = elements
      .filter((_e, i) => i + 1 <= LIMIT_TO)
      .map((e) => <ListBadge key={e}>{e}</ListBadge>);
    return (
      <>
        {renderedElements}
        {elementsRemain > 0 && <ListBadge key={'plus'}>+{elementsRemain}</ListBadge>}
      </>
    );
  }, []);

  return (
    <DetailList
      filterFields={[
        { key: 'id', operator: 'IDOperators' },
        { key: 'description', operator: 'StringOperators' },
        { key: 'code', operator: 'StringOperators' },
      ]}
      detailLinkColumn="description"
      searchFields={['code', 'description']}
      hideColumns={['customFields', 'translations', 'collections', 'variantList']}
      additionalBulkActions={[...EntityChannelManagementBulkAction(tableId)]}
      additionalColumns={[
        {
          accessorKey: 'permissions',
          enableSorting: false,
          enableColumnFilter: false,
          header: () => <TableLabel>{t('table.permissions')}</TableLabel>,
          cell: ({ row }) => (
            <div className="flex gap-1">
              {isDefaultRole(row) ? (
                <p className="flex w-full items-center justify-center py-2 text-[12px] font-medium text-gray-500">
                  {t('table.defaultRoleInfo')}
                </p>
              ) : (
                renderElements(row.original.permissions)
              )}
            </div>
          ),
        },
        {
          accessorKey: 'channels',
          enableSorting: false,
          enableColumnFilter: false,
          header: () => <TableLabel>{t('table.channels')}</TableLabel>,
          cell: ({ row }) => (
            <div className="flex gap-1">
              {isDefaultRole(row)
                ? ''
                : row.original.channels.map((ch) => (
                    <ListBadge key={ch.code}>
                      {ch.code === DEFAULT_CHANNEL_CODE ? t('defaultChannel') : ch.code}
                    </ListBadge>
                  ))}
            </div>
          ),
        },
      ]}
      entityName={'Role'}
      route={Routes['roles']}
      tableId="roles-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateAdministrator]}
      deletePermissions={[Permission.DeleteAdministrator]}
    />
  );
};
