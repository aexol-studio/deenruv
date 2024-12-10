import { Button } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import { EntityCustomFields } from '@/components';
import { useState } from 'react';

export const CustomComponent = ({
  onVariantAdd,
  orderLineId,
}: {
  value: string | null;
  setValue: (value: string) => void;
  onVariantAdd: (attributes?: string) => Promise<void>;
  orderLineId?: string;
}) => {
  const { t } = useTranslation('orders');
  const [json, setJson] = useState<Record<string, unknown>>({ attributes: '' });

  const finalAdd = async () => {
    await onVariantAdd(json.attributes as any);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grow overflow-y-auto py-2">
        <EntityCustomFields
          entityName="orderLine"
          id={orderLineId}
          onChange={(e) => {
            setJson(e);
            console.log('CHANGE', e);
          }}
          hideButton
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <InfoIcon />
          <span className="">
            Modyfikacja ceny nowo dodanej linii zamówienia będzie możliwa dopiero po zapisaniu zmian zamówienia
          </span>
        </div>
        <Button onClick={finalAdd}>{t('create.add')}</Button>
      </div>
    </div>
  );
};
