import { Input, Card, CardHeader, CardTitle, CardContent, Label } from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { ModelTypes } from '@deenruv/admin-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';

interface BasicFieldsCardProps {
  currentTranslationValue: Partial<ModelTypes['Product']['translations'][0]> | undefined;
  onChange: (field: 'name' | 'slug' | 'description', value: string) => void;
}

export const BasicFieldsCard: React.FC<BasicFieldsCardProps> = ({ currentTranslationValue, onChange }) => {
  const { t } = useTranslation('promotions');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('basicInfo.header')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="flex-1 gap-y-4">
          <Stack className="gap-3">
            <Input
              label={t('basicInfo.name')}
              placeholder={t('basicInfo.name')}
              value={currentTranslationValue?.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </Stack>
          <Stack column className="basis-full">
            <Label className="mb-2">{t('basicInfo.description')}</Label>
            <RichTextEditor
              content={currentTranslationValue?.description}
              onContentChanged={(value) => onChange('description', value)}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
