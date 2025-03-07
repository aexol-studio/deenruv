import { GraphQLSchemaField } from '@/state/server.js';

type Selector = Record<string, unknown>;

type MappedType = { [key: string]: { selector: Selector } };

const MAPPED_TYPES: MappedType = {
    Asset: { selector: { id: true, preview: true, source: true } },
};

const processCustomFields = (fields: GraphQLSchemaField[]): Selector => {
    return fields.reduce<Selector>((acc, { name, type, fields }) => {
        if (SKIPPED_FIELDS.has(name)) return acc;
        if (fields.length > 0) acc[name] = MAPPED_TYPES[type]?.selector ?? processCustomFields(fields);
        else acc[name] = true;
        return acc;
    }, {});
};

const SKIPPED_FIELDS = new Set(['checker', 'handler']);
export function customFieldsForQuery<T extends Record<string, any>>(
    currentSelector: T,
    parentFields: GraphQLSchemaField[],
): { [K in keyof T]: T[K] extends object ? ReturnType<typeof customFieldsForQuery> : T[K] } {
    const customFields = parentFields.find(f => f.name === 'customFields');
    const hasCustomFields = customFields && customFields.type !== 'JSON';

    const processedSelector = Object.entries(currentSelector).reduce<Record<string, unknown>>(
        (acc, [key, value]) => {
            const field = parentFields.find(f => f.name === key);
            if (!field) {
                acc[key] =
                    typeof value === 'object' && value !== null
                        ? customFieldsForQuery(value as Selector, parentFields)
                        : value;
                return acc;
            }

            const fieldCustomFields = field.fields.find(f => f.name === 'customFields');
            const hasFieldCustomFields = fieldCustomFields && fieldCustomFields.type !== 'JSON';

            if (hasFieldCustomFields) {
                acc[key] = {
                    ...(typeof value === 'object'
                        ? customFieldsForQuery(value as Selector, field.fields)
                        : {}),
                    customFields: processCustomFields(fieldCustomFields.fields),
                };
            } else if (typeof value === 'object' && value !== null) {
                acc[key] = customFieldsForQuery(value as Selector, field.fields);
            } else {
                acc[key] = value;
            }

            return acc;
        },
        {},
    );

    type Return = {
        [K in keyof T]: T[K] extends object ? ReturnType<typeof customFieldsForQuery> : T[K];
    };

    if (hasCustomFields) {
        return { ...processedSelector, customFields: processCustomFields(customFields.fields) } as Return;
    }

    return processedSelector as Return;
}
