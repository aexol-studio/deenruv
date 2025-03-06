import React from 'react';
import { CardDescription, Input, Label } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export function DefaultTextInput() {
    const { field, value, label, description, setValue, disabled } = useCustomFields<string>();
    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <Input
                id={field?.name}
                type="text"
                value={value as string}
                disabled={disabled ?? field?.readonly ?? undefined}
                onChange={e => {
                    setValue(e.target.value);
                }}
            />
        </div>
    );
}
