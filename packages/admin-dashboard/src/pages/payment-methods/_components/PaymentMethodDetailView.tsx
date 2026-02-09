import { useCallback, useEffect } from 'react';

import {
  useTranslation,
  CardIcons,
  CustomCard,
  DetailViewMarker,
  Input,
  Label,
  setInArrayBy,
  Switch,
  useDetailView,
  useSettings,
  CF,
  EntityCustomFields,
  RichTextEditor,
} from '@deenruv/react-ui-devkit';
import { OptionsCard } from '@/pages/payment-methods/_components/OptionsCard';

const PAYMENT_METHOD_FORM_KEYS = [
  'CreatePaymentMethodInput',
  'code',
  'enabled',
  'translations',
  'handler',
  'checker',
  'customFields',
] as const;

export const PaymentMethodDetailView = () => {
  const { form, fetchEntity, entity, id } = useDetailView('paymentMethods-detail-view', ...PAYMENT_METHOD_FORM_KEYS);
  const { base } = form;
  const { t } = useTranslation('paymentMethods');
  const { translationsLanguage: currentTranslationLng } = useSettings();

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      base.setField('code', res.code);
      base.setField('enabled', res.enabled);
      base.setField('translations', res.translations);
      base.setField('handler', {
        arguments: res.handler.args,
        code: res.handler.code,
      });
      base.setField('checker', {
        arguments: res.checker?.args || [],
        code: res.checker?.code || '',
      });
    })();
  }, []);

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
              <div className="mt-7 flex basis-full items-center gap-3 md:basis-1/3">
                <Switch checked={base.watch('enabled') ?? false} onCheckedChange={(e) => base.setField('enabled', e)} />
                <Label>{t('details.basic.enabled')}</Label>
              </div>
            </div>
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={currentTranslationValue?.description ?? ''}
                onContentChanged={(e) => setTranslationField('description', e)}
              />
            </div>
          </div>
        </CustomCard>

        <DetailViewMarker position={'paymentMethods-detail-view'} />
        <EntityCustomFields
          entityName="paymentMethod"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        <OptionsCard
          currentHandlerValue={base.watch('handler') ?? undefined}
          currentCheckerValue={base.watch('checker') ?? undefined}
          onHandlerValueChange={(handler) => base.setField('handler', handler)}
          onCheckerValueChange={(checker) => base.setField('checker', checker)}
          handlerErrors={base.formState.errors?.handler?.message ? [base.formState.errors.handler.message as string] : undefined}
        />
      </div>
    </main>
  );
};
