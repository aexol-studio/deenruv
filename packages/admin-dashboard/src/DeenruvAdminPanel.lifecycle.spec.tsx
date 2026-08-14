import { StrictMode, act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CommittedRouterOwner } from './access/admin-router.js';

type TestRouter = {
  id: string;
  dispose: ReturnType<typeof vi.fn>;
};

const globalWindow = globalThis as typeof globalThis & {
  window?: Window;
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
const HTMLElement = function HTMLElement() {};
const HTMLIFrameElement = function HTMLIFrameElement() {};
const document = { activeElement: null };
globalWindow.window = {
  event: undefined,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  HTMLElement,
  HTMLIFrameElement,
  document,
} as unknown as Window;
globalWindow.IS_REACT_ACT_ENVIRONMENT = true;

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
  } as unknown as Element;
};

const flushLifecycle = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('DeenruvAdminPanel router lifecycle', () => {
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
          <CommittedRouterOwner createRouter={createPendingRouter}>{children}</CommittedRouterOwner>
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
          <CommittedRouterOwner createRouter={createReadyRouter}>{children}</CommittedRouterOwner>
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
