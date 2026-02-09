import { useCallback, useEffect } from 'react';

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
  useTranslation,
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

  const { base } = form;
  const { t } = useTranslation('countries');
  const { translationsLanguage: currentTranslationLng } = useSettings();

  const translations = base.watch('translations') || [];
  const currentTranslationValue = translations.find((v: any) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();

      if (!resp) return;

      base.setField('code', resp.code);
      base.setField('translations', resp.translations);
      base.setField('enabled', resp.enabled);
    })();
  }, []);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      const baseTranslation = currentTranslationValue ?? {
        languageCode: currentTranslationLng,
        name: '',
      };

      base.setField(
        'translations',
        setInArrayBy(translations, (t: any) => t.languageCode === currentTranslationLng, {
          ...baseTranslation,
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations, currentTranslationValue],
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
                errors={base.formState.errors?.translations?.message ? [base.formState.errors.translations.message as string] : undefined}
                required
              />
            </div>
            <div className="flex basis-full md:basis-1/3">
              <Input
                label={t('details.basic.code')}
                value={base.watch('code')}
                onChange={(e) => base.setField('code', e.target.value)}
                errors={base.formState.errors?.code?.message ? [base.formState.errors.code.message as string] : undefined}
                required
              />
            </div>
            <div className="mt-7 flex basis-full items-center gap-3 md:basis-1/3">
              <Switch checked={base.watch('enabled')} onCheckedChange={(e) => base.setField('enabled', e)} />
              <Label>{t('details.basic.enabled')}</Label>
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'countries-detail-view'} />
      </div>
    </main>
  );
};
