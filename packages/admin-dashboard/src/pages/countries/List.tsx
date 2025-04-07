import { Permission, SortOrder } from '@deenruv/admin-types';
import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListLocations } from '@deenruv/react-ui-devkit';

const tableId = 'countries-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['countries']: [
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
  return response['countries'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteCountries } = await apiClient('mutation')({
      deleteCountries: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteCountries.length;
  } catch (error) {
    return error;
  }
};

export const CountriesListPage = () => {
  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
        { key: 'code', operator: 'StringOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['customFields', 'translations']}
      entityName={'Country'}
      route={Routes['countries']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateCountry]}
      deletePermissions={[Permission.DeleteCountry]}
    />
  );
};
