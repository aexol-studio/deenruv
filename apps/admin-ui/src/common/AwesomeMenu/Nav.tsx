'use client';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NavLink, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/utils';
import { Separator } from '@/components/ui/separator';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePluginStore } from '@deenruv/react-ui-devkit';
import { Routes } from '@/utils';
import {
  BarChart,
  Barcode,
  Store,
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
  LucideIcon,
} from 'lucide-react';

type Link = {
  title: string;
  id: string;
  label?: string;
  href: string;
  icon: LucideIcon;
};

interface NavProps {
  isCollapsed: boolean;
}

export function Nav({ isCollapsed }: NavProps) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { navigation: pluginNavigation } = usePluginStore();

  const navigationGroups = useMemo(() => {
    const baseLinks: Array<{
      label: string;
      id: string;
      links: Array<{ title: string; href: string; id: string; icon: LucideIcon }>;
    }> = [
      {
        label: t('menuGroups.shop'),
        id: 'shop-group',
        links: [
          { title: t('menu.dashboard'), href: Routes.dashboard, id: 'link.dashboard', icon: BarChart },
          { title: t('menu.products'), href: Routes.products, id: 'link.products', icon: Barcode },
          { title: t('menu.collections'), href: Routes.collections, id: 'link.collections', icon: Folder },
          { title: t('menu.facets'), href: Routes.facets, id: 'link.facets', icon: Tag },
          { title: t('menu.orders'), href: Routes.orders, id: 'link.orders', icon: ShoppingCart },
          { title: t('menu.assets'), href: Routes.assets, id: 'link.assets', icon: Images },
        ],
      },
      {
        label: t('menuGroups.settings'),
        id: 'settings-group',
        links: [
          { title: t('menu.channels'), href: Routes.channels, id: 'link.channels', icon: Globe2 },
          { title: t('menu.zones'), href: Routes.zones, id: 'link.zones', icon: Globe },
          { title: t('menu.countries'), href: Routes.countries, id: 'link.countries', icon: Flag },
          {
            title: t('menu.taxCategories'),
            href: Routes.taxCategories,
            id: 'link.taxCategories',
            icon: Coins,
          },
          { title: t('menu.taxRates'), href: Routes.taxRates, id: 'link.taxRates', icon: Percent },
        ],
      },
      {
        label: t('menuGroups.users'),
        id: 'users-group',
        links: [
          { title: t('menu.admins'), href: Routes.admins, id: 'link.admins', icon: UserCog },
          { title: t('menu.roles'), href: Routes.roles, id: 'link.roles', icon: Users },
          { title: t('menu.sellers'), href: Routes.sellers, id: 'link.sellers', icon: Store },
        ],
      },
      {
        label: t('menuGroups.shipping'),
        id: 'shipping-group',
        links: [
          {
            title: t('menu.paymentMethods'),
            href: Routes.paymentMethods,
            id: 'link.paymentMethods',
            icon: CreditCard,
          },
          {
            title: t('menu.shippingMethods'),
            href: Routes.shippingMethods,
            id: 'link.shippingMethods',
            icon: Truck,
          },
          { title: t('menu.stock'), href: Routes.stockLocations, id: 'link.stock', icon: MapPin },
        ],
      },
    ];

    pluginNavigation.forEach((el, idx) => {
      const newElement = { title: el.name, href: el.route, id: `${el.name}-${idx}`, icon: BarChart };

      const foundGroupIdx = baseLinks.findIndex((group) => group.id === el.location.groupId);

      if (!foundGroupIdx) {
        console.log('group not found for navigation: ', el.route);
        return;
      }

      const foundIndex = baseLinks[foundGroupIdx].links.findIndex((item) => item.id === el.location.id);

      if (!foundIndex) {
        baseLinks[foundGroupIdx].links.push(newElement);
      } else {
        baseLinks[foundGroupIdx].links.splice(foundIndex + 1, 0, newElement);
      }
    });

    return baseLinks;
  }, [pluginNavigation]);

  return (
    <div className="relative h-[calc(100vh-70px)] overflow-y-auto lg:h-[calc(100vh-120px)]">
      <div
        data-collapsed={isCollapsed}
        className="group flex h-[calc(100%-70px)] flex-col gap-4 py-2 data-[collapsed=true]:py-2 lg:h-[calc(100%-80px)]"
      >
        {navigationGroups.map((data) => (
          <>
            {!isCollapsed && <h4 className="px-6 text-xs font-bold uppercase text-gray-400">{data.label}</h4>}
            <nav
              id={data.id}
              className="grid gap-1 px-2 text-zinc-500 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
            >
              {data.links.map((link, index) =>
                isCollapsed ? (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div>
                        <NavLink to={link.href}>
                          <div
                            className={cn(
                              buttonVariants({ variant: 'ghost', size: 'icon' }),
                              'h-9 w-9',
                              location.pathname === link.href &&
                                'bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                            )}
                          >
                            <link.icon className="h-6 w-6" />
                            <span className="sr-only">{link.title}</span>
                          </div>
                        </NavLink>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4 capitalize">
                      {link.title}
                      {/* {link.label && <span className="ml-auto text-muted-foreground">{link.label}</span>} */}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink to={link.href} key={index}>
                    <div
                      key={index}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        location.pathname === link.href &&
                          'bg-muted font-semibold text-black hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                        'justify-start capitalize',
                      )}
                    >
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.title}
                      {/* {link.label && (
                        <span
                          className={cn(
                            'ml-auto',
                            location.pathname === link.href && 'text-background dark:text-white',
                          )}
                        >
                          {link.label}
                        </span>
                      )} */}
                    </div>
                  </NavLink>
                ),
              )}
            </nav>
            <Separator orientation="horizontal" />
          </>
        ))}
      </div>
    </div>
  );
}
