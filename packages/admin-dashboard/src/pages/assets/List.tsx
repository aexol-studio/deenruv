import {
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  ListLocations,
  createDialogFromComponent,
  Badge,
  ImageWithPreview,
  useTranslation,
  TableLabel,
} from '@deenruv/react-ui-devkit';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { UploadAssetDialog } from '@/pages/assets/_components/UploadAssetDialog.js';
import { EditAssetDialog } from '@/pages/assets/_components/EditAssetDialog.js';
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

export const AssetsListPage = () => {
  const { t } = useTranslation('table');
  return (
    <DetailList
      tableId={tableId}
      detailLinkColumn="id"
      searchFields={['id']}
      suggestedOrderColumns={{ id: 1, preview: 2, tags: 3 }}
      hideColumns={[
        'fileSize',
        'width',
        'height',
        'focalPoint',
        'mimeType',
        'source',
        'type',
        'customFields',
        'translations',
      ]}
      entityName={'Asset'}
      route={{
        create: async (refetch) => {
          const response = await createDialogFromComponent(
            UploadAssetDialog,
            {},
            { className: 'max-w-[1200px] h-[700px]' },
          );

          if (response.success) {
            refetch();
          }
        },
        edit: async (id, row, refetch) => {
          const response = await createDialogFromComponent(EditAssetDialog, row.original, {
            className: 'max-w-[1200px] h-[700px]',
          });

          if (response.success) {
            refetch();
          }
        },
      }}
      fetch={fetch}
      onRemove={onRemove}
      additionalColumns={[
        {
          accessorKey: 'preview',
          header: () => <TableLabel>{t('columns.image')}</TableLabel>,
          cell: ({ row }) => {
            const { name, preview } = row.original;
            return (
              <div className="relative">
                <ImageWithPreview src={preview} alt={name} previewClassName="p-2" />
              </div>
            );
          },
        },
        {
          accessorKey: 'tags',
          header: () => <TableLabel>{t('columns.tags')}</TableLabel>,
          cell: ({ row }) => {
            const { tags } = row.original;
            return (
              <div className="flex flex-wrap gap-1">
                {tags.length ? (
                  tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag.value}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    No Tags
                  </Badge>
                )}
              </div>
            );
          },
        },
      ]}
      createPermissions={[Permission.CreateChannel]}
      deletePermissions={[Permission.DeleteChannel]}
    />
  );
};
