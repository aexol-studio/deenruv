import { useCallback, useEffect, useState } from 'react';
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
  CF,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';

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

  const { base } = form;

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
    base.setField('name', entity.name);
    base.setField('enabled', entity.enabled);
    base.setField('categoryId', entity.category.id);
    base.setField('customerGroupId', entity.customerGroup?.id);
    base.setField('zoneId', entity.zone.id);
    base.setField('value', entity.value);
  }, [entity]);

  return (
    <main className="my-4 min-h-96">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex flex-col gap-4 p-0 pt-4">
            <div className="flex items-start gap-4">
              <div className="flex basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.name')}
                  value={base.watch('name') ?? undefined}
                  onChange={(e) => base.setField('name', e.target.value)}
                  errors={base.formState.errors?.name?.message ? [base.formState.errors.name.message as string] : undefined}
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/2">
                <Input
                  type="number"
                  label={t('details.basic.value')}
                  value={base.watch('value') ?? undefined}
                  onChange={(e) => base.setField('value', +e.target.value)}
                  errors={base.formState.errors?.value?.message ? [base.formState.errors.value.message as string] : undefined}
                  endAdornment={'%'}
                  min={0}
                  max={100}
                  required
                />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex basis-full md:basis-1/2">
                <SimpleSelect
                  label={t('details.basic.taxCategory')}
                  value={base.watch('categoryId') ?? undefined}
                  onValueChange={(e) => base.setField('categoryId', e)}
                  options={taxCategoriesOptions}
                  errors={base.formState.errors?.categoryId?.message ? [base.formState.errors.categoryId.message as string] : undefined}
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/2">
                <SimpleSelect
                  label={t('details.basic.zone')}
                  value={base.watch('zoneId') ?? undefined}
                  onValueChange={(e) => base.setField('zoneId', e)}
                  options={zonesOptions}
                  errors={base.formState.errors?.zoneId?.message ? [base.formState.errors.zoneId.message as string] : undefined}
                  required
                />
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="mb-2 flex basis-full items-center gap-3 md:basis-1/2">
                <Switch checked={base.watch('enabled') ?? undefined} onCheckedChange={(e) => base.setField('enabled', e)} />
                <Label>{t('details.basic.enabled')}</Label>
              </div>
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'taxRates-detail-view'} />
        <EntityCustomFields
          entityName="taxRate"
          id={id}
          onChange={(customFields) => {
            base.setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
          hideButton
        />
      </div>
    </main>
  );
};
