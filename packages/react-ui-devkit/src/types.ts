import type { FC, SVGProps } from 'react';

export type PluginPage = {
    path: string;
    element: React.ReactNode;
};

export type Widget = {
    id: string | number;
    name: string;
    component: JSX.Element;
    visible: boolean;
    size: { width: number; height: number };
    sizes: { width: number; height: number }[];
};

export type DeenruvUIPlugin = {
    name: string;
    version: string;
    inputs?: PluginComponent[];
    components?: PluginComponent[];
    widgets?: Widget[];
    navMenuGroups?: Array<PluginNavigationGroup>;
    navMenuLinks?: Array<PluginNavigationLink>;
    pages?: Array<PluginPage>;
    translations?: {
        ns: string;
        data: Record<string, object[]>;
    };
};

type PluginComponent = {
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
