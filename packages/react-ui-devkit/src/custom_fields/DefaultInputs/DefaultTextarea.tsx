import React from "react";
import { CardDescription, Label, Textarea } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

export function DefaultTextarea() {
  const { field, value, setValue, label, description, disabled } =
    useCustomFields<string>();

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field?.name}>
        {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
      </Label>
      <CardDescription>{description}</CardDescription>
      <Textarea
        id={field?.name}
        value={value as string}
        disabled={disabled ?? field?.readonly ?? undefined}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
