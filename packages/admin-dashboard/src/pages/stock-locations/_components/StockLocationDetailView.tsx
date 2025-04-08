import { useEffect } from 'react';
import {
  Input,
  Label,
  useSettings,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  CF,
  EntityCustomFields,
  RichTextEditor,
  useTranslation,
} from '@deenruv/react-ui-devkit';

const STOCK_LOCATION_FORM_KEYS = ['CreateStockLocationInput', 'name', 'description', 'customFields'] as const;

export const StockLocationDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('stockLocations');

  const { form, entity, fetchEntity, id } = useDetailView('stockLocations-detail-view', ...STOCK_LOCATION_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
      setField('description', res['description']);
    })();
  }, [contentLng]);

  return (
    <main className="min-h-96">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex flex-col gap-3">
            <Input
              label={t('details.basic.name')}
              value={state.name?.value}
              onChange={(e) => setField('name', e.target.value)}
              errors={state.name?.errors}
              required
            />
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={state.description?.value ?? undefined}
                onContentChanged={(e) => setField('description', e)}
              />
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'stockLocations-detail-view'} />
        <EntityCustomFields
          entityName="stockLocation"
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
    </main>
  );
};
