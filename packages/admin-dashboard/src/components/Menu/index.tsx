import React, { useMemo, useState } from 'react';

import {
  type AdminAccessRequirement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  TooltipProvider,
  Routes,
  useSettings,
  useServer,
  usePluginStore,
  cn,
  dashToCamelCase,
  apiClient,
  useGlobalSearch,
  useTranslation,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  createDialog,
  buildURL,
  type NavigationAction,
  type PluginComponent,
} from '@deenruv/react-ui-devkit';
import { Permission } from '@deenruv/admin-types';
import { useShallow } from 'zustand/react/shallow';

import {
  GripVertical,
  LogOutIcon,
  MenuIcon,
  Moon,
  Slash,
  Sun,
  SunMoon,
  RotateCwSquare,
  SearchIcon,
} from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { Navigation } from './Navigation.js';
import { NavLink, useMatches, useNavigate } from 'react-router';
import { ChannelSwitcher } from './ChannelSwitcher.js';
import { BrandLogo } from '@/components/BrandLogo.js';
import { LanguagesDropdown } from './LanguagesDropdown.js';
import { Notifications } from './Notifications.js';
import { NavigationFooter } from '@/components/Menu/NavigationFooter.js';
import { canAccessAdminItem, isAccessSurfaceEnabled, useAdminAccess } from '@/access/index.js';

type PluginSurfaceEntry = {
  access?: AdminAccessRequirement;
  plugin?: { name: string };
};

