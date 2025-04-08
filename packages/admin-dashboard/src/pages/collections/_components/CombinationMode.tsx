import { useTranslation, Label, ToggleGroup, ToggleGroupItem } from '@deenruv/react-ui-devkit';
import React from 'react';

interface CombinationModeProps {
  label: string;
  value: string;
  onChange: (e: string) => void;
}

export const CombinationMode: React.FC<CombinationModeProps> = ({ label, value, onChange }) => {
  const { t } = useTranslation('collections');
  return (
    <div className="flex basis-full flex-col gap-3">
      <Label>{label}</Label>
      <ToggleGroup type="single" value={value} onValueChange={onChange} className=" justify-start">
        <ToggleGroupItem variant={'outline'} size={'sm'} value={'true'}>
          {t('details.filters.labels.arguments.and')}
        </ToggleGroupItem>
        <ToggleGroupItem variant={'outline'} size={'sm'} value={'false'}>
          {t('details.filters.labels.arguments.or')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
