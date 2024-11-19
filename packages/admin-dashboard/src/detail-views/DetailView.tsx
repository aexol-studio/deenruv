import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  DetailLocationID,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  usePluginStore,
  ExternalDetailLocationSelector,
  DetailLocations,
  cn,
} from '@deenruv/react-ui-devkit';
import { DetailViewStoreProvider, useDetailViewStore } from '@/state/detail-view';
import { useSearchParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { adminApiQuery } from '@/graphql/client';
import { ValueTypes } from '@deenruv/admin-types';

interface DetailViewProps<T extends DetailLocationID, E extends ExternalDetailLocationSelector[T]> {
  id?: string;
  locationId: T;
  main: { name: string; component: React.ReactNode };
  defaultTabs: { name: string; component: React.ReactNode; disabled?: boolean }[];
}

export const DetailView = <T extends DetailLocationID, E extends ExternalDetailLocationSelector[T]>({
  id,
  locationId,
  main,
  defaultTabs,
}: DetailViewProps<T, E>) => {
  const [searchParams] = useSearchParams();
  const { getDetailViewTabs } = usePluginStore();
  const tab = useMemo(() => searchParams.get('tab') || main.name, [searchParams]);
  const tabs = useMemo(() => {
    return (
      getDetailViewTabs(locationId)?.map(({ label, component }) => ({
        name: label,
        component: <React.Fragment>{React.createElement(component)}</React.Fragment>,
      })) || []
    );
  }, [locationId]);

  return (
    <DetailViewStoreProvider id={id} tab={tab} locationId={locationId} tabs={[main, ...defaultTabs, ...tabs]}>
      <DetailTabs />
    </DetailViewStoreProvider>
  );
};

const DetailTabs = () => {
  const { tabs, tab, setActiveTab, sidebar } = useDetailViewStore(({ tabs, tab, setActiveTab, sidebar }) => ({
    tabs,
    tab,
    setActiveTab,
    sidebar,
  }));
  const [, setSearchParams] = useSearchParams();
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        setActiveTab(value);
        setSearchParams({ tab: value });
      }}
    >
      <div className="bg-muted sticky top-0 z-[100] w-full items-center justify-start shadow-xl">
        <div className="flex w-full items-center justify-between px-4 py-2">
          <div className="flex w-full flex-1">
            <TabsList className="z-50 h-12 w-full items-center justify-start rounded-none px-4 shadow-xl">
              {tabs.map((tab) => (
                <TabsTrigger disabled={tab.disabled} value={tab.name}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="action" onClick={() => {}} className="ml-auto justify-self-end">
              Edit product
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[101] mr-4">
                <DropdownMenuSeparator />
                <DropdownMenuItem>Delete product</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 md:px-8 md:py-4">
        {tabs.map((tab) => (
          <TabsContent value={tab.name}>
            <div className={cn(sidebar ? 'grid grid-cols-[minmax(0,1fr)_400px] gap-4' : 'w-full')}>
              {tab.component}
              {sidebar}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
