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
} from '@/components';
import { ModelTypes } from '@deenruv/admin-types';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const dateOperatorOptions = ['eq', 'lt', 'lte', 'gt', 'gte', 'between'] as const;

type NumberRange = { start: number; end: number };

function isNumberRange(data: undefined | number | NumberRange | boolean): data is NumberRange {
  return !!data && typeof data === 'object' && 'start' in data;
}

interface Props {
  onSubmit: (value: ModelTypes['NumberOperators']) => void;
  currentValue?: ModelTypes['NumberOperators'];
  isCurrency?: boolean;
}

export const NumberOperator: React.FC<Props> = ({ onSubmit, currentValue, isCurrency = false }) => {
  const { t } = useTranslation('common');
  const [type, setType] = useState<string | undefined>(
    currentValue ? (Object.keys(currentValue)[0] as string) : undefined,
  );
  const [value, setValue] = useState<number | NumberRange | undefined>(() => {
    if (!currentValue) return undefined;
    const curr = Object.values(currentValue)[0];
    return isNumberRange(curr)
      ? isCurrency
        ? { start: curr.start / 100, end: curr.end / 100 }
        : curr
      : typeof curr === 'number'
        ? isCurrency
          ? curr / 100
          : curr
        : undefined;
  });

  return (
    <div className="flex flex-col gap-2">
      <Label>{t('search.filterType')}</Label>
      <Select
        value={type}
        onValueChange={(e) => {
          if (e === 'between') {
            setType(e);
            setValue({ start: 0, end: 0 });
          } else {
            setType(e);
            setValue(0);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('search.selectType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {dateOperatorOptions.map((i, index) => (
              <SelectItem key={index} value={i}>
                {t(`search.operator.${i}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {type === 'between' ? (
        <>
          <Label>{t('search.valueFrom')}</Label>
          <Input
            disabled={!type}
            type="number"
            value={isNumberRange(value) ? value.start : 0}
            onChange={(e) =>
              setValue((p) => ({ end: isNumberRange(p) ? p.end : 0, start: parseFloat(e.currentTarget.value) }))
            }
          />
          <Label>{t('search.valueTo')}</Label>
          <Input
            disabled={!type}
            type="number"
            value={isNumberRange(value) ? value.end : 0}
            onChange={(e) =>
              setValue((p) => ({ start: isNumberRange(p) ? p.start : 0, end: parseFloat(e.currentTarget.value) }))
            }
          />
        </>
      ) : (
        <>
          <Label>{t('search.value')}</Label>
          <Input
            disabled={!type}
            type="number"
            value={typeof value === 'number' ? value : 0}
            onChange={(e) => setValue(parseFloat(e.currentTarget.value))}
          />
        </>
      )}
      <Button
        disabled={!type || value === undefined}
        onClick={() => {
          if (type && value !== undefined) {
            if (isNumberRange(value)) {
              onSubmit({
                between: isCurrency
                  ? { start: Math.round(value.start * 100), end: Math.round(value.end * 100) }
                  : value,
              });
            } else {
              onSubmit({ [type]: isCurrency ? Math.round(value * 100) : value });
            }
          }
        }}
        variant="outline"
        className="w-fit self-end"
      >
        {t('search.apply')}
      </Button>
    </div>
  );
};
