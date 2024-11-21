import React, { useMemo } from 'react';
import {
  Button,
  DetailLocationID,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  usePluginStore,
  cn,
  DetailKeys,
  DeenruvTabs,
} from '@deenruv/react-ui-devkit';
import { DetailViewStoreProvider, useDetailViewStore } from '@/state/detail-view';
import { useSearchParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useGFFLP } from '@/lists/useGflp';
import { ModelTypes } from '@deenruv/admin-types';

type DetailViewForm<
  FORMKEY extends keyof ModelTypes,
  FORMKEYS extends keyof ModelTypes[FORMKEY],
  PICKEDKEYS extends keyof Pick<ModelTypes[FORMKEY], FORMKEYS>,
> = {
  key: FORMKEY;
  keys: FORMKEYS[];
  config: {
    [PICKEDKEY in keyof Pick<ModelTypes[FORMKEY], FORMKEYS>]?: {
      validate?: (o: PICKEDKEYS[PICKEDKEY]) => string[] | void;
      initialValue?: PICKEDKEYS[PICKEDKEY];
    };
  };
};

interface DetailViewProps<
  LOCATION extends DetailKeys,
  FORMKEY extends keyof ModelTypes,
  FORMKEYS extends keyof ModelTypes[FORMKEY],
  PICKEDKEYS extends keyof Pick<ModelTypes[FORMKEY], FORMKEYS>,
> {
  id?: string;
  locationId: LOCATION;
  main: {
    name: string;
    label: string;
    component: React.ReactNode;
    sidebar?: React.ReactNode;
    form: DetailViewForm<FORMKEY, FORMKEYS, PICKEDKEYS>;
  };
  defaultTabs: Omit<DeenruvTabs<LOCATION>, 'id'>[];
}

export const DetailView = <LOCATION extends DetailKeys>({
  id,
  locationId,
  main,
  defaultTabs,
}: DetailViewProps<LOCATION, keyof ModelTypes, keyof ModelTypes[keyof ModelTypes], ModelTypes[keyof ModelTypes]>) => {
  const [searchParams] = useSearchParams();
  const { getDetailViewTabs } = usePluginStore();
  const form = useGFFLP(main.form.key, ...(main.form.keys as string[]))({});
  const tab = useMemo(() => searchParams.get('tab') || main.name, [searchParams]);
  const tabs = useMemo(() => {
    return (
      getDetailViewTabs(locationId)?.map(({ name, label, component }) => ({
        name,
        label,
        component: <React.Fragment>{component}</React.Fragment>,
      })) || []
    );
  }, [locationId]);

  return (
    <DetailViewStoreProvider
      id={id}
      tab={tab}
      sidebar={main.sidebar}
      locationId={locationId}
      tabs={[main, ...defaultTabs, ...tabs]}
      form={form}
    >
      <DetailTabs />
    </DetailViewStoreProvider>
  );
};

const DetailTabs = () => {
  const { tabs, tab, setActiveTab, sidebar, setSidebar } = useDetailViewStore(
    'CreateProductInput',
    'products-detail-view',
    ({ tabs, tab, setActiveTab, sidebar, setSidebar }) => ({
      tabs,
      tab,
      setActiveTab,
      sidebar,
      setSidebar,
    }),
  );

  const [, setSearchParams] = useSearchParams();
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const changingTo = tabs.find((t) => t.name === value);
        if (changingTo?.hideSidebar) setSidebar(null);
        else if (changingTo?.sidebarReplacement) setSidebar(changingTo.sidebarReplacement);
        else setSidebar(undefined);
        setActiveTab(value);
        setSearchParams({ tab: value });
      }}
    >
      <div className="bg-muted sticky top-0 z-[100] w-full items-center justify-start shadow-xl">
        <div className="flex w-full items-center justify-between px-4 py-2">
          <div className="flex w-full flex-1">
            <TabsList className="bg-card z-50 h-12 w-full items-center justify-start gap-4 rounded-none rounded-sm px-4 shadow-xl">
              {tabs.map((t) => (
                <TabsTrigger
                  disabled={t.disabled}
                  value={t.name}
                  className={cn('px-8', 'data-[state=active]:bg-secondary bg-card')}
                >
                  {t.label}
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
              {tab.component ? tab.component : <div>Missing component</div>}
              {sidebar}
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};
