import React from "react";
import { CardDescription, Input, Label } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { useSettings } from "@/state/settings.js";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

export const DefaultCurrencyInput: React.FC = () => {
  const { field, value, label, description, setValue, disabled } =
    useCustomFields<number>();
  const { selectedChannel } = useSettings();

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field?.name}>
        {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
      </Label>
      <CardDescription>{description}</CardDescription>
      <Input
        id={field?.name}
        type="currency"
        disabled={disabled ?? field?.readonly ?? undefined}
        value={value}
        onChange={(e) => {
          console.log("E", e);
          setValue(parseInt(e.target.value || "0", 10));
        }}
        endAdornment={selectedChannel?.currencyCode}
      />
    </div>
  );
};
