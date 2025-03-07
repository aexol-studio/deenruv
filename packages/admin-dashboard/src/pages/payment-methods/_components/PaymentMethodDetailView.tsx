import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DetailViewMarker,
  Input,
  Label,
  Switch,
  useDetailView,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { setInArrayBy } from '@/lists/useGflp';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { OptionsCard } from '@/pages/payment-methods/_components/OptionsCard';
import { EntityCustomFields, Stack } from '@/components';

const PAYMENT_METHOD_FORM_KEYS = [
  'CreatePaymentMethodInput',
  'code',
  'enabled',
  'translations',
  'handler',
  'checker',
] as const;

export const PaymentMethodDetailView = () => {
  const { id } = useParams();
  const { form, loading, fetchEntity, entity } = useDetailView(
    'paymentMethods-detail-view',
    ...PAYMENT_METHOD_FORM_KEYS,
  );
  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('paymentMethods');
  const { translationsLanguage: currentTranslationLng } = useSettings();

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      setField('code', res.code);
      setField('enabled', res.enabled);
      setField('translations', res.translations);
      setField('handler', {
        arguments: res.handler.args,
        code: res.handler.code,
      });
      setField('checker', {
        arguments: res.checker?.args || [],
        code: res.checker?.code || '',
      });
    })();
  }, []);

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
      {t('toasts.paymentMethodLoadingError', { value: id })}
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
                  <Stack className="mt-7 basis-full items-center gap-3 md:basis-1/3">
                    <Switch
                      checked={state.enabled?.value ?? undefined}
                      onCheckedChange={(e) => setField('enabled', e)}
                    />
                    <Label>{t('details.basic.enabled')}</Label>
                  </Stack>
                </Stack>
                <Stack column className="basis-full">
                  <Label className="mb-2">{t('details.basic.description')}</Label>
                  <RichTextEditor
                    content={currentTranslationValue?.description ?? undefined}
                    onContentChanged={(e) => setTranslationField('description', e)}
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          <DetailViewMarker position={'paymentMethods-detail-view'} />
          {id && <EntityCustomFields entityName="paymentMethod" id={id} />}
          <OptionsCard
            currentHandlerValue={state.handler?.value ?? undefined}
            currentCheckerValue={state.checker?.value ?? undefined}
            onHandlerValueChange={(handler) => setField('handler', handler)}
            onCheckerValueChange={(checker) => setField('checker', checker)}
            handlerErrors={state.handler?.errors}
          />
        </Stack>
      </div>
    </main>
  );
};
