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
  Option,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/tax-rates/_components/PageHeader';
import { TaxRateDetailsSelector, TaxRateDetailsType } from '@/graphql/taxRates';
import { SimpleSelect, Stack } from '@/components';

export const TaxRatesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('taxRates');
  const { t } = useTranslation('taxRates');
  const [loading, setLoading] = useState(id ? true : false);
  const [taxRate, setTaxRate] = useState<TaxRateDetailsType>();
  const [taxCategoriesOptions, setTaxCategoriesOptions] = useState<Option[]>([]);
  const [zonesOptions, setZonesOptions] = useState<Option[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const fetchTaxRate = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        taxRate: [
          {
            id,
          },
          TaxRateDetailsSelector,
        ],
      });
      setTaxRate(response.taxRate);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  const fetchItemsForOptions = useCallback(async () => {
    const response = await apiClient('query')({
      taxCategories: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
      zones: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
    });
    setTaxCategoriesOptions(response.taxCategories.items.map((c) => ({ label: c.name, value: c.id })));
    setZonesOptions(response.zones.items.map((z) => ({ label: z.name, value: z.id })));
  }, [setTaxCategoriesOptions, setZonesOptions]);

  useEffect(() => {
    setLoading(true);
    fetchTaxRate();
    fetchItemsForOptions();
  }, [id, setLoading, fetchTaxRate, fetchItemsForOptions]);

  const { state, setField } = useGFFLP(
    'UpdateTaxRateInput',
    'name',
    'categoryId',
    'customerGroupId',
    'enabled',
    'value',
    'zoneId',
  )({
    enabled: {
      initialValue: false,
    },
  });

  useEffect(() => {
    if (!taxRate) return;
    setField('name', taxRate.name);
    setField('enabled', taxRate.enabled);
    setField('categoryId', taxRate.category.id);
    setField('customerGroupId', taxRate.customerGroup?.id);
    setField('zoneId', taxRate.zone.id);
    setField('value', taxRate.value);
  }, [taxRate]);

  const createTaxRate = useCallback(() => {
    apiClient('mutation')({
      createTaxRate: [
        {
          input: {
            name: state.name!.validatedValue!,
            enabled: state.enabled!.validatedValue!,
            categoryId: state.categoryId!.validatedValue!,
            value: state.value!.validatedValue!,
            zoneId: state.zoneId!.validatedValue!,
            customerGroupId: state.customerGroupId?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.taxRateCreatedSuccess'));
        navigate(Routes.taxRates.to(resp.createTaxRate.id));
      })
      .catch(() => toast.error(t('toasts.taxRateCreatedError')));
  }, [state, t, navigate]);

  const updateTaxRate = useCallback(() => {
    apiClient('mutation')({
      updateTaxRate: [
        {
          input: {
            id: id!,
            name: state.name?.validatedValue,
            enabled: state.enabled?.validatedValue,
            categoryId: state.categoryId?.validatedValue,
            value: state.value?.validatedValue,
            zoneId: state.zoneId?.initialValue,
            customerGroupId: state.customerGroupId?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.taxRateUpdateSuccess'));
        fetchTaxRate();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.taxRateUpdateError')));
  }, [state, resetCache, fetchTaxRate, id, t]);

  useEffect(() => {
    console.log({
      name: state.name?.value,
      enabled: state.enabled?.validatedValue,
      categoryId: state.categoryId?.validatedValue,
      value: state.value?.validatedValue,
      zoneId: state.zoneId?.validatedValue,
      customerGroupId: state.customerGroupId?.validatedValue,
    });
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        enabled: state.enabled?.validatedValue,
        categoryId: state.categoryId?.validatedValue,
        value: state.value?.validatedValue,
        zoneId: state.zoneId?.validatedValue,
        customerGroupId: state.customerGroupId?.validatedValue,
      },
      {
        name: taxRate?.name,
        enabled: taxRate?.enabled,
        categoryId: taxRate?.category.id,
        value: taxRate?.value,
        zoneId: taxRate?.zone.id,
        customerGroupId: taxRate?.customerGroup?.id,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, taxRate, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !taxRate && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.taxRateLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          taxRate={taxRate}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createTaxRate}
          onEdit={updateTaxRate}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack className="items-end gap-4">
                  <Stack className="basis-full md:basis-1/2">
                    <Input
                      label={t('details.basic.name')}
                      value={state.name?.value}
                      onChange={(e) => setField('name', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/2">
                    <Input
                      type="number"
                      label={t('details.basic.value')}
                      value={state.value?.value}
                      onChange={(e) => setField('value', +e.target.value)}
                      required
                    />
                  </Stack>
                </Stack>
                <Stack className="items-end gap-4">
                  <Stack className="basis-full md:basis-1/2">
                    <SimpleSelect
                      label={t('details.basic.taxCategory')}
                      value={state.categoryId?.value}
                      onValueChange={(e) => setField('categoryId', e)}
                      options={taxCategoriesOptions}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/2">
                    <SimpleSelect
                      label={t('details.basic.zone')}
                      value={state.zoneId?.value}
                      onValueChange={(e) => setField('zoneId', e)}
                      options={zonesOptions}
                      required
                    />
                  </Stack>
                </Stack>
                <Stack className="items-end gap-4">
                  <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/2">
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
