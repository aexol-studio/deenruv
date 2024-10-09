import {
  Button,
  Calendar,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { ModelTypes } from '@/zeus';
import { endOfDay, startOfDay } from 'date-fns';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

import { useTranslation } from 'react-i18next';

const dateOperatorOptions = ['before', 'after', 'between'] as const;

function isDateRange(data: undefined | Date | DateRange): data is DateRange {
  return !!data && typeof data === 'object' && 'from' in data;
}

interface Props {
  onDateSubmit: (value: ModelTypes['DateOperators']) => void;

  currentValue?: ModelTypes['DateOperators'];
}

export const DateOperator: React.FC<Props> = ({ onDateSubmit, currentValue }) => {
  const { t } = useTranslation('common');
  const [type, setType] = useState<string | undefined>(
    currentValue ? (Object.keys(currentValue)[0] as string) : undefined,
  );
  const [value, setValue] = useState<Date | DateRange | undefined>(() => {
    if (currentValue) {
      const curr = Object.values(currentValue)[0];
      if (curr && typeof curr === 'object' && 'start' in curr && 'end' in curr) {
        return { from: new Date(curr.start), to: new Date(curr.end) };
      } else {
        return curr ? new Date(curr as string) : undefined;
      }
    } else {
      return undefined;
    }
  });
  return (
    <div className="flex flex-col gap-2">
      <Label>{t('search.filterType')}</Label>
      <Select
        value={type}
        onValueChange={(e) => {
          if (e === 'between') {
            setType(e);
            setValue({ from: new Date() });
          } else {
            setType(e);
            setValue(new Date());
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
      <Label htmlFor="string-input">{t('search.value')}</Label>
      {type === 'between' ? (
        <Calendar
          disabled={!type}
          mode="range"
          numberOfMonths={2}
          showOutsideDays={false}
          selected={value as DateRange | undefined}
          onSelect={setValue}
          className="rounded-md border bg-white dark:bg-black"
        />
      ) : (
        <Calendar
          disabled={!type}
          mode="single"
          showOutsideDays={false}
          selected={value as Date | undefined}
          onSelect={setValue}
          className="rounded-md border bg-white dark:bg-black"
        />
      )}
      <Button
        disabled={!type || (type === 'between' && isDateRange(value) ? !value.to || !value.from : !value)}
        onClick={() => {
          if (type && value && type === 'between' && isDateRange(value) && value.to && value.from) {
            onDateSubmit({ between: { start: startOfDay(value.from), end: endOfDay(value.to) } });
          } else if (type && value && !isDateRange(value)) {
            onDateSubmit(type === 'before' ? { before: endOfDay(value) } : { after: startOfDay(value) });
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
