import type { FC, SVGProps } from 'react';

export type PluginPage = {
    path: string;
    element: React.ReactNode;
};
export type DeenruvUIPlugin = {
    name: string;
    version: string;
    components?: PluginComponent[];
    navMenuGroups?: Array<PluginNavigationGroup>;
    navMenuLinks?: Array<PluginNavigationLink>;
    pages?: Array<PluginPage>;
};

type PluginComponent = {
    component: React.ComponentType;
    elementId: string;
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
