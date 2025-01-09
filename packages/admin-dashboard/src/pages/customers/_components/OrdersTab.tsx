import React, { useCallback, useEffect } from 'react';
import {
  CustomerDetailOrderSelector,
  DetailList,
  PaginationInput,
  Routes,
  apiClient,
  deepMerge,
  useDetailView,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { SortOrder } from '@deenruv/admin-types';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

export const OrdersTab: React.FC = () => {
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
    />
  );
};
