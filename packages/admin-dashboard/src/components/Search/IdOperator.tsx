import { Button, Input, Label } from '@deenruv/react-ui-devkit';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (value: string) => void;
  currentValue?: string | null;
}

export const IdOperator: React.FC<Props> = ({ onSubmit, currentValue }) => {
  const { t } = useTranslation('common');

  const [value, setValue] = useState<string>(currentValue || '');

  useEffect(() => {
    setValue(currentValue || '');
  }, [currentValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="string-input">{t('search.idIsEqual')}</Label>
      <Input id="string-input" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
      <Button disabled={value === ''} onClick={() => onSubmit(value)} variant="outline" className="w-fit self-end">
        {t('search.apply')}
      </Button>
    </div>
  );
};
