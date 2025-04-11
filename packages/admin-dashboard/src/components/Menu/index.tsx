import React, { useMemo, useState } from 'react';

import {
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
  DropdownMenuShortcut,
  createDialog,
} from '@deenruv/react-ui-devkit';

import {
  GripVertical,
  LogOutIcon,
  MenuIcon,
  Moon,
  Slash,
  Sun,
  Trash2Icon,
  SunMoon,
  RotateCwSquare,
  SearchIcon,
} from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { Navigation } from './Navigation.js';
import { NavLink, useMatches, useNavigate } from 'react-router-dom';
import { ChannelSwitcher } from './ChannelSwitcher.js';
import { BrandLogo } from '@/components/BrandLogo.js';
import { LanguagesDropdown } from './LanguagesDropdown.js';
import { Notifications } from './Notifications.js';

const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border">
        <GripVertical className="size-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

const removableCrumbs = ['draft', 'admin-ui'];

export const Menu: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const openGlobalSearch = useGlobalSearch((state) => state.open);
  const linkPath: string[] = [];
  const { t } = useTranslation('common');
  const { topNavigationActionsMenu, topNavigationComponents } = usePluginStore();
  const { logOut, theme, setTheme } = useSettings((p) => ({
    logOut: p.logOut,
    theme: p.theme,
    setTheme: p.setTheme,
    language: p.language,
    setLanguage: p.setLanguage,
  }));

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { activeAdministrator, setJobQueue } = useServer();

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
    <div className="bg-muted/40 w-full border-r">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <TooltipProvider delayDuration={100}>
            <ResizablePanelGroup
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
              }}
              direction="horizontal"
              className="size-full"
            >
              <ResizablePanel
                defaultSize={18}
                collapsedSize={4}
                collapsible
                minSize={10}
                maxSize={20}
                onExpand={() => {
                  setIsCollapsed(false);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                }}
                onCollapse={() => {
                  setIsCollapsed(true);
                  document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                }}
                className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
              >
                <div className={cn('flex h-[80px] flex-col items-center justify-center gap-4 border-b')}>
                  <div
                    className={`flex h-full items-center justify-center ${!isCollapsed && 'w-full'} cursor-pointer p-4`}
                    onClick={() => navigate(Routes.dashboard, { viewTransition: true })}
                  >
                    <BrandLogo isCollapsed={isCollapsed} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Navigation isCollapsed={isCollapsed} />
                  <div className="bg-secondary flex h-[40px] w-full select-none items-center justify-center gap-2 text-xs shadow-2xl">
                    {!isCollapsed && <p className="uppercase">Deenruv</p>}
                    <span>
                      {!isCollapsed ? 'ver. ' : 'v. '}
                      {window.__DEENRUV_SETTINGS__.appVersion}
                    </span>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="flex h-[70px] items-center border-b p-4 lg:h-[80px] lg:px-6">
                  <div className="flex flex-col items-start justify-center">
                    <Breadcrumb>
                      <BreadcrumbList>
                        {crumbs.length ? (
                          crumbs.map((c, i) => {
                            linkPath.push(c);
                            return (
                              <React.Fragment key={c}>
                                <BreadcrumbItem>
                                  <NavLink to={'/admin-ui/' + linkPath.join('/')} viewTransition>
                                    <p className="text-foreground text-2xl font-bold capitalize">
                                      {i === 0 ? t('menu.' + dashToCamelCase(c)) : c}
                                    </p>
                                  </NavLink>
                                </BreadcrumbItem>
                                {i !== crumbs.length - 1 && (
                                  <BreadcrumbSeparator>
                                    <Slash />
                                  </BreadcrumbSeparator>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <BreadcrumbItem>
                            <NavLink to={Routes.dashboard} viewTransition>
                              <p className="text-foreground text-2xl font-bold">{t('dashboard')}</p>
                            </NavLink>
                          </BreadcrumbItem>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-2"></div>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-2">
                    {topNavigationComponents && topNavigationComponents.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {topNavigationComponents.map(({ component: Component }, index) => (
                          <Component key={index} />
                        ))}
                      </div>
                    ) : null}
                    <LanguagesDropdown />
                    <div className="min-w-44">
                      <ChannelSwitcher />
                    </div>
                    {/* <ActiveAdmins /> */}
                    <Button onClick={openGlobalSearch} variant="outline" size="icon" className="relative size-10">
                      <SearchIcon className="size-4" />
                    </Button>
                    <Notifications />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          {theme === 'light' ? (
                            <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          ) : theme === 'dark' ? (
                            <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
                        <Button variant="outline" size="icon">
                          <MenuIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-[150] mr-6 min-w-40">
                        {activeAdministrator?.emailAddress && (
                          <>
                            <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 font-medium ">
                              <div className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600">
                                {activeAdministrator.firstName.charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate text-sm">
                                {activeAdministrator.firstName} {activeAdministrator.lastName}
                              </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1" />
                          </>
                        )}
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-nowrap"
                          onSelect={rebuildSearchIndex}
                        >
                          <RotateCwSquare className="size-4" />
                          Przebuduj search index
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Szybkie linki</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2 text-nowrap"
                                  onSelect={() => navigate(Routes.status, { viewTransition: true })}
                                >
                                  <RotateCwSquare className="size-4" />
                                  Status systemu
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2 text-nowrap"
                                  onSelect={() => navigate(Routes.globalSettings, { viewTransition: true })}
                                >
                                  <RotateCwSquare className="size-4" />
                                  Ustawienia globalne
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>

                        {topNavigationActionsMenu?.length && topNavigationActionsMenu.length > 0 ? (
                          <>
                            <DropdownMenuSeparator />
                            {topNavigationActionsMenu.map((action) => (
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
                <ScrollArea className="relative h-[calc(100vh-70px)] overflow-y-hidden lg:h-[calc(100vh-80px)]">
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
