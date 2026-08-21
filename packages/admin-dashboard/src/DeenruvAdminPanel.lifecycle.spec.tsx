import { StrictMode, act, useCallback, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, type RouterState } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CommittedRouterOwner } from './access/admin-router.js';

type TestRouter = {
  id: string;
  dispose: ReturnType<typeof vi.fn>;
};

const HTMLElement = function HTMLElement() {};
const HTMLIFrameElement = function HTMLIFrameElement() {};
const document = { activeElement: null };
type TestWindow = {
  event: undefined;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  HTMLElement: typeof HTMLElement;
  HTMLIFrameElement: typeof HTMLIFrameElement;
  document: typeof document;
};
const globalWindow = globalThis as unknown as {
  window?: TestWindow;
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

beforeEach(() => {
  globalWindow.window = {
    event: undefined,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    HTMLElement,
    HTMLIFrameElement,
    document,
  };
  globalWindow.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  delete globalWindow.window;
  delete globalWindow.IS_REACT_ACT_ENVIRONMENT;
});

const createContainer = () => {
  const ownerDocument = {
    nodeType: 9,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' },
    activeElement: null,
    defaultView: globalWindow.window,
  };
  return {
    nodeType: 1,
    tagName: 'DIV',
    ownerDocument,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  } as unknown as Parameters<typeof createRoot>[0];
};

const flushLifecycle = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('DeenruvAdminPanel router lifecycle', () => {
  it('retains provider state when mount feedback replaces an equivalent router', async () => {
    const routers: TestRouter[] = [];
    const initializedStates: number[] = [];
    let nextState = 0;
    let consumerMounts = 0;
    const RouterStateConsumer = ({ replaceRouter }: { replaceRouter: () => void }) => {
      const [initializedState] = useState(() => ++nextState);
      initializedStates.push(initializedState);
      useLayoutEffect(() => {
        consumerMounts++;
        replaceRouter();
      }, [replaceRouter]);
      return null;
    };
    const Harness = () => {
      const [factoryVersion, setFactoryVersion] = useState(0);
      const replaceRouter = useCallback(() => setFactoryVersion((version) => version + 1), []);
      const createRouter = useCallback(() => {
        const router = { id: `equivalent-${factoryVersion}`, dispose: vi.fn() };
        routers.push(router);
        return router;
      }, [factoryVersion]);
      return (
        <CommittedRouterOwner createRouter={createRouter} remountKey="ready:dashboard">
          {() => <RouterStateConsumer replaceRouter={replaceRouter} />}
        </CommittedRouterOwner>
      );
    };
    const root = createRoot(createContainer());

    await act(async () => root.render(<Harness />));
    await flushLifecycle();

    expect(routers).toHaveLength(2);
    expect(routers[0].dispose).toHaveBeenCalledOnce();
    expect(routers[1].dispose).not.toHaveBeenCalled();
    expect(consumerMounts).toBe(1);
    expect(new Set(initializedStates)).toEqual(new Set([1]));

    await act(async () => root.unmount());
    await flushLifecycle();

    expect(routers[1].dispose).toHaveBeenCalledOnce();
  });

  it('remounts router state consumers when pending access resolves or route IDs change', async () => {
    const deepLink = '/extensions/storefront-menus';
    const pendingRouters: ReturnType<typeof createMemoryRouter>[] = [];
    const readyRouters: ReturnType<typeof createMemoryRouter>[] = [];
    const changedRouteRouters: ReturnType<typeof createMemoryRouter>[] = [];
    const initializedRouteIds: Array<string | undefined> = [];
    const createPendingRouter = () => {
      const router = createMemoryRouter(
        [
          {
            id: 'admin.root',
            children: [{ id: 'admin.fallback.pending-access', path: '*', element: null }],
          },
        ],
        { initialEntries: [deepLink] },
      );
      pendingRouters.push(router);
      return router;
    };
    const createReadyRouter = () => {
      const router = createMemoryRouter(
        [
          {
            id: 'admin.root',
            children: [{ id: 'storefront.menus', path: 'extensions/storefront-menus', element: null }],
          },
        ],
        { initialEntries: [deepLink] },
      );
      readyRouters.push(router);
      return router;
    };
    const createChangedRouteRouter = () => {
      const router = createMemoryRouter(
        [
          {
            id: 'admin.root',
            children: [{ id: 'storefront.menus.v2', path: 'extensions/storefront-menus', element: null }],
          },
        ],
        { initialEntries: [deepLink] },
      );
      changedRouteRouters.push(router);
      return router;
    };
    const RouterStateConsumer = ({ router }: { router: ReturnType<typeof createMemoryRouter> }) => {
      const [initializedState] = useState<RouterState>(router.state);
      initializedRouteIds.push(initializedState.matches.at(-1)?.route.id);
      return null;
    };
    const root = createRoot(createContainer());

    await act(async () => {
      root.render(
        <StrictMode>
          <CommittedRouterOwner createRouter={createPendingRouter} remountKey="pending">
            {(router) => <RouterStateConsumer router={router} />}
          </CommittedRouterOwner>
        </StrictMode>,
      );
    });
    await flushLifecycle();

    expect(pendingRouters).toHaveLength(2);
    expect(pendingRouters.at(-1)?.state.location.pathname).toBe(deepLink);
    expect(pendingRouters.at(-1)?.state.matches.at(-1)?.route.id).toBe('admin.fallback.pending-access');
    expect(initializedRouteIds.at(-1)).toBe('admin.fallback.pending-access');

    await act(async () => {
      root.render(
        <StrictMode>
          <CommittedRouterOwner createRouter={createReadyRouter} remountKey="ready:storefront.menus">
            {(router) => <RouterStateConsumer router={router} />}
          </CommittedRouterOwner>
        </StrictMode>,
      );
    });
    await flushLifecycle();

    expect(readyRouters).toHaveLength(1);
    expect(readyRouters[0].state.location.pathname).toBe(deepLink);
    expect(readyRouters[0].state.matches.at(-1)?.route.id).toBe('storefront.menus');
    expect(initializedRouteIds.at(-1)).toBe('storefront.menus');

    await act(async () => {
      root.render(
        <StrictMode>
          <CommittedRouterOwner createRouter={createChangedRouteRouter} remountKey="ready:storefront.menus.v2">
            {(router) => <RouterStateConsumer router={router} />}
          </CommittedRouterOwner>
        </StrictMode>,
      );
    });
    await flushLifecycle();

    expect(changedRouteRouters).toHaveLength(1);
    expect(changedRouteRouters[0].state.location.pathname).toBe(deepLink);
    expect(changedRouteRouters[0].state.matches.at(-1)?.route.id).toBe('storefront.menus.v2');
    expect(initializedRouteIds.at(-1)).toBe('storefront.menus.v2');

    await act(async () => root.unmount());
    await flushLifecycle();
  });

  it('owns routers through Strict Mode replay, permission replacement, and final unmount', async () => {
    const pendingRouters: TestRouter[] = [];
    const readyRouters: TestRouter[] = [];
    const createPendingRouter = () => {
      const router = { id: `pending-${pendingRouters.length}`, dispose: vi.fn() };
      pendingRouters.push(router);
      return router;
    };
    const createReadyRouter = () => {
      const router = { id: `ready-${readyRouters.length}`, dispose: vi.fn() };
      readyRouters.push(router);
      return router;
    };
    const renderedRouters: Array<{ router: TestRouter; disposalCount: number }> = [];
    const children = (router: TestRouter) => {
      renderedRouters.push({ router, disposalCount: router.dispose.mock.calls.length });
      return null;
    };
    const root = createRoot(createContainer());

    await act(async () => {
      root.render(
        <StrictMode>
          <CommittedRouterOwner createRouter={createPendingRouter} remountKey="pending">
            {children}
          </CommittedRouterOwner>
        </StrictMode>,
      );
    });
    await flushLifecycle();

    expect(pendingRouters).toHaveLength(2);
    expect(pendingRouters[0].dispose).toHaveBeenCalledOnce();
    expect(pendingRouters[1].dispose).not.toHaveBeenCalled();
    expect(renderedRouters.at(-1)?.router).toBe(pendingRouters[1]);

    await act(async () => {
      root.render(
        <StrictMode>
          <CommittedRouterOwner createRouter={createReadyRouter} remountKey="ready:dashboard">
            {children}
          </CommittedRouterOwner>
        </StrictMode>,
      );
    });
    await flushLifecycle();

    expect(readyRouters).toHaveLength(1);
    expect(pendingRouters[1].dispose).toHaveBeenCalledOnce();
    expect(readyRouters[0].dispose).not.toHaveBeenCalled();
    expect(renderedRouters.at(-1)?.router).toBe(readyRouters[0]);
    expect(renderedRouters.every(({ disposalCount }) => disposalCount === 0)).toBe(true);

    await act(async () => root.unmount());
    await flushLifecycle();

    expect(readyRouters[0].dispose).toHaveBeenCalledOnce();
    expect([...pendingRouters, ...readyRouters].every((router) => router.dispose.mock.calls.length === 1)).toBe(true);
  });
});
