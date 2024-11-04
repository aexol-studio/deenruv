import { Label, Stack, ToggleGroup, ToggleGroupItem } from '@/components';
import React from 'react';

interface CombinationModeProps {
  label: string;
  value: string;
  onChange: (e: string) => void;
}

export const CombinationMode: React.FC<CombinationModeProps> = ({ label, value, onChange }) => {
  return (
    <Stack column className="basis-full gap-3">
      <Label>{label}</Label>
      <ToggleGroup type="single" value={value} onValueChange={onChange} className=" justify-start">
        <ToggleGroupItem variant={'outline'} size={'sm'} value={'true'}>
          AND
        </ToggleGroupItem>
        <ToggleGroupItem variant={'outline'} size={'sm'} value={'false'}>
          OR
        </ToggleGroupItem>
      </ToggleGroup>
    </Stack>
  );
};
