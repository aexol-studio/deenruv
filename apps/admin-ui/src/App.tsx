import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginScreen } from './pages/LoginScreen.tsx';
import { AnimatePresence } from 'framer-motion';
import { useSettings } from '@/state/settings';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import i18n from './i18.ts';

import { Dashboard } from '@/pages/dashboard/Dashboard';
import { CollectionsListPage } from '@/pages/collections/List';
import { OrderListPage } from '@/pages/orders/List';
import { OrderPage } from '@/pages/orders/OrderPage';
import { ProductDetailPage } from '@/pages/products/Detail/Detail';
import { ProductListPage } from '@/pages/products/List';
import { Root } from '@/pages/Root';
import { CustomersListPage } from '@/pages/customers/CustomersListPage';
import { CustomerDetailsPage } from '@/pages/customers/CustomerDetailsPage';
import { Routes } from '@/utils/routes';

import { Menu } from '@/common/Menu.tsx';
import { AssetsListPage } from './pages/assets/List.tsx';
import { FacetsListPage } from './pages/facets/List.tsx';
import { FacetPage } from './pages/facets/FacetPage.tsx';
import { CountriesPage } from './pages/countries/CountriesPage.tsx';
import { AdminsListPage } from '@/pages/admins/List.tsx';
import { AdminDetailsPage } from '@/pages/admins/Details.tsx';
import { RolesListPage } from '@/pages/roles/List.tsx';
import { RoleDetailsPage } from '@/pages/roles/Details.tsx';
import { ChannelsListPage } from '@/pages/channels/List.tsx';
import { ChannelDetailsPage } from '@/pages/channels/Details.tsx';
import { ZonesListPage } from '@/pages/zones/List.tsx';
import { ZoneDetailsPage } from '@/pages/zones/Details.tsx';
import { TaxCategoriesListPage } from '@/pages/tax-categories/List.tsx';
import { TaxCategoryDetailsPage } from '@/pages/tax-categories/Details.tsx';
import { TaxRatesListPage } from '@/pages/tax-rates/List.tsx';
import { TaxRateDetailsPage } from '@/pages/tax-rates/Details.tsx';
import { StockLocationsListPage } from '@/pages/stock-locations/List.tsx';
import { SellersListPage } from '@/pages/sellers/List.tsx';
import { StockLocationDetailsPage } from '@/pages/stock-locations/Details.tsx';
import { SellersDetailsPage } from '@/pages/sellers/Details.tsx';
import { PaymentMethodsListPage } from '@/pages/payment-methods/List.tsx';
import { PaymentMethodDetailsPage } from '@/pages/payment-methods/Details.tsx';
import { ShippingMethodsListPage } from '@/pages/shipping-methods/List.tsx';
import { ShippingMethodDetailsPage } from '@/pages/shipping-methods/Details.tsx';
import { CollectionDetailsPage } from '@/pages/collections/Details.tsx';
import { PluginProvider } from '@deenruv/react-ui-devkit';
import { PromotionsListPage } from './pages/promotions/List.tsx';
import { PromotionsDetailPage } from './pages/promotions/Detail.tsx';
import { store } from './plugin-store.tsx';

