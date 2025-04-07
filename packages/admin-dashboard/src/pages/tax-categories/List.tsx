import { Routes, apiClient, DetailList, deepMerge, PaginationInput, ListLocations } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'taxCategories-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['taxCategories']: [
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
  return response['taxCategories'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteTaxCategories } = await apiClient('mutation')({
      deleteTaxCategories: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteTaxCategories.length;
  } catch (error) {
    return error;
  }
};

export const TaxCategoriesListPage = () => {
  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'isDefault', operator: 'BooleanOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['name']}
      hideColumns={['customFields', 'translations']}
      entityName={'TaxCategory'}
      route={Routes['taxCategories']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateTaxCategory]}
      deletePermissions={[Permission.DeleteTaxCategory]}
    />
  );
};
