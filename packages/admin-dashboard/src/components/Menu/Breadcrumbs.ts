export type MenuBreadcrumb = {
  label: string;
  href?: string;
  current: boolean;
};

export type BreadcrumbNavigationGroup = {
  id: string;
  label: string;
  permitted: boolean;
};

export type BreadcrumbNavigationLink = {
  href: string;
  groupId: string;
  label: string;
  permitted: boolean;
};

const normalizePath = (path: string) => `/${path.split('?')[0].split('#')[0].split('/').filter(Boolean).join('/')}`;

export const buildMenuBreadcrumbs = ({
  pathname,
  groups,
  links,
  extensions,
  fallbackLabels,
}: {
  pathname: string;
  groups: BreadcrumbNavigationGroup[];
  links: BreadcrumbNavigationLink[];
  extensions: { label: string; href: string; permitted: boolean };
  fallbackLabels: string[];
}): MenuBreadcrumb[] => {
  const normalizedPath = normalizePath(pathname);
  const matchingLink = links.find((link) => normalizePath(link.href) === normalizedPath);

  if (matchingLink?.permitted) {
    const matchingGroup = groups.find((group) => group.id === matchingLink.groupId && group.permitted);
    return [
      ...(extensions.permitted
        ? [{ label: extensions.label, href: normalizePath(extensions.href), current: false as const }]
        : []),
      ...(matchingGroup ? [{ label: matchingGroup.label, current: false as const }] : []),
      { label: matchingLink.label, current: true },
    ];
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const fallbackCrumbs = segments
    .map((segment, index) => ({ label: fallbackLabels[index] ?? segment }))
    .filter((crumb) => crumb.label !== '');
  return fallbackCrumbs.map((crumb, index) => ({
    ...crumb,
    current: index === fallbackCrumbs.length - 1,
  }));
};
