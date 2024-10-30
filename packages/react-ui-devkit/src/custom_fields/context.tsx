import type { GraphQLTypes } from '@deenruv/admin-types';
import React, { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

export type DynamicContext<T extends GraphQLTypes['CustomFieldConfig']['__typename'], K, Z = any> = {
    field?: GraphQLTypes['CustomFieldConfig'][`...on ${T}`];
    value?: Z;
    setValue: (data: Z) => void;
    data?: K;
    label?: string;
    description?: string;
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
> = ({ children, ..._value }) => {
    const {
        i18n: { language },
    } = useTranslation();

    const translated = useMemo(
        () => ({
            label: _value?.field?.label?.find(el => el.languageCode === language)?.value,
            description: _value?.field?.description?.find(el => el.languageCode === language)?.value,
        }),
        [language, _value?.field?.label, _value?.field?.description],
    );

    const value = useMemo(
        () => ({
            ..._value,
            ...translated,
        }),
        [_value, translated],
    );

    return <CustomFieldsContext.Provider value={value}>{children}</CustomFieldsContext.Provider>;
};

export function useCustomFields<Z extends keyof CustomFieldConfigMap, T = any>() {
    type FieldType = CustomFieldConfigMap[Z];
    if (!React.useContext(CustomFieldsContext)) {
        throw new Error('useCustomFields must be used within a CustomFieldsProvider');
    }
    return React.useContext(CustomFieldsContext) as DynamicContext<
        GraphQLTypes['CustomFieldConfig']['__typename'],
        FieldType,
        T
    >;
}
