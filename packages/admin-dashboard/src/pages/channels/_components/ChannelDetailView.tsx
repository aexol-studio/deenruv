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

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();

      if (!resp) return;

      console.log('CH', resp);

      setField('code', resp.code);
      setField('availableCurrencyCodes', resp.availableCurrencyCodes);
      setField('availableLanguageCodes', resp.availableLanguageCodes);
      setField('token', resp.token);
      setField('defaultCurrencyCode', resp.defaultCurrencyCode);
      setField('defaultLanguageCode', resp.defaultLanguageCode);
      setField('defaultShippingZoneId', resp.defaultShippingZone?.id || '');
      setField('defaultTaxZoneId', resp.defaultTaxZone?.id || '');
      setField('sellerId', resp.seller?.id);
      setField('pricesIncludeTax', resp.pricesIncludeTax);
    })();
  }, []);

  const fetchSellers = useCallback(async () => {
    const response = await apiClient('query')({
      sellers: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
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

  return (
    <main>
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.code')}
                  value={state.code?.value ?? undefined}
                  onChange={(e) => setField('code', e.target.value)}
                  errors={state.code?.errors}
                  required
                />
              </div>
              <div className="flex basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.token')}
                  value={state.token?.value ?? undefined}
                  onChange={(e) => setField('token', e.target.value)}
                  errors={state.token?.errors}
                  required
                />
              </div>
            </div>
            <div className="gap-3">
              <div className="flex basis-full md:basis-1/3">
                <SimpleSelect
                  label={t('details.basic.seller')}
                  value={state?.sellerId?.value ?? undefined}
                  onValueChange={(e) => setField('sellerId', e)}
                  options={sellersOptions}
                />
              </div>
              <div className="flex basis-full flex-col md:basis-1/3">
                <Label className="mb-2">{t('details.basic.languages')}</Label>
                <MultipleSelector
                  options={languageOptions}
                  value={state?.availableLanguageCodes?.value?.map((l) => ({ label: l, value: l }))}
                  placeholder={t('details.basic.languagePlaceholder')}
                  onChange={(options) => {
                    setField(
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
                  value={state?.availableCurrencyCodes?.value?.map((c) => ({ label: c, value: c }))}
                  placeholder={t('details.basic.currencyPlaceholder')}
                  onChange={(options) => {
                    setField(
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
            setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
          hideButton
        />
        <DefaultsCard
          availableLanguages={state.availableLanguageCodes?.value ?? undefined}
          availableCurrencies={state.availableCurrencyCodes?.value ?? undefined}
          onFieldChange={setField}
          defaultLanguage={state.defaultLanguageCode?.value ?? undefined}
          defaultCurrency={state.defaultCurrencyCode?.value ?? undefined}
          defaultTaxZone={state.defaultTaxZoneId?.value ?? undefined}
          defaultShippingZone={state.defaultShippingZoneId?.value ?? undefined}
          includeTax={state.pricesIncludeTax?.value ?? undefined}
          onIncludeTaxChange={(e) => setField('pricesIncludeTax', e)}
          defaultLanguageErrors={state.defaultLanguageCode?.errors}
          defaultShippingZoneErrors={state.defaultShippingZoneId?.errors}
          defaultTaxZoneErrors={state.defaultTaxZoneId?.errors}
        />
      </div>
    </main>
  );
};
