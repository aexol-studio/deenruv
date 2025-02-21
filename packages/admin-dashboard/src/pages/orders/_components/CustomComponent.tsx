import { Button } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import { CF, EntityCustomFields } from '@/components';
import { useState } from 'react';

export const CustomComponent = ({
  onVariantAdd,
  orderLineId,
}: {
  onVariantAdd: (value: CF) => Promise<void>;
  orderLineId: string;
}) => {
  const { t } = useTranslation('orders');
  const [customFields, setCustomFields] = useState<CF>({});

  const onSubmit = async () => {
    await onVariantAdd(customFields);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grow overflow-y-auto py-2">
        <EntityCustomFields
          id={orderLineId}
          entityName="orderLine"
          hideButton
          fetchInitialValues={false}
          onChange={setCustomFields}
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <InfoIcon />
          <span className="">
            Modyfikacja ceny nowo dodanej linii zamówienia będzie możliwa dopiero po zapisaniu zmian zamówienia
          </span>
        </div>
        <Button onClick={onSubmit}>{t('create.add')}</Button>
      </div>
    </div>
  );
};
