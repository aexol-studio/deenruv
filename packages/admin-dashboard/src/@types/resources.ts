import customers from '../locales/en/customers.json';
import customerGroups from '../locales/en/customerGroups.json';
import collections from '../locales/en/collections.json';
import common from '../locales/en/common.json';
import countries from '../locales/en/countries.json';
import orders from '../locales/en/orders.json';
import dashboard from '../locales/en/dashboard.json';
import products from '../locales/en/products.json';
import assets from '../locales/en/assets.json';
import facets from '../locales/en/facets.json';
import admins from '../locales/en/admins.json';
import roles from '../locales/en/roles.json';
import permissions from '../locales/en/permissions.json';
import channels from '../locales/en/channels.json';
import zones from '../locales/en/zones.json';
import taxCategories from '../locales/en/taxCategories.json';
import taxRates from '../locales/en/taxRates.json';
import stockLocations from '../locales/en/stockLocations.json';
import sellers from '../locales/en/sellers.json';
import paymentMethods from '../locales/en/paymentMethods.json';
import shippingMethods from '../locales/en/shippingMethods.json';
import promotions from '../locales/en/shippingMethods.json';
import table from '../locales/en/table.json';

const resources = {
  collections,
  common,
  countries,
  customers,
  customerGroups,
  orders,
  products,
  dashboard,
  assets,
  facets,
  admins,
  roles,
  permissions,
  channels,
  zones,
  taxCategories,
  taxRates,
  stockLocations,
  sellers,
  paymentMethods,
  shippingMethods,
  table,
  promotions
} as const;

export default resources;
