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
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { apiCall } from '@/graphql/client';
import { LanguageCode } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { Stack } from '@/components';

interface AddOptionGroupDialogProps {
  currentTranslationLng: LanguageCode;
  productId: string | undefined;
  onSuccess: () => void;
}

export const AddOptionGroupDialog: React.FC<AddOptionGroupDialogProps> = ({
  currentTranslationLng,
  productId,
  onSuccess,
}) => {
  const { t } = useTranslation('products');
  const [open, setOpen] = useState(false);
  const { state, setField } = useGFFLP('CreateProductOptionGroupInput', 'code', 'translations')({});
  const translations = state?.translations?.value || [];
  const [codeEditedManually, setCodeEditedManually] = useState(false);

  const createGroup = useCallback(() => {
    if (state.code?.validatedValue && state.translations?.validatedValue)
      return apiCall()('mutation')({
        createProductOptionGroup: [
          {
            input: {
              code: state.code?.validatedValue,
              options: [],
              translations: state.translations.validatedValue,
            },
          },
          {
            id: true,
          },
        ],
      })
        .then((res) => {
          if (productId)
            return apiCall()('mutation')({
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
        <Button variant={'action'} className="self-end">
          {t('addOptionGroupDialog.title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addOptionGroupDialog.title')}</DialogTitle>
        </DialogHeader>
        <Stack column className="gap-3">
          <div>
            <Label>{t('addOptionGroupDialog.name')}</Label>
            <Input
              className="mt-1"
              value={state.translations?.value[0].name}
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
        </Stack>
        <DialogFooter className="mt-2">
          <Button onClick={() => setOpen(false)}>{t('addOptionGroupDialog.cancel')}</Button>
          <Button onClick={createGroup}>{t('addOptionGroupDialog.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
