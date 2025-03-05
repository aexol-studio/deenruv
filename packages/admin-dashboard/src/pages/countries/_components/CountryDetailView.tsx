import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  useSettings,
  useDetailView,
} from '@deenruv/react-ui-devkit';
import { setInArrayBy } from '@/lists/useGflp';
import { Stack } from '@/components';

export const CountryDetailView = () => {
  const { id } = useParams();
  const { form, loading, fetchEntity, entity } = useDetailView(
    'countries-detail-view',
    'CreateCountryInput',
    'code',
    'enabled',
    'translations',
  );

  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('countries');
  const { translationsLanguage: currentTranslationLng } = useSettings();

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();

      if (!resp) return;

      setField('code', resp.code);
      setField('translations', resp.translations);
      setField('enabled', resp.enabled);
    })();
  }, []);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations],
  );

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !entity && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.countryLoadingError', { value: id })}
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto mt-2 flex w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-6 p-0 pt-4">
                <Stack className="items-start gap-3">
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.name')}
                      value={currentTranslationValue?.name ?? undefined}
                      onChange={(e) => setTranslationField('name', e.target.value)}
                      errors={state.translations?.errors}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.code')}
                      value={state.code?.value}
                      onChange={(e) => setField('code', e.target.value)}
                      errors={state.code?.errors}
                      required
                    />
                  </Stack>
                  <Stack className="mt-7 basis-full items-center gap-3 md:basis-1/3">
                    <Switch checked={state.enabled?.value} onCheckedChange={(e) => setField('enabled', e)} />
                    <Label>{t('details.basic.enabled')}</Label>
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
