import { $, AssetType } from '@deenruv/admin-types';
import {
  apiUploadClient,
  Badge,
  Button,
  Card,
  DialogComponentProps,
  DialogHeader,
  EntityCustomFields,
  Input,
  ScrollArea,
  Separator,
  useTranslation,
  formatFileSize,
} from '@deenruv/react-ui-devkit';
import { Crosshair, ImageIcon, TagIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type File = unknown;

export function UploadAssetDialog<T extends { id: string }>({
  close,
  reject,
  resolve,
}: DialogComponentProps<{ success: boolean }, {}>) {
  const { t } = useTranslation('assets');
  const [file, setFile] = useState<{
    name: string;
    type: AssetType;
    fileSize: number;
    preview?: string;
    file: File;
    focalPoint?: { x: number; y: number };
    tags?: string[];
  }>();
  const [isEditingFocalPoint, setIsEditingFocalPoint] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const onClose = () => {
    close?.();
  };

  const onSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    const input = [{ file: file.file, tags: file.tags ?? [], customFields: {}, focalPoint: file.focalPoint }];
    try {
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

      if (createAssets[0].__typename === 'Asset') {
        toast.success(t('dialogs.createdSuccess'));
        resolve({ success: true });
      } else {
        toast.error(t('dialogs.createdFail'));
      }
    } catch (error) {
      console.error(t('dialogs.uploadFail'), error);
      setIsUploading(false);
      reject?.(new Error('Upload failed'));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files);
    }
  };

  const handleFile = (fileList: FileList) => {
    const files = Array.from(fileList);
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileType = selectedFile.type.split('/')[0];

      if (fileType === 'image' || fileType === 'video' || fileType === 'audio') {
        setFile({
          file: selectedFile,
          preview: URL.createObjectURL(selectedFile),
          type: fileType as AssetType,
          fileSize: selectedFile.size,
          name: selectedFile.name,
          focalPoint: undefined,
          tags: [],
        });
      } else {
        alert(t('dialogs.invalidType'));
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditingFocalPoint || !file) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    if (button.current && button.current.contains(e.target as Node)) return;

    setFile({ ...file, focalPoint: { x, y } });
  };

  const toggleFocalPointEditing = () => {
    setIsEditingFocalPoint(!isEditingFocalPoint);
  };

  const handleRemoveTag = (tag: string) => {
    if (!file) return;
    const updatedTags = (file.tags || []).filter((t) => t !== tag);
    setFile({ ...file, tags: updatedTags });
  };

  const handleAddTag = () => {
    if (!file) return;
    if (tagInput.trim() && !(file.tags || []).includes(tagInput.trim())) {
      const updatedTags = [...(file.tags || []), tagInput.trim()];
      setFile({ ...file, tags: updatedTags });
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!file) return;
    setFile({ ...file, name: e.target.value });
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col gap-6">
      <DialogHeader className="border-b pb-3 text-xl font-semibold">
        {file ? file.name : t('dialogs.title')}
      </DialogHeader>

      <div className="flex h-full flex-col gap-6 md:flex-row">
        <div className="relative flex h-full w-full flex-col md:w-3/5">
          {!file ? (
            <div
              className="bg-muted/30 relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed p-12 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                accept="image/*,video/*,audio/*"
              />
              <Upload className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">{t('dialogs.dragAndDrop')}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{t('dialogs.browse')}</p>
              <Button variant="outline" size="sm" className="mt-2">
                {t('dialogs.selectFile')}
              </Button>
            </div>
          ) : (
            <div
              className={`bg-muted/30 relative flex h-full w-full overflow-hidden rounded-lg ${isEditingFocalPoint ? 'cursor-crosshair' : ''}`}
              onClick={handleImageClick}
            >
              {file?.preview ? (
                <div className="relative h-full w-full">
                  <img
                    src={file.preview || '/placeholder.svg'}
                    alt={file.name}
                    className="absolute left-0 top-0 h-full w-full object-contain"
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
                    {file.focalPoint && (
                      <span className="text-muted-foreground text-xs">
                        x: {file.focalPoint.x.toFixed(2)}, y: {file.focalPoint.y.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {file.focalPoint && (
                    <div
                      className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white shadow-lg ${
                        isEditingFocalPoint ? 'animate-pulse bg-blue-500/70' : 'bg-primary/70'
                      }`}
                      style={{
                        left: `${file.focalPoint.x * 100}%`,
                        top: `${file.focalPoint.y * 100}%`,
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
          )}
        </div>
        <div className="flex w-full flex-col md:w-2/5">
          <Card className="bg-card flex w-full flex-col border p-4 shadow-sm">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">{t('dialogs.details')}</h3>
            {file ? (
              <ScrollArea className="h-[450px] w-full overflow-auto pr-4">
                <div className="space-y-3">
                  {file && (
                    <>
                      <div className="group">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs font-medium capitalize">
                            {t('detailsTable.name')}
                          </span>
                          <div>
                            <Input value={file.name} onChange={handleNameChange} className="text-sm" />
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2 opacity-50" />
                      <div className="group">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs font-medium capitalize">
                            {t('detailsTable.fileSize')}
                          </span>
                          <div>
                            <span className="break-words text-sm">{formatFileSize(file.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2 opacity-50" />
                      <div className="group">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs font-medium capitalize">
                            {t('detailsTable.type')}
                          </span>
                          <div>
                            <span className="break-words text-sm">{file.type}</span>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2 opacity-50" />
                      <div className="group">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs font-medium capitalize">
                            {t('detailsTable.tags')}
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(file.tags || []).length ? (
                              (file.tags || []).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="flex items-center gap-1 text-xs">
                                  {tag}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
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
                              onKeyDown={handleKeyDown}
                              placeholder={t('dialogs.addTag')}
                              className="text-sm"
                            />
                            <Button size="sm" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                              <TagIcon className="mr-1 h-4 w-4" />
                              {t('dialogs.add')}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-2 opacity-50" />
                      <div className="group">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs font-medium capitalize">
                            {t('dialogs.focal')}
                          </span>
                          {file.focalPoint ? (
                            <span className="bg-muted rounded px-2 py-1 font-mono text-sm">
                              x: {file.focalPoint.x.toFixed(2)}, y: {file.focalPoint.y.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">{t('dialogs.noFocal')}</span>
                          )}
                        </div>
                      </div>
                      <Separator className="my-2 opacity-50" />
                      <EntityCustomFields entityName="asset" hideButton withoutBorder />
                    </>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <p>{t('dialogs.noFile')}</p>
            )}
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-2">
        <Button onClick={onClose} variant="outline" className="px-4" disabled={isUploading}>
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} variant="default" className="px-6" disabled={isUploading || !file}>
          {isUploading ? t('uploading') : t('upload')}
        </Button>
      </div>
    </div>
  );
}
