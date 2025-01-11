import React from 'react';
import { CardDescription, Checkbox, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export const DefaultCheckbox = () => {
    const { field, value, label, description, setValue } = useCustomFields<'BooleanCustomFieldConfig'>();
    return (
        <>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={field?.name}
                    disabled={field?.readonly ?? undefined}
                    checked={value as boolean}
                    onCheckedChange={setValue}
                />
                <Label htmlFor={field?.name}>{label || field?.name}</Label>
            </div>
            <CardDescription>{description}</CardDescription>
        </>
    );
};
