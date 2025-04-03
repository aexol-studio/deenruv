import type { FC, SVGProps } from 'react';
import { Routes } from '../routes';
import { ColumnDef } from '@tanstack/react-table';
import {
    ProductDetailSelector,
    ProductListSelector,
    PromotionDetailSelector,
    StockLocationDetailSelector,
    StockLocationListSelector,
    TaxCategoryDetailSelector,
    CustomerGroupDetailSelector,
    OrderDetailSelector,
    OrderDetailType,
    TaxRateDetailsSelector,
    SellerDetailSelector,
    CountryDetailSelector,
    ChannelDetailsSelector,
    FacetDetailSelector,
    RoleDetailsSelector,
    PaymentMethodDetailsSelector,
    ShippingMethodDetailsSelector,
    AdminDetailSelector,
    ZoneDetailsSelector,
    OrderListSelector,
    CollectionDetailsSelector,
} from '../selectors';
import type { FromSelectorWithScalars, LanguageCode } from '@deenruv/admin-types';
import { GenericListContextType } from '@/components/templates/DetailList/useDetailListHook/types';
import { FacetValueSelector } from '@/selectors/FacetValueSelector';
import { CustomerDetailSelector } from '@/selectors/CustomerDetailSelector';
import { globalSettingsSelector } from '@/selectors/GlobalSettingsSelector.js';
import { Notification } from '@/state/index.js';

type Logo = string | JSX.Element;
export type DeenruvAdminPanelSettings = {
    api: { uri: string; channelTokenName?: string; authTokenName?: string };
    ui?: {
        defaultChannelCode?: string;
        defaultLanguageCode?: LanguageCode;
        defaultTranslationLanguageCode?: LanguageCode;
        extras?: {
            orderObservableStates?: string[];
        };
    };
    branding: {
        name: string;
        showAppVersion?: boolean;
        loginPage?: { logo?: Logo; showAppName?: boolean; hideFormLogo?: boolean };
        logo?: { full: Logo; collapsed?: Logo };
    };
};

export type DeenruvSettingsWindowType = DeenruvAdminPanelSettings & {
    appVersion: string;
    api: Required<DeenruvAdminPanelSettings['api']>;
    i18n: any;
};

type CustomDetailLocations = 'orders-summary' | string;
type CustomListLocations = string;
type NotAvailablePages = 'dashboard';
type RouteKeys = keyof Omit<typeof Routes, NotAvailablePages>;
export type ListLocationID = `${RouteKeys}-list-view`;
export type DetailLocationID = `${RouteKeys}-detail-view` | CustomDetailLocations;
export type DetailLocationSidebarID = `${DetailLocationID}-sidebar`;

export const ListLocations = {
    'products-list-view': {
        type: 'Product' as const,
        selector: ProductListSelector,
    },
    'orders-list-view': {
        type: 'Order' as const,
        selector: OrderListSelector,
    },
    'facet-values-list': {
        type: 'FacetValue' as const,
        selector: FacetValueSelector,
    },
    'stockLocations-list': {
        type: 'StockLocation' as const,
        selector: StockLocationListSelector,
    },
};
type ListLocationType = typeof ListLocations;
export type LocationKeys = keyof ListLocationType;

type ListLocationsType<KEY extends keyof typeof ListLocations> = FromSelectorWithScalars<
    (typeof ListLocations)[KEY]['selector'],
    (typeof ListLocations)[KEY]['type']
>;