const rootPaths = [
  {
    path: Routes.dashboard,
    element: <Dashboard />,
  },
  {
    path: Routes.products,
    element: <ProductListPage />,
  },
  {
    path: Routes.product.route,
    element: <ProductDetailPage />,
  },
  {
    path: Routes.productNew,
    element: <ProductDetailPage />,
  },
  {
    path: Routes.collections,
    element: <CollectionsListPage />,
  },
  {
    path: Routes.collection.route,
    element: <CollectionDetailsPage />,
  },
  {
    path: Routes.collectionNew,
    element: <CollectionDetailsPage />,
  },
  {
    path: Routes.facets,
    element: <FacetsListPage />,
  },
  {
    path: Routes.facet.route,
    element: <FacetPage />,
  },
  {
    path: Routes.facetNew,
    element: <FacetPage />,
  },
  {
    path: Routes.orders,
    element: <OrderListPage />,
  },
  {
    path: Routes.order.route,
    element: <OrderPage />,
  },
  {
    path: Routes.customers,
    element: <CustomersListPage />,
  },
  {
    path: Routes.customer.route,
    element: <CustomerDetailsPage />,
  },
  {
    path: Routes.channels,
    element: <ChannelsListPage />,
  },
  {
    path: Routes.channelNew,
    element: <ChannelDetailsPage />,
  },
  {
    path: Routes.channel.route,
    element: <ChannelDetailsPage />,
  },
  {
    path: Routes.assets,
    element: <AssetsListPage />,
  },
  {
    path: Routes.roles,
    element: <RolesListPage />,
  },
  {
    path: Routes.roleNew,
    element: <RoleDetailsPage />,
  },
  {
    path: Routes.role.route,
    element: <RoleDetailsPage />,
  },
  {
    path: Routes.admins,
    element: <AdminsListPage />,
  },
  {
    path: Routes.adminNew,
    element: <AdminDetailsPage />,
  },
  {
    path: Routes.admin.route,
    element: <AdminDetailsPage />,
  },
  {
    path: Routes.paymentMethods,
    element: <PaymentMethodsListPage />,
  },
  {
    path: Routes.paymentMethodNew,
    element: <PaymentMethodDetailsPage />,
  },
  {
    path: Routes.paymentMethod.route,
    element: <PaymentMethodDetailsPage />,
  },
  {
    path: Routes.promotion.list,
    element: <PromotionsListPage />,
  },
  {
    path: Routes.promotion.new,
    element: <PromotionsDetailPage />,
  },
  {
    path: Routes.sellers,
    element: <SellersListPage />,
  },
  {
    path: Routes.sellerNew,
    element: <SellersDetailsPage />,
  },
  {
    path: Routes.seller.route,
    element: <SellersDetailsPage />,
  },
  {
    path: Routes.shippingMethods,
    element: <ShippingMethodsListPage />,
  },
  {
    path: Routes.shippingMethodNew,
    element: <ShippingMethodDetailsPage />,
  },
  {
    path: Routes.shippingMethod.route,
    element: <ShippingMethodDetailsPage />,
  },
  {
    path: Routes.stockLocations,
    element: <StockLocationsListPage />,
  },
  {
    path: Routes.stockLocationNew,
    element: <StockLocationDetailsPage />,
  },
  {
    path: Routes.stockLocation.route,
    element: <StockLocationDetailsPage />,
  },
  {
    path: Routes.taxCategories,
    element: <TaxCategoriesListPage />,
  },
  {
    path: Routes.taxCategoryNew,
    element: <TaxCategoryDetailsPage />,
  },
  {
    path: Routes.taxCategory.route,
    element: <TaxCategoryDetailsPage />,
  },
  {
    path: Routes.taxRates,
    element: <TaxRatesListPage />,
  },
  {
    path: Routes.taxRateNew,
    element: <TaxRateDetailsPage />,
  },
  {
    path: Routes.taxRate.route,
    element: <TaxRateDetailsPage />,
  },
  {
    path: Routes.zones,
    element: <ZonesListPage />,
  },
  {
    path: Routes.zoneNew,
    element: <ZoneDetailsPage />,
  },
  {
    path: Routes.zone.route,
    element: <ZoneDetailsPage />,
  },
  { path: Routes.countries, element: <CountriesPage /> },
];

const Custom404 = () => {
  return (
    <div className="flex max-h-[100vh] w-full  max-w-full overflow-hidden bg-background text-foreground">
      <Menu>
        <div className="flex h-full w-full flex-1 flex-col overflow-y-auto p-4 pt-6 md:p-8">
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </Menu>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <Custom404 />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we pass here correctly typed routes
    children: rootPaths.concat(store.routes as any),
  },
]);

function App() {
  const isLoggedIn = useSettings((p) => p.isLoggedIn);
  const theme = useSettings((p) => p.theme);
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
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <AnimatePresence>
        {isLoggedIn ? (
          <PluginProvider store={store}>
            <RouterProvider router={router} />
          </PluginProvider>
        ) : (
          <LoginScreen />
        )}
      </AnimatePresence>
      <Toaster
        theme={theme}
        richColors
        toastOptions={{
          closeButton: true,
          classNames: {
            error: 'border',
            warning: 'border',
            success: 'border',
            info: 'border',
            default: 'border',
          },
        }}
      />
    </I18nextProvider>
  );
}

export default App;
