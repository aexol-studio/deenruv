import React, { createContext, useContext } from 'react';
import type { AdminAccessProfile } from '@deenruv/react-ui-devkit';
import type { AdminRouteDefinition } from './types.js';

export type AdminAccessContextValue = {
  profile: AdminAccessProfile;
  routes: AdminRouteDefinition[];
  defaultRoute?: AdminRouteDefinition;
};

const AdminAccessContext = createContext<AdminAccessContextValue | null>(null);

export const AdminAccessProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: AdminAccessContextValue }>) => (
  <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>
);

export const useAdminAccess = () => {
  const context = useContext(AdminAccessContext);
  if (!context) throw new Error('useAdminAccess must be used within AdminAccessProvider');
  return context;
};
