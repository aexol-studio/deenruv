import React from "react";
import { CardDescription, Checkbox, Label } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

export const DefaultCheckbox = () => {
  const { field, value, label, description, setValue, disabled } =
    useCustomFields<boolean>();
  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={field?.name}
          disabled={disabled ?? field?.readonly ?? undefined}
          checked={value}
          onCheckedChange={setValue}
        />
        <Label htmlFor={field?.name}>
          {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
        </Label>
      </div>
      <CardDescription>{description}</CardDescription>
    </>
  );
};
