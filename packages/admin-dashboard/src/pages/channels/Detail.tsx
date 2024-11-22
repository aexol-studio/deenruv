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
  MultipleSelector,
  type Option,
  useServer,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/channels/_components/PageHeader';
import { ChannelDetailsSelector, ChannelDetailsType } from '@/graphql/channels';
import { CurrencyCode, LanguageCode } from '@deenruv/admin-types';
import commonJson from '@/locales/en/common.json';
import { DefaultsCard } from '@/pages/channels/_components/DefaultsCard';
import { SimpleSelect, Stack } from '@/components';

export const ChannelsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('channels');
  const { t } = useTranslation('channels');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(id ? true : false);
  const [channel, setChannel] = useState<ChannelDetailsType>();
  const [sellersOptions, setSellersOptions] = useState<Option[]>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const countries = useServer((p) => p.countries);

  const fetchChannel = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        channel: [
          {
            id,
          },
          ChannelDetailsSelector,
        ],
      });
      setChannel(response.channel);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

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
    setLoading(true);
    fetchChannel();
    fetchSellers();
  }, [id, setLoading, fetchChannel, fetchSellers]);

  const { state, setField } = useGFFLP(
    'UpdateChannelInput',
    'availableCurrencyCodes',
    'availableLanguageCodes',
    'code',
    'defaultCurrencyCode',
    'defaultLanguageCode',
    'defaultShippingZoneId',
    'defaultTaxZoneId',
    'sellerId',
    'token',
    'pricesIncludeTax',
  )({
    pricesIncludeTax: {
      initialValue: false,
    },
  });

  useEffect(() => {
    if (!channel) return;
    setField('availableCurrencyCodes', channel.availableCurrencyCodes);
    setField('availableLanguageCodes', channel.availableLanguageCodes);
    setField('code', channel.code);
    setField('token', channel.token);
    setField('defaultCurrencyCode', channel.defaultCurrencyCode);
    setField('defaultLanguageCode', channel.defaultLanguageCode);
    setField('defaultShippingZoneId', channel.defaultShippingZone?.id);
    setField('defaultTaxZoneId', channel.defaultTaxZone?.id);
    setField('sellerId', channel.seller?.id);
    setField('pricesIncludeTax', channel.pricesIncludeTax);
  }, [channel]);

  const createChannel = useCallback(() => {
    apiClient('mutation')({
      createChannel: [
        {
          input: {
            availableCurrencyCodes: state.availableCurrencyCodes?.validatedValue,
            availableLanguageCodes: state.availableLanguageCodes?.validatedValue,
            code: state.code!.validatedValue!,
            defaultCurrencyCode: state.defaultCurrencyCode?.validatedValue,
            defaultLanguageCode: state.defaultLanguageCode!.validatedValue!,
            defaultShippingZoneId: state.defaultShippingZoneId!.validatedValue!,
            defaultTaxZoneId: state.defaultTaxZoneId!.validatedValue!,
            pricesIncludeTax: state.pricesIncludeTax!.validatedValue!,
            sellerId: state.sellerId?.validatedValue,
            token: state.token!.validatedValue!,
          },
        },
        {
          '...on Channel': {
            id: true,
          },
          '...on LanguageNotAvailableError': {
            message: true,
          },
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.channelCreatedSuccess'));
        if ('id' in resp.createChannel && resp.createChannel.id) {
          navigate(Routes.channels.to(resp.createChannel.id!));
        }
      })
      .catch(() => toast.error(t('toasts.channelCreatedError')));
  }, [state, t, navigate]);

  const updateChannel = useCallback(() => {
    apiClient('mutation')({
      updateChannel: [
        {
          input: {
            id: id!,
            availableCurrencyCodes: state.availableCurrencyCodes?.validatedValue,
            availableLanguageCodes: state.availableLanguageCodes?.validatedValue,
            code: state.code?.validatedValue,
            defaultCurrencyCode: state.defaultCurrencyCode?.validatedValue,
            defaultLanguageCode: state.defaultLanguageCode?.validatedValue,
            defaultShippingZoneId: state.defaultShippingZoneId?.validatedValue,
            defaultTaxZoneId: state.defaultTaxZoneId?.validatedValue,
            pricesIncludeTax: state.pricesIncludeTax?.validatedValue,
            sellerId: state.sellerId?.validatedValue,
            token: state.token?.validatedValue,
          },
        },
        {
          '...on Channel': {
            id: true,
          },
          '...on LanguageNotAvailableError': {
            message: true,
          },
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.channelUpdateSuccess'));
        fetchChannel();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.channelUpdateError')));
  }, [state, resetCache, fetchChannel, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        availableCurrencyCodes: state.availableCurrencyCodes?.value,
        availableLanguageCodes: state.availableLanguageCodes?.value,
        code: state.code?.value,
        defaultCurrencyCode: state.defaultCurrencyCode?.value,
        defaultLanguageCode: state.defaultLanguageCode?.value,
        defaultShippingZoneId: state.defaultShippingZoneId?.value,
        defaultTaxZoneId: state.defaultTaxZoneId?.value,
        pricesIncludeTax: state.pricesIncludeTax?.value,
        sellerId: state.sellerId?.value,
        token: state.token?.value,
      },
      {
        availableCurrencyCodes: channel?.availableCurrencyCodes,
        availableLanguageCodes: channel?.availableLanguageCodes,
        code: channel?.code,
        defaultCurrencyCode: channel?.defaultCurrencyCode,
        defaultLanguageCode: channel?.defaultLanguageCode,
        defaultShippingZoneId: channel?.defaultShippingZone?.id,
        defaultTaxZoneId: channel?.defaultTaxZone?.id,
        pricesIncludeTax: channel?.pricesIncludeTax,
        sellerId: channel?.seller?.id,
        token: channel?.token,
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, channel, editMode]);

  const languageOptions = useMemo((): Option[] => {
    return countries.map((l) => ({
      label: tCommon(`languageCode.${l.name as keyof typeof commonJson.languageCode}`),
      value: l.code,
    }));
  }, [countries, tCommon]);

  const currencyOptions = useMemo((): Option[] => {
    const currencyArray = Object.values(CurrencyCode);

    return currencyArray.map((l) => ({ label: l, value: l }));
  }, []);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !channel && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.channelLoadingError', { value: id })}
    </div>
  ) : (
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          channel={channel}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createChannel}
          onEdit={updateChannel}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
                <Stack className="gap-3">
                  <Stack className="basis-full md:basis-1/2">
                    <Input
                      label={t('details.basic.code')}
                      value={state.code?.value}
                      onChange={(e) => setField('code', e.target.value)}
                      required
                    />
                  </Stack>
                  <Stack className="basis-full md:basis-1/2">
                    <Input
                      label={t('details.basic.token')}
                      value={state.token?.value}
                      onChange={(e) => setField('token', e.target.value)}
                      required
                    />
                  </Stack>
                </Stack>
                <Stack className="gap-3">
                  <Stack className="basis-full md:basis-1/3">
                    <SimpleSelect
                      label={t('details.basic.seller')}
                      value={channel?.seller?.id}
                      onValueChange={(e) => setField('sellerId', e)}
                      options={sellersOptions}
                    />
                  </Stack>
                  <Stack column className="basis-full md:basis-1/3">
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
                  </Stack>
                  <Stack column className="basis-full md:basis-1/3">
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
                  </Stack>
                </Stack>
              </CardContent>
            </CardHeader>
          </Card>
          <DefaultsCard
            availableLanguages={state.availableLanguageCodes?.value}
            availableCurrencies={state.availableCurrencyCodes?.value}
            onFieldChange={setField}
            defaultLanguage={state.defaultLanguageCode?.value}
            defaultCurrency={state.defaultCurrencyCode?.value}
            defaultTaxZone={state.defaultTaxZoneId?.value}
            defaultShippingZone={state.defaultShippingZoneId?.value}
            includeTax={state.pricesIncludeTax?.value}
            onIncludeTaxChange={(e) => setField('pricesIncludeTax', e)}
          />
        </Stack>
      </div>
    </main>
  );
};
