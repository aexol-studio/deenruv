import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { DialogComponentProps } from "@/universal_utils/createDialogFromComponentFunction.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { FacetIdsSelector } from "@/universal_components/FacetIdsSelector.js";
import {
  Badge,
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "@/components/index.js";
import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";
import { useTranslation } from "@/hooks/useTranslation.js";

const facetValueSelector = Selector("FacetValue")({
  id: true,
  name: true,
  code: true,
  facet: { id: true, code: true, name: true },
});

type FacetValue = FromSelectorWithScalars<
  typeof facetValueSelector,
  "FacetValue"
>;

function fetchFacetsValues(facetValuesIds: string[]) {
  return apiClient("query")({
    facetValues: [
      { options: { filter: { id: { in: facetValuesIds } } } },
      {
        totalItems: true,
        items: facetValueSelector,
      },
    ],
  });
}

export function ManageEntityFacetsDialog({
  close,
  resolve,
  data: { ids, mode },
}: DialogComponentProps<
  Array<{ id: string; facetValues: FacetValue[] }>,
  { ids: string[]; mode: "products" | "collections" }
>) {
  const { t } = useTranslation("common");
  const translations = {
    products: {
      in: t("manageEntityFacetsDialog.products.in"),
      selected: t("manageEntityFacetsDialog.products.selected"),
    },
    collections: {
      in: t("manageEntityFacetsDialog.collections.in"),
      selected: t("manageEntityFacetsDialog.collections.selected"),
    },
  };

  const [facetToAdd, setFacetToAdd] = useState<FacetValue>();
  const [loading, setLoading] = useState(true);
  const [originalEntities, setOriginalEntities] = useState<
    { id: string; name: string; slug: string; facetValues: FacetValue[] }[]
  >([]);
  const [entities, setEntities] = useState<
    { id: string; name: string; slug: string; facetValues: FacetValue[] }[]
  >([]);

  const onSubmit = () => {
    resolve(entities);
    close();
  };

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(entities) !== JSON.stringify(originalEntities) &&
      entities.length > 0
    );
  }, [entities, originalEntities]);

  useEffect(() => {
    const fetch = async () => {
      const { [mode]: result } = await apiClient("query")({
        [mode]: [
          { options: { filter: { id: { in: ids } } } },
          {
            items: {
              id: true,
              name: true,
              slug: true,
              facetValues: facetValueSelector,
            },
          },
        ],
      } as any);
      if (!result) return;
      setEntities(
        typeof result === "object" && "items" in result
          ? (result.items as any[])
          : [],
      );
      setOriginalEntities(
        typeof result === "object" && "items" in result
          ? (result.items as any[])
          : [],
      );
      setLoading(false);
    };

    fetch().catch((error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });
  }, []);

  const allSelectedFacetValues = useMemo(() => {
    return entities.reduce((acc, entity) => {
      const facetValues = entity.facetValues.map((f) => f.id);
      return [...acc, ...facetValues];
    }, [] as string[]);
  }, [entities]);

  return (
    <>
      <DialogHeader className="pb-4 border-b">
        <DialogTitle className="text-xl font-bold">
          {t("manageEntityFacetsDialog.title")} {translations[mode].in}
        </DialogTitle>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("loading")}</span>
        </div>
      ) : (
        <div className="flex h-full min-h-0 flex-col">
          <div className="bg-muted/30 rounded-lg my-4 p-4">
            <div className="flex items-start justify-between w-full gap-4">
              <div className="w-full flex flex-col gap-2">
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">
                  {t("manageEntityFacetsDialog.addFacet")}{" "}
                  {translations[mode].selected}
                </h3>
                <div className="w-full flex gap-2 items-start">
                  <FacetIdsSelector
                    className="w-full"
                    single
                    facetValuesIds={[facetToAdd?.id ?? ""]}
                    onChange={async (facetValuesIds) => {
                      const { facetValues } =
                        await fetchFacetsValues(facetValuesIds);
                      const facetValue = facetValues.items[0];
                      setFacetToAdd(facetValue);
                    }}
                  />
                  <Button
                    className="whitespace-nowrap"
                    disabled={!facetToAdd}
                    onClick={() => {
                      if (!facetToAdd) return;
                      const mappedEntities = entities.map((item) => ({
                        ...item,
                        facetValues: [...item.facetValues, facetToAdd],
                      }));
                      setEntities(mappedEntities);
                      setFacetToAdd(undefined);
                    }}
                  >
                    {t("manageEntityFacetsDialog.assignFacet")}
                  </Button>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2">
                <span className="text-sm font-medium mb-2 text-muted-foreground">
                  {t("manageEntityFacetsDialog.allSelectedFacetValues")}
                </span>
                <FacetIdsSelector
                  className="w-full"
                  disabledInput
                  facetValuesIds={allSelectedFacetValues}
                  onChange={async (facetValuesIds) => {
                    setEntities((prevEntities) =>
                      prevEntities.map((item) => ({
                        ...item,
                        facetValues: item.facetValues.filter((f) =>
                          facetValuesIds.includes(f.id),
                        ),
                      })),
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <ScrollArea className="h-[400px] w-full pr-4">
            {entities.map((entity, index) => (
              <div
                key={entity.id}
                className={`mb-4 rounded-lg border p-4 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {entity.id}. {entity.slug}
                    </span>
                    <h3 className="text-lg font-semibold">{entity.name}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {entity.facetValues.length}{" "}
                    {t("manageEntityFacetsDialog.facetValues")}
                  </Badge>
                </div>
                <FacetIdsSelector
                  className="w-full"
                  facetValuesIds={entity.facetValues.map((f) => f.id)}
                  onChange={async (facetValuesIds) => {
                    const { facetValues } =
                      await fetchFacetsValues(facetValuesIds);
                    setEntities((prevEntities) =>
                      prevEntities.map((item) =>
                        item.id === entity.id
                          ? { ...item, facetValues: facetValues.items }
                          : item,
                      ),
                    );
                  }}
                />
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
      <DialogFooter className="pt-4 border-t mt-4">
        <Button variant="outline" onClick={close}>
          {t("cancel")}
        </Button>
        <Button onClick={onSubmit} disabled={!isDirty}>
          {t("submit")}
        </Button>
      </DialogFooter>
    </>
  );
}
