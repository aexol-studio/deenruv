import React from 'react';
import type { AdminAccessRequirement } from '@deenruv/react-ui-devkit';

export type AdminNavigationGroupId =
  | 'shop-group'
  | 'assortment-group'
  | 'users-group'
  | 'promotions-group'
  | 'shipping-group'
  | 'settings-group';

export type AdminSearchType = 'new' | 'list' | 'plugin' | 'default';

export type AdminNavigationGroupDefinition = {
  id: AdminNavigationGroupId;
  labelKey: string;
};

export type AdminRouteDefinition = AdminAccessRequirement & {
  id: string;
  path: string;
  element: React.ReactElement;
  nav?: {
    groupId: AdminNavigationGroupId;
    linkId: string;
    menuKey: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
  };
  search?: {
    menuKey: string;
    type: AdminSearchType;
  };
};
