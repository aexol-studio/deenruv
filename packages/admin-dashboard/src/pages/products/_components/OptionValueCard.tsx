import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  apiClient,
  useGFFLP,
  setInArrayBy,
  EntityCustomFields,
  useTranslation,
  CF,
} from '@deenruv/react-ui-devkit';
import { ProductOptionType } from '@/graphql/products';

import { toast } from 'sonner';
import { LanguageCode } from '@deenruv/admin-types';

interface OptionValueCardProps {
  productOption: ProductOptionType;
  currentTranslationLng: LanguageCode;
  optionGroupId: string;
  onEdited: () => void;
}

export const OptionValueCard: React.FC<OptionValueCardProps> = ({
  productOption,
  onEdited,
  currentTranslationLng,
  optionGroupId,
}) => {
  const { t } = useTranslation('products');
  const { state, setField } = useGFFLP('UpdateProductOptionInput', 'code', 'translations', 'customFields')({});
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    setField('code', productOption.code);
    setField('translations', productOption.translations);
    if ('customFields' in productOption) {
      setField('customFields', productOption.customFields as CF);
    }
  }, [productOption]);

  const editOption = useCallback(() => {
    if (productOption.id) {
      console.log('INPUT', {
        id: productOption.id,
        code: state.code?.validatedValue,
        customFields: state.customFields?.validatedValue,
        translations: state.translations?.validatedValue,
      });
      return apiClient('mutation')({
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
    }
  }, [state, productOption, t, onEdited]);

  return (
    <Card className="flex-grow basis-1/5">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{productOption.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <Input
              label="name"
              value={currentTranslationValue?.name ?? undefined}
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
              value={state.code?.value ?? undefined}
              onChange={(e) => {
                setField('code', e.target.value);
              }}
            />
            <EntityCustomFields
              entityName="productOption"
              withoutBorder
              id={productOption.id}
              currentLanguage={currentTranslationLng}
              initialValues={
                state && 'customFields' in state
                  ? { customFields: state.customFields?.validatedValue as any }
                  : { customFields: {} }
              }
              onChange={(cf) => {
                setField('customFields', cf);
              }}
              additionalData={{}}
            />
          </div>
        </div>
        <Button size={'sm'} className="mt-4" onClick={editOption}>
          {t('editOption')}
        </Button>
      </CardContent>
    </Card>
  );
};
