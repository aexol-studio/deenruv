import type { CustomFieldConfigType } from '@deenruv/admin-types';
import {
    DefaultCheckbox,
    DefaultTimeSelect,
    DefaultFloatInput,
    DefaultIntInput,
    DefaultTextInput,
    DefaultTextarea,
    DefaultRelationInput,
    DefaultRichText,
} from './DefaultInputs';
import React from 'react';
import { DefaultSimpleListInput } from './DefaultInputs/DefaultSimpleListInput';

export function generateCustomFields(
    customFields: CustomFieldConfigType[],
    getInputComponent: (id: string) => React.ComponentType<object> | null,
) {
    const fields: (any & { tab: string; component: React.ReactElement })[] = [];
    for (const field of customFields) {
        const ui = 'ui' in field ? (field.ui as unknown as Record<string, unknown>) : undefined;
        const tab = ((ui && 'tab' in ui && ui?.tab) || 'General') as string;
        const Registered = ui && 'component' in ui && getInputComponent(ui.component as string);
        if (Registered) {
            fields.push({ ...field, tab, component: <Registered /> });
        } else fields.push({ ...field, ...generateSingleFields({ field }), tab });
    }
    return fields;
}

function generateSingleFields({ field }: { field: CustomFieldConfigType }) {
    const simpleListable: Array<CustomFieldConfigType['__typename']> = [
        'FloatCustomFieldConfig',
        'IntCustomFieldConfig',
        'StringCustomFieldConfig',
        'TextCustomFieldConfig',
        'LocaleStringCustomFieldConfig',
        'LocaleTextCustomFieldConfig',
    ];

    if (simpleListable.includes(field?.__typename) && field.list)
        return { ...field, component: <DefaultSimpleListInput /> };

    switch (field.__typename) {
        case 'BooleanCustomFieldConfig':
            return { ...field, component: <DefaultCheckbox /> };
        case 'DateTimeCustomFieldConfig':
            return { ...field, component: <DefaultTimeSelect /> };
        case 'FloatCustomFieldConfig':
            return { ...field, component: <DefaultFloatInput /> };
        case 'IntCustomFieldConfig':
            return { ...field, component: <DefaultIntInput /> };
        case 'StringCustomFieldConfig':
        case 'LocaleStringCustomFieldConfig':
            return { ...field, component: <DefaultTextInput /> };
        case 'TextCustomFieldConfig':
        case 'LocaleTextCustomFieldConfig':
            return { ...field, component: field?.ui?.richText ? <DefaultRichText /> : <DefaultTextarea /> };
        case 'RelationCustomFieldConfig':
            return { ...field, component: <DefaultRelationInput /> };
        default:
            //TODO: Implement other field types
            return {
                name: '🏗️',
                component: <span className="text-sm font-bold">Not implemented yet</span>,
            };
    }
}
