import React from 'react';
import { Permission } from '@deenruv/admin-types';
import { Routes } from '@deenruv/react-ui-devkit';
import {
  BarChart,
  Barcode,
  Coins,
  Cog,
  CreditCard,
  Flag,
  Folder,
  Globe,
  Globe2,
  Images,
  MapPin,
  Percent,
  ScanBarcode,
  Server,
  ShoppingCart,
  Store,
  Tag,
  Truck,
  UserCog,
  UserRoundSearch,
  Users,
  UsersRound,
} from 'lucide-react';

import {
  AdminsDetailPage,
  AdminsListPage,
  AdminsProvisionPage,
  AssetsListPage,
  ChannelsDetailPage,
  ChannelsListPage,
  CollectionsDetailPage,
  CollectionsListPage,
  CountriesDetailPage,
  CountriesListPage,
  CustomerGroupsDetailPage,
  CustomerGroupsListPage,
  CustomersDetailPage,
  CustomersListPage,
  Dashboard,
  Extensions,
  FacetsDetailPage,
  FacetsListPage,
  GlobalSettings,
  OrdersDetailPage,
  OrdersListPage,
  PaymentMethodsDetailPage,
  PaymentMethodsListPage,
  ProductVariantDetailPage,
  ProductVariantsListPage,
  ProductsDetailPage,
  ProductsListPage,
  PromotionsDetailPage,
  PromotionsListPage,
  RolesDetailPage,
  RolesListPage,
  SellersDetailPage,
  SellersListPage,
  ShippingMethodsDetailPage,
  ShippingMethodsListPage,
  Status,
  StockLocationsDetailPage,
  StockLocationsListPage,
  TaxCategoriesDetailPage,
  TaxCategoriesListPage,
  TaxRatesDetailPage,
  TaxRatesListPage,
  ZonesDetailPage,
  ZonesListPage,
} from '@/pages/index.js';
import type { AdminNavigationGroupDefinition, AdminRouteDefinition } from './types.js';

type CrudRoutes = {
  list: string;
  route?: string;
  new?: string;
};

type CrudRouteInput = {
  id: string;
  menuKey: string;
  routes: CrudRoutes;
  listElement: () => React.ReactElement;
  detailElement?: () => React.ReactElement;
  readPermissions: Permission[];
  createPermissions?: Permission[];
  nav: NonNullable<AdminRouteDefinition['nav']>;
};

export const adminNavigationGroups: AdminNavigationGroupDefinition[] = [
  { id: 'shop-group', labelKey: 'shop' },
  { id: 'assortment-group', labelKey: 'assortment' },
  { id: 'users-group', labelKey: 'users' },
  { id: 'promotions-group', labelKey: 'promotions' },
  { id: 'shipping-group', labelKey: 'shipping' },
  { id: 'settings-group', labelKey: 'settings' },
];

const createCrudRouteDefinitions = ({
  id,
  menuKey,
  routes,
  listElement,
  detailElement,
  readPermissions,
  createPermissions,
  nav,
}: CrudRouteInput): AdminRouteDefinition[] => {
  const definitions: AdminRouteDefinition[] = [
    {
      id: `${id}.list`,
      path: routes.list,
      element: listElement(),
      requiredPermissions: readPermissions,
      nav,
      search: { menuKey, type: 'list' },
    },
  ];

  if (routes.route && detailElement) {
    definitions.push({
      id: `${id}.detail`,
      path: routes.route,
      element: detailElement(),
      requiredPermissions: readPermissions,
    });
  }

  if (routes.new && detailElement) {
    definitions.push({
      id: `${id}.create`,
      path: routes.new,
      element: detailElement(),
      requiredPermissions: createPermissions,
      search: { menuKey, type: 'new' },
    });
  }

  return definitions;
};

