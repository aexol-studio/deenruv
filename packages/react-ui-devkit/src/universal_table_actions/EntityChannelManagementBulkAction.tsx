import { createDialogFromComponent } from "@/universal_utils/createDialogFromComponentFunction.js";
import { FolderOpen } from "lucide-react";
import React from "react";
import { ManageEntityToChannelsDialog } from "./ManageEntityToChannelsDialog.js";
import { ListLocations } from "@/types/index.js";
import { useSettings } from "@/state/settings.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { DeenruvUITable } from "@/plugins/types.js";
import { SortOrder } from "@deenruv/admin-types";

type BulkAction<K extends keyof typeof ListLocations> = NonNullable<
  DeenruvUITable<K>["bulkActions"]
>[number];

export const EntityChannelManagementBulkAction = <
  K extends keyof typeof ListLocations,
>(
  type: K,
): BulkAction<K>[] => {
  const channel = useSettings((state) => state.selectedChannel);
  let mode: "products" | "collections" | undefined = undefined;
  switch (type) {
    case "products-list-view":
      mode = "products";
      break;
    case "collections-list-view":
      mode = "collections";
      break;
  }
  const withPriceFactor = mode === "products";
  if (!mode) {
    return [
      {
        label: "Zarządzaj kanałami",
        icon: <FolderOpen size={16} />,
        canShow: () => false,
        onClick: async () => {
          return { error: "Nie można zarządzać kanałami w tej lokalizacji" };
        },
      },
    ];
  }

  return [
    {
      icon: <FolderOpen size={16} />,
      label: "Przenieś do kanałów",
      canShow: () => channel?.code === DEFAULT_CHANNEL_CODE,
      onClick: async ({ data, table }) => {
        try {
          const items = Object.entries(table.getState().rowSelection)
            .map(([key, value]) => {
              if (value) return key;
            })
            .filter((p): p is string => Boolean(p));
          const { [mode!]: data } = await apiClient("query")({
            [mode!]: [
              { options: { filter: { id: { in: items } } } },
              {
                items: {
                  id: true,
                  name: true,
                  slug: true,
                  ...(withPriceFactor
                    ? {
                        variantList: [
                          {
                            options: {
                              take: 1,
                              sort: { priceWithTax: SortOrder.DESC },
                            },
                          },
                          {
                            items: {
                              currencyCode: true,
                              price: true,
                              priceWithTax: true,
                            },
                          },
                        ],
                      }
                    : {}),
                },
              },
            ],
          } as any);

          const { channelId, ids, priceFactor } =
            await createDialogFromComponent(
              ManageEntityToChannelsDialog,
              { items: (data as any).items, withPriceFactor },
              {},
            );
          const {
            [`assign${mode!.charAt(0).toUpperCase() + mode!.slice(1)}ToChannel`]:
              result,
          } = await apiClient("mutation")({
            [`assign${mode!.charAt(0).toUpperCase() + mode!.slice(1)}ToChannel`]:
              [
                {
                  input: {
                    channelId,
                    productIds: ids,
                    ...(withPriceFactor ? { priceFactor } : {}),
                  },
                },
                { id: true },
              ],
          } as any);

          console.log(result);
          return { success: "" };
        } catch {
          return { error: "" };
        }
      },
    },
    {
      icon: <FolderOpen size={16} />,
      label: "Usuń z kanałów",
      canShow: () => channel?.code === DEFAULT_CHANNEL_CODE,
      onClick: async ({ data }) => {
        try {
          return { success: "" };
        } catch {
          return { error: "" };
        }
      },
    },
  ];
};
