import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/atoms/label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    endAdornment?: React.ReactNode;
    wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    const inputClassName = cn(
        'flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm flex file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:border-stone-950 dark:focus-visible:border-stone-500  disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:placeholder:text-stone-400',
        className,
    );
    if (props.label) {
        return (
            <div className={cn('grid w-full gap-1.5', props.wrapperClassName)}>
                <Label htmlFor="email">{props.label}</Label>
                <div className="flex items-center">
                    <input type={type} className={inputClassName} ref={ref} {...props} />
                    {props.endAdornment && (
                        <div className="bg-gray-50 border border-solid border-gray-200 -ml-2 h-full pl-2 pr-2 flex items-center rounded-r-md">
                            {props.endAdornment}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return <input type={type} className={inputClassName} ref={ref} {...props} />;
});
Input.displayName = 'Input';

export { Input };
