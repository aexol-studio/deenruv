import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Label,
  ScrollArea,
} from '@/components';

import {
  BarChart,
  Barcode,
  Bell,
  Check,
  GripVertical,
  Languages,
  LogOutIcon,
  MenuIcon,
  Moon,
  Slash,
  Store,
  Sun,
  Trash2Icon,
  ShoppingCart,
  Images,
  Folder,
  Globe2,
  Tag,
  UserCog,
  Users,
  MapPin,
  Flag,
  Coins,
  Globe,
  Percent,
  CreditCard,
  Truck,
  SunMoon,
} from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';

import { cn } from '@/lib/utils';
import { Nav } from './AwesomeMenu/Nav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { NavLink, useMatches, useNavigate } from 'react-router-dom';
import { ChannelSwitcher } from './AwesomeMenu/ChannelSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { clearAllCache } from '@/lists/cache';
import { languages, useSettings } from '@/state/settings';
import { Routes } from '@/utils';
import { MinkoLogo } from '@/components/MinkoLogo';
import { useServer } from '@/state';

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
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

const removableCrumbs = ['draft', 'admin-ui'];

export const Menu: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const linkPath: string[] = [];
  const { t } = useTranslation('common');
  const logOut = useSettings((p) => p.logOut);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { activeAdministrator } = useServer();

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

  const theme = useSettings((p) => p.theme);
  const setTheme = useSettings((p) => p.setTheme);
  const language = useSettings((p) => p.language);
  const setLanguage = useSettings((p) => p.setLanguage);

  return (
    <div className="w-full border-r bg-muted/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <TooltipProvider delayDuration={100}>
            <ResizablePanelGroup
              onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
              }}
              direction="horizontal"
              className="h-full w-full"
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
                <div className=" flex h-[120px] flex-col items-center justify-center gap-4 border-b px-2 lg:h-[120px]">
                  <div className="cursor-pointer" onClick={() => navigate(Routes.dashboard)}>
                    <MinkoLogo isCollapsed={isCollapsed} />
                  </div>
                </div>
                <Nav
                  isCollapsed={isCollapsed}
                  links={[
                    { title: t('menu.dashboard'), href: Routes.dashboard, icon: BarChart },
                    { title: t('menu.products'), href: Routes.products, icon: Barcode },
                    { title: t('menu.collections'), href: Routes.collections, icon: Folder },
                    { title: t('menu.facets'), href: Routes.facets, icon: Tag },
                    { title: t('menu.orders'), href: Routes.orders, icon: ShoppingCart },
                    { title: t('menu.assets'), href: Routes.assets, icon: Images },
                  ]}
                  globalSettings={[
                    { title: t('menu.channels'), href: Routes.channels, icon: Globe2 },
                    { title: t('menu.zones'), href: Routes.zones, icon: Globe },
                    { title: t('menu.countries'), href: Routes.countries, icon: Flag },
                    { title: t('menu.taxCategories'), href: Routes.taxCategories, icon: Coins },
                    { title: t('menu.taxRates'), href: Routes.taxRates, icon: Percent },
                  ]}
                  users={[
                    { title: t('menu.admins'), href: Routes.admins, icon: UserCog },
                    { title: t('menu.roles'), href: Routes.roles, icon: Users },
                    { title: t('menu.sellers'), href: Routes.sellers, icon: Store },
                  ]}
                  shipping={[
                    { title: t('menu.paymentMethods'), href: Routes.paymentMethods, icon: CreditCard },
                    { title: t('menu.shippingMethods'), href: Routes.shippingMethods, icon: Truck },
                    { title: t('menu.stock'), href: Routes.stockLocations, icon: MapPin },
                  ]}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className="flex h-[70px] items-start border-b px-4 py-4 lg:h-[80px] lg:px-6">
                  <div className="flex flex-col items-start gap-2">
                    <Breadcrumb>
                      <BreadcrumbList>
                        {crumbs.length ? (
                          crumbs.map((c, i) => {
                            linkPath.push(c);
                            return (
                              <React.Fragment key={c}>
                                <BreadcrumbItem>
                                  <NavLink to={'/admin-ui/' + linkPath.join('/')}>
                                    <p className="text-2xl font-bold capitalize text-black dark:text-white">{c}</p>
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
                            <NavLink to={Routes.dashboard}>
                              <p className="text-2xl font-bold text-black dark:text-white">{t('dashboard')}</p>
                            </NavLink>
                          </BreadcrumbItem>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex items-center gap-2"></div>
                  </div>
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <div className="min-w-52">
                      <ChannelSwitcher isCollapsed={isCollapsed} />
                    </div>
                    {/* <ActiveAdmins /> */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10">
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">{t('toggleNotifications')}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="mr-4">
                        <div className="flex flex-col gap-4 rounded-md">
                          <Label className="select-none">{t('notifications')}</Label>
                          <div className="flex items-center gap-4 border border-dashed p-4">
                            <Bell className="h-4 w-4 text-accent" />
                            <span className="text-sm text-muted-foreground">{t('noNewNotifications')}</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          {theme === 'light' ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          ) : theme === 'dark' ? (
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          ) : (
                            <SunMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 transition-all" />
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
                          <MenuIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-6 min-w-40">
                        <DropdownMenuLabel>{activeAdministrator?.emailAddress}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-nowrap"
                          onSelect={clearAllCache}
                        >
                          <Trash2Icon className="h-4 w-4" />
                          {t('clearCache')}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Languages className="mr-2 h-4 w-4" />
                            <span>{t('language')}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {languages.map((l) => (
                                <DropdownMenuItem
                                  key={l.language}
                                  onClick={() => l.language !== language && setLanguage(l.language)}
                                >
                                  <span>{l.name}</span>
                                  {l.language === language && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex cursor-pointer items-center gap-2" onSelect={() => logOut()}>
                          <LogOutIcon className="h-4 w-4" />
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
