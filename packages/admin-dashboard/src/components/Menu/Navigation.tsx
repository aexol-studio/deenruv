import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AdminAccessRequirement,
  Button,
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useNotifications,
  usePluginStore,
  useServer,
  useTranslation,
} from '@deenruv/react-ui-devkit';

import {
  adminNavigationGroups,
  canAccessAdminItem,
  getActiveNavigationGroupIds,
  getActiveNavigationLinkIds,
  getNavigationLinkActivePaths,
  insertNavigationLink,
  useAdminAccess,
} from '@/access/index.js';

import { mergeOpenGroupIds } from './SidebarState.js';

type NavLinkItem = {
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
};

type NavigationProps = {
  isCollapsed: boolean;
  manuallyOpenGroupIds: string[];
  onExpand: () => void;
  onOpenGroupIdsChange: (groupIds: string[]) => void;
  onNavigate?: () => void;
};

export function Navigation({
  isCollapsed,
  manuallyOpenGroupIds,
  onExpand,
  onOpenGroupIdsChange,
  onNavigate,
}: NavigationProps) {
  const { t } = useTranslation('common');
  const { t: pluginTranslation } = useTranslation();
  const location = useLocation();
  const { navMenuData, viewMarkers } = usePluginStore();
  const { routes } = useAdminAccess();
  const userPermissions = useServer((state) => state.userPermissions);
  const loaded = useServer((state) => state.loaded);
  const getNavigationNotification = useNotifications(({ getNavigationNotification }) => getNavigationNotification);
  const pluginT = (translation: string): string => {
    const [namespace = '', ...keyParts] = translation.split('.');
    return pluginTranslation(keyParts.join('.'), { ns: namespace });
  };

  const navigationGroups = useMemo(() => {
    const groups: Array<{ label: string; id: string; links: NavLinkItem[] }> = adminNavigationGroups.map((group) => ({
      label: t(`menuGroups.${group.labelKey}`),
      id: group.id,
      links: [],
    }));

    routes.forEach((route) => {
      if (!route.nav || !canAccessAdminItem({ item: route, userPermissions })) return;
      const group = groups.find((candidate) => candidate.id === route.nav?.groupId);
      if (!group) return;
      group.links.push({
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

    navMenuData.groups.forEach(({ id, labelId, placement, access }) => {
      if (!canAccessAdminItem({ item: access, userPermissions })) return;
      const nextGroup = { id, label: pluginT(labelId), links: [] as NavLinkItem[] };
      const anchorIndex = placement?.groupId ? groups.findIndex((group) => group.id === placement.groupId) : -1;
      if (anchorIndex === -1) groups.push(nextGroup);
      else groups.splice(anchorIndex + 1, 0, nextGroup);
    });

    (navMenuData.links as PluginNavigationEntry[]).forEach(
      ({ groupId, href, labelId, id, icon, placement, access }) => {
        if (!canAccessAdminItem({ item: access, userPermissions })) return;
        const group = groups.find((candidate) => candidate.id === groupId);
        if (!group) return;
        const link = { title: pluginT(labelId), href: `/${href}`, id, icon, access, groupId };
        group.links = insertNavigationLink(group.links, link, placement);
      },
    );

    return groups.filter((group) => group.links.length > 0);
  }, [navMenuData.groups, navMenuData.links, pluginTranslation, routes, t, userPermissions]);

  const allLinks = useMemo(() => navigationGroups.flatMap((group) => group.links), [navigationGroups]);
  const activeGroupIds = useMemo(
    () => getActiveNavigationGroupIds(allLinks, location.pathname),
    [allLinks, location.pathname],
  );
  const activeLinkIds = useMemo(
    () => new Set(getActiveNavigationLinkIds(allLinks, location.pathname).map((link) => link.id)),
    [allLinks, location.pathname],
  );
  const openGroupIds = useMemo(
    () => mergeOpenGroupIds(manuallyOpenGroupIds, activeGroupIds),
    [activeGroupIds, manuallyOpenGroupIds],
  );

  const updateOpenGroups = (groupIds: string[]) => {
    const nextGroupIds = mergeOpenGroupIds(groupIds, activeGroupIds);
    onOpenGroupIdsChange(nextGroupIds);
  };

  if (!loaded) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-2 py-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={cn('flex h-8 items-center gap-2 px-2', isCollapsed && 'justify-center px-0')}>
            <Skeleton className="size-5 shrink-0 bg-[var(--sidebar-hairline)]" />
            {!isCollapsed && <Skeleton className="h-3 w-24 bg-[var(--sidebar-hairline)]" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto py-2">
      <Accordion type="multiple" value={openGroupIds} onValueChange={updateOpenGroups} className="w-full">
        {navigationGroups.map((group) => {
          const firstLink = group.links[0];
          const isGroupActive = activeGroupIds.includes(group.id);

          if (isCollapsed) {
            const isSingleLink = group.links.length === 1;
            const collapsedControl = (
              <div className="flex size-8 items-center justify-center">
                {isSingleLink ? (
                  <NavLink
                    to={firstLink.href}
                    viewTransition
                    onClick={onNavigate}
                    aria-current={activeLinkIds.has(firstLink.id) ? 'page' : undefined}
                    className="sidebar-link group/sidebar-link"
                  >
                    <span
                      className={cn(
                        'flex size-8 items-center justify-center rounded-[4px] text-[var(--sidebar-secondary)] transition-colors group-focus-visible/sidebar-link:ring-2 group-focus-visible/sidebar-link:ring-[var(--sidebar-focus)] group-focus-visible/sidebar-link:outline-none hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-ink)]',
                        activeLinkIds.has(firstLink.id) &&
                          'bg-[var(--sidebar-active)] text-[var(--sidebar-active-ink)] shadow-[inset_2px_0_0_var(--sidebar-active-indicator)]',
                      )}
                    >
                      <firstLink.icon className="size-4" />
                      <span className="sr-only">{firstLink.title}</span>
                    </span>
                  </NavLink>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'size-8 rounded-[4px] text-[var(--sidebar-secondary)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-ink)] focus-visible:ring-[var(--sidebar-focus)]',
                      isGroupActive &&
                        'bg-[var(--sidebar-active)] text-[var(--sidebar-active-ink)] shadow-[inset_2px_0_0_var(--sidebar-active-indicator)]',
                    )}
                    onClick={() => {
                      updateOpenGroups([...openGroupIds, group.id]);
                      onExpand();
                    }}
                    aria-label={t('expandNavigationGroup', { group: group.label })}
                  >
                    <firstLink.icon className="size-4" />
                  </Button>
                )}
              </div>
            );

            return (
              <div key={group.id} className="flex justify-center py-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>{collapsedControl}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    <span>{isSingleLink ? firstLink.title : group.label}</span>
                    {getNavigationNotification(isSingleLink ? firstLink.id : group.id)}
                    {viewMarkers && <span className="text-xs text-[var(--sidebar-tertiary)]">{group.id}</span>}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          }

          return (
            <AccordionItem key={group.id} value={group.id} className="border-none px-2">
              <AccordionTrigger className="h-8 px-2 py-0 text-xs font-medium tracking-normal text-[var(--sidebar-secondary)] hover:text-[var(--sidebar-ink)] hover:no-underline">
                <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <span className="truncate">{group.label}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-1">
                    {getNavigationNotification(group.id)}
                    {viewMarkers && <span className="text-[10px] font-normal">{group.id}</span>}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <nav id={group.id} aria-label={group.label} className="grid gap-0.5">
                  {group.links.map((link) => {
                    const isActive = activeLinkIds.has(link.id);
                    return (
                      <NavLink
                        key={link.id}
                        to={link.href}
                        viewTransition
                        onClick={onNavigate}
                        aria-current={isActive ? 'page' : undefined}
                        className="sidebar-link group/sidebar-link"
                      >
                        <span
                          className="sidebar-row group-focus-visible/sidebar-link:ring-2 group-focus-visible/sidebar-link:ring-[var(--sidebar-focus)] group-focus-visible/sidebar-link:outline-none"
                          data-active={isActive}
                        >
                          <span className="sidebar-icon-slot">
                            <link.icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1 truncate">{link.title}</span>
                          <span className="ml-auto flex shrink-0 items-center gap-1">
                            {getNavigationNotification(link.id)}
                            {viewMarkers && (
                              <span className="text-[10px] font-normal text-[var(--sidebar-tertiary)]">{link.id}</span>
                            )}
                          </span>
                        </span>
                      </NavLink>
                    );
                  })}
                </nav>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
