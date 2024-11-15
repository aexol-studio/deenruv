import React, { useMemo } from 'react';
import { DetailLocationID, Tabs, TabsContent, TabsList, TabsTrigger, usePluginStore } from '@deenruv/react-ui-devkit';
import { DetailViewStoreProvider, useDetailViewStore } from '@/state/detail-view';
import { useSearchParams } from 'react-router-dom';

interface DetailViewProps<T extends DetailLocationID> {
  id?: string;
  locationId: T;
  defaultTabs: { name: string; component: React.ReactNode; disabled?: boolean }[];
}

export const DetailView = <T extends DetailLocationID>({ id, locationId, defaultTabs }: DetailViewProps<T>) => {
  const [searchParams] = useSearchParams();
  const { getDetailViewTabs } = usePluginStore();
  const tabs = useMemo(() => {
    return (
      getDetailViewTabs(locationId)?.map(({ label, component }) => ({
        name: label,
        component: React.createElement(component),
      })) || []
    );
  }, [locationId]);

  return (
    <DetailViewStoreProvider
      id={id}
      tab={(searchParams.get('tab') as T) || defaultTabs[0].name}
      tabs={[...defaultTabs, ...tabs]}
    >
      <DetailTabs />
    </DetailViewStoreProvider>
  );
};

const DetailTabs = () => {
  const { tabs, tab, setActiveTab } = useDetailViewStore(({ tabs, tab, setActiveTab }) => ({
    tabs,
    tab,
    setActiveTab,
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
      <TabsList className="fixed z-50 h-12 w-full items-center justify-start rounded-none px-4 shadow-xl">
        {tabs.map((tab) => (
          <TabsTrigger disabled={tab.disabled} value={tab.name}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-10 px-4 py-2 md:px-8 md:py-4">
        {tabs.map((tab) => (
          <TabsContent value={tab.name}>{tab.component}</TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
