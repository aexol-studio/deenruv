import React from "react";
import { CardDescription, Option, SimpleSelect } from "@/components";
import { useCustomFields } from "@/custom_fields/context";
import { useTranslation } from "@/hooks/useTranslation.js";
import { capitalizeFirstLetter, camelCaseToSpaces } from "@/utils";

type TranslatedLabel = { languageCode?: string; value?: unknown };
type SelectOptionConfig = { label?: string | TranslatedLabel[]; value?: unknown };

const isSelectOptionConfig = (option: unknown): option is SelectOptionConfig => {
  return !!option && typeof option === "object" && "value" in option;
};

const getOptionLabel = (label: SelectOptionConfig["label"], language: string, value: string) => {
  if (typeof label === "string") return label;
  if (!Array.isArray(label)) return value;

  const translation =
    label.find((entry) => entry.languageCode === language) ??
    label.find((entry) => entry.languageCode === "en") ??
    label[0];

  return (translation?.value ?? value).toString();
};

const getOptions = (options: unknown, language: string): Option[] => {
  if (!Array.isArray(options)) return [];

  return options.filter(isSelectOptionConfig).map((option) => {
    const value = (option.value ?? "").toString();
    return {
      label: getOptionLabel(option.label, language, value),
      value,
    };
  });
};

export const DefaultSelectInput: React.FC = () => {
  const { field, value, label, description, setValue, disabled } = useCustomFields<string>();
  const { i18n } = useTranslation();
  const options = getOptions(field?.ui?.options, i18n.language);

  return (
    <div className="flex flex-col gap-1">
      <SimpleSelect
        label={label || capitalizeFirstLetter(camelCaseToSpaces(field?.name))}
        value={(value ?? "").toString()}
        onValueChange={setValue}
        options={options}
        disabled={disabled ?? field?.readonly ?? undefined}
      />
      <CardDescription>{description}</CardDescription>
    </div>
  );
};
