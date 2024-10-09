import { AssetsModalChangeType, AssetsModalInput, Label, Stack } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProductDetailType } from '@/graphql/products';
import { ImageOff } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ImagesCardProps {
  customFields: ProductDetailType['customFields'];
  onMainImageChange: (e: AssetsModalChangeType | undefined) => void;
  onHoverImageChange: (e: AssetsModalChangeType | undefined) => void;
}

export const ImagesCard: React.FC<ImagesCardProps> = ({ customFields, onMainImageChange, onHoverImageChange }) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.image')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="gap-6">
          <Stack className="justify-between gap-3">
            <div className="w-1/2">
              <Label>{t('customFields.images.mainImage')}</Label>
              <Stack className="border-grey-500 gap-4 border-t pt-3">
                <div className="flex h-36 min-w-36 items-center justify-center border border-solid border-gray-300 p-2 shadow">
                  {customFields?.mainProductImage?.source ? (
                    <img src={customFields?.mainProductImage.source} className="h-32" alt="Main image preview" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 p-3">
                      <ImageOff size={24} />
                    </div>
                  )}
                </div>
                <AssetsModalInput setValue={onMainImageChange} />
              </Stack>
            </div>
            <div className="w-1/2">
              <Label>{t('customFields.images.hoverImage')}</Label>
              <Stack className="border-grey-500 gap-4 border-t pt-3">
                <div className="flex h-36 min-w-36 items-center justify-center border border-solid border-gray-300 p-2 shadow">
                  {customFields?.hoverProductImage?.source ? (
                    <img src={customFields?.hoverProductImage?.source} className="h-32" alt="Hover image preview" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 p-3">
                      <ImageOff size={24} />
                    </div>
                  )}
                </div>
                <AssetsModalInput setValue={onHoverImageChange} />
              </Stack>
            </div>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
