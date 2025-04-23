import { MultipleSelector, Option } from "@/components/index.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import { generateColorFromString } from "@/lib/utils.js";
import { FacetValueSelector } from "@/selectors/FacetValueSelector.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";

import React, { useCallback, useEffect, useState } from "react";

interface FacetIdsSelectorProps {
  onChange: (facetValuesIds: string[]) => void;
  facetValuesIds: string[] | undefined;
  fixedDropdown?: boolean;
}

export const FacetIdsSelector: React.FC<FacetIdsSelectorProps> = ({
  facetValuesIds,
  onChange,
  fixedDropdown,
}) => {
  const { t } = useTranslation("products");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const handleSearch = useCallback(async (debaouncedValues: string) => {
    const response = await apiClient("query")({
      facetValues: [
        { options: { filter: { name: { contains: debaouncedValues } } } },
        { totalItems: true, items: FacetValueSelector },
      ],
    });

    return response.facetValues.items.map((f) => ({
      label: `${f.facet.name.toUpperCase()} ${f.name}`,
      value: f.id,
      parent: f.facet.name,
      color: generateColorFromString(f.facet.name),
    }));
  }, []);

  useEffect(() => {
    (async () => {
      if (!facetValuesIds || !facetValuesIds.length) return;
      const response = await apiClient("query")({
        facetValues: [
          { options: { filter: { id: { in: facetValuesIds } } } },
          { totalItems: true, items: FacetValueSelector },
        ],
      });

      setSelectedOptions(
        response.facetValues.items.map((f) => ({
          label: `${f.facet.name.toUpperCase()} ${f.name}`,
          value: f.id,
          parent: f.facet.name,
          color: generateColorFromString(f.facet.name),
        })),
      );
    })();
  }, [facetValuesIds]);

  return (
    <MultipleSelector
      value={selectedOptions}
      placeholder={t("facetPlaceholder")}
      onChange={(options) => onChange(options.map((o) => o.value))}
      onSearch={handleSearch}
      hideClearAllButton
      fixedDropdown={fixedDropdown}
    />
  );
};
