import React, { useCallback, useEffect } from 'react';
import {
  CustomerDetailOrderSelector,
  DetailList,
  OrderStateBadge,
  PaginationInput,
  Routes,
  TableLabel,
  apiClient,
  deepMerge,
  useDetailView,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

export const OrdersTab: React.FC = () => {
  const { t } = useTranslation('table');
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, fetchEntity } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  useEffect(() => {
    fetchEntity();
  }, [contentLng]);

  const fetch = useCallback(
    async <T, K>(
      { page, perPage, filter, filterOperator, sort }: PaginationInput,
      customFieldsSelector?: T,
      additionalSelector?: K,
    ) => {
      const selector = deepMerge(
        deepMerge(CustomerDetailOrderSelector, customFieldsSelector ?? {}),
        additionalSelector ?? {},
      );
      const response = await apiClient('query')({
        customer: [
          { id: id! },
          {
            orders: [
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
          },
        ],
      });
      return response['customer']!.orders!;
    },
    [id],
  );

  if (!id) return null;

  return (
    <DetailList
      detailLinkColumn="id"
      filterFields={[{ key: 'id', operator: 'IDOperators' }]}
      searchFields={['code']}
      hideColumns={['customFields', 'user', 'title']}
      entityName={'Order'}
      type={'orders'}
      route={Routes['orders']}
      tableId="orders-list-view"
      fetch={fetch}
      noCreateButton
      createPermission={Permission.CreateOrder}
      deletePermission={Permission.DeleteOrder}
      additionalColumns={[
        {
          accessorKey: 'state',
          header: () => <TableLabel>{t('columns.state')}</TableLabel>,
          accessorFn: (order) => order?.state,
          cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
        },
      ]}
    />
  );
};
