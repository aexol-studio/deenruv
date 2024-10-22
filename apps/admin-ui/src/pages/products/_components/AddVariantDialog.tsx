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
  Stack,
} from '@/components';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { apiCall } from '@/graphql/client';
import { LanguageCode } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OptionGroupSelector, OptionGroupType } from '@/graphql/products';

interface AddVariantDialogProps {
  currentTranslationLng: LanguageCode;
  productId: string | undefined;
  onSuccess: () => void;
}

export const AddVariantDialog: React.FC<AddVariantDialogProps> = ({ currentTranslationLng, productId, onSuccess }) => {
  const { t } = useTranslation('products');
  const [open, setOpen] = useState(false);
  const { state, setField } = useGFFLP('CreateProductVariantInput', 'sku', 'translations', 'optionIds')({});
  const translations = state?.translations?.value || [];
  const [optionGroups, setOptionGroups] = useState<OptionGroupType[]>();

  const fetchOptionGroups = useCallback(async () => {
    if (productId) {
      const response = await apiCall()('query')({
        product: [
          {
            id: productId,
          },
          {
            optionGroups: OptionGroupSelector,
          },
        ],
      });

      setOptionGroups(response.product?.optionGroups);

      if (!response.product) {
        toast.error(t('toasts.fetchProductErrorToast'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    fetchOptionGroups();
  }, [fetchOptionGroups]);

  const createVariant = useCallback(() => {
    if (productId && state.sku?.validatedValue && state.translations?.validatedValue)
      return apiCall()('mutation')({
        createProductVariants: [
          {
            input: [
              {
                productId,
                sku: state.sku?.validatedValue,
                translations: state.translations.validatedValue,
                optionIds: state.optionIds?.validatedValue,
              },
            ],
          },
          {
            id: true,
          },
        ],
      })
        .then(() => {
          toast(t('toasts.createProductVariantSuccessToast'));
          setOpen(false);
          onSuccess();
        })
        .catch(() => {
          toast(t('toasts.createProductVariantErrorToast'));
        });
  }, [state, productId, onSuccess, t, setOpen]);

  const handleOptionChange = useCallback(
    (optionId: string, groupIdx: number) => {
      const newState = [...(state.optionIds?.value || [])];
      newState[groupIdx] = optionId;

      setField('optionIds', newState);
    },
    [state.optionIds?.value, setField],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'action'} className="self-end">
          {t('addVariantDialog.title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('addVariantDialog.title')}</DialogTitle>
        </DialogHeader>
        <Stack column className="gap-3">
          <div>
            <Label>{t('addVariantDialog.name')}</Label>
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
              }}
            />
          </div>
          <div>
            <Label>{t('addVariantDialog.sku')}</Label>
            <Input
              className="mt-1"
              value={state.sku?.value}
              onChange={(e) => {
                setField('sku', e.target.value);
              }}
            />
          </div>
          {optionGroups?.map((group, i) => (
            <Stack key={group.name} className="items-center gap-3">
              <div className="w-1/2 font-semibold">{group.name}</div>
              <div className="w-1/2">
                <Select
                  value={state.optionIds?.value?.[i] || ''}
                  onValueChange={(e) => {
                    handleOptionChange(e, i);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('addVariantDialog.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {group.options.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Stack>
          ))}
        </Stack>
        <DialogFooter className="mt-2">
          <Button onClick={() => setOpen(false)}>{t('addVariantDialog.cancel')}</Button>
          <Button onClick={createVariant}>{t('addVariantDialog.add')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
