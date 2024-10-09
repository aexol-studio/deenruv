import { AssetsModalChangeType, AssetsModalInput, Input, Label, Stack } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AssetType, assetsSelector } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { ModelTypes } from '@/zeus';
import { ImageOff } from 'lucide-react';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SeoCardProps {
  currentTranslationValue: Partial<ModelTypes['Product']['translations'][0]> | undefined;
  facebookImageId: string | undefined;
  twitterImageId: string | undefined;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFacebookImageChange: (e: AssetsModalChangeType | undefined) => void;
  onTwitterImageChange: (e: AssetsModalChangeType | undefined) => void;
}

export const SeoCard: React.FC<SeoCardProps> = ({
  currentTranslationValue,
  facebookImageId,
  twitterImageId,
  onTitleChange,
  onDescriptionChange,
  onFacebookImageChange,
  onTwitterImageChange,
}) => {
  const { t } = useTranslation('products');
  const [facebookImage, setFacebookImage] = useState<AssetType>();
  const [twitterImage, setTwitterImage] = useState<AssetType>();

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
    if (facebookImageId) getAsset(facebookImageId).then((a) => setFacebookImage(a));
  }, [facebookImageId, getAsset]);

  useEffect(() => {
    if (twitterImageId) getAsset(twitterImageId).then((a) => setTwitterImage(a));
  }, [twitterImageId, getAsset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('seo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="gap-6">
          <Stack className="gap-3">
            <Input
              label={t('customFields.seo.title')}
              placeholder={t('customFields.seo.title')}
              value={currentTranslationValue?.customFields?.seoTitle}
              onChange={onTitleChange}
            />
            <Input
              label={t('customFields.seo.description')}
              placeholder={t('customFields.seo.description')}
              value={currentTranslationValue?.customFields?.seoDescription}
              onChange={onDescriptionChange}
            />
          </Stack>
          <Stack className="justify-between gap-3">
            <div className="w-1/2">
              <Label htmlFor="email">{t('customFields.seo.facebookImage')}</Label>
              <Stack className="border-grey-500 gap-4 border-t pt-3">
                <div className="flex h-36 min-w-36 items-center justify-center border border-solid border-gray-300 p-2 shadow">
                  {facebookImage?.source ? (
                    <img src={facebookImage?.source} className="h-32" alt="Facet image preview" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 p-3">
                      <ImageOff size={24} />
                    </div>
                  )}
                </div>
                <AssetsModalInput setValue={onFacebookImageChange} />
              </Stack>
            </div>
            <div className="w-1/2">
              <Label htmlFor="email">{t('customFields.seo.twitterImage')}</Label>
              <Stack className="border-grey-500 gap-4 border-t pt-3">
                <div className="flex h-36 min-w-36 items-center justify-center border border-solid border-gray-300 p-2 shadow">
                  {twitterImage?.source ? (
                    <img src={twitterImage?.source} className="h-32" alt="Facet image preview" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 p-3">
                      <ImageOff size={24} />
                    </div>
                  )}
                </div>
                <AssetsModalInput setValue={onTwitterImageChange} />
              </Stack>
            </div>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
