import { Permission } from '@deenruv/admin-types';

export const catalogRoutePermissions = {
  products: {
    read: [Permission.ReadProduct, Permission.ReadCatalog],
    create: [Permission.CreateProduct, Permission.CreateCatalog],
  },
  collections: {
    read: [Permission.ReadCollection, Permission.ReadCatalog],
    create: [Permission.CreateCollection, Permission.CreateCatalog],
  },
  facets: {
    read: [Permission.ReadFacet, Permission.ReadCatalog],
    create: [Permission.CreateFacet, Permission.CreateCatalog],
  },
  assets: {
    read: [Permission.ReadAsset, Permission.ReadCatalog],
  },
} satisfies Record<string, { read: Permission[]; create?: Permission[] }>;

export const settingsRoutePermissions = {
  paymentMethods: {
    read: [Permission.ReadPaymentMethod, Permission.ReadSettings],
    create: [Permission.CreatePaymentMethod, Permission.CreateSettings],
  },
  shippingMethods: {
    read: [Permission.ReadShippingMethod, Permission.ReadSettings],
    create: [Permission.CreateShippingMethod, Permission.CreateSettings],
  },
  zones: {
    read: [Permission.ReadZone, Permission.ReadSettings],
    create: [Permission.CreateZone, Permission.CreateSettings],
  },
  countries: {
    read: [Permission.ReadCountry, Permission.ReadSettings],
    create: [Permission.CreateCountry, Permission.CreateSettings],
  },
  taxCategories: {
    read: [Permission.ReadTaxCategory, Permission.ReadSettings],
    create: [Permission.CreateTaxCategory, Permission.CreateSettings],
  },
  taxRates: {
    read: [Permission.ReadTaxRate, Permission.ReadSettings],
    create: [Permission.CreateTaxRate, Permission.CreateSettings],
  },
} satisfies Record<string, { read: Permission[]; create: Permission[] }>;
