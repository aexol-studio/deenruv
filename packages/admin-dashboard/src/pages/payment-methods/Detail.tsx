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
  Switch,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/payment-methods/_components/PageHeader';
import { PaymentMethodDetailsSelector, PaymentMethodDetailsType } from '@/graphql/paymentMethods';
import { LanguageCode } from '@deenruv/admin-types';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { OptionsCard } from '@/pages/payment-methods/_components/OptionsCard';
import { EntityCustomFields, Stack } from '@/components';

export const PaymentMethodsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('paymentMethods');
  const { t } = useTranslation('paymentMethods');
  const [loading, setLoading] = useState(id ? true : false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDetailsType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentTranslationLng, setCurrentTranslationLng] = useState(LanguageCode.en);

  const fetchPaymentMethod = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        paymentMethod: [
          {
            id,
          },
          PaymentMethodDetailsSelector,
        ],
      });
      setPaymentMethod(response.paymentMethod);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchPaymentMethod();
  }, [id, setLoading, fetchPaymentMethod]);

  const { state, setField } = useGFFLP(
    'UpdatePaymentMethodInput',
    'code',
    'customFields',
    'enabled',
    'translations',
    'handler',
    'checker',
  )({
    enabled: {
      initialValue: true,
    },
  });

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    if (!paymentMethod) return;

    setField('code', paymentMethod.code);
    setField('enabled', paymentMethod.enabled);
    setField('translations', paymentMethod.translations);
    setField('handler', {
      arguments: paymentMethod.handler.args,
      code: paymentMethod.handler.code,
    });
    setField('checker', {
      arguments: paymentMethod.checker?.args || [],
      code: paymentMethod.checker?.code || '',
    });
  }, [paymentMethod]);

  const createPaymentMethod = useCallback(() => {
    apiClient('mutation')({
      createPaymentMethod: [
        {
          input: {
            handler: state.handler!.validatedValue!,
            enabled: state.enabled!.value!,
            code: state.code!.validatedValue!,
            translations: state.translations!.validatedValue!,
            // checker: state.checker!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.paymentMethodCreatedSuccess'));
        navigate(Routes.paymentMethods.to(resp.createPaymentMethod.id));
      })
      .catch(() => toast.error(t('toasts.paymentMethodCreatedError')));
  }, [state, t, navigate]);

  const updatePaymentMethod = useCallback(() => {
    apiClient('mutation')({
      updatePaymentMethod: [
        {
          input: {
            id: id!,
            code: state.code?.validatedValue,
            handler: state.handler?.validatedValue,
            enabled: state.enabled?.validatedValue,
            translations: state.translations?.validatedValue,
            customFields: state.customFields?.validatedValue,
            checker: state.checker?.validatedValue?.code !== '' ? state.checker?.validatedValue : undefined,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.paymentMethodUpdateSuccess'));
        fetchPaymentMethod();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.paymentMethodUpdateError')));
  }, [state, resetCache, fetchPaymentMethod, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        code: state.code?.value,
        handler: state.handler?.value,
        enabled: state.enabled?.value,
        translations: state.translations?.value,
        customFields: state.customFields?.value,
      },
      {
        code: paymentMethod?.code,
        handler: paymentMethod?.handler,
        enabled: paymentMethod?.enabled,
        translations: paymentMethod?.translations,
        // customFields: paymentMethod?.customFields,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, paymentMethod, editMode]);

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
  ) : !paymentMethod && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.paymentMethodLoadingError', { value: id })}
    </div>
  ) : (
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          currentTranslationLng={currentTranslationLng}
          onCurrentLanguageChange={(e) => {
            setCurrentTranslationLng(e as LanguageCode);
          }}
          paymentMethod={paymentMethod}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createPaymentMethod}
          onEdit={updatePaymentMethod}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-wrap items-start gap-4 p-0 pt-4">
                <Stack className="flex w-full flex-wrap items-end gap-4 p-0 pt-4 xl:flex-nowrap">
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.name')}
                      value={currentTranslationValue?.name ?? undefined }
                      onChange={(e) => setTranslationField('name', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.code')}
                      value={state.code?.value ?? undefined }
                      onChange={(e) => setField('code', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/3">
                    <Switch checked={state.enabled?.value ?? undefined } onCheckedChange={(e) => setField('enabled', e)} />
                    <Label>{t('details.basic.enabled')}</Label>
                  </Stack>
                </Stack>
                <Stack column className="basis-full">
                  <Label className="mb-2">{t('details.basic.description')}</Label>
                  <RichTextEditor
                    content={currentTranslationValue?.description ?? undefined }
                    onContentChanged={(e) => setTranslationField('description', e)}
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          {id && <EntityCustomFields entityName="paymentMethod" id={id} />}
          <OptionsCard
            currentHandlerValue={state.handler?.value ?? undefined }
            currentCheckerValue={state.checker?.value ?? undefined }
            onHandlerValueChange={(handler) => setField('handler', handler)}
            onCheckerValueChange={(checker) => setField('checker', checker)}
          />
        </Stack>
      </div>
    </main>
  );
};
