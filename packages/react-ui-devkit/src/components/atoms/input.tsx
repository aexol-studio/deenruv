import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/atoms/label";
import { ErrorMessage } from "@/components/molecules/ErrorMessage.js";

const DECIMAL_PLACES = 2;

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  type?: React.HTMLInputTypeAttribute | "currency";
  label?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  adornmentPlain?: true;
  wrapperClassName?: string;
  errors?: string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, value, ...props }, ref) => {
    const hasErrors = props.errors && props.errors.length > 0;
    const inputClassName = cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      "focus:outline-none focus:ring-0 focus:border-input",
      hasErrors && "border-destructive focus:border-destructive",
      className,
    );

    const [internalValue, setInternalValue] = React.useState<string>(
      type === "currency" && value
        ? formatCurrencyForDisplay(String(value))
        : String(value || ""),
    );

    function formatCurrencyForDisplay(val: string): string {
      if (!val) return "";

      const numericValue = val.replace(/[^\d]/g, "");
      if (!numericValue) return "";

      const num =
        Number.parseInt(numericValue, 10) / Math.pow(10, DECIMAL_PLACES);

      return num.toFixed(DECIMAL_PLACES);
    }

    function parseCurrencyValue(val: string): string {
      if (!val) return "";

      if (val.includes(".") || val.includes(",")) {
        const normalizedValue = val.replace(/,/g, ".");
        const parts = normalizedValue.split(".");
        const integerPart = parts[0].replace(/[^\d]/g, "");
        let decimalPart =
          parts.length > 1 ? parts[1].replace(/[^\d]/g, "") : "";

        if (decimalPart.length > DECIMAL_PLACES) {
          decimalPart = decimalPart.substring(0, DECIMAL_PLACES);
        } else {
          decimalPart = decimalPart.padEnd(DECIMAL_PLACES, "0");
        }

        return integerPart + decimalPart;
      } else {
        const numericValue = val.replace(/[^\d]/g, "");
        if (!numericValue) return "";

        return numericValue.padEnd(numericValue.length + DECIMAL_PLACES, "0");
      }
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setInternalValue(rawValue);

      if (onChange) {
        const parsedValue = parseCurrencyValue(rawValue);
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

    const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (type === "currency") {
        const formattedValue = formatCurrencyForDisplay(
          parseCurrencyValue(e.target.value),
        );
        setInternalValue(formattedValue);
      }

      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    if (props.label || props.startAdornment || props.endAdornment) {
      return (
        <div className={cn("grid w-full gap-1.5", props.wrapperClassName)}>
          {props.label && (
            <Label htmlFor={props.id || props.name}>{props.label}</Label>
          )}
          <div className="flex items-center">
            {props.startAdornment && (
              <div
                className={cn(
                  "-mr-2 flex h-full items-center rounded-l-md border border-solid border-input bg-muted pl-2 pr-2",
                  props.adornmentPlain && "bg-background z-10 border-r-0",
                )}
              >
                {props.startAdornment}
              </div>
            )}
            <input
              type={type === "currency" ? "text" : type}
              className={inputClassName}
              ref={ref}
              aria-invalid={hasErrors || undefined}
              data-invalid={hasErrors || undefined}
              value={type === "currency" ? internalValue : value}
              onChange={type === "currency" ? handleCurrencyChange : onChange}
              onBlur={type === "currency" ? handleCurrencyBlur : props.onBlur}
              {...props}
            />
            {props.endAdornment && (
              <div className="-ml-2 flex h-full items-center rounded-r-md border border-solid border-input bg-muted px-2">
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
        type={type === "currency" ? "text" : type}
        className={inputClassName}
        ref={ref}
        aria-invalid={hasErrors || undefined}
        data-invalid={hasErrors || undefined}
        value={type === "currency" ? internalValue : value}
        onChange={type === "currency" ? handleCurrencyChange : onChange}
        onBlur={type === "currency" ? handleCurrencyBlur : props.onBlur}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
