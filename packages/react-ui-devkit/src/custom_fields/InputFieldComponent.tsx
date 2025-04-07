import React, { Suspense } from "react";
import { CustomFieldsProvider, Field } from "./context.js";
import { cn } from "@/lib/utils.js";
import { Loader2 } from "lucide-react";

const LoadingInputFieldComponent = ({ field }: { field: Field }) => {
  return (
    <div
      className={cn(
        `flex-1 min-w-[220px] basis-1/3`,
        !!field.ui?.fullWidth && `basis-full`,
      )}
    >
      <Loader2 className="size-5 animate-spin text-blue-500" />
      <div className="flex flex-col gap-1">
        <span>Loading...</span>
        <span>
          {field.name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
          })}
        </span>
      </div>
    </div>
  );
};

export const InputFieldComponent = <
  T extends Field & { component: React.ReactNode },
>({
  field,
  value,
  setValue,
  additionalData = {},
  disabled,
}: {
  field: T;
  value: unknown;
  setValue: (data: unknown) => void;
  additionalData?: Record<string, unknown>;
  disabled?: boolean;
}) => {
  return (
    <CustomFieldsProvider
      key={field.name}
      field={field}
      value={value}
      setValue={setValue}
      additionalData={additionalData}
      disabled={disabled}
    >
      <Suspense fallback={<LoadingInputFieldComponent field={field} />}>
        <div
          className={cn(
            `flex-1 min-w-[220px] basis-1/3`,
            !!field.ui?.fullWidth && `basis-full`,
          )}
        >
          {field.component}
        </div>
      </Suspense>
    </CustomFieldsProvider>
  );
};
