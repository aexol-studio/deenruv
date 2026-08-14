/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AdjustmentType =
  | 'DISTRIBUTED_ORDER_PROMOTION'
  | 'OTHER'
  | 'PROMOTION';

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: boolean | null | undefined;
  isNull?: boolean | null | undefined;
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

export type CreateCustomerInput = {
  customFields?: unknown;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
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

export type ErrorCode =
  | 'ALREADY_LOGGED_IN_ERROR'
  | 'COUPON_CODE_EXPIRED_ERROR'
  | 'COUPON_CODE_INVALID_ERROR'
  | 'COUPON_CODE_LIMIT_ERROR'
  | 'EMAIL_ADDRESS_CONFLICT_ERROR'
  | 'GUEST_CHECKOUT_ERROR'
  | 'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR'
  | 'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR'
  | 'INELIGIBLE_PAYMENT_METHOD_ERROR'
  | 'INELIGIBLE_SHIPPING_METHOD_ERROR'
  | 'INSUFFICIENT_STOCK_ERROR'
  | 'INVALID_CREDENTIALS_ERROR'
  | 'MISSING_PASSWORD_ERROR'
  | 'NATIVE_AUTH_STRATEGY_ERROR'
  | 'NEGATIVE_QUANTITY_ERROR'
  | 'NOT_VERIFIED_ERROR'
  | 'NO_ACTIVE_ORDER_ERROR'
  | 'ORDER_LIMIT_ERROR'
  | 'ORDER_MIDDLEWARE_ERROR'
  | 'ORDER_MODIFICATION_ERROR'
  | 'ORDER_PAYMENT_STATE_ERROR'
  | 'ORDER_STATE_TRANSITION_ERROR'
  | 'PASSWORD_ALREADY_SET_ERROR'
  | 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR'
  | 'PASSWORD_RESET_TOKEN_INVALID_ERROR'
  | 'PASSWORD_VALIDATION_ERROR'
  | 'PAYMENT_DECLINED_ERROR'
  | 'PAYMENT_FAILED_ERROR'
  | 'UNKNOWN_ERROR'
  | 'VERIFICATION_TOKEN_EXPIRED_ERROR'
  | 'VERIFICATION_TOKEN_INVALID_ERROR';

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

export type LogicalOperator =
  | 'AND'
  | 'OR';

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
  code?: StringOperators | null | undefined;
  createdAt?: DateOperators | null | undefined;
  currencyCode?: StringOperators | null | undefined;
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
  type?: StringOperators | null | undefined;
  updatedAt?: DateOperators | null | undefined;
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
  code?: SortOrder | null | undefined;
  createdAt?: SortOrder | null | undefined;
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
  updatedAt?: SortOrder | null | undefined;
};

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
  /**
   * This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
   * as the "metadata" argument. For example, it could contain an ID for the payment and other
   * data generated by the payment provider.
   */
  metadata: unknown;
  /** This field should correspond to the `code` property of a PaymentMethod. */
  method: string;
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

export type RegisterCustomerInput = {
  emailAddress: string;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  password?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
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

export type SortOrder =
  | 'ASC'
  | 'DESC';

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

export type UpdateCustomerInput = {
  customFields?: unknown;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  title?: string | null | undefined;
};

export type TestOrderFragmentFragment = { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } };

