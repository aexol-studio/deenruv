import type { FC, SVGProps } from 'react';
import { Routes } from './routes';
import { ColumnDef } from '@tanstack/react-table';
import { ProductListSelector } from './selectors';
import { FromSelectorWithScalars } from '@deenruv/admin-types';

type NotAvailablePages = 'dashboard';
type RouteKeys = keyof Omit<typeof Routes, NotAvailablePages>;
export type ListLocationID = `${RouteKeys}-list-view`;
export type DetailLocationID = `${RouteKeys}-detail-view`;

const ListLocations = {
    'products-list-view': {
        type: 'Product' as const,
        selector: ProductListSelector,
    },
};
type ListLocationType = typeof ListLocations;
type LocationKeys = keyof ListLocationType;

type ListLocationsType<KEY extends keyof typeof ListLocations> = FromSelectorWithScalars<
    (typeof ListLocations)[KEY]['selector'],
    (typeof ListLocations)[KEY]['type']
>;

const DetailLocations = {
    'products-detail-view': {
        type: 'Product' as const,
        selector: ProductListSelector,
    },
};
type DetailLocationType = typeof DetailLocations;
type DetailKeys = keyof DetailLocationType;

type DetailLocationsType<KEY extends keyof typeof DetailLocations> = FromSelectorWithScalars<
    (typeof DetailLocations)[KEY]['selector'],
    (typeof DetailLocations)[KEY]['type']
>;

type DeenruvUITable<KEY extends keyof typeof ListLocations> = {
    id: KEY;
    bulkActions?: Array<{
        label: string;
        onClick: (props: {
            data: Array<ListLocationsType<KEY>>;
            refetch: () => void;
            table: any;
        }) => { success: string } | { error: string };
    }>;
    columns?: Array<ColumnDef<ListLocationsType<KEY>>>;
};

type DeenruvUIDetailComponent<KEY extends keyof typeof DetailLocations> = {
    id: KEY;
    component: React.ComponentType<{ data: DetailLocationsType<KEY> }>;
};

export type DeenruvUIPlugin = {
    name: string;
    version: string;
    /** Applied on the selected tables */
    tables?: DeenruvUITable<LocationKeys>[];
    /** Inputs allow to override the default components from custom fields */
    inputs?: PluginComponent[];
    /** Applied on the detail views (pages) */
    components?: DeenruvUIDetailComponent<DetailKeys>[];
    /** Applied on the dashboard */
    widgets?: Widget[];
    /** Applied on the navigation */
    navMenuGroups?: Array<PluginNavigationGroup>;
    /** Applied on the navigation */
    navMenuLinks?: Array<PluginNavigationLink>;
    /** Applied on the app globally */
    pages?: Array<PluginPage>;
    /** Applied on the app globally */
    translations?: { ns: string; data: Record<string, object[]> };
};

export type Widget = {
    id: string | number;
    name: string;
    component: JSX.Element;
    visible: boolean;
    size: { width: number; height: number };
    sizes: { width: number; height: number }[];
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
