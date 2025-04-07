import {
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  ListLocations,
  createDialogFromComponent,
  DialogComponentProps,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'assets-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    assets: [
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
  return response.assets;
};

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteAssets } = await apiClient('mutation')({
      deleteAssets: [{ input: { assetIds: ids } }, { message: true, result: true }],
    });
    return !!deleteAssets.result.length;
  } catch (error) {
    return error;
  }
};

function UploadAssetDialog<T extends { id: string }>({ close, reject, resolve }: DialogComponentProps<boolean, {}>) {
  return <></>;
}

export const AssetsListPage = () => {
  return (
    <DetailList
      tableId={tableId}
      filterFields={[{ key: 'id', operator: 'StringOperators' }]}
      detailLinkColumn="id"
      searchFields={['id']}
      hideColumns={['customFields', 'translations']}
      entityName={'Asset'}
      route={{
        create: async () => {
          const success = await createDialogFromComponent(UploadAssetDialog, {});
        },
        edit: (id: string) => Routes.assets.list,
      }}
      fetch={fetch}
      onRemove={onRemove}
      additionalColumns={[
        {
          accessorKey: 'source',
          header: 'Source',
          cell: ({ row }) => {
            const { source } = row.original;
            return <img src={source} alt="Source" />;
          },
        },
        {
          accessorKey: 'preview',
          header: 'Preview',
          cell: ({ row }) => {
            const { preview } = row.original;
            return <img src={preview} alt="Preview" />;
          },
        },
      ]}
      createPermissions={[Permission.CreateChannel]}
      deletePermissions={[Permission.DeleteChannel]}
    />
  );
};
