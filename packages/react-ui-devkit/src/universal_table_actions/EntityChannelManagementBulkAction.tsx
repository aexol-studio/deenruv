import {
  CLOSED_WITHOUT_RESOLUTION,
  createDialogFromComponent,
} from "@/universal_utils/createDialogFromComponentFunction.js";
import { FolderOpen } from "lucide-react";
import React from "react";
import { ManageEntityToChannelsDialog } from "./ManageEntityToChannelsDialog.js";
import { ListLocations } from "@/types/index.js";
import { useSettings } from "@/state/settings.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { DeenruvUITable } from "@/plugins/types.js";
import { SortOrder } from "@deenruv/admin-types";
import { DeleteEntityFromChannelsDialog } from "./DeleteEntityFromChannelsDialog.js";
import { useTranslation } from "@/hooks/useTranslation.js";

type BulkAction<K extends keyof typeof ListLocations> = NonNullable<
  DeenruvUITable<K>["bulkActions"]
>[number];

export const EntityChannelManagementBulkAction = <
  K extends keyof typeof ListLocations,
>(
  type: K,
): BulkAction<K>[] => {
  const { t } = useTranslation("common");
  const channel = useSettings((state) => state.selectedChannel);
  let mode: string | undefined = undefined;
  let withSlug = false;
  let withCode = false;
  switch (type) {
    case "products-list-view":
      mode = "products";
      withSlug = true;
      withCode = false;
      break;
    case "productVariants-list-view":
      mode = "productVariants";
      withSlug = false;
      withCode = false;
      break;
    case "collections-list-view":
      mode = "collections";
      withSlug = true;
      withCode = false;
      break;
    case "facets-list-view":
      mode = "facets";
      withSlug = false;
      withCode = true;
      break;
  }
  const withPriceFactor = mode === "products" || mode === "productVariants";
  const graphQLName = `${mode?.charAt(0).toUpperCase()}${mode?.slice(1)}`;
  const assignName = `assign${graphQLName}ToChannel`;
  const removeName = `remove${graphQLName}FromChannel`;
  const base = `${graphQLName.charAt(0).toLowerCase() + graphQLName.slice(1)}`;
  const withoutS = base.endsWith("s") ? base.slice(0, -1) : base;
  const inputParam = [withoutS, "Ids"].join("");

  if (!mode) {
    return [
      {
        label: "",
        icon: <FolderOpen size={16} />,
        canShow: () => false,
        onClick: async () => {
          return { info: "Nie można zarządzać kanałami w tej lokalizacji" };
        },
      },
    ];
  }

  return [
    {
      icon: <FolderOpen size={16} />,
      label: t("Przenieś do kanału"),
      onClick: async ({ table }) => {
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
                  ...(withSlug ? { slug: true } : {}),
                  ...(withCode ? { code: true } : {}),
                  ...(withPriceFactor && mode === "productVariants"
                    ? { currencyCode: true, price: true, priceWithTax: true }
                    : {}),
                  ...(withPriceFactor && mode === "products"
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
              {
                items:
                  mode === "products"
                    ? (data as any).items
                    : ((data as any).items as any[]).map((d) => ({
                        ...d,
                        variantList: { items: [d] },
                      })),
                withPriceFactor,
                withSlug,
                withCode,
              },
              {},
            );
          const { [assignName]: result } = await apiClient("mutation")({
            [assignName]: [
              {
                input: {
                  channelId,
                  [inputParam]: ids,
                  ...(withPriceFactor ? { priceFactor } : {}),
                },
              },
              { __typename: true },
            ],
          } as any);
          let success = "";

          if (withPriceFactor) {
            success = t(
              `elementów zostało przypisanych do kanału z mnożnikiem`,
              { count: (result as any)?.length, factor: priceFactor },
            );
          } else {
            success = t("elementów zostało przypisanych do kanału", {
              count: (result as any)?.length,
            });
          }

          return { success };
        } catch (e) {
          const message = e instanceof Error ? e.message : e;
          if (
            typeof message === "string" &&
            message.includes(CLOSED_WITHOUT_RESOLUTION)
          ) {
            return { info: t("Nie zatwierdzono akcji") };
          }
          return { error: t("Nie udało się przypisać elementów z kanału") };
        }
      },
    },
    {
      icon: <FolderOpen size={16} />,
      label: t("Usuń z kanału"),
      canShow: () => channel?.code !== DEFAULT_CHANNEL_CODE,
      onClick: async ({ table }) => {
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
                  ...(withSlug ? { slug: true } : {}),
                  ...(withCode ? { code: true } : {}),
                },
              },
            ],
          } as any);
          const { channelId, ids } = await createDialogFromComponent(
            DeleteEntityFromChannelsDialog,
            { items: (data as any).items },
            {},
          );
          const { [removeName]: result } = await apiClient("mutation")({
            [removeName]: [
              { input: { channelId, [inputParam]: ids } },
              type === "productVariants-list-view"
                ? true
                : { __typename: true },
            ],
          } as any);
          let success = "";
          if (type === "productVariants-list-view") {
            if ((result as string[]).length === ids.length) {
              success = t("Elementy zostały usunięte z kanału");
            } else {
              success = t(`Nie wszystkie elementy zostały usunięte z kanału`, {
                count: (result as string[]).length,
              });
            }
          } else {
            const inUseEntities = (result as any).filter((item: any) =>
              item.__typename.includes("InUseError"),
            );
            if (inUseEntities.length > 0) {
              success = t(
                `elementów nie można usunąć z kanału, ponieważ są używane`,
                { count: inUseEntities.length },
              );
            } else {
              success = t("Elementy zostały usunięte z kanału");
            }
          }
          return { success };
        } catch (e) {
          const message = e instanceof Error ? e.message : e;
          if (
            typeof message === "string" &&
            message.includes(CLOSED_WITHOUT_RESOLUTION)
          ) {
            return { info: t("Nie zatwierdzono akcji") };
          }
          return { error: t("Nie udało się usunąć elementów z kanału") };
        }
      },
    },
  ];
};
