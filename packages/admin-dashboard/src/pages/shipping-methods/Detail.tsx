import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/graphql/client';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Option } from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { Routes } from '@/utils';
import { PageHeader } from '@/pages/shipping-methods/_components/PageHeader';
import { ShippingMethodDetailsSelector, ShippingMethodDetailsType } from '@/graphql/shippingMethods';
import { LanguageCode } from '@deenruv/admin-types';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { ModalCard } from '@/pages/shipping-methods/_components/ModalCard';
import { CheckerCard } from '@/pages/shipping-methods/_components/CheckerCard';
import { CalculatorCard } from '@/pages/shipping-methods/_components/CalculatorCard';
import { TestCard } from '@/pages/shipping-methods/_components/TestCard';
import { SimpleSelect, Stack } from '@/components';

export const ShippingMethodsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('shippingMethods');
  const { t } = useTranslation('shippingMethods');
  const [loading, setLoading] = useState(id ? true : false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodDetailsType>();
  const [fulfillmentHandlersOptions, setFulfillmentHandlersOptions] = useState<Option[]>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [currentTranslationLng, setCurrentTranslationLng] = useState(LanguageCode.en);

  const fetchShippingMethod = useCallback(async () => {
    if (id) {
      const response = await apiCall()('query')({
        shippingMethod: [
          {
            id,
          },
          ShippingMethodDetailsSelector,
        ],
      });
      setShippingMethod(response.shippingMethod);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  const fetchFulfillmentHandlers = useCallback(async () => {
    const response = await apiCall()('query')({
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
    setLoading(true);
    fetchShippingMethod();
    fetchFulfillmentHandlers();
  }, [id, setLoading, fetchShippingMethod, fetchFulfillmentHandlers]);

  const { state, setField } = useGFFLP(
    'UpdateShippingMethodInput',
    'code',
    'customFields',
    'translations',
    'checker',
    'calculator',
    'fulfillmentHandler',
  )({});

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  useEffect(() => {
    if (!shippingMethod) return;

    setField('code', shippingMethod.code);
    setField('translations', shippingMethod.translations);
    setField('checker', {
      arguments: shippingMethod.checker?.args || [],
      code: shippingMethod.checker?.code || '',
    });
    setField('calculator', {
      arguments: shippingMethod.calculator?.args || [],
      code: shippingMethod.calculator?.code || '',
    });
    setField('fulfillmentHandler', shippingMethod.fulfillmentHandlerCode);
  }, [shippingMethod]);

  const createShippingMethod = useCallback(() => {
    apiCall()('mutation')({
      createShippingMethod: [
        {
          input: {
            calculator: state.calculator!.validatedValue!,
            fulfillmentHandler: state.fulfillmentHandler!.validatedValue!,
            code: state.code!.validatedValue!,
            translations: state.translations!.validatedValue!,
            checker: state.checker!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.shippingMethodCreatedSuccess'));
        navigate(Routes.shippingMethods.to(resp.createShippingMethod.id));
      })
      .catch(() => toast.error(t('toasts.shippingMethodCreatedError')));
  }, [state, t, navigate]);

  const updateShippingMethod = useCallback(() => {
    apiCall()('mutation')({
      updateShippingMethod: [
        {
          input: {
            id: id!,
            code: state.code?.validatedValue,
            calculator: state.calculator?.validatedValue,
            fulfillmentHandler: state.fulfillmentHandler?.validatedValue,
            translations: state.translations!.validatedValue!,
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
        toast.message(t('toasts.shippingMethodUpdateSuccess'));
        fetchShippingMethod();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.shippingMethodUpdateError')));
  }, [state, resetCache, fetchShippingMethod, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        code: state.code?.value,
        calculator: state.calculator?.value,
        fulfillmentHandler: state.fulfillmentHandler?.value,
        translations: state.translations?.value,
        customFields: state.customFields?.value,
      },
      {
        code: shippingMethod?.code,
        calculator: shippingMethod?.calculator,
        fulfillmentHandler: shippingMethod?.fulfillmentHandlerCode,
        translations: shippingMethod?.translations,
        // customFields: shippingMethod?.customFields,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, shippingMethod, editMode]);

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
  ) : !shippingMethod && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.shippingMethodLoadingError', { value: id })}
    </div>
  ) : (
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          currentTranslationLng={currentTranslationLng}
          onCurrentLanguageChange={(e) => {
            setCurrentTranslationLng(e as LanguageCode);
          }}
          shippingMethod={shippingMethod}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createShippingMethod}
          onEdit={updateShippingMethod}
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
                      value={currentTranslationValue?.name}
                      onChange={(e) => setTranslationField('name', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/3">
                    <Input
                      label={t('details.basic.code')}
                      value={state.code?.value}
                      onChange={(e) => setField('code', e.target.value)}
                      required
                    />
                  </Stack>
                </Stack>
                <Stack column className="basis-full">
                  <Label className="mb-2">{t('details.basic.description')}</Label>
                  <RichTextEditor
                    content={currentTranslationValue?.description}
                    onContentChanged={(e) => setTranslationField('description', e)}
                  />
                </Stack>
                <Stack className="basis-full">
                  <SimpleSelect
                    label={t('details.basic.fulfillmentHandler')}
                    value={state.fulfillmentHandler?.value}
                    onValueChange={(e) => setField('fulfillmentHandler', e)}
                    options={fulfillmentHandlersOptions}
                  />
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          <ModalCard
            currentTranslationValue={currentTranslationValue?.customFields}
            onValuesChange={(translationCustomFields) => setTranslationField('customFields', translationCustomFields)}
          />
          <CheckerCard
            currentCheckerValue={state.checker?.value}
            onCheckerValueChange={(checker) => setField('checker', checker)}
          />
          <CalculatorCard
            currentCalculatorValue={state.calculator?.value}
            onCalculatorValueChange={(calculator) => setField('calculator', calculator)}
          />
          <TestCard calculator={state.calculator?.value} checker={state.checker?.value} />
        </Stack>
      </div>
    </main>
  );
};
