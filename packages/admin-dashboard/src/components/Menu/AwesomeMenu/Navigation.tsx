import { NavLink, useLocation } from 'react-router-dom';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  cn,
  buttonVariants,
  Routes,
  usePluginStore,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@deenruv/react-ui-devkit';
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
  UserRoundSearch,
  MapPin,
  Flag,
  Coins,
  Globe,
  Percent,
  CreditCard,
  Truck,
  Cog,
  UsersRound,
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

export function Navigation({ isCollapsed }: NavProps) {
  const { t } = useTranslation('common');
  const { t: _pluginT } = useTranslation();
  const location = useLocation();
  const { navMenuData } = usePluginStore();

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
    }> = [
      {
        label: t('menuGroups.shop'),
        id: 'shop-group',
        links: [
          { title: t('menu.dashboard'), href: Routes.dashboard, id: 'link-dashboard', icon: BarChart },
          { title: t('menu.assets'), href: Routes.assets.list, id: 'link-assets', icon: Images },
          { title: t('menu.products'), href: Routes.products.list, id: 'link-products', icon: Barcode },
          { title: t('menu.customers'), href: Routes.customers.list, id: 'link-customers', icon: UserRoundSearch },
          {
            title: t('menu.customerGroups'),
            href: Routes.customerGroups.list,
            id: 'link-customerGroups',
            icon: UsersRound,
          },
          { title: t('menu.collections'), href: Routes.collections.list, id: 'link-collections', icon: Folder },
          { title: t('menu.facets'), href: Routes.facets.list, id: 'link-facets', icon: Tag },
          { title: t('menu.orders'), href: Routes.orders.list, id: 'link-orders', icon: ShoppingCart },
        ],
      },
      {
        label: t('menuGroups.settings'),
        id: 'settings-group',
        links: [
          { title: t('menu.channels'), href: Routes.channels.list, id: 'link-channels', icon: Globe2 },
          { title: t('menu.zones'), href: Routes.zones.list, id: 'link-zones', icon: Globe },
          { title: t('menu.countries'), href: Routes.countries.list, id: 'link-countries', icon: Flag },
          { title: t('menu.taxCategories'), href: Routes.taxCategories.list, id: 'link-tax-categories', icon: Coins },
          { title: t('menu.taxRates'), href: Routes.taxRates.list, id: 'link-tax-rates', icon: Percent },
          { title: t('menu.globalSettings'), href: Routes.globalSettings, id: 'link-global-settings', icon: Cog },
        ],
      },
      {
        label: t('menuGroups.users'),
        id: 'users-group',
        links: [
          { title: t('menu.admins'), href: Routes.admins.list, id: 'link-admins', icon: UserCog },
          { title: t('menu.roles'), href: Routes.roles.list, id: 'link-roles', icon: Users },
          { title: t('menu.sellers'), href: Routes.sellers.list, id: 'link-sellers', icon: Store },
        ],
      },
      {
        label: t('menuGroups.promotions'),
        id: 'promotions-group',
        links: [
          { title: t('menu.promotions'), href: Routes.promotions.list, id: 'link-promotions', icon: ShoppingCart },
        ],
      },
      {
        label: t('menuGroups.shipping'),
        id: 'shipping-group',
        links: [
          {
            title: t('menu.paymentMethods'),
            href: Routes.paymentMethods.list,
            id: 'link-payment-methods',
            icon: CreditCard,
          },
          {
            title: t('menu.shippingMethods'),
            href: Routes.shippingMethods.list,
            id: 'link-shipping-methods',
            icon: Truck,
          },
          { title: t('menu.stock'), href: Routes.stockLocations.list, id: 'link-stock', icon: MapPin },
        ],
      },
    ];

    const { groups, links } = navMenuData;

    groups.forEach(({ id, labelId, placement }) => {
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

    links.forEach(({ groupId, href, labelId, id, icon, placement }, idx) => {
      const foundGroupIdx = navData.findIndex((group) => group.id === groupId);

      if (foundGroupIdx == -1)
        throw new Error(`Navbar menu group with id ${groupId} was not found.\nPlugin navigation href: ${href}`);

      const newElement = { title: pluginT(labelId), label: pluginT(labelId), href: `/${href}`, id, icon };

      if (!placement) {
        navData[foundGroupIdx].links.push(newElement);
        return;
      }

      const foundIndex = navData[foundGroupIdx].links.findIndex((item) => item.id === placement.linkId);
      const offset = placement.where === 'above' ? 0 : 1;
      navData[foundGroupIdx].links.splice(foundIndex + offset, 0, newElement);
    });

    return navData;
  }, [navMenuData.groups, navMenuData.links, t]);

  return (
    <div className="relative h-[calc(100vh-110px)] overflow-y-auto lg:h-[calc(100vh-120px)]">
      <div
        data-collapsed={isCollapsed}
        className="group flex h-[calc(100%-70px)] flex-col gap-4 py-2 data-[collapsed=true]:py-2 lg:h-[calc(100%-80px)]"
      >
        {navigationGroups.map((group) => (
          <React.Fragment key={group.id}>
            {!isCollapsed && <h4 className="px-6 text-xs font-bold uppercase">{group.label}</h4>}
            <nav
              id={group.id}
              className="text-muted-foreground grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
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
                                buttonVariants({ variant: 'navigation-link', size: 'icon' }),
                                'h-9 w-9',
                                location.pathname === link.href &&
                                  'bg-muted hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:hover:bg-muted opacity-100',
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
                          buttonVariants({ variant: 'navigation-link', size: 'sm' }),
                          'justify-start capitalize',
                          location.pathname === link.href &&
                            'bg-muted hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:hover:bg-muted font-semibold opacity-100',
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
