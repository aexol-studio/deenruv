import { GraphQLTypes } from '@/zeus';
import React, { PropsWithChildren } from 'react';

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

export function useCustomFields<T extends GraphQLTypes['CustomFieldConfig']['__typename'], K>() {
    if (!React.useContext(CustomFieldsContext)) {
        throw new Error('useCustomFields must be used within a CustomFieldsProvider');
    }
    return React.useContext(CustomFieldsContext) as DynamicContext<T, K>;
}
