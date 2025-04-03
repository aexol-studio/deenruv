import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, useSettings, useDetailView, DetailViewMarker, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import { CF, EntityCustomFields, Stack } from '@/components';

const CUSTOMER_GROUPS_FORM_KEYS = ['CreateCustomerGroupInput', 'name', 'customFields'] as const;

export const CustomerGroupsDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('customerGroups');
  const { id, form, entity, fetchEntity } = useDetailView('customerGroups-detail-view', ...CUSTOMER_GROUPS_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
    })();
  }, [contentLng]);

  return (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <CustomCard title={t('basic.header')} icon={<CardIcons.basic />}>
            <Input
              className="w-1/2"
              label={t('basic.name')}
              value={state.name?.value}
              onChange={(e) => setField('name', e.target.value)}
              errors={state.name?.errors}
              required
            />
          </CustomCard>
          <DetailViewMarker position={'customerGroups-detail-view'} />
          <EntityCustomFields
            entityName="customerGroup"
            id={id}
            hideButton
            onChange={(customFields) => {
              setField('customFields', customFields);
            }}
            initialValues={
              entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
            }
          />
        </Stack>
      </div>
    </main>
  );
};