type PluginTopNavigationComponent = PluginComponent & PluginSurfaceEntry;
type PluginTopNavigationAction = NavigationAction & PluginSurfaceEntry;

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Group>) => (
  <ResizablePrimitive.Group
    className={cn('flex h-full w-full data-[orientation=vertical]:flex-col', className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.Separator
    className={cn(
      'relative flex w-px items-center justify-center bg-border/70 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none data-[orientation=vertical]:h-px data-[orientation=vertical]:w-full data-[orientation=vertical]:after:left-0 data-[orientation=vertical]:after:h-1 data-[orientation=vertical]:after:w-full data-[orientation=vertical]:after:translate-x-0 data-[orientation=vertical]:after:-translate-y-1/2 [&[data-orientation=vertical]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center border bg-background text-muted-foreground">
        <GripVertical className="size-2.5" />
      </div>
    )}
  </ResizablePrimitive.Separator>
);

const removableCrumbs = ['draft', 'admin-ui'];

export const Menu: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const openGlobalSearch = useGlobalSearch((state) => state.open);
  const linkPath: string[] = [];
  const { t } = useTranslation('common');
  const { topNavigationActionsMenu, topNavigationComponents } = usePluginStore();
  const { profile, routes, defaultRoute } = useAdminAccess();
  const { logOut, theme, setTheme } = useSettings(
    useShallow((p) => ({
      logOut: p.logOut,
      theme: p.theme,
      setTheme: p.setTheme,
      language: p.language,
      setLanguage: p.setLanguage,
    })),
  );

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { activeAdministrator, setJobQueue, userPermissions } = useServer();

  const defaultRoutePath = defaultRoute?.path || Routes.dashboard;
  const defaultRouteMenuKey = defaultRoute?.nav?.menuKey || defaultRoute?.search?.menuKey || 'dashboard';
  const globalSearchEnabled = isAccessSurfaceEnabled(profile, 'globalSearch');
  const languageSwitcherEnabled = isAccessSurfaceEnabled(profile, 'languageSwitcher');
  const channelSwitcherEnabled = isAccessSurfaceEnabled(profile, 'channelSwitcher');
  const notificationsEnabled = isAccessSurfaceEnabled(profile, 'notifications');
  const reindexEnabled =
    isAccessSurfaceEnabled(profile, 'reindexAction') &&
    canAccessAdminItem({
      item: { requiredPermissions: [Permission.UpdateCatalog, Permission.UpdateProduct] },
      profile,
      userPermissions,
    });
  const isPluginAllowed = (pluginName?: string) => {
    if (!pluginName) return true;
    if (profile.plugins?.disabledIds?.includes(pluginName)) return false;
    return !profile.plugins?.enabledIds || profile.plugins.enabledIds.includes(pluginName);
  };
  const canAccessPluginSurface = (entry: PluginSurfaceEntry) =>
    isPluginAllowed(entry.plugin?.name) && canAccessAdminItem({ item: entry.access, profile, userPermissions });
  const allowedTopNavigationComponents = (
    topNavigationComponents as PluginTopNavigationComponent[] | undefined
  )?.filter(canAccessPluginSurface);
  const allowedTopNavigationActions = (topNavigationActionsMenu as PluginTopNavigationAction[] | undefined)?.filter(
    canAccessPluginSurface,
  );
  const systemStatusRoute = routes.find((route) => route.id === 'system.status');
  const globalSettingsRoute = routes.find((route) => route.id === 'settings.global');
  const fastLinks = [
    systemStatusRoute &&
      isAccessSurfaceEnabled(profile, 'systemStatus') &&
      canAccessAdminItem({ item: systemStatusRoute, profile, routeId: systemStatusRoute.id, userPermissions }) && {
        key: 'systemStatus',
        label: t('systemStatus'),
        path: systemStatusRoute.path,
      },
    globalSettingsRoute &&
      canAccessAdminItem({ item: globalSettingsRoute, profile, routeId: globalSettingsRoute.id, userPermissions }) && {
        key: 'globalSettings',
        label: t('globalSettings'),
        path: globalSettingsRoute.path,
      },
  ].filter(Boolean) as Array<{ key: string; label: string; path: string }>;

  const rebuildSearchIndex = async () => {
    await apiClient('mutation')({ reindex: { id: true, queueName: true, state: true } }).then(
      ({ reindex: { queueName, state } }) => {
        setJobQueue(queueName, state === 'RUNNING');
      },
    );
  };

  const matches = useMatches();
  const crumbs = useMemo(
    () =>
      matches
        .filter((match) => !!match.pathname)
        .map((match) => match.pathname)
        .flatMap((p) => p.split('/'))
        .filter(Boolean)
        .filter((crumb) => !removableCrumbs.includes(crumb)),
    [matches],
  );

  return (
    <div className="w-full bg-background">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex-1">
          <TooltipProvider delayDuration={100}>
            <ResizablePanelGroup
              onLayoutChanged={(layout) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(Object.values(layout))}`;
              }}
              orientation="horizontal"
              className="size-full"
            >
              <ResizablePanel
                id="navigation"
                defaultSize="16%"
                collapsedSize="4%"
                collapsible
                minSize="11%"
                maxSize="18%"
                onResize={(size) => {
                  const collapsed = size.asPercentage <= 4;
                  setIsCollapsed(collapsed);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(collapsed)}`;
                }}
                className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
              >
                <div className={cn('flex h-[72px] flex-col items-center justify-center gap-4 border-b bg-card/80')}>
                  <div
                    className={`flex h-full items-center justify-center ${!isCollapsed && 'w-full'} cursor-pointer px-4 py-3`}
                    onClick={() => navigate(defaultRoutePath, { viewTransition: true })}
                  >
                    <BrandLogo isCollapsed={isCollapsed} />
                  </div>
                </div>
                <div className="flex h-[calc(100vh-72px)] flex-col justify-between bg-card/70">
                  <Navigation isCollapsed={isCollapsed} />
                  <NavigationFooter isCollapsed={isCollapsed} />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel id="content">
                <div className="flex h-[64px] items-center border-b bg-background/95 px-3 backdrop-blur lg:h-[72px] lg:px-5">
                  <div className="flex flex-col items-start justify-center">
                    <Breadcrumb>
                      <BreadcrumbList>
                        {crumbs.length ? (
                          crumbs.map((c, i) => {
                            linkPath.push(c);
                            return (
                              <React.Fragment key={c}>
                                <BreadcrumbItem>
                                  <NavLink to={buildURL(linkPath)} viewTransition>
                                    <p
                                      className={cn('text-sm font-semibold tracking-tight text-foreground capitalize')}
                                    >
                                      {i === 0 ? t('menu.' + dashToCamelCase(c)) : c}
                                    </p>
                                  </NavLink>
                                </BreadcrumbItem>
                                {i !== crumbs.length - 1 && (
                                  <BreadcrumbSeparator>
                                    <Slash className="text-muted-foreground" />
                                  </BreadcrumbSeparator>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <BreadcrumbItem>
                            <NavLink to={defaultRoutePath} viewTransition>
                              <p className="text-xl font-semibold tracking-tight text-foreground">
                                {t(
                                  defaultRouteMenuKey === 'dashboard'
                                    ? 'dashboard'
                                    : `menu.${dashToCamelCase(defaultRouteMenuKey)}`,
                                )}
                              </p>
                            </NavLink>
                          </BreadcrumbItem>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-2"></div>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-1.5">
                    {allowedTopNavigationComponents && allowedTopNavigationComponents.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {allowedTopNavigationComponents.map(({ component: Component }, index) => (
                          <Component key={index} />
                        ))}
                      </div>
                    ) : null}
                    {languageSwitcherEnabled && <LanguagesDropdown />}
                    {channelSwitcherEnabled && <ChannelSwitcher className="min-w-44" />}
                    {globalSearchEnabled && (
                      <Button onClick={openGlobalSearch} variant="outline" size="icon" className="relative size-9">
                        <SearchIcon className="size-4" />
                      </Button>
                    )}
                    {notificationsEnabled && <Notifications />}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="size-9">
                          {theme === 'light' ? (
                            <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                          ) : theme === 'dark' ? (
                            <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                          ) : (
                            <SunMoon className="absolute size-[1.2rem] rotate-90 transition-all" />
                          )}
                          <span className="sr-only">{t('toggleTheme')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme('light')}>{t('themeLight')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('themeDark')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>{t('themeSystem')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="size-9">
                          <MenuIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-[150] mr-6 min-w-40">
                        {activeAdministrator?.emailAddress && (
                          <>
                            <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 font-medium">
                              <div className="flex size-6 items-center justify-center bg-primary/10 text-xs font-semibold text-primary">
                                {activeAdministrator.firstName.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate text-sm">
                                {activeAdministrator.firstName} {activeAdministrator.lastName}
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1" />
                          </>
                        )}
                        {reindexEnabled && (
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 text-nowrap"
                            onSelect={rebuildSearchIndex}
                          >
                            <RotateCwSquare className="size-4" />
                            {t('rebuildSerachIndex')}
                          </DropdownMenuItem>
                        )}
                        {reindexEnabled && fastLinks.length > 0 && <DropdownMenuSeparator />}
                        {fastLinks.length > 0 && (
                          <DropdownMenuGroup>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>{t('fastLinks')}</DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {fastLinks.map((link, index) => (
                                    <React.Fragment key={link.key}>
                                      {index > 0 && <DropdownMenuSeparator />}
                                      <DropdownMenuItem
                                        className="flex cursor-pointer items-center gap-2 text-nowrap"
                                        onSelect={() => navigate(link.path, { viewTransition: true })}
                                      >
                                        <RotateCwSquare className="size-4" />
                                        {link.label}
                                      </DropdownMenuItem>
                                    </React.Fragment>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                        )}

                        {allowedTopNavigationActions?.length && allowedTopNavigationActions.length > 0 ? (
                          <>
                            <DropdownMenuSeparator />
                            {allowedTopNavigationActions.map((action) => (
                              <DropdownMenuItem
                                key={action.label}
                                className="flex cursor-pointer items-center gap-2"
                                onSelect={action.onClick}
                              >
                                {action.icon && <action.icon className="size-4" />}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </>
                        ) : null}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-red-500"
                          onSelect={async () => {
                            const result = await createDialog({
                              title: t('logOutConfirmation'),
                              description: t('logOutConfirmationDescription'),
                              buttons: [
                                { label: t('cancel'), variant: 'secondary', returnValue: false },
                                { label: t('logOut'), variant: 'destructive', returnValue: true },
                              ],
                            });
                            if (result) logOut();
                          }}
                        >
                          <LogOutIcon className="size-4" />
                          {t('logOut')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <ScrollArea className="relative h-[calc(100vh-64px)] overflow-y-hidden lg:h-[calc(100vh-72px)]">
                  {children}
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};
