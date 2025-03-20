import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/atoms/label';
import { ErrorMessage } from '@/components/molecules/ErrorMessage.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    adornmentPlain?: true;
    wrapperClassName?: string;
    errors?: string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    const inputClassName = cn(
        'flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:placeholder:text-stone-400',
        'focus:outline-none focus:ring-0 focus:border-stone-200 dark:focus:border-stone-800',
        className,
    );
    if (props.label || props.startAdornment || props.endAdornment) {
        return (
            <div className={cn('grid w-full gap-1.5', props.wrapperClassName)}>
                {props.label && <Label htmlFor="email">{props.label}</Label>}
                <div className="flex items-center">
                    {props.startAdornment && (
                        <div
                            className={cn(
                                'bg-gray-50 dark:bg-gray-700 border border-solid border-gray-200 dark:border-gray-600 -mr-2 h-full pr-2 pl-2 flex items-center rounded-l-md',
                                props.adornmentPlain && 'bg-background z-10 border-r-0',
                            )}
                        >
                            {props.startAdornment}
                        </div>
                    )}
                    <input type={type} className={inputClassName} ref={ref} {...props} />
                    {props.endAdornment && (
                        <div className="bg-gray-50 dark:bg-gray-700 border border-solid border-gray-200 dark:border-gray-600 -ml-2 h-full pl-2 pr-2 flex items-center rounded-r-md">
                            {props.endAdornment}
                        </div>
                    )}
                </div>
                <ErrorMessage errors={props.errors} />
            </div>
        );
    }
    return <input type={type} className={inputClassName} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };
