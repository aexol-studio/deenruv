import {
  Button,
  DialogHeader,
  DialogTitle,
  Input,
  Dialog,
  DialogContent,
  DialogTrigger,
  Label,
  DialogFooter,
  apiClient,
  useGFFLP,
  setInArrayBy,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useState } from 'react';

import { LanguageCode } from '@deenruv/admin-types';
import { toast } from 'sonner';

interface AddOptionGroupDialogProps {
  currentTranslationLng: LanguageCode;
  productId: string | undefined | null;
  onSuccess: () => void;
}

export const AddOptionGroupDialog: React.FC<AddOptionGroupDialogProps> = ({
  currentTranslationLng,
  productId,
  onSuccess,
}) => {
  const { t } = useTranslation('products');
  const [open, setOpen] = useState(false);
  const { state, setField } = useGFFLP('CreateProductOptionGroupInput', 'code', 'translations', 'customFields')({});
  const translations = state?.translations?.value || [];
  const [codeEditedManually, setCodeEditedManually] = useState(false);

  const createGroup = useCallback(() => {
    if (state.code?.validatedValue && state.translations?.validatedValue)
      return apiClient('mutation')({
        createProductOptionGroup: [
          {
            input: {
              code: state.code?.validatedValue,
              options: [],
              translations: state.translations.validatedValue,
              ...(state.customFields?.validatedValue ? { customFields: state.customFields?.validatedValue } : {}),
            },
          },
          {
            id: true,
          },
        ],
      })
        .then((res) => {
          if (productId)
            return apiClient('mutation')({
              addOptionGroupToProduct: [
                {
                  productId,
                  optionGroupId: res.createProductOptionGroup.id,
                },
                {
                  id: true,
                },
              ],
            });
        })
        .then(() => {
          toast(t('toasts.createOptionGroupSuccessToast'));
          setOpen(false);
          onSuccess();
        })
        .catch(() => {
          toast(t('toasts.createOptionGroupErrorToast'));
        });
  }, [state.code, state.translations, productId, onSuccess, t]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="self-end">{t('addOptionGroupDialog.title')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addOptionGroupDialog.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label>{t('addOptionGroupDialog.name')}</Label>
            <Input
              className="mt-1"
              value={state.translations?.value[0].name ?? undefined}
              onChange={(e) => {
                setField(
                  'translations',
                  setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
                    name: e.target.value,
                    languageCode: currentTranslationLng,
                  }),
                );

                if (!codeEditedManually) {
                  setField('code', e.target.value.replace(/\s+/g, '-'));
                }
              }}
            />
          </div>
          <div>
            <Label>{t('addOptionGroupDialog.code')}</Label>
            <Input
              className="mt-1"
              value={state.code?.value}
              onChange={(e) => {
                setCodeEditedManually(true);
                setField('code', e.target.value);
              }}
            />
          </div>
          <EntityCustomFields
            id={undefined}
            entityName="productOptionGroup"
            hideButton
            onChange={(cf) => {
              setField('customFields', cf);
            }}
            additionalData={{}}
            withoutBorder
          />
        </div>
        <DialogFooter className="mt-2">
          <Button onClick={() => setOpen(false)}>{t('addOptionGroupDialog.cancel')}</Button>
          <Button onClick={createGroup}>{t('addOptionGroupDialog.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
