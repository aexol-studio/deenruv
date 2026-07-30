import { Button, cn, useTranslation } from '@deenruv/react-ui-devkit';
import React from 'react';

import { BrandLogo } from '@/components/BrandLogo.js';

import { Navigation } from './Navigation.js';
import { NavigationFooter } from './NavigationFooter.js';

type SidebarContentProps = {
  isCollapsed: boolean;
  manuallyOpenGroupIds: string[];
  mode: 'desktop' | 'mobile';
  onExpand: () => void;
  onOpenGroupIdsChange: (groupIds: string[]) => void;
  onNavigate: () => void;
  onNavigateHome: () => void;
};

export const SidebarContent = ({
  isCollapsed,
  manuallyOpenGroupIds,
  mode,
  onExpand,
  onOpenGroupIdsChange,
  onNavigate,
  onNavigateHome,
}: SidebarContentProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="deenruv-sidebar flex h-full min-h-0 flex-col bg-[var(--sidebar-canvas)] text-[var(--sidebar-ink)]">
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-[var(--sidebar-hairline)] px-2 lg:h-[72px]',
          isCollapsed ? 'justify-center' : 'pr-10',
        )}
      >
        <Button
          variant="ghost"
          className={cn(
            'h-12 rounded-[4px] px-2 text-[var(--sidebar-ink)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-ink)] focus-visible:ring-[var(--sidebar-focus)]',
            isCollapsed ? 'size-8 p-1' : 'w-full justify-start',
          )}
          onClick={onNavigateHome}
          aria-label={t('goToDashboard')}
          title={t('goToDashboard')}
        >
          <span
            className={cn('flex shrink-0 items-center justify-center', isCollapsed ? 'size-6' : 'h-10 w-full min-w-0')}
          >
            <BrandLogo isCollapsed={isCollapsed} />
          </span>
        </Button>
      </div>
      <Navigation
        isCollapsed={isCollapsed}
        manuallyOpenGroupIds={manuallyOpenGroupIds}
        onExpand={onExpand}
        onOpenGroupIdsChange={onOpenGroupIdsChange}
        onNavigate={onNavigate}
      />
      <NavigationFooter isCollapsed={isCollapsed} mode={mode} onNavigate={onNavigate} />
    </div>
  );
};
