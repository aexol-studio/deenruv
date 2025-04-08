// eslint-disable-next-line no-restricted-imports
import { I18nextProvider } from 'react-i18next';
import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import i18n from './i18.js';
import {
  Routes,
  PluginProvider,
  PluginStore,
  type DeenruvSettingsWindowType,
  useSettings,
  GlobalStoreProvider,
  DEFAULT_CHANNEL_CODE,
  GraphQLSchema,
  NotificationProvider,
} from '@deenruv/react-ui-devkit';
import { ADMIN_DASHBOARD_VERSION } from '@/version';

import { Root } from '@/pages/Root';
import { LoginScreen } from '@/pages/LoginScreen';
import { Custom404 } from '@/pages/Custom404';
import * as Pages from '@/pages';
import { DeenruvAdminPanel as DeenruvAdminPanelType } from './root.js';
import * as resources from './locales';
import { DeenruvDeveloperIndicator } from './DeenruvDeveloperIndicator.js';
import { LanguageCode } from '@deenruv/admin-types';
import { ORDER_STATUS_NOTIFICATION } from './notifications/OrderStatusNotification.js';
import { SYSTEM_STATUS_NOTIFICATION } from './notifications/SystemStatusNotification.js';
import { GlobalSearch } from './components/GlobalSearch.js';

declare global {
  interface Window {
    __DEENRUV_SETTINGS__: DeenruvSettingsWindowType;
    __DEENRUV_SCHEMA__: GraphQLSchema | null;
  }
}

const firstLetterToLowerCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
const getRoute = (name: string, key: string) => {
  const route = Routes[name as keyof typeof Routes];
  if (typeof route !== 'object') return route;
  if (key.includes('DetailPage') && 'route' in route) return route.route;
  if (key.includes('ListPage') && 'list' in route) return route.list;
  return null;
};
const getName = (key: string) => {
  if (key.includes('DetailPage')) return firstLetterToLowerCase(key.replace('DetailPage', ''));
  if (key.includes('ListPage')) return firstLetterToLowerCase(key.replace('ListPage', ''));
  return firstLetterToLowerCase(key);
};
const DeenruvPaths = Object.entries(Pages).flatMap(([key, Component]) => {
  const name = getName(key);
  const path = getRoute(name, key);
  const paths: { path: string; element: JSX.Element }[] = [];
  if (path) paths.push({ path, element: <Component /> });
  const route = Routes[name as keyof typeof Routes];
  if (key.includes('DetailPage') && typeof route === 'object' && 'new' in route) {
    paths.push({ path: route.new, element: <Component /> });
  }
  return paths;
});

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
  pluginsStore.install(plugins, i18n);
  loadTranslations();
  window.__DEENRUV_SETTINGS__ = {
    ...settings,
    ui: {
      ...settings.ui,
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

  const router = createBrowserRouter([
    { element: <Root />, errorElement: <Custom404 />, children: [...DeenruvPaths, ...pluginsStore.routes] },
  ]);
  const { theme, isLoggedIn, ...context } = useSettings((p) => ({
    theme: p.theme,
    isLoggedIn: p.isLoggedIn,
    channel: p.selectedChannel,
    language: p.language,
    translationsLanguage: p.translationsLanguage,
  }));

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
      <I18nextProvider i18n={i18n} defaultNS={'translation'}>
        <AnimatePresence>
          {isLoggedIn ? (
            <PluginProvider plugins={pluginsStore} context={context}>
              <NotificationProvider
                notifications={[ORDER_STATUS_NOTIFICATION, SYSTEM_STATUS_NOTIFICATION].concat(
                  pluginsStore.notifications,
                )}
              >
                <RouterProvider router={router} />
              </NotificationProvider>
            </PluginProvider>
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
                'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4',
              title: 'group-[.toast]:font-semibold group-[.toast]:text-foreground',
              description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
              actionButton:
                'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:h-8 group-[.toast]:font-medium',
              cancelButton:
                'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:text-xs group-[.toast]:h-8 group-[.toast]:font-medium',
              closeButton:
                'group-[.toast]:text-foreground/50 group-[.toast]:hover:text-foreground group-[.toast]:rounded-md',
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
