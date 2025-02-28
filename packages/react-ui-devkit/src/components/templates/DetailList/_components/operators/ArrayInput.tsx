import { Badge, Button, Input, InputProps, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { cn } from '@/lib/utils.js';
import { AppWindowMac, XIcon } from 'lucide-react';
import React from 'react';
import { forwardRef, useState } from 'react';

type ArrayInputProps = InputProps & {
    value: string[];
    onChange: (value: string[]) => void;
};

export const ArrayInput = forwardRef<HTMLInputElement, ArrayInputProps>(
    ({ value, onChange, ...props }, ref) => {
        const [pendingDataPoint, setPendingDataPoint] = useState('');

        const addPendingDataPoint = () => {
            if (pendingDataPoint) {
                const newDataPoints = new Set([...value, pendingDataPoint]);
                onChange(Array.from(newDataPoints));
                setPendingDataPoint('');
            }
        };

        return (
            <>
                <div className="flex">
                    <Input
                        value={pendingDataPoint}
                        onChange={e => setPendingDataPoint(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addPendingDataPoint();
                            } else if (e.key === ',' || e.key === ' ') {
                                e.preventDefault();
                                addPendingDataPoint();
                            }
                        }}
                        className={cn('rounded-r-none', props.className)}
                        {...props}
                        ref={ref}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="rounded-l-none border border-l-0 h-8"
                        onClick={addPendingDataPoint}
                    >
                        Add
                    </Button>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            disabled={!value.length}
                            size={'icon'}
                            variant={'outline'}
                            className={cn(
                                'text-left font-normal size-8 rounded shrink-0',
                                !value && 'text-muted-foreground',
                            )}
                        >
                            <AppWindowMac className="size-3.5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <div className="flex flex-wrap items-start gap-2 overflow-y-auto rounded-md border p-2 size-[180px]">
                            {value.map((item, idx) => (
                                <Badge key={idx} variant="secondary">
                                    {item}
                                    <button
                                        type="button"
                                        className="ml-2 w-3"
                                        onClick={() => {
                                            onChange(value.filter(i => i !== item));
                                        }}
                                    >
                                        <XIcon className="w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </>
        );
    },
);
