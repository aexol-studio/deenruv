import { NavLink, useLocation } from 'react-router-dom';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  cn,
  buttonVariants,
  Routes,
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
  Server,
  Puzzle,
} from 'lucide-react';
import { Permission } from '@deenruv/admin-types';

type NavLink = {
  title: string;
  id: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  requiredPermissions?: Permission[];
};

interface NavProps {
  isCollapsed: boolean;
}

export function Navigation({ isCollapsed }: NavProps) {
  const { t } = useTranslation('common');
  const { t: _pluginT } = useTranslation();
  const location = useLocation();
  const { navMenuData, viewMarkers } = usePluginStore();
  const { userPermissions } = useServer();
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
    }> = [
      {
        label: t('menuGroups.shop'),
        id: 'shop-group',
        links: [
          { title: t('menu.dashboard'), href: Routes.dashboard, id: 'link-dashboard', icon: BarChart },
          {
            title: t('menu.orders'),
            href: Routes.orders.list,
            id: 'link-orders',
            icon: ShoppingCart,
            requiredPermissions: [Permission.ReadOrder],
          },
          {
            title: t('menu.products'),
            href: Routes.products.list,
            id: 'link-products',
            icon: Barcode,
            requiredPermissions: [Permission.ReadProduct, Permission.ReadCatalog],
          },
          {
            title: t('menu.collections'),
            href: Routes.collections.list,
            id: 'link-collections',
            icon: Folder,
            requiredPermissions: [Permission.ReadCollection, Permission.ReadCatalog],
          },
          {
            title: t('menu.customers'),
            href: Routes.customers.list,
            id: 'link-customers',
            icon: UserRoundSearch,
            requiredPermissions: [Permission.ReadCustomer],
          },
          {
            title: t('menu.customerGroups'),
            href: Routes.customerGroups.list,
            id: 'link-customerGroups',
            icon: UsersRound,
            requiredPermissions: [Permission.ReadCustomerGroup],
          },
          {
            title: t('menu.facets'),
            href: Routes.facets.list,
            id: 'link-facets',
            icon: Tag,
            requiredPermissions: [Permission.ReadFacet, Permission.ReadCatalog],
          },
          {
            title: t('menu.assets'),
            href: Routes.assets.list,
            id: 'link-assets',
            icon: Images,
            requiredPermissions: [Permission.ReadAsset, Permission.ReadCatalog],
          },
        ],
      },
      {
        label: t('menuGroups.users'),
        id: 'users-group',
        links: [
          {
            title: t('menu.admins'),
            href: Routes.admins.list,
            id: 'link-admins',
            icon: UserCog,
            requiredPermissions: [Permission.ReadAdministrator],
          },
          {
            title: t('menu.roles'),
            href: Routes.roles.list,
            id: 'link-roles',
            icon: Users,
            requiredPermissions: [Permission.ReadAdministrator],
          },
          {
            title: t('menu.sellers'),
            href: Routes.sellers.list,
            id: 'link-sellers',
            icon: Store,
            requiredPermissions: [Permission.ReadSeller],
          },
        ],
      },
      {
        label: t('menuGroups.promotions'),
        id: 'promotions-group',
        links: [
          {
            title: t('menu.promotions'),
            href: Routes.promotions.list,
            id: 'link-promotions',
            icon: ShoppingCart,
            requiredPermissions: [Permission.ReadPromotion],
          },
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
            requiredPermissions: [Permission.ReadPaymentMethod],
          },
          {
            title: t('menu.shippingMethods'),
            href: Routes.shippingMethods.list,
            id: 'link-shipping-methods',
            icon: Truck,
            requiredPermissions: [Permission.ReadShippingMethod],
          },
          {
            title: t('menu.stock'),
            href: Routes.stockLocations.list,
            id: 'link-stock',
            icon: MapPin,
            requiredPermissions: [Permission.ReadStockLocation],
          },
        ],
      },
      {
        label: t('menuGroups.settings'),
        id: 'settings-group',
        links: [
          {
            title: t('menu.channels'),
            href: Routes.channels.list,
            id: 'link-channels',
            icon: Globe2,
            requiredPermissions: [Permission.ReadChannel],
          },
          {
            title: t('menu.zones'),
            href: Routes.zones.list,
            id: 'link-zones',
            icon: Globe,
            requiredPermissions: [Permission.ReadZone],
          },
          {
            title: t('menu.countries'),
            href: Routes.countries.list,
            id: 'link-countries',
            icon: Flag,
            requiredPermissions: [Permission.ReadCountry],
          },
          {
            title: t('menu.taxCategories'),
            href: Routes.taxCategories.list,
            id: 'link-tax-categories',
            icon: Coins,
            requiredPermissions: [Permission.ReadTaxCategory],
          },
          {
            title: t('menu.taxRates'),
            href: Routes.taxRates.list,
            id: 'link-tax-rates',
            icon: Percent,
            requiredPermissions: [Permission.ReadTaxRate],
          },
          {
            title: t('menu.globalSettings'),
            href: Routes.globalSettings,
            id: 'link-global-settings',
            icon: Cog,
            requiredPermissions: [Permission.ReadSettings],
          },
          {
            title: t('menu.extensions'),
            href: Routes.extensions,
            id: 'Extensions',
            icon: Puzzle,
            requiredPermissions: [Permission.ReadSettings],
          },
          {
            title: t('menu.systemStatus'),
            href: Routes.status,
            id: 'link-system-status',
            icon: Server,
            requiredPermissions: [Permission.ReadSystem],
          },
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

  const permittedNavigationGroups = useMemo(() => {
    return navigationGroups
      .map((group) => ({
        ...group,
        links: group.links.filter((link) =>
          'requiredPermissions' in link
            ? link.requiredPermissions?.some((permission) => userPermissions.includes(permission))
            : true,
        ),
      }))
      .filter((group) => group.links.length > 0);
  }, [userPermissions, navigationGroups]);

  return (
    <div className="relative h-[calc(100vh-110px)] overflow-y-auto lg:h-[calc(100vh-120px)]">
      <div
        data-collapsed={isCollapsed}
        className="group flex h-[calc(100%-70px)] flex-col gap-4 py-2 data-[collapsed=true]:py-2 lg:h-[calc(100%-80px)]"
      >
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={permittedNavigationGroups.map((g) => g.id)}
          value={isCollapsed ? permittedNavigationGroups.map((g) => g.id) : undefined}
        >
          {permittedNavigationGroups.map((group) => (
            <AccordionItem value={group.id}>
              <React.Fragment key={group.id}>
                {!isCollapsed && (
                  <AccordionTrigger className={cn('flex items-center justify-between pr-3 hover:no-underline')}>
                    <div className="flex items-center gap-2 px-6">
                      <h4 className="text-xs font-bold uppercase hover:underline">{group.label}</h4>
                      {getNavigationNotification(group.id)}
                      {viewMarkers ? (
                        <p className="text-muted-foreground dark:text-muted-foreground text-xs font-semibold lowercase">
                          {group.id}
                        </p>
                      ) : null}
                    </div>
                  </AccordionTrigger>
                )}
                <AccordionContent className={cn(isCollapsed ? 'py-2' : 'pb-4')}>
                  <nav
                    id={group.id}
                    className="text-muted-foreground grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
                  >
                    {group.links.map((link, index) => {
                      const notifications = getNavigationNotification(link.id);
                      return (
                        <React.Fragment key={link.id}>
                          {isCollapsed ? (
                            <Tooltip key={index} delayDuration={0}>
                              <TooltipTrigger asChild>
                                <div>
                                  <NavLink to={link.href} viewTransition>
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
                              <TooltipContent side="right" className="relative flex items-center gap-4 capitalize">
                                {viewMarkers ? (
                                  <div className="text-muted-foreground dark:text-muted-foreground text-xs font-semibold lowercase">
                                    {link.id}
                                  </div>
                                ) : null}
                                {link.title}
                                {notifications}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <NavLink to={link.href} viewTransition>
                              <div
                                id={link.id}
                                className={cn(
                                  buttonVariants({ variant: 'navigation-link', size: 'sm' }),
                                  'relative justify-start capitalize',
                                  location.pathname === link.href &&
                                    'bg-muted hover:bg-muted hover:text-muted-foreground dark:bg-muted dark:hover:bg-muted font-semibold opacity-100',
                                )}
                              >
                                {viewMarkers ? (
                                  <div className="text-muted-foreground dark:text-muted-foreground absolute right-2 top-1/2 -translate-y-[50%] text-xs font-semibold lowercase">
                                    {link.id}
                                  </div>
                                ) : null}
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.title}
                                {notifications}
                              </div>
                            </NavLink>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </nav>
                </AccordionContent>
              </React.Fragment>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
