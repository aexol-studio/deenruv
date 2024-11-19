import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
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
} from '@deenruv/react-ui-devkit';

import { Root } from '@/pages/Root';
import { LoginScreen } from '@/pages/LoginScreen';
import { Custom404 } from '@/pages/Custom404';
import * as Pages from '@/pages';
import { DeenruvAdminPanel as DeenruvAdminPanelType } from './root.js';
import * as resources from './locales';
import { DeenruvDeveloperIndicator } from './DeenruvDeveloperIndicator.js';

declare global {
  interface Window {
    __DEENRUV_SETTINGS__: DeenruvSettingsWindowType;
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
    Object.entries(value).forEach(([_, translations]) => {
      Object.entries(translations).forEach(([key, value]) => {
        i18n.addResourceBundle(lang, key, value);
      });
    });
  });
};

const pluginsStore = new PluginStore();
export const DeenruvAdminPanel: typeof DeenruvAdminPanelType = ({ plugins, settings }) => {
  const isLocalhost = window.location.hostname === 'localhost';
  pluginsStore.install(plugins, i18n);
  loadTranslations();
  window.__DEENRUV_SETTINGS__ = {
    ...settings,
    api: {
      ...settings.api,
      authTokenName: settings.api.authTokenName || 'deenruv-auth-token',
      channelTokenName: settings.api.channelTokenName || 'deenruv-token',
    },
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
              <RouterProvider router={router} />
              {isLocalhost ? <DeenruvDeveloperIndicator /> : null}
            </PluginProvider>
          ) : (
            <LoginScreen />
          )}
        </AnimatePresence>
        <Toaster theme={theme} richColors toastOptions={{ closeButton: true, className: 'border' }} />
      </I18nextProvider>
    </GlobalStoreProvider>
  );
};
