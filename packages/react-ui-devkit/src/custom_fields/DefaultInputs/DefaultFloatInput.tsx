import React from 'react';
import { CardDescription, Input, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';
import { capitalizeFirstLetter, camelCaseToSpaces } from '@/utils';

export const DefaultFloatInput: React.FC = () => {
    const { field, value, label, description, setValue, disabled } = useCustomFields<string>();
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>
                {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
            </Label>
            <CardDescription>{description}</CardDescription>
            <Input
                id={field?.name}
                type="number"
                step={0.01}
                disabled={disabled ?? field?.readonly ?? undefined}
                value={value as string}
                onChange={e => {
                    const float = parseFloat(e.target.value || '0');
                    setValue(float.toString());
                }}
            />
        </div>
    );
};
