import { useSettings } from "@/state";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "..";
import React from "react";
import { getLanguageName } from "@/utils";

export const TranslationSelect = () => {
  const { t } = useTranslation("common");
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const setTranslationsLanguage = useSettings((p) => p.setTranslationsLanguage);
  const availableLanguages = useSettings((p) => p.availableLanguages);

  return (
    <Select
      value={translationsLanguage}
      onValueChange={setTranslationsLanguage}
    >
      <SelectTrigger className="w-auto">
        <div className="mr-2 flex items-center gap-2 ">
          <Globe size={16} />
          <SelectValue placeholder={t("languageCodePlaceholder")} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableLanguages.map((l) => (
            <SelectItem key={l} value={l}>
              {getLanguageName(l)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
