import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover';
import { Button, CardDescription, Label } from '@/components';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/atoms/calendar';
import { format } from 'date-fns';
import { useCustomFields } from '@/custom_fields/context';
import React from 'react';

export const DefaultTimeSelect: React.FC = () => {
    const { value, field, label, description, setValue } = useCustomFields<'DateTimeCustomFieldConfig'>();
    const date = value ? new Date(value as string) : undefined;
    const setDate = (date: Date | undefined) => {
        if (date) setValue(date.toISOString());
    };

    return (
        <div className="flex flex-col gap-1">
            <Label htmlFor={field?.name}>{label || field?.name}</Label>
            <CardDescription>{description}</CardDescription>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        disabled={field?.readonly}
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : null}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
            </Popover>
        </div>
    );
};
