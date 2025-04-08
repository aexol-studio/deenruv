import { useTranslation, Input, Label, CustomCard, CardIcons, RichTextEditor } from '@deenruv/react-ui-devkit';
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
  const { t } = useTranslation('promotions');

  return (
    <CustomCard title={t('basicInfo.header')} color="blue" icon={<CardIcons.basic />}>
      <div className="flex flex-1 flex-col gap-y-4">
        <div className="flex gap-3">
          <Input
            label={t('basicInfo.name')}
            placeholder={t('basicInfo.name')}
            value={currentTranslationValue?.name ?? undefined}
            onChange={(e) => onChange('name', e.target.value)}
            errors={errors}
          />
        </div>
        <div className="flex basis-full flex-col">
          <Label className="mb-2">{t('basicInfo.description')}</Label>
          <RichTextEditor
            content={currentTranslationValue?.description ?? undefined}
            onContentChanged={(value) => onChange('description', value)}
          />
        </div>
      </div>
    </CustomCard>
  );
};
