import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ChannelDetailsSelector = Selector("Channel")({
  id: true,
  token: true,
  code: true,
  seller: {
    id: true,
    name: true,
  },
  createdAt: true,
  updatedAt: true,
  availableLanguageCodes: true,
  availableCurrencyCodes: true,
  defaultCurrencyCode: true,
  defaultLanguageCode: true,
  defaultShippingZone: {
    id: true,
    name: true,
  },
  defaultTaxZone: {
    id: true,
    name: true,
  },
  pricesIncludeTax: true,
});

export type ChannelDetailsType = FromSelectorWithScalars<
  typeof ChannelDetailsSelector,
  "Channel"
>;
