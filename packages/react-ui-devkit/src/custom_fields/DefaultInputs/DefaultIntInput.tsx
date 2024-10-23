import React from 'react';
import { CardDescription, Input, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export const DefaultIntInput: React.FC = () => {
    const { field, value, label, description, setValue } = useCustomFields<'IntCustomFieldConfig'>();
    return (
        <div>
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <Input
                id={field?.name}
                type="number"
                value={value as string}
                onChange={e => {
                    setValue(parseInt(e.target.value || '0', 10));
                }}
            />
        </div>
    );
};
