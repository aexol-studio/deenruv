import { Menu } from '@/components';

import {
  serverConfigSelector,
  configurableOperationDefinitionSelector,
  countrySelector,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import {
  PaymentMethodsType,
  activeAdministratorSelector,
  paymentMethodsSelector,
  useServer,
  useSettings,
  DEFAULT_CHANNEL_CODE,
} from '@deenruv/react-ui-devkit';

const TAKE = 100;
const getAllPaginatedCountries = async () => {
  let countries: { code: string; name: string; id: string }[] = [];
  let totalItems = 0;
  let skip = 0;
  do {
    const {
      countries: { items, totalItems: total },
    } = await apiClient('query')({
      countries: [{ options: { skip, take: TAKE } }, { items: countrySelector, totalItems: true }],
    });
    countries = [...countries, ...items];
    totalItems = total;
    skip += TAKE;
  } while (countries.length < totalItems);
  return { countries };
};

const getAllPaymentMethods = async () => {
  let paymentMethods: PaymentMethodsType[] = [];
  let totalItems = 0;
  let skip = 0;
  do {
    const {
      paymentMethods: { items, totalItems: total },
    } = await apiClient('query')({
      paymentMethods: [
        { options: { skip, take: TAKE, filter: { enabled: { eq: true } } } },
        { items: paymentMethodsSelector, totalItems: true },
      ],
    });
    paymentMethods = [...paymentMethods, ...items];
    totalItems = total;
    skip += TAKE;
  } while (paymentMethods.length < totalItems);
  return { paymentMethods };
};

export const Root = () => {
  const { t } = useTranslation('common');
  const setChannels = useServer((p) => p.setChannels);
  const setActiveAdministrator = useServer((p) => p.setActiveAdministrator);
  const setServerConfig = useServer((p) => p.setServerConfig);
  const setCountries = useServer((p) => p.setCountries);
  const setFulfillmentHandlers = useServer((p) => p.setFulfillmentHandlers);
  const setPaymentMethodsType = useServer((p) => p.setPaymentMethodsType);
  const setAvailableLanguages = useSettings((p) => p.setAvailableLanguages);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const [loaded, setLoaded] = useState(false);
  const { selectedChannel } = useSettings();

  useEffect(() => {
    const init = async () => {
      const activeAdministratorResponse = await apiClient('query')({
        activeAdministrator: activeAdministratorSelector,
      });

      if (!activeAdministratorResponse.activeAdministrator) {
        toast.error(t('setup.failedAdmin'));
      } else {
        setActiveAdministrator(activeAdministratorResponse?.activeAdministrator);
        const allChannels = activeAdministratorResponse.activeAdministrator?.user.roles.map((r) => r.channels).flat();
        setChannels(allChannels);
        if (!selectedChannel) {
          const defaultChannel = allChannels.find((ch) => ch.code === DEFAULT_CHANNEL_CODE) || allChannels[0];
          setSelectedChannel(defaultChannel);
        }
        setLoaded(true);
      }

      const [serverConfigResponse, countriesResponse, paymentsResponse, fulfillmentsResponse] =
        await Promise.allSettled([
          apiClient('query')({ globalSettings: { serverConfig: serverConfigSelector, availableLanguages: true } }),
          getAllPaginatedCountries(),
          getAllPaymentMethods(),
          apiClient('query')({ fulfillmentHandlers: configurableOperationDefinitionSelector }),
        ]);
      if (serverConfigResponse.status === 'rejected') {
        toast.error(t('setup.failedServer'));
      } else {
        setServerConfig(serverConfigResponse.value.globalSettings.serverConfig);
        setAvailableLanguages(serverConfigResponse.value.globalSettings.availableLanguages);
        // const socket = serverConfigResponse.value.globalSettings.serverConfig.plugins?.find(
        //   (plugin) => plugin.name === 'AexolAdminsPlugin',
        // );
        // if (socket && socket.active) setNeedSocket(true);
      }
      if (countriesResponse.status === 'rejected') {
        toast.error(t('setup.failedCountries'));
      } else {
        setCountries(countriesResponse.value.countries);
      }
      if (paymentsResponse.status === 'rejected') {
        toast.error(t('setup.failedPayments'));
      } else {
        setPaymentMethodsType(paymentsResponse.value.paymentMethods);
      }
      if (fulfillmentsResponse.status === 'rejected') {
        toast.error(t('setup.failedFulfillments'));
      } else {
        setFulfillmentHandlers(fulfillmentsResponse.value.fulfillmentHandlers);
      }
    };
    init();
  }, []);

  return (
    <div className="bg-background text-foreground flex  max-h-[100vh] w-full max-w-full overflow-hidden">
      <Menu>
        {/* <div className="flex h-full w-full flex-1 flex-col gap-y-4 space-y-4 overflow-y-auto"> */}
        {loaded ? <Outlet /> : <></>}
        {/* </div> */}
      </Menu>
    </div>
  );
};
