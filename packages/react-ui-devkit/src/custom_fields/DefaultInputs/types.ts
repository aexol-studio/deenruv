import { GraphQLTypes } from '@/zeus';

export type DefaultProps<T> = {
    field: GraphQLTypes['CustomFieldConfig'];
    value: T;
    onChange: (e: T) => void;
};
