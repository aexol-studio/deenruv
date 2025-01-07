import React from 'react';
import { CardDescription, Label, Textarea } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export function DefaultTextarea() {
    const { field, value, setValue, label, description } = useCustomFields<'StringCustomFieldConfig'>();

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <Textarea
                id={field?.name}
                value={value as string}
                disabled={field?.readonly}
                onChange={e => setValue(e.target.value)}
            />
        </div>
    );
}
