import { $ } from '@deenruv/admin-types';
import {
  apiClient,
  AssetListType,
  Badge,
  Button,
  Card,
  DialogComponentProps,
  DialogHeader,
  EntityCustomFields,
  formatDate,
  formatFileSize,
  Input,
  Separator,
  useDetailList,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Copy, Crosshair, ImageIcon, TagIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function EditAssetDialog<T extends { id: string }>({
  resolve,
  reject,
  close,
  data: initialData,
}: DialogComponentProps<{ success: boolean }, AssetListType>) {
  const { t } = useTranslation('assets');
  const [data, setData] = useState(initialData);
  const [isEditingFocalPoint, setIsEditingFocalPoint] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [nameInput, setNameInput] = useState(data.name);
  const { refetch } = useDetailList();

  const onClose = () => {
    close();
  };

  const onSubmit = async () => {
    const input = {
      id: data.id,
      name: nameInput,
      focalPoint: data.focalPoint ?? undefined,
      tags: data.tags.map((t) => t.value),
      customFields: {},
    };

    try {
      const { updateAsset } = await apiClient('mutation')(
        {
          updateAsset: [{ input: $('input', 'UpdateAssetInput!') }, { __typename: true, '...on Asset': { id: true } }],
        },
        { variables: { input } },
      );

      if (updateAsset.__typename === 'Asset') {
        toast.success(t('dialogs.editedSuccess'));
        resolve({ success: true });
        refetch();
      } else {
        toast.error(t('dialogs.editedFail'));
      }
    } catch (error) {
      console.error(t('dialogs.uploadFail'), error);
      setIsUploading(false);
      reject?.(new Error('Upload failed'));
    }
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

  const handleRemoveTag = (tag: string) => {
    const updatedTags = (data.tags || []).filter((t) => t.value !== tag);
    setData({ ...data, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !(data.tags.map((t) => t.value) || []).includes(tagInput.trim())) {
      const updatedTags = [...(data.tags || []), { id: '', value: tagInput.trim() }];
      setData({ ...data, tags: updatedTags });
      setTagInput('');
    }
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
                    {isEditingFocalPoint ? t('dialogs.focalStop') : t('dialogs.focalEdit')}
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

        <div className="flex w-full flex-col md:w-[45%]">
          <Card className="bg-card flex w-full flex-col border p-4 shadow-sm">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">{t('dialogs.details')}</h3>

            <ScrollArea className="h-[450px] w-full overflow-auto pr-4">
              <div className="space-y-3">
                {Object.entries(data).map(([key, value], index) => {
                  if (key === 'source') return null;
                  return (
                    <div key={key} className="group">
                      {index > 0 && <Separator className="my-2 opacity-50" />}
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs font-medium capitalize">
                          {t(`detailsTable.${key}`)}
                        </span>
                        {(key === 'createdAt' || key === 'updatedAt') && typeof value === 'string' ? (
                          <span className="text-sm">{formatDate(value)}</span>
                        ) : key === 'tags' && Array.isArray(value) ? (
                          <div className="group">
                            <div className="flex flex-col gap-1">
                              <div className="mt-1 flex flex-wrap gap-1">
                                {(value || []).length ? (
                                  (value || []).map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                                      {tag.value}
                                      <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => handleRemoveTag(tag.value)}
                                      />
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-xs">{t('dialogs.noTags')}</span>
                                )}
                              </div>
                              <div className="mt-2 flex gap-2">
                                <Input
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  placeholder={t('dialogs.addTag')}
                                  className="text-sm"
                                />
                                <Button
                                  className="h-10"
                                  variant="outline"
                                  onClick={handleAddTag}
                                  disabled={!tagInput.trim()}
                                >
                                  <TagIcon className="mr-1 h-4 w-4" />
                                  {t('dialogs.add')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : key === 'customFields' ? (
                          <div>
                            <EntityCustomFields entityName="asset" hideButton withoutBorder />
                          </div>
                        ) : key === 'name' && typeof value === 'string' ? (
                          <div>
                            <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                          </div>
                        ) : key === 'focalPoint' &&
                          value &&
                          typeof value === 'object' &&
                          'x' in value &&
                          'y' in value ? (
                          <span className="bg-muted rounded px-2 py-1 font-mono text-sm">
                            x: {value.x.toFixed(2)}, y: {value.y.toFixed(2)}
                          </span>
                        ) : key === 'preview' ? (
                          <div className="bg-secondary flex items-center justify-between rounded-md p-2 font-mono text-sm">
                            <span className="truncate">{String(value)}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(String(value)).then(() => toast(t('dialogs.linkCopied')));
                              }}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        ) : key === 'width' || key === 'height' ? (
                          <span className="break-words text-sm">{`${value}px`}</span>
                        ) : key === 'type' ? (
                          <span className="break-words text-sm">{t('types.' + value)}</span>
                        ) : key === 'fileSize' ? (
                          <span className="break-words text-sm">{formatFileSize(+value)}</span>
                        ) : (
                          <div>
                            {value ? (
                              <span className="break-words text-sm">{String(value)}</span>
                            ) : (
                              <span className="text-muted-foreground text-sm">{t('dialogs.noFocal')}</span>
                            )}
                          </div>
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
        <Button onClick={onClose} variant="outline" className="px-4" disabled={isUploading}>
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} variant="default" className="px-6" disabled={isUploading}>
          {isUploading ? t('uploading') : t('save')}
        </Button>
      </div>
    </div>
  );
}
