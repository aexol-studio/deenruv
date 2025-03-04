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
} from '../selectors';
import type { FromSelectorWithScalars, LanguageCode, OrderType } from '@deenruv/admin-types';
import { GenericListContextType } from '@/components/templates/DetailList/useDetailList/types';
import { FacetValueSelector } from '@/selectors/FacetValueSelector';
import { CustomerDetailSelector } from '@/selectors/CustomerDetailSelector';
import { globalSettingsSelector } from '@/selectors/GlobalSettingsSelector.js';

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

type CustomLocations = 'orders-summary';
type NotAvailablePages = 'dashboard';
type RouteKeys = keyof Omit<typeof Routes, NotAvailablePages>;
export type ListLocationID = `${RouteKeys}-list-view`;
export type DetailLocationID = `${RouteKeys}-detail-view` | CustomLocations;
export type DetailLocationSidebarID = `${DetailLocationID}-sidebar`;

export const ListLocations = {
    'products-list-view': {
        type: 'Product' as const,
        selector: ProductListSelector,
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
type LocationKeys = keyof ListLocationType;

type ListLocationsType<KEY extends keyof typeof ListLocations> = FromSelectorWithScalars<
    (typeof ListLocations)[KEY]['selector'],
    (typeof ListLocations)[KEY]['type']
>;

export const DetailLocations = {
    'products-detail-view': {
        type: 'Product' as const,
        selector: ProductDetailSelector,
    },
    'promotions-detail-view': {
        type: 'Promotion' as const,
        selector: PromotionDetailSelector,
    },
    'collections-detail-view': {
        type: 'Collection' as const,
        selector: ProductDetailSelector,
    },
    'taxCategories-detail-view': {
        type: 'TaxCategory' as const,
        selector: TaxCategoryDetailSelector,
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
};

export type DetailLocationType = typeof DetailLocations;
export type DetailKeys = keyof DetailLocationType;

type DetailLocationsType<KEY extends keyof typeof DetailLocations> = FromSelectorWithScalars<
    (typeof DetailLocations)[KEY]['selector'],
    (typeof DetailLocations)[KEY]['type']
>;

export type ExternalDetailLocationSelector = {
    [K in DetailKeys]: FromSelectorWithScalars<
        DetailLocationType[K]['selector'],
        DetailLocationType[K]['type']
    >;
};
export type ExternalListLocationSelector = {
    [K in LocationKeys]: FromSelectorWithScalars<
        ListLocationType[K]['selector'],
        ListLocationType[K]['type']
    >;
};

type DeenruvUITable<KEY extends keyof typeof ListLocations> = {
    id: KEY;
    externalSelector?: ExternalListLocationSelector[KEY];
    rowActions?: GenericListContextType<ExternalListLocationSelector[KEY]>['rowActions'];
    bulkActions?: GenericListContextType<ExternalListLocationSelector[KEY]>['bulkActions'];
    columns?: Array<ColumnDef<ListLocationsType<KEY>>>;
};

type DeenruvUIDetailComponent<KEY extends keyof typeof DetailLocations> = {
    /** Used as localization */
    id: KEY;
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
