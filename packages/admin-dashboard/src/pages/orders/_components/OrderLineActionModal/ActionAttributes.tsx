import { DraftOrderLineType } from '@/graphql/draft_order';
import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Button, Input } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionAttributesProps extends React.HTMLAttributes<HTMLDivElement> {
  line?: DraftOrderLineType;
  onOpenChange: (open: boolean) => void;
  onAttributesChangeApprove: (lineId: string, attributes: Record<string, string>) => void;
}

export const ActionAttributes: React.FC<ActionAttributesProps> = ({
  line,
  onAttributesChangeApprove,
  onOpenChange,
}) => {
  const { t } = useTranslation('orders');
  const [newLineItemAttribute, setNewLineItemAttribute] = React.useState<{ key?: string; value?: string }>({
    key: '',
    value: '',
  });
  const [lineItemAttributes, setLineItemAttributes] = React.useState<
    { id: string; key: string; value: string; isNew: boolean }[]
  >([]);
  // useEffect(() => {
  //   if (line?.customFields?.attributes) {
  //     const parsedAttributes = JSON.parse(line?.customFields?.attributes);
  //     if (typeof parsedAttributes === 'object') {
  //       setLineItemAttributes(
  //         Object.entries(parsedAttributes).map(([key, value]) => ({
  //           id: uuidv4(),
  //           key,
  //           value: value as string,
  //           isNew: false,
  //         })),
  //       );
  //     }
  //   }
  // }, [line?.customFields?.attributes]);
  const handleNewAttributeAdd = () => {
    const { key, value } = newLineItemAttribute || {};
    if (!key || !value) return;
    setLineItemAttributes((p) => [...p, { id: uuidv4(), key, value, isNew: true }]);
    setNewLineItemAttribute({ key: '', value: '' });
  };
  const handleDeleteAttributePair = (id: string) => {
    setLineItemAttributes((p) => p.filter((a) => a.id !== id));
  };
  const handleChangeApprove = () => {
    if (!line?.id) return;
    const attributesToSet = lineItemAttributes.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
    onAttributesChangeApprove(line.id, attributesToSet);
    onOpenChange(false);
  };
  const handleExistingAttributeChange = (id: string, value: string, type: 'key' | 'value') => {
    setLineItemAttributes((p) =>
      p.map((a) => {
        if (a.id === id) {
          return { ...a, [type]: value };
        }
        return a;
      }),
    );
  };
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-4 pb-4">
        <img
          alt="Product image"
          className="aspect-square w-24 rounded-md border object-cover"
          height="96"
          width="96"
          src={line?.productVariant?.featuredAsset?.preview || line?.productVariant?.product?.featuredAsset?.preview}
        />
        <span>{line?.productVariant.name}</span>
      </div>
      <div className="mb-5 flex items-end gap-2 border-b pb-5">
        <Input
          value={newLineItemAttribute?.key}
          onChange={(e) => {
            const key = e.currentTarget.value;

            setNewLineItemAttribute((p) => ({ ...p, key }));
          }}
          label={t('changes.key')}
        />
        <Input
          value={newLineItemAttribute?.value}
          onChange={(e) => {
            const value = e.currentTarget.value;
            setNewLineItemAttribute((p) => ({ ...p, value }));
          }}
          label={t('changes.value')}
        />
        <Button disabled={!newLineItemAttribute?.value || !newLineItemAttribute?.key} onClick={handleNewAttributeAdd}>
          {t('changes.addNewAttribute')}
        </Button>
      </div>
      <div className="flex h-0 grow flex-col gap-4 overflow-y-auto py-2 pr-4">
        {lineItemAttributes
          .sort((a, b) => {
            if (a.isNew === b.isNew) {
              return 0;
            }
            return a.isNew ? -1 : 1;
          })
          .map(({ id, key, value, isNew }) => (
            <div key={id} className="flex items-center gap-4">
              <Input
                onChange={(e) => handleExistingAttributeChange(id, e.currentTarget.value, 'key')}
                className={cn(isNew && 'border-green-500 dark:border-green-900')}
                label={t('changes.key')}
                value={key}
              />
              <Input
                onChange={(e) => handleExistingAttributeChange(id, e.currentTarget.value, 'value')}
                className={cn(isNew && 'border-green-500 dark:border-green-900')}
                label={t('changes.value')}
                value={value}
              />
              <Trash
                className="mt-[20px] shrink-0 cursor-pointer text-red-600"
                onClick={() => handleDeleteAttributePair(id)}
              />
            </div>
          ))}{' '}
      </div>
      <div className="flex justify-end gap-4">
        <Button variant="ghost">{t('orderLineActionModal.cancel')}</Button>
        <Button onClick={handleChangeApprove}>{t('orderLineActionModal.save')}</Button>
      </div>
    </div>
  );
};
