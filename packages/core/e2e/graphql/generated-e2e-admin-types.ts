/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AddItemInput = {
  productVariantId: string | number;
  quantity: number;
};

export type AddItemToDraftOrderInput = {
  productVariantId: string | number;
  quantity: number;
};

export type AddNoteToCustomerInput = {
  id: string | number;
  isPublic: boolean;
  note: string;
};

export type AddNoteToOrderInput = {
  id: string | number;
  isPublic: boolean;
  note: string;
};

export type AdjustDraftOrderLineInput = {
  orderLineId: string | number;
  quantity: number;
};

export type AdjustmentType =
  | 'DISTRIBUTED_ORDER_PROMOTION'
  | 'OTHER'
  | 'PROMOTION';

export type AdministratorFilterParameter = {
  _and?: Array<AdministratorFilterParameter> | null | undefined;
  _or?: Array<AdministratorFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  emailAddress?: StringOperators | null | undefined;
  firstName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  lastName?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type AdministratorListOptions = {
  /** Allows the results to be filtered */
  filter?: AdministratorFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: AdministratorSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type AdministratorRefundInput = {
  /**
   * The amount to be refunded to this particular Payment. This was introduced in
   * v2.2.0 as the preferred way to specify the refund amount. The `lines`, `shipping` and `adjustment`
   * fields will be removed in a future version.
   */
  amount?: number | null | undefined;
  paymentId: string | number;
  reason?: string | null | undefined;
};

export type AdministratorSortParameter = {
  createdAt?: SortOrder | null | undefined;
  emailAddress?: SortOrder | null | undefined;
  firstName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  lastName?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type AssetFilterParameter = {
  _and?: Array<AssetFilterParameter> | null | undefined;
  _or?: Array<AssetFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  fileSize?: NumberOperators | null | undefined;
  height?: NumberOperators | null | undefined;
  id?: IdOperators | null | undefined;
  mimeType?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  preview?: StringOperators | null | undefined;
  source?: StringOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  width?: NumberOperators | null | undefined;
};

export type AssetListOptions = {
  /** Allows the results to be filtered */
  filter?: AssetFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: AssetSortParameter | null | undefined;
  tags?: Array<string> | null | undefined;
  tagsOperator?: LogicalOperator | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type AssetSortParameter = {
  createdAt?: SortOrder | null | undefined;
  fileSize?: SortOrder | null | undefined;
  height?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  mimeType?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  preview?: SortOrder | null | undefined;
  source?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  width?: SortOrder | null | undefined;
};

export type AssetType =
  | 'BINARY'
  | 'IMAGE'
  | 'VIDEO';

export type AssignAssetsToChannelInput = {
  assetIds: Array<string | number>;
  channelId: string | number;
};

export type AssignCollectionsToChannelInput = {
  channelId: string | number;
  collectionIds: Array<string | number>;
};

export type AssignFacetsToChannelInput = {
  channelId: string | number;
  facetIds: Array<string | number>;
};

export type AssignProductVariantsToChannelInput = {
  channelId: string | number;
  priceFactor?: number | null | undefined;
  productVariantIds: Array<string | number>;
};

export type AssignProductsToChannelInput = {
  channelId: string | number;
  priceFactor?: number | null | undefined;
  productIds: Array<string | number>;
};

export type AssignPromotionsToChannelInput = {
  channelId: string | number;
  promotionIds: Array<string | number>;
};

export type AssignStockLocationsToChannelInput = {
  channelId: string | number;
  stockLocationIds: Array<string | number>;
};

export type AuthenticationInput = {
  native?: NativeAuthInput | null | undefined;
};

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
};

export type CancelOrderInput = {
  /** Specify whether the shipping charges should also be cancelled. Defaults to false */
  cancelShipping?: boolean | null | undefined;
  /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
  lines?: Array<OrderLineInput> | null | undefined;
  /** The id of the order to be cancelled */
  orderId: string | number;
  reason?: string | null | undefined;
};

export type CollectionFilterParameter = {
  _and?: Array<CollectionFilterParameter> | null | undefined;
  _or?: Array<CollectionFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  inheritFilters?: BooleanOperators | null | undefined;
  isPrivate?: BooleanOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  parentId?: IdOperators | null | undefined;
  position?: NumberOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CollectionListOptions = {
  /** Allows the results to be filtered */
  filter?: CollectionFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CollectionSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
  topLevelOnly?: boolean | null | undefined;
};

export type CollectionSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  parentId?: SortOrder | null | undefined;
  position?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ConfigArgInput = {
  name: string;
  /** A JSON stringified representation of the actual value */
  value: string;
};

export type ConfigurableOperationInput = {
  arguments: Array<ConfigArgInput>;
  code: string;
};

export type CoordinateInput = {
  x: number;
  y: number;
};

export type CountryFilterParameter = {
  _and?: Array<CountryFilterParameter> | null | undefined;
  _or?: Array<CountryFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  parentId?: IdOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CountryListOptions = {
  /** Allows the results to be filtered */
  filter?: CountryFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CountrySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CountrySortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  parentId?: SortOrder | null | undefined;
  type?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type CountryTranslationInput = {
  customFields?: unknown;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

/**
 * Input used to create an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Deenruv server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type CreateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode: string;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1: string;
  streetLine2?: string | null | undefined;
};

export type CreateAdministratorInput = {
  customFields?: unknown;
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  roleIds: Array<string | number>;
};

export type CreateAssetInput = {
  customFields?: unknown;
  file: unknown;
  tags?: Array<string> | null | undefined;
};

export type CreateChannelInput = {
  availableCurrencyCodes?: Array<CurrencyCode> | null | undefined;
  availableLanguageCodes?: Array<LanguageCode> | null | undefined;
  code: string;
  /** @deprecated Use defaultCurrencyCode instead */
  currencyCode?: CurrencyCode | null | undefined;
  customFields?: unknown;
  defaultCurrencyCode?: CurrencyCode | null | undefined;
  defaultLanguageCode: LanguageCode;
  defaultShippingZoneId: string | number;
  defaultTaxZoneId: string | number;
  outOfStockThreshold?: number | null | undefined;
  pricesIncludeTax: boolean;
  sellerId?: string | number | null | undefined;
  token: string;
  trackInventory?: boolean | null | undefined;
};

export type CreateCollectionInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  featuredAssetId?: string | number | null | undefined;
  filters: Array<ConfigurableOperationInput>;
  inheritFilters?: boolean | null | undefined;
  isPrivate?: boolean | null | undefined;
  parentId?: string | number | null | undefined;
  translations: Array<CreateCollectionTranslationInput>;
};

export type CreateCollectionTranslationInput = {
  customFields?: unknown;
  description: string;
  languageCode: LanguageCode;
  name: string;
  slug: string;
};

export type CreateCountryInput = {
  code: string;
  customFields?: unknown;
  enabled: boolean;
  translations: Array<CountryTranslationInput>;
};

export type CreateCustomerGroupInput = {
  customFields?: unknown;
  customerIds?: Array<string | number> | null | undefined;
  name: string;
};

export type CreateCustomerInput = {
  customFields?: unknown;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type CreateFacetInput = {
  code: string;
  customFields?: unknown;
  isPrivate: boolean;
  translations: Array<FacetTranslationInput>;
  values?: Array<CreateFacetValueWithFacetInput> | null | undefined;
};

export type CreateFacetValueInput = {
  code: string;
  customFields?: unknown;
  facetId: string | number;
  translations: Array<FacetValueTranslationInput>;
};

export type CreateFacetValueWithFacetInput = {
  code: string;
  translations: Array<FacetValueTranslationInput>;
};

export type CreateGroupOptionInput = {
  code: string;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreatePaymentMethodInput = {
  checker?: ConfigurableOperationInput | null | undefined;
  code: string;
  customFields?: unknown;
  enabled: boolean;
  handler: ConfigurableOperationInput;
  translations: Array<PaymentMethodTranslationInput>;
};

export type CreateProductInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string | number> | null | undefined;
  featuredAssetId?: string | number | null | undefined;
  translations: Array<ProductTranslationInput>;
};

export type CreateProductOptionGroupInput = {
  code: string;
  customFields?: unknown;
  options: Array<CreateGroupOptionInput>;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductOptionInput = {
  code: string;
  customFields?: unknown;
  productOptionGroupId: string | number;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductVariantInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  facetValueIds?: Array<string | number> | null | undefined;
  featuredAssetId?: string | number | null | undefined;
  optionIds?: Array<string | number> | null | undefined;
  outOfStockThreshold?: number | null | undefined;
  price?: number | null | undefined;
  productId: string | number;
  sku: string;
  stockLevels?: Array<StockLevelInput> | null | undefined;
  stockOnHand?: number | null | undefined;
  taxCategoryId?: string | number | null | undefined;
  trackInventory?: GlobalFlag | null | undefined;
  translations: Array<ProductVariantTranslationInput>;
  useGlobalOutOfStockThreshold?: boolean | null | undefined;
};

export type CreatePromotionInput = {
  actions: Array<ConfigurableOperationInput>;
  conditions: Array<ConfigurableOperationInput>;
  couponCode?: string | null | undefined;
  customFields?: unknown;
  enabled: boolean;
  endsAt?: unknown;
  perCustomerUsageLimit?: number | null | undefined;
  startsAt?: unknown;
  translations: Array<PromotionTranslationInput>;
  usageLimit?: number | null | undefined;
};

export type CreateRoleInput = {
  channelIds?: Array<string | number> | null | undefined;
  code: string;
  description: string;
  permissions: Array<Permission>;
};

export type CreateShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  code: string;
  customFields?: unknown;
  fulfillmentHandler: string;
  translations: Array<ShippingMethodTranslationInput>;
};

export type CreateStockLocationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  name: string;
};

export type CreateTagInput = {
  value: string;
};

export type CreateTaxCategoryInput = {
  customFields?: unknown;
  isDefault?: boolean | null | undefined;
  name: string;
};

export type CreateTaxRateInput = {
  categoryId: string | number;
  customFields?: unknown;
  customerGroupId?: string | number | null | undefined;
  enabled: boolean;
  name: string;
  value: number;
  zoneId: string | number;
};

export type CreateZoneInput = {
  customFields?: unknown;
  memberIds?: Array<string | number> | null | undefined;
  name: string;
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export type CurrencyCode =
  /** United Arab Emirates dirham */
  | 'AED'
  /** Afghan afghani */
  | 'AFN'
  /** Albanian lek */
  | 'ALL'
  /** Armenian dram */
  | 'AMD'
  /** Netherlands Antillean guilder */
  | 'ANG'
  /** Angolan kwanza */
  | 'AOA'
  /** Argentine peso */
  | 'ARS'
  /** Australian dollar */
  | 'AUD'
  /** Aruban florin */
  | 'AWG'
  /** Azerbaijani manat */
  | 'AZN'
  /** Bosnia and Herzegovina convertible mark */
  | 'BAM'
  /** Barbados dollar */
  | 'BBD'
  /** Bangladeshi taka */
  | 'BDT'
  /** Bulgarian lev */
  | 'BGN'
  /** Bahraini dinar */
  | 'BHD'
  /** Burundian franc */
  | 'BIF'
  /** Bermudian dollar */
  | 'BMD'
  /** Brunei dollar */
  | 'BND'
  /** Boliviano */
  | 'BOB'
  /** Brazilian real */
  | 'BRL'
  /** Bahamian dollar */
  | 'BSD'
  /** Bhutanese ngultrum */
  | 'BTN'
  /** Botswana pula */
  | 'BWP'
  /** Belarusian ruble */
  | 'BYN'
  /** Belize dollar */
  | 'BZD'
  /** Canadian dollar */
  | 'CAD'
  /** Congolese franc */
  | 'CDF'
  /** Swiss franc */
  | 'CHF'
  /** Chilean peso */
  | 'CLP'
  /** Renminbi (Chinese) yuan */
  | 'CNY'
  /** Colombian peso */
  | 'COP'
  /** Costa Rican colon */
  | 'CRC'
  /** Cuban convertible peso */
  | 'CUC'
  /** Cuban peso */
  | 'CUP'
  /** Cape Verde escudo */
  | 'CVE'
  /** Czech koruna */
  | 'CZK'
  /** Djiboutian franc */
  | 'DJF'
  /** Danish krone */
  | 'DKK'
  /** Dominican peso */
  | 'DOP'
  /** Algerian dinar */
  | 'DZD'
  /** Egyptian pound */
  | 'EGP'
  /** Eritrean nakfa */
  | 'ERN'
  /** Ethiopian birr */
  | 'ETB'
  /** Euro */
  | 'EUR'
  /** Fiji dollar */
  | 'FJD'
  /** Falkland Islands pound */
  | 'FKP'
  /** Pound sterling */
  | 'GBP'
  /** Georgian lari */
  | 'GEL'
  /** Ghanaian cedi */
  | 'GHS'
  /** Gibraltar pound */
  | 'GIP'
  /** Gambian dalasi */
  | 'GMD'
  /** Guinean franc */
  | 'GNF'
  /** Guatemalan quetzal */
  | 'GTQ'
  /** Guyanese dollar */
  | 'GYD'
  /** Hong Kong dollar */
  | 'HKD'
  /** Honduran lempira */
  | 'HNL'
  /** Croatian kuna */
  | 'HRK'
  /** Haitian gourde */
  | 'HTG'
  /** Hungarian forint */
  | 'HUF'
  /** Indonesian rupiah */
  | 'IDR'
  /** Israeli new shekel */
  | 'ILS'
  /** Indian rupee */
  | 'INR'
  /** Iraqi dinar */
  | 'IQD'
  /** Iranian rial */
  | 'IRR'
  /** Icelandic króna */
  | 'ISK'
  /** Jamaican dollar */
  | 'JMD'
  /** Jordanian dinar */
  | 'JOD'
  /** Japanese yen */
  | 'JPY'
  /** Kenyan shilling */
  | 'KES'
  /** Kyrgyzstani som */
  | 'KGS'
  /** Cambodian riel */
  | 'KHR'
  /** Comoro franc */
  | 'KMF'
  /** North Korean won */
  | 'KPW'
  /** South Korean won */
  | 'KRW'
  /** Kuwaiti dinar */
  | 'KWD'
  /** Cayman Islands dollar */
  | 'KYD'
  /** Kazakhstani tenge */
  | 'KZT'
  /** Lao kip */
  | 'LAK'
  /** Lebanese pound */
  | 'LBP'
  /** Sri Lankan rupee */
  | 'LKR'
  /** Liberian dollar */
  | 'LRD'
  /** Lesotho loti */
  | 'LSL'
  /** Libyan dinar */
  | 'LYD'
  /** Moroccan dirham */
  | 'MAD'
  /** Moldovan leu */
  | 'MDL'
  /** Malagasy ariary */
  | 'MGA'
  /** Macedonian denar */
  | 'MKD'
  /** Myanmar kyat */
  | 'MMK'
  /** Mongolian tögrög */
  | 'MNT'
  /** Macanese pataca */
  | 'MOP'
  /** Mauritanian ouguiya */
  | 'MRU'
  /** Mauritian rupee */
  | 'MUR'
  /** Maldivian rufiyaa */
  | 'MVR'
  /** Malawian kwacha */
  | 'MWK'
  /** Mexican peso */
  | 'MXN'
  /** Malaysian ringgit */
  | 'MYR'
  /** Mozambican metical */
  | 'MZN'
  /** Namibian dollar */
  | 'NAD'
  /** Nigerian naira */
  | 'NGN'
  /** Nicaraguan córdoba */
  | 'NIO'
  /** Norwegian krone */
  | 'NOK'
  /** Nepalese rupee */
  | 'NPR'
  /** New Zealand dollar */
  | 'NZD'
  /** Omani rial */
  | 'OMR'
  /** Panamanian balboa */
  | 'PAB'
  /** Peruvian sol */
  | 'PEN'
  /** Papua New Guinean kina */
  | 'PGK'
  /** Philippine peso */
  | 'PHP'
  /** Pakistani rupee */
  | 'PKR'
  /** Polish złoty */
  | 'PLN'
  /** Paraguayan guaraní */
  | 'PYG'
  /** Qatari riyal */
  | 'QAR'
  /** Romanian leu */
  | 'RON'
  /** Serbian dinar */
  | 'RSD'
  /** Russian ruble */
  | 'RUB'
  /** Rwandan franc */
  | 'RWF'
  /** Saudi riyal */
  | 'SAR'
  /** Solomon Islands dollar */
  | 'SBD'
  /** Seychelles rupee */
  | 'SCR'
  /** Sudanese pound */
  | 'SDG'
  /** Swedish krona/kronor */
  | 'SEK'
  /** Singapore dollar */
  | 'SGD'
  /** Saint Helena pound */
  | 'SHP'
  /** Sierra Leonean leone */
  | 'SLL'
  /** Somali shilling */
  | 'SOS'
  /** Surinamese dollar */
  | 'SRD'
  /** South Sudanese pound */
  | 'SSP'
  /** São Tomé and Príncipe dobra */
  | 'STN'
  /** Salvadoran colón */
  | 'SVC'
  /** Syrian pound */
  | 'SYP'
  /** Swazi lilangeni */
  | 'SZL'
  /** Thai baht */
  | 'THB'
  /** Tajikistani somoni */
  | 'TJS'
  /** Turkmenistan manat */
  | 'TMT'
  /** Tunisian dinar */
  | 'TND'
  /** Tongan paʻanga */
  | 'TOP'
  /** Turkish lira */
  | 'TRY'
  /** Trinidad and Tobago dollar */
  | 'TTD'
  /** New Taiwan dollar */
  | 'TWD'
  /** Tanzanian shilling */
  | 'TZS'
  /** Ukrainian hryvnia */
  | 'UAH'
  /** Ugandan shilling */
  | 'UGX'
  /** United States dollar */
  | 'USD'
  /** Uruguayan peso */
  | 'UYU'
  /** Uzbekistan som */
  | 'UZS'
  /** Venezuelan bolívar soberano */
  | 'VES'
  /** Vietnamese đồng */
  | 'VND'
  /** Vanuatu vatu */
  | 'VUV'
  /** Samoan tala */
  | 'WST'
  /** CFA franc BEAC */
  | 'XAF'
  /** East Caribbean dollar */
  | 'XCD'
  /** CFA franc BCEAO */
  | 'XOF'
  /** CFP franc (franc Pacifique) */
  | 'XPF'
  /** Yemeni rial */
  | 'YER'
  /** South African rand */
  | 'ZAR'
  /** Zambian kwacha */
  | 'ZMW'
  /** Zimbabwean dollar */
  | 'ZWL';

export type CustomerFilterParameter = {
  _and?: Array<CustomerFilterParameter> | null | undefined;
  _or?: Array<CustomerFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  emailAddress?: StringOperators | null | undefined;
  firstName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  lastName?: StringOperators | null | undefined;
  phoneNumber?: StringOperators | null | undefined;
  postalCode?: StringOperators | null | undefined;
  title?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CustomerGroupFilterParameter = {
  _and?: Array<CustomerGroupFilterParameter> | null | undefined;
  _or?: Array<CustomerGroupFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type CustomerGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: CustomerGroupFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CustomerGroupSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CustomerGroupSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type CustomerListOptions = {
  /** Allows the results to be filtered */
  filter?: CustomerFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: CustomerSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type CustomerSortParameter = {
  createdAt?: SortOrder | null | undefined;
  emailAddress?: SortOrder | null | undefined;
  firstName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  lastName?: SortOrder | null | undefined;
  phoneNumber?: SortOrder | null | undefined;
  title?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: unknown;
  before?: unknown;
  between?: DateRange | null | undefined;
  eq?: unknown;
  isNull?: boolean | null | undefined;
};

export type DateRange = {
  end: unknown;
  start: unknown;
};

export type DeleteAssetInput = {
  assetId: string | number;
  deleteFromAllChannels?: boolean | null | undefined;
  force?: boolean | null | undefined;
};

export type DeleteStockLocationInput = {
  id: string | number;
  transferToLocationId?: string | number | null | undefined;
};

export type DeletionResult =
  /** The entity was successfully deleted */
  | 'DELETED'
  /** Deletion did not take place, reason given in message */
  | 'NOT_DELETED';

export type DuplicateEntityInput = {
  duplicatorInput: ConfigurableOperationInput;
  entityId: string | number;
  entityName: string;
};

export type ErrorCode =
  | 'ALREADY_REFUNDED_ERROR'
  | 'CANCEL_ACTIVE_ORDER_ERROR'
  | 'CANCEL_PAYMENT_ERROR'
  | 'CHANNEL_DEFAULT_LANGUAGE_ERROR'
  | 'COUPON_CODE_EXPIRED_ERROR'
  | 'COUPON_CODE_INVALID_ERROR'
  | 'COUPON_CODE_LIMIT_ERROR'
  | 'CREATE_FULFILLMENT_ERROR'
  | 'DUPLICATE_ENTITY_ERROR'
  | 'EMAIL_ADDRESS_CONFLICT_ERROR'
  | 'EMPTY_ORDER_LINE_SELECTION_ERROR'
  | 'FACET_IN_USE_ERROR'
  | 'FULFILLMENT_STATE_TRANSITION_ERROR'
  | 'GUEST_CHECKOUT_ERROR'
  | 'INELIGIBLE_SHIPPING_METHOD_ERROR'
  | 'INSUFFICIENT_STOCK_ERROR'
  | 'INSUFFICIENT_STOCK_ON_HAND_ERROR'
  | 'INVALID_CREDENTIALS_ERROR'
  | 'INVALID_FULFILLMENT_HANDLER_ERROR'
  | 'ITEMS_ALREADY_FULFILLED_ERROR'
  | 'LANGUAGE_NOT_AVAILABLE_ERROR'
  | 'MANUAL_PAYMENT_STATE_ERROR'
  | 'MIME_TYPE_ERROR'
  | 'MISSING_CONDITIONS_ERROR'
  | 'MULTIPLE_ORDER_ERROR'
  | 'NATIVE_AUTH_STRATEGY_ERROR'
  | 'NEGATIVE_QUANTITY_ERROR'
  | 'NOTHING_TO_REFUND_ERROR'
  | 'NO_ACTIVE_ORDER_ERROR'
  | 'NO_CHANGES_SPECIFIED_ERROR'
  | 'ORDER_LIMIT_ERROR'
  | 'ORDER_MIDDLEWARE_ERROR'
  | 'ORDER_MODIFICATION_ERROR'
  | 'ORDER_MODIFICATION_STATE_ERROR'
  | 'ORDER_STATE_TRANSITION_ERROR'
  | 'PAYMENT_METHOD_MISSING_ERROR'
  | 'PAYMENT_ORDER_MISMATCH_ERROR'
  | 'PAYMENT_STATE_TRANSITION_ERROR'
  | 'PRODUCT_OPTION_IN_USE_ERROR'
  | 'QUANTITY_TOO_GREAT_ERROR'
  | 'REFUND_AMOUNT_ERROR'
  | 'REFUND_ORDER_STATE_ERROR'
  | 'REFUND_PAYMENT_ID_MISSING_ERROR'
  | 'REFUND_STATE_TRANSITION_ERROR'
  | 'SETTLE_PAYMENT_ERROR'
  | 'UNKNOWN_ERROR';

export type FacetFilterParameter = {
  _and?: Array<FacetFilterParameter> | null | undefined;
  _or?: Array<FacetFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isPrivate?: BooleanOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type FacetListOptions = {
  /** Allows the results to be filtered */
  filter?: FacetFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: FacetSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type FacetSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type FacetTranslationInput = {
  customFields?: unknown;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
  and?: string | number | null | undefined;
  or?: Array<string | number> | null | undefined;
};

export type FacetValueFilterParameter = {
  _and?: Array<FacetValueFilterParameter> | null | undefined;
  _or?: Array<FacetValueFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  facetId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type FacetValueListOptions = {
  /** Allows the results to be filtered */
  filter?: FacetValueFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: FacetValueSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type FacetValueSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  facetId?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type FacetValueTranslationInput = {
  customFields?: unknown;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type FulfillOrderInput = {
  handler: ConfigurableOperationInput;
  lines: Array<OrderLineInput>;
};

export type GlobalFlag =
  | 'FALSE'
  | 'INHERIT'
  | 'TRUE';

export type HistoryEntryFilterParameter = {
  _and?: Array<HistoryEntryFilterParameter> | null | undefined;
  _or?: Array<HistoryEntryFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isPublic?: BooleanOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type HistoryEntryListOptions = {
  /** Allows the results to be filtered */
  filter?: HistoryEntryFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: HistoryEntrySortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type HistoryEntrySortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type HistoryEntryType =
  | 'CUSTOMER_ADDED_TO_GROUP'
  | 'CUSTOMER_ADDRESS_CREATED'
  | 'CUSTOMER_ADDRESS_DELETED'
  | 'CUSTOMER_ADDRESS_UPDATED'
  | 'CUSTOMER_DETAIL_UPDATED'
  | 'CUSTOMER_EMAIL_UPDATE_REQUESTED'
  | 'CUSTOMER_EMAIL_UPDATE_VERIFIED'
  | 'CUSTOMER_NOTE'
  | 'CUSTOMER_PASSWORD_RESET_REQUESTED'
  | 'CUSTOMER_PASSWORD_RESET_VERIFIED'
  | 'CUSTOMER_PASSWORD_UPDATED'
  | 'CUSTOMER_REGISTERED'
  | 'CUSTOMER_REMOVED_FROM_GROUP'
  | 'CUSTOMER_VERIFIED'
  | 'ORDER_CANCELLATION'
  | 'ORDER_COUPON_APPLIED'
  | 'ORDER_COUPON_REMOVED'
  | 'ORDER_CUSTOMER_UPDATED'
  | 'ORDER_FULFILLMENT'
  | 'ORDER_FULFILLMENT_TRANSITION'
  | 'ORDER_MODIFIED'
  | 'ORDER_NOTE'
  | 'ORDER_PAYMENT_TRANSITION'
  | 'ORDER_REFUND_TRANSITION'
  | 'ORDER_STATE_TRANSITION';

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
};

export type JobFilterParameter = {
  _and?: Array<JobFilterParameter> | null | undefined;
  _or?: Array<JobFilterParameter> | null | undefined;
  attempts?: NumberOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  duration?: NumberOperators | null | undefined;
  id?: IdOperators | null | undefined;
  isSettled?: BooleanOperators | null | undefined;
  progress?: NumberOperators | null | undefined;
  queueName?: StringOperators | null | undefined;
  retries?: NumberOperators | null | undefined;
  settledAt?: DateOperators | null | undefined;
  startedAt?: DateOperators | null | undefined;
  state?: StringOperators | null | undefined;
};

export type JobListOptions = {
  /** Allows the results to be filtered */
  filter?: JobFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: JobSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type JobSortParameter = {
  attempts?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  duration?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  progress?: SortOrder | null | undefined;
  queueName?: SortOrder | null | undefined;
  retries?: SortOrder | null | undefined;
  settledAt?: SortOrder | null | undefined;
  startedAt?: SortOrder | null | undefined;
};

/**
 * @description
 * The state of a Job in the JobQueue
 *
 * @docsCategory common
 */
export type JobState =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'FAILED'
  | 'PENDING'
  | 'RETRYING'
  | 'RUNNING';

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export type LanguageCode =
  /** Afrikaans */
  | 'af'
  /** Akan */
  | 'ak'
  /** Amharic */
  | 'am'
  /** Arabic */
  | 'ar'
  /** Assamese */
  | 'as'
  /** Azerbaijani */
  | 'az'
  /** Belarusian */
  | 'be'
  /** Bulgarian */
  | 'bg'
  /** Bambara */
  | 'bm'
  /** Bangla */
  | 'bn'
  /** Tibetan */
  | 'bo'
  /** Breton */
  | 'br'
  /** Bosnian */
  | 'bs'
  /** Catalan */
  | 'ca'
  /** Chechen */
  | 'ce'
  /** Corsican */
  | 'co'
  /** Czech */
  | 'cs'
  /** Church Slavic */
  | 'cu'
  /** Welsh */
  | 'cy'
  /** Danish */
  | 'da'
  /** German */
  | 'de'
  /** Austrian German */
  | 'de_AT'
  /** Swiss High German */
  | 'de_CH'
  /** Dzongkha */
  | 'dz'
  /** Ewe */
  | 'ee'
  /** Greek */
  | 'el'
  /** English */
  | 'en'
  /** Australian English */
  | 'en_AU'
  /** Canadian English */
  | 'en_CA'
  /** British English */
  | 'en_GB'
  /** American English */
  | 'en_US'
  /** Esperanto */
  | 'eo'
  /** Spanish */
  | 'es'
  /** European Spanish */
  | 'es_ES'
  /** Mexican Spanish */
  | 'es_MX'
  /** Estonian */
  | 'et'
  /** Basque */
  | 'eu'
  /** Persian */
  | 'fa'
  /** Dari */
  | 'fa_AF'
  /** Fulah */
  | 'ff'
  /** Finnish */
  | 'fi'
  /** Faroese */
  | 'fo'
  /** French */
  | 'fr'
  /** Canadian French */
  | 'fr_CA'
  /** Swiss French */
  | 'fr_CH'
  /** Western Frisian */
  | 'fy'
  /** Irish */
  | 'ga'
  /** Scottish Gaelic */
  | 'gd'
  /** Galician */
  | 'gl'
  /** Gujarati */
  | 'gu'
  /** Manx */
  | 'gv'
  /** Hausa */
  | 'ha'
  /** Hebrew */
  | 'he'
  /** Hindi */
  | 'hi'
  /** Croatian */
  | 'hr'
  /** Haitian Creole */
  | 'ht'
  /** Hungarian */
  | 'hu'
  /** Armenian */
  | 'hy'
  /** Interlingua */
  | 'ia'
  /** Indonesian */
  | 'id'
  /** Igbo */
  | 'ig'
  /** Sichuan Yi */
  | 'ii'
  /** Icelandic */
  | 'is'
  /** Italian */
  | 'it'
  /** Japanese */
  | 'ja'
  /** Javanese */
  | 'jv'
  /** Georgian */
  | 'ka'
  /** Kikuyu */
  | 'ki'
  /** Kazakh */
  | 'kk'
  /** Kalaallisut */
  | 'kl'
  /** Khmer */
  | 'km'
  /** Kannada */
  | 'kn'
  /** Korean */
  | 'ko'
  /** Kashmiri */
  | 'ks'
  /** Kurdish */
  | 'ku'
  /** Cornish */
  | 'kw'
  /** Kyrgyz */
  | 'ky'
  /** Latin */
  | 'la'
  /** Luxembourgish */
  | 'lb'
  /** Ganda */
  | 'lg'
  /** Lingala */
  | 'ln'
  /** Lao */
  | 'lo'
  /** Lithuanian */
  | 'lt'
  /** Luba-Katanga */
  | 'lu'
  /** Latvian */
  | 'lv'
  /** Malagasy */
  | 'mg'
  /** Maori */
  | 'mi'
  /** Macedonian */
  | 'mk'
  /** Malayalam */
  | 'ml'
  /** Mongolian */
  | 'mn'
  /** Marathi */
  | 'mr'
  /** Malay */
  | 'ms'
  /** Maltese */
  | 'mt'
  /** Burmese */
  | 'my'
  /** Norwegian Bokmål */
  | 'nb'
  /** North Ndebele */
  | 'nd'
  /** Nepali */
  | 'ne'
  /** Dutch */
  | 'nl'
  /** Flemish */
  | 'nl_BE'
  /** Norwegian Nynorsk */
  | 'nn'
  /** Nyanja */
  | 'ny'
  /** Oromo */
  | 'om'
  /** Odia */
  | 'or'
  /** Ossetic */
  | 'os'
  /** Punjabi */
  | 'pa'
  /** Polish */
  | 'pl'
  /** Pashto */
  | 'ps'
  /** Portuguese */
  | 'pt'
  /** Brazilian Portuguese */
  | 'pt_BR'
  /** European Portuguese */
  | 'pt_PT'
  /** Quechua */
  | 'qu'
  /** Romansh */
  | 'rm'
  /** Rundi */
  | 'rn'
  /** Romanian */
  | 'ro'
  /** Moldavian */
  | 'ro_MD'
  /** Russian */
  | 'ru'
  /** Kinyarwanda */
  | 'rw'
  /** Sanskrit */
  | 'sa'
  /** Sindhi */
  | 'sd'
  /** Northern Sami */
  | 'se'
  /** Sango */
  | 'sg'
  /** Sinhala */
  | 'si'
  /** Slovak */
  | 'sk'
  /** Slovenian */
  | 'sl'
  /** Samoan */
  | 'sm'
  /** Shona */
  | 'sn'
  /** Somali */
  | 'so'
  /** Albanian */
  | 'sq'
  /** Serbian */
  | 'sr'
  /** Southern Sotho */
  | 'st'
  /** Sundanese */
  | 'su'
  /** Swedish */
  | 'sv'
  /** Swahili */
  | 'sw'
  /** Congo Swahili */
  | 'sw_CD'
  /** Tamil */
  | 'ta'
  /** Telugu */
  | 'te'
  /** Tajik */
  | 'tg'
  /** Thai */
  | 'th'
  /** Tigrinya */
  | 'ti'
  /** Turkmen */
  | 'tk'
  /** Tongan */
  | 'to'
  /** Turkish */
  | 'tr'
  /** Tatar */
  | 'tt'
  /** Uyghur */
  | 'ug'
  /** Ukrainian */
  | 'uk'
  /** Urdu */
  | 'ur'
  /** Uzbek */
  | 'uz'
  /** Vietnamese */
  | 'vi'
  /** Volapük */
  | 'vo'
  /** Wolof */
  | 'wo'
  /** Xhosa */
  | 'xh'
  /** Yiddish */
  | 'yi'
  /** Yoruba */
  | 'yo'
  /** Chinese */
  | 'zh'
  /** Simplified Chinese */
  | 'zh_Hans'
  /** Traditional Chinese */
  | 'zh_Hant'
  /** Zulu */
  | 'zu';

export type LogicalOperator =
  | 'AND'
  | 'OR';

export type ManualPaymentInput = {
  metadata?: unknown;
  method: string;
  orderId: string | number;
  transactionId?: string | null | undefined;
};

export type ModifyOrderInput = {
  addItems?: Array<AddItemInput> | null | undefined;
  adjustOrderLines?: Array<OrderLineInput> | null | undefined;
  couponCodes?: Array<string> | null | undefined;
  customFields?: UpdateOrderCustomFieldsInput | null | undefined;
  dryRun: boolean;
  note?: string | null | undefined;
  options?: ModifyOrderOptions | null | undefined;
  orderId: string | number;
  /**
   * Deprecated in v2.2.0. Use `refunds` instead to allow multiple refunds to be
   * applied in the case that multiple payment methods have been used on the order.
   */
  refund?: AdministratorRefundInput | null | undefined;
  refunds?: Array<AdministratorRefundInput> | null | undefined;
  /** Added in v2.2 */
  shippingMethodIds?: Array<string | number> | null | undefined;
  surcharges?: Array<SurchargeInput> | null | undefined;
  updateBillingAddress?: UpdateOrderAddressInput | null | undefined;
  updateShippingAddress?: UpdateOrderAddressInput | null | undefined;
};

export type ModifyOrderOptions = {
  freezePromotions?: boolean | null | undefined;
  recalculateShipping?: boolean | null | undefined;
};

export type MoveCollectionInput = {
  collectionId: string | number;
  index: number;
  parentId: string | number;
};

export type NativeAuthInput = {
  password: string;
  username: string;
};

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
  between?: NumberRange | null | undefined;
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  isNull?: boolean | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
};

export type NumberRange = {
  end: number;
  start: number;
};

export type OrderFilterParameter = {
  _and?: Array<OrderFilterParameter> | null | undefined;
  _or?: Array<OrderFilterParameter> | null | undefined;
  active?: BooleanOperators | null | undefined;
  aggregateOrderId?: IdOperators | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  customerLastName?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  orderPlacedAt?: DateOperators | null | undefined;
  pickupPointId?: StringOperators | null | undefined;
  shipping?: NumberOperators | null | undefined;
  shippingWithTax?: NumberOperators | null | undefined;
  state?: StringOperators | null | undefined;
  subTotal?: NumberOperators | null | undefined;
  subTotalWithTax?: NumberOperators | null | undefined;
  total?: NumberOperators | null | undefined;
  totalQuantity?: NumberOperators | null | undefined;
  totalWithTax?: NumberOperators | null | undefined;
  transactionId?: StringOperators | null | undefined;
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type OrderLineInput = {
  orderLineId: string | number;
  quantity: number;
};

export type OrderListOptions = {
  /** Allows the results to be filtered */
  filter?: OrderFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: OrderSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type OrderSortParameter = {
  aggregateOrderId?: SortOrder | null | undefined;
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  customerLastName?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  orderPlacedAt?: SortOrder | null | undefined;
  pickupPointId?: SortOrder | null | undefined;
  shipping?: SortOrder | null | undefined;
  shippingWithTax?: SortOrder | null | undefined;
  state?: SortOrder | null | undefined;
  subTotal?: SortOrder | null | undefined;
  subTotalWithTax?: SortOrder | null | undefined;
  total?: SortOrder | null | undefined;
  totalQuantity?: SortOrder | null | undefined;
  totalWithTax?: SortOrder | null | undefined;
  transactionId?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type PaymentMethodFilterParameter = {
  _and?: Array<PaymentMethodFilterParameter> | null | undefined;
  _or?: Array<PaymentMethodFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type PaymentMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: PaymentMethodFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: PaymentMethodSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type PaymentMethodSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type PaymentMethodTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * ## Understanding Permission.Owner
 *
 * `Permission.Owner` is a special permission which is used in some Deenruv resolvers to indicate that that resolver should only
 * be accessible to the "owner" of that resource.
 *
 * For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
 * based on the activeUserId of the current session. As a result, the resolver code looks like this:
 *
 * @example
 * ```TypeScript
 * \@Query()
 * \@Allow(Permission.Owner)
 * async activeCustomer(\@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
 *   const userId = ctx.activeUserId;
 *   if (userId) {
 *     return this.customerService.findOneByUserId(ctx, userId);
 *   }
 * }
 * ```
 *
 * Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
 * nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
 * of the resource has access. If not, then it is the equivalent of using `Permission.Public`.
 *
 *
 * @docsCategory common
 */
export type Permission =
  /** Authenticated means simply that the user is logged in */
  | 'Authenticated'
  /** Grants permission to create Administrator */
  | 'CreateAdministrator'
  /** Grants permission to create Asset */
  | 'CreateAsset'
  /** Grants permission to create Products, Facets, Assets, Collections */
  | 'CreateCatalog'
  /** Grants permission to create Channel */
  | 'CreateChannel'
  /** Grants permission to create Collection */
  | 'CreateCollection'
  /** Grants permission to create Country */
  | 'CreateCountry'
  /** Grants permission to create Customer */
  | 'CreateCustomer'
  /** Grants permission to create CustomerGroup */
  | 'CreateCustomerGroup'
  /** Grants permission to create Facet */
  | 'CreateFacet'
  /** Grants permission to create Order */
  | 'CreateOrder'
  /** Grants permission to create PaymentMethod */
  | 'CreatePaymentMethod'
  /** Grants permission to create Product */
  | 'CreateProduct'
  /** Grants permission to create Promotion */
  | 'CreatePromotion'
  /** Grants permission to create Seller */
  | 'CreateSeller'
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'CreateSettings'
  /** Grants permission to create ShippingMethod */
  | 'CreateShippingMethod'
  /** Grants permission to create StockLocation */
  | 'CreateStockLocation'
  /** Grants permission to create System */
  | 'CreateSystem'
  /** Grants permission to create Tag */
  | 'CreateTag'
  /** Grants permission to create TaxCategory */
  | 'CreateTaxCategory'
  /** Grants permission to create TaxRate */
  | 'CreateTaxRate'
  /** Grants permission to create Zone */
  | 'CreateZone'
  /** Grants permission to delete Administrator */
  | 'DeleteAdministrator'
  /** Grants permission to delete Asset */
  | 'DeleteAsset'
  /** Grants permission to delete Products, Facets, Assets, Collections */
  | 'DeleteCatalog'
  /** Grants permission to delete Channel */
  | 'DeleteChannel'
  /** Grants permission to delete Collection */
  | 'DeleteCollection'
  /** Grants permission to delete Country */
  | 'DeleteCountry'
  /** Grants permission to delete Customer */
  | 'DeleteCustomer'
  /** Grants permission to delete CustomerGroup */
  | 'DeleteCustomerGroup'
  /** Grants permission to delete Facet */
  | 'DeleteFacet'
  /** Grants permission to delete Order */
  | 'DeleteOrder'
  /** Grants permission to delete PaymentMethod */
  | 'DeletePaymentMethod'
  /** Grants permission to delete Product */
  | 'DeleteProduct'
  /** Grants permission to delete Promotion */
  | 'DeletePromotion'
  /** Grants permission to delete Seller */
  | 'DeleteSeller'
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'DeleteSettings'
  /** Grants permission to delete ShippingMethod */
  | 'DeleteShippingMethod'
  /** Grants permission to delete StockLocation */
  | 'DeleteStockLocation'
  /** Grants permission to delete System */
  | 'DeleteSystem'
  /** Grants permission to delete Tag */
  | 'DeleteTag'
  /** Grants permission to delete TaxCategory */
  | 'DeleteTaxCategory'
  /** Grants permission to delete TaxRate */
  | 'DeleteTaxRate'
  /** Grants permission to delete Zone */
  | 'DeleteZone'
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  | 'Owner'
  /** Public means any unauthenticated user may perform the operation */
  | 'Public'
  /** Grants permission to read Administrator */
  | 'ReadAdministrator'
  /** Grants permission to read Asset */
  | 'ReadAsset'
  /** Grants permission to read Products, Facets, Assets, Collections */
  | 'ReadCatalog'
  /** Grants permission to read Channel */
  | 'ReadChannel'
  /** Grants permission to read Collection */
  | 'ReadCollection'
  /** Grants permission to read Country */
  | 'ReadCountry'
  /** Grants permission to read Customer */
  | 'ReadCustomer'
  /** Grants permission to read CustomerGroup */
  | 'ReadCustomerGroup'
  /** Grants permission to read Facet */
  | 'ReadFacet'
  /** Grants permission to read Order */
  | 'ReadOrder'
  /** Grants permission to read PaymentMethod */
  | 'ReadPaymentMethod'
  /** Grants permission to read Product */
  | 'ReadProduct'
  /** Grants permission to read Promotion */
  | 'ReadPromotion'
  /** Grants permission to read Seller */
  | 'ReadSeller'
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'ReadSettings'
  /** Grants permission to read ShippingMethod */
  | 'ReadShippingMethod'
  /** Grants permission to read StockLocation */
  | 'ReadStockLocation'
  /** Grants permission to read System */
  | 'ReadSystem'
  /** Grants permission to read Tag */
  | 'ReadTag'
  /** Grants permission to read TaxCategory */
  | 'ReadTaxCategory'
  /** Grants permission to read TaxRate */
  | 'ReadTaxRate'
  /** Grants permission to read Zone */
  | 'ReadZone'
  /** SuperAdmin has unrestricted access to all operations */
  | 'SuperAdmin'
  /** Grants permission to update Administrator */
  | 'UpdateAdministrator'
  /** Grants permission to update Asset */
  | 'UpdateAsset'
  /** Grants permission to update Products, Facets, Assets, Collections */
  | 'UpdateCatalog'
  /** Grants permission to update Channel */
  | 'UpdateChannel'
  /** Grants permission to update Collection */
  | 'UpdateCollection'
  /** Grants permission to update Country */
  | 'UpdateCountry'
  /** Grants permission to update Customer */
  | 'UpdateCustomer'
  /** Grants permission to update CustomerGroup */
  | 'UpdateCustomerGroup'
  /** Grants permission to update Facet */
  | 'UpdateFacet'
  /** Grants permission to update GlobalSettings */
  | 'UpdateGlobalSettings'
  /** Grants permission to update Order */
  | 'UpdateOrder'
  /** Grants permission to update PaymentMethod */
  | 'UpdatePaymentMethod'
  /** Grants permission to update Product */
  | 'UpdateProduct'
  /** Grants permission to update Promotion */
  | 'UpdatePromotion'
  /** Grants permission to update Seller */
  | 'UpdateSeller'
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  | 'UpdateSettings'
  /** Grants permission to update ShippingMethod */
  | 'UpdateShippingMethod'
  /** Grants permission to update StockLocation */
  | 'UpdateStockLocation'
  /** Grants permission to update System */
  | 'UpdateSystem'
  /** Grants permission to update Tag */
  | 'UpdateTag'
  /** Grants permission to update TaxCategory */
  | 'UpdateTaxCategory'
  /** Grants permission to update TaxRate */
  | 'UpdateTaxRate'
  /** Grants permission to update Zone */
  | 'UpdateZone';

export type PreviewCollectionVariantsInput = {
  filters: Array<ConfigurableOperationInput>;
  inheritFilters: boolean;
  parentId?: string | number | null | undefined;
};

export type ProductFilterParameter = {
  _and?: Array<ProductFilterParameter> | null | undefined;
  _or?: Array<ProductFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  facetValueId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  sku?: StringOperators | null | undefined;
  slug?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  searchTerm?: string | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ProductOptionGroupTranslationInput = {
  customFields?: unknown;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type ProductSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  slug?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ProductTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
  slug?: string | null | undefined;
};

export type ProductVariantFilterParameter = {
  _and?: Array<ProductVariantFilterParameter> | null | undefined;
  _or?: Array<ProductVariantFilterParameter> | null | undefined;
  communicateID?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  facetValueId?: IdOperators | null | undefined;
  id?: IdOperators | null | undefined;
  languageCode?: StringOperators | null | undefined;
  name?: StringOperators | null | undefined;
  outOfStockThreshold?: NumberOperators | null | undefined;
  price?: NumberOperators | null | undefined;
  priceWithTax?: NumberOperators | null | undefined;
  productId?: IdOperators | null | undefined;
  sku?: StringOperators | null | undefined;
  stockAllocated?: NumberOperators | null | undefined;
  stockLevel?: StringOperators | null | undefined;
  stockOnHand?: NumberOperators | null | undefined;
  trackInventory?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  useGlobalOutOfStockThreshold?: BooleanOperators | null | undefined;
};

export type ProductVariantListOptions = {
  /** Allows the results to be filtered */
  filter?: ProductVariantFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  searchTerm?: string | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ProductVariantSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

/**
 * Used to set up update the price of a ProductVariant in a particular Channel.
 * If the `delete` flag is `true`, the price will be deleted for the given Channel.
 */
export type ProductVariantPriceInput = {
  currencyCode: CurrencyCode;
  delete?: boolean | null | undefined;
  price: number;
};

export type ProductVariantSortParameter = {
  communicateID?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  outOfStockThreshold?: SortOrder | null | undefined;
  price?: SortOrder | null | undefined;
  priceWithTax?: SortOrder | null | undefined;
  productId?: SortOrder | null | undefined;
  sku?: SortOrder | null | undefined;
  stockAllocated?: SortOrder | null | undefined;
  stockLevel?: SortOrder | null | undefined;
  stockOnHand?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type ProductVariantTranslationInput = {
  customFields?: unknown;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type PromotionFilterParameter = {
  _and?: Array<PromotionFilterParameter> | null | undefined;
  _or?: Array<PromotionFilterParameter> | null | undefined;
  couponCode?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  endsAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  perCustomerUsageLimit?: NumberOperators | null | undefined;
  startsAt?: DateOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  usageLimit?: NumberOperators | null | undefined;
};

export type PromotionListOptions = {
  /** Allows the results to be filtered */
  filter?: PromotionFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: PromotionSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type PromotionSortParameter = {
  couponCode?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  endsAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  perCustomerUsageLimit?: SortOrder | null | undefined;
  startsAt?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  usageLimit?: SortOrder | null | undefined;
};

export type PromotionTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type RefundOrderInput = {
  adjustment: number;
  /**
   * If an amount is specified, this value will be used to create a Refund rather than calculating the
   * amount automatically. This was added in v2.2 and will be the preferred way to specify the refund
   * amount in the future. The `lines`, `shipping` and `adjustment` fields will likely be removed in a future
   * version.
   */
  amount?: number | null | undefined;
  lines: Array<OrderLineInput>;
  paymentId: string | number;
  reason?: string | null | undefined;
  shipping: number;
};

export type RemoveCollectionsFromChannelInput = {
  channelId: string | number;
  collectionIds: Array<string | number>;
};

export type RemoveFacetsFromChannelInput = {
  channelId: string | number;
  facetIds: Array<string | number>;
  force?: boolean | null | undefined;
};

export type RemoveProductVariantsFromChannelInput = {
  channelId: string | number;
  productVariantIds: Array<string | number>;
};

export type RemoveProductsFromChannelInput = {
  channelId: string | number;
  productIds: Array<string | number>;
};

export type RemovePromotionsFromChannelInput = {
  channelId: string | number;
  promotionIds: Array<string | number>;
};

export type RemoveStockLocationsFromChannelInput = {
  channelId: string | number;
  stockLocationIds: Array<string | number>;
};

export type RoleFilterParameter = {
  _and?: Array<RoleFilterParameter> | null | undefined;
  _or?: Array<RoleFilterParameter> | null | undefined;
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type RoleListOptions = {
  /** Allows the results to be filtered */
  filter?: RoleFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: RoleSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type RoleSortParameter = {
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type SearchInput = {
  collectionId?: string | number | null | undefined;
  collectionSlug?: string | null | undefined;
  facetValueFilters?: Array<FacetValueFilterInput> | null | undefined;
  /** @deprecated Use `facetValueFilters` instead */
  facetValueIds?: Array<string | number> | null | undefined;
  /** @deprecated Use `facetValueFilters` instead */
  facetValueOperator?: LogicalOperator | null | undefined;
  groupByProduct?: boolean | null | undefined;
  skip?: number | null | undefined;
  sort?: SearchResultSortParameter | null | undefined;
  take?: number | null | undefined;
  term?: string | null | undefined;
};

export type SearchResultSortParameter = {
  name?: SortOrder | null | undefined;
  price?: SortOrder | null | undefined;
};

export type SetOrderCustomerInput = {
  customerId: string | number;
  note?: string | null | undefined;
  orderId: string | number;
};

export type SettleRefundInput = {
  id: string | number;
  transactionId: string;
};

export type ShippingMethodTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
};

export type SortOrder =
  | 'ASC'
  | 'DESC';

export type StockLevelInput = {
  stockLocationId: string | number;
  stockOnHand: number;
};

export type StockLocationFilterParameter = {
  _and?: Array<StockLocationFilterParameter> | null | undefined;
  _or?: Array<StockLocationFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  description?: StringOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type StockLocationListOptions = {
  /** Allows the results to be filtered */
  filter?: StockLocationFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: StockLocationSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type StockLocationSortParameter = {
  createdAt?: SortOrder | null | undefined;
  description?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type StockMovementType =
  | 'ADJUSTMENT'
  | 'ALLOCATION'
  | 'CANCELLATION'
  | 'RELEASE'
  | 'RETURN'
  | 'SALE';

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: string | null | undefined;
  eq?: string | null | undefined;
  in?: Array<string> | null | undefined;
  isNull?: boolean | null | undefined;
  notContains?: string | null | undefined;
  notEq?: string | null | undefined;
  notIn?: Array<string> | null | undefined;
  regex?: string | null | undefined;
};

export type SurchargeInput = {
  description: string;
  price: number;
  priceIncludesTax: boolean;
  sku?: string | null | undefined;
  taxDescription?: string | null | undefined;
  taxRate?: number | null | undefined;
};

export type TagFilterParameter = {
  _and?: Array<TagFilterParameter> | null | undefined;
  _or?: Array<TagFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  value?: StringOperators | null | undefined;
};

export type TagListOptions = {
  /** Allows the results to be filtered */
  filter?: TagFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: TagSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type TagSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  value?: SortOrder | null | undefined;
};

export type TaxRateFilterParameter = {
  _and?: Array<TaxRateFilterParameter> | null | undefined;
  _or?: Array<TaxRateFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  enabled?: BooleanOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
  value?: NumberOperators | null | undefined;
};

export type TaxRateListOptions = {
  /** Allows the results to be filtered */
  filter?: TaxRateFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: TaxRateSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type TaxRateSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
  value?: SortOrder | null | undefined;
};

export type TestEligibleShippingMethodsInput = {
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodOrderLineInput = {
  productVariantId: string | number;
  quantity: number;
};

export type UpdateActiveAdministratorInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
};

/**
 * Input used to update an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Deenruv server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type UpdateAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode?: string | null | undefined;
  customFields?: unknown;
  defaultBillingAddress?: boolean | null | undefined;
  defaultShippingAddress?: boolean | null | undefined;
  fullName?: string | null | undefined;
  id: string | number;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1?: string | null | undefined;
  streetLine2?: string | null | undefined;
};

export type UpdateAdministratorInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  id: string | number;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
  roleIds?: Array<string | number> | null | undefined;
};

export type UpdateAssetInput = {
  customFields?: unknown;
  focalPoint?: CoordinateInput | null | undefined;
  id: string | number;
  name?: string | null | undefined;
  tags?: Array<string> | null | undefined;
};

export type UpdateChannelInput = {
  availableCurrencyCodes?: Array<CurrencyCode> | null | undefined;
  availableLanguageCodes?: Array<LanguageCode> | null | undefined;
  code?: string | null | undefined;
  /** @deprecated Use defaultCurrencyCode instead */
  currencyCode?: CurrencyCode | null | undefined;
  customFields?: unknown;
  defaultCurrencyCode?: CurrencyCode | null | undefined;
  defaultLanguageCode?: LanguageCode | null | undefined;
  defaultShippingZoneId?: string | number | null | undefined;
  defaultTaxZoneId?: string | number | null | undefined;
  id: string | number;
  outOfStockThreshold?: number | null | undefined;
  pricesIncludeTax?: boolean | null | undefined;
  sellerId?: string | number | null | undefined;
  token?: string | null | undefined;
  trackInventory?: boolean | null | undefined;
};

export type UpdateCollectionInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  featuredAssetId?: string | number | null | undefined;
  filters?: Array<ConfigurableOperationInput> | null | undefined;
  id: string | number;
  inheritFilters?: boolean | null | undefined;
  isPrivate?: boolean | null | undefined;
  parentId?: string | number | null | undefined;
  translations?: Array<UpdateCollectionTranslationInput> | null | undefined;
};

export type UpdateCollectionTranslationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id?: string | number | null | undefined;
  languageCode: LanguageCode;
  name?: string | null | undefined;
  slug?: string | null | undefined;
};

export type UpdateCountryInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  id: string | number;
  translations?: Array<CountryTranslationInput> | null | undefined;
};

export type UpdateCustomerGroupInput = {
  customFields?: unknown;
  id: string | number;
  name?: string | null | undefined;
};

export type UpdateCustomerInput = {
  customFields?: unknown;
  emailAddress?: string | null | undefined;
  firstName?: string | null | undefined;
  id: string | number;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type UpdateCustomerNoteInput = {
  note: string;
  noteId: string | number;
};

export type UpdateFacetInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string | number;
  isPrivate?: boolean | null | undefined;
  translations?: Array<FacetTranslationInput> | null | undefined;
};

export type UpdateFacetValueInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string | number;
  translations?: Array<FacetValueTranslationInput> | null | undefined;
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: Array<LanguageCode> | null | undefined;
  customFields?: unknown;
  outOfStockThreshold?: number | null | undefined;
  trackInventory?: boolean | null | undefined;
};

export type UpdateOrderAddressInput = {
  city?: string | null | undefined;
  company?: string | null | undefined;
  countryCode?: string | null | undefined;
  fullName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  postalCode?: string | null | undefined;
  province?: string | null | undefined;
  streetLine1?: string | null | undefined;
  streetLine2?: string | null | undefined;
};

export type UpdateOrderCustomFieldsInput = {
  pickupPointId?: string | null | undefined;
};

export type UpdateOrderInput = {
  customFields?: UpdateOrderCustomFieldsInput | null | undefined;
  id: string | number;
};

export type UpdateOrderNoteInput = {
  isPublic?: boolean | null | undefined;
  note?: string | null | undefined;
  noteId: string | number;
};

export type UpdatePaymentMethodInput = {
  checker?: ConfigurableOperationInput | null | undefined;
  code?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  handler?: ConfigurableOperationInput | null | undefined;
  id: string | number;
  translations?: Array<PaymentMethodTranslationInput> | null | undefined;
};

export type UpdateProductInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string | number> | null | undefined;
  featuredAssetId?: string | number | null | undefined;
  id: string | number;
  translations?: Array<ProductTranslationInput> | null | undefined;
};

export type UpdateProductOptionGroupInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string | number;
  translations?: Array<ProductOptionGroupTranslationInput> | null | undefined;
};

export type UpdateProductOptionInput = {
  code?: string | null | undefined;
  customFields?: unknown;
  id: string | number;
  translations?: Array<ProductOptionGroupTranslationInput> | null | undefined;
};

export type UpdateProductVariantInput = {
  assetIds?: Array<string | number> | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  facetValueIds?: Array<string | number> | null | undefined;
  featuredAssetId?: string | number | null | undefined;
  id: string | number;
  optionIds?: Array<string | number> | null | undefined;
  outOfStockThreshold?: number | null | undefined;
  /** Sets the price for the ProductVariant in the Channel's default currency */
  price?: number | null | undefined;
  /** Allows multiple prices to be set for the ProductVariant in different currencies. */
  prices?: Array<ProductVariantPriceInput> | null | undefined;
  sku?: string | null | undefined;
  stockLevels?: Array<StockLevelInput> | null | undefined;
  stockOnHand?: number | null | undefined;
  taxCategoryId?: string | number | null | undefined;
  trackInventory?: GlobalFlag | null | undefined;
  translations?: Array<ProductVariantTranslationInput> | null | undefined;
  useGlobalOutOfStockThreshold?: boolean | null | undefined;
};

export type UpdatePromotionInput = {
  actions?: Array<ConfigurableOperationInput> | null | undefined;
  conditions?: Array<ConfigurableOperationInput> | null | undefined;
  couponCode?: string | null | undefined;
  customFields?: unknown;
  enabled?: boolean | null | undefined;
  endsAt?: unknown;
  id: string | number;
  perCustomerUsageLimit?: number | null | undefined;
  startsAt?: unknown;
  translations?: Array<PromotionTranslationInput> | null | undefined;
  usageLimit?: number | null | undefined;
};

export type UpdateRoleInput = {
  channelIds?: Array<string | number> | null | undefined;
  code?: string | null | undefined;
  description?: string | null | undefined;
  id: string | number;
  permissions?: Array<Permission> | null | undefined;
};

export type UpdateShippingMethodInput = {
  calculator?: ConfigurableOperationInput | null | undefined;
  checker?: ConfigurableOperationInput | null | undefined;
  code?: string | null | undefined;
  customFields?: unknown;
  fulfillmentHandler?: string | null | undefined;
  id: string | number;
  translations: Array<ShippingMethodTranslationInput>;
};

export type UpdateStockLocationInput = {
  customFields?: unknown;
  description?: string | null | undefined;
  id: string | number;
  name?: string | null | undefined;
};

export type UpdateTagInput = {
  id: string | number;
  value?: string | null | undefined;
};

export type UpdateTaxCategoryInput = {
  customFields?: unknown;
  id: string | number;
  isDefault?: boolean | null | undefined;
  name?: string | null | undefined;
};

export type UpdateTaxRateInput = {
  categoryId?: string | number | null | undefined;
  customFields?: unknown;
  customerGroupId?: string | number | null | undefined;
  enabled?: boolean | null | undefined;
  id: string | number;
  name?: string | null | undefined;
  value?: number | null | undefined;
  zoneId?: string | number | null | undefined;
};

export type UpdateZoneInput = {
  customFields?: unknown;
  id: string | number;
  name?: string | null | undefined;
};

export type ZoneFilterParameter = {
  _and?: Array<ZoneFilterParameter> | null | undefined;
  _or?: Array<ZoneFilterParameter> | null | undefined;
  createdAt?: DateOperators | null | undefined;
  id?: IdOperators | null | undefined;
  name?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
};

export type ZoneListOptions = {
  /** Allows the results to be filtered */
  filter?: ZoneFilterParameter | null | undefined;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: LogicalOperator | null | undefined;
  /** Skips the first n results, for use in pagination */
  skip?: number | null | undefined;
  /** Specifies which properties to sort the results by */
  sort?: ZoneSortParameter | null | undefined;
  /** Takes n results, for use in pagination */
  take?: number | null | undefined;
};

export type ZoneSortParameter = {
  createdAt?: SortOrder | null | undefined;
  id?: SortOrder | null | undefined;
  name?: SortOrder | null | undefined;
  updatedAt?: SortOrder | null | undefined;
};

export type GetAdministratorsQueryVariables = Exact<{
  options?: AdministratorListOptions | null | undefined;
}>;


export type GetAdministratorsQuery = { administrators: { totalItems: number, items: Array<{ id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } }> } };

export type GetAdministratorQueryVariables = Exact<{
  id: string | number;
}>;


export type GetAdministratorQuery = { administrator: { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } } | null };

export type ActiveAdministratorQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveAdministratorQuery = { activeAdministrator: { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } } | null };

export type UpdateActiveAdministratorMutationVariables = Exact<{
  input: UpdateActiveAdministratorInput;
}>;


export type UpdateActiveAdministratorMutation = { updateActiveAdministrator: { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } } };

export type DeleteAdministratorMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteAdministratorMutation = { deleteAdministrator: { message: string | null, result: DeletionResult } };

export type Q1QueryVariables = Exact<{ [key: string]: never; }>;


export type Q1Query = { product: { id: string, name: string } | null };

export type Q2QueryVariables = Exact<{ [key: string]: never; }>;


export type Q2Query = { product: { id: string, name: string } | null };

export type GetCollectionWithAssetsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCollectionWithAssetsQuery = { collection: { id: string, name: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }> } | null };

export type AssignAssetsToChannelMutationVariables = Exact<{
  input: AssignAssetsToChannelInput;
}>;


export type AssignAssetsToChannelMutation = { assignAssetsToChannel: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }> };

export type CanCreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type CanCreateCustomerMutation = { createCustomer:
    | { id: string }
    | Record<PropertyKey, never>
   };

export type GetCustomerCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerCountQuery = { customers: { totalItems: number } };

export type DeepFieldResolutionTestQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type DeepFieldResolutionTestQueryQuery = { product: { variants: Array<{ taxRateApplied: { customerGroup: { customers: { items: Array<{ id: string, emailAddress: string }> } } | null } }> } | null };

export type AuthenticateMutationVariables = Exact<{
  input: AuthenticationInput;
}>;


export type AuthenticateMutation = { authenticate:
    | { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> }
    | { authenticationError: string, errorCode: ErrorCode, message: string }
   };

export type GetCustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomersQuery = { customers: { totalItems: number, items: Array<{ id: string, emailAddress: string }> } };

export type GetCustomerUserAuthQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCustomerUserAuthQuery = { customer: { id: string, user: { id: string, verified: boolean, authenticationMethods: Array<{ id: string, strategy: string }> } | null } | null };

export type DeleteChannelMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteChannelMutation = { deleteChannel: { message: string | null, result: DeletionResult } };

export type GetChannelQueryVariables = Exact<{
  id: string | number;
}>;


export type GetChannelQuery = { channel: { id: string, code: string, token: string, defaultCurrencyCode: CurrencyCode, availableCurrencyCodes: Array<CurrencyCode>, defaultLanguageCode: LanguageCode, availableLanguageCodes: Array<LanguageCode> | null, outOfStockThreshold: number | null, pricesIncludeTax: boolean } | null };

export type UpdateGlobalLanguagesMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalLanguagesMutation = { updateGlobalSettings:
    | { id: string, availableLanguages: Array<LanguageCode> }
    | Record<PropertyKey, never>
   };

export type GetCollectionsWithAssetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsWithAssetsQuery = { collections: { items: Array<{ assets: Array<{ name: string }> }> } };

export type GetProductsWithVariantIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsWithVariantIdsQuery = { products: { items: Array<{ id: string, name: string, variants: Array<{ id: string, name: string }> }> } };

export type GetCollectionListAdminQueryVariables = Exact<{
  options?: CollectionListOptions | null | undefined;
}>;


export type GetCollectionListAdminQuery = { collections: { totalItems: number, items: Array<{ id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null }> } };

export type MoveCollectionMutationVariables = Exact<{
  input: MoveCollectionInput;
}>;


export type MoveCollectionMutation = { moveCollection: { id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null } };

export type GetFacetValuesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFacetValuesQuery = { facets: { items: Array<{ values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> }> } };

export type GetCollectionProductsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCollectionProductsQuery = { collection: { productVariants: { items: Array<{ id: string, name: string, productId: string, facetValues: Array<{ code: string }> }> } } | null };

export type CreateCollectionSelectVariantsMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionSelectVariantsMutation = { createCollection: { id: string, productVariants: { totalItems: number, items: Array<{ name: string }> } } };

export type GetCollectionBreadcrumbsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCollectionBreadcrumbsQuery = { collection: { breadcrumbs: Array<{ id: string, name: string, slug: string }> } | null };

export type GetCollectionsForProductsQueryVariables = Exact<{
  term: string;
}>;


export type GetCollectionsForProductsQuery = { products: { items: Array<{ id: string, name: string, collections: Array<{ id: string, name: string }> }> } };

export type DeleteCollectionMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCollectionMutation = { deleteCollection: { result: DeletionResult, message: string | null } };

export type GetProductCollectionsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductCollectionsQuery = { product: { id: string, collections: Array<{ id: string, name: string }> } | null };

export type GetProductCollectionsWithParentQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductCollectionsWithParentQuery = { product: { id: string, collections: Array<{ id: string, name: string, parent: { id: string, name: string } | null }> } | null };

export type GetCollectionNestedParentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionNestedParentsQuery = { collections: { items: Array<{ id: string, name: string, parent: { name: string, parent: { name: string, parent: { name: string } | null } | null } | null }> } };

export type PreviewCollectionVariantsQueryVariables = Exact<{
  input: PreviewCollectionVariantsInput;
  options?: ProductVariantListOptions | null | undefined;
}>;


export type PreviewCollectionVariantsQuery = { previewCollectionVariants: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type RemoveCollectionsFromChannelMutationVariables = Exact<{
  input: RemoveCollectionsFromChannelInput;
}>;


export type RemoveCollectionsFromChannelMutation = { removeCollectionsFromChannel: Array<{ id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null }> };

export type DeleteCollectionsBulkMutationVariables = Exact<{
  ids: Array<string | number> | string | number;
}>;


export type DeleteCollectionsBulkMutation = { deleteCollections: Array<{ message: string | null, result: DeletionResult }> };

export type GetCheckersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCheckersQuery = { shippingEligibilityCheckers: Array<{ code: string, args: Array<{ defaultValue: unknown, description: string | null, label: string | null, list: boolean, name: string, required: boolean, type: string }> }> };

export type DeleteCountryMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCountryMutation = { deleteCountry: { result: DeletionResult, message: string | null } };

export type GetCountryQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCountryQuery = { country: { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateCountryMutationVariables = Exact<{
  input: CreateCountryInput;
}>;


export type CreateCountryMutation = { createCountry: { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteCustomerAddressMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCustomerAddressMutation = { deleteCustomerAddress: { success: boolean } };

export type GetCustomerWithUserQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCustomerWithUserQuery = { customer: { id: string, user: { id: string, identifier: string, verified: boolean } | null } | null };

export type GetCustomerOrdersQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCustomerOrdersQuery = { customer: { orders: { totalItems: number, items: Array<{ id: string }> } } | null };

export type AddNoteToCustomerMutationVariables = Exact<{
  input: AddNoteToCustomerInput;
}>;


export type AddNoteToCustomerMutation = { addNoteToCustomer: { id: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, user: { id: string, identifier: string, verified: boolean, lastLogin: unknown } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null } };

export type ReindexMutationVariables = Exact<{ [key: string]: never; }>;


export type ReindexMutation = { reindex: { id: string } };

export type SearchFacetValuesQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchFacetValuesQuery = { search: { totalItems: number, facetValues: Array<{ count: number, facetValue: { id: string, name: string } }> } };

export type SearchCollectionsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchCollectionsQuery = { search: { totalItems: number, collections: Array<{ count: number, collection: { id: string, name: string } }> } };

export type SearchGetAssetsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchGetAssetsQuery = { search: { totalItems: number, items: Array<{ productId: string, productVariantId: string, productName: string, productVariantName: string, productAsset: { id: string, preview: string, focalPoint: { x: number, y: number } | null } | null, productVariantAsset: { id: string, preview: string, focalPoint: { x: number, y: number } | null } | null }> } };

export type SearchGetPricesQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchGetPricesQuery = { search: { items: Array<{ price:
        | { min: number, max: number }
        | { value: number }
      , priceWithTax:
        | { min: number, max: number }
        | { value: number }
       }> } };

export type SearchProductsWithScoreQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsWithScoreQuery = { search: { items: Array<{ productId: string, productVariantId: string, score: number }> } };

export type CreateDraftOrderMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateDraftOrderMutation = { createDraftOrder: { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } };

export type AddItemToDraftOrderMutationVariables = Exact<{
  orderId: string | number;
  input: AddItemToDraftOrderInput;
}>;


export type AddItemToDraftOrderMutation = { addItemToDraftOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type AdjustDraftOrderLineMutationVariables = Exact<{
  orderId: string | number;
  input: AdjustDraftOrderLineInput;
}>;


export type AdjustDraftOrderLineMutation = { adjustDraftOrderLine:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type RemoveDraftOrderLineMutationVariables = Exact<{
  orderId: string | number;
  orderLineId: string | number;
}>;


export type RemoveDraftOrderLineMutation = { removeDraftOrderLine:
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type SetCustomerForDraftOrderMutationVariables = Exact<{
  orderId: string | number;
  customerId?: string | number | null | undefined;
  input?: CreateCustomerInput | null | undefined;
}>;


export type SetCustomerForDraftOrderMutation = { setCustomerForDraftOrder:
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
   };

export type SetDraftOrderShippingAddressMutationVariables = Exact<{
  orderId: string | number;
  input: CreateAddressInput;
}>;


export type SetDraftOrderShippingAddressMutation = { setDraftOrderShippingAddress: { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } };

export type SetDraftOrderBillingAddressMutationVariables = Exact<{
  orderId: string | number;
  input: CreateAddressInput;
}>;


export type SetDraftOrderBillingAddressMutation = { setDraftOrderBillingAddress: { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, billingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } };

export type ApplyCouponCodeToDraftOrderMutationVariables = Exact<{
  orderId: string | number;
  couponCode: string;
}>;


export type ApplyCouponCodeToDraftOrderMutation = { applyCouponCodeToDraftOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { couponCodes: Array<string>, id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
    | { errorCode: ErrorCode, message: string }
   };

export type RemoveCouponCodeFromDraftOrderMutationVariables = Exact<{
  orderId: string | number;
  couponCode: string;
}>;


export type RemoveCouponCodeFromDraftOrderMutation = { removeCouponCodeFromDraftOrder: { couponCodes: Array<string>, id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } | null };

export type DraftOrderEligibleShippingMethodsQueryVariables = Exact<{
  orderId: string | number;
}>;


export type DraftOrderEligibleShippingMethodsQuery = { eligibleShippingMethodsForDraftOrder: Array<{ id: string, name: string, code: string, description: string, price: number, priceWithTax: number, metadata: unknown }> };

export type SetDraftOrderShippingMethodMutationVariables = Exact<{
  orderId: string | number;
  shippingMethodId: string | number;
}>;


export type SetDraftOrderShippingMethodMutation = { setDraftOrderShippingMethod:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
    | { errorCode: ErrorCode, message: string }
   };

export type GetOrderPlacedAtQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderPlacedAtQuery = { order: { id: string, createdAt: unknown, updatedAt: unknown, state: string, orderPlacedAt: unknown } | null };

export type GetEntityDuplicatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntityDuplicatorsQuery = { entityDuplicators: Array<{ code: string, description: string, requiresPermission: Array<Permission>, forEntities: Array<string>, args: Array<{ name: string, type: string, defaultValue: unknown }> }> };

export type DuplicateEntityMutationVariables = Exact<{
  input: DuplicateEntityInput;
}>;


export type DuplicateEntityMutation = { duplicateEntity:
    | { message: string, duplicationError: string }
    | { newEntityId: string }
   };

export type IdTest1QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest1Query = { products: { items: Array<{ id: string }> } };

export type IdTest2QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest2Query = { products: { items: Array<{ id: string, variants: Array<{ id: string, options: Array<{ id: string, name: string }> }> }> } };

export type IdTest3QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest3Query = { product: { id: string } | null };

export type IdTest4MutationVariables = Exact<{ [key: string]: never; }>;


export type IdTest4Mutation = { updateProduct: { id: string, featuredAsset: { id: string } | null } };

export type IdTest5MutationVariables = Exact<{ [key: string]: never; }>;


export type IdTest5Mutation = { updateProduct: { id: string, name: string } };

export type IdTest6QueryVariables = Exact<{
  id: string | number;
}>;


export type IdTest6Query = { product: { id: string } | null };

export type IdTest7MutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type IdTest7Mutation = { updateProduct: { id: string, featuredAsset: { id: string } | null } };

export type IdTest8MutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type IdTest8Mutation = { updateProduct: { id: string, name: string } };

export type IdTest9QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest9Query = { products: { items: Array<{ id: string, featuredAsset: { id: string } | null }> } };

export type ProdFragmentFragment = { id: string, featuredAsset: { id: string } | null };

export type IdTest10QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest10Query = { products: { items: Array<{ id: string, featuredAsset: { id: string } | null }> } };

export type ProdFragment1Fragment = { id: string, featuredAsset: { id: string } | null };

export type ProdFragment2Fragment = { id: string, featuredAsset: { id: string } | null };

export type IdTest11QueryVariables = Exact<{ [key: string]: never; }>;


export type IdTest11Query = { products: { items: Array<{ id: string, featuredAsset: { id: string } | null }> } };

export type ProdFragment1_1Fragment = { id: string, featuredAsset: { id: string } | null };

export type ProdFragment2_1Fragment = { id: string, featuredAsset: { id: string } | null };

export type ProdFragment3_1Fragment = { id: string, featuredAsset: { id: string } | null };

export type GetFacetWithValueListQueryVariables = Exact<{
  id: string | number;
  options?: FacetValueListOptions | null | undefined;
}>;


export type GetFacetWithValueListQuery = { facet: { id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, valueList: { totalItems: number, items: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> } } | null };

export type DeleteFacetValuesMutationVariables = Exact<{
  ids: Array<string | number> | string | number;
  force?: boolean | null | undefined;
}>;


export type DeleteFacetValuesMutation = { deleteFacetValues: Array<{ result: DeletionResult, message: string | null }> };

export type DeleteFacetMutationVariables = Exact<{
  id: string | number;
  force?: boolean | null | undefined;
}>;


export type DeleteFacetMutation = { deleteFacet: { result: DeletionResult, message: string | null } };

export type GetProductWithFacetValuesQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductWithFacetValuesQuery = { product: { id: string, facetValues: Array<{ id: string, name: string, code: string }>, variants: Array<{ id: string, facetValues: Array<{ id: string, name: string, code: string }> }> } | null };

export type GetProductListWithVariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductListWithVariantsQuery = { products: { totalItems: number, items: Array<{ id: string, name: string, variants: Array<{ id: string, name: string }> }> } };

export type CreateFacetValuesMutationVariables = Exact<{
  input: Array<CreateFacetValueInput> | CreateFacetValueInput;
}>;


export type CreateFacetValuesMutation = { createFacetValues: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> };

export type UpdateFacetValuesMutationVariables = Exact<{
  input: Array<UpdateFacetValueInput> | UpdateFacetValueInput;
}>;


export type UpdateFacetValuesMutation = { updateFacetValues: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> };

export type AssignFacetsToChannelMutationVariables = Exact<{
  input: AssignFacetsToChannelInput;
}>;


export type AssignFacetsToChannelMutation = { assignFacetsToChannel: Array<{ id: string, name: string }> };

export type RemoveFacetsFromChannelMutationVariables = Exact<{
  input: RemoveFacetsFromChannelInput;
}>;


export type RemoveFacetsFromChannelMutation = { removeFacetsFromChannel: Array<
    | { id: string, name: string }
    | { errorCode: ErrorCode, message: string, productCount: number, variantCount: number }
  > };

export type GetGlobalSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalSettingsQuery = { globalSettings: { id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { permittedAssetTypes: Array<string>, orderProcess: Array<{ name: string, to: Array<string> }>, permissions: Array<{ name: string, description: string, assignable: boolean }>, customFieldConfig: { Customer: Array<
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
          | { name: string }
        > } } } };

export type SearchProductsAdminQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsAdminQuery = { search: { totalItems: number, items: Array<{ enabled: boolean, productId: string, productName: string, slug: string, description: string, productVariantId: string, productVariantName: string, sku: string }> } };

export type GetOrderWithSellerOrdersQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderWithSellerOrdersQuery = { order: { id: string, code: string, state: string, sellerOrders: Array<{ id: string, aggregateOrderId: string | null, lines: Array<{ id: string, productVariant: { id: string, name: string } }>, shippingLines: Array<{ id: string, shippingMethod: { id: string, code: string } }> }> | null, lines: Array<{ id: string, productVariant: { id: string, name: string } }>, shippingLines: Array<{ id: string, shippingMethod: { id: string, code: string } }> } | null };

export type AdministratorFragment = { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } };

export type AssetFragment = { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string };

export type ProductVariantFragment = { id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> };

export type ProductWithVariantsFragment = { id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> };

export type RoleFragment = { id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string, token: string }> };

export type ConfigurableOperationFragment = { code: string, args: Array<{ name: string, value: string }> };

export type CollectionFragment = { id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null };

export type FacetValueFragment = { id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } };

export type FacetWithValuesFragment = { id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> };

type Country_Country_Fragment = { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> };

type Country_Province_Fragment = { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> };

export type CountryFragment =
  | Country_Country_Fragment
  | Country_Province_Fragment
;

export type AddressFragment = { id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } };

export type CustomerFragment = { id: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, user: { id: string, identifier: string, verified: boolean, lastLogin: unknown } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null };

export type AdjustmentFragment = { adjustmentSource: string, amount: number, description: string, type: AdjustmentType };

export type ShippingAddressFragment = { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null };

export type OrderFragment = { id: string, createdAt: unknown, updatedAt: unknown, code: string, active: boolean, state: string, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string } | null };

export type PaymentFragment = { id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> };

export type OrderWithLinesFragment = { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null };

export type PromotionFragment = { id: string, createdAt: unknown, updatedAt: unknown, couponCode: string | null, startsAt: unknown, endsAt: unknown, name: string, description: string, enabled: boolean, perCustomerUsageLimit: number | null, usageLimit: number | null, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> };

export type ZoneFragment = { id: string, name: string, members: Array<
    | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
  > };

export type TaxRateFragment = { id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null };

export type CurrentUserFragment = { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> };

export type VariantWithStockFragment = { id: string, stockOnHand: number, stockAllocated: number, stockMovements: { totalItems: number, items: Array<
      | { id: string, type: StockMovementType, quantity: number }
      | { id: string, type: StockMovementType, quantity: number }
      | { id: string, type: StockMovementType, quantity: number }
      | { id: string, type: StockMovementType, quantity: number }
      | { id: string, type: StockMovementType, quantity: number }
      | { id: string, type: StockMovementType, quantity: number }
    > } };

export type FulfillmentFragment = { id: string, state: string, nextStates: Array<string>, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> };

export type ChannelFragment = { id: string, code: string, token: string, currencyCode: CurrencyCode, availableCurrencyCodes: Array<CurrencyCode>, defaultCurrencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, pricesIncludeTax: boolean, defaultShippingZone: { id: string } | null, defaultTaxZone: { id: string } | null };

export type GlobalSettingsFragment = { id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { permittedAssetTypes: Array<string>, orderProcess: Array<{ name: string, to: Array<string> }>, permissions: Array<{ name: string, description: string, assignable: boolean }>, customFieldConfig: { Customer: Array<
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
        | { name: string }
      > } } };

export type CustomerGroupFragment = { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } };

export type ProductOptionGroupFragment = { id: string, code: string, name: string, options: Array<{ id: string, code: string, name: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> };

export type ProductWithOptionsFragment = { id: string, optionGroups: Array<{ id: string, code: string, options: Array<{ id: string, code: string }> }> };

export type ShippingMethodFragment = { id: string, code: string, name: string, description: string, calculator: { code: string, args: Array<{ name: string, value: string }> }, checker: { code: string, args: Array<{ name: string, value: string }> } };

export type CreateAdministratorMutationVariables = Exact<{
  input: CreateAdministratorInput;
}>;


export type CreateAdministratorMutation = { createAdministrator: { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } } };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: { id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> } };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: { id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> } };

export type GetProductWithVariantsQueryVariables = Exact<{
  id?: string | number | null | undefined;
  slug?: string | null | undefined;
}>;


export type GetProductWithVariantsQuery = { product: { id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> } | null };

export type GetProductListQueryVariables = Exact<{
  options?: ProductListOptions | null | undefined;
}>;


export type GetProductListQuery = { products: { totalItems: number, items: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, featuredAsset: { id: string, preview: string } | null }> } };

export type CreateProductVariantsMutationVariables = Exact<{
  input: Array<CreateProductVariantInput> | CreateProductVariantInput;
}>;


export type CreateProductVariantsMutation = { createProductVariants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> } | null> };

export type UpdateProductVariantsMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput> | UpdateProductVariantInput;
}>;


export type UpdateProductVariantsMutation = { updateProductVariants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> } | null> };

export type UpdateTaxRateMutationVariables = Exact<{
  input: UpdateTaxRateInput;
}>;


export type UpdateTaxRateMutation = { updateTaxRate: { id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null } };

export type CreateFacetMutationVariables = Exact<{
  input: CreateFacetInput;
}>;


export type CreateFacetMutation = { createFacet: { id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> } };

export type UpdateFacetMutationVariables = Exact<{
  input: UpdateFacetInput;
}>;


export type UpdateFacetMutation = { updateFacet: { id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> } };

export type GetCustomerListQueryVariables = Exact<{
  options?: CustomerListOptions | null | undefined;
}>;


export type GetCustomerListQuery = { customers: { totalItems: number, items: Array<{ id: string, title: string | null, firstName: string, lastName: string, emailAddress: string, phoneNumber: string | null, user: { id: string, identifier: string, verified: boolean } | null }> } };

export type GetAssetListQueryVariables = Exact<{
  options?: AssetListOptions | null | undefined;
}>;


export type GetAssetListQuery = { assets: { totalItems: number, items: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }> } };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: { id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string, token: string }> } };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { createCollection: { id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null } };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { updateCollection: { id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null } };

export type GetCustomerQueryVariables = Exact<{
  id: string | number;
  orderListOptions?: OrderListOptions | null | undefined;
}>;


export type GetCustomerQuery = { customer: { id: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, orders: { totalItems: number, items: Array<{ id: string, code: string, state: string, total: number, currencyCode: CurrencyCode, updatedAt: unknown }> }, user: { id: string, identifier: string, verified: boolean, lastLogin: unknown } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null } | null };

export type AttemptLoginMutationVariables = Exact<{
  username: string;
  password: string;
  rememberMe?: boolean | null | undefined;
}>;


export type AttemptLoginMutation = { login:
    | { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type GetCountryListQueryVariables = Exact<{
  options?: CountryListOptions | null | undefined;
}>;


export type GetCountryListQuery = { countries: { totalItems: number, items: Array<{ id: string, code: string, name: string, enabled: boolean }> } };

export type UpdateCountryMutationVariables = Exact<{
  input: UpdateCountryInput;
}>;


export type UpdateCountryMutation = { updateCountry: { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type GetFacetListQueryVariables = Exact<{
  options?: FacetListOptions | null | undefined;
}>;


export type GetFacetListQuery = { facets: { totalItems: number, items: Array<{ id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> }> } };

export type GetFacetListSimpleQueryVariables = Exact<{
  options?: FacetListOptions | null | undefined;
}>;


export type GetFacetListSimpleQuery = { facets: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type DeleteProductMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteProductMutation = { deleteProduct: { result: DeletionResult } };

export type GetProductSimpleQueryVariables = Exact<{
  id?: string | number | null | undefined;
  slug?: string | null | undefined;
}>;


export type GetProductSimpleQuery = { product: { id: string, slug: string } | null };

export type GetStockMovementQueryVariables = Exact<{
  id: string | number;
}>;


export type GetStockMovementQuery = { product: { id: string, variants: Array<{ id: string, stockOnHand: number, stockAllocated: number, stockMovements: { totalItems: number, items: Array<
          | { id: string, type: StockMovementType, quantity: number }
          | { id: string, type: StockMovementType, quantity: number }
          | { id: string, type: StockMovementType, quantity: number }
          | { id: string, type: StockMovementType, quantity: number }
          | { id: string, type: StockMovementType, quantity: number }
          | { id: string, type: StockMovementType, quantity: number }
        > } }> } | null };

export type GetRunningJobsQueryVariables = Exact<{
  options?: JobListOptions | null | undefined;
}>;


export type GetRunningJobsQuery = { jobs: { totalItems: number, items: Array<{ id: string, queueName: string, state: JobState, isSettled: boolean, duration: number }> } };

export type CreatePromotionMutationVariables = Exact<{
  input: CreatePromotionInput;
}>;


export type CreatePromotionMutation = { createPromotion:
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, couponCode: string | null, startsAt: unknown, endsAt: unknown, name: string, description: string, enabled: boolean, perCustomerUsageLimit: number | null, usageLimit: number | null, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> }
   };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> } | null };

export type CreateChannelMutationVariables = Exact<{
  input: CreateChannelInput;
}>;


export type CreateChannelMutation = { createChannel:
    | { id: string, code: string, token: string, currencyCode: CurrencyCode, availableCurrencyCodes: Array<CurrencyCode>, defaultCurrencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, pricesIncludeTax: boolean, defaultShippingZone: { id: string } | null, defaultTaxZone: { id: string } | null }
    | { errorCode: ErrorCode, message: string, languageCode: string }
   };

export type DeleteProductVariantMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteProductVariantMutation = { deleteProductVariant: { result: DeletionResult, message: string | null } };

export type AssignProductsToChannelMutationVariables = Exact<{
  input: AssignProductsToChannelInput;
}>;


export type AssignProductsToChannelMutation = { assignProductsToChannel: Array<{ id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> }> };

export type RemoveProductsFromChannelMutationVariables = Exact<{
  input: RemoveProductsFromChannelInput;
}>;


export type RemoveProductsFromChannelMutation = { removeProductsFromChannel: Array<{ id: string, enabled: boolean, languageCode: LanguageCode, name: string, slug: string, description: string, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ languageCode: LanguageCode, name: string, slug: string, description: string }>, optionGroups: Array<{ id: string, languageCode: LanguageCode, code: string, name: string }>, variants: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, channels: Array<{ id: string, code: string }> }> };

export type AssignProductVariantsToChannelMutationVariables = Exact<{
  input: AssignProductVariantsToChannelInput;
}>;


export type AssignProductVariantsToChannelMutation = { assignProductVariantsToChannel: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }> };

export type RemoveProductVariantsFromChannelMutationVariables = Exact<{
  input: RemoveProductVariantsFromChannelInput;
}>;


export type RemoveProductVariantsFromChannelMutation = { removeProductVariantsFromChannel: Array<string> };

export type UpdateAssetMutationVariables = Exact<{
  input: UpdateAssetInput;
}>;


export type UpdateAssetMutation = { updateAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, tags: Array<{ id: string, value: string }>, focalPoint: { x: number, y: number } | null } };

export type DeleteAssetMutationVariables = Exact<{
  input: DeleteAssetInput;
}>;


export type DeleteAssetMutation = { deleteAsset: { result: DeletionResult, message: string | null } };

export type UpdateChannelMutationVariables = Exact<{
  input: UpdateChannelInput;
}>;


export type UpdateChannelMutation = { updateChannel:
    | { id: string, code: string, token: string, currencyCode: CurrencyCode, availableCurrencyCodes: Array<CurrencyCode>, defaultCurrencyCode: CurrencyCode, defaultLanguageCode: LanguageCode, pricesIncludeTax: boolean, defaultShippingZone: { id: string } | null, defaultTaxZone: { id: string } | null }
    | { errorCode: ErrorCode, message: string, languageCode: string }
   };

export type GetCustomerHistoryQueryVariables = Exact<{
  id: string | number;
  options?: HistoryEntryListOptions | null | undefined;
}>;


export type GetCustomerHistoryQuery = { customer: { id: string, history: { totalItems: number, items: Array<{ id: string, type: HistoryEntryType, data: unknown, administrator: { id: string } | null }> } } | null };

export type GetOrderQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderQuery = { order: { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } | null };

export type CreateCustomerGroupMutationVariables = Exact<{
  input: CreateCustomerGroupInput;
}>;


export type CreateCustomerGroupMutation = { createCustomerGroup: { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } } };

export type RemoveCustomersFromGroupMutationVariables = Exact<{
  groupId: string | number;
  customerIds: Array<string | number> | string | number;
}>;


export type RemoveCustomersFromGroupMutation = { removeCustomersFromGroup: { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } } };

export type CreateFulfillmentMutationVariables = Exact<{
  input: FulfillOrderInput;
}>;


export type CreateFulfillmentMutation = { addFulfillmentToOrder:
    | { errorCode: ErrorCode, message: string, fulfillmentHandlerError: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, state: string, nextStates: Array<string>, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type TransitFulfillmentMutationVariables = Exact<{
  id: string | number;
  state: string;
}>;


export type TransitFulfillmentMutation = { transitionFulfillmentToState:
    | { id: string, state: string, nextStates: Array<string>, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }
    | { errorCode: ErrorCode, message: string, transitionError: string, fromState: string, toState: string }
   };

export type GetOrderFulfillmentsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderFulfillmentsQuery = { order: { id: string, state: string, fulfillments: Array<{ id: string, state: string, nextStates: Array<string>, method: string, summary: Array<{ quantity: number, orderLine: { id: string } }> }> | null } | null };

export type GetOrderListQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type GetOrderListQuery = { orders: { totalItems: number, items: Array<{ id: string, createdAt: unknown, updatedAt: unknown, code: string, active: boolean, state: string, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string } | null }> } };

export type CreateAddressMutationVariables = Exact<{
  id: string | number;
  input: CreateAddressInput;
}>;


export type CreateAddressMutation = { createCustomerAddress: { id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { code: string, name: string } } };

export type UpdateAddressMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateAddressMutation = { updateCustomerAddress: { id: string, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { code: string, name: string } } };

export type CreateCustomerMutationVariables = Exact<{
  input: CreateCustomerInput;
  password?: string | null | undefined;
}>;


export type CreateCustomerMutation = { createCustomer:
    | { id: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, user: { id: string, identifier: string, verified: boolean, lastLogin: unknown } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null }
    | { errorCode: ErrorCode, message: string }
   };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer:
    | { id: string, title: string | null, firstName: string, lastName: string, phoneNumber: string | null, emailAddress: string, user: { id: string, identifier: string, verified: boolean, lastLogin: unknown } | null, addresses: Array<{ id: string, fullName: string | null, company: string | null, streetLine1: string, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, phoneNumber: string | null, defaultShippingAddress: boolean | null, defaultBillingAddress: boolean | null, country: { id: string, code: string, name: string } }> | null }
    | { errorCode: ErrorCode, message: string }
   };

export type DeleteCustomerMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCustomerMutation = { deleteCustomer: { result: DeletionResult } };

export type UpdateCustomerNoteMutationVariables = Exact<{
  input: UpdateCustomerNoteInput;
}>;


export type UpdateCustomerNoteMutation = { updateCustomerNote: { id: string, data: unknown, isPublic: boolean } };

export type DeleteCustomerNoteMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCustomerNoteMutation = { deleteCustomerNote: { result: DeletionResult, message: string | null } };

export type UpdateCustomerGroupMutationVariables = Exact<{
  input: UpdateCustomerGroupInput;
}>;


export type UpdateCustomerGroupMutation = { updateCustomerGroup: { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } } };

export type DeleteCustomerGroupMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteCustomerGroupMutation = { deleteCustomerGroup: { result: DeletionResult, message: string | null } };

export type GetCustomerGroupsQueryVariables = Exact<{
  options?: CustomerGroupListOptions | null | undefined;
}>;


export type GetCustomerGroupsQuery = { customerGroups: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type GetCustomerGroupQueryVariables = Exact<{
  id: string | number;
  options?: CustomerListOptions | null | undefined;
}>;


export type GetCustomerGroupQuery = { customerGroup: { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } } | null };

export type AddCustomersToGroupMutationVariables = Exact<{
  groupId: string | number;
  customerIds: Array<string | number> | string | number;
}>;


export type AddCustomersToGroupMutation = { addCustomersToGroup: { id: string, name: string, customers: { totalItems: number, items: Array<{ id: string }> } } };

export type GetCustomerWithGroupsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetCustomerWithGroupsQuery = { customer: { id: string, groups: Array<{ id: string, name: string }> } | null };

export type AdminTransitionMutationVariables = Exact<{
  id: string | number;
  state: string;
}>;


export type AdminTransitionMutation = { transitionOrderToState:
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, active: boolean, state: string, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, customer: { id: string, firstName: string, lastName: string } | null }
    | { errorCode: ErrorCode, message: string, transitionError: string, fromState: string, toState: string }
   | null };

export type CancelOrderMutationVariables = Exact<{
  input: CancelOrderInput;
}>;


export type CancelOrderMutation = { cancelOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, state: string, lines: Array<{ id: string, quantity: number }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type CanceledOrderFragment = { id: string, state: string, lines: Array<{ id: string, quantity: number }> };

export type UpdateGlobalSettingsMutationVariables = Exact<{
  input: UpdateGlobalSettingsInput;
}>;


export type UpdateGlobalSettingsMutation = { updateGlobalSettings:
    | { errorCode: ErrorCode, message: string }
    | { id: string, availableLanguages: Array<LanguageCode>, trackInventory: boolean, outOfStockThreshold: number, serverConfig: { permittedAssetTypes: Array<string>, orderProcess: Array<{ name: string, to: Array<string> }>, permissions: Array<{ name: string, description: string, assignable: boolean }>, customFieldConfig: { Customer: Array<
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
            | { name: string }
          > } } }
   };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: { id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string, token: string }> } };

export type GetProductsWithVariantPricesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsWithVariantPricesQuery = { products: { items: Array<{ id: string, slug: string, variants: Array<{ id: string, price: number, priceWithTax: number, currencyCode: CurrencyCode, sku: string, facetValues: Array<{ id: string, code: string }> }> }> } };

export type CreateProductOptionGroupMutationVariables = Exact<{
  input: CreateProductOptionGroupInput;
}>;


export type CreateProductOptionGroupMutation = { createProductOptionGroup: { id: string, code: string, name: string, options: Array<{ id: string, code: string, name: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type AddOptionGroupToProductMutationVariables = Exact<{
  productId: string | number;
  optionGroupId: string | number;
}>;


export type AddOptionGroupToProductMutation = { addOptionGroupToProduct: { id: string, optionGroups: Array<{ id: string, code: string, options: Array<{ id: string, code: string }> }> } };

export type CreateShippingMethodMutationVariables = Exact<{
  input: CreateShippingMethodInput;
}>;


export type CreateShippingMethodMutation = { createShippingMethod: { id: string, code: string, name: string, description: string, calculator: { code: string, args: Array<{ name: string, value: string }> }, checker: { code: string, args: Array<{ name: string, value: string }> } } };

export type SettlePaymentMutationVariables = Exact<{
  id: string | number;
}>;


export type SettlePaymentMutation = { settlePayment:
    | { errorCode: ErrorCode, message: string }
    | { id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, paymentErrorMessage: string }
   };

export type GetOrderHistoryQueryVariables = Exact<{
  id: string | number;
  options?: HistoryEntryListOptions | null | undefined;
}>;


export type GetOrderHistoryQuery = { order: { id: string, history: { totalItems: number, items: Array<{ id: string, type: HistoryEntryType, data: unknown, administrator: { id: string } | null }> } } | null };

export type UpdateShippingMethodMutationVariables = Exact<{
  input: UpdateShippingMethodInput;
}>;


export type UpdateShippingMethodMutation = { updateShippingMethod: { id: string, code: string, name: string, description: string, calculator: { code: string, args: Array<{ name: string, value: string }> }, checker: { code: string, args: Array<{ name: string, value: string }> } } };

export type GetAssetQueryVariables = Exact<{
  id: string | number;
}>;


export type GetAssetQuery = { asset: { width: number, height: number, id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null };

export type AssetFragFirstFragment = { id: string, preview: string };

export type GetAssetFragmentFirstQueryVariables = Exact<{
  id: string | number;
}>;


export type GetAssetFragmentFirstQuery = { asset: { id: string, preview: string } | null };

export type AssetWithTagsAndFocalPointFragment = { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, focalPoint: { x: number, y: number } | null, tags: Array<{ id: string, value: string }> };

export type CreateAssetsMutationVariables = Exact<{
  input: Array<CreateAssetInput> | CreateAssetInput;
}>;


export type CreateAssetsMutation = { createAssets: Array<
    | { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string, focalPoint: { x: number, y: number } | null, tags: Array<{ id: string, value: string }> }
    | { message: string, fileName: string, mimeType: string }
  > };

export type DeleteShippingMethodMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteShippingMethodMutation = { deleteShippingMethod: { result: DeletionResult, message: string | null } };

export type AssignPromotionToChannelMutationVariables = Exact<{
  input: AssignPromotionsToChannelInput;
}>;


export type AssignPromotionToChannelMutation = { assignPromotionsToChannel: Array<{ id: string, name: string }> };

export type RemovePromotionFromChannelMutationVariables = Exact<{
  input: RemovePromotionsFromChannelInput;
}>;


export type RemovePromotionFromChannelMutation = { removePromotionsFromChannel: Array<{ id: string, name: string }> };

export type GetTaxRatesQueryVariables = Exact<{
  options?: TaxRateListOptions | null | undefined;
}>;


export type GetTaxRatesQuery = { taxRates: { totalItems: number, items: Array<{ id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null }> } };

export type GetShippingMethodListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodListQuery = { shippingMethods: { totalItems: number, items: Array<{ id: string, code: string, name: string, description: string, calculator: { code: string, args: Array<{ name: string, value: string }> }, checker: { code: string, args: Array<{ name: string, value: string }> } }> } };

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { collections: { items: Array<{ id: string, name: string, position: number, parent: { id: string, name: string } | null }> } };

export type TransitionPaymentToStateMutationVariables = Exact<{
  id: string | number;
  state: string;
}>;


export type TransitionPaymentToStateMutation = { transitionPaymentToState:
    | { id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }
    | { errorCode: ErrorCode, message: string, transitionError: string }
   };

export type GetProductVariantListQueryVariables = Exact<{
  options?: ProductVariantListOptions | null | undefined;
  productId?: string | number | null | undefined;
}>;


export type GetProductVariantListQuery = { productVariants: { totalItems: number, items: Array<{ id: string, name: string, sku: string, price: number, priceWithTax: number, currencyCode: CurrencyCode, prices: Array<{ currencyCode: CurrencyCode, price: number }> }> } };

export type DeletePromotionMutationVariables = Exact<{
  id: string | number;
}>;


export type DeletePromotionMutation = { deletePromotion: { result: DeletionResult } };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { channels: { items: Array<{ id: string, code: string, token: string }> } };

export type UpdateAdministratorMutationVariables = Exact<{
  input: UpdateAdministratorInput;
}>;


export type UpdateAdministratorMutation = { updateAdministrator: { id: string, firstName: string, lastName: string, emailAddress: string, user: { id: string, identifier: string, lastLogin: unknown, roles: Array<{ id: string, code: string, description: string, permissions: Array<Permission> }> } } };

export type AssignCollectionsToChannelMutationVariables = Exact<{
  input: AssignCollectionsToChannelInput;
}>;


export type AssignCollectionsToChannelMutation = { assignCollectionsToChannel: Array<{ id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null }> };

export type GetCollectionQueryVariables = Exact<{
  id?: string | number | null | undefined;
  slug?: string | null | undefined;
  variantListOptions?: ProductVariantListOptions | null | undefined;
}>;


export type GetCollectionQuery = { collection: { id: string, name: string, slug: string, description: string, isPrivate: boolean, languageCode: LanguageCode | null, productVariants: { items: Array<{ id: string, name: string, price: number }> }, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, filters: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, slug: string, description: string }>, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string, position: number }> | null } | null };

export type GetFacetWithValuesQueryVariables = Exact<{
  id: string | number;
}>;


export type GetFacetWithValuesQuery = { facet: { id: string, languageCode: LanguageCode, isPrivate: boolean, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, values: Array<{ id: string, languageCode: LanguageCode, code: string, name: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, facet: { id: string, name: string } }> } | null };

export type GetPromotionQueryVariables = Exact<{
  id: string | number;
}>;


export type GetPromotionQuery = { promotion: { id: string, createdAt: unknown, updatedAt: unknown, couponCode: string | null, startsAt: unknown, endsAt: unknown, name: string, description: string, enabled: boolean, perCustomerUsageLimit: number | null, usageLimit: number | null, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type CancelJobMutationVariables = Exact<{
  id: string | number;
}>;


export type CancelJobMutation = { cancelJob: { id: string, state: JobState, isSettled: boolean, settledAt: unknown } };

export type UpdateOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateOptionGroupMutation = { updateProductOptionGroup: { id: string } };

export type GetFulfillmentHandlersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFulfillmentHandlersQuery = { fulfillmentHandlers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, description: string | null, label: string | null, ui: unknown }> }> };

export type OrderWithModificationsFragment = { id: string, state: string, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, lines: Array<{ id: string, quantity: number, orderPlacedQuantity: number, linePrice: number, linePriceWithTax: number, unitPriceWithTax: number, discountedLinePriceWithTax: number, proratedLinePriceWithTax: number, proratedUnitPriceWithTax: number, discounts: Array<{ description: string, amountWithTax: number }>, productVariant: { id: string, name: string } }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number, taxRate: number }>, payments: Array<{ id: string, transactionId: string | null, state: string, amount: number, method: string, metadata: unknown, refunds: Array<{ id: string, state: string, total: number, paymentId: string }> }> | null, modifications: Array<{ id: string, note: string, priceChange: number, isSettled: boolean, lines: Array<{ orderLineId: string, quantity: number }>, surcharges: Array<{ id: string }> | null, payment: { id: string, state: string, amount: number, method: string } | null, refund: { id: string, state: string, total: number, paymentId: string } | null }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, discounts: Array<{ description: string, adjustmentSource: string, amount: number, amountWithTax: number }>, shippingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, billingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, shippingLines: Array<{ id: string, discountedPriceWithTax: number, shippingMethod: { id: string, name: string } }> };

export type GetOrderWithModificationsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderWithModificationsQuery = { order: { id: string, state: string, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, lines: Array<{ id: string, quantity: number, orderPlacedQuantity: number, linePrice: number, linePriceWithTax: number, unitPriceWithTax: number, discountedLinePriceWithTax: number, proratedLinePriceWithTax: number, proratedUnitPriceWithTax: number, discounts: Array<{ description: string, amountWithTax: number }>, productVariant: { id: string, name: string } }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number, taxRate: number }>, payments: Array<{ id: string, transactionId: string | null, state: string, amount: number, method: string, metadata: unknown, refunds: Array<{ id: string, state: string, total: number, paymentId: string }> }> | null, modifications: Array<{ id: string, note: string, priceChange: number, isSettled: boolean, lines: Array<{ orderLineId: string, quantity: number }>, surcharges: Array<{ id: string }> | null, payment: { id: string, state: string, amount: number, method: string } | null, refund: { id: string, state: string, total: number, paymentId: string } | null }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, discounts: Array<{ description: string, adjustmentSource: string, amount: number, amountWithTax: number }>, shippingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, billingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, shippingLines: Array<{ id: string, discountedPriceWithTax: number, shippingMethod: { id: string, name: string } }> } | null };

export type ModifyOrderMutationVariables = Exact<{
  input: ModifyOrderInput;
}>;


export type ModifyOrderMutation = { modifyOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, state: string, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, lines: Array<{ id: string, quantity: number, orderPlacedQuantity: number, linePrice: number, linePriceWithTax: number, unitPriceWithTax: number, discountedLinePriceWithTax: number, proratedLinePriceWithTax: number, proratedUnitPriceWithTax: number, discounts: Array<{ description: string, amountWithTax: number }>, productVariant: { id: string, name: string } }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number, taxRate: number }>, payments: Array<{ id: string, transactionId: string | null, state: string, amount: number, method: string, metadata: unknown, refunds: Array<{ id: string, state: string, total: number, paymentId: string }> }> | null, modifications: Array<{ id: string, note: string, priceChange: number, isSettled: boolean, lines: Array<{ orderLineId: string, quantity: number }>, surcharges: Array<{ id: string }> | null, payment: { id: string, state: string, amount: number, method: string } | null, refund: { id: string, state: string, total: number, paymentId: string } | null }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, discounts: Array<{ description: string, adjustmentSource: string, amount: number, amountWithTax: number }>, shippingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, billingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, shippingLines: Array<{ id: string, discountedPriceWithTax: number, shippingMethod: { id: string, name: string } }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type AddManualPaymentMutationVariables = Exact<{
  input: ManualPaymentInput;
}>;


export type AddManualPaymentMutation = { addManualPaymentToOrder:
    | { errorCode: ErrorCode, message: string }
    | { id: string, state: string, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, lines: Array<{ id: string, quantity: number, orderPlacedQuantity: number, linePrice: number, linePriceWithTax: number, unitPriceWithTax: number, discountedLinePriceWithTax: number, proratedLinePriceWithTax: number, proratedUnitPriceWithTax: number, discounts: Array<{ description: string, amountWithTax: number }>, productVariant: { id: string, name: string } }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number, taxRate: number }>, payments: Array<{ id: string, transactionId: string | null, state: string, amount: number, method: string, metadata: unknown, refunds: Array<{ id: string, state: string, total: number, paymentId: string }> }> | null, modifications: Array<{ id: string, note: string, priceChange: number, isSettled: boolean, lines: Array<{ orderLineId: string, quantity: number }>, surcharges: Array<{ id: string }> | null, payment: { id: string, state: string, amount: number, method: string } | null, refund: { id: string, state: string, total: number, paymentId: string } | null }>, promotions: Array<{ id: string, name: string, couponCode: string | null }>, discounts: Array<{ description: string, adjustmentSource: string, amount: number, amountWithTax: number }>, shippingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, billingAddress: { streetLine1: string | null, city: string | null, postalCode: string | null, province: string | null, countryCode: string | null, country: string | null } | null, shippingLines: Array<{ id: string, discountedPriceWithTax: number, shippingMethod: { id: string, name: string } }> }
   };

export type DeletePromotionAdHoc1MutationVariables = Exact<{ [key: string]: never; }>;


export type DeletePromotionAdHoc1Mutation = { deletePromotion: { result: DeletionResult } };

export type GetTaxRateListQueryVariables = Exact<{
  options?: TaxRateListOptions | null | undefined;
}>;


export type GetTaxRateListQuery = { taxRates: { totalItems: number, items: Array<{ id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string } }> } };

export type GetOrderWithLineCalculatedPropsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderWithLineCalculatedPropsQuery = { order: { id: string, lines: Array<{ id: string, linePriceWithTax: number, quantity: number }> } | null };

export type GetOrderListFulfillmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderListFulfillmentsQuery = { orders: { items: Array<{ id: string, state: string, fulfillments: Array<{ id: string, state: string, nextStates: Array<string>, method: string }> | null }> } };

export type GetOrderFulfillmentItemsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderFulfillmentItemsQuery = { order: { id: string, state: string, fulfillments: Array<{ id: string, state: string, nextStates: Array<string>, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null } | null };

export type RefundFragment = { id: string, state: string, items: number, transactionId: string | null, shipping: number, total: number, metadata: unknown };

export type RefundOrderMutationVariables = Exact<{
  input: RefundOrderInput;
}>;


export type RefundOrderMutation = { refundOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, state: string, items: number, transactionId: string | null, shipping: number, total: number, metadata: unknown }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type SettleRefundMutationVariables = Exact<{
  input: SettleRefundInput;
}>;


export type SettleRefundMutation = { settleRefund:
    | { id: string, state: string, items: number, transactionId: string | null, shipping: number, total: number, metadata: unknown }
    | { errorCode: ErrorCode, message: string }
   };

export type AddNoteToOrderMutationVariables = Exact<{
  input: AddNoteToOrderInput;
}>;


export type AddNoteToOrderMutation = { addNoteToOrder: { id: string } };

export type UpdateOrderNoteMutationVariables = Exact<{
  input: UpdateOrderNoteInput;
}>;


export type UpdateOrderNoteMutation = { updateOrderNote: { id: string, data: unknown, isPublic: boolean } };

export type DeleteOrderNoteMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteOrderNoteMutation = { deleteOrderNote: { result: DeletionResult, message: string | null } };

export type GetOrderWithPaymentsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderWithPaymentsQuery = { order: { id: string, payments: Array<{ id: string, errorMessage: string | null, metadata: unknown, refunds: Array<{ id: string, total: number }> }> | null } | null };

export type GetOrderLineFulfillmentsQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderLineFulfillmentsQuery = { order: { id: string, lines: Array<{ id: string, fulfillmentLines: Array<{ orderLineId: string, quantity: number, fulfillment: { id: string, state: string } }> | null }> } | null };

export type GetOrderListWithQtyQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type GetOrderListWithQtyQuery = { orders: { items: Array<{ id: string, code: string, totalQuantity: number, lines: Array<{ id: string, quantity: number }> }> } };

export type CancelPaymentMutationVariables = Exact<{
  paymentId: string | number;
}>;


export type CancelPaymentMutation = { cancelPayment:
    | { errorCode: ErrorCode, message: string, paymentErrorMessage: string }
    | { id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }
    | { errorCode: ErrorCode, message: string, transitionError: string }
   };

export type SetOrderCustomerMutationVariables = Exact<{
  input: SetOrderCustomerInput;
}>;


export type SetOrderCustomerMutation = { setOrderCustomer: { id: string, customer: { id: string } | null } | null };

export type PaymentMethodFragment = { id: string, code: string, name: string, description: string, enabled: boolean, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> };

export type CreatePaymentMethodMutationVariables = Exact<{
  input: CreatePaymentMethodInput;
}>;


export type CreatePaymentMethodMutation = { createPaymentMethod: { id: string, code: string, name: string, description: string, enabled: boolean, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } };

export type UpdatePaymentMethodMutationVariables = Exact<{
  input: UpdatePaymentMethodInput;
}>;


export type UpdatePaymentMethodMutation = { updatePaymentMethod: { id: string, code: string, name: string, description: string, enabled: boolean, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } };

export type GetPaymentMethodHandlersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodHandlersQuery = { paymentMethodHandlers: Array<{ code: string, args: Array<{ name: string, type: string }> }> };

export type GetPaymentMethodCheckersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodCheckersQuery = { paymentMethodEligibilityCheckers: Array<{ code: string, args: Array<{ name: string, type: string }> }> };

export type GetPaymentMethodQueryVariables = Exact<{
  id: string | number;
}>;


export type GetPaymentMethodQuery = { paymentMethod: { id: string, code: string, name: string, description: string, enabled: boolean, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> } | null };

export type GetPaymentMethodListQueryVariables = Exact<{
  options?: PaymentMethodListOptions | null | undefined;
}>;


export type GetPaymentMethodListQuery = { paymentMethods: { totalItems: number, items: Array<{ id: string, code: string, name: string, description: string, enabled: boolean, checker: { code: string, args: Array<{ name: string, value: string }> } | null, handler: { code: string, args: Array<{ name: string, value: string }> }, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> }> } };

export type DeletePaymentMethodMutationVariables = Exact<{
  id: string | number;
  force?: boolean | null | undefined;
}>;


export type DeletePaymentMethodMutation = { deletePaymentMethod: { message: string | null, result: DeletionResult } };

export type AddManualPayment2MutationVariables = Exact<{
  input: ManualPaymentInput;
}>;


export type AddManualPayment2Mutation = { addManualPaymentToOrder:
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, totalQuantity: number, currencyCode: CurrencyCode, shipping: number, shippingWithTax: number, customer: { id: string, firstName: string, lastName: string } | null, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, quantity: number, taxRate: number, linePriceWithTax: number, featuredAsset: { preview: string } | null, productVariant: { id: string, name: string, sku: string }, taxLines: Array<{ description: string, taxRate: number }> }>, surcharges: Array<{ id: string, description: string, sku: string | null, price: number, priceWithTax: number }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, name: string, description: string } }>, shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null, payments: Array<{ id: string, transactionId: string | null, amount: number, method: string, state: string, nextStates: Array<string>, metadata: unknown, refunds: Array<{ id: string, total: number, reason: string | null }> }> | null, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null, lines: Array<{ orderLineId: string, quantity: number }> }> | null }
   };

