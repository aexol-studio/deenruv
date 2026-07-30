import React, { useMemo } from 'react';
import { NavLink, useMatches, useNavigate } from 'react-router';
import {
  type AdminAccessRequirement,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  buildURL,
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

import { canAccessAdminItem, useAdminAccess } from '@/access/index.js';

import { ChannelSwitcher } from './ChannelSwitcher.js';
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
  const navigate = useNavigate();
  const matches = useMatches();
  const openGlobalSearch = useGlobalSearch((state) => state.open);
  const { topNavigationComponents } = usePluginStore();
  const { defaultRoute } = useAdminAccess();
  const userPermissions = useServer((state) => state.userPermissions);
  const { theme, setTheme } = useSettings();
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
  const crumbs = useMemo(
    () =>
      matches
        .filter((match) => !!match.pathname)
        .map((match) => match.pathname)
        .flatMap((path) => path.split('/'))
        .filter(Boolean)
        .filter((crumb) => !removableCrumbs.includes(crumb)),
    [matches],
  );
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
                      const path = crumbs.slice(0, index + 1);
                      return (
                        <React.Fragment key={`${crumb}-${index}`}>
                          <BreadcrumbItem className="min-w-0">
                            <NavLink to={buildURL(path)} viewTransition className="truncate">
                              <span className="text-sm font-semibold tracking-tight text-foreground">
                                {index === 0 ? t(`menu.${dashToCamelCase(crumb)}`) : crumb}
                              </span>
                            </NavLink>
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
                      <NavLink to={defaultRoutePath} viewTransition>
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                          {t(
                            defaultRouteMenuKey === 'dashboard'
                              ? 'dashboard'
                              : `menu.${dashToCamelCase(defaultRouteMenuKey)}`,
                          )}
                        </span>
                      </NavLink>
                    </BreadcrumbItem>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="ml-auto flex min-w-0 items-center justify-end gap-1.5">
              <TopbarOverflow components={allowedTopNavigationComponents || []} />
              {allowedTopNavigationComponents?.length ? (
                <div className="hidden items-center gap-2 lg:flex">
                  {allowedTopNavigationComponents.map(({ component: Component }, index) => (
                    <Component key={index} />
                  ))}
                </div>
              ) : null}
              <div className="hidden items-center gap-1.5 lg:flex">
                <LanguagesDropdown />
                <ChannelSwitcher className="min-w-44" />
              </div>
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
