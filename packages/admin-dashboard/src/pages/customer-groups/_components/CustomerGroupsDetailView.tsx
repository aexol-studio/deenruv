import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, Input, useSettings, useDetailView } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';

const CUSTOMER_GROUPS_FORM_KEYS = ['CreateCustomerGroupInput', 'name'] as const;

export const CustomerGroupsDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('customerGroups');
  const { view, setField, state } = useDetailView(
    'customerGroups-detail-view',
    ({ id, view, form }) => ({
      id,
      view,
      state: form.base.state,
      setField: form.base.setField,
    }),
    ...CUSTOMER_GROUPS_FORM_KEYS,
  );

  useEffect(() => {
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    view.setEntity(view.entity);
    setField('name', view.entity.name);
  }, [view.entity]);

  return view.loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('basic.header')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack column className="gap-3">
                  <Input
                    className="w-1/2"
                    label={t('basic.name')}
                    value={state.name?.value}
                    onChange={(e) => setField('name', e.target.value)}
                    required
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
        </Stack>
      </div>
    </main>
  );
};
