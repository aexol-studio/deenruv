import { capitalizeFirstLetter, cn, Routes, Separator, useServer, useTranslation } from '@deenruv/react-ui-devkit';
import { Puzzle } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router';

import { canAccessAdminItem, useAdminAccess } from '@/access/index.js';

interface NavigationFooterProps {
  isCollapsed: boolean;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({ isCollapsed }) => {
  const { t } = useTranslation('common');
  const userPermissions = useServer((p) => p.userPermissions);
  const { routes } = useAdminAccess();
  const extensionsRoute = routes.find((route) => route.id === 'extensions');
  const isPermittedToExtensions = !!extensionsRoute && canAccessAdminItem({ item: extensionsRoute, userPermissions });
  const extensionsPath = extensionsRoute?.path || Routes.extensions;

  return (
    <div className="flex w-full flex-col gap-2 border-t bg-card/80 py-2 text-xs text-muted-foreground select-none">
      {isPermittedToExtensions && !isCollapsed && (
        <>
          <div>
            <NavLink to={extensionsPath} viewTransition>
              <div
                className={cn(
                  'relative mx-2 flex h-8 items-center justify-center px-3 text-sm font-medium capitalize transition-colors hover:bg-muted/70 hover:text-foreground',
                  location.pathname === extensionsPath &&
                    'bg-primary/10 text-primary opacity-100 hover:bg-primary/10 hover:text-primary',
                )}
              >
                <Puzzle className="mr-2 size-4" />
                {capitalizeFirstLetter(t('menu.extensions'))}
              </div>
            </NavLink>
          </div>
          <Separator />
        </>
      )}
      <div className="flex items-center justify-center gap-1 px-2">
        {!isCollapsed && <p className="uppercase">Deenruv</p>}
        <span>
          {!isCollapsed ? 'ver. ' : 'v. '}
          {window.__DEENRUV_SETTINGS__.appVersion}
        </span>
      </div>
    </div>
  );
};
