import React from 'react';
import { RouteObject } from 'react-router-dom';

export type Routes<PATHS extends string = string> = Array<{
    path: PATHS;
    element: NonNullable<RouteObject['element']>;
}>;
export type DeenruvUIPlugin<PATHS extends string = string> = {
    name: string;
    version: string;
    components?: Component[];
    navigation?: Array<NavigationItem<PATHS>>;
    routes?: Routes<PATHS>;
};

type Component = {
    component: React.ComponentType;
    location: Location;
};

type Location = {
    id: string;
    where?: 'above' | 'below';
};

export type NavigationItem<PATHS extends string = string> = {
    name: string;
    route: PATHS;
    icon?: string;
    location: Location & { groupId: string };
};
