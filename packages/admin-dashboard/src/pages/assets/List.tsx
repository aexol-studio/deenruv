'use client';

import type React from 'react';

import { useState } from 'react';
import { type ItemsPerPageType, useList } from '@/lists/useList';
import { $, type ResolverInputTypes, SortOrder } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Badge,
  Button,
  Card,
  ScrollArea,
  Separator,
  apiClient,
  apiUploadClient,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ListBadge,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { FileUp, ImageOff, Trash2, Upload, X, Filter, LayoutGrid, List } from 'lucide-react';
import { Stack, Search } from '@/components';
import { Asset } from './_components/Asset.js';
import { UploadProgress } from './_components/UploadProgress.js';
import { AssetListView } from './_components/AssetListView.js';

const ITEMS_PER_PAGE: ItemsPerPageType = [
  { name: '32perPage', value: 32 },
  { name: '48perPage', value: 48 },
  { name: '64perPage', value: 64 },
];

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const validateFiles = (files: File[]) => {
  return files.filter((f) => !allowedTypes.includes(f.type));
};

const getAssets = async (options: ResolverInputTypes['AssetListOptions']) => {
  const response = await apiClient('query')({
    assets: [
      { options },
      {
        totalItems: true,
        items: { id: true, name: true, preview: true },
      },
    ],
  });
  return response.assets;
};

export function AssetsListPage() {
  const {
    objects: assets,
    Paginate,
    setFilter,
    setFilterField,
    setFilterLogicalOperator,
    removeFilterField,
    optionInfo,
    refetch,
  } = useList({
    route: async ({ page, perPage, sort, filter, filterOperator }) =>
      getAssets({
        take: perPage,
        skip: (page - 1) * perPage,
        filterOperator: filterOperator,
        sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
        ...(filter && { filter }),
      }),
    listType: 'assets',
    customItemsPerPage: ITEMS_PER_PAGE,
  });

  const { t } = useTranslation(['common', 'assets']);
  const [assetsToUpload, setAssetsToUpload] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const setUploadAssets = (files: File[]) => {
    setAssetsToUpload((prev) => [...prev, ...files]);
  };

  const uploadAssets = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input: ResolverInputTypes['CreateAssetInput'][] = assetsToUpload.map((file) => ({ file }));
    try {
      setIsUploading(true);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

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

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);

        if (createAssets.length > 0 && 'id' in createAssets[0]) {
          toast.success(t('assets:createSuccess') + createAssets[0].id);
          setAssetsToUpload([]);
          refetch();
        } else throw new Error(t('assets:createFailed'));
      }, 500);
    } catch (e) {
      console.error(e);
      toast.error(t('assets:createFailed'));
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const invalidFiles = validateFiles(files);
    if (invalidFiles.length > 0) {
      toast.error(t('assets:invalidFileTypes'));
      return;
    }
    setUploadAssets(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast.info(t('assets:noFilesSelected'));
      return;
    }
    const files = Array.from(e.target.files);
    const invalidFiles = validateFiles(files);
    if (invalidFiles.length > 0) {
      toast.error(t('assets:invalidFileTypes'));
      return;
    }
    setUploadAssets(files);
  };

  const clearAssets = () => {
    setAssetsToUpload([]);
  };

  const removeAsset = (fileName: string) => {
    setAssetsToUpload((prev) => prev.filter((a) => a.name !== fileName));
  };

  return (
    <main className="bg-background min-h-screen w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-3xl font-bold tracking-tight">{t('assets:title', 'Assets')}</h1>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5">
                <Filter size={16} />
                {t('common:filters', 'Filters')}
              </Button>

              <div className="flex rounded-md border p-0.5">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid size={16} />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List size={16} />
                  <span className="sr-only">List view</span>
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="browse">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="browse">Browse Assets</TabsTrigger>
              <TabsTrigger value="upload">Upload Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-4">
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-6 overflow-hidden"
                  >
                    <Card className="p-4">
                      <Search
                        filter={optionInfo.filter}
                        type="AssetFilterParameter"
                        setFilter={setFilter}
                        setFilterField={setFilterField}
                        removeFilterField={removeFilterField}
                        setFilterLogicalOperator={setFilterLogicalOperator}
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assets Grid/List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-[50vh]"
              >
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {assets?.length ? (
                      assets.map((asset) => <Asset key={asset.id} asset={asset} onAssetChange={refetch} />)
                    ) : (
                      <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center text-center">
                        <div className="bg-muted/50 mb-4 rounded-full p-6">
                          <ImageOff size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No assets found</h3>
                        <p className="text-muted-foreground mt-2 text-sm">
                          Upload some assets or try a different filter
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <AssetListView assets={assets || []} onAssetChange={refetch} />
                )}
              </motion.div>

              {/* Pagination */}
              <div className="mt-8">{Paginate}</div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <Card className="overflow-hidden">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex min-h-[300px] cursor-pointer items-center justify-center rounded-t-lg border-2 border-dashed p-10 transition-all duration-200 ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/20 bg-muted/5 hover:bg-muted/10'
                  }`}
                >
                  <input
                    multiple
                    id="file"
                    type="file"
                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleFileChange}
                    accept={allowedTypes.join(',')}
                  />
                  <Stack column className="items-center justify-center gap-4">
                    <div className="bg-primary/10 rounded-full p-6">
                      <FileUp size={36} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-medium">
                        {t('assets:dropzone', 'Drop files here or click to upload')}
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        {t('assets:allowedTypes', 'Supported formats')}: JPEG, PNG, GIF, WEBP
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">Maximum file size: 10MB</p>
                    </div>
                  </Stack>
                </div>

                <AnimatePresence>
                  {assetsToUpload.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t"
                    >
                      <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ListBadge variant="secondary">
                              {assetsToUpload.length} {t('assets:filesSelected', 'files selected')}
                            </ListBadge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={clearAssets} className="gap-1.5">
                              <Trash2 size={16} />
                              {t('common:clear', 'Clear')}
                            </Button>
                            <Button
                              disabled={!assetsToUpload.length || isUploading}
                              onClick={uploadAssets}
                              className="gap-1.5"
                            >
                              <Upload size={16} />
                              {isUploading ? t('common:uploading', 'Uploading...') : t('common:upload', 'Upload')}
                            </Button>
                          </div>
                        </div>

                        {isUploading && <UploadProgress progress={uploadProgress} />}

                        <Separator className="my-4" />

                        <ScrollArea className="max-h-[400px] overflow-auto pr-4">
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {assetsToUpload.map((file) => {
                              let blob = undefined;
                              try {
                                blob = URL.createObjectURL(file);
                              } catch (e) {
                                console.error(e);
                              }

                              return (
                                <div
                                  key={file.name}
                                  className="bg-background group relative overflow-hidden rounded-lg border transition-all hover:shadow-md"
                                >
                                  <button
                                    type="button"
                                    onClick={() => removeAsset(file.name)}
                                    className="bg-background/80 hover:bg-destructive hover:text-destructive-foreground absolute right-1 top-1 z-10 rounded-full p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                                    aria-label="Remove file"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="bg-muted/30 aspect-square p-2">
                                    {blob ? (
                                      <img
                                        src={blob || '/placeholder.svg'}
                                        alt={file.name}
                                        className="h-full w-full rounded object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center">
                                        <ImageOff size={24} className="text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <p className="truncate text-sm font-medium" title={file.name}>
                                      {file.name}
                                    </p>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
