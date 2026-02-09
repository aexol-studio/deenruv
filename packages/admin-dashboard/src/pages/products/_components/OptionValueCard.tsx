import React, { useCallback, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  apiClient,
  useDeenruvForm,
  z,
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

const optionValueSchema = z.object({
  code: z.string().default(''),
  translations: z
    .array(z.object({ name: z.string(), languageCode: z.string() }).passthrough())
    .default([]),
  customFields: z.record(z.string(), z.unknown()).optional().default({}),
});

export const OptionValueCard: React.FC<OptionValueCardProps> = ({
  productOption,
  onEdited,
  currentTranslationLng,
  optionGroupId,
}) => {
  const { t } = useTranslation('products');
  const form = useDeenruvForm({
    schema: optionValueSchema,
    defaultValues: { code: '', translations: [], customFields: {} },
  });
  const translations = form.watch('translations') || [];
  const codeValue = form.watch('code');
  const customFieldsValue = form.watch('customFields');
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    form.setField('code', productOption.code);
    form.setField('translations', productOption.translations);
    if ('customFields' in productOption) {
      form.setField('customFields', productOption.customFields as CF);
    }
  }, [productOption]);

  const editOption = useCallback(() => {
    if (productOption.id) {
      return apiClient('mutation')({
        updateProductOption: [
          {
            input: {
              id: productOption.id,
              code: codeValue,
              customFields: customFieldsValue,
              translations: translations as any,
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
  }, [codeValue, customFieldsValue, translations, productOption, t, onEdited]);

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
                form.setField(
                  'translations',
                  setInArrayBy(translations, (t) => t.languageCode === currentTranslationLng, {
                    name: e.target.value,
                    languageCode: currentTranslationLng,
                  }),
                );
              }}
            />
            <Input
              label="code"
              value={codeValue ?? undefined}
              onChange={(e) => {
                form.setField('code', e.target.value);
              }}
            />
            <EntityCustomFields
              entityName="productOption"
              withoutBorder
              id={productOption.id}
              currentLanguage={currentTranslationLng}
              initialValues={
                customFieldsValue
                  ? { customFields: customFieldsValue as any }
                  : { customFields: {} }
              }
              onChange={(cf) => {
                form.setField('customFields', cf);
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
