import { useState } from 'react';
import { ItemsPerPageType, useList } from '@/lists/useList';
import { $, ResolverInputTypes } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, apiClient, apiUploadClient } from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { FileUp, ImageOff, XIcon } from 'lucide-react';
import { Stack, Search } from '@/components';
import { Asset } from './_components/Asset';

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

export const AssetsListPage = () => {
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
    route: async (p) => getAssets({ take: 32, skip: (p.page - 1) * 32 }),
    listType: 'assets',
    customItemsPerPage: ITEMS_PER_PAGE,
  });
  const { t } = useTranslation(['common', 'assets']);
  const [assetsToUpload, setAssetsToUpload] = useState<File[]>([]);

  const setUploadAssets = (files: File[]) => {
    setAssetsToUpload((prev) => [...prev, ...files]);
  };

  const uploadAssets = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input: ResolverInputTypes['CreateAssetInput'][] = assetsToUpload.map((file) => ({ file }));
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

      if (createAssets.length > 0 && 'id' in createAssets[0]) {
        toast.info(t('assets:createSuccess') + createAssets[0].id);
        setAssetsToUpload([]);
        refetch();
      } else throw new Error(t('assets:createFailed'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main>
      <form
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const invalidFiles = validateFiles(files);
          if (invalidFiles.length > 0) {
            toast.error(t('assets:invalidFileTypes'));
            return;
          }
          setUploadAssets(files);
        }}
        className="relative flex items-center justify-center border-2 border-dashed bg-gray-50 p-10 dark:bg-gray-900 dark:text-white"
      >
        <input
          multiple
          id="file"
          type="file"
          className="absolute left-0 top-0 h-full w-full opacity-0"
          onChange={(e) => {
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
          }}
        />
        <Stack column className="items-center justify-center gap-4">
          <FileUp size={42} className="text-gray dark:text-white" />
          <h3 className="text-lg">{t('assets:dropzone')}</h3>
        </Stack>
        <AnimatePresence>
          {assetsToUpload.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-secondary absolute bottom-0 right-0 flex items-center gap-3 rounded-tl-xl px-5 py-3"
            >
              <span className="mr-3">
                {assetsToUpload.length} {t('assets:filesSelected')}
              </span>
              <Button
                variant="outline"
                size={'sm'}
                onClick={() => {
                  setAssetsToUpload([]);
                }}
              >
                {t('common:clear')}
              </Button>
              <Button disabled={!assetsToUpload.length} onClick={uploadAssets}>
                {t('common:upload')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      {!!assetsToUpload.length && (
        <div className="bg-secondary flex w-full justify-between rounded-b-xl px-4 py-6">
          <div className="flex flex-1 gap-3">
            {assetsToUpload.map((f) => {
              let blob = undefined;
              try {
                blob = URL.createObjectURL(f);
              } catch (e) {
                console.error(e);
              }

              return (
                <div key={f.name} className="relative grid w-[12.5%] flex-col items-center gap-2 rounded bg-white p-2">
                  <div className="absolute right-0 top-0 z-10">
                    <Button
                      size={'sm'}
                      className="h-[32px] w-[32px] bg-red-600 p-2"
                      onClick={() => {
                        setAssetsToUpload((prev) => prev.filter((a) => a.name !== f.name));
                      }}
                    >
                      <XIcon />
                    </Button>
                  </div>
                  {blob ? (
                    <div className="relative h-20 w-20">
                      <img className="absolute left-0 top-0 h-full w-full" src={blob} />
                    </div>
                  ) : (
                    <div className="h-20 w-20">
                      <ImageOff />
                    </div>
                  )}
                  <div className="truncate whitespace-nowrap text-sm">{f.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="mt-8">
        <Search
          filter={optionInfo.filter}
          type="AssetFilterParameter"
          setFilter={setFilter}
          setFilterField={setFilterField}
          removeFilterField={removeFilterField}
          setFilterLogicalOperator={setFilterLogicalOperator}
        />
      </div>
      <motion.div className="relative my-6 flex flex-col">
        <div className="grid min-h-[50vh] grid-cols-8 gap-2">
          {assets?.map((a) => <Asset key={a.id} asset={a} onAssetChange={refetch} />)}
        </div>
      </motion.div>
      {Paginate}
    </main>
  );
};
