import { Badge, Button, Input, InputProps } from '@/components';
import { XIcon } from 'lucide-react';
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
                        className="rounded-r-none"
                        {...props}
                        ref={ref}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="rounded-l-none border border-l-0"
                        onClick={addPendingDataPoint}
                    >
                        Add
                    </Button>
                </div>
                <div className="flex min-h-[2.5rem] flex-wrap items-center gap-2 overflow-y-auto rounded-md border p-2">
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
            </>
        );
    },
);
