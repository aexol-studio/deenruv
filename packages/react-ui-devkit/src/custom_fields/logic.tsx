import type { CustomFieldConfigType } from '@deenruv/admin-types';
import {
    DefaultCheckbox,
    DefaultTimeSelect,
    DefaultFloatInput,
    DefaultIntInput,
    DefaultTextInput,
    DefaultTextarea,
    DefaultRelationInput,
    // DefaultListWrapper,
    // DefaultListLineWrapper,
} from './DefaultInputs';
import React from 'react';

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
        } else if ('list' in field && field.list) {
            //TODO: Implement list fields
            // fields.push({ ...field, component: <DefaultListWrapper {...generateSingleFields({ field })} />, tab });
            // fields.push({ ...field, component: <DefaultListLineWrapper {...generateSingleFields({ field })} />, tab });
        } else {
            fields.push({ ...field, ...generateSingleFields({ field }), tab });
        }
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
            return { ...field, component: <DefaultFloatInput /> };
        case 'IntCustomFieldConfig':
            return { ...field, component: <DefaultIntInput /> };
        case 'StringCustomFieldConfig':
            return { ...field, component: <DefaultTextInput /> };
        case 'LocaleStringCustomFieldConfig':
            return { ...field, component: <DefaultTextInput /> };
        case 'TextCustomFieldConfig':
            return { ...field, component: <DefaultTextarea /> };
        case 'LocaleTextCustomFieldConfig':
            return { ...field, component: <DefaultTextarea /> };
        case 'RelationCustomFieldConfig':
            return { ...field, component: <DefaultRelationInput /> };
        default:
            //TODO: Implement other field types
            return { name: '🏗️', component: <span className="text-sm font-bold">Not implemented yet</span> };
    }
}
