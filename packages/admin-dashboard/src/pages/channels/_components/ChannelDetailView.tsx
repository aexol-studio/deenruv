import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Input,
  Label,
  MultipleSelector,
  type Option,
  apiClient,
  useSettings,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  CF,
  EntityCustomFields,
  SimpleSelect,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { CurrencyCode, LanguageCode } from '@deenruv/admin-types';
import { DefaultsCard } from '@/pages/channels/_components/DefaultsCard';

export const ChannelDetailView = () => {
  const { t } = useTranslation('channels');
  const { t: tCommon } = useTranslation('common');
  const [sellersOptions, setSellersOptions] = useState<Option[]>();
  const availableLanguages = useSettings((p) => p.availableLanguages);

  const { form, fetchEntity, entity, id } = useDetailView(
    'channels-detail-view',
    'CreateChannelInput',
    'code',
    'availableCurrencyCodes',
    'availableLanguageCodes',
    'token',
    'defaultCurrencyCode',
    'defaultLanguageCode',
    'defaultShippingZoneId',
    'defaultTaxZoneId',
    'sellerId',
    'pricesIncludeTax',
    'customFields',
  );

  const { base } = form;

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();
      if (!resp) return;

      base.setField('code', resp.code);
      base.setField('availableCurrencyCodes', resp.availableCurrencyCodes);
      base.setField('availableLanguageCodes', resp.availableLanguageCodes);
      base.setField('token', resp.token);
      base.setField('defaultCurrencyCode', resp.defaultCurrencyCode);
      base.setField('defaultLanguageCode', resp.defaultLanguageCode);
      base.setField('defaultShippingZoneId', resp.defaultShippingZone?.id || '');
      base.setField('defaultTaxZoneId', resp.defaultTaxZone?.id || '');
      base.setField('sellerId', resp.seller?.id);
      base.setField('pricesIncludeTax', resp.pricesIncludeTax);
    })();
  }, []);

  const fetchSellers = useCallback(async () => {
    const response = await apiClient('query')({
      sellers: [{}, { items: { id: true, name: true } }],
    });
    setSellersOptions(response.sellers.items.map((s) => ({ label: s.name, value: s.id })));
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [id, fetchSellers]);

  const languageOptions = useMemo(
    () => availableLanguages.map((el) => ({ label: `${tCommon(`languageCode.${el}`)} (${el})`, value: el })),
    [tCommon, availableLanguages],
  );

  const currencyOptions = useMemo((): Option[] => {
    const currencyArray = Object.values(CurrencyCode);

    return currencyArray.map((l) => ({ label: l, value: l }));
  }, []);

  const availableLanguageCodes = base.watch('availableLanguageCodes');
  const availableCurrencyCodes = base.watch('availableCurrencyCodes');

  return (
    <main>
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.code')}
                  value={base.watch('code') ?? undefined}
                  onChange={(e) => base.setField('code', e.target.value)}
                  errors={
                    base.formState.errors?.code?.message ? [base.formState.errors.code.message as string] : undefined
                  }
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.token')}
                  value={base.watch('token') ?? undefined}
                  onChange={(e) => base.setField('token', e.target.value)}
                  errors={
                    base.formState.errors?.token?.message ? [base.formState.errors.token.message as string] : undefined
                  }
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex basis-full md:basis-1/3">
                <SimpleSelect
                  label={t('details.basic.seller')}
                  value={base.watch('sellerId') ?? undefined}
                  onValueChange={(e) => base.setField('sellerId', e)}
                  options={sellersOptions}
                />
              </div>
              <div className="flex basis-full flex-col md:basis-1/3">
                <Label className="mb-2">{t('details.basic.languages')}</Label>
                <MultipleSelector
                  options={languageOptions}
                  value={availableLanguageCodes?.map((l: string) => ({ label: l, value: l }))}
                  placeholder={t('details.basic.languagePlaceholder')}
                  onChange={(options) => {
                    base.setField(
                      'availableLanguageCodes',
                      options.map((o) => o.value as LanguageCode),
                    );
                  }}
                  hideClearAllButton
                />
              </div>
              <div className="flex basis-full flex-col md:basis-1/3">
                <Label className="mb-2">{t('details.basic.currencies')}</Label>
                <MultipleSelector
                  options={currencyOptions}
                  value={availableCurrencyCodes?.map((c: string) => ({ label: c, value: c }))}
                  placeholder={t('details.basic.currencyPlaceholder')}
                  onChange={(options) => {
                    base.setField(
                      'availableCurrencyCodes',
                      options.map((o) => o.value as CurrencyCode),
                    );
                  }}
                  hideClearAllButton
                />
              </div>
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'channels-detail-view'} />
        <EntityCustomFields
          entityName="channel"
          id={id}
          onChange={(customFields) => {
            base.setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
          hideButton
        />
        <DefaultsCard
          availableLanguages={availableLanguageCodes ?? undefined}
          availableCurrencies={availableCurrencyCodes ?? undefined}
          onFieldChange={base.setField}
          defaultLanguage={base.watch('defaultLanguageCode') ?? undefined}
          defaultCurrency={base.watch('defaultCurrencyCode') ?? undefined}
          defaultTaxZone={base.watch('defaultTaxZoneId') ?? undefined}
          defaultShippingZone={base.watch('defaultShippingZoneId') ?? undefined}
          includeTax={base.watch('pricesIncludeTax') ?? undefined}
          onIncludeTaxChange={(e) => base.setField('pricesIncludeTax', e)}
          defaultLanguageErrors={
            base.formState.errors?.defaultLanguageCode?.message
              ? [base.formState.errors.defaultLanguageCode.message as string]
              : undefined
          }
          defaultShippingZoneErrors={
            base.formState.errors?.defaultShippingZoneId?.message
              ? [base.formState.errors.defaultShippingZoneId.message as string]
              : undefined
          }
          defaultTaxZoneErrors={
            base.formState.errors?.defaultTaxZoneId?.message
              ? [base.formState.errors.defaultTaxZoneId.message as string]
              : undefined
          }
        />
      </div>
    </main>
  );
};
