import { Input, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { ModelTypes } from '@deenruv/admin-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';

type PartialNull<T> = {
  [P in keyof T]?: T[P] | null;
};

interface BasicFieldsCardProps {
  currentTranslationValue: PartialNull<ModelTypes['Product']['translations'][0]> | undefined;
  onChange: (field: 'name' | 'slug' | 'description', value: string) => void;
  errors?: string[];
}

export const BasicFieldsCard: React.FC<BasicFieldsCardProps> = ({ currentTranslationValue, onChange, errors }) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.basicInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="flex-1 gap-y-4">
          <Stack className="items-start gap-3">
            <Input
              label={t('name')}
              placeholder={t('name')}
              value={currentTranslationValue?.name ?? ''}
              onChange={(e) => onChange('name', e.target.value)}
              errors={errors}
            />
            <Input
              value={currentTranslationValue?.slug ?? ''}
              label={t('slug')}
              placeholder={t('slug')}
              onChange={(e) => onChange('slug', e.target.value)}
            />
          </Stack>
          <RichTextEditor
            content={currentTranslationValue?.description ?? ''}
            onContentChanged={(value) => onChange('description', value)}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
