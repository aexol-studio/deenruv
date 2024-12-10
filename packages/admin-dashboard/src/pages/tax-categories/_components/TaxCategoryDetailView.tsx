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
  const { id, view, setField, state } = useDetailView(
    'taxCategories-detail-view',
    ({ id, view, form }) => ({
      id,
      view,
      state: form.base.state,
      setField: form.base.setField,
    }),
    ...TAX_CATEGORY_FORM_KEYS,
  );
  const { t } = useTranslation('taxCategories');

  useEffect(() => {
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    view.setEntity(view.entity);
    setField('name', view.entity.name);
    setField('isDefault', view.entity['isDefault']);
  }, [view.entity]);

  return view.loading ? (
    <div>
      <Spinner height={'80vh'} />
    </div>
  ) : (
    <div>
      <div className="flex w-full flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
            <CardContent className="flex flex-col gap-4 p-0 pt-4">
              <Stack className="items-end gap-4">
                <Stack className="basis-full md:basis-1/2">
                  <Input
                    label={t('details.basic.name')}
                    value={state.name?.value}
                    required
                    onChange={(e) => {
                      setField('name', e.target.value);
                    }}
                  />
                </Stack>
                <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/2">
                  <Switch checked={state.isDefault?.value} onCheckedChange={(e) => setField('isDefault', e)} />
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
