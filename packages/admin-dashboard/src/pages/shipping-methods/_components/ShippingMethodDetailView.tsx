import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Option,
  apiClient,
  SimpleSelect,
  RichTextEditor,
  useSettings,
  useDetailView,
  DetailViewMarker,
} from '@deenruv/react-ui-devkit';
import { setInArrayBy } from '@/lists/useGflp';
import { CheckerCard } from '@/pages/shipping-methods/_components/CheckerCard';
import { CalculatorCard } from '@/pages/shipping-methods/_components/CalculatorCard';
import { TestCard } from '@/pages/shipping-methods/_components/TestCard';
import { EntityCustomFields, Stack } from '@/components';

const SHIPPING_METHOD_FORM_KEYS = [
  'CreateShippingMethodInput',
  'code',
  'translations',
  'checker',
  'calculator',
  'fulfillmentHandler',
] as const;

export const ShippingMethodDetailView = () => {
  const { id } = useParams();
  const { form, loading, fetchEntity, entity } = useDetailView(
    'shippingMethods-detail-view',
    ...SHIPPING_METHOD_FORM_KEYS,
  );
  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('shippingMethods');
  const [fulfillmentHandlersOptions, setFulfillmentHandlersOptions] = useState<Option[]>();
  const { translationsLanguage: currentTranslationLng } = useSettings();

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      setField('code', res.code);
      setField('translations', res.translations);
      setField('checker', {
        arguments: res.checker?.args || [],
        code: res.checker?.code || '',
      });
      setField('calculator', {
        arguments: res.calculator?.args || [],
        code: res.calculator?.code || '',
      });
      setField('fulfillmentHandler', res.fulfillmentHandlerCode);
    })();
  }, []);

  const fetchFulfillmentHandlers = useCallback(async () => {
    const response = await apiClient('query')({
      fulfillmentHandlers: { code: true, description: true },
    });

    setFulfillmentHandlersOptions(
      response.fulfillmentHandlers.map((h) => ({
        label: h.description,
        value: h.code,
      })),
    );
  }, []);

  useEffect(() => {
    fetchFulfillmentHandlers();
  }, [id, fetchFulfillmentHandlers]);

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

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
      {t('toasts.shippingMethodLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-wrap items-start gap-4 p-0 pt-4">
                <Stack className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
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
                      value={state.code?.value ?? undefined}
                      onChange={(e) => setField('code', e.target.value)}
                      errors={state.code?.errors}
                      required
                    />
                  </Stack>
                </Stack>
                <Stack column className="basis-full">
                  <Label className="mb-2">{t('details.basic.description')}</Label>
                  <RichTextEditor
                    content={currentTranslationValue?.description ?? undefined}
                    onContentChanged={(e) => setTranslationField('description', e)}
                  />
                </Stack>
                <Stack className="basis-full">
                  <SimpleSelect
                    label={t('details.basic.fulfillmentHandler')}
                    value={state.fulfillmentHandler?.value ?? undefined}
                    onValueChange={(e) => setField('fulfillmentHandler', e)}
                    options={fulfillmentHandlersOptions}
                    errors={state.fulfillmentHandler?.errors}
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          <DetailViewMarker position={'shippingMethods-detail-view'} />
          {id && <EntityCustomFields entityName="shippingMethod" id={id} />}
          <CheckerCard
            currentCheckerValue={state.checker?.value ?? undefined}
            onCheckerValueChange={(checker) => checker && setField('checker', checker)}
            errors={state.checker?.errors}
          />
          <CalculatorCard
            currentCalculatorValue={state.calculator?.value ?? undefined}
            onCalculatorValueChange={(calculator) => calculator && setField('calculator', calculator)}
            errors={state.calculator?.errors}
          />
          <TestCard calculator={state.calculator?.value ?? undefined} checker={state.checker?.value ?? undefined} />
        </Stack>
      </div>
    </main>
  );
};