export type GetProductOptionGroupQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductOptionGroupQuery = { productOptionGroup: { id: string, code: string, name: string, options: Array<{ id: string, code: string, name: string }> } | null };

export type UpdateProductOptionGroupMutationVariables = Exact<{
  input: UpdateProductOptionGroupInput;
}>;


export type UpdateProductOptionGroupMutation = { updateProductOptionGroup: { id: string, code: string, name: string, options: Array<{ id: string, code: string, name: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type CreateProductOptionMutationVariables = Exact<{
  input: CreateProductOptionInput;
}>;


export type CreateProductOptionMutation = { createProductOption: { id: string, code: string, name: string, groupId: string, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateProductOptionMutationVariables = Exact<{
  input: UpdateProductOptionInput;
}>;


export type UpdateProductOptionMutation = { updateProductOption: { id: string, code: string, name: string, groupId: string } };

export type DeleteProductOptionMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteProductOptionMutation = { deleteProductOption: { result: DeletionResult, message: string | null } };

export type RemoveOptionGroupFromProductMutationVariables = Exact<{
  productId: string | number;
  optionGroupId: string | number;
  force?: boolean | null | undefined;
}>;


export type RemoveOptionGroupFromProductMutation = { removeOptionGroupFromProduct:
    | { id: string, optionGroups: Array<{ id: string, code: string, options: Array<{ id: string, code: string }> }> }
    | { errorCode: ErrorCode, message: string, optionGroupCode: string, productVariantCount: number }
   };

export type GetOptionGroupQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOptionGroupQuery = { productOptionGroup: { id: string, code: string, options: Array<{ id: string, code: string }> } | null };

export type GetProductVariantQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductVariantQuery = { productVariant: { id: string, name: string } | null };

export type GetProductWithVariantListQueryVariables = Exact<{
  id?: string | number | null | undefined;
  variantListOptions?: ProductVariantListOptions | null | undefined;
}>;


export type GetProductWithVariantListQuery = { product: { id: string, variantList: { totalItems: number, items: Array<{ id: string, createdAt: unknown, updatedAt: unknown, enabled: boolean, languageCode: LanguageCode, name: string, currencyCode: CurrencyCode, price: number, priceWithTax: number, stockOnHand: number, trackInventory: GlobalFlag, sku: string, prices: Array<{ currencyCode: CurrencyCode, price: number }>, taxRateApplied: { id: string, name: string, value: number }, taxCategory: { id: string, name: string }, options: Array<{ id: string, code: string, languageCode: LanguageCode, groupId: string, name: string }>, facetValues: Array<{ id: string, code: string, name: string, facet: { id: string, name: string } }>, featuredAsset: { id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string } | null, assets: Array<{ id: string, name: string, fileSize: number, mimeType: string, type: AssetType, preview: string, source: string }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string }>, channels: Array<{ id: string, code: string }> }> } } | null };

export type GetPromotionListQueryVariables = Exact<{
  options?: PromotionListOptions | null | undefined;
}>;


export type GetPromotionListQuery = { promotions: { totalItems: number, items: Array<{ id: string, createdAt: unknown, updatedAt: unknown, couponCode: string | null, startsAt: unknown, endsAt: unknown, name: string, description: string, enabled: boolean, perCustomerUsageLimit: number | null, usageLimit: number | null, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> }> } };

export type UpdatePromotionMutationVariables = Exact<{
  input: UpdatePromotionInput;
}>;


export type UpdatePromotionMutation = { updatePromotion:
    | { errorCode: ErrorCode, message: string }
    | { id: string, createdAt: unknown, updatedAt: unknown, couponCode: string | null, startsAt: unknown, endsAt: unknown, name: string, description: string, enabled: boolean, perCustomerUsageLimit: number | null, usageLimit: number | null, conditions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, actions: Array<{ code: string, args: Array<{ name: string, value: string }> }>, translations: Array<{ id: string, languageCode: LanguageCode, name: string, description: string }> }
   };

export type ConfigurableOperationDefFragment = { code: string, description: string, args: Array<{ name: string, type: string, ui: unknown }> };

export type GetAdjustmentOperationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdjustmentOperationsQuery = { promotionActions: Array<{ code: string, description: string, args: Array<{ name: string, type: string, ui: unknown }> }>, promotionConditions: Array<{ code: string, description: string, args: Array<{ name: string, type: string, ui: unknown }> }> };

export type GetRolesQueryVariables = Exact<{
  options?: RoleListOptions | null | undefined;
}>;


export type GetRolesQuery = { roles: { totalItems: number, items: Array<{ id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string, token: string }> }> } };

export type GetRoleQueryVariables = Exact<{
  id: string | number;
}>;


export type GetRoleQuery = { role: { id: string, code: string, description: string, permissions: Array<Permission>, channels: Array<{ id: string, code: string, token: string }> } | null };

export type DeleteRoleMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteRoleMutation = { deleteRole: { result: DeletionResult, message: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { success: boolean } };

export type GetShippingMethodQueryVariables = Exact<{
  id: string | number;
}>;


export type GetShippingMethodQuery = { shippingMethod: { id: string, code: string, name: string, description: string, calculator: { code: string, args: Array<{ name: string, value: string }> }, checker: { code: string, args: Array<{ name: string, value: string }> } } | null };

export type GetEligibilityCheckersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEligibilityCheckersQuery = { shippingEligibilityCheckers: Array<{ code: string, description: string, args: Array<{ name: string, type: string, description: string | null, label: string | null, ui: unknown }> }> };

export type GetCalculatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCalculatorsQuery = { shippingCalculators: Array<{ code: string, description: string, args: Array<{ name: string, type: string, description: string | null, label: string | null, ui: unknown }> }> };

export type TestShippingMethodQueryVariables = Exact<{
  input: TestShippingMethodInput;
}>;


export type TestShippingMethodQuery = { testShippingMethod: { eligible: boolean, quote: { price: number, priceWithTax: number, metadata: unknown } | null } };

export type TestEligibleMethodsQueryVariables = Exact<{
  input: TestEligibleShippingMethodsInput;
}>;


export type TestEligibleMethodsQuery = { testEligibleShippingMethods: Array<{ id: string, name: string, description: string, price: number, priceWithTax: number, metadata: unknown }> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { me: { identifier: string } | null };

export type GetProductsTake3QueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsTake3Query = { products: { items: Array<{ id: string }> } };

export type GetProduct1QueryVariables = Exact<{ [key: string]: never; }>;


export type GetProduct1Query = { product: { id: string } | null };

export type GetProduct2VariantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProduct2VariantsQuery = { product: { id: string, variants: Array<{ id: string, name: string }> } | null };

export type GetProductCollectionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductCollectionQuery = { product: { collections: Array<{ id: string, name: string }> } | null };

export type GetCollectionShopQueryVariables = Exact<{
  id?: string | number | null | undefined;
  slug?: string | null | undefined;
}>;


export type GetCollectionShopQuery = { collection: { id: string, name: string, slug: string, description: string, parent: { id: string, name: string } | null, children: Array<{ id: string, name: string }> | null } | null };

export type DisableProductMutationVariables = Exact<{
  id: string | number;
}>;


export type DisableProductMutation = { updateProduct: { id: string } };

export type GetCollectionVariantsQueryVariables = Exact<{
  id?: string | number | null | undefined;
  slug?: string | null | undefined;
}>;


export type GetCollectionVariantsQuery = { collection: { id: string, productVariants: { items: Array<{ id: string, name: string }> } } | null };

export type GetCollectionListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionListQuery = { collections: { items: Array<{ id: string, name: string }> } };

export type GetProductFacetValuesQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductFacetValuesQuery = { product: { id: string, name: string, facetValues: Array<{ name: string }> } | null };

export type GetVariantFacetValuesQueryVariables = Exact<{
  id: string | number;
}>;


export type GetVariantFacetValuesQuery = { product: { id: string, name: string, variants: Array<{ id: string, facetValues: Array<{ name: string }> }> } | null };

export type GetCustomerIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerIdsQuery = { customers: { items: Array<{ id: string }> } };

export type StockLocationFragment = { id: string, name: string, description: string };

export type GetStockLocationQueryVariables = Exact<{
  id: string | number;
}>;


export type GetStockLocationQuery = { stockLocation: { id: string, name: string, description: string } | null };

export type GetStockLocationsQueryVariables = Exact<{
  options?: StockLocationListOptions | null | undefined;
}>;


export type GetStockLocationsQuery = { stockLocations: { totalItems: number, items: Array<{ id: string, name: string, description: string }> } };

export type CreateStockLocationMutationVariables = Exact<{
  input: CreateStockLocationInput;
}>;


export type CreateStockLocationMutation = { createStockLocation: { id: string, name: string, description: string } };

export type UpdateStockLocationMutationVariables = Exact<{
  input: UpdateStockLocationInput;
}>;


export type UpdateStockLocationMutation = { updateStockLocation: { id: string, name: string, description: string } };

export type GetVariantStockLevelsQueryVariables = Exact<{
  options?: ProductVariantListOptions | null | undefined;
}>;


export type GetVariantStockLevelsQuery = { productVariants: { items: Array<{ id: string, name: string, stockOnHand: number, stockAllocated: number, stockLevels: Array<{ stockLocationId: string, stockOnHand: number, stockAllocated: number }> }> } };

export type UpdateStockMutationVariables = Exact<{
  input: Array<UpdateProductVariantInput> | UpdateProductVariantInput;
}>;


export type UpdateStockMutation = { updateProductVariants: Array<{ id: string, stockOnHand: number, stockAllocated: number, stockMovements: { totalItems: number, items: Array<
        | { id: string, type: StockMovementType, quantity: number }
        | { id: string, type: StockMovementType, quantity: number }
        | { id: string, type: StockMovementType, quantity: number }
        | { id: string, type: StockMovementType, quantity: number }
        | { id: string, type: StockMovementType, quantity: number }
        | { id: string, type: StockMovementType, quantity: number }
      > } } | null> };

export type TransitionFulfillmentToStateMutationVariables = Exact<{
  id: string | number;
  state: string;
}>;


export type TransitionFulfillmentToStateMutation = { transitionFulfillmentToState:
    | { id: string, state: string, nextStates: Array<string>, createdAt: unknown }
    | { errorCode: ErrorCode, message: string, transitionError: string }
   };

export type UpdateOrderCustomFieldsMutationVariables = Exact<{
  input: UpdateOrderInput;
}>;


export type UpdateOrderCustomFieldsMutation = { setOrderCustomFields: { id: string } | null };

export type TestGetStockLocationsListQueryVariables = Exact<{
  options?: StockLocationListOptions | null | undefined;
}>;


export type TestGetStockLocationsListQuery = { stockLocations: { totalItems: number, items: Array<{ id: string, name: string, description: string }> } };

export type TestGetStockLocationQueryVariables = Exact<{
  id: string | number;
}>;


export type TestGetStockLocationQuery = { stockLocation: { id: string, name: string, description: string } | null };

export type TestCreateStockLocationMutationVariables = Exact<{
  input: CreateStockLocationInput;
}>;


export type TestCreateStockLocationMutation = { createStockLocation: { id: string, name: string, description: string } };

export type TestUpdateStockLocationMutationVariables = Exact<{
  input: UpdateStockLocationInput;
}>;


export type TestUpdateStockLocationMutation = { updateStockLocation: { id: string, name: string, description: string } };

export type TestDeleteStockLocationMutationVariables = Exact<{
  input: DeleteStockLocationInput;
}>;


export type TestDeleteStockLocationMutation = { deleteStockLocation: { result: DeletionResult, message: string | null } };

export type TestGetStockLevelsForVariantQueryVariables = Exact<{
  id: string | number;
}>;


export type TestGetStockLevelsForVariantQuery = { productVariant: { id: string, stockLevels: Array<{ stockOnHand: number, stockAllocated: number, stockLocationId: string }> } | null };

export type TestSetStockLevelInLocationMutationVariables = Exact<{
  input: UpdateProductVariantInput;
}>;


export type TestSetStockLevelInLocationMutation = { updateProductVariants: Array<{ id: string, stockLevels: Array<{ stockOnHand: number, stockAllocated: number, stockLocationId: string }> } | null> };

export type TestAssignStockLocationToChannelMutationVariables = Exact<{
  input: AssignStockLocationsToChannelInput;
}>;


export type TestAssignStockLocationToChannelMutation = { assignStockLocationsToChannel: Array<{ id: string, name: string }> };

export type TestRemoveStockLocationsFromChannelMutationVariables = Exact<{
  input: RemoveStockLocationsFromChannelInput;
}>;


export type TestRemoveStockLocationsFromChannelMutation = { removeStockLocationsFromChannel: Array<{ id: string, name: string }> };

export type GetTagListQueryVariables = Exact<{
  options?: TagListOptions | null | undefined;
}>;


export type GetTagListQuery = { tags: { totalItems: number, items: Array<{ id: string, value: string }> } };

export type GetTagQueryVariables = Exact<{
  id: string | number;
}>;


export type GetTagQuery = { tag: { id: string, value: string } };

export type CreateTagMutationVariables = Exact<{
  input: CreateTagInput;
}>;


export type CreateTagMutation = { createTag: { id: string, value: string } };

export type UpdateTagMutationVariables = Exact<{
  input: UpdateTagInput;
}>;


export type UpdateTagMutation = { updateTag: { id: string, value: string } };

export type DeleteTagMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTagMutation = { deleteTag: { message: string | null, result: DeletionResult } };

export type GetTaxCategoryListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTaxCategoryListQuery = { taxCategories: { items: Array<{ id: string, name: string, isDefault: boolean }> } };

export type GetTaxCategoryQueryVariables = Exact<{
  id: string | number;
}>;


export type GetTaxCategoryQuery = { taxCategory: { id: string, name: string, isDefault: boolean } | null };

export type CreateTaxCategoryMutationVariables = Exact<{
  input: CreateTaxCategoryInput;
}>;


export type CreateTaxCategoryMutation = { createTaxCategory: { id: string, name: string, isDefault: boolean } };

export type UpdateTaxCategoryMutationVariables = Exact<{
  input: UpdateTaxCategoryInput;
}>;


export type UpdateTaxCategoryMutation = { updateTaxCategory: { id: string, name: string, isDefault: boolean } };

export type DeleteTaxCategoryMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTaxCategoryMutation = { deleteTaxCategory: { result: DeletionResult, message: string | null } };

export type GetTaxRateQueryVariables = Exact<{
  id: string | number;
}>;


export type GetTaxRateQuery = { taxRate: { id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null } | null };

export type CreateTaxRateMutationVariables = Exact<{
  input: CreateTaxRateInput;
}>;


export type CreateTaxRateMutation = { createTaxRate: { id: string, name: string, enabled: boolean, value: number, category: { id: string, name: string }, zone: { id: string, name: string }, customerGroup: { id: string, name: string } | null } };

export type DeleteTaxRateMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteTaxRateMutation = { deleteTaxRate: { result: DeletionResult, message: string | null } };

export type DeleteZoneMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteZoneMutation = { deleteZone: { result: DeletionResult, message: string | null } };

export type GetZonesQueryVariables = Exact<{
  options?: ZoneListOptions | null | undefined;
}>;


export type GetZonesQuery = { zones: { totalItems: number, items: Array<{ id: string, name: string }> } };

export type GetZoneQueryVariables = Exact<{
  id: string | number;
}>;


export type GetZoneQuery = { zone: { id: string, name: string, members: Array<
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    > } | null };

export type GetActiveChannelWithZoneMembersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveChannelWithZoneMembersQuery = { activeChannel: { id: string, defaultShippingZone: { id: string, members: Array<
        | { name: string }
        | { name: string }
      > } | null } };

export type CreateZoneMutationVariables = Exact<{
  input: CreateZoneInput;
}>;


export type CreateZoneMutation = { createZone: { id: string, name: string, members: Array<
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    > } };

export type UpdateZoneMutationVariables = Exact<{
  input: UpdateZoneInput;
}>;


export type UpdateZoneMutation = { updateZone: { id: string, name: string, members: Array<
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    > } };

export type AddMembersToZoneMutationVariables = Exact<{
  zoneId: string | number;
  memberIds: Array<string | number> | string | number;
}>;


export type AddMembersToZoneMutation = { addMembersToZone: { id: string, name: string, members: Array<
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    > } };

export type RemoveMembersFromZoneMutationVariables = Exact<{
  zoneId: string | number;
  memberIds: Array<string | number> | string | number;
}>;


export type RemoveMembersFromZoneMutation = { removeMembersFromZone: { id: string, name: string, members: Array<
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
      | { id: string, code: string, name: string, enabled: boolean, translations: Array<{ id: string, languageCode: LanguageCode, name: string }> }
    > } };

export const ProdFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProdFragmentFragment, unknown>;
export const ProdFragment2FragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProdFragment2Fragment, unknown>;
export const ProdFragment1FragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment2"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProdFragment1Fragment, unknown>;
export const ProdFragment3_1FragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment3_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProdFragment3_1Fragment, unknown>;
export const ProdFragment2_1FragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment3_1"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment3_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProdFragment2_1Fragment, unknown>;
export const ProdFragment1_1FragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment1_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment2_1"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment3_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment3_1"}}]}}]} as unknown as DocumentNode<ProdFragment1_1Fragment, unknown>;
export const AdministratorFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<AdministratorFragment, unknown>;
export const AssetFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<AssetFragment, unknown>;
export const ProductVariantFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<ProductVariantFragment, unknown>;
export const ProductWithVariantsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<ProductWithVariantsFragment, unknown>;
export const RoleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RoleFragment, unknown>;
export const ConfigurableOperationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]} as unknown as DocumentNode<ConfigurableOperationFragment, unknown>;
export const CollectionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]} as unknown as DocumentNode<CollectionFragment, unknown>;
export const FacetValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<FacetValueFragment, unknown>;
export const FacetWithValuesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetWithValues"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<FacetWithValuesFragment, unknown>;
export const AddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}}]} as unknown as DocumentNode<AddressFragment, unknown>;
export const CustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}}]} as unknown as DocumentNode<CustomerFragment, unknown>;
export const AdjustmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Adjustment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Adjustment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<AdjustmentFragment, unknown>;
export const OrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<OrderFragment, unknown>;
export const ShippingAddressFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]} as unknown as DocumentNode<ShippingAddressFragment, unknown>;
export const PaymentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<PaymentFragment, unknown>;
export const OrderWithLinesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<OrderWithLinesFragment, unknown>;
export const PromotionFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Promotion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"perCustomerUsageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]} as unknown as DocumentNode<PromotionFragment, unknown>;
export const CountryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CountryFragment, unknown>;
export const ZoneFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ZoneFragment, unknown>;
export const TaxRateFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxRate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TaxRateFragment, unknown>;
export const CurrentUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<CurrentUserFragment, unknown>;
export const VariantWithStockFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantWithStock"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockMovements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<VariantWithStockFragment, unknown>;
export const FulfillmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Fulfillment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fulfillment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<FulfillmentFragment, unknown>;
export const ChannelFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Channel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"availableCurrencyCodes"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguageCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultTaxZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pricesIncludeTax"}}]}}]} as unknown as DocumentNode<ChannelFragment, unknown>;
export const GlobalSettingsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GlobalSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"outOfStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"serverConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderProcess"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permittedAssetTypes"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assignable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GlobalSettingsFragment, unknown>;
export const CustomerGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<CustomerGroupFragment, unknown>;
export const ProductOptionGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductOptionGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductOptionGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProductOptionGroupFragment, unknown>;
export const ProductWithOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ProductWithOptionsFragment, unknown>;
export const ShippingMethodFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShippingMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<ShippingMethodFragment, unknown>;
export const CanceledOrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CanceledOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<CanceledOrderFragment, unknown>;
export const AssetFragFirstFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetFragFirst"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]} as unknown as DocumentNode<AssetFragFirstFragment, unknown>;
export const AssetWithTagsAndFocalPointFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetWithTagsAndFocalPoint"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}},{"kind":"Field","name":{"kind":"Name","value":"focalPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<AssetWithTagsAndFocalPointFragment, unknown>;
export const OrderWithModificationsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithModifications"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"orderPlacedQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discountedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"modifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"priceChange"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"promotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<OrderWithModificationsFragment, unknown>;
export const RefundFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Refund"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Refund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<RefundFragment, unknown>;
export const PaymentMethodFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handler"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<PaymentMethodFragment, unknown>;
export const ConfigurableOperationDefFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperationDef"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperationDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"ui"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ConfigurableOperationDefFragment, unknown>;
export const StockLocationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockLocation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<StockLocationFragment, unknown>;
export const GetAdministratorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdministrators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AdministratorListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"administrators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<GetAdministratorsQuery, GetAdministratorsQueryVariables>;
export const GetAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdministrator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"administrator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<GetAdministratorQuery, GetAdministratorQueryVariables>;
export const ActiveAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveAdministrator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeAdministrator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<ActiveAdministratorQuery, ActiveAdministratorQueryVariables>;
export const UpdateActiveAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateActiveAdministrator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActiveAdministratorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActiveAdministrator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateActiveAdministratorMutation, UpdateActiveAdministratorMutationVariables>;
export const DeleteAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAdministrator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAdministrator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteAdministratorMutation, DeleteAdministratorMutationVariables>;
export const Q1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Q1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Q1Query, Q1QueryVariables>;
export const Q2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Q2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Q2Query, Q2QueryVariables>;
export const GetCollectionWithAssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionWithAssets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<GetCollectionWithAssetsQuery, GetCollectionWithAssetsQueryVariables>;
export const AssignAssetsToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"assignAssetsToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignAssetsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignAssetsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<AssignAssetsToChannelMutation, AssignAssetsToChannelMutationVariables>;
export const CanCreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CanCreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CanCreateCustomerMutation, CanCreateCustomerMutationVariables>;
export const GetCustomerCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCustomerCountQuery, GetCustomerCountQueryVariables>;
export const DeepFieldResolutionTestQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeepFieldResolutionTestQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeepFieldResolutionTestQueryQuery, DeepFieldResolutionTestQueryQueryVariables>;
export const AuthenticateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Authenticate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthenticationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentUser"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidCredentialsError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authenticationError"}},{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<AuthenticateMutation, AuthenticateMutationVariables>;
export const GetCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomersQuery, GetCustomersQueryVariables>;
export const GetCustomerUserAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerUserAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"authenticationMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"strategy"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerUserAuthQuery, GetCustomerUserAuthQueryVariables>;
export const DeleteChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const GetChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"availableCurrencyCodes"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguageCode"}},{"kind":"Field","name":{"kind":"Name","value":"availableLanguageCodes"}},{"kind":"Field","name":{"kind":"Name","value":"outOfStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"pricesIncludeTax"}}]}}]}}]} as unknown as DocumentNode<GetChannelQuery, GetChannelQueryVariables>;
export const UpdateGlobalLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGlobalLanguages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGlobalSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGlobalSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableLanguages"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGlobalLanguagesMutation, UpdateGlobalLanguagesMutationVariables>;
export const GetCollectionsWithAssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionsWithAssets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionsWithAssetsQuery, GetCollectionsWithAssetsQueryVariables>;
export const GetProductsWithVariantIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductsWithVariantIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"ASC"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsWithVariantIdsQuery, GetProductsWithVariantIdsQueryVariables>;
export const GetCollectionListAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionListAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<GetCollectionListAdminQuery, GetCollectionListAdminQueryVariables>;
export const MoveCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<MoveCollectionMutation, MoveCollectionMutationVariables>;
export const GetFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetFacetValuesQuery, GetFacetValuesQueryVariables>;
export const GetCollectionProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"ASC"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionProductsQuery, GetCollectionProductsQueryVariables>;
export const CreateCollectionSelectVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCollectionSelectVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCollectionSelectVariantsMutation, CreateCollectionSelectVariantsMutationVariables>;
export const GetCollectionBreadcrumbsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionBreadcrumbs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"breadcrumbs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionBreadcrumbsQuery, GetCollectionBreadcrumbsQueryVariables>;
export const GetCollectionsForProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionsForProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"term"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"contains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"term"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionsForProductsQuery, GetCollectionsForProductsQueryVariables>;
export const DeleteCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const GetProductCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductCollectionsQuery, GetProductCollectionsQueryVariables>;
export const GetProductCollectionsWithParentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductCollectionsWithParent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductCollectionsWithParentQuery, GetProductCollectionsWithParentQueryVariables>;
export const GetCollectionNestedParentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionNestedParents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionNestedParentsQuery, GetCollectionNestedParentsQueryVariables>;
export const PreviewCollectionVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PreviewCollectionVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PreviewCollectionVariantsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewCollectionVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<PreviewCollectionVariantsQuery, PreviewCollectionVariantsQueryVariables>;
export const RemoveCollectionsFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCollectionsFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveCollectionsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCollectionsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<RemoveCollectionsFromChannelMutation, RemoveCollectionsFromChannelMutationVariables>;
export const DeleteCollectionsBulkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCollectionsBulk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCollections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteCollectionsBulkMutation, DeleteCollectionsBulkMutationVariables>;
export const GetCheckersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingEligibilityCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"list"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetCheckersQuery, GetCheckersQueryVariables>;
export const DeleteCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCountryMutation, DeleteCountryMutationVariables>;
export const GetCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCountryQuery, GetCountryQueryVariables>;
export const CreateCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateCountryMutation, CreateCountryMutationVariables>;
export const DeleteCustomerAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerAddressMutation, DeleteCustomerAddressMutationVariables>;
export const GetCustomerWithUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerWithUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerWithUserQuery, GetCustomerWithUserQueryVariables>;
export const GetCustomerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerOrdersQuery, GetCustomerOrdersQueryVariables>;
export const AddNoteToCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNoteToCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddNoteToCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addNoteToCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}}]}}]} as unknown as DocumentNode<AddNoteToCustomerMutation, AddNoteToCustomerMutationVariables>;
export const ReindexDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Reindex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reindex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ReindexMutation, ReindexMutationVariables>;
export const SearchFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"facetValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchFacetValuesQuery, SearchFacetValuesQueryVariables>;
export const SearchCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchCollectionsQuery, SearchCollectionsQueryVariables>;
export const SearchGetAssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGetAssets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantName"}},{"kind":"Field","name":{"kind":"Name","value":"productAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"focalPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariantAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"focalPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchGetAssetsQuery, SearchGetAssetsQueryVariables>;
export const SearchGetPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGetPrices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PriceRange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SinglePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PriceRange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SinglePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchGetPricesQuery, SearchGetPricesQueryVariables>;
export const SearchProductsWithScoreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProductsWithScore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}}]}}]} as unknown as DocumentNode<SearchProductsWithScoreQuery, SearchProductsWithScoreQueryVariables>;
export const CreateDraftOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDraftOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDraftOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<CreateDraftOrderMutation, CreateDraftOrderMutationVariables>;
export const AddItemToDraftOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddItemToDraftOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddItemToDraftOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addItemToDraftOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<AddItemToDraftOrderMutation, AddItemToDraftOrderMutationVariables>;
export const AdjustDraftOrderLineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdjustDraftOrderLine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdjustDraftOrderLineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustDraftOrderLine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<AdjustDraftOrderLineMutation, AdjustDraftOrderLineMutationVariables>;
export const RemoveDraftOrderLineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveDraftOrderLine"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDraftOrderLine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderLineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<RemoveDraftOrderLineMutation, RemoveDraftOrderLineMutationVariables>;
export const SetCustomerForDraftOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCustomerForDraftOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCustomerForDraftOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<SetCustomerForDraftOrderMutation, SetCustomerForDraftOrderMutationVariables>;
export const SetDraftOrderShippingAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDraftOrderShippingAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDraftOrderShippingAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<SetDraftOrderShippingAddressMutation, SetDraftOrderShippingAddressMutationVariables>;
export const SetDraftOrderBillingAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDraftOrderBillingAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDraftOrderBillingAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<SetDraftOrderBillingAddressMutation, SetDraftOrderBillingAddressMutationVariables>;
export const ApplyCouponCodeToDraftOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyCouponCodeToDraftOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyCouponCodeToDraftOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"couponCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<ApplyCouponCodeToDraftOrderMutation, ApplyCouponCodeToDraftOrderMutationVariables>;
export const RemoveCouponCodeFromDraftOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCouponCodeFromDraftOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCouponCodeFromDraftOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"couponCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<RemoveCouponCodeFromDraftOrderMutation, RemoveCouponCodeFromDraftOrderMutationVariables>;
export const DraftOrderEligibleShippingMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DraftOrderEligibleShippingMethods"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eligibleShippingMethodsForDraftOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<DraftOrderEligibleShippingMethodsQuery, DraftOrderEligibleShippingMethodsQueryVariables>;
export const SetDraftOrderShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDraftOrderShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shippingMethodId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDraftOrderShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"shippingMethodId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shippingMethodId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<SetDraftOrderShippingMethodMutation, SetDraftOrderShippingMethodMutationVariables>;
export const GetOrderPlacedAtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderPlacedAt"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"orderPlacedAt"}}]}}]}}]} as unknown as DocumentNode<GetOrderPlacedAtQuery, GetOrderPlacedAtQueryVariables>;
export const GetEntityDuplicatorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntityDuplicators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entityDuplicators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"requiresPermission"}},{"kind":"Field","name":{"kind":"Name","value":"forEntities"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"defaultValue"}}]}}]}}]}}]} as unknown as DocumentNode<GetEntityDuplicatorsQuery, GetEntityDuplicatorsQueryVariables>;
export const DuplicateEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DuplicateEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DuplicateEntityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicateEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DuplicateEntitySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newEntityId"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DuplicateEntityError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"duplicationError"}}]}}]}}]}}]} as unknown as DocumentNode<DuplicateEntityMutation, DuplicateEntityMutationVariables>;
export const IdTest1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"5"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<IdTest1Query, IdTest1QueryVariables>;
export const IdTest2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest2"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<IdTest2Query, IdTest2QueryVariables>;
export const IdTest3Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest3"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<IdTest3Query, IdTest3QueryVariables>;
export const IdTest4Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IdTest4"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"featuredAssetId"},"value":{"kind":"StringValue","value":"T_3","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<IdTest4Mutation, IdTest4MutationVariables>;
export const IdTest5Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IdTest5"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"translations"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"languageCode"},"value":{"kind":"EnumValue","value":"en"}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"changed","block":false}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<IdTest5Mutation, IdTest5MutationVariables>;
export const IdTest6Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest6"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<IdTest6Query, IdTest6QueryVariables>;
export const IdTest7Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IdTest7"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<IdTest7Mutation, IdTest7MutationVariables>;
export const IdTest8Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IdTest8"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<IdTest8Mutation, IdTest8MutationVariables>;
export const IdTest9Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest9"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<IdTest9Query, IdTest9QueryVariables>;
export const IdTest10Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest10"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment1"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment2"}}]}}]} as unknown as DocumentNode<IdTest10Query, IdTest10QueryVariables>;
export const IdTest11Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IdTest11"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment1_1"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment3_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment2_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment3_1"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProdFragment1_1"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProdFragment2_1"}}]}}]} as unknown as DocumentNode<IdTest11Query, IdTest11QueryVariables>;
export const GetFacetWithValueListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacetWithValueList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValueListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"valueList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetFacetWithValueListQuery, GetFacetWithValueListQueryVariables>;
export const DeleteFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFacetValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteFacetValuesMutation, DeleteFacetValuesMutationVariables>;
export const DeleteFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFacet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteFacetMutation, DeleteFacetMutationVariables>;
export const GetProductWithFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductWithFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductWithFacetValuesQuery, GetProductWithFacetValuesQueryVariables>;
export const GetProductListWithVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductListWithVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetProductListWithVariantsQuery, GetProductListWithVariantsQueryVariables>;
export const CreateFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFacetValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFacetValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateFacetValuesMutation, CreateFacetValuesMutationVariables>;
export const UpdateFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFacetValueInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFacetValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateFacetValuesMutation, UpdateFacetValuesMutationVariables>;
export const AssignFacetsToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignFacetsToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignFacetsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignFacetsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AssignFacetsToChannelMutation, AssignFacetsToChannelMutationVariables>;
export const RemoveFacetsFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFacetsFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveFacetsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFacetsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetInUseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"productCount"}},{"kind":"Field","name":{"kind":"Name","value":"variantCount"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveFacetsFromChannelMutation, RemoveFacetsFromChannelMutationVariables>;
export const GetGlobalSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GlobalSettings"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GlobalSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"outOfStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"serverConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderProcess"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permittedAssetTypes"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assignable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetGlobalSettingsQuery, GetGlobalSettingsQueryVariables>;
export const SearchProductsAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProductsAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantName"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}}]}}]}}]} as unknown as DocumentNode<SearchProductsAdminQuery, SearchProductsAdminQueryVariables>;
export const GetOrderWithSellerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderWithSellerOrders"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"sellerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aggregateOrderId"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderWithSellerOrdersQuery, GetOrderWithSellerOrdersQueryVariables>;
export const CreateAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAdministrator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAdministratorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAdministrator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAdministratorMutation, CreateAdministratorMutationVariables>;
export const UpdateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithVariants"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<UpdateProductMutation, UpdateProductMutationVariables>;
export const CreateProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithVariants"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CreateProductMutation, CreateProductMutationVariables>;
export const GetProductWithVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductWithVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithVariants"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetProductWithVariantsQuery, GetProductWithVariantsQueryVariables>;
export const GetProductListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetProductListQuery, GetProductListQueryVariables>;
export const CreateProductVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductVariantInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CreateProductVariantsMutation, CreateProductVariantsMutationVariables>;
export const UpdateProductVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductVariantInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<UpdateProductVariantsMutation, UpdateProductVariantsMutationVariables>;
export const UpdateTaxRateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTaxRate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaxRateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTaxRate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxRate"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxRate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateTaxRateMutation, UpdateTaxRateMutationVariables>;
export const CreateFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFacetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFacet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetWithValues"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetWithValues"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}}]} as unknown as DocumentNode<CreateFacetMutation, CreateFacetMutationVariables>;
export const UpdateFacetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFacet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFacetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFacet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetWithValues"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetWithValues"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}}]} as unknown as DocumentNode<UpdateFacetMutation, UpdateFacetMutationVariables>;
export const GetCustomerListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCustomerListQuery, GetCustomerListQueryVariables>;
export const GetAssetListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssetList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssetListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<GetAssetListQuery, GetAssetListQueryVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const UpdateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const GetCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderListOptions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}}]}}]} as unknown as DocumentNode<GetCustomerQuery, GetCustomerQueryVariables>;
export const AttemptLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AttemptLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentUser"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<AttemptLoginMutation, AttemptLoginMutationVariables>;
export const GetCountryListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCountryList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CountryListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCountryListQuery, GetCountryListQueryVariables>;
export const UpdateCountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCountry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCountryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCountry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateCountryMutation, UpdateCountryMutationVariables>;
export const GetFacetListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacetList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FacetListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetWithValues"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetWithValues"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}}]} as unknown as DocumentNode<GetFacetListQuery, GetFacetListQueryVariables>;
export const GetFacetListSimpleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacetListSimple"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FacetListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetFacetListSimpleQuery, GetFacetListSimpleQueryVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const GetProductSimpleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductSimple"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<GetProductSimpleQuery, GetProductSimpleQueryVariables>;
export const GetStockMovementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStockMovement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantWithStock"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantWithStock"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockMovements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetStockMovementQuery, GetStockMovementQueryVariables>;
export const GetRunningJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRunningJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"queueName"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetRunningJobsQuery, GetRunningJobsQueryVariables>;
export const CreatePromotionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePromotion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePromotionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPromotion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Promotion"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Promotion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"perCustomerUsageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<CreatePromotionMutation, CreatePromotionMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CreateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Channel"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageNotAvailableError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Channel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"availableCurrencyCodes"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguageCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultTaxZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pricesIncludeTax"}}]}}]} as unknown as DocumentNode<CreateChannelMutation, CreateChannelMutationVariables>;
export const DeleteProductVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProductVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteProductVariantMutation, DeleteProductVariantMutationVariables>;
export const AssignProductsToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignProductsToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignProductsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignProductsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithVariants"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<AssignProductsToChannelMutation, AssignProductsToChannelMutationVariables>;
export const RemoveProductsFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProductsFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveProductsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProductsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithVariants"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithVariants"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<RemoveProductsFromChannelMutation, RemoveProductsFromChannelMutationVariables>;
export const AssignProductVariantsToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignProductVariantsToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignProductVariantsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignProductVariantsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<AssignProductVariantsToChannelMutation, AssignProductVariantsToChannelMutationVariables>;
export const RemoveProductVariantsFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProductVariantsFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveProductVariantsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProductVariantsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveProductVariantsFromChannelMutation, RemoveProductVariantsFromChannelMutationVariables>;
export const UpdateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"focalPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteAssetMutation, DeleteAssetMutationVariables>;
export const UpdateChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Channel"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LanguageNotAvailableError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Channel"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Channel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"availableCurrencyCodes"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCurrencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultLanguageCode"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultTaxZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pricesIncludeTax"}}]}}]} as unknown as DocumentNode<UpdateChannelMutation, UpdateChannelMutationVariables>;
export const GetCustomerHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HistoryEntryListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerHistoryQuery, GetCustomerHistoryQueryVariables>;
export const GetOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<GetOrderQuery, GetOrderQueryVariables>;
export const CreateCustomerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerGroupMutation, CreateCustomerGroupMutationVariables>;
export const RemoveCustomersFromGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCustomersFromGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCustomersFromGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<RemoveCustomersFromGroupMutation, RemoveCustomersFromGroupMutationVariables>;
export const CreateFulfillmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFulfillment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FulfillOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFulfillmentToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Fulfillment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFulfillmentError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fulfillmentHandlerError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Fulfillment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fulfillment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<CreateFulfillmentMutation, CreateFulfillmentMutationVariables>;
export const TransitFulfillmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransitFulfillment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionFulfillmentToState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Fulfillment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FulfillmentStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"transitionError"}},{"kind":"Field","name":{"kind":"Name","value":"fromState"}},{"kind":"Field","name":{"kind":"Name","value":"toState"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Fulfillment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fulfillment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<TransitFulfillmentMutation, TransitFulfillmentMutationVariables>;
export const GetOrderFulfillmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderFulfillments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLine"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderFulfillmentsQuery, GetOrderFulfillmentsQueryVariables>;
export const GetOrderListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<GetOrderListQuery, GetOrderListQueryVariables>;
export const CreateAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}}]}}]} as unknown as DocumentNode<CreateAddressMutation, CreateAddressMutationVariables>;
export const UpdateAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAddressMutation, UpdateAddressMutationVariables>;
export const CreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Customer"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Address"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Address"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingAddress"}},{"kind":"Field","name":{"kind":"Name","value":"defaultBillingAddress"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Customer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Customer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}}]}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Address"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const DeleteCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerMutation, DeleteCustomerMutationVariables>;
export const UpdateCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerNoteMutation, UpdateCustomerNoteMutationVariables>;
export const DeleteCustomerNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerNoteMutation, DeleteCustomerNoteMutationVariables>;
export const UpdateCustomerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerGroupMutation, UpdateCustomerGroupMutationVariables>;
export const DeleteCustomerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCustomerGroupMutation, DeleteCustomerGroupMutationVariables>;
export const GetCustomerGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroupListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCustomerGroupsQuery, GetCustomerGroupsQueryVariables>;
export const GetCustomerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerGroupQuery, GetCustomerGroupQueryVariables>;
export const AddCustomersToGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCustomersToGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCustomersToGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"customerIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomerGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomerGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<AddCustomersToGroupMutation, AddCustomersToGroupMutationVariables>;
export const GetCustomerWithGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerWithGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerWithGroupsQuery, GetCustomerWithGroupsQueryVariables>;
export const AdminTransitionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminTransition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionOrderToState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Order"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"transitionError"}},{"kind":"Field","name":{"kind":"Name","value":"fromState"}},{"kind":"Field","name":{"kind":"Name","value":"toState"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Order"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AdminTransitionMutation, AdminTransitionMutationVariables>;
export const CancelOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CanceledOrder"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CanceledOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<CancelOrderMutation, CancelOrderMutationVariables>;
export const UpdateGlobalSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGlobalSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGlobalSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGlobalSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GlobalSettings"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GlobalSettings"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalSettings"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"availableLanguages"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"outOfStockThreshold"}},{"kind":"Field","name":{"kind":"Name","value":"serverConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderProcess"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permittedAssetTypes"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assignable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customFieldConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGlobalSettingsMutation, UpdateGlobalSettingsMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const GetProductsWithVariantPricesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductsWithVariantPrices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsWithVariantPricesQuery, GetProductsWithVariantPricesQueryVariables>;
export const CreateProductOptionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductOptionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductOptionGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProductOptionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductOptionGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductOptionGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductOptionGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateProductOptionGroupMutation, CreateProductOptionGroupMutationVariables>;
export const AddOptionGroupToProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddOptionGroupToProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOptionGroupToProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithOptions"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<AddOptionGroupToProductMutation, AddOptionGroupToProductMutationVariables>;
export const CreateShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateShippingMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShippingMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<CreateShippingMethodMutation, CreateShippingMethodMutationVariables>;
export const SettlePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SettlePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settlePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SettlePaymentError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentErrorMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<SettlePaymentMutation, SettlePaymentMutationVariables>;
export const GetOrderHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"HistoryEntryListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderHistoryQuery, GetOrderHistoryQueryVariables>;
export const UpdateShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateShippingMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShippingMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateShippingMethodMutation, UpdateShippingMethodMutationVariables>;
export const GetAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}}]} as unknown as DocumentNode<GetAssetQuery, GetAssetQueryVariables>;
export const GetAssetFragmentFirstDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAssetFragmentFirst"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AssetFragFirst"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetFragFirst"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]} as unknown as DocumentNode<GetAssetFragmentFirstQuery, GetAssetFragmentFirstQueryVariables>;
export const CreateAssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAssets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssetInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAssets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AssetWithTagsAndFocalPoint"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MimeTypeError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AssetWithTagsAndFocalPoint"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}},{"kind":"Field","name":{"kind":"Name","value":"focalPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<CreateAssetsMutation, CreateAssetsMutationVariables>;
export const DeleteShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteShippingMethodMutation, DeleteShippingMethodMutationVariables>;
export const AssignPromotionToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignPromotionToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignPromotionsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignPromotionsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AssignPromotionToChannelMutation, AssignPromotionToChannelMutationVariables>;
export const RemovePromotionFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePromotionFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemovePromotionsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePromotionsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<RemovePromotionFromChannelMutation, RemovePromotionFromChannelMutationVariables>;
export const GetTaxRatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxRates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRateListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxRates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxRate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTaxRatesQuery, GetTaxRatesQueryVariables>;
export const GetShippingMethodListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShippingMethodList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingMethod"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShippingMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetShippingMethodListQuery, GetShippingMethodListQueryVariables>;
export const GetCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionsQuery, GetCollectionsQueryVariables>;
export const TransitionPaymentToStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransitionPaymentToState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionPaymentToState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionError"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<TransitionPaymentToStateMutation, TransitionPaymentToStateMutationVariables>;
export const GetProductVariantListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductVariantList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariantListOptions"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetProductVariantListQuery, GetProductVariantListQueryVariables>;
export const DeletePromotionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePromotion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePromotion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeletePromotionMutation, DeletePromotionMutationVariables>;
export const GetChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChannels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]}}]} as unknown as DocumentNode<GetChannelsQuery, GetChannelsQueryVariables>;
export const UpdateAdministratorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdministrator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdministratorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdministrator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Administrator"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Administrator"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Administrator"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAdministratorMutation, UpdateAdministratorMutationVariables>;
export const AssignCollectionsToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignCollectionsToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignCollectionsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignCollectionsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<AssignCollectionsToChannelMutation, AssignCollectionsToChannelMutationVariables>;
export const GetCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantListOptions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Collection"}},{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Collection"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Collection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"filters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<GetCollectionQuery, GetCollectionQueryVariables>;
export const GetFacetWithValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacetWithValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetWithValues"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacetValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FacetWithValues"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Facet"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"isPrivate"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FacetValue"}}]}}]}}]} as unknown as DocumentNode<GetFacetWithValuesQuery, GetFacetWithValuesQueryVariables>;
export const GetPromotionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPromotion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Promotion"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Promotion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"perCustomerUsageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPromotionQuery, GetPromotionQueryVariables>;
export const CancelJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"jobId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"settledAt"}}]}}]}}]} as unknown as DocumentNode<CancelJobMutation, CancelJobMutationVariables>;
export const UpdateOptionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOptionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductOptionGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductOptionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateOptionGroupMutation, UpdateOptionGroupMutationVariables>;
export const GetFulfillmentHandlersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFulfillmentHandlers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fulfillmentHandlers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"ui"}}]}}]}}]}}]} as unknown as DocumentNode<GetFulfillmentHandlersQuery, GetFulfillmentHandlersQueryVariables>;
export const GetOrderWithModificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderWithModifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithModifications"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithModifications"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"orderPlacedQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discountedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"modifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"priceChange"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"promotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderWithModificationsQuery, GetOrderWithModificationsQueryVariables>;
export const ModifyOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ModifyOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ModifyOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modifyOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithModifications"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithModifications"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"orderPlacedQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discountedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"modifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"priceChange"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"promotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ModifyOrderMutation, ModifyOrderMutationVariables>;
export const AddManualPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddManualPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ManualPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addManualPaymentToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithModifications"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithModifications"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"orderPlacedQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discountedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedLinePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"modifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"priceChange"}},{"kind":"Field","name":{"kind":"Name","value":"isSettled"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refund"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"paymentId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"promotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"countryCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"discountedPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AddManualPaymentMutation, AddManualPaymentMutationVariables>;
export const DeletePromotionAdHoc1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePromotionAdHoc1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePromotion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeletePromotionAdHoc1Mutation, DeletePromotionAdHoc1MutationVariables>;
export const GetTaxRateListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxRateList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRateListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxRates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetTaxRateListQuery, GetTaxRateListQueryVariables>;
export const GetOrderWithLineCalculatedPropsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderWithLineCalculatedProps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderWithLineCalculatedPropsQuery, GetOrderWithLineCalculatedPropsQueryVariables>;
export const GetOrderListFulfillmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderListFulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderListFulfillmentsQuery, GetOrderListFulfillmentsQueryVariables>;
export const GetOrderFulfillmentItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderFulfillmentItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Fulfillment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Fulfillment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fulfillment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]} as unknown as DocumentNode<GetOrderFulfillmentItemsQuery, GetOrderFulfillmentItemsQueryVariables>;
export const RefundOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefundOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefundOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refundOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Refund"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Refund"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Refund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<RefundOrderMutation, RefundOrderMutationVariables>;
export const SettleRefundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SettleRefund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SettleRefundInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settleRefund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Refund"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Refund"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Refund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"items"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]} as unknown as DocumentNode<SettleRefundMutation, SettleRefundMutationVariables>;
export const AddNoteToOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddNoteToOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddNoteToOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addNoteToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddNoteToOrderMutation, AddNoteToOrderMutationVariables>;
export const UpdateOrderNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrderNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrderNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOrderNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}}]}}]}}]} as unknown as DocumentNode<UpdateOrderNoteMutation, UpdateOrderNoteMutationVariables>;
export const DeleteOrderNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOrderNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOrderNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteOrderNoteMutation, DeleteOrderNoteMutationVariables>;
export const GetOrderWithPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderWithPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderWithPaymentsQuery, GetOrderWithPaymentsQueryVariables>;
export const GetOrderLineFulfillmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderLineFulfillments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fulfillmentLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fulfillment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderLineFulfillmentsQuery, GetOrderLineFulfillmentsQueryVariables>;
export const GetOrderListWithQtyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderListWithQty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderListWithQtyQuery, GetOrderListWithQtyQueryVariables>;
export const CancelPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionError"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CancelPaymentError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentErrorMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<CancelPaymentMutation, CancelPaymentMutationVariables>;
export const SetOrderCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetOrderCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetOrderCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrderCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<SetOrderCustomerMutation, SetOrderCustomerMutationVariables>;
export const CreatePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePaymentMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handler"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<CreatePaymentMethodMutation, CreatePaymentMethodMutationVariables>;
export const UpdatePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePaymentMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handler"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdatePaymentMethodMutation, UpdatePaymentMethodMutationVariables>;
export const GetPaymentMethodHandlersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethodHandlers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethodHandlers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodHandlersQuery, GetPaymentMethodHandlersQueryVariables>;
export const GetPaymentMethodCheckersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethodCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethodEligibilityCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodCheckersQuery, GetPaymentMethodCheckersQueryVariables>;
export const GetPaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handler"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodQuery, GetPaymentMethodQueryVariables>;
export const GetPaymentMethodListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethodList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethodListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentMethod"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"handler"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodListQuery, GetPaymentMethodListQueryVariables>;
export const DeletePaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeletePaymentMethodMutation, DeletePaymentMethodMutationVariables>;
export const AddManualPayment2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddManualPayment2"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ManualPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addManualPaymentToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OrderWithLines"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingAddress"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderAddress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Payment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Payment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"refunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OrderWithLines"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surcharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalQuantity"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingAddress"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Payment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderLineId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]} as unknown as DocumentNode<AddManualPayment2Mutation, AddManualPayment2MutationVariables>;
export const GetProductOptionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductOptionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productOptionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductOptionGroupQuery, GetProductOptionGroupQueryVariables>;
export const UpdateProductOptionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductOptionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductOptionGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductOptionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductOptionGroup"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductOptionGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductOptionGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateProductOptionGroupMutation, UpdateProductOptionGroupMutationVariables>;
export const CreateProductOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductOptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProductOption"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateProductOptionMutation, CreateProductOptionMutationVariables>;
export const UpdateProductOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductOptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductOption"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}}]}}]}}]} as unknown as DocumentNode<UpdateProductOptionMutation, UpdateProductOptionMutationVariables>;
export const DeleteProductOptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductOption"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProductOption"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteProductOptionMutation, DeleteProductOptionMutationVariables>;
export const RemoveOptionGroupFromProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveOptionGroupFromProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"optionGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeOptionGroupFromProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"optionGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"optionGroupId"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductWithOptions"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductOptionInUseError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"optionGroupCode"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantCount"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductWithOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Product"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"optionGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveOptionGroupFromProductMutation, RemoveOptionGroupFromProductMutationVariables>;
export const GetOptionGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOptionGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productOptionGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetOptionGroupQuery, GetOptionGroupQueryVariables>;
export const GetProductVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetProductVariantQuery, GetProductVariantQueryVariables>;
export const GetProductWithVariantListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductWithVariantList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"variantListOptions"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variantList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"variantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductVariant"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Asset"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Asset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"source"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductVariant"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"trackInventory"}},{"kind":"Field","name":{"kind":"Name","value":"taxRateApplied"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"groupId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Asset"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetProductWithVariantListQuery, GetProductWithVariantListQueryVariables>;
export const GetPromotionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPromotionList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PromotionListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Promotion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Promotion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"perCustomerUsageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetPromotionListQuery, GetPromotionListQueryVariables>;
export const UpdatePromotionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePromotion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePromotionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePromotion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Promotion"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Promotion"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Promotion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"couponCode"}},{"kind":"Field","name":{"kind":"Name","value":"startsAt"}},{"kind":"Field","name":{"kind":"Name","value":"endsAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"perCustomerUsageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"usageLimit"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdatePromotionMutation, UpdatePromotionMutationVariables>;
export const GetAdjustmentOperationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAdjustmentOperations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"promotionActions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperationDef"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promotionConditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigurableOperationDef"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigurableOperationDef"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurableOperationDefinition"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"ui"}}]}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<GetAdjustmentOperationsQuery, GetAdjustmentOperationsQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"RoleListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Role"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Role"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<GetRoleQuery, GetRoleQueryVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const GetShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ShippingMethod"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ShippingMethod"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShippingMethod"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"checker"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetShippingMethodQuery, GetShippingMethodQueryVariables>;
export const GetEligibilityCheckersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEligibilityCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingEligibilityCheckers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"ui"}}]}}]}}]}}]} as unknown as DocumentNode<GetEligibilityCheckersQuery, GetEligibilityCheckersQueryVariables>;
export const GetCalculatorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCalculators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingCalculators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"args"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"ui"}}]}}]}}]}}]} as unknown as DocumentNode<GetCalculatorsQuery, GetCalculatorsQueryVariables>;
export const TestShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TestShippingMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eligible"}},{"kind":"Field","name":{"kind":"Name","value":"quote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]}}]} as unknown as DocumentNode<TestShippingMethodQuery, TestShippingMethodQueryVariables>;
export const TestEligibleMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestEligibleMethods"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TestEligibleShippingMethodsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testEligibleShippingMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<TestEligibleMethodsQuery, TestEligibleMethodsQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetProductsTake3Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductsTake3"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"3"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsTake3Query, GetProductsTake3QueryVariables>;
export const GetProduct1Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProduct1"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_1","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetProduct1Query, GetProduct1QueryVariables>;
export const GetProduct2VariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProduct2Variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_2","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetProduct2VariantsQuery, GetProduct2VariantsQueryVariables>;
export const GetProductCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"T_12","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductCollectionQuery, GetProductCollectionQueryVariables>;
export const GetCollectionShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionShopQuery, GetCollectionShopQueryVariables>;
export const DisableProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisableProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProduct"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"enabled"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DisableProductMutation, DisableProductMutationVariables>;
export const GetCollectionVariantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionVariants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionVariantsQuery, GetCollectionVariantsQueryVariables>;
export const GetCollectionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCollectionList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCollectionListQuery, GetCollectionListQueryVariables>;
export const GetProductFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductFacetValuesQuery, GetProductFacetValuesQueryVariables>;
export const GetVariantFacetValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVariantFacetValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facetValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVariantFacetValuesQuery, GetVariantFacetValuesQueryVariables>;
export const GetCustomerIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerIds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerIdsQuery, GetCustomerIdsQueryVariables>;
export const GetStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockLocation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockLocation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<GetStockLocationQuery, GetStockLocationQueryVariables>;
export const GetStockLocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStockLocations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocationListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockLocation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockLocation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<GetStockLocationsQuery, GetStockLocationsQueryVariables>;
export const CreateStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStockLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockLocation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockLocation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<CreateStockLocationMutation, CreateStockLocationMutationVariables>;
export const UpdateStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStockLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StockLocation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StockLocation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<UpdateStockLocationMutation, UpdateStockLocationMutationVariables>;
export const GetVariantStockLevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVariantStockLevels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariantListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockLocationId"}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVariantStockLevelsQuery, GetVariantStockLevelsQueryVariables>;
export const UpdateStockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductVariantInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"VariantWithStock"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"VariantWithStock"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductVariant"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockMovements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StockMovement"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<UpdateStockMutation, UpdateStockMutationVariables>;
export const TransitionFulfillmentToStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransitionFulfillmentToState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionFulfillmentToState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Fulfillment"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"nextStates"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FulfillmentStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionError"}}]}}]}}]}}]} as unknown as DocumentNode<TransitionFulfillmentToStateMutation, TransitionFulfillmentToStateMutationVariables>;
export const UpdateOrderCustomFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOrderCustomFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrderCustomFields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrderCustomFieldsMutation, UpdateOrderCustomFieldsMutationVariables>;
export const TestGetStockLocationsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestGetStockLocationsList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"StockLocationListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockLocations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<TestGetStockLocationsListQuery, TestGetStockLocationsListQueryVariables>;
export const TestGetStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestGetStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<TestGetStockLocationQuery, TestGetStockLocationQueryVariables>;
export const TestCreateStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestCreateStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStockLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<TestCreateStockLocationMutation, TestCreateStockLocationMutationVariables>;
export const TestUpdateStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestUpdateStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStockLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<TestUpdateStockLocationMutation, TestUpdateStockLocationMutationVariables>;
export const TestDeleteStockLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestDeleteStockLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteStockLocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStockLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<TestDeleteStockLocationMutation, TestDeleteStockLocationMutationVariables>;
export const TestGetStockLevelsForVariantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TestGetStockLevelsForVariant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockLocationId"}}]}}]}}]}}]} as unknown as DocumentNode<TestGetStockLevelsForVariantQuery, TestGetStockLevelsForVariantQueryVariables>;
export const TestSetStockLevelInLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestSetStockLevelInLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductVariantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProductVariants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"input"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stockOnHand"}},{"kind":"Field","name":{"kind":"Name","value":"stockAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"stockLocationId"}}]}}]}}]}}]} as unknown as DocumentNode<TestSetStockLevelInLocationMutation, TestSetStockLevelInLocationMutationVariables>;
export const TestAssignStockLocationToChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestAssignStockLocationToChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignStockLocationsToChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignStockLocationsToChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TestAssignStockLocationToChannelMutation, TestAssignStockLocationToChannelMutationVariables>;
export const TestRemoveStockLocationsFromChannelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TestRemoveStockLocationsFromChannel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveStockLocationsFromChannelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeStockLocationsFromChannel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TestRemoveStockLocationsFromChannelMutation, TestRemoveStockLocationsFromChannelMutationVariables>;
export const GetTagListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTagList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TagListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetTagListQuery, GetTagListQueryVariables>;
export const GetTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetTagQuery, GetTagQueryVariables>;
export const CreateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<CreateTagMutation, CreateTagMutationVariables>;
export const UpdateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<UpdateTagMutation, UpdateTagMutationVariables>;
export const DeleteTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<DeleteTagMutation, DeleteTagMutationVariables>;
export const GetTaxCategoryListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxCategoryList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]}}]} as unknown as DocumentNode<GetTaxCategoryListQuery, GetTaxCategoryListQueryVariables>;
export const GetTaxCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<GetTaxCategoryQuery, GetTaxCategoryQueryVariables>;
export const CreateTaxCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTaxCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaxCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTaxCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<CreateTaxCategoryMutation, CreateTaxCategoryMutationVariables>;
export const UpdateTaxCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTaxCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTaxCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTaxCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<UpdateTaxCategoryMutation, UpdateTaxCategoryMutationVariables>;
export const DeleteTaxCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTaxCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTaxCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteTaxCategoryMutation, DeleteTaxCategoryMutationVariables>;
export const GetTaxRateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTaxRate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxRate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxRate"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxRate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTaxRateQuery, GetTaxRateQueryVariables>;
export const CreateTaxRateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTaxRate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTaxRateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTaxRate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaxRate"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaxRate"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TaxRate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"zone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customerGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateTaxRateMutation, CreateTaxRateMutationVariables>;
export const DeleteTaxRateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTaxRate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTaxRate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteTaxRateMutation, DeleteTaxRateMutationVariables>;
export const DeleteZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteZoneMutation, DeleteZoneMutationVariables>;
export const GetZonesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetZones"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ZoneListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zones"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetZonesQuery, GetZonesQueryVariables>;
export const GetZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"zone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Zone"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}}]} as unknown as DocumentNode<GetZoneQuery, GetZoneQueryVariables>;
export const GetActiveChannelWithZoneMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveChannelWithZoneMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeChannel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"defaultShippingZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveChannelWithZoneMembersQuery, GetActiveChannelWithZoneMembersQueryVariables>;
export const CreateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateZoneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Zone"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}}]} as unknown as DocumentNode<CreateZoneMutation, CreateZoneMutationVariables>;
export const UpdateZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateZoneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Zone"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}}]} as unknown as DocumentNode<UpdateZoneMutation, UpdateZoneMutationVariables>;
export const AddMembersToZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMembersToZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zoneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMembersToZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"zoneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zoneId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Zone"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}}]} as unknown as DocumentNode<AddMembersToZoneMutation, AddMembersToZoneMutationVariables>;
export const RemoveMembersFromZoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveMembersFromZone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"zoneId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeMembersFromZone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"zoneId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"zoneId"}}},{"kind":"Argument","name":{"kind":"Name","value":"memberIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Zone"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Country"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Region"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Zone"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Zone"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Country"}}]}}]}}]} as unknown as DocumentNode<RemoveMembersFromZoneMutation, RemoveMembersFromZoneMutationVariables>;