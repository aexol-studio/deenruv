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
  setInArrayBy,
  EntityCustomFields,
  useTranslation,
  useDeenruvForm,
  z,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useState } from 'react';

import { LanguageCode } from '@deenruv/admin-types';
import { toast } from 'sonner';

interface AddOptionGroupDialogProps {
  currentTranslationLng: LanguageCode;
  productId: string | undefined | null;
  onSuccess: () => void;
}

const addOptionGroupSchema = z.object({
  code: z.string().default(''),
  translations: z
    .array(
      z.object({
        name: z.string(),
        languageCode: z.string(),
      }).passthrough(),
    )
    .default([]),
  customFields: z.record(z.string(), z.unknown()).optional().default({}),
});

type AddOptionGroupFormValues = z.infer<typeof addOptionGroupSchema>;

export const AddOptionGroupDialog: React.FC<AddOptionGroupDialogProps> = ({
  currentTranslationLng,
  productId,
  onSuccess,
}) => {
  const { t } = useTranslation('products');
  const [open, setOpen] = useState(false);
  const form = useDeenruvForm({
    schema: addOptionGroupSchema,
    defaultValues: {
      code: '',
      translations: [],
      customFields: {},
    },
  });
  const translations = form.watch('translations') || [];
  const [codeEditedManually, setCodeEditedManually] = useState(false);

  const createGroup = useCallback(() => {
    const code = form.getValues('code');
    const currentTranslations = form.getValues('translations');
    const customFields = form.getValues('customFields');

    if (code && currentTranslations)
      return apiClient('mutation')({
        createProductOptionGroup: [
          {
            input: {
              code,
              options: [],
              translations: currentTranslations as any,
              ...(customFields && Object.keys(customFields).length > 0 ? { customFields } : {}),
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
                  optionGroupId: res.createProductOptionGroup!.id,
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
  }, [form, productId, onSuccess, t]);

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
              value={translations[0]?.name ?? undefined}
              onChange={(e) => {
                form.setField(
                  'translations',
                  setInArrayBy(translations, (t) => t.languageCode === currentTranslationLng, {
                    name: e.target.value,
                    languageCode: currentTranslationLng,
                  }),
                );

                if (!codeEditedManually) {
                  form.setField('code', e.target.value.replace(/\s+/g, '-'));
                }
              }}
            />
          </div>
          <div>
            <Label>{t('addOptionGroupDialog.code')}</Label>
            <Input
              className="mt-1"
              value={form.watch('code')}
              onChange={(e) => {
                setCodeEditedManually(true);
                form.setField('code', e.target.value);
              }}
            />
          </div>
          <EntityCustomFields
            id={undefined}
            entityName="productOptionGroup"
            hideButton
            onChange={(cf) => {
              form.setField('customFields', cf);
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
