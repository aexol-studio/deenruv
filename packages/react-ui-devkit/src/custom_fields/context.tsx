import type { GraphQLTypes } from '@deenruv/admin-types';
import React, { PropsWithChildren } from 'react';

export type CustomFieldConfigMap = {
    BooleanCustomFieldConfig: {
        data: boolean;
    };
    StringCustomFieldConfig: {};
    LocaleStringCustomFieldConfig: {};
    IntCustomFieldConfig: {};
    FloatCustomFieldConfig: {};
    DateTimeCustomFieldConfig: {};
    RelationCustomFieldConfig: {};
    TextCustomFieldConfig: {};
    LocaleTextCustomFieldConfig: {};
};

export type DynamicContext<T extends GraphQLTypes['CustomFieldConfig']['__typename'], K> = {
    field?: GraphQLTypes['CustomFieldConfig'][`...on ${T}`];
    value?: string | number | boolean;
    setValue: (data: string | number | boolean) => void;
    data?: K;
};

export const CustomFieldsContext = React.createContext<
    DynamicContext<GraphQLTypes['CustomFieldConfig']['__typename'], unknown>
>({
    field: undefined,
    value: undefined,
    setValue: () => console.error('setValue not implemented'),
    data: undefined,
});
export const CustomFieldsProvider: React.FC<
    PropsWithChildren<DynamicContext<GraphQLTypes['CustomFieldConfig']['__typename'], unknown>>
> = ({ children, ...value }) => {
    return <CustomFieldsContext.Provider value={value}>{children}</CustomFieldsContext.Provider>;
};

export function useCustomFields<Z extends keyof CustomFieldConfigMap>() {
    type FieldType = CustomFieldConfigMap[Z];
    if (!React.useContext(CustomFieldsContext)) {
        throw new Error('useCustomFields must be used within a CustomFieldsProvider');
    }
    return React.useContext(CustomFieldsContext) as DynamicContext<
        GraphQLTypes['CustomFieldConfig']['__typename'],
        FieldType
    >;
}
