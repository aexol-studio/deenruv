import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Input,
  Label,
  Switch,
  Option,
  apiClient,
  SimpleSelect,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { CF, EntityCustomFields, Stack } from '@/components';

const TAX_RATES_FORM_KEYS = [
  'CreateTaxRateInput',
  'name',
  'enabled',
  'value',
  'categoryId',
  'zoneId',
  'customerGroupId',
  'customFields',
] as const;

export const TaxRateDetailView = () => {
  const { t } = useTranslation('taxRates');
  const [taxCategoriesOptions, setTaxCategoriesOptions] = useState<Option[]>([]);
  const [zonesOptions, setZonesOptions] = useState<Option[]>([]);

  const { form, entity, fetchEntity, id } = useDetailView('taxRates-detail-view', ...TAX_RATES_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

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
    fetchItemsForOptions();
  }, [id, fetchItemsForOptions]);

  useEffect(() => {
    fetchEntity();
  }, []);

  useEffect(() => {
    console.log('ENT', entity);
    if (!entity) return;
    setField('name', entity.name);
    setField('enabled', entity.enabled);
    setField('categoryId', entity.category.id);
    setField('customerGroupId', entity.customerGroup?.id);
    setField('zoneId', entity.zone.id);
    setField('value', entity.value);
  }, [entity]);

  return (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
            <div className="flex flex-col gap-4 p-0 pt-4">
              <Stack className="items-start gap-4">
                <Stack className="basis-full md:basis-1/2">
                  <Input
                    label={t('details.basic.name')}
                    value={state.name?.value ?? undefined}
                    onChange={(e) => setField('name', e.target.value)}
                    errors={state.name?.errors}
                    required
                  />
                </Stack>
                <Stack className="basis-full md:basis-1/2">
                  <Input
                    type="number"
                    label={t('details.basic.value')}
                    value={state.value?.value ?? undefined}
                    onChange={(e) => setField('value', +e.target.value)}
                    errors={state.value?.errors}
                    endAdornment={'%'}
                    min={0}
                    max={100}
                    required
                  />
                </Stack>
              </Stack>
              <Stack className="items-end gap-4">
                <Stack className="basis-full md:basis-1/2">
                  <SimpleSelect
                    label={t('details.basic.taxCategory')}
                    value={state.categoryId?.value ?? undefined}
                    onValueChange={(e) => setField('categoryId', e)}
                    options={taxCategoriesOptions}
                    errors={state.categoryId?.errors}
                    required
                  />
                </Stack>
                <Stack className="basis-full md:basis-1/2">
                  <SimpleSelect
                    label={t('details.basic.zone')}
                    value={state.zoneId?.value ?? undefined}
                    onValueChange={(e) => setField('zoneId', e)}
                    options={zonesOptions}
                    errors={state.zoneId?.errors}
                    required
                  />
                </Stack>
              </Stack>
              <Stack className="items-end gap-4">
                <Stack className="mb-2 basis-full items-center gap-3 md:basis-1/2">
                  <Switch checked={state.enabled?.value ?? undefined} onCheckedChange={(e) => setField('enabled', e)} />
                  <Label>{t('details.basic.enabled')}</Label>
                </Stack>
              </Stack>
            </div>
          </CustomCard>
          <DetailViewMarker position={'taxRates-detail-view'} />
          <EntityCustomFields
            entityName="taxRate"
            id={id}
            onChange={(customFields) => {
              setField('customFields', customFields);
            }}
            initialValues={
              entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
            }
          />
        </Stack>
      </div>
    </main>
  );
};
