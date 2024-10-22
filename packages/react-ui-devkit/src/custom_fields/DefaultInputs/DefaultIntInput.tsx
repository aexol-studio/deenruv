import React from 'react';
import { Input } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export const DefaultIntInput: React.FC = () => {
    const { field, value, setValue } = useCustomFields<'IntCustomFieldConfig'>();
    return (
        <div>
            <label
                htmlFor={field?.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {field?.name}
            </label>
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
