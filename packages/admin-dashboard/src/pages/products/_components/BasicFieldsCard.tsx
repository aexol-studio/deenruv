import { Input, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';

interface BasicFieldsCardProps {
  currentTranslationLng: LanguageCode;
  currentTranslationValue: Partial<ModelTypes['Product']['translations'][0]> | undefined;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDescChange: (e: string) => void;
}

export const BasicFieldsCard: React.FC<BasicFieldsCardProps> = ({
  currentTranslationLng,
  currentTranslationValue,
  onNameChange,
  onSlugChange,
  onDescChange,
}) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.basicInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="flex-1 gap-y-4">
          <Stack className="gap-3">
            <Input
              label={t('name')}
              placeholder={t('name')}
              key={currentTranslationLng}
              value={currentTranslationValue?.name}
              onChange={onNameChange}
            />
            <Input
              key={currentTranslationLng + 'slug'}
              value={currentTranslationValue?.slug}
              label={t('slug')}
              placeholder={t('slug')}
              onChange={onSlugChange}
            />
          </Stack>
          <RichTextEditor content={currentTranslationValue?.description} onContentChanged={onDescChange} />
        </Stack>
      </CardContent>
    </Card>
  );
};
