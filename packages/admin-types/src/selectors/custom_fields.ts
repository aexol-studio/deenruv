import { FromSelectorWithScalars } from '../scalars.js';
import { Selector } from '../zeus/index.js';

const SamePartOfCustomFieldConfig = {
    name: true,
    type: true,
    ui: true,
    label: { languageCode: true, value: true },
    description: { languageCode: true, value: true },
    internal: true,
    list: true,
    nullable: true,
    readonly: true,
};

export const CustomFieldConfigSelector = Selector('CustomFieldConfig')({
    __typename: true,
    '...on BooleanCustomFieldConfig': SamePartOfCustomFieldConfig,
    '...on DateTimeCustomFieldConfig': SamePartOfCustomFieldConfig,
    '...on FloatCustomFieldConfig': SamePartOfCustomFieldConfig,
    '...on TextCustomFieldConfig': SamePartOfCustomFieldConfig,
    '...on LocaleTextCustomFieldConfig': SamePartOfCustomFieldConfig,
    '...on IntCustomFieldConfig': {
        ...SamePartOfCustomFieldConfig,
        max: true,
        min: true,
        step: true,
    },
    '...on LocaleStringCustomFieldConfig': {
        ...SamePartOfCustomFieldConfig,
        length: true,
        pattern: true,
    },
    '...on RelationCustomFieldConfig': {
        ...SamePartOfCustomFieldConfig,
        entity: true,
        scalarFields: true,
    },
    '...on StringCustomFieldConfig': {
        ...SamePartOfCustomFieldConfig,
        length: true,
        options: {
            value: true,
            label: {
                languageCode: true,
                value: true,
            },
        },
        pattern: true,
    },
});

export type CustomFieldConfigType = FromSelectorWithScalars<
    typeof CustomFieldConfigSelector,
    'CustomFieldConfig'
>;
