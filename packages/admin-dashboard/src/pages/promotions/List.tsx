import { apiCall } from '@/graphql/client';
import { SortOrder, ValueTypes } from '@deenruv/admin-types';
import { GenericList } from '@/new-lists/GenericList';
import { PaginationInput } from '@/lists/models';
import { mergeSelectorWithCustomFields, ProductListSelector, Routes } from '@deenruv/react-ui-devkit';
import { useServer } from '@/state';
import { useMemo } from 'react';

const PAGE_KEY = 'products';
const ENTITY_NAME = 'Product';

const fetch = async <T extends ValueTypes[K], K extends typeof ENTITY_NAME>({
  page,
  perPage,
  filter,
  filterOperator,
  sort,
  selector,
}: PaginationInput & {
  selector: T;
}) => {
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
      { items: selector, totalItems: true },
    ],
  });
  return response[PAGE_KEY];
};

export const PromotionsListPage = () => {
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find((el) => el.entityName === ENTITY_NAME),
  )?.customFields;

  const selector = useMemo(
    () => mergeSelectorWithCustomFields(ProductListSelector, ENTITY_NAME, entityCustomFields),
    [entityCustomFields],
  );

  return (
    <GenericList
      listType={PAGE_KEY}
      route={Routes[PAGE_KEY]}
      fetch={(params) => fetch({ ...params, selector })}
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
