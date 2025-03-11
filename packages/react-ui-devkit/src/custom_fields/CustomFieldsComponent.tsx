import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import type { ModelTypes, CustomFieldConfigType } from '@deenruv/admin-types';
import { usePluginStore } from '@/plugins';
import { generateInputComponents } from '@/custom_fields/logic';
import { InputFieldComponent } from './InputFieldComponent.js';

export function CustomFieldsComponent<K extends { customFields?: ModelTypes['JSON'] | undefined }>({
    customFields,
    value,
    setValue,
    translation,
    additionalData,
    disabled,
}: {
    customFields: CustomFieldConfigType[];
    value: any;
    setValue: (field: any, data: string | number | boolean) => void;
    translation?: K;
    additionalData?: Record<string, unknown>;
    disabled?: boolean;
}) {
    const { getInputComponent } = usePluginStore();
    const [rendered, setRendered] = useState<
        Record<string, { name: string; component: React.ReactElement; ui?: Record<string, unknown> }[]>
    >({});

    useEffect(() => {
        const result = generateInputComponents(customFields, getInputComponent).reduce(
            (acc, field) => {
                const tab = field.ui?.tab || 'General';
                if (!acc[tab]) acc[tab] = [];
                acc[tab].push(field);
                return acc;
            },
            {} as Record<
                string,
                { name: string; component: React.ReactElement; ui?: Record<string, unknown> }[]
            >,
        );
        setRendered(result);
        return () => {
            setRendered({});
        };
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
                        {fields.map(_f => {
                            const _field = customFields?.find(f => 'name' in f && f.name === _f.name);
                            if (!_field) return null;
                            const field = { ..._field, component: _f.component };
                            let _value = undefined;
                            if (
                                ['LocaleStringCustomFieldConfig', 'LocaleTextCustomFieldConfig'].includes(
                                    _field.__typename,
                                )
                            ) {
                                _value = translation?.customFields
                                    ? translation.customFields[_field.name]
                                    : undefined;
                            } else {
                                _value = value ? value[_field.name] : undefined;
                            }

                            return (
                                <InputFieldComponent
                                    key={field.name}
                                    field={field}
                                    value={_value}
                                    setValue={data => setValue(_field, data as string | number | boolean)}
                                    additionalData={additionalData}
                                    disabled={disabled}
                                />
                            );
                        })}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
