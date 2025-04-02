import { Input, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
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
    <CustomCard title={t('details.basicInfo')} icon={<CardIcons.basic />} color="blue">
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
    </CustomCard>
  );
};
