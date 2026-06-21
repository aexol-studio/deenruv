import { Input } from "@/components";
import { useDebounce, useTranslation } from "@/hooks";
import { PromisePaginated } from "@/types/models";
import React from "react";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export const Search = ({
  initialSearchQuery,
  setSearchQuery,
  searchFields,
  searchTranslations,
}: {
  initialSearchQuery?: string | null;
  setSearchQuery: (query: string | null) => void;
  searchFields?: (keyof Awaited<
    ReturnType<PromisePaginated>
  >["items"][number])[];
  searchTranslations?: Array<{
    key: keyof Awaited<ReturnType<PromisePaginated>>["items"][number];
    value: string;
  }>;
}) => {
  const { t } = useTranslation("table");
  const [searchQuery, setSearchQueryState] = useState(initialSearchQuery ?? "");
  const debouncedSearch = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (debouncedSearch.length > 0) setSearchQuery(debouncedSearch);
    else setSearchQuery(null);
  }, [debouncedSearch]);

  const placeholder = t("placeholders.search", {
    fields: searchFields
      ?.map((f) => {
        const translation = searchTranslations?.find((t) => t.key === f);
        if (translation) return translation.value;
        return t("columns." + f.toString());
      })
      .join(", "),
  }).toLowerCase();
  const onlyFirstLetterCapitalized = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="relative flex w-full min-w-0 max-w-[46rem] items-center">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        className="h-9 w-full border-border/80 bg-background/80 pl-9 pr-4 text-sm shadow-none focus:border-primary/50 focus:ring-ring/20"
        placeholder={onlyFirstLetterCapitalized(placeholder)}
        value={searchQuery}
        onChange={(e) => setSearchQueryState(e.target.value)}
      />
    </div>
  );
};
