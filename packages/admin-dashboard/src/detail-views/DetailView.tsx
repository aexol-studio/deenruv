import React, { useState } from 'react';
import { DetailLocationID, Tabs, TabsContent, TabsList, TabsTrigger } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

interface DetailViewProps<T> {
  locationId: DetailLocationID;
  tabs?: { name: T; label: string; disabled?: boolean }[];
  children: (props: {
    CustomFields: React.ReactNode;
    MainContentMarker: React.ReactNode;
    SideBarMarker: React.ReactNode;
    tab: T;
  }) => React.ReactNode;
}

export const DetailView = <T extends string>({ locationId, tabs, children }: DetailViewProps<T>) => {
  const { t } = useTranslation('products');
  const id = '1';
  const _tabs = tabs ? tabs : [{ name: 'General', label: 'General', disabled: false }];
  const [activeTab, setActiveTab] = useState<T>(_tabs[0].name as T);
  const CustomFields = <div>Custom Fields Content</div>;
  const MainContentMarker = <div>Components Content</div>;
  const SideBarMarker = <div>SideBar Content</div>;

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as T)}>
        <TabsList className="fixed z-50 h-12 w-full items-center justify-start rounded-none px-4 shadow-xl">
          {_tabs.length === 1
            ? null
            : _tabs.map((tab) => (
                <TabsTrigger disabled={tab.disabled} value={tab.name}>
                  {tab.label}
                </TabsTrigger>
              ))}
        </TabsList>
        <div className="mt-12 px-4 py-2 md:px-8 md:py-4">
          {_tabs.map((tab) => (
            <TabsContent value={tab.name}>
              {children({
                CustomFields,
                MainContentMarker,
                SideBarMarker,
                tab: tab.name as T,
              })}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};