export const builtInAdminRoutes: AdminRouteDefinition[] = [
  {
    id: 'dashboard',
    path: Routes.dashboard,
    element: <Dashboard />,
    nav: { groupId: 'shop-group', linkId: 'link-dashboard', menuKey: 'dashboard', icon: BarChart },
    search: { menuKey: 'dashboard', type: 'default' },
  },
  ...createCrudRouteDefinitions({
    id: 'orders',
    menuKey: 'orders',
    routes: Routes.orders,
    listElement: () => <OrdersListPage />,
    detailElement: () => <OrdersDetailPage />,
    readPermissions: [Permission.ReadOrder],
    createPermissions: [Permission.CreateOrder],
    nav: { groupId: 'shop-group', linkId: 'link-orders', menuKey: 'orders', icon: ShoppingCart },
  }),
  ...createCrudRouteDefinitions({
    id: 'customers',
    menuKey: 'customers',
    routes: Routes.customers,
    listElement: () => <CustomersListPage />,
    detailElement: () => <CustomersDetailPage />,
    readPermissions: [Permission.ReadCustomer],
    createPermissions: [Permission.CreateCustomer],
    nav: { groupId: 'shop-group', linkId: 'link-customers', menuKey: 'customers', icon: UserRoundSearch },
  }),
  ...createCrudRouteDefinitions({
    id: 'customerGroups',
    menuKey: 'customerGroups',
    routes: Routes.customerGroups,
    listElement: () => <CustomerGroupsListPage />,
    detailElement: () => <CustomerGroupsDetailPage />,
    readPermissions: [Permission.ReadCustomerGroup],
    createPermissions: [Permission.CreateCustomerGroup],
    nav: { groupId: 'shop-group', linkId: 'link-customerGroups', menuKey: 'customerGroups', icon: UsersRound },
  }),
  ...createCrudRouteDefinitions({
    id: 'products',
    menuKey: 'products',
    routes: Routes.products,
    listElement: () => <ProductsListPage />,
    detailElement: () => <ProductsDetailPage />,
    readPermissions: [Permission.ReadProduct, Permission.ReadCatalog],
    createPermissions: [Permission.CreateProduct],
    nav: { groupId: 'assortment-group', linkId: 'link-products', menuKey: 'products', icon: Barcode },
  }),
  ...createCrudRouteDefinitions({
    id: 'productVariants',
    menuKey: 'productVariants',
    routes: Routes.productVariants,
    listElement: () => <ProductVariantsListPage />,
    detailElement: () => <ProductVariantDetailPage />,
    readPermissions: [Permission.ReadProduct, Permission.ReadCatalog],
    createPermissions: [Permission.CreateProduct],
    nav: {
      groupId: 'assortment-group',
      linkId: 'link-product-variants',
      menuKey: 'productVariants',
      icon: ScanBarcode,
    },
  }),
  ...createCrudRouteDefinitions({
    id: 'collections',
    menuKey: 'collections',
    routes: Routes.collections,
    listElement: () => <CollectionsListPage />,
    detailElement: () => <CollectionsDetailPage />,
    readPermissions: [Permission.ReadCollection, Permission.ReadCatalog],
    createPermissions: [Permission.CreateCollection],
    nav: { groupId: 'assortment-group', linkId: 'link-collections', menuKey: 'collections', icon: Folder },
  }),
  ...createCrudRouteDefinitions({
    id: 'facets',
    menuKey: 'facets',
    routes: Routes.facets,
    listElement: () => <FacetsListPage />,
    detailElement: () => <FacetsDetailPage />,
    readPermissions: [Permission.ReadFacet, Permission.ReadCatalog],
    createPermissions: [Permission.CreateFacet],
    nav: { groupId: 'assortment-group', linkId: 'link-facets', menuKey: 'facets', icon: Tag },
  }),
  {
    id: 'assets.list',
    path: Routes.assets.list,
    element: <AssetsListPage />,
    requiredPermissions: [Permission.ReadAsset, Permission.ReadCatalog],
    nav: { groupId: 'assortment-group', linkId: 'link-assets', menuKey: 'assets', icon: Images },
    search: { menuKey: 'assets', type: 'list' },
  },
  ...createCrudRouteDefinitions({
    id: 'admins',
    menuKey: 'admins',
    routes: Routes.admins,
    listElement: () => <AdminsListPage />,
    detailElement: () => <AdminsDetailPage />,
    readPermissions: [Permission.ReadAdministrator],
    createPermissions: [Permission.CreateAdministrator],
    nav: { groupId: 'users-group', linkId: 'link-admins', menuKey: 'admins', icon: UserCog },
  }),
  {
    id: 'admins.provision',
    path: Routes.admins.provision,
    element: <AdminsProvisionPage />,
    requiredPermissions: [Permission.CreateAdministrator],
    search: { menuKey: 'adminProvision', type: 'new' },
  },
  ...createCrudRouteDefinitions({
    id: 'roles',
    menuKey: 'roles',
    routes: Routes.roles,
    listElement: () => <RolesListPage />,
    detailElement: () => <RolesDetailPage />,
    readPermissions: [Permission.ReadAdministrator],
    createPermissions: [Permission.CreateAdministrator],
    nav: { groupId: 'users-group', linkId: 'link-roles', menuKey: 'roles', icon: Users },
  }),
  ...createCrudRouteDefinitions({
    id: 'sellers',
    menuKey: 'sellers',
    routes: Routes.sellers,
    listElement: () => <SellersListPage />,
    detailElement: () => <SellersDetailPage />,
    readPermissions: [Permission.ReadSeller],
    createPermissions: [Permission.CreateSeller],
    nav: { groupId: 'users-group', linkId: 'link-sellers', menuKey: 'sellers', icon: Store },
  }),
  ...createCrudRouteDefinitions({
    id: 'promotions',
    menuKey: 'promotions',
    routes: Routes.promotions,
    listElement: () => <PromotionsListPage />,
    detailElement: () => <PromotionsDetailPage />,
    readPermissions: [Permission.ReadPromotion],
    createPermissions: [Permission.CreatePromotion],
    nav: { groupId: 'promotions-group', linkId: 'link-promotions', menuKey: 'promotions', icon: ShoppingCart },
  }),
  ...createCrudRouteDefinitions({
    id: 'paymentMethods',
    menuKey: 'paymentMethods',
    routes: Routes.paymentMethods,
    listElement: () => <PaymentMethodsListPage />,
    detailElement: () => <PaymentMethodsDetailPage />,
    readPermissions: [Permission.ReadPaymentMethod],
    createPermissions: [Permission.CreatePaymentMethod],
    nav: {
      groupId: 'shipping-group',
      linkId: 'link-payment-methods',
      menuKey: 'paymentMethods',
      icon: CreditCard,
    },
  }),
  ...createCrudRouteDefinitions({
    id: 'shippingMethods',
    menuKey: 'shippingMethods',
    routes: Routes.shippingMethods,
    listElement: () => <ShippingMethodsListPage />,
    detailElement: () => <ShippingMethodsDetailPage />,
    readPermissions: [Permission.ReadShippingMethod],
    createPermissions: [Permission.CreateShippingMethod],
    nav: {
      groupId: 'shipping-group',
      linkId: 'link-shipping-methods',
      menuKey: 'shippingMethods',
      icon: Truck,
    },
  }),
  ...createCrudRouteDefinitions({
    id: 'stockLocations',
    menuKey: 'stock',
    routes: Routes.stockLocations,
    listElement: () => <StockLocationsListPage />,
    detailElement: () => <StockLocationsDetailPage />,
    readPermissions: [Permission.ReadStockLocation],
    createPermissions: [Permission.CreateStockLocation],
    nav: { groupId: 'shipping-group', linkId: 'link-stock', menuKey: 'stock', icon: MapPin },
  }),
  ...createCrudRouteDefinitions({
    id: 'channels',
    menuKey: 'channels',
    routes: Routes.channels,
    listElement: () => <ChannelsListPage />,
    detailElement: () => <ChannelsDetailPage />,
    readPermissions: [Permission.ReadChannel],
    createPermissions: [Permission.CreateChannel],
    nav: { groupId: 'settings-group', linkId: 'link-channels', menuKey: 'channels', icon: Globe2 },
  }),
  ...createCrudRouteDefinitions({
    id: 'zones',
    menuKey: 'zones',
    routes: Routes.zones,
    listElement: () => <ZonesListPage />,
    detailElement: () => <ZonesDetailPage />,
    readPermissions: [Permission.ReadZone],
    createPermissions: [Permission.CreateZone],
    nav: { groupId: 'settings-group', linkId: 'link-zones', menuKey: 'zones', icon: Globe },
  }),
  ...createCrudRouteDefinitions({
    id: 'countries',
    menuKey: 'countries',
    routes: Routes.countries,
    listElement: () => <CountriesListPage />,
    detailElement: () => <CountriesDetailPage />,
    readPermissions: [Permission.ReadCountry],
    createPermissions: [Permission.CreateCountry],
    nav: { groupId: 'settings-group', linkId: 'link-countries', menuKey: 'countries', icon: Flag },
  }),
  ...createCrudRouteDefinitions({
    id: 'taxCategories',
    menuKey: 'taxCategories',
    routes: Routes.taxCategories,
    listElement: () => <TaxCategoriesListPage />,
    detailElement: () => <TaxCategoriesDetailPage />,
    readPermissions: [Permission.ReadTaxCategory],
    createPermissions: [Permission.CreateTaxCategory],
    nav: {
      groupId: 'settings-group',
      linkId: 'link-tax-categories',
      menuKey: 'taxCategories',
      icon: Coins,
    },
  }),
  ...createCrudRouteDefinitions({
    id: 'taxRates',
    menuKey: 'taxRates',
    routes: Routes.taxRates,
    listElement: () => <TaxRatesListPage />,
    detailElement: () => <TaxRatesDetailPage />,
    readPermissions: [Permission.ReadTaxRate],
    createPermissions: [Permission.CreateTaxRate],
    nav: { groupId: 'settings-group', linkId: 'link-tax-rates', menuKey: 'taxRates', icon: Percent },
  }),
  {
    id: 'settings.global',
    path: Routes.globalSettings,
    element: <GlobalSettings />,
    requiredPermissions: [Permission.ReadSettings],
    nav: { groupId: 'settings-group', linkId: 'link-global-settings', menuKey: 'globalSettings', icon: Cog },
    search: { menuKey: 'globalSettings', type: 'default' },
  },
  {
    id: 'system.status',
    path: Routes.status,
    element: <Status />,
    requiredPermissions: [Permission.ReadSystem],
    nav: { groupId: 'settings-group', linkId: 'link-system-status', menuKey: 'systemStatus', icon: Server },
    search: { menuKey: 'systemStatus', type: 'default' },
  },
  {
    id: 'extensions',
    path: Routes.extensions,
    element: <Extensions />,
    requiredPermissions: [Permission.ReadSettings],
    search: { menuKey: 'extensions', type: 'default' },
  },
];
