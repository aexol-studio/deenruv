import {
  Button,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Dialog,
  DialogContent,
  Label,
  DialogFooter,
  apiClient,
  useSettings,
  useDeenruvForm,
  z,
  EntityCustomFields,
  useTranslation,
  CF,
} from '@deenruv/react-ui-devkit';

import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface AddFacetValueDialogProps {
  facetId: string;
  facetValueId?: string | null;
  onFacetValueChange: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const facetValueSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  customFields: z.record(z.string(), z.unknown()).optional().default({}),
});

type FacetValueFormValues = z.infer<typeof facetValueSchema>;

export const AddFacetValueDialog: React.FC<AddFacetValueDialogProps> = ({
  facetId,
  onFacetValueChange,
  open,
  setOpen,
  facetValueId,
}) => {
  const editMode = useMemo(() => !!facetValueId, [facetValueId]);
  const { t } = useTranslation('facets');
  const languageCode = useSettings((p) => p.translationsLanguage);
  const form = useDeenruvForm({
    schema: facetValueSchema,
    defaultValues: {
      name: '',
      code: '',
      customFields: {},
    },
  });
  const nameValue = form.watch('name');
  const codeValue = form.watch('code');
  const customFieldsValue = form.watch('customFields');

  const fetchFacetValue = useCallback(
    () =>
      facetValueId &&
      apiClient('query')({
        facetValues: [
          { options: { filter: { id: { eq: facetValueId } } } },
          { items: { code: true, translations: { languageCode: true, name: true } } },
        ],
      }).then((resp) => {
        form.setField('code', resp.facetValues.items[0].code);
        form.setField(
          'name',
          resp.facetValues.items[0].translations.find((t) => t.languageCode === languageCode)?.name || '',
        );
        if ('customFields' in resp.facetValues.items[0])
          form.setField('customFields', resp.facetValues.items[0].customFields as CF);
      }),
    [facetValueId, t, languageCode],
  );

  useEffect(() => {
    fetchFacetValue();
  }, [fetchFacetValue, facetValueId]);

  useEffect(() => {
    if (editMode || !nameValue) return;
    const facetCode = nameValue.toLowerCase().replace(/\s+/g, '-');
    if (facetCode) form.setField('code', facetCode);
  }, [nameValue, editMode, form.setField]);

  const resetValues = useCallback(() => {
    onFacetValueChange();
    setOpen(false);
    form.reset({ name: '', code: '', customFields: {} });
  }, [onFacetValueChange, form]);

  const saveFacetValue = useCallback(
    () =>
      apiClient('mutation')({
        createFacetValues: [
          {
            input: [
              {
                facetId,
                code: codeValue,
                translations: [{ languageCode, name: nameValue }],
                ...(customFieldsValue && Object.keys(customFieldsValue).length > 0
                  ? { customFields: customFieldsValue }
                  : {}),
              },
            ],
          },
          { id: true },
        ],
      })
        .then(() => {
          toast.message(t('addValueModal.success'));
          resetValues();
        })
        .catch((err) => toast.message(t('addValueModal.error') + ': ' + err)),
    [nameValue, codeValue, customFieldsValue, languageCode, facetId, resetValues, t],
  );

  const updateFacetValue = useCallback(() => {
    if (!facetValueId) return;
    apiClient('mutation')({
      updateFacetValues: [
        {
          input: [
            {
              id: facetValueId,
              code: codeValue,
              translations: [{ languageCode, name: nameValue }],
              ...(customFieldsValue && Object.keys(customFieldsValue).length > 0
                ? { customFields: customFieldsValue }
                : {}),
            },
          ],
        },
        { id: true },
      ],
    })
      .then(() => {
        toast.message(t('addValueModal.editSuccess'));
        resetValues();
      })
      .catch((err) => toast.message(t('addValueModal.error') + ': ' + err));
  }, [nameValue, codeValue, customFieldsValue, languageCode, facetValueId, resetValues, t]);

  return (
    <Dialog open={open} onOpenChange={resetValues}>
      <DialogTrigger>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{editMode ? t('addValueModal.editTitle') : t('addValueModal.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div>
            <Label>{t('addValueModal.nameLabel')}</Label>
            <Input className="mt-1" value={nameValue} onChange={(e) => form.setField('name', e.target.value)} />
          </div>
          <div>
            <Label>{t('addValueModal.codeLabel')}</Label>
            <Input className="mt-1" value={codeValue} onChange={(e) => form.setField('code', e.target.value)} />
          </div>
          <EntityCustomFields
            entityName="facetValue"
            id={facetValueId}
            hideButton
            initialValues={
              customFieldsValue
                ? { customFields: customFieldsValue as any }
                : { customFields: {} }
            }
            onChange={(cf) => {
              form.setField('customFields', cf);
            }}
            additionalData={{}}
          />
        </div>
        <DialogFooter className="mt-2">
          <Button onClick={editMode ? updateFacetValue : saveFacetValue}>
            {editMode ? t('addValueModal.editButton') : t('addValueModal.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
