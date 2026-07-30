import {
  cn,
  Routes,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useServer,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Puzzle } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router';

import { canAccessAdminItem, useAdminAccess } from '@/access/index.js';

import { AccountMenu } from './AccountMenu.js';

type NavigationFooterProps = {
  isCollapsed: boolean;
  mode: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export const NavigationFooter = ({ isCollapsed, mode, onNavigate }: NavigationFooterProps) => {
  const { t } = useTranslation('common');
  const userPermissions = useServer((state) => state.userPermissions);
  const { routes } = useAdminAccess();
  const extensionsRoute = routes.find((route) => route.id === 'extensions');
  const canAccessExtensions = !!extensionsRoute && canAccessAdminItem({ item: extensionsRoute, userPermissions });
  const extensionsPath = extensionsRoute?.path || Routes.extensions;
  const version = window.__DEENRUV_SETTINGS__.appVersion;
  const extensionsLink = (
    <NavLink
      to={extensionsPath}
      viewTransition
      onClick={onNavigate}
      aria-label={t('menu.extensions')}
      className="sidebar-link group/sidebar-link"
    >
      {({ isActive }) => (
        <span
          className={cn(
            isCollapsed
              ? 'mx-auto flex size-8 items-center justify-center rounded-[4px] text-[var(--sidebar-secondary)] transition-colors hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-ink)]'
              : 'sidebar-row mx-2',
            'group-focus-visible/sidebar-link:ring-2 group-focus-visible/sidebar-link:ring-[var(--sidebar-focus)] group-focus-visible/sidebar-link:outline-none',
            isCollapsed &&
              isActive &&
              'bg-[var(--sidebar-active)] text-[var(--sidebar-active-ink)] shadow-[inset_2px_0_0_var(--sidebar-active-indicator)]',
          )}
          data-active={!isCollapsed && isActive}
        >
          {isCollapsed ? (
            <Puzzle className="size-4" />
          ) : (
            <span className="sidebar-icon-slot">
              <Puzzle className="size-4" />
            </span>
          )}
          {!isCollapsed && <span className="truncate">{t('menu.extensions')}</span>}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className="shrink-0 border-t border-[var(--sidebar-hairline)] bg-[var(--sidebar-surface)] py-2 text-xs text-[var(--sidebar-secondary)]">
      {canAccessExtensions && (
        <>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-8 items-center justify-center">{extensionsLink}</div>
              </TooltipTrigger>
              <TooltipContent side="right">{t('menu.extensions')}</TooltipContent>
            </Tooltip>
          ) : (
            extensionsLink
          )}
          <Separator className="my-2 bg-[var(--sidebar-hairline)]" />
        </>
      )}
      {isCollapsed ? (
        <div className="flex justify-center">
          <AccountMenu isCollapsed mode={mode} onNavigate={onNavigate} />
        </div>
      ) : (
        <AccountMenu isCollapsed={false} mode={mode} onNavigate={onNavigate} />
      )}
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="mx-auto mt-2 max-w-10 truncate px-1 text-center text-[10px] text-[var(--sidebar-tertiary)]">
              v {version}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t('versionAbbreviation')} {version}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="mt-2 flex h-8 items-center gap-1 px-4 text-xs text-[var(--sidebar-tertiary)]">
          <span>Deenruv</span>
          <span>
            {t('versionAbbreviation')} {version}
          </span>
        </div>
      )}
    </div>
  );
};
