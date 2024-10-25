import React, { Suspense, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import type { GraphQLTypes, ModelTypes, CustomFieldConfigType } from '@deenruv/admin-types';
import { usePluginStore } from '@/context';
import { CustomFieldsProvider } from '@/custom_fields/context';
import { generateCustomFields } from '@/custom_fields/logic';

export function CustomFieldsComponent<K extends { customFields?: ModelTypes['JSON'] | undefined }>({
    customFields,
    value,
    setValue,
    translation,
}: {
    customFields: CustomFieldConfigType[];
    value: any;
    setValue: (field: any, data: string | number | boolean) => void;
    translation?: K;
}) {
    const { getInputComponent } = usePluginStore();
    const [rendered, setRendered] = useState<
        Record<string, { name: string; component: React.ReactElement }[]>
    >({});

    useEffect(() => {
        const result = generateCustomFields(customFields, getInputComponent).reduce(
            (acc, field) => {
                if (!acc[field.tab]) acc[field.tab] = [];
                acc[field.tab].push(field);
                return acc;
            },
            {} as Record<string, { name: string; component: React.ReactElement }[]>,
        );
        setRendered(result);
    }, []);

    return (
        <Tabs className="w-full" defaultValue="General">
            {Object.keys(rendered).length > 1 && (
                <TabsList className="w-full justify-start">
                    {Object.keys(rendered).map(tab => (
                        <TabsTrigger key={tab} value={tab}>
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
            )}
            {Object.entries(rendered).map(([tab, fields]) => (
                <TabsContent key={tab} value={tab}>
                    <div className="flex flex-wrap gap-4">
                        {fields.map((field, idx) => {
                            const _field = customFields?.find(f => 'name' in f && f.name === field.name);
                            if (!_field) return null;
                            let _value = undefined;
                            if (
                                'name' in _field &&
                                (('type' in _field && _field.type === 'localeText') ||
                                    ('type' in _field && _field.type === 'localeString'))
                            ) {
                                _value = translation?.customFields
                                    ? translation.customFields[_field.name as string]
                                    : undefined;
                            } else if ('name' in _field) {
                                _value = value ? value[_field.name as string] : undefined;
                            }

                            return (
                                <CustomFieldsProvider
                                    key={field.name}
                                    field={
                                        _field as unknown as GraphQLTypes['CustomFieldConfig'][`...on ${typeof _field.__typename}`]
                                    }
                                    value={_value}
                                    setValue={data => setValue(_field, data)}
                                >
                                    <Suspense fallback={<span>Loading...</span>}>
                                        <div className={`flex-1 min-w-[250px] basis-1/3`}>
                                            {field.component}
                                        </div>
                                    </Suspense>
                                </CustomFieldsProvider>
                            );
                        })}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
