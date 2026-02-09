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
  const { base } = form;
  const { t } = useTranslation('shippingMethods');
  const [fulfillmentHandlersOptions, setFulfillmentHandlersOptions] = useState<Option[]>();
  const { translationsLanguage: currentTranslationLng } = useSettings();

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      base.setField('code', res.code);
      base.setField('translations', res.translations);
      base.setField('checker', {
        arguments: res.checker?.args || [],
        code: res.checker?.code || '',
      });
      base.setField('calculator', {
        arguments: res.calculator?.args || [],
        code: res.calculator?.code || '',
      });
      base.setField('fulfillmentHandler', res.fulfillmentHandlerCode);
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

  const translations = base.watch('translations') || [];
  const currentTranslationValue = translations.find((v: any) => v.languageCode === currentTranslationLng);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      // Merge with existing translation to preserve other fields (name, description, etc.)
      const baseTranslation = currentTranslationValue ?? {
        languageCode: currentTranslationLng,
        name: '',
        description: '',
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
    <main className="my-4">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex flex-wrap items-start gap-4 p-0 pt-4">
            <div className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.name')}
                  value={currentTranslationValue?.name ?? ''}
                  onChange={(e) => setTranslationField('name', e.target.value)}
                  errors={base.formState.errors?.translations?.message ? [base.formState.errors.translations.message as string] : undefined}
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.code')}
                  value={base.watch('code') ?? ''}
                  onChange={(e) => base.setField('code', e.target.value)}
                  errors={base.formState.errors?.code?.message ? [base.formState.errors.code.message as string] : undefined}
                  required
                />
              </div>
            </div>
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={currentTranslationValue?.description ?? ''}
                onContentChanged={(e) => setTranslationField('description', e)}
              />
            </div>
            <div className="flex basis-full">
              <SimpleSelect
                label={t('details.basic.fulfillmentHandler')}
                value={base.watch('fulfillmentHandler') ?? ''}
                onValueChange={(e) => base.setField('fulfillmentHandler', e)}
                options={fulfillmentHandlersOptions}
                errors={base.formState.errors?.fulfillmentHandler?.message ? [base.formState.errors.fulfillmentHandler.message as string] : undefined}
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
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        <CheckerCard
          currentCheckerValue={base.watch('checker') ?? undefined}
          onCheckerValueChange={(checker) => checker && base.setField('checker', checker)}
          errors={base.formState.errors?.checker?.message ? [base.formState.errors.checker.message as string] : undefined}
        />
        <CalculatorCard
          currentCalculatorValue={base.watch('calculator') ?? undefined}
          onCalculatorValueChange={(calculator) => calculator && base.setField('calculator', calculator)}
          errors={base.formState.errors?.calculator?.message ? [base.formState.errors.calculator.message as string] : undefined}
        />
        <TestCard calculator={base.watch('calculator') ?? undefined} checker={base.watch('checker') ?? undefined} />
      </div>
    </main>
  );
};
