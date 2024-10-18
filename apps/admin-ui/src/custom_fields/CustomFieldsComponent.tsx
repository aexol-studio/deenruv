import React, { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { generateCustomFields } from './logic';
import { CustomFieldConfigType } from '@/graphql/base';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { ProductVariantType } from '@/graphql/draft_order';
import type { LanguageCode } from '@/zeus';

declare global {
  interface Window {
    __ADMIN_UI_CONFIG__: {
      components: { where: string; name: string; componentPath?: string }[];
    };
  }
}

export const CustomFieldsComponent: React.FC<{
  getValue: (field: CustomFieldConfigType, translatable: boolean) => string | number | boolean;
  setValue: (field: CustomFieldConfigType, data: string | number | boolean, translatable: boolean) => void;
  language: LanguageCode;
  customFields?: CustomFieldConfigType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}> = ({ customFields, getValue, setValue, data }) => {
  const [rendered, setRendered] = useState<Record<string, { name: string; component: React.ReactElement }[]>>({});

  useEffect(() => {
    if (!customFields) return;
    generateCustomFields({ customFields }).then((fields) => {
      const result = fields.reduce(
        (acc, field) => {
          if (!acc[field.tab]) acc[field.tab] = [];
          acc[field.tab].push(field);
          return acc;
        },
        {} as Record<string, { name: string; component: React.ReactElement }[]>,
      );
      setRendered(result);
    });
  }, [customFields]);

  return (
    <div className="text-primary-background my-4 flex h-full w-full flex-col gap-4 rounded-lg bg-primary-foreground p-4">
      <span className="text-lg font-semibold">Custom fields</span>
      <Tabs className="w-full" defaultValue="General">
        <TabsList className="w-full justify-start">
          {Object.keys(rendered).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(rendered).map(([tab, fields]) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid min-h-[200px] w-full grid-cols-2 gap-4">
              {fields.map((field) => {
                const _field = customFields?.find((f) => f.name === field.name);
                if (!_field) return null;
                const translatable = _field.type === 'localeText' || _field.type === 'localeString';
                return (
                  <CustomFieldsProvider
                    key={field.name}
                    field={_field}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data={data as any}
                    value={getValue(_field, translatable) || ''}
                    setValue={(data) => setValue(_field, data, translatable)}
                  >
                    <Suspense fallback={<span>Loading...</span>}>
                      <div className="w-1/2">{field.component}</div>
                    </Suspense>
                  </CustomFieldsProvider>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

type DynamicContext<DATA> = {
  field?: CustomFieldConfigType;
  value?: string | number | boolean;
  setValue: (data: string | number | boolean) => void;
  data?: DATA;
};

const CustomFieldsContext = React.createContext<DynamicContext<{ variantToAdd: ProductVariantType }>>({
  field: undefined,
  value: undefined,
  setValue: () => console.error('setValue not implemented'),
  data: undefined,
});
export const CustomFieldsProvider: React.FC<
  PropsWithChildren<DynamicContext<{ variantToAdd: ProductVariantType }>>
> = ({ children, ...value }) => {
  return <CustomFieldsContext.Provider value={value}>{children}</CustomFieldsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomFields = () => {
  if (!React.useContext(CustomFieldsContext)) {
    throw new Error('useCustomFields must be used within a CustomFieldsProvider');
  }
  return React.useContext(CustomFieldsContext);
};
