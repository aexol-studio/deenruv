import { createDialogFromComponent } from "@/universal_utils/createDialogFromComponentFunction.js";
import { Tag } from "lucide-react";
import React from "react";
import { ManageEntityToChannels } from "./ManageEntityToChannels.js";
import { ListLocations } from "@/types/index.js";
import { useSettings } from "@/state/settings.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { DeenruvUITable } from "@/plugins/types.js";
import { ManageEntityFacetsDialog } from "./ManageEntityFacetsDialog.js";

type BulkAction<K extends keyof typeof ListLocations> = NonNullable<
  DeenruvUITable<K>["bulkActions"]
>[number];

export const EntityFacetManagementBulkAction = <
  K extends keyof typeof ListLocations,
>(
  type: K,
): BulkAction<K> => {
  const channel = useSettings((state) => state.selectedChannel);
  let mode: "products" | "collections";
  if (type === "products-list-view") {
    mode = "products";
  } else if (type === "collections-list-view") {
    mode = "collections";
  } else {
    return {
      label: "Zarządzaj aspektami",
      icon: <Tag size={16} />,
      canShow: () => false,
      onClick: async () => {
        return { error: "Nie można zarządzać aspektami w tej lokalizacji" };
      },
    };
  }
  return {
    icon: <Tag size={16} />,
    label: "Zarządzaj aspektami",
    canShow: () => channel?.code === DEFAULT_CHANNEL_CODE,
    onClick: async ({ table }) => {
      const ids = Object.entries(table.getState().rowSelection)
        .map(([key, value]) => {
          if (value) return key;
        })
        .filter(Boolean) as string[];
      try {
        const result = await createDialogFromComponent(
          ManageEntityFacetsDialog,
          { ids, mode },
          { className: "max-w-7xl" },
        );
        const { updateProducts } = await apiClient("mutation")({
          updateProducts: [
            {
              input: result.map((product) => {
                const facetValueIds = product.facetValues.map(
                  (facetValue) => facetValue.id,
                );
                return { id: product.id, facetValueIds };
              }),
            },
            { id: true },
          ],
        });
        const allUpdated = updateProducts.every((product) => product.id);
        if (allUpdated) {
          return { success: "Aspekty zostały pomyślnie zaktualizowane" };
        } else {
          throw new Error("Nie udało się zaktualizować aspektów");
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Nie udało się zaktualizować aspektów";
        return { error: message };
      }
    },
  };
};
