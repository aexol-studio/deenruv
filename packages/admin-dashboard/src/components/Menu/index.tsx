import React, { useMemo } from 'react';
import { NavLink, useMatches, useNavigate } from 'react-router';
import {
  type AdminAccessRequirement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
  dashToCamelCase,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type PluginComponent,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  TooltipProvider,
  Routes,
  useGlobalSearch,
  usePluginStore,
  useServer,
  useSettings,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { MenuIcon, Moon, PanelLeftClose, PanelLeftOpen, SearchIcon, Slash, Sun, SunMoon } from 'lucide-react';

import { adminNavigationGroups, canAccessAdminItem, useAdminAccess } from '@/access/index.js';

import { ChannelSwitcher } from './ChannelSwitcher.js';
import { buildMenuBreadcrumbs } from './Breadcrumbs.js';
import { LanguagesDropdown } from './LanguagesDropdown.js';
import { Notifications } from './Notifications.js';
import { SidebarContent } from './SidebarContent.js';
import { useSidebarState } from './SidebarState.js';
import { TopbarOverflow } from './TopbarOverflow.js';

type PluginTopNavigationComponent = PluginComponent & {
  access?: AdminAccessRequirement;
  plugin?: { name: string };
};

const removableCrumbs = ['draft', 'admin-ui'];

export const Menu: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation('common');
  const { t: pluginTranslation } = useTranslation();
  const navigate = useNavigate();
  const matches = useMatches();
  const openGlobalSearch = useGlobalSearch((state) => state.open);
  const { navMenuData, topNavigationComponents } = usePluginStore();
  const { defaultRoute, routes } = useAdminAccess();
  const userPermissions = useServer((state) => state.userPermissions);
  const { theme, setTheme } = useSettings();
  const showChannelPicker = window.__DEENRUV_SETTINGS__.ui?.showChannelPicker !== false;
  const showLanguagePicker = window.__DEENRUV_SETTINGS__.ui?.showLanguagePicker !== false;
  const {
    isCollapsed,
    isMobileOpen,
    manuallyOpenGroupIds,
    setIsCollapsed,
    setIsMobileOpen,
    setManuallyOpenGroupIds,
    toggleDesktop,
  } = useSidebarState();
  const defaultRoutePath = defaultRoute?.path || Routes.dashboard;
  const defaultRouteMenuKey = defaultRoute?.nav?.menuKey || defaultRoute?.search?.menuKey || 'dashboard';
  const allowedTopNavigationComponents = (
    topNavigationComponents as PluginTopNavigationComponent[] | undefined
  )?.filter((entry) => canAccessAdminItem({ item: entry.access, userPermissions }));
  const pathname = matches.at(-1)?.pathname || '';
  const crumbSegments = pathname.split('/').filter(Boolean);
  const pluginT = (translation: string): string => {
    const [namespace = '', ...keyParts] = translation.split('.');
    return pluginTranslation(keyParts.join('.'), { ns: namespace });
  };
  const crumbs = useMemo(() => {
    const groups = [
      ...adminNavigationGroups.map((group) => ({
        id: group.id,
        label: t(`menuGroups.${group.labelKey}`),
        permitted: true,
      })),
      ...navMenuData.groups.map((group) => ({
        id: group.id,
        label: pluginT(group.labelId),
        permitted: canAccessAdminItem({ item: group.access, userPermissions }),
      })),
    ];
    const links = navMenuData.links.map((link) => ({
      href: link.href,
      groupId: link.groupId,
      label: pluginT(link.labelId),
      permitted: canAccessAdminItem({ item: link.access, userPermissions }),
    }));
    const extensionsRoute = routes.find((route) => route.id === 'extensions');
    return buildMenuBreadcrumbs({
      pathname,
      groups,
      links,
      extensions: {
        label: t('menu.extensions'),
        href: extensionsRoute?.path || '/admin-ui/extensions',
        permitted: canAccessAdminItem({ item: extensionsRoute, userPermissions }),
      },
      fallbackLabels: crumbSegments.map((crumb) =>
        removableCrumbs.includes(crumb) ? '' : t(`menu.${dashToCamelCase(crumb)}`, { defaultValue: crumb }),
      ),
    });
  }, [navMenuData.groups, navMenuData.links, pathname, pluginTranslation, routes, t, userPermissions]);
  const navigateHome = () => navigate(defaultRoutePath, { viewTransition: true });

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex h-screen w-full overflow-hidden bg-[var(--sidebar-canvas)]">
        <aside
          data-collapsed={isCollapsed}
          className={cn(
            'hidden h-full shrink-0 border-r border-[var(--sidebar-hairline)] bg-[var(--sidebar-canvas)] transition-[width] duration-300 ease-out motion-reduce:transition-none md:block',
            isCollapsed ? 'w-12' : 'w-64',
          )}
          aria-label={t('mainNavigation')}
        >
          <SidebarContent
            isCollapsed={isCollapsed}
            manuallyOpenGroupIds={manuallyOpenGroupIds}
            mode="desktop"
            onExpand={() => setIsCollapsed(false)}
            onOpenGroupIdsChange={setManuallyOpenGroupIds}
            onNavigate={() => undefined}
            onNavigateHome={navigateHome}
          />
        </aside>

        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent
            side="left"
            className="w-72 max-w-[calc(100vw-1rem)] border-[var(--sidebar-hairline)] bg-[var(--sidebar-canvas)] p-0 sm:max-w-72 [&>button]:rounded-[4px] [&>button]:text-[var(--sidebar-secondary)] [&>button]:focus:ring-[var(--sidebar-focus)] [&>button]:data-[state=open]:bg-[var(--sidebar-hover)]"
          >
            <SheetTitle className="sr-only">{t('mainNavigation')}</SheetTitle>
            <SheetDescription className="sr-only">{t('mobileNavigationDescription')}</SheetDescription>
            <SidebarContent
              isCollapsed={false}
              manuallyOpenGroupIds={manuallyOpenGroupIds}
              mode="mobile"
              onExpand={() => undefined}
              onOpenGroupIdsChange={setManuallyOpenGroupIds}
              onNavigate={() => setIsMobileOpen(false)}
              onNavigateHome={() => {
                navigateHome();
                setIsMobileOpen(false);
              }}
            />
          </SheetContent>
        </Sheet>

        <main className="flex min-w-0 flex-1 flex-col bg-[var(--sidebar-canvas)]">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[var(--sidebar-hairline)] bg-[var(--sidebar-canvas)] px-3 lg:h-[72px] lg:px-5">
            <Button
              variant="outline"
              size="icon"
              className="size-9 shrink-0 md:hidden"
              onClick={() => setIsMobileOpen(true)}
              aria-label={t('openSidebar')}
              title={t('openSidebar')}
            >
              <MenuIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-9 shrink-0 md:inline-flex"
              onClick={toggleDesktop}
              aria-label={isCollapsed ? t('expandSidebar') : t('collapseSidebar')}
              title={`${isCollapsed ? t('expandSidebar') : t('collapseSidebar')} (${t('sidebarShortcut')})`}
            >
              {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </Button>

            <div className="hidden min-w-0 flex-col items-start justify-center sm:flex">
              <Breadcrumb>
                <BreadcrumbList className="flex-nowrap overflow-hidden">
                  {crumbs.length ? (
                    crumbs.map((crumb, index) => {
                      return (
                        <React.Fragment key={`${crumb.label}-${index}`}>
                          <BreadcrumbItem className="min-w-0">
                            {crumb.current ? (
                              <BreadcrumbPage className="truncate text-sm font-semibold tracking-tight">
                                {crumb.label}
                              </BreadcrumbPage>
                            ) : crumb.href ? (
                              <NavLink to={crumb.href} viewTransition className="truncate">
                                <span className="text-sm font-semibold tracking-tight text-foreground">
                                  {crumb.label}
                                </span>
                              </NavLink>
                            ) : (
                              <span className="truncate text-sm font-semibold tracking-tight text-muted-foreground">
                                {crumb.label}
                              </span>
                            )}
                          </BreadcrumbItem>
                          {index !== crumbs.length - 1 && (
                            <BreadcrumbSeparator>
                              <Slash className="text-muted-foreground" />
                            </BreadcrumbSeparator>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-lg font-semibold tracking-tight">
                        {t(
                          defaultRouteMenuKey === 'dashboard'
                            ? 'dashboard'
                            : `menu.${dashToCamelCase(defaultRouteMenuKey)}`,
                        )}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="ml-auto flex min-w-0 items-center justify-end gap-1.5">
              <TopbarOverflow
                components={allowedTopNavigationComponents || []}
                showChannelPicker={showChannelPicker}
                showLanguagePicker={showLanguagePicker}
              />
              {allowedTopNavigationComponents?.length ? (
                <div className="hidden items-center gap-2 lg:flex">
                  {allowedTopNavigationComponents.map(({ component: Component }, index) => (
                    <Component key={index} />
                  ))}
                </div>
              ) : null}
              {showChannelPicker || showLanguagePicker ? (
                <div className="hidden items-center gap-1.5 lg:flex">
                  {showLanguagePicker ? <LanguagesDropdown /> : null}
                  {showChannelPicker ? <ChannelSwitcher className="min-w-44" /> : null}
                </div>
              ) : null}
              <Button
                onClick={openGlobalSearch}
                variant="outline"
                size="icon"
                className="relative size-9 shrink-0"
                aria-label={t('openGlobalSearch')}
                title={t('openGlobalSearch')}
              >
                <SearchIcon className="size-4" />
              </Button>
              <Notifications />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative size-9 shrink-0">
                    {theme === 'light' ? (
                      <Sun className="size-[1.2rem]" />
                    ) : theme === 'dark' ? (
                      <Moon className="size-[1.2rem]" />
                    ) : (
                      <SunMoon className="size-[1.2rem]" />
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
            </div>
          </header>
          <ScrollArea className="relative min-h-0 flex-1 overflow-y-hidden bg-[var(--sidebar-canvas)]">
            {children}
          </ScrollArea>
        </main>
      </div>
    </TooltipProvider>
  );
};
