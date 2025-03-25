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
import { Field } from './context.js';

export function generateInputComponents<T extends Field = CustomFieldConfigType>(
    fields: T[],
    getInputComponent: (id: string) => React.ComponentType<object> | null,
) {
    const result: (T & { component: React.ReactElement })[] = [];
    for (const field of fields) {
        const ui = 'ui' in field ? (field.ui as unknown as Record<string, unknown>) : undefined;
        const tab = ((ui && 'tab' in ui && ui?.tab) || 'General') as string;
        const hidden = ui && 'hidden' in ui && ui.hidden;
        if (hidden) continue;
        const Registered = ui && 'component' in ui && getInputComponent(ui.component as string);
        if (Registered) {
            result.push({
                ...field,
                tab,
                component: typeof Registered === 'function' ? <Registered /> : Registered,
            });
        } else {
            result.push({ ...field, ...generateSingleFields({ field }), tab });
        }
    }
    return result as (T & { component: React.ReactElement })[];
}

function generateSingleFields<T extends { type: string; list?: boolean; ui?: Record<string, unknown> }>({
    field,
}: {
    field: T;
}) {
    const simpleListable = ['float', 'int', 'string', 'text'];
    if (simpleListable.includes(field?.type) && field.list)
        return { ...field, component: <DefaultSimpleListInput /> };
    switch (field.type) {
        case 'boolean':
            return { ...field, component: <DefaultCheckbox /> };
        case 'date-time':
            return { ...field, component: <DefaultTimeSelect /> };
        case 'float':
            return { ...field, component: <DefaultFloatInput /> };
        case 'int':
            return { ...field, component: <DefaultIntInput /> };
        case 'string':
        case 'localeString':
            return { ...field, component: <DefaultTextInput /> };
        case 'text':
        case 'localeText':
            return { ...field, component: field?.ui?.richText ? <DefaultRichText /> : <DefaultTextarea /> };
        case 'relation':
            return { ...field, component: <DefaultRelationInput /> };
        default:
            //TODO: Implement other field types
            return {
                name: '🏗️',
                component: <span className="text-sm font-bold">Not implemented yet</span>,
            };
    }
}
