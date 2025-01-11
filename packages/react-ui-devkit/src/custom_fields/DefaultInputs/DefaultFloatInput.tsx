import React from 'react';
import { CardDescription, Input, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export const DefaultFloatInput: React.FC = () => {
    const { field, value, label, description, setValue } = useCustomFields<'FloatCustomFieldConfig'>();
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <Input
                id={field?.name}
                type="number"
                disabled={field?.readonly ?? undefined}
                value={value as string}
                onChange={e => setValue(parseFloat(e.target.value || '0'))}
            />
        </div>
    );
};
