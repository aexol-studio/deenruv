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
  Checkbox,
  DropdownMenuItem,
} from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { LanguageCode } from '@deenruv/admin-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ColorSample } from './ColorSample.js';
import { ImageOff, Pencil } from 'lucide-react';
import { FacetValueType } from '@/graphql/facets';
import { useGFFLP } from '@/lists/useGflp';
import { Stack, AssetsModalInput } from '@/components';

interface AddFacetValueDialogProps {
  facetId: string;
  onFacetValueChange: () => void;
  facetValue?: FacetValueType;
}

export const AddFacetValueDialog: React.FC<AddFacetValueDialogProps> = ({
  facetId,
  onFacetValueChange,
  facetValue,
}) => {
  const editMode = useMemo(() => !!facetValue, [facetValue]);
  const { t } = useTranslation('facets');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [image, setImage] = useState<{ id: string; preview: string; source: string } | undefined>(
    // facetValue?.customFields?.image || undefined,
    undefined,
  );

  const { state, setField } = useGFFLP(
    'FacetValue',
    'name',
    'code',
    'customFields',
  )({
    name: {
      initialValue: facetValue?.name,
      validate: (v) => {
        if (!v || v === '') return [t('requiredError')];
      },
    },
    code: {
      initialValue: facetValue?.code,
      validate: (v) => {
        if (!v || v === '') return [t('requiredError')];
      },
    },
    customFields: {
      initialValue: {
        // hexColor: facetValue?.customFields?.hexColor,
        // isNew: facetValue?.customFields?.isNew,
        hexColor: undefined,
        isNew: false,
      },
    },
  });

  useEffect(() => {
    if (editMode || !state.name?.value) return;
    const facetCode = state.name?.value.toLowerCase().replace(/\s+/g, '-');
    if (facetCode) setField('code', facetCode);
  }, [state, editMode, setField]);

  const resetValues = useCallback(() => {
    onFacetValueChange();
    setOpen(false);
    setImage(undefined);
    setField('name', '');
    setField('code', '');
    setField('customFields', {
      hexColor: undefined,
      image: undefined,
      isNew: false,
    });
  }, [onFacetValueChange, setField]);

  const saveFacetValue = useCallback(
    () =>
      apiCall()('mutation')({
        createFacetValues: [
          {
            input: [
              {
                code: state.code!.value,
                customFields: {
                  hexColor: state.customFields?.value?.hexColor,
                  isNew: state.customFields?.value?.isNew,
                  imageId: image?.id,
                },
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
    [state, facetId, image, resetValues, t],
  );

  const updateFacetValue = useCallback(() => {
    if (!facetValue?.id) return;

    apiCall()('mutation')({
      updateFacetValues: [
        {
          input: [
            {
              code: state.code!.value,
              customFields: {
                hexColor: state.customFields?.value?.hexColor,
                isNew: state.customFields?.value?.isNew,
                imageId: image?.id,
              },
              translations: [
                {
                  languageCode: LanguageCode.pl,
                  name: state.name?.value,
                },
              ],
              id: facetValue?.id,
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
  }, [state, image, facetValue?.id, resetValues, t]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editMode ? (
          <DropdownMenuItem className="flex cursor-pointer items-center gap-3 p-2" onSelect={(e) => e.preventDefault()}>
            <Pencil size={20} />
            {t('buttons.editValue')}
          </DropdownMenuItem>
        ) : (
          <Button size={'sm'}>{t('addValueModal.button')}</Button>
        )}
      </DialogTrigger>
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
          <Label className="mt-2">{t('addValueModal.options')}</Label>
          <Stack className="border-grey-500 mb-2 justify-between border-t pt-3">
            <Stack className="items-center gap-3">
              <Checkbox
                className="mt-1"
                checked={state.customFields?.value?.isNew}
                onCheckedChange={(e) =>
                  setField('customFields', {
                    ...state.customFields?.value,
                    isNew: e as boolean,
                  })
                }
              />
              <Label>{t('addValueModal.isNew')}</Label>
            </Stack>
            <Stack className="items-center gap-3">
              <Checkbox className="mt-1" checked={hidden} onCheckedChange={(e) => setHidden(e as boolean)} />
              <Label>{t('addValueModal.hidden')}</Label>
            </Stack>
            <Stack className="relative items-center gap-3">
              <ColorSample
                color={state.customFields?.value?.hexColor}
                setColor={(color) =>
                  setField('customFields', {
                    ...state.customFields?.value,
                    hexColor: color,
                  })
                }
              />
              <Label>{t('addValueModal.color')}</Label>
            </Stack>
          </Stack>

          <Label className="mt-2">{t('addValueModal.image')}</Label>
          <Stack className="border-grey-500 gap-4 border-t pt-3">
            <div className="flex h-64 w-64 items-center justify-center border border-solid border-gray-300 p-2 shadow">
              {image ? (
                <img src={image.preview} className="h-60" alt="Facet image preview" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 p-3">
                  <ImageOff size={48} />
                </div>
              )}
            </div>
            <AssetsModalInput setValue={setImage} />
          </Stack>
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
