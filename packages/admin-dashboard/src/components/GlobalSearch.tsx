import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  useGlobalSearch,
  capitalizeFirstLetter,
  useTranslation,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, ListPlus, FileText, Puzzle, ArrowRight } from 'lucide-react';
import { canAccessAdminItem, isAccessSurfaceEnabled, useAdminAccess } from '@/access/index.js';

type Route = {
  name: string;
  path?: string;
  children?: Route[];
  type?: 'new' | 'list' | 'plugin' | 'default';
  description?: string;
  subName?: string;
  id?: string;
};

export const GlobalSearch = () => {
  const { t, tEntity } = useTranslation('common');

  const { profile, routes } = useAdminAccess();
  const userPermissions = useServer((p) => p.userPermissions);
  const isOpen = useGlobalSearch((s) => s.isOpen);
  const toggle = useGlobalSearch((s) => s.toggle);
  const close = useGlobalSearch((s) => s.close);
  const navigate = useNavigate();
  const isEnabled = isAccessSurfaceEnabled(profile, 'globalSearch');

  useEffect(() => {
    if (!isEnabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, toggle]);

  const allRoutes = useMemo<Route[]>(() => {
    return routes
      .filter((route) => route.search)
      .filter((route) => canAccessAdminItem({ item: route, profile, routeId: route.id, userPermissions }))
      .map((route) => {
        const search = route.search!;
        const isPlugin = search.type === 'plugin';
        const translatedName = isPlugin ? search.menuKey : capitalizeFirstLetter(t(`menu.${search.menuKey}`));
        const description =
          search.type === 'new'
            ? tEntity('Utwórz', search.menuKey)
            : search.type === 'list'
              ? tEntity('Zobacz wszystkie', search.menuKey, 'many')
              : search.type === 'plugin'
                ? t('globalSearch.accessPlugin', { pluginName: search.menuKey })
                : `${t('globalSearch.navigateTo')} ${t(`menu.${search.menuKey}`)}`;

        return {
          id: route.id,
          name: translatedName,
          path: route.path,
          type: search.type,
          description,
        };
      });
  }, [profile, routes, t, tEntity, userPermissions]);

  if (!isEnabled) return null;

  // Group routes by type for better organization
  const groupedRoutes = useMemo(() => {
    const core: Route[] = [];
    const newItems: Route[] = [];
    const lists: Route[] = [];
    const pluginRoutes: Route[] = [];

    allRoutes.forEach((route) => {
      if (route.type === 'new') {
        newItems.push(route);
      } else if (route.type === 'list') {
        lists.push(route);
      } else if (route.type === 'plugin') {
        pluginRoutes.push(route);
      } else {
        core.push(route);
      }
    });

    return { core, newItems, lists, pluginRoutes };
  }, [allRoutes]);

  const getRouteIcon = (type?: string) => {
    switch (type) {
      case 'new':
        return <ListPlus className="mr-2 h-4 w-4 text-emerald-500" />;
      case 'list':
        return <FileText className="mr-2 h-4 w-4 text-blue-500" />;
      case 'plugin':
        return <Puzzle className="mr-2 h-4 w-4 text-purple-500" />;
      default:
        return <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={toggle} modal>
      <CommandInput
        placeholder={t('globalSearch.placeholder')}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <CommandList className="max-h-[320px] overflow-y-auto py-2">
        <CommandEmpty className="py-6 text-center text-sm">{t('globalSearch.emptyState')}</CommandEmpty>

        {groupedRoutes.core.length > 0 && (
          <CommandGroup heading={t('globalSearch.navigation')} className="px-2">
            {groupedRoutes.core.map((route) => (
              <CommandItem
                key={route.id || `core-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="group flex cursor-pointer items-center px-3 py-2.5 transition-colors hover:bg-accent"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-xs text-muted-foreground">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.newItems.length > 0 && (
          <CommandGroup heading={t('globalSearch.createNew')} className="px-2">
            {groupedRoutes.newItems.map((route) => (
              <CommandItem
                key={route.id || `new-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="group flex cursor-pointer items-center px-3 py-2.5 transition-colors hover:bg-accent"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-xs text-muted-foreground">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.lists.length > 0 && (
          <CommandGroup heading={t('globalSearch.viewLists')} className="px-2">
            {groupedRoutes.lists.map((route) => (
              <CommandItem
                key={route.id || `list-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="group flex cursor-pointer items-center px-3 py-2.5 transition-colors hover:bg-accent"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-xs text-muted-foreground">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.pluginRoutes.length > 0 && (
          <CommandGroup heading={t('globalSearch.plugins')} className="px-2">
            {groupedRoutes.pluginRoutes.map((route) => (
              <CommandItem
                key={route.id || `plugin-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="group flex cursor-pointer items-center px-3 py-2.5 transition-colors hover:bg-accent"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-xs text-muted-foreground">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      <div className="border-t bg-card p-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <kbd className="border bg-muted px-1.5 py-0.5 text-[10px]">↑</kbd>
              <kbd className="border bg-muted px-1.5 py-0.5 text-[10px]">↓</kbd>
              <span>{t('globalSearch.navigate')}</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="border bg-muted px-1.5 py-0.5 text-[10px]">Enter</kbd>
              <span>{t('globalSearch.select')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="border bg-muted px-1.5 py-0.5 text-[10px]">Esc</kbd>
            <span>{t('globalSearch.close')}</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
};
