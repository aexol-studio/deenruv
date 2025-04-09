import {
  AssetListType,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  ListLocations,
  createDialogFromComponent,
  DialogComponentProps,
  DialogHeader,
  Button,
  useTranslation,
  Input,
  Card,
  ScrollArea,
  formatDate,
  Badge,
  Separator,
  EntityCustomFields,
  CF,
  apiUploadClient,
} from '@deenruv/react-ui-devkit';
import { $, Permission, SortOrder } from '@deenruv/admin-types';
import { Crosshair, ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
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
  const onClose = () => {};

  const onSubmit = async () => {
    const input: { file: File; tags: string[]; customFields: {} }[] = [];
    const { createAssets } = await apiUploadClient('mutation')(
      {
        createAssets: [
          { input: $('input', '[CreateAssetInput!]!') },
          {
            __typename: true,
            '...on Asset': { id: true },
            '...on MimeTypeError': {
              fileName: true,
              mimeType: true,
              errorCode: true,
              message: true,
            },
          },
        ],
      },
      { variables: { input } },
    );
  };

  return <div className="mx-auto flex h-full w-full flex-col gap-6"></div>;
}

function EditAssetDialog<T extends { id: string }>({
  resolve,
  data: initialData,
}: DialogComponentProps<
  { name: string; customFields: CF; tags: string[]; focalPoint: { x: number; y: number } },
  AssetListType
>) {
  const { t } = useTranslation('common');
  const [data, setData] = useState(initialData);
  const [isEditingFocalPoint, setIsEditingFocalPoint] = useState(false);

  const onClose = () => {
    resolve({ name: '', tags: [], focalPoint: { x: 0, y: 0 }, customFields: {} });
  };

  const onSubmit = () => {
    resolve({ name: '', tags: [], focalPoint: { x: 0, y: 0 }, customFields: {} });
  };

  const button = useRef<HTMLButtonElement>(null);
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditingFocalPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (button.current && button.current.contains(e.target as Node)) return;

    setData({ ...data, focalPoint: { x, y } });
  };

  const toggleFocalPointEditing = () => {
    setIsEditingFocalPoint(!isEditingFocalPoint);
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col gap-6">
      <DialogHeader className="border-b pb-3 text-xl font-semibold">{data.name}</DialogHeader>

      <div className="flex h-full flex-col gap-6 md:flex-row">
        <div className="relative flex h-full w-full flex-col md:w-3/5">
          <div
            className={`bg-muted/30 relative flex h-full w-full overflow-hidden rounded-lg ${isEditingFocalPoint ? 'cursor-crosshair' : ''}`}
            onClick={handleImageClick}
          >
            {data?.source ? (
              <div className="relative h-full w-full">
                <img
                  src={data.source || '/placeholder.svg'}
                  alt={data.name}
                  className="absolute left-0 top-0 h-full w-full"
                />
                <div className="absolute right-2 top-2 opacity-50 hover:opacity-100">
                  <Button
                    ref={button}
                    variant={isEditingFocalPoint ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleFocalPointEditing}
                    className="flex items-center gap-1"
                  >
                    <Crosshair className="h-4 w-4" />
                    {isEditingFocalPoint ? t('Stop Editing Focal Point') : t('Edit Focal Point')}
                  </Button>
                  {data.focalPoint && (
                    <span className="text-muted-foreground text-xs">
                      x: {data.focalPoint.x.toFixed(2)}, y: {data.focalPoint.y.toFixed(2)}
                    </span>
                  )}
                </div>
                {data.focalPoint && (
                  <div
                    className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white shadow-lg ${
                      isEditingFocalPoint ? 'animate-pulse bg-blue-500/70' : 'bg-primary/70'
                    }`}
                    style={{
                      left: `${data.focalPoint.x * 100}%`,
                      top: `${data.focalPoint.y * 100}%`,
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <ImageIcon className="text-muted-foreground/50 h-16 w-16" />
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col md:w-2/5">
          <Card className="bg-card flex w-full flex-col border p-4 shadow-sm">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">{t('Asset Details')}</h3>

            <ScrollArea className="h-[450px] w-full pr-4">
              <div className="space-y-3">
                {Object.entries(data).map(([key, value], index) => {
                  if (key === 'source') return null;
                  return (
                    <div key={key} className="group">
                      {index > 0 && <Separator className="my-2 opacity-50" />}
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs font-medium capitalize">{t(key)}</span>
                        {(key === 'createdAt' || key === 'updatedAt') && typeof value === 'string' ? (
                          <span className="text-sm">{formatDate(value)}</span>
                        ) : key === 'tags' && Array.isArray(value) ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {value.length ? (
                              value.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag.value}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                No Tags
                              </Badge>
                            )}
                          </div>
                        ) : key === 'customFields' ? (
                          <div>
                            <EntityCustomFields entityName="asset" hideButton withoutBorder />
                          </div>
                        ) : key === 'name' && typeof value === 'string' ? (
                          <div>
                            <Input label={t('Name')} value={value} />
                          </div>
                        ) : key === 'focalPoint' &&
                          value &&
                          typeof value === 'object' &&
                          'x' in value &&
                          'y' in value ? (
                          <span className="bg-muted rounded px-2 py-1 font-mono text-sm">
                            x: {value.x.toFixed(2)}, y: {value.y.toFixed(2)}
                          </span>
                        ) : (
                          <span className="break-words text-sm">{String(value)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-2">
        <Button onClick={onClose} variant="outline" className="px-4">
          {t('Anuluj')}
        </Button>
        <Button onClick={onSubmit} variant="default" className="px-6">
          {t('Zapisz')}
        </Button>
      </div>
    </div>
  );
}

export const AssetsListPage = () => {
  return (
    <DetailList
      tableId={tableId}
      detailLinkColumn="id"
      searchFields={['id']}
      suggestedOrderColumns={{ id: 1, source: 2, tags: 3 }}
      hideColumns={[
        'fileSize',
        'width',
        'height',
        'focalPoint',
        'mimeType',
        'preview',
        'type',
        'customFields',
        'translations',
      ]}
      entityName={'Asset'}
      route={{
        create: async () => {
          const success = await createDialogFromComponent(UploadAssetDialog, {});
        },
        edit: async (id, row) => {
          const { name, tags, customFields, focalPoint } = await createDialogFromComponent(
            EditAssetDialog,
            row.original,
            { className: 'max-w-[1200px] h-[700px]' },
          );
        },
      }}
      fetch={fetch}
      onRemove={onRemove}
      additionalColumns={[
        {
          accessorKey: 'source',
          header: 'Source',
          cell: ({ row }) => {
            const { name, source } = row.original;
            return (
              <div className="relative h-32 w-32">
                <img src={source} alt={name} className="h-full w-full rounded-lg object-cover" />
              </div>
            );
          },
        },
        {
          accessorKey: 'tags',
          header: 'Tags',
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
