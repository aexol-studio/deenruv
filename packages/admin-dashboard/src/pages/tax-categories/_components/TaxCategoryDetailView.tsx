import {
  useDetailView,
  DetailViewMarker,
  Spinner,
  useSettings,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Label,
} from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';
import { EntityCustomFields, Stack } from '@/components';
import { useTranslation } from 'react-i18next';

const TAX_CATEGORY_FORM_KEYS = ['CreateTaxCategoryInput', 'name', 'isDefault'] as const;

export const TaxCategoryDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, form, loading, fetchEntity } = useDetailView('taxCategories-detail-view', ...TAX_CATEGORY_FORM_KEYS);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
            <CardContent className="flex flex-col gap-4 p-0 pt-4">
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
                  <Switch
                    checked={state.isDefault?.value ?? undefined}
                    onCheckedChange={(e) => setField('isDefault', e)}
                  />
                  <Label>{t('details.basic.isDefault')}</Label>
                </Stack>
              </Stack>
            </CardContent>
          </CardHeader>
        </Card>
        <DetailViewMarker position={'taxCategories-detail-view'} />
        <EntityCustomFields entityName="taxCategory" id={id} currentLanguage={contentLng} />
      </div>
    </div>
  );
};
