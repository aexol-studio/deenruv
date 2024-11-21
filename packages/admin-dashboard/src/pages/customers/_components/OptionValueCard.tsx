import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import { ProductOptionType } from '@/graphql/products';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { apiCall } from '@/graphql/client';
import { toast } from 'sonner';
import { LanguageCode } from '@deenruv/admin-types';
import { Stack } from '@/components';

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
          { id: true },
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
        </Stack>
        <Button size={'sm'} className="mt-4" onClick={editOption}>
          {t('editOption')}
        </Button>
      </CardContent>
    </Card>
  );
};
