import { Button, Label, Switch } from '@deenruv/react-ui-devkit';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (value: boolean) => void;
  currentValue?: boolean | null;
}

export const BooleanOperator: React.FC<Props> = ({ onSubmit, currentValue }) => {
  const { t } = useTranslation('common');

  const [value, setValue] = useState<boolean | undefined>(currentValue ?? undefined);
  useEffect(() => {
    setValue(currentValue ?? undefined);
  }, [currentValue]);

  return (
    <div className="flex flex-col gap-2">
      <Label>{t('search.filterType')}</Label>
      <div className="flex items-center gap-4">
        <Switch checked={value} onCheckedChange={setValue} />
        {t(value ? 'search.true' : 'search.false')}
      </div>

      <Button onClick={() => onSubmit(!!value)} variant="outline" className="w-fit self-end">
        {t('search.apply')}
      </Button>
    </div>
  );
};
