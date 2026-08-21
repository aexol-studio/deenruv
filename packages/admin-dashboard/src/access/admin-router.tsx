import { Fragment, type Key, type ReactElement, type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { Routes } from '@deenruv/react-ui-devkit';
import { Navigate, type RouteObject } from 'react-router';
import type { AdminRouteDefinition } from './types.js';
import type { AdministratorAccessState } from '@deenruv/react-ui-devkit';

type CreateAdminRouterRoutesInput = {
  permittedRoutes: AdminRouteDefinition[];
  defaultRoute?: AdminRouteDefinition;
  administratorAccessState: AdministratorAccessState;
  rootElement: ReactElement;
  errorElement: ReactElement;
};

type CommittedRouterOwnerProps<Router extends { dispose(): void }> = {
  createRouter: () => Router;
  /** Remounts router consumers only when their route-table state cannot be reused. */
  remountKey: Key;
  children: (router: Router) => ReactNode;
};

export const CommittedRouterOwner = <Router extends { dispose(): void }>({
  createRouter,
  remountKey,
  children,
}: CommittedRouterOwnerProps<Router>) => {
  const [ownedRouter, setOwnedRouter] = useState<{ router: Router; remountKey: Key }>();
  const activeRouter = useRef<Router | undefined>(undefined);
  const disposedRouters = useRef(new WeakSet<object>());

  useLayoutEffect(() => {
    const nextRouter = createRouter();
    activeRouter.current = nextRouter;
    setOwnedRouter({ router: nextRouter, remountKey });

    return () => {
      if (activeRouter.current === nextRouter) {
        activeRouter.current = undefined;
      }
      globalThis.queueMicrotask(() => {
        if (activeRouter.current !== nextRouter && !disposedRouters.current.has(nextRouter)) {
          disposedRouters.current.add(nextRouter);
          nextRouter.dispose();
        }
      });
    };
  }, [createRouter, remountKey]);

  return ownedRouter && activeRouter.current === ownedRouter.router ? (
    <Fragment key={ownedRouter.remountKey}>{children(ownedRouter.router)}</Fragment>
  ) : null;
};

export const createAdminRouterRoutes = ({
  permittedRoutes,
  defaultRoute,
  administratorAccessState,
  rootElement,
  errorElement,
}: CreateAdminRouterRoutesInput): RouteObject[] => {
  const children: RouteObject[] = permittedRoutes.map(({ id, path, element }) => ({ id, path, element }));

  if (
    administratorAccessState === 'ready' &&
    defaultRoute &&
    !permittedRoutes.some((route) => route.path === Routes.dashboard)
  ) {
    children.push({
      id: 'admin.fallback.dashboard',
      path: Routes.dashboard,
      element: <Navigate to={defaultRoute.path} replace />,
    });
  }
  if (administratorAccessState === 'ready' && defaultRoute) {
    children.push({
      id: 'admin.fallback.wildcard',
      path: '*',
      element: <Navigate to={defaultRoute.path} replace />,
    });
  } else if (administratorAccessState === 'pending') {
    children.push({
      id: 'admin.fallback.pending-access',
      path: '*',
      element: null,
    });
  } else {
    children.push({
      id: 'admin.fallback.unavailable-access',
      path: '*',
      element: errorElement,
    });
  }

  return [{ id: 'admin.root', element: rootElement, errorElement, children }];
};
