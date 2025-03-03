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
import { ErrorMessage } from '@/components/molecules';
import { cn } from '@/lib/utils.js';

interface CustomSelectProps extends SelectProps {
    options: Option[] | undefined;
    label?: string;
    size?: 'sm' | 'base';
    errors?: string[];
    className?: string;
    wrapperClassName?: string;
    placeholder?: string;
}

export const SimpleSelect: React.FC<CustomSelectProps> = ({
    defaultValue,
    value,
    onValueChange,
    options,
    label,
    size = 'base',
    errors,
    disabled,
    className,
    wrapperClassName,
    placeholder,
}) => {
    return (
        <div className={cn('flex flex-col w-full gap-2 ', wrapperClassName)}>
            {label && <Label>{label}</Label>}
            <Select
                defaultValue={defaultValue}
                onValueChange={val => onValueChange?.(val === 'undefined' ? '' : val)}
                value={value ?? ''}
                disabled={disabled}
            >
                <SelectTrigger className={cn(className, size === 'sm' && 'h-[30px] text-[13px]')}>
                    <SelectValue placeholder={placeholder ?? 'Select element'} />
                </SelectTrigger>
                <SelectContent>
                    {options?.map(o => (
                        <SelectItem key={o.value} value={o.value as string} style={{ color: o.color }}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <ErrorMessage errors={errors} className="mt-0" />
        </div>
    );
};
