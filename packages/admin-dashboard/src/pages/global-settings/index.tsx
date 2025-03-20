import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { createDeenruvForm, DetailView, useMutation, useSettings } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { GlobalSettingsComponent } from './GlobalSettingsComponent.js';

const GlobalSettingsMutation = typedGql('mutation', { scalars })({
  updateGlobalSettings: [
    { input: $('input', 'UpdateGlobalSettingsInput!') },
    {
      __typename: true,
      '...on GlobalSettings': {
        availableLanguages: true,
        outOfStockThreshold: true,
        trackInventory: true,
      },
      '...on ChannelDefaultLanguageError': {
        message: true,
      },
    },
  ],
});

export const GlobalSettings = () => {
  const { t } = useTranslation(['common', 'globalSettings']);
  const [update] = useMutation(GlobalSettingsMutation);
  const setAvailableLanguages = useSettings((p) => p.setAvailableLanguages);

  return (
    <DetailView
      id={null}
      locationId="globalSettings-detail-view"
      topActions={{ texts: { submitButton: t('common:save') } }}
      permissions={{
        create: Permission.UpdateGlobalSettings,
        delete: Permission.UpdateGlobalSettings,
        edit: Permission.UpdateGlobalSettings,
      }}
      main={{
        component: <GlobalSettingsComponent />,
        name: t('globalSettings:title'),
        label: t('globalSettings:title'),
        form: createDeenruvForm({
          key: 'UpdateGlobalSettingsInput',
          keys: ['availableLanguages', 'outOfStockThreshold', 'trackInventory'],
          config: {
            availableLanguages: {
              validate: (value) => {},
            },
            outOfStockThreshold: {
              validate: (value) => {},
            },
            trackInventory: {
              validate: (value) => {},
            },
          },
          onSubmitted: async (state) => {
            const res = await update({
              input: {
                availableLanguages: state.availableLanguages?.value,
                outOfStockThreshold: state.outOfStockThreshold?.value,
                trackInventory: state.trackInventory?.value,
              },
            });
            if (res.updateGlobalSettings.__typename === 'GlobalSettings') {
              setAvailableLanguages(res?.updateGlobalSettings.availableLanguages || []);
              toast.success(t('common:toasts.success.update'));
              return res.updateGlobalSettings;
            }
            if (res.updateGlobalSettings.__typename === 'ChannelDefaultLanguageError') {
              toast.error(res.updateGlobalSettings.message);
              return state;
            }
            toast.error(t('common:toasts.error.mutation'));
            return state;
          },
        }),
      }}
    />
  );
};
