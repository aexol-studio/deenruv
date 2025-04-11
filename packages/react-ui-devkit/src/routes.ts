export const buildURL = (path?: string[]) => {
  const base =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/$/, "")
      : "/admin-ui";
  return [base, ...(path || [])].join("/");
};

export const Routes = {
  dashboard: buildURL(),
  status: buildURL(["status"]),
  extensions: buildURL(["extensions"]),
  globalSettings: buildURL(["global-settings"]),
  assets: {
    list: buildURL(["assets"]),
  },
  productVariants: {
    list: buildURL(["product-variants"]),
    new: buildURL(["product-variants", "new"]),
    route: buildURL(["product-variants", ":id"]),
    to: (productVariantId: string) =>
      buildURL(["product-variants", productVariantId]),
  },
  countries: {
    list: buildURL(["countries"]),
    new: buildURL(["countries", "new"]),
    route: buildURL(["countries", ":id"]),
    to: (countryId: string) => buildURL(["countries", countryId]),
  },
  admins: {
    list: buildURL(["admins"]),
    new: buildURL(["admins", "new"]),
    route: buildURL(["admins", ":id"]),
    to: (id: string) => buildURL(["admins", id]),
  },
  channels: {
    list: buildURL(["channels"]),
    new: buildURL(["channels", "new"]),
    route: buildURL(["channels", ":id"]),
    to: (channelId: string) => buildURL(["channels", channelId]),
  },
  collections: {
    list: buildURL(["collections"]),
    new: buildURL(["collections", "new"]),
    route: buildURL(["collections", ":id"]),
    to: (collectionId: string) => buildURL(["collections", collectionId]),
  },
  customers: {
    list: buildURL(["customers"]),
    new: buildURL(["customers", "new"]),
    route: buildURL(["customers", ":id"]),
    to: (customerId: string) => buildURL(["customers", customerId]),
  },
  customerGroups: {
    list: buildURL(["customer-groups"]),
    new: buildURL(["customer-groups", "new"]),
    route: buildURL(["customer-groups", ":id"]),
    to: (customerGroupId: string) =>
      buildURL(["customer-groups", customerGroupId]),
  },
  facets: {
    list: buildURL(["facets"]),
    new: buildURL(["facets", "new"]),
    route: buildURL(["facets", ":id"]),
    to: (facetId: string) => buildURL(["facets", facetId]),
  },
  orders: {
    list: buildURL(["orders"]),
    new: buildURL(["orders", "new"]),
    route: buildURL(["orders", ":id"]),
    to: (orderId: string) => buildURL(["orders", orderId]),
  },
  paymentMethods: {
    list: buildURL(["payment-methods"]),
    new: buildURL(["payment-methods", "new"]),
    route: buildURL(["payment-methods", ":id"]),
    to: (methodId: string) => buildURL(["payment-methods", methodId]),
  },
  products: {
    list: buildURL(["products"]),
    new: buildURL(["products", "new"]),
    route: buildURL(["products", ":id"]),
    to: (productId: string) => buildURL(["products", productId]),
  },
  promotions: {
    list: buildURL(["promotions"]),
    new: buildURL(["promotions", "new"]),
    route: buildURL(["promotions", ":id"]),
    to: (promotionId: string) => buildURL(["promotions", promotionId]),
  },
  roles: {
    list: buildURL(["roles"]),
    new: buildURL(["roles", "new"]),
    route: buildURL(["roles", ":id"]),
    to: (roleId: string) => buildURL(["roles", roleId]),
  },
  sellers: {
    list: buildURL(["sellers"]),
    new: buildURL(["sellers", "new"]),
    route: buildURL(["sellers", ":id"]),
    to: (sellerId: string) => buildURL(["sellers", sellerId]),
  },
  shippingMethods: {
    list: buildURL(["shipping-methods"]),
    new: buildURL(["shipping-methods", "new"]),
    route: buildURL(["shipping-methods", ":id"]),
    to: (methodId: string) => buildURL(["shipping-methods", methodId]),
  },
  stockLocations: {
    list: buildURL(["stock-locations"]),
    new: buildURL(["stock-locations", "new"]),
    route: buildURL(["stock-locations", ":id"]),
    to: (stockId: string) => buildURL(["stock-locations", stockId]),
  },
  taxCategories: {
    list: buildURL(["tax-categories"]),
    new: buildURL(["tax-categories", "new"]),
    route: buildURL(["tax-categories", ":id"]),
    to: (taxCategoryId: string) => buildURL(["tax-categories", taxCategoryId]),
  },
  taxRates: {
    list: buildURL(["tax-rates"]),
    new: buildURL(["tax-rates", "new"]),
    route: buildURL(["tax-rates", ":id"]),
    to: (taxRateId: string) => buildURL(["tax-rates", taxRateId]),
  },
  zones: {
    list: buildURL(["zones"]),
    new: buildURL(["zones", "new"]),
    route: buildURL(["zones", ":id"]),
    to: (zoneId: string) => buildURL(["zones", zoneId]),
  },
} as const;
