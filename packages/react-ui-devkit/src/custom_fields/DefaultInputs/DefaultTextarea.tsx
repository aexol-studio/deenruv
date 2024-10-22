import React from 'react';
import { Textarea } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export function DefaultTextarea() {
    const { field, value, setValue } = useCustomFields<'StringCustomFieldConfig'>();
    return (
        <div>
            <label
                htmlFor={field?.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {field?.name}
            </label>
            <Textarea id={field?.name} value={value as string} onChange={e => setValue(e.target.value)} />
        </div>
    );
}
