import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from ".";
import { Globe } from "lucide-react";
import { LanguageCode } from "@deenruv/admin-types";
import { useSettings } from "@/state";

function getActiveLocale(localeOverride?: unknown): string {
  const locale =
    typeof localeOverride === "string"
      ? localeOverride.replace("_", "-")
      : "en";
  const hyphenated = locale?.replace(/_/g, "-");
  const matches = hyphenated?.match(
    /^([a-zA-Z_-]+)(-[A-Z][A-Z])(-[A-Z][A-z])$/,
  );
  if (matches?.length) {
    const overriddenLocale = matches[1] + matches[3];
    return overriddenLocale;
  } else {
    return hyphenated;
  }
}

type Props = {
  value: LanguageCode;
  onChange: (lang: LanguageCode) => void;
};

export const LanguagePicker = ({ onChange, value }: Props) => {
  const { availableLanguages } = useSettings();

  return (
    <Select
      value={value}
      onValueChange={(e: LanguageCode) => {
        onChange(e);
      }}
    >
      <SelectTrigger>
        <div className="flex items-center gap-2 pr-1">
          <Globe size={14} /> <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableLanguages.map((lng, idx) => {
            const name = new Intl.DisplayNames(
              [getActiveLocale(lng.replace("_", "-"))],
              {
                type: "language",
              },
            );

            return (
              <SelectItem key={idx} value={lng}>
                {name.of(getActiveLocale(lng.replace("_", "-")))}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
