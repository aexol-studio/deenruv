import React from "react";
import { CardDescription, Input, Label } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

const getNumberOption = (value: unknown): number | undefined => {
  if (typeof value === "number") return value;
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const getAffix = (value: unknown): string | undefined => {
  return typeof value === "string" && value !== "" ? value : undefined;
};

export const DefaultFloatInput: React.FC = () => {
  const { field, value, label, description, setValue, disabled } =
    useCustomFields<string | number>();
  const min = getNumberOption(field?.ui?.min);
  const max = getNumberOption(field?.ui?.max);
  const step = getNumberOption(field?.ui?.step) ?? 0.01;
  const prefix = getAffix(field?.ui?.prefix);
  const suffix = getAffix(field?.ui?.suffix);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={field?.name}>
        {label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
      </Label>
      <CardDescription>{description}</CardDescription>
      <Input
        id={field?.name}
        type="number"
        min={min}
        max={max}
        step={step}
        startAdornment={prefix}
        endAdornment={suffix}
        disabled={disabled ?? field?.readonly ?? undefined}
        value={value ?? ""}
        onChange={(e) => {
          const float = Number.parseFloat(e.target.value || "0");
          setValue(Number.isNaN(float) ? "" : float);
        }}
      />
    </div>
  );
};
