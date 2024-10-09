import {
  AssetsModalInput,
  DropdownMenuItem,
  Label,
  Stack,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AssetType, assetsSelector } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AssetsCardProps {
  assetsIds: string[] | undefined;
  featuredAssetId: string | undefined;
  onAddAsset: (id: string) => void;
  onFeaturedAssetChange: (id: string) => void;
  onAssetsChange: (ids: string[]) => void;
}

export const AssetsCard: React.FC<AssetsCardProps> = ({
  featuredAssetId,
  assetsIds,
  onAddAsset,
  onFeaturedAssetChange,
  onAssetsChange,
}) => {
  const { t } = useTranslation('products');
  const [featureAsset, setFeatureAsset] = useState<AssetType>();
  const [assets, setAssets] = useState<AssetType[]>([]);

  const getAsset = useCallback(async (id: string) => {
    const response = await apiCall()('query')({
      asset: [
        {
          id: id,
        },
        assetsSelector,
      ],
    });

    return response.asset;
  }, []);

  useEffect(() => {
    if (featuredAssetId) getAsset(featuredAssetId).then((a) => setFeatureAsset(a));
  }, [featuredAssetId, getAsset]);

  useEffect(() => {
    const promises: Promise<AssetType | undefined>[] = [];
    if (assetsIds) assetsIds.forEach((id) => promises.push(getAsset(id)));
    Promise.all(promises).then((assets) => {
      const existingAssets = assets.filter((item): item is NonNullable<AssetType> => item !== undefined);
      setAssets(existingAssets);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsIds]);

  const handleRemoveAsset = useCallback(
    (id: string) => {
      const newAssets = assetsIds?.filter((aId) => aId !== id);
      onAssetsChange(newAssets || []);
    },
    [assetsIds, onAssetsChange],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('assets')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="gap-6">
          <Stack className="gap-6">
            <div>
              <Label>{t('details.featuredAsset')}</Label>
              <Stack column className="pt-3">
                <div className="mb-4 flex h-36 min-w-36 items-center justify-center border border-solid border-gray-300 p-2 shadow">
                  {featureAsset?.preview ? (
                    <img src={featureAsset.preview} className="h-32" alt="Main image preview" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-200 p-3">
                      <ImageOff size={32} />
                      {t('details.noFeaturedAsset')}
                    </div>
                  )}
                </div>
                <AssetsModalInput setValue={(a) => onAddAsset(a!.id)} />
              </Stack>
            </div>
            <div>
              <Label>{t('details.otherAssets')}</Label>
              <Stack className="gap-3 pt-3">
                {assets?.length ? (
                  assets.map((a) => (
                    <DropdownMenu modal={false} key={a.id}>
                      <DropdownMenuTrigger asChild>
                        <div
                          className={cn(
                            'flex h-20 min-w-20 cursor-pointer items-center justify-center border border-solid border-gray-300 p-2 shadow',
                            a.id === featuredAssetId && 'border-2 border-blue-500',
                          )}
                        >
                          {a?.preview && <img src={a.preview} className="h-16" />}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" side="bottom" align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => onFeaturedAssetChange(a.id)}>
                            {t('details.setAsFeatured')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveAsset(a.id)}>
                            {t('details.removeAsset')}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))
                ) : (
                  <p>{t('details.noAssets')}</p>
                )}
              </Stack>
            </div>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
