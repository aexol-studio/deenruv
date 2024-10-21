import { CustomFieldConfigType } from '@/graphql/base';
import React from 'react';
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

export function generateCustomFields({ customFields }: { customFields: CustomFieldConfigType[] }) {
  const fields: {
    name: string;
    component: React.ReactElement;
    tab: string;
    customComponent?: string;
  }[] = [];
  for (const field of customFields) {
    const ui = field.ui as Record<string, unknown>;
    if (ui && 'component' in ui) {
      // const extraComponent = getInputComponents(ui.component);
    }
    const tab = ((ui && 'tab' in ui && ui?.tab) || 'General') as string;
    if (field.list) {
      //TODO: Implement list fields
      // fields.push({ ...field, component: <DefaultListWrapper {...generateSingleFields({ field })} />, tab });
      // fields.push({ ...field, component: <DefaultListLineWrapper {...generateSingleFields({ field })} />, tab });
    } else {
      fields.push({
        ...generateSingleFields({ field }),
        tab,
        customComponent: ui && 'component' in ui ? (ui.component as string) : undefined,
      });
    }
  }
  return fields;
}

function generateSingleFields({ field }: { field: CustomFieldConfigType }) {
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
