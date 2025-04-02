import { Input, Label, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
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
  const { t } = useTranslation('promotions');

  return (
    <CustomCard title={t('basicInfo.header')} color="blue" icon={<CardIcons.basic />}>
      <Stack column className="flex-1 gap-y-4">
        <Stack className="gap-3">
          <Input
            label={t('basicInfo.name')}
            placeholder={t('basicInfo.name')}
            value={currentTranslationValue?.name ?? undefined}
            onChange={(e) => onChange('name', e.target.value)}
            errors={errors}
          />
        </Stack>
        <Stack column className="basis-full">
          <Label className="mb-2">{t('basicInfo.description')}</Label>
          <RichTextEditor
            content={currentTranslationValue?.description ?? undefined}
            onContentChanged={(value) => onChange('description', value)}
          />
        </Stack>
      </Stack>
    </CustomCard>
  );
};
