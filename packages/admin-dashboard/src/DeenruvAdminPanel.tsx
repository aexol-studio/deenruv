// eslint-disable-next-line no-restricted-imports
import { I18nextProvider } from 'react-i18next';
import React, { useCallback, useEffect, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import i18n from './i18.js';
import {
  PluginProvider,
  PluginStore,
  type DeenruvSettingsWindowType,
  useServer,
  useSettings,
  GlobalStoreProvider,
  DEFAULT_CHANNEL_CODE,
  GraphQLSchema,
  NotificationProvider,
} from '@deenruv/react-ui-devkit';
import { useShallow } from 'zustand/react/shallow';
import { LanguageCode } from '@deenruv/admin-types';
import { Root } from '@/pages/Root.js';
import { LoginScreen } from '@/pages/LoginScreen.js';
import { ErrorPage } from '@/pages/Custom404.js';
import * as resources from '@/locales/index.js';
import { ADMIN_DASHBOARD_VERSION } from '@/version.js';
import { DeenruvAdminPanel as DeenruvAdminPanelType } from '@/root.js';
import { ORDER_STATUS_NOTIFICATION } from '@/notifications/OrderStatusNotification.js';
import { SYSTEM_STATUS_NOTIFICATION } from '@/notifications/SystemStatusNotification.js';
import {
  AdminAccessProvider,
  builtInAdminRoutes,
  getDefaultAdminRoute,
  getPermittedAdminRoutes,
} from '@/access/index.js';
import { CommittedRouterOwner, createAdminRouterRoutes } from '@/access/admin-router.js';

declare global {
  interface Window {
    __DEENRUV_SETTINGS__: DeenruvSettingsWindowType;
    __DEENRUV_SCHEMA__: GraphQLSchema | null;
  }
}

const loadTranslations = () => {
  Object.entries(resources).forEach(([lang, value]) => {
    Object.entries(value).forEach(([, translations]) => {
      Object.entries(translations).forEach(([key, value]) => {
        i18n.addResourceBundle(lang, key, value);
      });
    });
  });
};

const pluginsStore = new PluginStore();

export const DeenruvAdminPanel: typeof DeenruvAdminPanelType = ({ plugins, settings }) => {
  window.__DEENRUV_SETTINGS__ = {
    ...settings,
    ui: {
      ...settings.ui,
      showChannelPicker: settings?.ui?.showChannelPicker ?? true,
      showLanguagePicker: settings?.ui?.showLanguagePicker ?? true,
      defaultChannelCode: settings?.ui?.defaultChannelCode || DEFAULT_CHANNEL_CODE,
      defaultLanguageCode: settings?.ui?.defaultLanguageCode || LanguageCode.en,
      defaultTranslationLanguageCode: settings?.ui?.defaultTranslationLanguageCode || LanguageCode.en,
    },
    api: {
      ...settings.api,
      authTokenName: settings.api.authTokenName || 'deenruv-auth-token',
      channelTokenName: settings.api.channelTokenName || 'deenruv-token',
    },
    appVersion: ADMIN_DASHBOARD_VERSION,
    i18n,
  };
  pluginsStore.install(plugins, i18n);
  loadTranslations();

  const { theme, isLoggedIn, ...context } = useSettings(
    useShallow((p) => ({
      theme: p.theme,
      isLoggedIn: p.isLoggedIn,
      channel: p.selectedChannel,
      language: p.language,
      translationsLanguage: p.translationsLanguage,
    })),
  );
  const { administratorAccessState, userPermissions } = useServer(
    useShallow((p) => ({
      administratorAccessState: p.administratorAccessState,
      userPermissions: p.userPermissions,
    })),
  );
  const pluginRoutes = useMemo(
    () =>
      pluginsStore.routes.map((route) => ({
        id: `plugin.${route.plugin.name}.${route.path}`,
        path: route.path,
        element: route.element as React.ReactElement,
        ...route.access,
        search: { menuKey: `${route.plugin.name} - ${route.path}`, type: 'plugin' as const },
      })),
    [plugins],
  );
  const permittedRoutes = useMemo(
    () =>
      administratorAccessState === 'ready'
        ? getPermittedAdminRoutes([...builtInAdminRoutes, ...pluginRoutes], userPermissions)
        : [],
    [administratorAccessState, pluginRoutes, userPermissions],
  );
  const defaultRoute = administratorAccessState === 'ready' ? getDefaultAdminRoute(permittedRoutes) : undefined;
  const createRouter = useCallback(
    () =>
      createBrowserRouter(
        createAdminRouterRoutes({
          permittedRoutes,
          defaultRoute,
          administratorAccessState,
          rootElement: <Root allPaths={permittedRoutes.map((route) => route.path).filter(Boolean)} />,
          errorElement: <ErrorPage />,
        }),
      ),
    [administratorAccessState, defaultRoute, permittedRoutes],
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <GlobalStoreProvider {...settings}>
      <I18nextProvider i18n={i18n} defaultNS={'common'}>
        <AnimatePresence>
          {isLoggedIn ? (
            <AdminAccessProvider value={{ routes: permittedRoutes, defaultRoute }}>
              <PluginProvider plugins={pluginsStore} context={context}>
                <NotificationProvider
                  notifications={[ORDER_STATUS_NOTIFICATION, SYSTEM_STATUS_NOTIFICATION].concat(
                    pluginsStore.notifications,
                  )}
                >
                  <CommittedRouterOwner createRouter={createRouter}>
                    {(router) => <RouterProvider router={router} />}
                  </CommittedRouterOwner>
                </NotificationProvider>
              </PluginProvider>
            </AdminAccessProvider>
          ) : (
            <LoginScreen />
          )}
        </AnimatePresence>
        <Toaster
          theme={theme as 'light' | 'dark' | 'system'}
          className="toaster group"
          richColors
          expand
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:p-4',
              title: 'group-[.toast]:font-semibold group-[.toast]:text-foreground',
              description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
              actionButton:
                'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:h-8 group-[.toast]:font-medium',
              cancelButton:
                'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:h-8 group-[.toast]:font-medium',
              closeButton: 'group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground',
              success: 'group-[.toast]:border-l-4 group-[.toast]:border-l-green-500',
              error: 'group-[.toast]:border-l-4 group-[.toast]:border-l-red-500',
              warning: 'group-[.toast]:border-l-4 group-[.toast]:border-l-yellow-500',
              info: 'group-[.toast]:border-l-4 group-[.toast]:border-l-blue-500',
              loading: 'group-[.toast]:border-l-4 group-[.toast]:border-l-purple-500',
            },
          }}
        />
      </I18nextProvider>
    </GlobalStoreProvider>
  );
};
