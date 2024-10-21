import React, { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { generateCustomFields } from './logic';
import { CustomFieldConfigType } from '@/graphql/base';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import type { LanguageCode, ModelTypes } from '@/zeus';
import { FormField } from '@/lists/useGflp';
import { usePluginStore } from '@deenruv/react-ui-devkit';

export function CustomFieldsComponent<T, K extends { customFields?: ModelTypes['JSON'] | undefined }>({
  customFields,
  value,
  setValue,
  translation,
  data,
}: {
  customFields: CustomFieldConfigType[];
  value: FormField<ModelTypes['JSON']>['value'];
  setValue: (field: CustomFieldConfigType, data: string | number | boolean) => void;
  language?: LanguageCode;
  translation?: K;
  data?: T;
}) {
  const { getInputComponent } = usePluginStore();
  const [rendered, setRendered] = useState<Record<string, { name: string; component: React.ReactElement }[]>>({});

  useEffect(() => {
    const result = generateCustomFields({ customFields }).reduce(
      (acc, field) => {
        if (field.customComponent) {
          const Component = getInputComponent(field.customComponent);
          console.log('field', Component);
          field.component = React.cloneElement(<Component />, { key: field.name, data });
        }
        if (!acc[field.tab]) acc[field.tab] = [];
        acc[field.tab].push(field);
        return acc;
      },
      {} as Record<string, { name: string; component: React.ReactElement }[]>,
    );
    setRendered(result);
  }, []);

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
                let _value = undefined;
                if (_field.type === 'localeText' || _field.type === 'localeString')
                  _value = translation?.customFields ? translation.customFields[_field.name] : undefined;
                else _value = value ? value[_field.name] : undefined;

                return (
                  <CustomFieldsProvider
                    key={field.name}
                    field={_field}
                    data={data}
                    value={_value}
                    setValue={(data) => setValue(_field, data)}
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
}

type DynamicContext<T> = {
  field?: CustomFieldConfigType;
  value?: string | number | boolean;
  setValue: (data: string | number | boolean) => void;
  data?: T;
};

const CustomFieldsContext = React.createContext<DynamicContext<unknown>>({
  field: undefined,
  value: undefined,
  setValue: () => console.error('setValue not implemented'),
  data: undefined,
});
export const CustomFieldsProvider: React.FC<PropsWithChildren<DynamicContext<unknown>>> = ({ children, ...value }) => {
  return <CustomFieldsContext.Provider value={value}>{children}</CustomFieldsContext.Provider>;
};

export const useCustomFields = () => {
  if (!React.useContext(CustomFieldsContext)) {
    throw new Error('useCustomFields must be used within a CustomFieldsProvider');
  }
  return React.useContext(CustomFieldsContext);
};
