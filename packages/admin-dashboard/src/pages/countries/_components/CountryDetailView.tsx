import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Input,
  Label,
  Switch,
  useSettings,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  setInArrayBy,
} from '@deenruv/react-ui-devkit';

export const CountryDetailView = () => {
  const { form, entity, fetchEntity, id } = useDetailView(
    'countries-detail-view',
    'CreateCountryInput',
    'code',
    'enabled',
    'translations',
    'customFields',
  );

  const {
    base: { setField, state },
  } = form;
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

  return (
    <main className="min-h-96">
      <div className="mx-auto mt-2 flex w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex items-start gap-3">
            <div className="flex basis-full md:basis-1/3">
              <Input
                label={t('details.basic.name')}
                value={currentTranslationValue?.name ?? undefined}
                onChange={(e) => setTranslationField('name', e.target.value)}
                errors={state.translations?.errors}
                required
              />
            </div>
            <div className="flex basis-full md:basis-1/3">
              <Input
                label={t('details.basic.code')}
                value={state.code?.value}
                onChange={(e) => setField('code', e.target.value)}
                errors={state.code?.errors}
                required
              />
            </div>
            <div className="mt-7 flex basis-full items-center gap-3 md:basis-1/3">
              <Switch checked={state.enabled?.value} onCheckedChange={(e) => setField('enabled', e)} />
              <Label>{t('details.basic.enabled')}</Label>
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'countries-detail-view'} />
      </div>
    </main>
  );
};
