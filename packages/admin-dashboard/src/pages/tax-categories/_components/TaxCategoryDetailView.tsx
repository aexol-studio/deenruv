import {
  useDetailView,
  DetailViewMarker,
  useSettings,
  Input,
  Switch,
  Label,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';
import { CF, EntityCustomFields, Stack } from '@/components';
import { useTranslation } from 'react-i18next';

const TAX_CATEGORY_FORM_KEYS = ['CreateTaxCategoryInput', 'name', 'isDefault', 'customFields'] as const;

export const TaxCategoryDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, form, entity, fetchEntity } = useDetailView('taxCategories-detail-view', ...TAX_CATEGORY_FORM_KEYS);
  const { t } = useTranslation('taxCategories');

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
      setField('isDefault', res['isDefault']);
    })();
  }, [contentLng]);

  return (
    <div>
      <div className="flex w-full flex-col gap-4">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <Stack className="items-start gap-4">
            <Stack className="basis-full md:basis-1/2">
              <Input
                label={t('details.basic.name')}
                value={state.name?.value}
                required
                onChange={(e) => {
                  setField('name', e.target.value);
                }}
                errors={state.name?.errors}
              />
            </Stack>
            <Stack className="mt-7 basis-full items-center gap-3 md:basis-1/2">
              <Switch checked={state.isDefault?.value ?? undefined} onCheckedChange={(e) => setField('isDefault', e)} />
              <Label>{t('details.basic.isDefault')}</Label>
            </Stack>
          </Stack>
        </CustomCard>
        <DetailViewMarker position={'taxCategories-detail-view'} />
        <EntityCustomFields
          entityName="taxCategory"
          id={id}
          hideButton
          onChange={(customFields) => {
            setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
        />
      </div>
    </div>
  );
};
