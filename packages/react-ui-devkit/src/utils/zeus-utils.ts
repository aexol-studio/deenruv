import { customFieldSelectors } from '@/selectors';
import { type CustomFieldConfigType, Selector, type ValueTypes } from '@deenruv/admin-types';

type CustomFieldType = boolean | { [key: string]: CustomFieldType };
type CustomFieldsType = Record<string, CustomFieldType>;

export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    Object.keys(source).forEach(key => {
        const targetValue = (target as any)[key];
        const sourceValue = (source as any)[key];

        if (Array.isArray(sourceValue)) {
            (target as any)[key] = [...(Array.isArray(targetValue) ? targetValue : []), ...sourceValue];
        } else if (isObject(sourceValue)) {
            (target as any)[key] = deepMerge(isObject(targetValue) ? targetValue : {}, sourceValue);
        } else {
            (target as any)[key] = sourceValue;
        }
    });

    return target as T & U;
}

const generateCustomFieldsSelector = (customFields: CustomFieldConfigType[]) => {
    const reduced = customFields.reduce(
        (acc, field) => {
            if (field.__typename === 'RelationCustomFieldConfig') {
                acc.customFields = {
                    ...acc.customFields,
                    [field.name]: customFieldSelectors?.[field.entity as keyof typeof customFieldSelectors],
                };

                return acc;
            }
            if (['localeString', 'localeText'].includes(field.type)) {
                acc.translations = {
                    ...acc.translations,
                    languageCode: true,
                    customFields: {
                        ...acc.translations?.customFields,
                        [field.name]: true,
                    },
                };
            } else {
                acc.customFields = {
                    ...acc.customFields,
                    [field.name]: true,
                };
            }
            return acc;
        },
        { translations: { customFields: {} }, customFields: {} } as {
            translations?: { customFields: CustomFieldsType; languageCode: true };
            customFields?: CustomFieldsType;
        },
    );
    if (!Object.keys(reduced.translations?.customFields || {}).length) delete reduced.translations;
    if (!Object.keys(reduced.customFields || {}).length) delete reduced.customFields;
    return reduced;
};

export function mergeSelectorWithCustomFields<T extends object, K extends keyof ValueTypes>(
    selectorA: T,
    key: K,
    customFields?: CustomFieldConfigType[],
): T {
    const selectorB = Selector(key)(generateCustomFieldsSelector(customFields || []) as any);
    return deepMerge(selectorA, selectorB);
}
