import { useTranslation, Input, CustomCard, CardIcons, RichTextEditor } from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import React from 'react';

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
      <div className="flex flex-1 flex-col gap-y-4">
        <div className="flex items-start gap-3">
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
        </div>
        <RichTextEditor
          content={currentTranslationValue?.description ?? ''}
          onContentChanged={(value) => onChange('description', value)}
        />
      </div>
    </CustomCard>
  );
};
