import { NavLink, useLocation } from 'react-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  cn,
  buttonVariants,
  usePluginStore,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useServer,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useNotifications,
  useTranslation,
  capitalizeFirstLetter,
  Skeleton,
} from '@deenruv/react-ui-devkit';
import type { AdminAccessRequirement } from '@deenruv/react-ui-devkit';
import {
  adminNavigationGroups,
  canAccessAdminItem,
  getActiveNavigationLinkIds,
  getActiveNavigationGroupIds,
  getNavigationLinkActivePaths,
  insertNavigationLink,
  useAdminAccess,
} from '@/access/index.js';

type NavLink = {
  title: string;
  id: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  access?: AdminAccessRequirement;
  routeId?: string;
  groupId: string;
  activePaths?: string[];
};

type PluginNavigationEntry = {
  id: string;
  labelId: string;
  href: string;
  groupId: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  placement?: { linkId: string; where?: 'above' | 'under' };
  access?: AdminAccessRequirement;
  plugin?: { name: string };
};

interface NavProps {
  isCollapsed: boolean;
}

export function Navigation({ isCollapsed }: NavProps) {
  const { t } = useTranslation('common');
  const { t: _pluginT } = useTranslation();
  const location = useLocation();
  const { navMenuData, viewMarkers } = usePluginStore();
  const { routes } = useAdminAccess();
  const userPermissions = useServer((p) => p.userPermissions);
  const loaded = useServer((p) => p.loaded);
  const getNavigationNotification = useNotifications(({ getNavigationNotification }) => getNavigationNotification);
  const pluginT = (trans: string): string => {
    const split = trans.split('.');
    const key = split.slice(1).join('.') || '';
    const ns = split[0] || '';

    return _pluginT(key, { ns });
  };

  const navigationGroups = useMemo(() => {
    const navData: Array<{
      label: string;
      id: string;
      links: Array<NavLink>;
    }> = adminNavigationGroups.map((group) => ({
      label: t(`menuGroups.${group.labelKey}`),
      id: group.id,
      links: [],
    }));

    routes.forEach((route) => {
      if (!route.nav) return;
      if (!canAccessAdminItem({ item: route, userPermissions })) return;
      const foundGroupIdx = navData.findIndex((group) => group.id === route.nav?.groupId);
      if (foundGroupIdx === -1) return;
      navData[foundGroupIdx].links.push({
        title: t(`menu.${route.nav.menuKey}`),
        href: route.path,
        id: route.nav.linkId,
        icon: route.nav.icon,
        access: route,
        routeId: route.id,
        groupId: route.nav.groupId,
        activePaths: getNavigationLinkActivePaths(route, routes),
      });
    });

    const { groups, links } = navMenuData;

    groups.forEach(({ id, labelId, placement, access }) => {
      if (!canAccessAdminItem({ item: access, userPermissions })) return;
      let foundGroupIdx = -1;

      const newGroup = { id, label: pluginT(labelId), links: [] };
      if (placement?.groupId) {
        foundGroupIdx = navData.findIndex((group) => group.id === placement.groupId);
      }

      if (foundGroupIdx == -1) {
        navData.push(newGroup);
      } else {
        navData.splice(foundGroupIdx + 1, 0, newGroup);
      }
    });

    (links as PluginNavigationEntry[]).forEach(({ groupId, href, labelId, id, icon, placement, access }) => {
      if (!canAccessAdminItem({ item: access, userPermissions })) return;
      const foundGroupIdx = navData.findIndex((group) => group.id === groupId);

      if (foundGroupIdx == -1) return;

      const newElement = {
        title: pluginT(labelId),
        label: pluginT(labelId),
        href: `/${href}`,
        id,
        icon,
        access,
        groupId,
      };

      if (!placement) {
        navData[foundGroupIdx].links.push(newElement);
        return;
      }

      navData[foundGroupIdx].links = insertNavigationLink(navData[foundGroupIdx].links, newElement, placement);
    });

    return navData.filter((group) => group.links.length > 0);
  }, [navMenuData.groups, navMenuData.links, pluginT, routes, t, userPermissions]);

  const permittedNavigationGroups = navigationGroups;
  const activeGroupIds = useMemo(
    () =>
      getActiveNavigationGroupIds(
        permittedNavigationGroups.flatMap((group) => group.links),
        location.pathname,
      ),
    [location.pathname, permittedNavigationGroups],
  );
  const activeLinkIds = useMemo(
    () =>
      new Set(
        getActiveNavigationLinkIds(
          permittedNavigationGroups.flatMap((group) => group.links),
          location.pathname,
        ).map((link) => link.id),
      ),
    [location.pathname, permittedNavigationGroups],
  );
  const previousPathname = useRef(location.pathname);
  const [openGroupIds, setOpenGroupIds] = useState(activeGroupIds);

  useEffect(() => {
    const hasPathnameChanged = previousPathname.current !== location.pathname;

    previousPathname.current = location.pathname;

    if (!hasPathnameChanged) return;

    setOpenGroupIds((currentGroupIds) => {
      const nextGroupIds = [...new Set([...currentGroupIds, ...activeGroupIds])];

      return nextGroupIds.length === currentGroupIds.length ? currentGroupIds : nextGroupIds;
    });
  }, [activeGroupIds, location.pathname]);

  if (!loaded) {
    return (
      <div className="relative overflow-y-auto">
        <div className="flex h-[calc(100%-64px)] flex-col gap-3 pb-2 lg:h-[calc(100%-72px)]">
          {/* Skeleton nav groups */}
          {Array.from({ length: 3 }).map((_, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1 px-2.5">
              {!isCollapsed && (
                <div className="px-3 py-2">
                  <Skeleton className="h-3 w-20" />
                </div>
              )}
              {Array.from({ length: groupIdx === 0 ? 4 : groupIdx === 1 ? 5 : 3 }).map((_, linkIdx) => (
                <div key={linkIdx} className={cn('flex items-center px-3 py-2', isCollapsed && 'justify-center px-0')}>
                  <Skeleton className={cn('size-4 shrink-0', isCollapsed && 'size-6')} />
                  {!isCollapsed && <Skeleton className="ml-2 h-4 w-24" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="relative overflow-y-auto">
      <div
        data-collapsed={isCollapsed}
        className="group flex h-[calc(100%-64px)] flex-col gap-2 py-2 data-[collapsed=true]:py-2 lg:h-[calc(100%-72px)]"
      >
        <Accordion
          type="multiple"
          className="w-full"
          value={isCollapsed ? permittedNavigationGroups.map((g) => g.id) : openGroupIds}
          onValueChange={setOpenGroupIds}
        >
          {permittedNavigationGroups.map((group) => (
            <AccordionItem key={group.id} value={group.id} className="border-none">
              {!isCollapsed && (
                <AccordionTrigger className={cn('flex items-center justify-between px-3 py-2 hover:no-underline')}>
                  <div className="flex items-center gap-2 px-1">
                    <h4 className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                      {group.label}
                    </h4>
                    {getNavigationNotification(group.id)}
                    {viewMarkers ? (
                      <p className="text-xs font-semibold text-muted-foreground lowercase dark:text-muted-foreground">
                        {group.id}
                      </p>
                    ) : null}
                  </div>
                </AccordionTrigger>
              )}
              <AccordionContent className={cn(isCollapsed ? 'py-1' : 'pb-2')}>
                <nav
                  id={group.id}
                  className="grid gap-1 px-2.5 text-muted-foreground group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
                >
                  {group.links.map((link, index) => {
                    const notifications = getNavigationNotification(link.id);
                    const isActive = activeLinkIds.has(link.id);
                    return (
                      <React.Fragment key={link.id}>
                        {isCollapsed ? (
                          <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div>
                                <NavLink to={link.href} viewTransition aria-current={isActive ? 'page' : undefined}>
                                  <div
                                    className={cn(
                                      buttonVariants({ variant: 'navigation-link', size: 'icon' }),
                                      'h-9 w-9 rounded-lg ring-offset-background transition-all hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                      isActive &&
                                        'bg-primary text-primary-foreground opacity-100 shadow-sm hover:scale-100 hover:bg-primary hover:text-primary-foreground',
                                    )}
                                  >
                                    <link.icon className="size-5" />
                                    <span className="sr-only">{link.title}</span>
                                  </div>
                                </NavLink>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="relative flex items-center gap-4">
                              {viewMarkers ? (
                                <div className="text-xs font-semibold text-muted-foreground lowercase dark:text-muted-foreground">
                                  {link.id}
                                </div>
                              ) : null}
                              {capitalizeFirstLetter(link.title)}
                              {notifications}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <NavLink to={link.href} viewTransition aria-current={isActive ? 'page' : undefined}>
                            <div
                              id={link.id}
                              className={cn(
                                'relative flex h-10 items-center justify-start rounded-lg px-3 text-sm font-medium capitalize transition-all hover:bg-muted hover:text-foreground',
                                isActive &&
                                  'bg-primary text-primary-foreground opacity-100 shadow-sm hover:bg-primary hover:text-primary-foreground',
                              )}
                            >
                              {viewMarkers ? (
                                <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-semibold text-muted-foreground lowercase dark:text-muted-foreground">
                                  {link.id}
                                </div>
                              ) : null}
                              <span
                                className={cn(
                                  'mr-2.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/80 text-muted-foreground transition-colors',
                                  isActive && 'bg-primary-foreground/15 text-primary-foreground',
                                )}
                              >
                                <link.icon className="size-4" />
                              </span>
                              <span className="truncate">{capitalizeFirstLetter(link.title)}</span>
                              {notifications}
                            </div>
                          </NavLink>
                        )}
                      </React.Fragment>
                    );
                  })}
                </nav>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
