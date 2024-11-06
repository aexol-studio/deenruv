import { Button, Checkbox, Label } from '@deenruv/react-ui-devkit';
import { ORDER_STATE, ORDER_TYPE, OrderStateType, OrderType } from '@/graphql/base';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

interface Props {
  type: 'OrderState' | 'OrderType';
  currentlySelected: string[];
  onSubmit: (value: string[]) => void;
}

export const InOperator: React.FC<Props> = ({ onSubmit, currentlySelected, type }) => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState<string[]>(currentlySelected);

  useEffect(() => {
    setValue(currentlySelected);
  }, [currentlySelected]);

  return (
    <div className="flex flex-col gap-2">
      {(type === 'OrderState'
        ? (Object.values(ORDER_STATE) as Array<OrderStateType>)
        : (Object.values(ORDER_TYPE) as Array<OrderType>)
      ).map((i) => (
        <div className="flex items-center gap-2" key={i}>
          <Checkbox
            id={'checkbox-in-operator-' + i}
            checked={value.some((v) => i === v)}
            onClick={() => setValue((p) => (p.some((old) => old === i) ? p.filter((old) => old !== i) : [...p, i]))}
          />
          <Label htmlFor={'checkbox-in-operator-' + i} className="cursor-pointer text-sm">
            {t(`search.inOperator.${i}`)}
          </Label>
        </div>
      ))}
      <Button onClick={() => onSubmit(value)} variant="outline" className="w-fit self-end">
        {t('search.apply')}
      </Button>
    </div>
  );
};
