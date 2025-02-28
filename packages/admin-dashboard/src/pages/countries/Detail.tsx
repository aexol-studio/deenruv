import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Routes,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  apiClient,
  Switch,
  useSettings,
  useRouteGuard,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP, setInArrayBy } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { CountryDetailsSelector, CountryDetailsType } from '@/graphql/countries';
import { Stack } from '@/components';
import { PageHeader } from '@/pages/countries/_components/PageHeader';
import { useValidators } from '@/hooks/useValidators.js';

export const CountriesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('countries-list');
  const { t } = useTranslation('countries');
  const [loading, setLoading] = useState(id ? true : false);
  const [country, setCountry] = useState<CountryDetailsType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { translationsLanguage: currentTranslationLng } = useSettings();
  useRouteGuard({ shouldBlock: !buttonDisabled });
  const { translationsValidator, stringValidator } = useValidators();

  const fetchCountry = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        country: [
          {
            id,
          },
          CountryDetailsSelector,
        ],
      });
      setCountry(response.country);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchCountry();
  }, [id, setLoading, fetchCountry]);

  const { state, setField, checkIfAllFieldsAreValid, haveValidFields } = useGFFLP(
    'CreateCountryInput',
    'translations',
    'code',
    'enabled',
  )({
    enabled: {
      initialValue: true,
    },
    code: stringValidator(t('validation.required')),
    translations: translationsValidator,
  });

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    if (!country) {
      setField('enabled', true);
    } else {
      setField('code', country.code);
      setField('translations', country.translations);
      setField('enabled', country.enabled);
    }
  }, [country]);

  const createCountry = useCallback(() => {
    setButtonDisabled(true);
    const valid = checkIfAllFieldsAreValid();
    if (!valid) return;

    apiClient('mutation')({
      createCountry: [
        {
          input: {
            code: state.code!.validatedValue,
            enabled: state.enabled!.validatedValue,
            translations: state.translations!.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.countryCreatedSuccess'));
        navigate(Routes.countries.to(resp.createCountry.id));
      })
      .catch(() => toast.error(t('toasts.countryCreatedError')));
  }, [state, t, navigate]);

  const updateCountry = useCallback(() => {
    apiClient('mutation')({
      updateCountry: [
        {
          input: {
            id: id!,
            code: state.code?.validatedValue,
            enabled: state.enabled?.validatedValue,
            translations: state.translations?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.countryUpdateSuccess'));
        fetchCountry();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.countryUpdateError')));
  }, [state, resetCache, fetchCountry, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        code: state.code?.value,
        translations: state.translations?.value,
        enabled: state.enabled?.value !== undefined ? state.enabled.value : true,
      },
      {
        code: country?.code,
        translations: country?.translations,
        enabled: editMode ? country?.enabled : true,
      },
    );

    setButtonDisabled(!haveValidFields || areEqual);
  }, [state, country, editMode]);

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
  ) : !country && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.countryLoadingError', { value: id })}
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto mt-2 flex w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          country={country}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createCountry}
          onEdit={updateCountry}
        />
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
