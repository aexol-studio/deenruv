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
  capitalizeFirstLetter,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useRef } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router';
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
import { ContentAreaSkeleton } from '@/components/ContentAreaSkeleton.js';
import { DeenruvDeveloperIndicator } from '@/DeenruvDeveloperIndicator.js';
import { Permission } from '@deenruv/admin-types';
import { selectPreferredChannel } from '@/access/channel-selection.js';
import { ErrorPage } from '@/pages/Custom404.js';

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

export const Root = ({ allPaths }: { allPaths: string[] }) => {
  const isLocalhost = window.location.hostname === 'localhost';
  const { t } = useTranslation('common');
  const failAdministratorAccess = useServer((p) => p.failAdministratorAccess);
  const beginAdministratorAccessInitialization = useServer((p) => p.beginAdministratorAccessInitialization);
  const setAdministratorAccess = useServer((p) => p.setAdministratorAccess);
  const setSelectedChannelPermissions = useServer((p) => p.setSelectedChannelPermissions);
  const setServerConfig = useServer((p) => p.setServerConfig);
  const setCountries = useServer((p) => p.setCountries);
  const setFulfillmentHandlers = useServer((p) => p.setFulfillmentHandlers);
  const setPaymentMethodsType = useServer((p) => p.setPaymentMethodsType);
  const fetchPendingJobs = useServer((p) => p.fetchPendingJobs);
  const loaded = useServer((p) => p.loaded);
  const administratorAccessState = useServer((p) => p.administratorAccessState);
  const setLoaded = useServer((p) => p.setLoaded);
  const setAvailableLanguages = useSettings((p) => p.setAvailableLanguages);
  const setLanguage = useSettings((p) => p.setLanguage);
  const setTranslationLanguage = useSettings((p) => p.setTranslationsLanguage);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const setChannels = useServer((p) => p.setChannels);
  const fetchGraphQLSchema = useServer((p) => p.fetchGraphQLSchema);
  const fetchStatus = useServer((p) => p.fetchStatus);
  const { initializeOrderCustomFields } = useOrder();
  const setData = useNotifications(({ setData }) => setData);
  const notifications = useNotifications(({ notifications }) => notifications);
  const channel = useSettings((p) => p.selectedChannel);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hasInitializedAdministratorAccess = useRef(false);

  useEffect(() => {
    setSelectedChannelPermissions(selectedChannel?.id);
  }, [selectedChannel?.id, setSelectedChannelPermissions]);

  const managePageTitle = useCallback(() => {
    const pathname = location.pathname;
    const isDeenruvPath = allPaths.some((path) => pathname.startsWith(path));
    if (isDeenruvPath) {
      let [, , route, id] = pathname.split('/');
      if (!route) {
        document.title = [
          window.__DEENRUV_SETTINGS__.branding.name,
          capitalizeFirstLetter(t(`menu.dashboard`)),
          'Admin UI',
        ].join(' - ');
      } else {
        if (route?.split('-').length > 1) {
          const [first, second] = route.split('-');
          route = `${first}${second.charAt(0).toUpperCase()}${second.slice(1)}`;
        }
        if (isNaN(parseInt(id, 10))) {
          document.title = [
            window.__DEENRUV_SETTINGS__.branding.name,
            capitalizeFirstLetter(t(`menu.${route}`)),
            'Admin UI',
          ].join(' - ');
        } else {
          const tab = searchParams.get('tab');
          if (tab) {
            const variantID = searchParams.get('variantId');
            if (variantID) id = variantID;
            document.title = [
              window.__DEENRUV_SETTINGS__.branding.name,
              capitalizeFirstLetter(t(`menu.${tab}`)),
              id,
              'Admin UI',
            ].join(' - ');
          } else {
            document.title = [
              window.__DEENRUV_SETTINGS__.branding.name,
              capitalizeFirstLetter(t(`menu.${route}`)),
              id,
              'Admin UI',
            ].join(' - ');
          }
        }
      }
    }
  }, [location, searchParams]);

  useEffect(() => {
    managePageTitle();
  }, [location, searchParams]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [fetchStatus]);

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
    if (administratorAccessState !== 'pending' || hasInitializedAdministratorAccess.current) return;
    hasInitializedAdministratorAccess.current = true;
    beginAdministratorAccessInitialization();
    const uiSettings = window.__DEENRUV_SETTINGS__.ui;
    if (uiSettings?.showLanguagePicker === false) {
      setLanguage(uiSettings.defaultLanguageCode);
      setTranslationLanguage(uiSettings.defaultTranslationLanguageCode);
    }
    const init = async () => {
      const activeAdministratorResponse = await apiClient('query')({
        activeAdministrator: activeAdministratorSelector,
      });
      const roles = activeAdministratorResponse.activeAdministrator?.user.roles || [];

      if (!activeAdministratorResponse.activeAdministrator) {
        failAdministratorAccess();
        setLoaded(true);
        toast.error(t('setup.failedAdmin'));
        return;
      } else {
        const channelPickerIsHidden = uiSettings?.showChannelPicker === false;
        const configuredChannelCode = uiSettings?.defaultChannelCode;
        const failFixedChannelInitialization = () => {
          failAdministratorAccess();
          setLoaded(true);
          toast.error(t('setup.failedAdmin'), {
            description: `Configured channel "${configuredChannelCode}" is not accessible to this administrator.`,
          });
        };
        let administratorChannelId = selectedChannel?.id;
        if ([Permission.ReadChannel].some((p) => roles.some((r) => r.permissions.includes(p)))) {
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
          const preferredChannel = selectPreferredChannel(
            allChannels,
            selectedChannel,
            configuredChannelCode,
            DEFAULT_CHANNEL_CODE,
            channelPickerIsHidden,
          );
          if (channelPickerIsHidden && !preferredChannel) {
            failFixedChannelInitialization();
            return;
          }
          if (preferredChannel && preferredChannel.id !== channel?.id) {
            setSelectedChannel(preferredChannel);
          }
          administratorChannelId = preferredChannel?.id;
        } else {
          const possibleChannels = roles.flatMap((role) => role.channels);
          if (possibleChannels.length > 0) {
            const preferredChannel = channelPickerIsHidden
              ? selectPreferredChannel(
                  possibleChannels,
                  selectedChannel,
                  configuredChannelCode,
                  DEFAULT_CHANNEL_CODE,
                  true,
                )
              : possibleChannels[0];
            if (!preferredChannel) {
              failFixedChannelInitialization();
              return;
            }
            setSelectedChannel(preferredChannel);
            administratorChannelId = preferredChannel.id;
          } else if (channelPickerIsHidden) {
            failFixedChannelInitialization();
            return;
          }
        }
        setAdministratorAccess(activeAdministratorResponse.activeAdministrator, administratorChannelId);
      }

      try {
        const { globalSettings } = await apiClient('query')({
          globalSettings: { serverConfig: serverConfigSelector, availableLanguages: true },
        });
        fetchPendingJobs();
        initializeOrderCustomFields(globalSettings.serverConfig);
        setLoaded(true);
        setServerConfig(globalSettings.serverConfig);
        setAvailableLanguages(globalSettings.availableLanguages);
      } catch {
        toast.error(t('setup.failedServer'));
        setLoaded(true);
      }

      if (
        [Permission.ReadCountry, Permission.ReadPaymentMethod, Permission.ReadOrder].some((p) =>
          roles.some((r) => r.permissions.includes(p)),
        )
      ) {
        const [countriesResponse, paymentsResponse, fulfillmentsResponse] = await Promise.allSettled([
          getAllPaginatedCountries(),
          getAllPaymentMethods(),
          apiClient('query')({ fulfillmentHandlers: configurableOperationDefinitionSelector }),
        ]);
        if (countriesResponse.status === 'rejected') {
          toast.error(t('setup.failedServer'));
        } else {
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
          setFulfillmentHandlers(fulfillmentsResponse.value?.fulfillmentHandlers);
        }
      }
    };
    fetchGraphQLSchema()
      .then(async (schema) => {
        window.__DEENRUV_SCHEMA__ = schema;
        await init();
      })
      .catch(() => {
        failAdministratorAccess();
        setLoaded(true);
      });
  }, [administratorAccessState]);

  return (
    <>
      <div className="flex max-h-screen w-full max-w-full overflow-hidden bg-background text-foreground antialiased">
        <Menu>
          {administratorAccessState === 'unavailable' ? (
            <ErrorPage />
          ) : administratorAccessState === 'pending' || !loaded ? (
            <ContentAreaSkeleton />
          ) : (
            <Outlet />
          )}
        </Menu>
        {loaded && administratorAccessState === 'ready' && (
          <>
            <GlobalSearch />
            <CanLeaveRouteDialog />
            {isLocalhost ? <DeenruvDeveloperIndicator /> : null}
          </>
        )}
      </div>
    </>
  );
};