export type UpdatedOrderFragment = { id: string, code: string, state: string, active: boolean, total: number, totalWithTax: number, currencyCode: CurrencyCode, lines: Array<{ id: string, quantity: number, unitPrice: number, unitPriceWithTax: number, linePrice: number, linePriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> };

export type AddItemToOrderMutationVariables = Exact<{
  productVariantId: string | number;
  quantity: number;
}>;


export type AddItemToOrderMutation = { addItemToOrder:
    | { errorCode: ErrorCode, message: string, quantityAvailable: number, order: { id: string, code: string, state: string, active: boolean, total: number, totalWithTax: number, currencyCode: CurrencyCode, lines: Array<{ id: string, quantity: number, unitPrice: number, unitPriceWithTax: number, linePrice: number, linePriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> } }
    | { errorCode: ErrorCode, message: string }
    | { id: string, code: string, state: string, active: boolean, total: number, totalWithTax: number, currencyCode: CurrencyCode, lines: Array<{ id: string, quantity: number, unitPrice: number, unitPriceWithTax: number, linePrice: number, linePriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type SearchProductsShopQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsShopQuery = { search: { totalItems: number, items: Array<{ productId: string, productName: string, productVariantId: string, productVariantName: string, sku: string, collectionIds: Array<string>, price:
        | { min: number, max: number }
        | { value: number }
       }> } };

export type RegisterMutationVariables = Exact<{
  input: RegisterCustomerInput;
}>;


export type RegisterMutation = { registerCustomerAccount:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, validationErrorMessage: string }
    | { success: boolean }
   };

export type CurrentUserShopFragment = { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> };

export type VerifyMutationVariables = Exact<{
  password?: string | null | undefined;
  token: string;
}>;


export type VerifyMutation = { verifyCustomerAccount:
    | { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, validationErrorMessage: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type RefreshTokenMutationVariables = Exact<{
  emailAddress: string;
}>;


export type RefreshTokenMutation = { refreshCustomerVerification:
    | { errorCode: ErrorCode, message: string }
    | { success: boolean }
   };

export type RequestPasswordResetMutationVariables = Exact<{
  identifier: string;
}>;


export type RequestPasswordResetMutation = { requestPasswordReset:
    | { errorCode: ErrorCode, message: string }
    | { success: boolean }
   | null };

export type ResetPasswordMutationVariables = Exact<{
  token: string;
  password: string;
}>;


export type ResetPasswordMutation = { resetPassword:
    | { id: string, identifier: string, channels: Array<{ code: string, token: string, permissions: Array<Permission> }> }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, validationErrorMessage: string }
   };

export type RequestUpdateEmailAddressMutationVariables = Exact<{
  password: string;
  newEmailAddress: string;
}>;


export type RequestUpdateEmailAddressMutation = { requestUpdateCustomerEmailAddress:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { success: boolean }
   };

export type UpdateEmailAddressMutationVariables = Exact<{
  token: string;
}>;


export type UpdateEmailAddressMutation = { updateCustomerEmailAddress:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { success: boolean }
   };

export type GetActiveCustomerQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveCustomerQuery = { activeCustomer: { id: string, emailAddress: string } | null };

export type CreateAddressShopMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type CreateAddressShopMutation = { createCustomerAddress: { id: string, streetLine1: string, country: { code: string } } };

export type UpdateAddressShopMutationVariables = Exact<{
  input: UpdateAddressInput;
}>;


export type UpdateAddressShopMutation = { updateCustomerAddress: { streetLine1: string, country: { code: string } } };

export type DeleteAddressShopMutationVariables = Exact<{
  id: string | number;
}>;


export type DeleteAddressShopMutation = { deleteCustomerAddress: { success: boolean } };

export type UpdateCustomerMutationVariables = Exact<{
  input: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { updateCustomer: { id: string, firstName: string, lastName: string } };

export type UpdatePasswordMutationVariables = Exact<{
  old: string;
  new: string;
}>;


export type UpdatePasswordMutation = { updateCustomerPassword:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { success: boolean }
   };

export type GetActiveOrderQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderQuery = { activeOrder: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type GetActiveOrderWithPriceDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderWithPriceDataQuery = { activeOrder: { id: string, subTotal: number, subTotalWithTax: number, total: number, totalWithTax: number, lines: Array<{ id: string, unitPrice: number, unitPriceWithTax: number, taxRate: number, linePrice: number, lineTax: number, linePriceWithTax: number, taxLines: Array<{ taxRate: number, description: string }> }>, taxSummary: Array<{ description: string, taxRate: number, taxBase: number, taxTotal: number }> } | null };

export type AdjustItemQuantityMutationVariables = Exact<{
  orderLineId: string | number;
  quantity: number;
}>;


export type AdjustItemQuantityMutation = { adjustOrderLine:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type RemoveItemFromOrderMutationVariables = Exact<{
  orderLineId: string | number;
}>;


export type RemoveItemFromOrderMutation = { removeOrderLine:
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type GetShippingMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodsQuery = { eligibleShippingMethods: Array<{ id: string, code: string, price: number, name: string, description: string }> };

export type SetShippingMethodMutationVariables = Exact<{
  id: Array<string | number> | string | number;
}>;


export type SetShippingMethodMutation = { setOrderShippingMethod:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
   };

export type ActiveOrderCustomerFragment = { id: string, customer: { id: string, emailAddress: string, firstName: string, lastName: string } | null, lines: Array<{ id: string }> };

export type SetCustomerForOrderMutationVariables = Exact<{
  input: CreateCustomerInput;
}>;


export type SetCustomerForOrderMutation = { setCustomerForOrder:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, errorDetail: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, customer: { id: string, emailAddress: string, firstName: string, lastName: string } | null, lines: Array<{ id: string }> }
   };

export type GetOrderByCodeQueryVariables = Exact<{
  code: string;
}>;


export type GetOrderByCodeQuery = { orderByCode: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type GetOrderShopQueryVariables = Exact<{
  id: string | number;
}>;


export type GetOrderShopQuery = { order: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type GetOrderPromotionsByCodeQueryVariables = Exact<{
  code: string;
}>;


export type GetOrderPromotionsByCodeQuery = { orderByCode: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, promotions: Array<{ id: string, name: string }>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type GetAvailableCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableCountriesQuery = { availableCountries: Array<{ id: string, code: string }> };

export type TransitionToStateMutationVariables = Exact<{
  state: string;
}>;


export type TransitionToStateMutation = { transitionOrderToState:
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string, transitionError: string, fromState: string, toState: string }
   | null };

export type SetShippingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type SetShippingAddressMutation = { setOrderShippingAddress:
    | { errorCode: ErrorCode, message: string }
    | { shippingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null }
   };

export type SetBillingAddressMutationVariables = Exact<{
  input: CreateAddressInput;
}>;


export type SetBillingAddressMutation = { setOrderBillingAddress:
    | { errorCode: ErrorCode, message: string }
    | { billingAddress: { fullName: string | null, company: string | null, streetLine1: string | null, streetLine2: string | null, city: string | null, province: string | null, postalCode: string | null, country: string | null, phoneNumber: string | null } | null }
   };

export type TestOrderWithPaymentsFragment = { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, payments: Array<{ id: string, transactionId: string | null, method: string, amount: number, state: string, metadata: unknown }> | null, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } };

export type GetActiveOrderWithPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderWithPaymentsQuery = { activeOrder: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, payments: Array<{ id: string, transactionId: string | null, method: string, amount: number, state: string, metadata: unknown }> | null, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type AddPaymentToOrderMutationVariables = Exact<{
  input: PaymentInput;
}>;


export type AddPaymentToOrderMutation = { addPaymentToOrder:
    | { errorCode: ErrorCode, message: string, eligibilityCheckerMessage: string | null }
    | { errorCode: ErrorCode, message: string }
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, payments: Array<{ id: string, transactionId: string | null, method: string, amount: number, state: string, metadata: unknown }> | null, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string, transitionError: string }
    | { errorCode: ErrorCode, message: string, paymentErrorMessage: string }
    | { errorCode: ErrorCode, message: string, paymentErrorMessage: string }
   };

export type GetActiveOrderPaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveOrderPaymentsQuery = { activeOrder: { id: string, payments: Array<{ id: string, transactionId: string | null, method: string, amount: number, state: string, errorMessage: string | null, metadata: unknown }> | null } | null };

export type GetOrderByCodeWithPaymentsQueryVariables = Exact<{
  code: string;
}>;


export type GetOrderByCodeWithPaymentsQuery = { orderByCode: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, payments: Array<{ id: string, transactionId: string | null, method: string, amount: number, state: string, metadata: unknown }> | null, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type GetActiveCustomerOrderWithItemFulfillmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveCustomerOrderWithItemFulfillmentsQuery = { activeCustomer: { orders: { totalItems: number, items: Array<{ id: string, code: string, state: string, lines: Array<{ id: string }>, fulfillments: Array<{ id: string, state: string, method: string, trackingCode: string | null }> | null }> } } | null };

export type GetNextOrderStatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNextOrderStatesQuery = { nextOrderStates: Array<string> };

export type GetCustomerAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerAddressesQuery = { activeOrder: { customer: { addresses: Array<{ id: string, streetLine1: string }> | null } | null } | null };

export type GetCustomerOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCustomerOrdersQuery = { activeOrder: { customer: { orders: { items: Array<{ id: string }> } } | null } | null };

export type GetActiveCustomerOrdersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveCustomerOrdersQuery = { activeCustomer: { id: string, orders: { totalItems: number, items: Array<{ id: string, state: string }> } } | null };

export type ApplyCouponCodeMutationVariables = Exact<{
  couponCode: string;
}>;


export type ApplyCouponCodeMutation = { applyCouponCode:
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
   };

export type RemoveCouponCodeMutationVariables = Exact<{
  couponCode: string;
}>;


export type RemoveCouponCodeMutation = { removeCouponCode: { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } } | null };

export type RemoveAllOrderLinesMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveAllOrderLinesMutation = { removeAllOrderLines:
    | { id: string, code: string, state: string, active: boolean, subTotal: number, subTotalWithTax: number, shipping: number, shippingWithTax: number, total: number, totalWithTax: number, currencyCode: CurrencyCode, couponCodes: Array<string>, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }>, lines: Array<{ id: string, quantity: number, linePrice: number, linePriceWithTax: number, unitPrice: number, unitPriceWithTax: number, unitPriceChangeSinceAdded: number, unitPriceWithTaxChangeSinceAdded: number, discountedUnitPriceWithTax: number, proratedUnitPriceWithTax: number, productVariant: { id: string }, discounts: Array<{ adjustmentSource: string, amount: number, amountWithTax: number, description: string, type: AdjustmentType }> }>, shippingLines: Array<{ priceWithTax: number, shippingMethod: { id: string, code: string, description: string } }>, customer: { id: string, user: { id: string, identifier: string } | null } | null, history: { items: Array<{ id: string, type: HistoryEntryType, data: unknown }> } }
    | { errorCode: ErrorCode, message: string }
    | { errorCode: ErrorCode, message: string }
   };

export type GetEligiblePaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEligiblePaymentMethodsQuery = { eligiblePaymentMethods: Array<{ id: string, code: string, eligibilityMessage: string | null, isEligible: boolean }> };

export type GetProductStockLevelQueryVariables = Exact<{
  id: string | number;
}>;


export type GetProductStockLevelQuery = { product: { id: string, variants: Array<{ id: string, stockLevel: string }> } | null };

export type GetActiveCustomerWithOrdersProductSlugQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type GetActiveCustomerWithOrdersProductSlugQuery = { activeCustomer: { orders: { items: Array<{ lines: Array<{ productVariant: { product: { slug: string } } }> }> } } | null };

export type GetActiveCustomerWithOrdersProductPriceQueryVariables = Exact<{
  options?: OrderListOptions | null | undefined;
}>;


export type GetActiveCustomerWithOrdersProductPriceQuery = { activeCustomer: { orders: { items: Array<{ lines: Array<{ linePrice: number, productVariant: { id: string, name: string, price: number } }> }> } } | null };

export const UpdatedOrderFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdatedOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<UpdatedOrderFragment, unknown>;
export const CurrentUserShopFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUserShop"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<CurrentUserShopFragment, unknown>;
export const ActiveOrderCustomerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActiveOrderCustomer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ActiveOrderCustomerFragment, unknown>;
export const TestOrderFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<TestOrderFragmentFragment, unknown>;
export const TestOrderWithPaymentsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderWithPayments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<TestOrderWithPaymentsFragment, unknown>;
export const AddItemToOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddItemToOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productVariantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addItemToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"productVariantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productVariantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdatedOrder"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsufficientStockError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quantityAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdatedOrder"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdatedOrder"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<AddItemToOrderMutation, AddItemToOrderMutationVariables>;
export const SearchProductsShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProductsShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantName"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"collectionIds"}},{"kind":"Field","name":{"kind":"Name","value":"price"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SinglePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PriceRange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SearchProductsShopQuery, SearchProductsShopQueryVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerCustomerAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validationErrorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const VerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Verify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyCustomerAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentUserShop"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validationErrorMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUserShop"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<VerifyMutation, VerifyMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshCustomerVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emailAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"emailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CurrentUserShop"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PasswordValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validationErrorMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CurrentUserShop"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUser"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"channels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const RequestUpdateEmailAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestUpdateEmailAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newEmailAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestUpdateCustomerEmailAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"newEmailAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newEmailAddress"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<RequestUpdateEmailAddressMutation, RequestUpdateEmailAddressMutationVariables>;
export const UpdateEmailAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmailAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerEmailAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateEmailAddressMutation, UpdateEmailAddressMutationVariables>;
export const GetActiveCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}}]}}]}}]} as unknown as DocumentNode<GetActiveCustomerQuery, GetActiveCustomerQueryVariables>;
export const CreateAddressShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAddressShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAddressShopMutation, CreateAddressShopMutationVariables>;
export const UpdateAddressShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAddressShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAddressShopMutation, UpdateAddressShopMutationVariables>;
export const DeleteAddressShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAddressShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomerAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteAddressShopMutation, DeleteAddressShopMutationVariables>;
export const UpdateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"old"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"new"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomerPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"old"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"new"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Success"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const GetActiveOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveOrderQuery, GetActiveOrderQueryVariables>;
export const GetActiveOrderWithPriceDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveOrderWithPriceData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"lineTax"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"taxLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"taxSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"taxRate"}},{"kind":"Field","name":{"kind":"Name","value":"taxBase"}},{"kind":"Field","name":{"kind":"Name","value":"taxTotal"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveOrderWithPriceDataQuery, GetActiveOrderWithPriceDataQueryVariables>;
export const AdjustItemQuantityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdjustItemQuantity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustOrderLine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderLineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"quantity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quantity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<AdjustItemQuantityMutation, AdjustItemQuantityMutationVariables>;
export const RemoveItemFromOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveItemFromOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeOrderLine"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderLineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveItemFromOrderMutation, RemoveItemFromOrderMutationVariables>;
export const GetShippingMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShippingMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eligibleShippingMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetShippingMethodsQuery, GetShippingMethodsQueryVariables>;
export const SetShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrderShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shippingMethodId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<SetShippingMethodMutation, SetShippingMethodMutationVariables>;
export const SetCustomerForOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetCustomerForOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setCustomerForOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActiveOrderCustomer"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GuestCheckoutError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorDetail"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActiveOrderCustomer"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetCustomerForOrderMutation, SetCustomerForOrderMutationVariables>;
export const GetOrderByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderByCodeQuery, GetOrderByCodeQueryVariables>;
export const GetOrderShopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderShop"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderShopQuery, GetOrderShopQueryVariables>;
export const GetOrderPromotionsByCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderPromotionsByCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"Field","name":{"kind":"Name","value":"promotions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderPromotionsByCodeQuery, GetOrderPromotionsByCodeQueryVariables>;
export const GetAvailableCountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAvailableCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableCountries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<GetAvailableCountriesQuery, GetAvailableCountriesQueryVariables>;
export const TransitionToStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransitionToState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionOrderToState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"transitionError"}},{"kind":"Field","name":{"kind":"Name","value":"fromState"}},{"kind":"Field","name":{"kind":"Name","value":"toState"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<TransitionToStateMutation, TransitionToStateMutationVariables>;
export const SetShippingAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetShippingAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrderShippingAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SetShippingAddressMutation, SetShippingAddressMutationVariables>;
export const SetBillingAddressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetBillingAddress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAddressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrderBillingAddress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"company"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine2"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"province"}},{"kind":"Field","name":{"kind":"Name","value":"postalCode"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<SetBillingAddressMutation, SetBillingAddressMutationVariables>;
export const GetActiveOrderWithPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveOrderWithPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderWithPayments"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderWithPayments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetActiveOrderWithPaymentsQuery, GetActiveOrderWithPaymentsQueryVariables>;
export const AddPaymentToOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddPaymentToOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPaymentToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderWithPayments"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentDeclinedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentErrorMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentFailedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentErrorMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OrderStateTransitionError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transitionError"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IneligiblePaymentMethodError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eligibilityCheckerMessage"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderWithPayments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<AddPaymentToOrderMutation, AddPaymentToOrderMutationVariables>;
export const GetActiveOrderPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveOrderPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveOrderPaymentsQuery, GetActiveOrderPaymentsQueryVariables>;
export const GetOrderByCodeWithPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderByCodeWithPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderByCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderWithPayments"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderWithPayments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transactionId"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<GetOrderByCodeWithPaymentsQuery, GetOrderByCodeWithPaymentsQueryVariables>;
export const GetActiveCustomerOrderWithItemFulfillmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCustomerOrderWithItemFulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"skip"},"value":{"kind":"IntValue","value":"0"}},{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"5"}},{"kind":"ObjectField","name":{"kind":"Name","value":"sort"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"createdAt"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fulfillments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"trackingCode"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveCustomerOrderWithItemFulfillmentsQuery, GetActiveCustomerOrderWithItemFulfillmentsQueryVariables>;
export const GetNextOrderStatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNextOrderStates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextOrderStates"}}]}}]} as unknown as DocumentNode<GetNextOrderStatesQuery, GetNextOrderStatesQueryVariables>;
export const GetCustomerAddressesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerAddresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"streetLine1"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerAddressesQuery, GetCustomerAddressesQueryVariables>;
export const GetCustomerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeOrder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomerOrdersQuery, GetCustomerOrdersQueryVariables>;
export const GetActiveCustomerOrdersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCustomerOrders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveCustomerOrdersQuery, GetActiveCustomerOrdersQueryVariables>;
export const ApplyCouponCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyCouponCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyCouponCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"couponCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<ApplyCouponCodeMutation, ApplyCouponCodeMutationVariables>;
export const RemoveCouponCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCouponCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCouponCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"couponCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"couponCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveCouponCodeMutation, RemoveCouponCodeMutationVariables>;
export const RemoveAllOrderLinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAllOrderLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAllOrderLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestOrderFragment"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ErrorResult"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestOrderFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"subTotal"}},{"kind":"Field","name":{"kind":"Name","value":"subTotalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shipping"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"couponCodes"}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"linePriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"unitPriceWithTaxChangeSinceAdded"}},{"kind":"Field","name":{"kind":"Name","value":"discountedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"proratedUnitPriceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adjustmentSource"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shippingLines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"shippingMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveAllOrderLinesMutation, RemoveAllOrderLinesMutationVariables>;
export const GetEligiblePaymentMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEligiblePaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"eligiblePaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"eligibilityMessage"}},{"kind":"Field","name":{"kind":"Name","value":"isEligible"}}]}}]}}]} as unknown as DocumentNode<GetEligiblePaymentMethodsQuery, GetEligiblePaymentMethodsQueryVariables>;
export const GetProductStockLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductStockLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stockLevel"}}]}}]}}]}}]} as unknown as DocumentNode<GetProductStockLevelQuery, GetProductStockLevelQueryVariables>;
export const GetActiveCustomerWithOrdersProductSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCustomerWithOrdersProductSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveCustomerWithOrdersProductSlugQuery, GetActiveCustomerWithOrdersProductSlugQueryVariables>;
export const GetActiveCustomerWithOrdersProductPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActiveCustomerWithOrdersProductPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeCustomer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linePrice"}},{"kind":"Field","name":{"kind":"Name","value":"productVariant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetActiveCustomerWithOrdersProductPriceQuery, GetActiveCustomerWithOrdersProductPriceQueryVariables>;