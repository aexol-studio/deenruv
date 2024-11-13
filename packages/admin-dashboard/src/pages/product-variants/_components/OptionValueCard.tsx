import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Input, Label, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import { ProductOptionType } from '@/graphql/products';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { apiCall } from '@/graphql/client';
import { toast } from 'sonner';
import { LanguageCode } from '@deenruv/admin-types';
import { ColorSample } from '@/pages/facets/_components/ColorSample';
import { AssetType, assetsSelector } from '@/graphql/base';
import { ImageOff } from 'lucide-react';
import { AssetsModalInput, Stack } from '@/components';

interface OptionValueCardProps {
  productOption: ProductOptionType;
  currentTranslationLng: LanguageCode;
  onEdited: () => void;
}

export const OptionValueCard: React.FC<OptionValueCardProps> = ({ productOption, onEdited, currentTranslationLng }) => {
  const { t } = useTranslation('products');
  const { state, setField } = useGFFLP('UpdateProductOptionInput', 'code', 'translations', 'customFields')({});
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);
  const [image, setImage] = useState<AssetType>();

  useEffect(() => {
    setField('code', productOption.code);
    setField('translations', productOption.translations);
    // setField('customFields', {
    //   hexColor: productOption.customFields?.hexColor,
    //   isHidden: productOption.customFields?.isHidden,
    //   isNew: productOption.customFields?.isNew,
    //   imageId: productOption.customFields?.image?.id,
    // });
  }, [productOption, setField]);

  const setCustomField = useCallback(
    (customField: string, e: string | boolean | undefined) => {
      setField('customFields', {
        ...state.customFields?.value,
        [customField]: e,
      });
    },
    [state.customFields],
  );

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
    if (state.customFields?.value?.imageId) getAsset(state.customFields?.value?.imageId).then((a) => setImage(a));
  }, [state.customFields?.value?.imageId, getAsset]);

  const editOption = useCallback(() => {
    if (productOption.id)
      return apiCall()('mutation')({
        updateProductOption: [
          {
            input: {
              id: productOption.id,
              code: state.code?.validatedValue,
              customFields: state.customFields?.validatedValue,
              translations: state.translations?.validatedValue,
            },
          },
          {
            id: true,
          },
        ],
      })
        .then(() => {
          toast(t('toasts.updateOptionSuccessToast'));
          onEdited();
        })
        .catch(() => {
          toast(t('toasts.updateOptionErrorToast'));
        });
  }, [state, productOption, t, onEdited]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{productOption.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack className="justify-between gap-6">
          <Stack column className="basis-1/3 gap-3">
            <Input
              label="name"
              value={currentTranslationValue?.name}
              onChange={(e) => {
                setField(
                  'translations',
                  setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
                    name: e.target.value,
                    languageCode: currentTranslationLng,
                  }),
                );
              }}
            />
            <Input
              label="code"
              value={state.code?.value}
              onChange={(e) => {
                setField('code', e.target.value);
              }}
            />
          </Stack>
          <Stack column className="basis-1/6 justify-center gap-6 pt-3">
            <Stack className="gap-2">
              <Checkbox
                checked={state.customFields?.value?.isNew}
                onCheckedChange={(e) => setCustomField('isNew', e)}
              />
              <Label>{t('isNew')}</Label>
            </Stack>
            <Stack className="gap-2">
              <Checkbox
                checked={state.customFields?.value?.isHidden}
                onCheckedChange={(e) => setCustomField('isHidden', e)}
              />
              <Label>{t('isHidden')}</Label>
            </Stack>
            <Stack className="relative items-center gap-2">
              <ColorSample
                small
                color={state.customFields?.value?.hexColor}
                setColor={(color) => setCustomField('hexColor', color)}
              />
              <Label>{t('color')}</Label>
            </Stack>
          </Stack>
          <Stack className="basis-1/3 justify-center gap-6 pt-3">
            <div className="flex h-32 min-w-32 items-center justify-center border border-solid border-gray-300 p-2 shadow">
              {state.customFields?.value?.imageId ? (
                <img src={image?.preview} className="h-28" alt="Main image preview" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-200 p-3">
                  <ImageOff size={24} />
                  {t('details.noFeaturedAsset')}
                </div>
              )}
            </div>
            <AssetsModalInput
              setValue={(a) =>
                setField('customFields', {
                  ...state.customFields?.value,
                  imageId: a?.id,
                })
              }
            />
          </Stack>
        </Stack>
        <Button size={'sm'} className="mt-4" onClick={editOption}>
          {t('editOption')}
        </Button>
      </CardContent>
    </Card>
  );
};
