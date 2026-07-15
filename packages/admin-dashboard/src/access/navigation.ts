import type { AdminRouteDefinition, AdminNavigationGroupId } from './types.js';

export type AdminNavigationLink = {
  id: string;
  href: string;
  groupId: AdminNavigationGroupId | string;
  routeId?: string;
  activePaths?: string[];
};

export const matchesNavigationPath = (pathname: string, routePath: string) => {
  const pathnameSegments = pathname.split('/').filter(Boolean);
  const routeSegments = routePath.split('/').filter(Boolean);

  return (
    pathnameSegments.length === routeSegments.length &&
    routeSegments.every((segment, index) => segment.startsWith(':') || segment === pathnameSegments[index])
  );
};

export const getRouteFamilyId = (routeId: string) => routeId.split('.')[0];

export const getNavigationLinkActivePaths = (route: AdminRouteDefinition, routes: AdminRouteDefinition[]) => {
  const routeFamilyId = getRouteFamilyId(route.id);

  const relatedPaths = routes
    .filter((candidate) => getRouteFamilyId(candidate.id) === routeFamilyId)
    .map((candidate) => candidate.path);

  return [...relatedPaths.filter((path) => !path.includes(':')), ...relatedPaths.filter((path) => path.includes(':'))];
};

export const isNavigationLinkActive = (link: AdminNavigationLink, pathname: string) =>
  (link.activePaths?.length ? link.activePaths : [link.href]).some((path) => matchesNavigationPath(pathname, path));

export const getActiveNavigationLinkIds = (links: AdminNavigationLink[], pathname: string) => {
  const exactPathMatches = links.filter((link) => link.href === pathname);

  return exactPathMatches.length > 0
    ? exactPathMatches
    : links.filter((link) => isNavigationLinkActive(link, pathname));
};

export const getActiveNavigationGroupIds = (links: AdminNavigationLink[], pathname: string) => [
  ...new Set(getActiveNavigationLinkIds(links, pathname).map((link) => link.groupId)),
];

export const insertNavigationLink = <T extends { id: string }>(
  links: T[],
  link: T,
  placement?: { linkId: string; where?: 'above' | 'under' },
) => {
  if (!placement) return [...links, link];

  const index = links.findIndex((item) => item.id === placement.linkId);
  if (index === -1) return [...links, link];

  const insertionIndex = placement.where === 'above' ? index : index + 1;
  return [...links.slice(0, insertionIndex), link, ...links.slice(insertionIndex)];
};
