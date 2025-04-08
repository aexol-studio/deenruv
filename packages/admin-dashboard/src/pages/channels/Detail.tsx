import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  getMutation,
  GFFLPFormField,
  DetailView,
  createDeenruvForm,
  useMutation,
  useValidators,
  apiClient,
  DEFAULT_CHANNEL_CODE,
  useSettings,
  useServer,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { ChannelDetailView } from '@/pages/channels/_components/ChannelDetailView.js';

const CreateChannelMutation = getMutation('createChannel', {
  '...on Channel': {
    id: true,
  },
  '...on LanguageNotAvailableError': {
    message: true,
  },
});
const EditChannelMutation = getMutation('updateChannel', {
  '...on Channel': {
    id: true,
  },
  '...on LanguageNotAvailableError': {
    message: true,
  },
});
const DeleteChannelMutation = getMutation('deleteChannel');

type CreateChannelInput = ModelTypes['CreateChannelInput'];
type FormDataType = Partial<{
  code: GFFLPFormField<CreateChannelInput['code']>;
  availableCurrencyCodes: GFFLPFormField<CreateChannelInput['availableCurrencyCodes']>;
  availableLanguageCodes: GFFLPFormField<CreateChannelInput['availableLanguageCodes']>;
  defaultCurrencyCode: GFFLPFormField<CreateChannelInput['defaultCurrencyCode']>;
  defaultLanguageCode: GFFLPFormField<CreateChannelInput['defaultLanguageCode']>;
  defaultShippingZoneId: GFFLPFormField<CreateChannelInput['defaultShippingZoneId']>;
  defaultTaxZoneId: GFFLPFormField<CreateChannelInput['defaultTaxZoneId']>;
  outOfStockThreshold: GFFLPFormField<CreateChannelInput['outOfStockThreshold']>;
  pricesIncludeTax: GFFLPFormField<CreateChannelInput['pricesIncludeTax']>;
  sellerId: GFFLPFormField<CreateChannelInput['sellerId']>;
  token: GFFLPFormField<CreateChannelInput['token']>;
  trackInventory: GFFLPFormField<CreateChannelInput['trackInventory']>;
  customFields: GFFLPFormField<CreateChannelInput['customFields']>;
}>;

export const ChannelsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditChannelMutation);
  const [create] = useMutation(CreateChannelMutation);
  const [remove] = useMutation(DeleteChannelMutation);
  const { t } = useTranslation('channels');
  const { stringValidator } = useValidators();
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const setChannels = useServer((p) => p.setChannels);

  const onSubmitHandler = useCallback(
    async (data: FormDataType) => {
      if (!data.code?.validatedValue) {
        throw new Error('Code is required.');
      }

      const inputData = {
        code: data.code.validatedValue,
        availableCurrencyCodes: data.availableCurrencyCodes?.validatedValue,
        availableLanguageCodes: data.availableLanguageCodes?.validatedValue,
        defaultCurrencyCode: data.defaultCurrencyCode?.validatedValue,
        defaultLanguageCode: data.defaultLanguageCode!.validatedValue!,
        defaultShippingZoneId: data.defaultShippingZoneId!.validatedValue!,
        defaultTaxZoneId: data.defaultTaxZoneId!.validatedValue!,
        pricesIncludeTax: data.pricesIncludeTax!.value!,
        sellerId: data.sellerId?.validatedValue,
        token: data.token!.validatedValue!,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
      };

      if (id) {
        const response = await update({ input: { id, ...inputData } });
        const {
          channels: { items: allChannels = [] },
        } = await apiClient('query')({
          channels: [
            {},
            {
              items: {
                id: true,
                code: true,
                token: true,
                currencyCode: true,
                defaultLanguageCode: true,
                availableLanguageCodes: true,
              },
            },
          ],
        });

        setChannels(allChannels);
        if (selectedChannel) {
          const foundChannel = allChannels.find((ch) => ch.code === selectedChannel.code);
          setSelectedChannel(foundChannel || allChannels[0]);
        }
        const existingChannel = allChannels.find(
          (ch) => ch.code === window?.__DEENRUV_SETTINGS__?.ui?.defaultChannelCode,
        );
        if (existingChannel) {
          setSelectedChannel(existingChannel);
        }
        const defaultChannel = allChannels.find((ch) => ch.code === DEFAULT_CHANNEL_CODE) || allChannels[0];
        setSelectedChannel(defaultChannel);

        return response;
      } else {
        const response = await create({ input: inputData });
        const {
          channels: { items: allChannels = [] },
        } = await apiClient('query')({
          channels: [
            {},
            {
              items: {
                id: true,
                code: true,
                token: true,
                currencyCode: true,
                defaultLanguageCode: true,
                availableLanguageCodes: true,
              },
            },
          ],
        });

        setChannels(allChannels);

        if (selectedChannel) {
          const foundChannel = allChannels.find((ch) => ch.code === selectedChannel.code);
          setSelectedChannel(foundChannel || allChannels[0]);
        }

        const existingChannel = allChannels.find(
          (ch) => ch.code === window?.__DEENRUV_SETTINGS__?.ui?.defaultChannelCode,
        );
        if (existingChannel) {
          setSelectedChannel(existingChannel);
        }

        const defaultChannel = allChannels.find((ch) => ch.code === DEFAULT_CHANNEL_CODE) || allChannels[0];
        setSelectedChannel(defaultChannel);
        return response;
      }
    },
    [id, update, create],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ input: { id } });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="channels-detail-view"
        main={{
          name: 'channel',
          label: 'Channel',
          component: <ChannelDetailView />,
          form: createDeenruvForm({
            key: 'CreateChannelInput',
            keys: [
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
            ],
            config: {
              pricesIncludeTax: {
                initialValue: false,
              },
              code: stringValidator(t('validation.codeRequired')),
              token: stringValidator(t('validation.tokenRequired')),
              defaultLanguageCode: stringValidator(t('validation.langCodeRequired')),
              defaultShippingZoneId: stringValidator(t('validation.shippingZoneRequired')),
              defaultTaxZoneId: stringValidator(t('validation.taxZoneRequired')),
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
