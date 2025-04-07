'use client';

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  usePluginStore,
  Routes,
  useGlobalSearch,
  capitalizeFirstLetter,
} from '@deenruv/react-ui-devkit';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListPlus, FileText, Puzzle, ArrowRight } from 'lucide-react';

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
  const { t } = useTranslation('common');
  const { plugins } = usePluginStore();
  const isOpen = useGlobalSearch((s) => s.isOpen);
  const toggle = useGlobalSearch((s) => s.toggle);
  const close = useGlobalSearch((s) => s.close);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const allRoutes = useMemo<Route[]>(() => {
    const routes: Route[] = [];

    Object.entries(Routes).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const children: Route[] = [];
        if ('new' in value && typeof value.new === 'string') {
          children.push({
            name: capitalizeFirstLetter(t(`menu.${key}`)),
            path: value.new,
            type: 'new',
            description: t('Utwórz', { value: key.toLowerCase() }),
          });
        }
        if ('list' in value && typeof value.list === 'string') {
          children.push({
            name: capitalizeFirstLetter(t(`menu.${key}`)),
            path: value.list,
            type: 'list',
            description: `View all ${key.toLowerCase()} items`,
          });
        }
        routes.push({ name: key, children });
      } else if (typeof value === 'string') {
        routes.push({
          name: key,
          path: value,
          type: 'default',
          description: `Navigate to ${key}`,
        });
      }
    });

    plugins.forEach((plugin) => {
      plugin.pages?.forEach((page, pageIndex) => {
        if (page.path) {
          routes.push({
            name: `${plugin.name} - ${page.path || 'Page'}`,
            path: page.path,
            type: 'plugin',
            description: `Access ${plugin.name} plugin functionality`,
          });
        }
      });
    });

    // return routes.flatMap((route, routeIndex) =>
    //   route.children?.length
    //     ? route.children.map((child, childIndex) => ({
    //         name: `${route.name}`,
    //         path: child.path,
    //         type: child.type,
    //         subName: child.type === 'new' ? 'Create New' : 'View List',
    //         description: child.description,
    //         id: `${routeIndex}-${childIndex}-${child.type}-${route.name}`,
    //       }))
    //     : [
    //         {
    //           ...route,
    //           id: `${routeIndex}-main-${route.name}`,
    //         },
    //       ],
    // );

    return routes.flatMap((route, routeIndex) =>
      route.children?.length
        ? route.children.map((child, childIndex) => ({
            ...child,
            id: `${routeIndex}-${childIndex}-${child.type}-${route.name}`,
          }))
        : [
            {
              ...route,
              id: `${routeIndex}-main-${route.name}`,
            },
          ],
    );
  }, [plugins]);

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
        placeholder={t('entity.product', { count: 4 })}
        className="placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
      />
      <CommandList className="max-h-[300px] overflow-y-auto py-2">
        <CommandEmpty className="py-6 text-center text-sm">{t('No results found.')}</CommandEmpty>

        {groupedRoutes.core.length > 0 && (
          <CommandGroup heading={t('Navigation')} className="px-2">
            {groupedRoutes.core.map((route) => (
              <CommandItem
                key={route.id || `core-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="hover:bg-accent group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-muted-foreground text-xs">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.newItems.length > 0 && (
          <CommandGroup heading={t('Create New')} className="px-2">
            {groupedRoutes.newItems.map((route) => (
              <CommandItem
                key={route.id || `new-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="hover:bg-accent group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-muted-foreground text-xs">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.lists.length > 0 && (
          <CommandGroup heading={t('View Lists')} className="px-2">
            {groupedRoutes.lists.map((route) => (
              <CommandItem
                key={route.id || `list-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="hover:bg-accent group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-muted-foreground text-xs">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {groupedRoutes.pluginRoutes.length > 0 && (
          <CommandGroup heading={t('Plugins')} className="px-2">
            {groupedRoutes.pluginRoutes.map((route) => (
              <CommandItem
                key={route.id || `plugin-${route.name}-${route.path}`}
                onSelect={() => {
                  if (route.path) {
                    navigate(route.path);
                  }
                  close();
                }}
                className="hover:bg-accent group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors"
              >
                {getRouteIcon(route.type)}
                <div className="flex flex-col">
                  <span className="font-medium">{route.name}</span>
                  {route.description && <span className="text-muted-foreground text-xs">{route.description}</span>}
                </div>
                <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-70" />
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      <div className="bg-muted/50 border-t p-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">↑</kbd>
              <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">Enter</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[10px]">Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
};