export const DetailLocations = {
    'admins-detail-view': {
        type: 'Administrator' as const,
        selector: AdminDetailSelector,
    },
    'products-detail-view': {
        type: 'Product' as const,
        selector: ProductDetailSelector,
    },
    'paymentMethods-detail-view': {
        type: 'PaymentMethod' as const,
        selector: PaymentMethodDetailsSelector,
    },
    'promotions-detail-view': {
        type: 'Promotion' as const,
        selector: PromotionDetailSelector,
    },
    'channels-detail-view': {
        type: 'Channel' as const,
        selector: ChannelDetailsSelector,
    },
    'collections-detail-view': {
        type: 'Collection' as const,
        selector: CollectionDetailsSelector,
    },
    'countries-detail-view': {
        type: 'Country' as const,
        selector: CountryDetailSelector,
    },
    'facets-detail-view': {
        type: 'Facet' as const,
        selector: FacetDetailSelector,
    },
    'taxCategories-detail-view': {
        type: 'TaxCategory' as const,
        selector: TaxCategoryDetailSelector,
    },
    'taxRates-detail-view': {
        type: 'TaxRate' as const,
        selector: TaxRateDetailsSelector,
    },
    'shippingMethods-detail-view': {
        type: 'ShippingMethod' as const,
        selector: ShippingMethodDetailsSelector,
    },
    'stockLocations-detail-view': {
        type: 'StockLocation' as const,
        selector: StockLocationDetailSelector,
    },
    'customers-detail-view': {
        type: 'Customer' as const,
        selector: CustomerDetailSelector,
    },
    'customerGroups-detail-view': {
        type: 'CustomerGroup' as const,
        selector: CustomerGroupDetailSelector,
    },
    'orders-detail-view': {
        type: 'Order' as const,
        selector: OrderDetailSelector,
    },
    'orders-summary': {
        type: 'Order' as const,
        selector: OrderDetailSelector,
    },
    'globalSettings-detail-view': {
        type: 'GlobalSettings' as const,
        selector: globalSettingsSelector,
    },
    'zones-detail-view': {
        type: 'Zone' as const,
        selector: ZoneDetailsSelector,
    },
    'roles-detail-view': {
        type: 'Role' as const,
        selector: RoleDetailsSelector,
    },
    'sellers-detail-view': {
        type: 'Seller' as const,
        selector: SellerDetailSelector,
    },
};

export type DetailLocationType = typeof DetailLocations;
export type DetailKeys = keyof DetailLocationType;

type DetailLocationsType<KEY extends keyof typeof DetailLocations> = FromSelectorWithScalars<
    (typeof DetailLocations)[KEY]['selector'],
    (typeof DetailLocations)[KEY]['type']
>;

export interface AdditionalDetailLocationSelector {}
export type ExternalDetailLocationSelector = AdditionalDetailLocationSelector & {
    [K in DetailKeys]: FromSelectorWithScalars<
        DetailLocationType[K]['selector'],
        DetailLocationType[K]['type']
    >;
};
export interface AdditionalListLocationSelector {}
export type ExternalListLocationSelector = AdditionalListLocationSelector & {
    [K in LocationKeys]: FromSelectorWithScalars<
        ListLocationType[K]['selector'],
        ListLocationType[K]['type']
    >;
};

export type DeenruvUITable<KEY extends keyof typeof ListLocations> = {
    id: KEY;
    externalSelector?: ExternalListLocationSelector[KEY];
    rowActions?: GenericListContextType<ExternalListLocationSelector[KEY]>['rowActions'];
    bulkActions?: GenericListContextType<ExternalListLocationSelector[KEY]>['bulkActions'];
    columns?: Array<ColumnDef<ListLocationsType<KEY>> & { label?: React.JSX.Element }>;
    hideColumns?: Array<keyof ListLocationsType<KEY>>;
};

type DeenruvUIDetailComponent<KEY extends keyof typeof DetailLocations> = {
    /** Used as localization */
    id: KEY | `${KEY}-sidebar`;
    /** Tab */
    tab?: string;
    /** Detail view component */
    component: React.ComponentType<{ data: DetailLocationsType<KEY> }>;
};

export const ModalLocations = {
    'manual-order-state': {
        type: 'Order' as const,
        selector: OrderDetailSelector,
    },
};

export type ModalLocationsTypes = {
    'manual-order-state': {
        state: string;
        setState: (value: string) => void;
        beforeSubmit: React.MutableRefObject<(() => Promise<void> | undefined) | undefined>;
        order: OrderDetailType;
    };
};

type ModalLocationType<KEY extends keyof typeof ModalLocations> = ModalLocationsTypes[KEY];
type DeenruvUIModalComponent<KEY extends keyof typeof ModalLocations> = {
    /** Used as localization */
    id: KEY;
    /** Modal component */
    component: React.ComponentType<{ data: ModalLocationType<KEY> }>;
};

export type ModalLocationsKeys = keyof typeof ModalLocations;

