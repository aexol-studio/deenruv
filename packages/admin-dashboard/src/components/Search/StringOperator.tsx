import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const stringOperatorOptions = ['eq', 'notEq', 'contains', 'notContains', 'regex'] as const;

interface Props {
  onSubmit: (filterType: string, value: string) => void;
  currentValue?: ModelTypes['StringOperators'] | null;
}

export const StringOperator: React.FC<Props> = ({ onSubmit, currentValue }) => {
  const { t } = useTranslation('common');
  const [type, setType] = useState<string | undefined>(
    currentValue ? (Object.keys(currentValue)[0] as string) : undefined,
  );
  const [value, setValue] = useState<string>(currentValue ? (Object.values(currentValue)[0] as string) : '');

  return (
    <div className="flex flex-col gap-2">
      <Label>{t('search.filterType')}</Label>
      <Select value={type} onValueChange={(e) => setType(e)}>
        <SelectTrigger>
          <SelectValue placeholder={t('search.selectType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stringOperatorOptions.map((i, index) => (
              <SelectItem key={index} value={i}>
                {t(`search.operator.${i}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label htmlFor="string-input">{t('search.value')}</Label>
      <Input id="string-input" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <Button
        disabled={!type || !value}
        onClick={() => type && value && onSubmit(type, value)}
        variant="outline"
        className="w-fit self-end"
      >
        {t('search.apply')}
      </Button>
    </div>
  );
};
