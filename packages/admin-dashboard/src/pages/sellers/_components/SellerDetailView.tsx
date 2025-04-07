import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DetailViewMarker,
  Input,
  useDetailView,
  CF,
  EntityCustomFields,
} from '@deenruv/react-ui-devkit';

export const SELLER_FORM_KEYS = ['CreateSellerInput', 'name', 'customFields'] as const;

export const SellerDetailView = () => {
  const { form, fetchEntity, entity, id } = useDetailView('sellers-detail-view', ...SELLER_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  const { t } = useTranslation('sellers');

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
    })();
  }, []);

  return (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <div className="flex flex-col gap-3">
                  <Input
                    className="w-1/2"
                    label={t('details.basic.name')}
                    value={state.name?.value}
                    onChange={(e) => setField('name', e.target.value)}
                    errors={state.name?.errors}
                    required
                  />
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <DetailViewMarker position={'sellers-detail-view'} />
          <EntityCustomFields
            entityName="seller"
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
    </main>
  );
};
