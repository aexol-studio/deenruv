import React from 'react';
import {
  apiClient,
  type AdminAccessRequirement,
  Button,
  cn,
  createDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  type NavigationAction,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  usePluginStore,
  useServer,
  useSettings,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Permission } from '@deenruv/admin-types';
import { LogOutIcon, RotateCwSquare } from 'lucide-react';
import { useNavigate } from 'react-router';

import { canAccessAdminItem, useAdminAccess } from '@/access/index.js';

type PluginSurfaceEntry = {
  access?: AdminAccessRequirement;
  plugin?: { name: string };
};

type PluginTopNavigationAction = NavigationAction & PluginSurfaceEntry;

const accountMenuItemClass = 'cursor-pointer gap-2 focus:bg-[var(--sidebar-hover)] focus:text-[var(--sidebar-ink)]';
const accountMenuSurfaceClass =
  'border-[var(--sidebar-hairline)] bg-[var(--sidebar-surface)] text-[var(--sidebar-ink)] shadow-sm dark:shadow-none';

export const AccountMenu = ({
  isCollapsed,
  mode,
  onNavigate,
}: {
  isCollapsed: boolean;
  mode: 'desktop' | 'mobile';
  onNavigate?: () => void;
}) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { routes } = useAdminAccess();
  const { topNavigationActionsMenu } = usePluginStore();
  const { logOut } = useSettings();
  const { activeAdministrator, clearAdministratorAccess, setJobQueue, userPermissions } = useServer();
  const administratorName = activeAdministrator
    ? `${activeAdministrator.firstName} ${activeAdministrator.lastName}`.trim()
    : t('account');
  const initials = activeAdministrator
    ? `${activeAdministrator.firstName.charAt(0)}${activeAdministrator.lastName.charAt(0)}`.toUpperCase()
    : '?';
  const reindexEnabled = canAccessAdminItem({
    item: { requiredPermissions: [Permission.UpdateCatalog, Permission.UpdateProduct] },
    userPermissions,
  });
  const allowedActions = (topNavigationActionsMenu as PluginTopNavigationAction[])?.filter((entry) =>
    canAccessAdminItem({ item: entry.access, userPermissions }),
  );
  const fastLinks = [
    { key: 'systemStatus', route: routes.find((route) => route.id === 'system.status') },
    { key: 'globalSettings', route: routes.find((route) => route.id === 'settings.global') },
  ].filter(({ route }) => route && canAccessAdminItem({ item: route, userPermissions })) as Array<{
    key: string;
    route: NonNullable<(typeof routes)[number]>;
  }>;

  const rebuildSearchIndex = async () => {
    const { reindex } = await apiClient('mutation')({ reindex: { id: true, queueName: true, state: true } });
    setJobQueue(reindex.queueName, reindex.state === 'RUNNING');
  };

  const trigger = (
    <Button
      variant="ghost"
      className={
        isCollapsed
          ? 'size-8 rounded-[4px] p-0 text-[var(--sidebar-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-ink)] focus-visible:ring-[var(--sidebar-focus)]'
          : 'sidebar-row mx-2 w-[calc(100%-1rem)] justify-start bg-transparent focus-visible:ring-[var(--sidebar-focus)]'
      }
      aria-label={t('openAccountMenu')}
    >
      <span className="sidebar-icon-slot rounded-[4px] bg-[var(--sidebar-active)] text-[10px] font-medium text-[var(--sidebar-active-ink)]">
        {initials}
      </span>
      {!isCollapsed && (
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium text-[var(--sidebar-ink)]">{administratorName}</span>
          {activeAdministrator?.emailAddress && (
            <span className="block truncate text-xs font-normal text-[var(--sidebar-tertiary)]">
              {activeAdministrator.emailAddress}
            </span>
          )}
        </span>
      )}
    </Button>
  );

  return (
    <DropdownMenu>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{administratorName}</TooltipContent>
        </Tooltip>
      ) : (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        side={mode === 'mobile' ? 'top' : 'right'}
        align={mode === 'mobile' ? 'start' : 'end'}
        sideOffset={6}
        collisionPadding={8}
        className={cn('z-[150] min-w-56', accountMenuSurfaceClass)}
      >
        {activeAdministrator?.emailAddress && (
          <>
            <DropdownMenuLabel>
              <span className="block truncate">{administratorName}</span>
              <span className="block truncate text-xs font-normal text-[var(--sidebar-tertiary)]">
                {activeAdministrator.emailAddress}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--sidebar-hairline)]" />
          </>
        )}
        {reindexEnabled && (
          <DropdownMenuItem className={accountMenuItemClass} onSelect={rebuildSearchIndex}>
            <RotateCwSquare className="size-4" />
            {t('rebuildSerachIndex')}
          </DropdownMenuItem>
        )}
        {fastLinks.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="focus:bg-[var(--sidebar-hover)] focus:text-[var(--sidebar-ink)]">
                {t('fastLinks')}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className={accountMenuSurfaceClass}>
                  {fastLinks.map(({ key, route }) => (
                    <DropdownMenuItem
                      key={key}
                      className={accountMenuItemClass}
                      onSelect={() => {
                        navigate(route.path, { viewTransition: true });
                        onNavigate?.();
                      }}
                    >
                      <RotateCwSquare className="size-4" />
                      {t(key)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        )}
        {allowedActions?.length ? (
          <>
            <DropdownMenuSeparator className="bg-[var(--sidebar-hairline)]" />
            {allowedActions.map((action) => (
              <DropdownMenuItem
                key={action.label}
                className={cn(accountMenuItemClass, action.className)}
                onSelect={() => {
                  action.onClick();
                  onNavigate?.();
                }}
              >
                {action.icon && <action.icon className="size-4" />}
                {action.label}
              </DropdownMenuItem>
            ))}
          </>
        ) : null}
        <DropdownMenuSeparator className="bg-[var(--sidebar-hairline)]" />
        <DropdownMenuItem
          className={cn(accountMenuItemClass, 'text-red-500 focus:text-red-500')}
          onSelect={async () => {
            const confirmed = await createDialog({
              title: t('logOutConfirmation'),
              description: t('logOutConfirmationDescription'),
              buttons: [
                { label: t('cancel'), variant: 'secondary', returnValue: false },
                { label: t('logOut'), variant: 'destructive', returnValue: true },
              ],
            });
            if (confirmed) {
              clearAdministratorAccess();
              logOut();
            }
          }}
        >
          <LogOutIcon className="size-4" />
          {t('logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
