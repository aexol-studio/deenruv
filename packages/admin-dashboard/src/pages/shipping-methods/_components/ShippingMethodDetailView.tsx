import { useCallback, useEffect, useState } from 'react';

import {
  Input,
  Label,
  Option,
  apiClient,
  SimpleSelect,
  RichTextEditor,
  useSettings,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  setInArrayBy,
  CF,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { CheckerCard } from '@/pages/shipping-methods/_components/CheckerCard';
import { CalculatorCard } from '@/pages/shipping-methods/_components/CalculatorCard';
import { TestCard } from '@/pages/shipping-methods/_components/TestCard';

const SHIPPING_METHOD_FORM_KEYS = [
  'CreateShippingMethodInput',
  'code',
  'translations',
  'checker',
  'calculator',
  'fulfillmentHandler',
  'customFields',
] as const;

export const ShippingMethodDetailView = () => {
  const { form, entity, fetchEntity, id } = useDetailView('shippingMethods-detail-view', ...SHIPPING_METHOD_FORM_KEYS);
  const {
    base: { setField, state },
  } = form;
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

  return (
    <main className="my-4">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex flex-wrap items-start gap-4 p-0 pt-4">
            <div className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
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
                  value={state.code?.value ?? undefined}
                  onChange={(e) => setField('code', e.target.value)}
                  errors={state.code?.errors}
                  required
                />
              </div>
            </div>
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={currentTranslationValue?.description ?? undefined}
                onContentChanged={(e) => setTranslationField('description', e)}
              />
            </div>
            <div className="flex basis-full">
              <SimpleSelect
                label={t('details.basic.fulfillmentHandler')}
                value={state.fulfillmentHandler?.value ?? undefined}
                onValueChange={(e) => setField('fulfillmentHandler', e)}
                options={fulfillmentHandlersOptions}
                errors={state.fulfillmentHandler?.errors}
              />
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'shippingMethods-detail-view'} />
        <EntityCustomFields
          entityName="shippingMethod"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            setField('customFields', customFields);
            if (translations) setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
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
      </div>
    </main>
  );
};
