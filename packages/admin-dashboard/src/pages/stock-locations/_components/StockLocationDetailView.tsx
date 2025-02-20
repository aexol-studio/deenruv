import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  useSettings,
  useDetailView,
} from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { Stack } from '@/components';

const STOCK_LOCATION_FORM_KEYS = ['CreateStockLocationInput', 'name', 'description'] as const;

export const StockLocationDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { t } = useTranslation('stockLocations');

  const { form, loading, fetchEntity } = useDetailView('stockLocations-detail-view', ...STOCK_LOCATION_FORM_KEYS);

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

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack column className="gap-3">
                  <Input
                    label={t('details.basic.name')}
                    value={state.name?.value}
                    onChange={(e) => setField('name', e.target.value)}
                    errors={state.name?.errors}
                    required
                  />
                  <Stack column className="basis-full">
                    <Label className="mb-2">{t('details.basic.description')}</Label>
                    <RichTextEditor
                      content={state.description?.value ?? undefined}
                      onContentChanged={(e) => setField('description', e)}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
        </Stack>
      </div>
    </main>
  );
};
