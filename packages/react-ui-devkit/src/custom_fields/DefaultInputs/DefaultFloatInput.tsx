import React from 'react';
import { Input } from '@/components';
import { useCustomFields } from '@/custom_fields/context';

export const DefaultFloatInput: React.FC = () => {
    const { field, value, setValue } = useCustomFields<'FloatCustomFieldConfig'>();
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
                onChange={e => setValue(parseFloat(e.target.value || '0'))}
            />
        </div>
    );
};
