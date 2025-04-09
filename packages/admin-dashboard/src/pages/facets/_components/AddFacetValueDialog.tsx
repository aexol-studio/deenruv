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
  useGFFLP,
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

export const AddFacetValueDialog: React.FC<AddFacetValueDialogProps> = ({
  facetId,
  onFacetValueChange,
  open,
  setOpen,
  facetValueId,
}) => {
  const editMode = useMemo(() => !!facetValueId, [facetValueId]);
  const { t } = useTranslation('facets');
  const { translationsLanguage: languageCode } = useSettings(({ translationsLanguage }) => ({ translationsLanguage }));
  const { state, setField } = useGFFLP(
    'FacetValue',
    'name',
    'code',
    'customFields',
  )({
    name: {
      validate: (v) => {
        if (!v || v === '') return [t('requiredError')];
      },
    },
    code: {
      validate: (v) => {
        if (!v || v === '') return [t('requiredError')];
      },
    },
  });

  const fetchFacetValue = useCallback(
    () =>
      facetValueId &&
      apiClient('query')({
        facetValues: [
          { options: { filter: { id: { eq: facetValueId } } } },
          { items: { code: true, translations: { languageCode: true, name: true } } },
        ],
      }).then((resp) => {
        setField('code', resp.facetValues.items[0].code);
        setField(
          'name',
          resp.facetValues.items[0].translations.find((t) => t.languageCode === languageCode)?.name || '',
        );
        if ('customFields' in resp.facetValues.items[0])
          setField('customFields', resp.facetValues.items[0].customFields as CF);
      }),
    [facetValueId, t, languageCode],
  );

  useEffect(() => {
    fetchFacetValue();
  }, [fetchFacetValue, facetValueId]);

  useEffect(() => {
    if (editMode || !state.name?.value) return;
    const facetCode = state.name?.value.toLowerCase().replace(/\s+/g, '-');
    if (facetCode) setField('code', facetCode);
  }, [state, editMode, setField]);

  useEffect(() => {
    console.log('ST', state);
  }, [state]);

  const resetValues = useCallback(() => {
    onFacetValueChange();
    setOpen(false);
    setField('name', '');
    setField('code', '');
  }, [onFacetValueChange, setField]);

  const saveFacetValue = useCallback(
    () =>
      apiClient('mutation')({
        createFacetValues: [
          {
            input: [
              {
                facetId,
                code: state.code!.value,
                translations: [{ languageCode, name: state.name?.value }],
                ...(state.customFields?.validatedValue ? { customFields: state.customFields?.validatedValue } : {}),
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
    [state, languageCode, facetId, resetValues, t],
  );

  const updateFacetValue = useCallback(() => {
    if (!facetValueId) return;
    apiClient('mutation')({
      updateFacetValues: [
        {
          input: [
            {
              id: facetValueId,
              code: state.code!.value,
              translations: [{ languageCode, name: state.name?.value }],
              ...(state.customFields?.validatedValue ? { customFields: state.customFields?.validatedValue } : {}),
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
  }, [state, languageCode, facetId, resetValues, t]);

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
            <Input className="mt-1" value={state.name?.value} onChange={(e) => setField('name', e.target.value)} />
          </div>
          <div>
            <Label>{t('addValueModal.codeLabel')}</Label>
            <Input className="mt-1" value={state.code?.value} onChange={(e) => setField('code', e.target.value)} />
          </div>
          <EntityCustomFields
            entityName="facetValue"
            id={facetValueId}
            hideButton
            initialValues={
              state && 'customFields' in state
                ? { customFields: state.customFields?.validatedValue as any }
                : { customFields: {} }
            }
            onChange={(cf) => {
              setField('customFields', cf);
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
