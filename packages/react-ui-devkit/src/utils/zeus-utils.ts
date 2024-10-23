import { CustomFieldConfigType, Selector, ValueTypes } from '@deenruv/admin-types';

function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
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
            if (field.type === 'relation') {
                // TODO
                return acc;
            }
            if (field.type === 'localeString' || field.type === 'localeText') {
                acc.translations = {
                    ...acc.translations,
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
            translations?: { customFields: Record<string, boolean> };
            customFields?: Record<string, boolean>;
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
