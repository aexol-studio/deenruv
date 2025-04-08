import { CanLeaveRouteDialog } from '@/components';

import {
  serverConfigSelector,
  configurableOperationDefinitionSelector,
  countrySelector,
  apiClient,
  useOrder,
  useNotifications,
  DEFAULT_CHANNEL_CODE,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import {
  PaymentMethodsType,
  activeAdministratorSelector,
  paymentMethodsSelector,
  useServer,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { Menu } from '@/components';
import { GlobalSearch } from '@/components/GlobalSearch.js';
import { DeenruvDeveloperIndicator } from '@/DeenruvDeveloperIndicator.js';

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
  const isLocalhost = window.location.hostname === 'localhost';
  const { t } = useTranslation('common');
  const setActiveAdministrator = useServer((p) => p.setActiveAdministrator);
  const setUserPermissions = useServer((p) => p.setUserPermissions);
  const setServerConfig = useServer((p) => p.setServerConfig);
  const setCountries = useServer((p) => p.setCountries);
  const setFulfillmentHandlers = useServer((p) => p.setFulfillmentHandlers);
  const setPaymentMethodsType = useServer((p) => p.setPaymentMethodsType);
  const fetchPendingJobs = useServer((p) => p.fetchPendingJobs);
  const setAvailableLanguages = useSettings((p) => p.setAvailableLanguages);
  const setLanguage = useSettings((p) => p.setLanguage);
  const setTranslationLanguage = useSettings((p) => p.setTranslationsLanguage);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const setChannels = useServer((p) => p.setChannels);
  const fetchGraphQLSchema = useServer((p) => p.fetchGraphQLSchema);
  const [loaded, setLoaded] = useState(false);
  const { initializeOrderCustomFields } = useOrder();
  const setData = useNotifications(({ setData }) => setData);
  const notifications = useNotifications(({ notifications }) => notifications);

  useEffect(() => {
    if (!loaded) return;
    const intervalIds = notifications.map(({ id, fetch, interval }) => {
      const fetchData = async () => {
        const data = await fetch();
        setData(id, data);
      };

      fetchData();
      const intervalId = setInterval(fetchData, interval);
      return intervalId;
    });

    return () => {
      intervalIds.forEach(clearInterval);
    };
  }, [notifications.map((n) => n.id).join(','), loaded]);

  useEffect(() => {
    const init = async () => {
      const activeAdministratorResponse = await apiClient('query')({
        activeAdministrator: activeAdministratorSelector,
      });

      if (!activeAdministratorResponse.activeAdministrator) {
        toast.error(t('setup.failedAdmin'));
      } else {
        setActiveAdministrator(activeAdministratorResponse.activeAdministrator);
        setUserPermissions(
          Array.from(
            new Set(activeAdministratorResponse.activeAdministrator.user.roles.flatMap((role) => role.permissions)),
          ),
        );
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
      }

      // WE NEED TO CHECK IF LOCALSTORAGE HAS LANGUAGE SET
      if (window?.__DEENRUV_SETTINGS__?.ui?.defaultLanguageCode) {
        // window?.__DEENRUV_SETTINGS__.i18n.changeLanguage(window?.__DEENRUV_SETTINGS__?.ui?.defaultLanguageCode);
        // setLanguage(window?.__DEENRUV_SETTINGS__?.ui?.defaultLanguageCode);
      }
      // WE NEED TO CHECK IF LOCALSTORAGE HAS LANGUAGE SET
      if (window?.__DEENRUV_SETTINGS__?.ui?.defaultTranslationLanguageCode) {
        // setTranslationLanguage(window?.__DEENRUV_SETTINGS__?.ui?.defaultTranslationLanguageCode);
      }

      const { globalSettings } = await apiClient('query')({
        globalSettings: { serverConfig: serverConfigSelector, availableLanguages: true },
      });
      fetchPendingJobs();
      initializeOrderCustomFields(globalSettings.serverConfig);
      setLoaded(true);

      const [countriesResponse, paymentsResponse, fulfillmentsResponse] = await Promise.allSettled([
        getAllPaginatedCountries(),
        getAllPaymentMethods(),
        apiClient('query')({ fulfillmentHandlers: configurableOperationDefinitionSelector }),
      ]);
      if (countriesResponse.status === 'rejected') {
        toast.error(t('setup.failedServer'));
      } else {
        setServerConfig(globalSettings.serverConfig);
        setAvailableLanguages(globalSettings.availableLanguages);
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
    fetchGraphQLSchema().then(async (schema) => {
      window.__DEENRUV_SCHEMA__ = schema;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await init();
    });
  }, []);

  return (
    <>
      <div className="bg-background text-foreground flex max-h-screen w-full max-w-full overflow-hidden">
        <Menu>
          {/* <div className="flex h-full w-full flex-1 flex-col gap-y-4 space-y-4 overflow-y-auto"> */}
          {loaded ? <Outlet /> : <></>}
          {/* </div> */}
        </Menu>
        <CanLeaveRouteDialog />
      </div>
      {isLocalhost ? <DeenruvDeveloperIndicator /> : null}
      <GlobalSearch />
    </>
  );
};
