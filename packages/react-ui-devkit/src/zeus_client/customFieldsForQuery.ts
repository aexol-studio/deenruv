import { GraphQLSchemaField } from '@/state/server.js';

type Selector = Record<string, unknown>;

type MappedType = {
    [key: string]: {
        selector: Selector;
    };
};

const MAPPED_TYPES: MappedType = {
    Asset: { selector: { id: true, preview: true, source: true } },
};

const processCustomFields = (fields: GraphQLSchemaField[]): Selector => {
    return fields.reduce<Selector>((acc, { name, type, fields }) => {
        if (fields.length > 0) acc[name] = MAPPED_TYPES[type]?.selector ?? processCustomFields(fields);
        else acc[name] = true;
        return acc;
    }, {});
};

export function customFieldsForQuery<T extends Record<string, any>>(
    currentSelector: T,
    parentFields: GraphQLSchemaField[],
): { [K in keyof T]: T[K] extends object ? ReturnType<typeof customFieldsForQuery> : T[K] } {
    return Object.entries(currentSelector).reduce<Record<string, unknown>>((acc, [key, value]) => {
        const field = parentFields.find(f => f.name === key);
        if (!field) {
            if (typeof value === 'object' && value !== null) {
                acc[key] = customFieldsForQuery(value as Selector, parentFields);
            } else acc[key] = value;
            return acc;
        }
        const customFields = field.fields.find(f => f.name === 'customFields');
        const hasCustomFields = customFields && customFields.type !== 'JSON';

        if (hasCustomFields) {
            acc[key] = {
                ...(typeof value === 'object' ? customFieldsForQuery(value as Selector, field.fields) : {}),
                customFields: processCustomFields(customFields.fields),
            };
        } else if (typeof value === 'object' && value !== null) {
            acc[key] = customFieldsForQuery(value as Selector, field.fields);
        } else acc[key] = value;

        return acc;
    }, {}) as { [K in keyof T]: T[K] extends object ? ReturnType<typeof customFieldsForQuery> : T[K] };
}
