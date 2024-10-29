import type { CustomFieldConfigType } from '@deenruv/admin-types';
import {
    DefaultCheckbox,
    DefaultTimeSelect,
    DefaultFloatInput,
    DefaultIntInput,
    DefaultTextInput,
    DefaultTextarea,
    DefaultRelationInput,
} from './DefaultInputs';
import React from 'react';
import { DefaultSimpleListInput } from './DefaultInputs/Lists/DefaultSimpleListInput';

export function generateCustomFields(
    customFields: CustomFieldConfigType[],
    getInputComponent: (id: string) => React.ComponentType<{}> | null,
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

function generateSingleFields({ field }: { field: any }) {
    switch (field.__typename) {
        case 'BooleanCustomFieldConfig':
            return { ...field, component: <DefaultCheckbox /> };
        case 'DateTimeCustomFieldConfig':
            return { ...field, component: <DefaultTimeSelect /> };
        case 'FloatCustomFieldConfig':
            if (field.list) return { ...field, component: <DefaultSimpleListInput /> };
            return { ...field, component: <DefaultFloatInput /> };
        case 'IntCustomFieldConfig': {
            if (field.list) return { ...field, component: <DefaultSimpleListInput /> };
            return { ...field, component: <DefaultIntInput /> };
        }
        case 'StringCustomFieldConfig':
            if (field.list) return { ...field, component: <DefaultSimpleListInput /> };
            return { ...field, component: <DefaultTextInput /> };
        case 'LocaleStringCustomFieldConfig':
            return { ...field, component: <DefaultTextInput /> };
        case 'TextCustomFieldConfig': {
            if (field.list) return { ...field, component: <DefaultSimpleListInput /> };
            return { ...field, component: <DefaultTextarea /> };
        }
        case 'LocaleTextCustomFieldConfig':
            return { ...field, component: <DefaultTextarea /> };
        case 'RelationCustomFieldConfig':
            return { ...field, component: <DefaultRelationInput /> };
        default:
            //TODO: Implement other field types
            return { name: '🏗️', component: <span className="text-sm font-bold">Not implemented yet</span> };
    }
}
