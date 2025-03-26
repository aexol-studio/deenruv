import { Permission, SortOrder } from '@deenruv/admin-types';
import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { CountrySelector } from '@/graphql/settings';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(CountrySelector, additionalSelector ?? {});
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
      { items: selector, totalItems: true },
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
      tableId="countries-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateCountry]}
      deletePermissions={[Permission.DeleteCountry]}
    />
  );
};
