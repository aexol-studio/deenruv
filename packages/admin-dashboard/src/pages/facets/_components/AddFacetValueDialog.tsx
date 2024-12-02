import {
  Button,
  DialogHeader,
  DialogTitle,
  Input,
  Dialog,
  DialogContent,
  Label,
  DialogFooter,
  apiClient,
} from '@deenruv/react-ui-devkit';

import { LanguageCode } from '@deenruv/admin-types';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { Stack, EntityCustomFields } from '@/components';

interface AddFacetValueDialogProps {
  facetId: string;
  facetValueId?: string | null;
  onFacetValueChange: () => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
          {
            items: {
              code: true,
              translations: {
                name: true,
              },
            },
          },
        ],
      }).then((resp) => {
        setField('code', resp.facetValues.items[0].code);
        setField('name', resp.facetValues.items[0].translations[0].name);
      }),
    [facetValueId, t],
  );

  useEffect(() => {
    fetchFacetValue();
  }, [fetchFacetValue, facetValueId]);

  useEffect(() => {
    if (editMode || !state.name?.value) return;
    const facetCode = state.name?.value.toLowerCase().replace(/\s+/g, '-');
    if (facetCode) setField('code', facetCode);
  }, [state, editMode, setField]);

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
                code: state.code!.value,
                translations: [
                  {
                    languageCode: LanguageCode.pl,
                    name: state.name?.value,
                  },
                ],
                facetId,
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
    [state, facetId, resetValues, t],
  );

  const updateFacetValue = useCallback(() => {
    if (!facetId) return;

    apiClient('mutation')({
      updateFacetValues: [
        {
          input: [
            {
              code: state.code!.value,
              translations: [
                {
                  languageCode: LanguageCode.pl,
                  name: state.name?.value,
                },
              ],
              id: facetId,
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
  }, [state, facetId, resetValues, t]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? t('addValueModal.editTitle') : t('addValueModal.title')}</DialogTitle>
        </DialogHeader>
        <Stack column className="gap-3">
          <div>
            <Label>{t('addValueModal.nameLabel')}</Label>
            <Input className="mt-1" value={state.name?.value} onChange={(e) => setField('name', e.target.value)} />
          </div>
          <div>
            <Label>{t('addValueModal.codeLabel')}</Label>
            <Input className="mt-1" value={state.code?.value} onChange={(e) => setField('code', e.target.value)} />
          </div>
          {facetValueId && (
            <EntityCustomFields
              entityName="facetValue"
              id={facetValueId}
              fetch={async (runtimeSelector) => {
                const { facetValues: resp } = await apiClient('query')({
                  facetValues: [
                    { options: { filter: { id: { eq: facetValueId } } } },
                    {
                      items: {
                        code: true,
                        translations: {
                          name: true,
                        },
                        ...runtimeSelector,
                      },
                    },
                  ],
                });
                const foundValue = resp?.items[0];
                return { customFields: foundValue?.customFields as any };
              }}
            />
          )}
        </Stack>
        <DialogFooter className="mt-2">
          <Button onClick={editMode ? updateFacetValue : saveFacetValue}>
            {editMode ? t('addValueModal.editButton') : t('addValueModal.button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
