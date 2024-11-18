import React, { useMemo } from 'react';
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
} from '@deenruv/react-ui-devkit';
import { DetailViewStoreProvider, useDetailViewStore } from '@/state/detail-view';
import { useSearchParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';

interface DetailViewProps<T extends DetailLocationID> {
  id?: string;
  locationId: T;
  main: { name: string; component: React.ReactNode };
  defaultTabs: { name: string; component: React.ReactNode; disabled?: boolean }[];
}

export const DetailView = <T extends DetailLocationID>({ id, locationId, main, defaultTabs }: DetailViewProps<T>) => {
  const [searchParams] = useSearchParams();
  const { getDetailViewTabs } = usePluginStore();
  const tab = useMemo(() => searchParams.get('tab') || main.name, [searchParams]);
  const tabs = useMemo(() => {
    return (
      getDetailViewTabs(locationId)?.map(({ label, component }) => ({
        name: label,
        component: React.createElement(component),
      })) || []
    );
  }, [locationId]);

  return (
    <DetailViewStoreProvider id={id} tab={tab} tabs={[main, ...defaultTabs, ...tabs]}>
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
    <div>
      <div className="bg-muted sticky top-0 z-[100] w-full items-center justify-start shadow-xl">
        <div className="flex w-full items-center justify-between py-2">
          {tabs.map((tab) => tab.name)}
          <div className="flex w-full pr-4">
            <div className="flex w-full items-center justify-end gap-2">
              <Button variant="action" onClick={() => {}} className="ml-auto justify-self-end">
                Edit product
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <EllipsisVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-[101]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 md:px-8 md:py-4">
        {tabs.map((tab) => (
          <TabsContent value={tab.name}>{tab.component}</TabsContent>
        ))}
      </div>
    </div>
  );
};
