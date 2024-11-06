import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Label, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { Stack } from '@/components';

interface ModalCardProps {
  currentTranslationValue: any;
  onValuesChange: (customFields: any) => void;
  // currentTranslationValue: ModelTypes['PaymentMethodTranslationCustomFields'] | undefined;
  // onValuesChange: (customFields: ModelTypes['PaymentMethodTranslationCustomFields']) => void;
}

export const ModalCard: React.FC<ModalCardProps> = ({ currentTranslationValue, onValuesChange }) => {
  const { t } = useTranslation('paymentMethods');

  const handleChange = useCallback(
    (customField: string, e: string) => {
      onValuesChange({
        ...currentTranslationValue,
        [customField]: e,
      });
    },
    [currentTranslationValue, onValuesChange],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.modal.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Stack className="basis-full md:basis-1/2">
          <Input
            label={t('details.modal.name')}
            value={currentTranslationValue?.modalTitle}
            onChange={(e) => handleChange('modalTitle', e.target.value)}
            required
          />
        </Stack>
        <Stack column className="basis-full">
          <Label className="mb-2">{t('details.modal.description')}</Label>
          <RichTextEditor
            content={currentTranslationValue?.modalDescription}
            onContentChanged={(e) => handleChange('modalDescription', e)}
          />
        </Stack>
        <Stack column className="basis-full">
          <Label className="mb-2">{t('details.modal.additionalDescription')}</Label>
          <RichTextEditor
            content={currentTranslationValue?.modalAdditionalDescription}
            onContentChanged={(e) => handleChange('modalAdditionalDescription', e)}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
