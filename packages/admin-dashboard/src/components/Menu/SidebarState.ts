import { useCallback, useEffect, useState } from 'react';

export const SIDEBAR_COLLAPSED_STORAGE_KEY = 'deenruv:admin-sidebar:v1:collapsed';
export const SIDEBAR_GROUPS_STORAGE_KEY = 'deenruv:admin-sidebar:v1:open-groups';

export const parseStoredCollapsed = (value: string | null, fallback = false) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export const parseStoredGroupIds = (value: string | null) => {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
};

export const mergeOpenGroupIds = (storedGroupIds: string[], activeGroupIds: string[]) => [
  ...new Set([...storedGroupIds, ...activeGroupIds]),
];

export const readSidebarStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeSidebarStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Navigation remains usable when browser storage is unavailable.
  }
};

const getInitialCollapsed = () =>
  typeof window === 'undefined' ? false : parseStoredCollapsed(readSidebarStorage(SIDEBAR_COLLAPSED_STORAGE_KEY));

const getInitialOpenGroupIds = () =>
  typeof window === 'undefined' ? [] : parseStoredGroupIds(readSidebarStorage(SIDEBAR_GROUPS_STORAGE_KEY));

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsedState] = useState(getInitialCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [manuallyOpenGroupIds, setManuallyOpenGroupIdsState] = useState<string[]>(getInitialOpenGroupIds);

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    writeSidebarStorage(SIDEBAR_COLLAPSED_STORAGE_KEY, String(collapsed));
  }, []);

  const toggleDesktop = useCallback(() => {
    setIsCollapsedState((collapsed) => {
      const nextCollapsed = !collapsed;
      writeSidebarStorage(SIDEBAR_COLLAPSED_STORAGE_KEY, String(nextCollapsed));
      return nextCollapsed;
    });
  }, []);

  const setManuallyOpenGroupIds = useCallback((groupIds: string[]) => {
    const nextGroupIds = [...new Set(groupIds)];
    setManuallyOpenGroupIdsState(nextGroupIds);
    writeSidebarStorage(SIDEBAR_GROUPS_STORAGE_KEY, JSON.stringify(nextGroupIds));
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const isEditable =
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

      if (
        event.key.toLowerCase() !== 'b' ||
        (!event.metaKey && !event.ctrlKey) ||
        event.altKey ||
        event.shiftKey ||
        isEditable
      ) {
        return;
      }

      event.preventDefault();
      if (window.matchMedia('(min-width: 768px)').matches) toggleDesktop();
      else setIsMobileOpen((open) => !open);
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [toggleDesktop]);

  return {
    isCollapsed,
    isMobileOpen,
    manuallyOpenGroupIds,
    setIsCollapsed,
    setIsMobileOpen,
    setManuallyOpenGroupIds,
    toggleDesktop,
  };
};
