import { apiCall } from '@/graphql/client';
import { SortOrder } from '@deenruv/admin-types';
import { GenericList } from '@/new-lists/GenericList';
import { PaginationInput } from '@/lists/models';
import { ProductListSelector, Routes } from '@deenruv/react-ui-devkit';

const PAGE_KEY = 'products';
const ENTITY_NAME = 'Product';

function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  Object.keys(source).forEach((key) => {
    const targetValue = (target as any)[key];
    const sourceValue = (source as any)[key];

    if (Array.isArray(sourceValue)) {
      (target as any)[key] = [...(Array.isArray(targetValue) ? targetValue : []), ...sourceValue];
    } else if (isObject(sourceValue)) {
      (target as any)[key] = deepMerge(isObject(targetValue) ? targetValue : {}, sourceValue);
    } else {
      (target as any)[key] = sourceValue;
    }
  });

  return target as T & U;
}

const fetch = async <T,>(
  { page, perPage, filter, filterOperator, sort }: PaginationInput,
  customFieldsSelector?: T,
) => {
  const items = deepMerge(ProductListSelector, customFieldsSelector ?? {});
  const response = await apiCall()('query')({
    [PAGE_KEY]: [
      {
        options: {
          take: perPage,
          skip: (page - 1) * perPage,
          filterOperator: filterOperator,
          sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
          ...(filter && { filter }),
        },
      },
      { items, totalItems: true },
    ],
  });
  return response[PAGE_KEY];
};

export const PromotionsListPage = () => {
  return (
    <GenericList
      type={PAGE_KEY}
      route={Routes[PAGE_KEY]}
      ENTITY_NAME={ENTITY_NAME}
      fetch={fetch}
      onRemove={(items) => {
        console.log(items);
        return Promise.resolve(true);
      }}
      searchFields={['slug']}
      hideColumns={['variantList', 'collections', 'translations', 'customFields']}
      customColumns={[]}
    />
  );
};
