import { Permission } from '@deenruv/admin-types';
import { capitalizeFirstLetter, cn, Routes, Separator, useServer, useTranslation } from '@deenruv/react-ui-devkit';
import { Puzzle } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavigationFooterProps {
  isCollapsed: boolean;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({ isCollapsed }) => {
  const { t } = useTranslation('common');
  const userPermissions = useServer((p) => p.userPermissions);
  const isPermittedToExtensions = userPermissions.includes(Permission.ReadSettings);

  return (
    <div className="bg-secondary flex w-full select-none flex-col gap-2 py-2 text-xs shadow-2xl">
      {isPermittedToExtensions && !isCollapsed && (
        <>
          <div>
            <NavLink to={Routes.extensions} viewTransition>
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-md px-4 capitalize',
                  location.pathname === Routes.extensions &&
                    'bg-muted hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:hover:bg-muted font-semibold opacity-100',
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
      <div className="flex items-center justify-center gap-1">
        {!isCollapsed && <p className="uppercase">Deenruv</p>}
        <span>
          {!isCollapsed ? 'ver. ' : 'v. '}
          {window.__DEENRUV_SETTINGS__.appVersion}
        </span>
      </div>
    </div>
  );
};
