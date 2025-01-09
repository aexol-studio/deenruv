import React from 'react';
import {
    Label,
    Option,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/atoms';
import { SelectProps } from '@radix-ui/react-select';

interface CustomSelectProps extends SelectProps {
    options: Option[] | undefined;
    label?: string;
    size?: 'sm' | 'base';
    errors?: string[];
}

export const SimpleSelect: React.FC<CustomSelectProps> = ({
    defaultValue,
    value,
    onValueChange,
    options,
    label,
    size = 'base',
    errors,
}) => {
    return (
        <div className="flex flex-col w-full gap-2">
            {label && <Label>{label}</Label>}
            <Select defaultValue={defaultValue} onValueChange={onValueChange} value={value}>
                <SelectTrigger {...(size === 'sm' && { className: 'h-[30px] text-[13px]' })}>
                    <SelectValue placeholder="Select element" />
                </SelectTrigger>
                <SelectContent>
                    {options?.map(o => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors?.length && (
                <p className="text-destructive mb-2  mt-1 min-h-5 text-sm font-medium">{errors.join(', ')}</p>
            )}
        </div>
    );
};
