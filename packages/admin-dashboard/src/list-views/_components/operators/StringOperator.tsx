import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FilterInputType } from '../types';
import { ArrayInput } from './ArrayInput';
import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@deenruv/react-ui-devkit';

type StringOperator = Omit<FilterInputType['StringOperators'], '__typename'>;
const ARRAY_TYPES = ['in', 'notIn'] as (keyof StringOperator)[];
const TYPES = ['eq', 'notEq', 'in', 'notIn', 'contains', 'notContains', 'regex', 'isNull'] as (keyof StringOperator)[];

type Props<T extends StringOperator> = {
  currentValue?: T;
  onSubmit: (value: T) => void;
};

export const StringOperator: React.FC<Props<StringOperator>> = ({ currentValue, onSubmit }) => {
  const { t } = useTranslation('table');
  const defaultType = currentValue ? (Object.keys(currentValue)[0] as keyof StringOperator) : 'eq';
  const [type, setType] = useState(defaultType);
  const [value, setValue] = useState<string | string[] | boolean | undefined>(() => {
    if (
      !currentValue ||
      (currentValue && Object.keys(currentValue).length && !Object.keys(Object.values(currentValue)[0]).length)
    )
      return undefined;
    if (ARRAY_TYPES.includes(type)) return (Object.values(currentValue)[0] as string[]).join(',');
    else return currentValue[defaultType] as string;
  });
  useEffect(() => {
    if (!currentValue || !type) return;
    setValue(currentValue[type as keyof StringOperator] as string);
  }, [currentValue, type]);
  console.log('StringOperator', { currentValue, type, value });
  return (
    <div className="flex flex-col gap-2">
      <Label>{t('types.filter')}</Label>
      <Select value={type as string} onValueChange={(e) => setType(e as keyof StringOperator)}>
        <SelectTrigger>
          <SelectValue placeholder={t('types.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {TYPES.map((i, index) => (
              <SelectItem key={index} value={i}>
                {t(`operators.${i}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label htmlFor="string-input">{t('placeholders.operatorInput')}</Label>
      {type === 'isNull' ? (
        <Checkbox checked={!!value} onCheckedChange={(e) => setValue(!!e)}>
          {t('operators.isNull')}
        </Checkbox>
      ) : ARRAY_TYPES.includes(type) ? (
        <ArrayInput
          type="string"
          value={Array.isArray(value) && value.length ? value : []}
          onChange={(e) => {
            if (Array.isArray(e)) setValue(e);
            else setValue([e.target.value]);
          }}
        />
      ) : (
        <Input id="string-input" value={value as string} onChange={(e) => setValue(e.currentTarget.value)} />
      )}
      <Button
        disabled={!type || !value}
        onClick={() => {
          if (!type || !value) return;
          onSubmit({ [type as keyof StringOperator]: value });
        }}
        variant="outline"
        className="w-fit self-end"
      >
        {t('buttons.apply')}
      </Button>
    </div>
  );
};
