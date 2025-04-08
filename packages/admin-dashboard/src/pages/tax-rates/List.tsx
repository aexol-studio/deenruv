import {
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  TableLabel,
  ListLocations,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'taxRates-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['taxRates']: [
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
  return response['taxRates'];
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteTaxRates } = await apiClient('mutation')({
      deleteTaxRates: [
        { ids },
        {
          message: true,
          result: true,
        },
      ],
    });
    return !!deleteTaxRates.length;
  } catch (error) {
    return error;
  }
};

export const TaxRatesListPage = () => {
  const { t } = useTranslation('taxRates');

  return (
    <DetailList
      filterFields={[
        { key: 'name', operator: 'StringOperators' },
        { key: 'enabled', operator: 'BooleanOperators' },
        { key: 'value', operator: 'NumberOperators' },
      ]}
      detailLinkColumn="id"
      searchFields={['name']}
      hideColumns={['customFields', 'translations', 'category']}
      additionalColumns={[
        {
          accessorKey: 'taxCategory',
          header: () => <TableLabel>{t('table.taxCategory')}</TableLabel>,
          cell: ({ row }) => row.original.category.name,
        },
        {
          accessorKey: 'zone',
          header: () => <TableLabel>{t('table.zone')}</TableLabel>,
          cell: ({ row }) => row.original.zone.name,
        },
        {
          accessorKey: 'customerGroup',
          header: () => <TableLabel>{t('table.customerGroup')}</TableLabel>,
          cell: ({ row }) => row.original.customerGroup?.name ?? '—',
        },
      ]}
      entityName={'TaxRate'}
      route={Routes['taxRates']}
      tableId={tableId}
      fetch={fetch}
      onRemove={onRemove}
      createPermissions={[Permission.CreateTaxRate]}
      deletePermissions={[Permission.DeleteTaxRate]}
    />
  );
};
