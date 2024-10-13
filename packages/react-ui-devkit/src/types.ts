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
    components?: PluginComponent[];
    widgets?: Widget[];
    navMenuGroups?: Array<PluginNavigationGroup>;
    navMenuLinks?: Array<PluginNavigationLink>;
    pages?: Array<PluginPage>;
};

type PluginComponent = {
    id: string;
    component: React.ComponentType;
};

export type PluginNavigationGroup = {
    id: string;
    label: string;
    placement?: { groupId: string };
};

export type PluginNavigationLink = {
    id: string;
    label: string;
    href: string;
    groupId: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    placement?: { linkId: string; where?: 'above' | 'under' };
};
