import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { ChannelListSelector } from '@/graphql/channels';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(ChannelListSelector, additionalSelector ?? {});
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
      { items: selector, totalItems: true },
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
      filterFields={[
        { key: 'code', operator: 'StringOperators' },
        { key: 'token', operator: 'StringOperators' },
      ]}
      detailLinkColumn="code"
      searchFields={['code', 'token']}
      hideColumns={['customFields', 'translations']}
      entityName={'Channel'}
      route={Routes['channels']}
      tableId="channels-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateChannel]}
      deletePermissions={[Permission.DeleteChannel]}
    />
  );
};
