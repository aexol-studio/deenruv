import { Button } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { InfoIcon } from 'lucide-react';
import { CF, EntityCustomFields } from '@/components';
import { useEffect, useState } from 'react';
import { DraftOrderType } from '@/graphql/draft_order.js';

type VariantWithQuantity = DraftOrderType['lines'][number]['productVariant'] & { quantity?: number };

export const CustomComponent = ({
  onVariantAdd,
  orderLine,
}: {
  onVariantAdd: (value: CF) => Promise<void>;
  orderLine: VariantWithQuantity;
}) => {
  const { t } = useTranslation('orders');
  const [customFields, setCustomFields] = useState<CF>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('KUSTOM', customFields);
  }, []);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onVariantAdd(customFields);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-md border">
      <div className="h-full grow space-y-4 overflow-y-auto p-4">
        <EntityCustomFields
          entityName="orderLine"
          hideButton
          initialValues={{ customFields: {} }}
          onChange={setCustomFields}
          additionalData={{ product: orderLine.product, variant: orderLine }}
        />
      </div>
      <div className="bg-muted/30 border-t p-4">
        <div className="flex flex-col items-start justify-end gap-4 sm:flex-row sm:items-center">
          <Button onClick={onSubmit} disabled={isSubmitting} className="min-w-[120px] self-end sm:self-auto">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {t('common:processing')}
              </span>
            ) : (
              t('create.add')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
