import React, { PropsWithChildren, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type Field = {
    name: string;
    type: string;
    list?: boolean;
    readonly?: boolean | null;
    ui?: Record<string, unknown>;
    label?: { languageCode: string; value: string }[] | null;
    description?: { languageCode: string; value: string }[] | null;
    entity?: string;
};

export type DynamicContext<T extends Field, Z, K = Record<string, unknown>> = {
    field?: T | undefined;
    value?: Z;
    setValue: (data: Z) => void;
    label?: string;
    description?: string;
    additionalData?: K;
    disabled?: boolean;
};

export const CustomFieldsContext = React.createContext<DynamicContext<Field, unknown>>({
    field: undefined,
    value: undefined,
    setValue: () => console.error('setValue not implemented'),
});
export const CustomFieldsProvider: React.FC<
    PropsWithChildren<Omit<DynamicContext<Field, unknown>, 'label' | 'description'>>
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

    const value = useMemo(() => ({ ..._value, ...translated }), [_value, translated]);

    return <CustomFieldsContext.Provider value={value}>{children}</CustomFieldsContext.Provider>;
};

export function useCustomFields<T, Z extends Field = Field>() {
    if (!React.useContext(CustomFieldsContext)) {
        throw new Error('useCustomFields must be used within a CustomFieldsProvider');
    }
    return React.useContext(CustomFieldsContext) as DynamicContext<Z, T, any>;
}
