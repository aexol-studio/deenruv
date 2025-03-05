import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getMutation, GFFLPFormField, DetailView, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { useValidators } from '@/hooks/useValidators.js';
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
}>;

export const ChannelsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditChannelMutation);
  const [create] = useMutation(CreateChannelMutation);
  const [remove] = useMutation(DeleteChannelMutation);
  const { t } = useTranslation('channels');
  const { stringValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
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
      };

      if (id) {
        return update({
          input: {
            id,
            ...inputData,
          },
        });
      } else {
        return create({
          input: inputData,
        });
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
