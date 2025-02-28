import { Routes, apiClient, DetailList, deepMerge, PaginationInput } from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { TaxCategoryListSelector } from '@/graphql/taxCategories';

const fetch = async <T, K>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
  additionalSelector?: K,
) => {
  const selector = deepMerge(deepMerge(TaxCategoryListSelector, customFieldsSelector ?? {}), additionalSelector ?? {});
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
      { items: selector, totalItems: true },
    ],
  });
  return response['taxCategories'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
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
    console.error(error);
    return false;
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
      type={'taxCategories'}
      route={Routes['taxCategories']}
      tableId="taxCategories-list-view"
      fetch={fetch}
      onRemove={onRemove}
      createPermission={Permission.CreateTaxCategory}
      deletePermission={Permission.DeleteTaxCategory}
    />
  );
};
