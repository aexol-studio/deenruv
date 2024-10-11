'use client';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NavLink, useLocation } from 'react-router-dom';
import { buttonVariants } from '@/utils';
import { Separator } from '@/components/ui/separator';
import React, { useMemo } from 'react';
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
} from 'lucide-react';

type NavLink = {
  title: string;
  id: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

interface NavProps {
  isCollapsed: boolean;
}

export function Nav({ isCollapsed }: NavProps) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { navMenuData } = usePluginStore();

  const navigationGroups = useMemo(() => {
    const navData: Array<{
      label: string;
      id: string;
      links: Array<NavLink>;
    }> = [
      {
        label: t('menuGroups.shop'),
        id: 'shop-group',
        links: [
          { title: t('menu.dashboard'), href: Routes.dashboard, id: 'link-dashboard', icon: BarChart },
          { title: t('menu.products'), href: Routes.products, id: 'link-products', icon: Barcode },
          { title: t('menu.collections'), href: Routes.collections, id: 'link-collections', icon: Folder },
          { title: t('menu.facets'), href: Routes.facets, id: 'link-facets', icon: Tag },
          { title: t('menu.orders'), href: Routes.orders, id: 'link-orders', icon: ShoppingCart },
          { title: t('menu.assets'), href: Routes.assets, id: 'link-assets', icon: Images },
        ],
      },
      {
        label: t('menuGroups.settings'),
        id: 'settings-group',
        links: [
          { title: t('menu.channels'), href: Routes.channels, id: 'link-channels', icon: Globe2 },
          { title: t('menu.zones'), href: Routes.zones, id: 'link-zones', icon: Globe },
          { title: t('menu.countries'), href: Routes.countries, id: 'link-countries', icon: Flag },
          {
            title: t('menu.taxCategories'),
            href: Routes.taxCategories,
            id: 'link-tax-categories',
            icon: Coins,
          },
          { title: t('menu.taxRates'), href: Routes.taxRates, id: 'link-tax-rates', icon: Percent },
        ],
      },
      {
        label: t('menuGroups.users'),
        id: 'users-group',
        links: [
          { title: t('menu.admins'), href: Routes.admins, id: 'link-admins', icon: UserCog },
          { title: t('menu.roles'), href: Routes.roles, id: 'link-roles', icon: Users },
          { title: t('menu.sellers'), href: Routes.sellers, id: 'link-sellers', icon: Store },
        ],
      },
      {
        label: t('menuGroups.shipping'),
        id: 'shipping-group',
        links: [
          {
            title: t('menu.paymentMethods'),
            href: Routes.paymentMethods,
            id: 'link-payment-methods',
            icon: CreditCard,
          },
          {
            title: t('menu.shippingMethods'),
            href: Routes.shippingMethods,
            id: 'link-shipping-methods',
            icon: Truck,
          },
          { title: t('menu.stock'), href: Routes.stockLocations, id: 'link-stock', icon: MapPin },
        ],
      },
    ];

    const { groups, links } = navMenuData;

    groups.forEach(({ id, label, placement }) => {
      let foundGroupIdx = -1;
      const newGroup = { id, label, links: [] };
      if (placement?.groupId) {
        foundGroupIdx = navData.findIndex((group) => group.id === placement.groupId);
      }

      if (foundGroupIdx == -1) {
        navData.push(newGroup);
      } else {
        navData.splice(foundGroupIdx + 1, 0, newGroup);
      }
    });

    links.forEach(({ groupId, href, label, id, icon, placement }, idx) => {
      let foundGroupIdx = navData.findIndex((group) => group.id === groupId);

      if (foundGroupIdx == -1)
        throw new Error(`Navbar menu group with id ${groupId} was not found.\nPlugin navigation href: ${href}`);

      const newElement = { title: label, href: href, id, icon };

      if (!placement) {
        navData[foundGroupIdx].links.push(newElement);
        return;
      }

      const foundIndex = navData[foundGroupIdx].links.findIndex((item) => item.id === placement.linkId);
      const offset = placement.where === 'above' ? 0 : 1;
      navData[foundGroupIdx].links.splice(foundIndex + offset, 0, newElement);
    });

    return navData;
  }, [navMenuData.groups, navMenuData.links]);

  return (
    <div className="relative h-[calc(100vh-70px)] overflow-y-auto lg:h-[calc(100vh-120px)]">
      <div
        data-collapsed={isCollapsed}
        className="group flex h-[calc(100%-70px)] flex-col gap-4 py-2 data-[collapsed=true]:py-2 lg:h-[calc(100%-80px)]"
      >
        {navigationGroups.map((group) => (
          <React.Fragment key={group.id}>
            {!isCollapsed && <h4 className="px-6 text-xs font-bold uppercase text-gray-400">{group.label}</h4>}
            <nav
              id={group.id}
              className="grid gap-1 px-2 text-zinc-500 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
            >
              {group.links.map((link, index) => (
                <React.Fragment key={link.id}>
                  {isCollapsed ? (
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
                    <NavLink to={link.href}>
                      <div
                        id={link.id}
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
                  )}
                </React.Fragment>
              ))}
            </nav>
            <Separator orientation="horizontal" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
