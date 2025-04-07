import React from "react";
import { CardDescription, Input, Label } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

export const DefaultIntInput: React.FC = () => {
  const { field, value, label, description, setValue, disabled } =
    useCustomFields<number>();
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field?.name}>
        {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
      </Label>
      <CardDescription>{description}</CardDescription>
      <Input
        id={field?.name}
        type="number"
        disabled={disabled ?? field?.readonly ?? undefined}
        value={value}
        onChange={(e) => {
          setValue(parseInt(e.target.value || "0", 10));
        }}
      />
    </div>
  );
};