export type DeenruvTabs<KEY extends keyof typeof DetailLocations> = {
    /** Used as localization */
    id: KEY;
    /** Label used as readable value */
    label: string;
    /** Name used as query param */
    name: string;
    /** Tab component */
    component: React.ReactNode;
    /** Choose if sidebar is hidden */
    hideSidebar?: boolean;
    /** Choose if sidebar is replaced */
    sidebarReplacement?: React.ReactNode;
    /** Choose if tab is disabled */
    disabled?: boolean;
};

export type DeenruvUIPlugin<T extends Record<string, any> = object> = {
    name: string;
    version: string;
    config?: T;
    /** Applied on the selected tables */
    tables?: Array<DeenruvUITable<LocationKeys>>;
    /** Applied on the detail views (pages) */
    tabs?: Array<DeenruvTabs<DetailKeys>>;
    /** Action applied on the detail view (pages) */
    actions?: {
        inline?: Array<DeenruvUIDetailComponent<DetailKeys>>;
        dropdown?: Array<DeenruvUIDetailComponent<DetailKeys>>;
    };
    /** Notifications are used to display messages to the user */
    notifications?: Array<Notification<any>>;
    /** Inputs allow to override the default components from custom fields */
    inputs?: Array<PluginComponent>;
    /** Applied on the detail views (pages) */
    components?: Array<DeenruvUIDetailComponent<DetailKeys>>;
    /** Applied on the modals */
    modals?: Array<DeenruvUIModalComponent<ModalLocationsKeys>>;
    /** Applied on the dashboard */
    widgets?: Array<Widget<T>>;
    /** Applied on the navigation */
    navMenuGroups?: Array<PluginNavigationGroup>;
    /** Applied on the navigation */
    navMenuLinks?: Array<PluginNavigationLink>;
    /** Applied on the app globally */
    pages?: Array<PluginPage>;
    /** Applied on top navigation bar */
    topNavigationComponents?: Array<PluginComponent>;
    /** Applied on top navigation action menu */
    topNavigationActionsMenu?: Array<NavigationAction>;
    /** Applied on the app globally */
    translations?: { ns: string; data: Record<string, Array<object>> };
};

export type NavigationAction = { label: string; icon?: any; className?: string; onClick: () => void };

export type Widget<T extends Record<string, any> = object> = {
    id: string | number;
    name: string;
    component: JSX.Element;
    visible: boolean;
    size: { width: number; height: number };
    sizes: { width: number; height: number }[];
    plugin?: DeenruvUIPlugin<T>;
};

export type PluginPage = {
    path: string;
    element: React.ReactNode;
};

export type PluginComponent = {
    id: string;
    component: React.ComponentType;
};

export enum BASE_GROUP_ID {
    SHOP = 'shop-group',
    SETTINGS = 'settings-group',
    USERS = 'users-group',
    PROMOTIONS = 'promotions-group',
    SHIPPING = 'shipping-group',
}

export type PluginNavigationGroup = {
    id: string;
    labelId: string;
    placement?: { groupId: BASE_GROUP_ID | string };
};

export type PluginNavigationLink = {
    id: string;
    labelId: string;
    href: string;
    groupId: BASE_GROUP_ID | string;
    icon: FC<SVGProps<SVGSVGElement>>;
    placement?: { linkId: string; where?: 'above' | 'under' };
};

export enum PaymentMethod {
    Przelewy24 = 'przelewy24',
    Standard = 'standard-payment',
    Transfer = 'przelew-bankowy',
    OnDelivery = 'gotowka-za-pobraniem',
}

export enum ORDER_STATE {
    CREATED = 'Created',
    DRAFT = 'Draft',
    ADDING_ITEMS = 'AddingItems',
    ARRANGING_PAYMENT = 'ArrangingPayment',
    PAYMENT_AUTHORIZED = 'PaymentAuthorized',
    PAYMENT_SETTLED = 'PaymentSettled',
    PARTIALLY_SHIPPED = 'PartiallyShipped',
    SHIPPED = 'Shipped',
    PARTIALLY_DELIVERED = 'PartiallyDelivered',
    DELIVERED = 'Delivered',
    MODIFYING = 'Modifying',
    ARRANGING_ADDITIONAL_PAYMENT = 'ArrangingAdditionalPayment',
    CANCELLED = 'Cancelled',
    IN_REALIZATION = 'InRealization',
}
