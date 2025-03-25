'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/atoms/label';
import { ErrorMessage } from '@/components/molecules/ErrorMessage.js';

const DECIMAL_PLACES = 2;

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    type?: React.HTMLInputTypeAttribute | 'currency';
    label?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    adornmentPlain?: true;
    wrapperClassName?: string;
    errors?: string[];
    locale?: string; // Optional locale override
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, onChange, value, locale, ...props }, ref) => {
        const inputClassName = cn(
            'flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:bg-stone-950 dark:placeholder:text-stone-400',
            'focus:outline-none focus:ring-0 focus:border-stone-200 dark:focus:border-stone-800',
            className,
        );

        // Get the user's locale from the browser or use the provided locale
        const [userLocale, setUserLocale] = React.useState<string>('en-US');

        // Get decimal separator for the current locale
        const [decimalSeparator, setDecimalSeparator] = React.useState<string>('.');
        const [groupingSeparator, setGroupingSeparator] = React.useState<string>(',');

        // Track if the input is being edited
        const [isEditing, setIsEditing] = React.useState(false);

        // Initialize the internal value
        const [internalValue, setInternalValue] = React.useState<string>(
            type === 'currency' && value ? formatCurrencyForDisplay(String(value)) : String(value || ''),
        );

        // Effect to detect the user's locale and set the decimal separator
        React.useEffect(() => {
            // Use the provided locale or get from browser
            const detectedLocale =
                locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
            setUserLocale(detectedLocale);

            // Determine the decimal and grouping separators for this locale
            try {
                // Create a number formatter for the locale
                const formatter = new Intl.NumberFormat(detectedLocale);

                // Format a number to detect the separators
                const parts = formatter.formatToParts(1234.5);

                // Find the decimal separator
                const decimal = parts.find(part => part.type === 'decimal');
                if (decimal) {
                    setDecimalSeparator(decimal.value);
                }

                const group = parts.find(part => part.type === 'group');
                if (group) {
                    setGroupingSeparator(group.value);
                }
            } catch (error) {
                console.error('Error detecting locale separators:', error);
                setDecimalSeparator('.');
                setGroupingSeparator(',');
            }
        }, [locale]);

        // Add a useEffect to update internalValue when value prop changes
        React.useEffect(() => {
            if (!isEditing && type === 'currency' && value !== undefined) {
                setInternalValue(formatCurrencyForDisplay(String(value)));
            } else if (value !== undefined) {
                setInternalValue(String(value));
            }
        }, [value, type, isEditing]);

        function formatCurrencyForDisplay(val: string): string {
            if (!val) return '';

            const numericValue = val.replace(/[^\d]/g, '');
            if (!numericValue) return '';

            const num = Number.parseInt(numericValue, 10) / Math.pow(10, DECIMAL_PLACES);

            // Use the detected locale for formatting
            try {
                return new Intl.NumberFormat(userLocale, {
                    minimumFractionDigits: DECIMAL_PLACES,
                    maximumFractionDigits: DECIMAL_PLACES,
                    useGrouping: false, // Disable thousand separators
                }).format(num);
            } catch (error) {
                // Fallback to basic formatting if Intl fails
                console.error('Error formatting with locale:', error);
                return num.toFixed(DECIMAL_PLACES);
            }
        }

        // Improved parsing function that respects the decimal position during editing
        function parseCurrencyValue(val: string, preserveDecimal = false): string {
            if (!val) return '';

            // If we're preserving decimal position during editing
            if (preserveDecimal && (val.includes(decimalSeparator) || val.includes('.'))) {
                // Normalize the input by replacing all possible decimal separators
                const normalizedValue = val.replace(/,/g, '.');

                // Split by the decimal point
                const parts = normalizedValue.split('.');

                // If there are multiple decimal points, keep only the first one
                const integerPart = parts[0].replace(/[^\d]/g, '');
                let decimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, '') : '';

                // Truncate decimal part if it's too long
                if (decimalPart.length > DECIMAL_PLACES) {
                    decimalPart = decimalPart.substring(0, DECIMAL_PLACES);
                }

                // Return the raw value with the decimal point preserved
                // This is what we'll store in state
                return integerPart + decimalPart.padEnd(DECIMAL_PLACES, '0');
            }

            // Standard parsing for non-editing mode
            if (val.includes('.') || val.includes(',')) {
                const normalizedValue = val.replace(/,/g, '.');
                const parts = normalizedValue.split('.');
                const integerPart = parts[0].replace(/[^\d]/g, '');
                let decimalPart = parts.length > 1 ? parts[1].replace(/[^\d]/g, '') : '';

                if (decimalPart.length > DECIMAL_PLACES) {
                    decimalPart = decimalPart.substring(0, DECIMAL_PLACES);
                } else {
                    decimalPart = decimalPart.padEnd(DECIMAL_PLACES, '0');
                }

                return integerPart + decimalPart;
            } else {
                const numericValue = val.replace(/[^\d]/g, '');
                if (!numericValue) return '';

                return numericValue.padEnd(numericValue.length + DECIMAL_PLACES, '0');
            }
        }

        const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;

            setInternalValue(rawValue);

            if (onChange) {
                const parsedValue = parseCurrencyValue(rawValue, true);

                const syntheticEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: parsedValue,
                    },
                } as React.ChangeEvent<HTMLInputElement>;

                onChange(syntheticEvent);
            }
        };

        const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsEditing(true);

            if (props.onFocus) {
                props.onFocus(e);
            }
        };

        const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsEditing(false);

            if (type === 'currency') {
                const formattedValue = formatCurrencyForDisplay(parseCurrencyValue(e.target.value));
                setInternalValue(formattedValue);
            }

            if (props.onBlur) {
                props.onBlur(e);
            }
        };

        if (props.label || props.startAdornment || props.endAdornment) {
            return (
                <div className={cn('grid w-full gap-1.5', props.wrapperClassName)}>
                    {props.label && <Label htmlFor={props.id || props.name}>{props.label}</Label>}
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
                        <input
                            type={type === 'currency' ? 'text' : type}
                            className={inputClassName}
                            ref={ref}
                            value={type === 'currency' ? internalValue : value}
                            onChange={type === 'currency' ? handleCurrencyChange : onChange}
                            onFocus={type === 'currency' ? handleCurrencyFocus : props.onFocus}
                            onBlur={type === 'currency' ? handleCurrencyBlur : props.onBlur}
                            {...props}
                        />
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

        return (
            <input
                type={type === 'currency' ? 'text' : type}
                className={inputClassName}
                ref={ref}
                value={type === 'currency' ? internalValue : value}
                onChange={type === 'currency' ? handleCurrencyChange : onChange}
                onFocus={type === 'currency' ? handleCurrencyFocus : props.onFocus}
                onBlur={type === 'currency' ? handleCurrencyBlur : props.onBlur}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';

export { Input };
