import React, { Suspense, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import type { LanguageCode, GraphQLTypes, ModelTypes, CustomFieldConfigType } from '@deenruv/admin-types';
import { usePluginStore } from '@/context';
import { CustomFieldsProvider } from '@/custom_fields/context';
import { generateCustomFields } from '@/custom_fields/logic';

export function CustomFieldsComponent<T, K extends { customFields?: ModelTypes['JSON'] | undefined }, Z>({
    customFields,
    value,
    setValue,
    translation,
    data,
}: {
    customFields: CustomFieldConfigType[];
    value: any;
    setValue: (field: any, data: string | number | boolean) => void;
    language?: LanguageCode;
    translation?: K;
    data?: T;
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
        <div className="text-primary-background my-4 flex h-full w-full flex-col gap-4 rounded-lg bg-primary-foreground p-4">
            <span className="text-lg font-semibold">Custom fields</span>
            <Tabs className="w-full" defaultValue="General">
                <TabsList className="w-full justify-start">
                    {Object.keys(rendered).map(tab => (
                        <TabsTrigger key={tab} value={tab}>
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {Object.entries(rendered).map(([tab, fields]) => (
                    <TabsContent key={tab} value={tab}>
                        <div className="grid min-h-[200px] w-full grid-cols-2 gap-4">
                            {fields.map(field => {
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
                                        data={data}
                                        value={_value}
                                        setValue={data => setValue(_field, data)}
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
