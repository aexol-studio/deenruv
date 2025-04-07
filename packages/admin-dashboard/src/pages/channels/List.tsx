import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListLocations } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'channels-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    channels: [
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
  return response.channels;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteChannels } = await apiClient('mutation')({
      deleteChannels: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteChannels.length;
  } catch (error) {
    return error;
  }
};

export const ChannelsListPage = () => {
  return (
    <DetailList
      tableId={tableId}
      filterFields={[
        { key: 'code', operator: 'StringOperators' },
        { key: 'token', operator: 'StringOperators' },
      ]}
      detailLinkColumn="code"
      searchFields={['code', 'token']}
      hideColumns={['customFields', 'translations']}
      entityName={'Channel'}
      route={Routes['channels']}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateChannel]}
      deletePermissions={[Permission.DeleteChannel]}
    />
  );
};
