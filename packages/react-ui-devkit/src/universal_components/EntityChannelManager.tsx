import React, { useCallback } from "react";
import { CustomCard } from "./CustomCard.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import { CardIcons } from "@/consts/icons.js";
import { Badge, Button } from "@/components/index.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { cn } from "@/lib/utils.js";
import { Trash } from "lucide-react";
import { ConfirmationDialog } from "./ConfirmationDialog.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { toast } from "sonner";
import { ManageEntityToChannelsDialog } from "@/universal_table_actions/ManageEntityToChannelsDialog.js";
import { createDialogFromComponent } from "@/universal_utils/createDialogFromComponentFunction.js";

type EntityType = "product" | "productVariant" | "collection";
type EntityChannel = {
  id: string | null | undefined;
  code: string | null | undefined;
};
type EntityVariantListItemType = {
  price?: number;
  priceWithTax?: number;
  currencyCode?: string;
};
type ManageEntityToChannelsDialogProps = {
  id: string;
  variantList?: { items?: EntityVariantListItemType[] };
  slug: string | null | undefined;
  code: string | null | undefined;
  name: string | null | undefined;
};
interface EntityChannelManagerProps {
  entity: EntityType;
  entityId: string | undefined | null;
  entityChannels: EntityChannel[];
  onRemoveSuccess?: () => void;
  entityName?: string | undefined | null;
  entitySlug?: string | undefined | null;
  entityCode?: string | undefined | null;
  entityVariantList?: {
    items?: EntityVariantListItemType[];
  };
}

export const EntityChannelManager: React.FC<EntityChannelManagerProps> = ({
  entity,
  entityChannels,
  entityId,
  onRemoveSuccess,
  entityCode,
  entityVariantList,
  entitySlug,
  entityName,
}) => {
  const { t } = useTranslation(["common", "channels"]);

  const handleRemove = useCallback(
    async (ctx: {
      channelId: string | undefined | null;
      entityId?: string | undefined | null;
      isDefault: boolean;
    }) => {
      const { isDefault, channelId, entityId } = ctx;
      if (!entityId || isDefault || !channelId) return;
      try {
        switch (entity) {
          case "product":
            await apiClient("mutation")({
              removeProductsFromChannel: [
                {
                  input: {
                    productIds: [entityId],
                    channelId,
                  },
                },
                { id: true },
              ],
            });
            break;
          case "productVariant":
            await apiClient("mutation")({
              removeProductVariantsFromChannel: [
                {
                  input: {
                    productVariantIds: [entityId],
                    channelId,
                  },
                },
                true,
              ],
            });
            break;
          case "collection":
            await apiClient("mutation")({
              removeCollectionsFromChannel: [
                {
                  input: {
                    collectionIds: [entityId],
                    channelId,
                  },
                },
                { id: true },
              ],
            });

            break;
          default:
            throw new Error(`Unsupported entity type: ${entity}`);
        }
        toast(t("toasts.update"), {
          description: new Date().toLocaleString(),
        });
        onRemoveSuccess?.();
      } catch (e) {
        console.log(e);
        toast.error(t("error.mutation"));
      }
    },
    [entity, entityId, onRemoveSuccess],
  );

  const onAssignToChannel = useCallback(async () => {
    if (!entityId) return;
    try {
      const { channelId, ids, priceFactor } = await createDialogFromComponent(
        ManageEntityToChannelsDialog<ManageEntityToChannelsDialogProps>,
        {
          items: [
            {
              id: entityId,
              variantList: entityVariantList,
              slug: entitySlug,
              code: entityCode,
              name: entityName,
            },
          ],
          withPriceFactor: !!entityVariantList?.items?.length,
          withSlug: !!entitySlug,
          withCode: !!entityCode,
        },
        {},
      );
      switch (entity) {
        case "product":
          await apiClient("mutation")({
            assignProductsToChannel: [
              {
                input: {
                  productIds: ids,
                  channelId,
                },
              },
              { id: true },
            ],
          });
          break;
        case "productVariant":
          await apiClient("mutation")({
            assignProductVariantsToChannel: [
              {
                input: {
                  productVariantIds: ids,
                  channelId,
                  priceFactor,
                },
              },
              { id: true },
            ],
          });
          break;
        case "collection":
          await apiClient("mutation")({
            assignCollectionsToChannel: [
              {
                input: {
                  collectionIds: ids,
                  channelId,
                },
              },
              { id: true },
            ],
          });
          break;
        default:
          throw new Error(`Unsupported entity type: ${entity}`);
      }
      toast(t("toasts.update"), {
        description: new Date().toLocaleString(),
      });
    } catch (e) {
      toast.error(t("error.mutation"));
      console.log(e);
    }
  }, [entityCode, entitySlug, entityId, entityName, entity]);

  return (
    <CustomCard
      title={
        entityChannels.some((channel) => channel.code === DEFAULT_CHANNEL_CODE)
          ? t("entity.channel_few")
          : t("entity.channel_one")
      }
      color="orange"
      icon={<CardIcons.default />}
      upperRight={
        <Button size="sm" variant="secondary" onClick={onAssignToChannel}>
          assign to channel
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {entityChannels.map((p) => {
          const isDefault = p.code === DEFAULT_CHANNEL_CODE;
          return (
            <ConfirmationDialog
              key={p.id}
              onConfirm={() =>
                handleRemove({ isDefault, channelId: p.id, entityId })
              }
            >
              <div className="flex group select-none">
                <Badge
                  className={cn(
                    !isDefault && "rounded-e-none pr-1 cursor-pointer ",
                  )}
                  key={p.id}
                >
                  {isDefault ? t("channels:defaultChannel") : p.code}
                </Badge>
                {!isDefault && (
                  <div className="bg-primary cursor-pointer text-primary-foreground h-full transition-colors pl-1 pr-2 flex items-center rounded-e-full group-hover:bg-destructive group-hover:text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground">
                    <Trash size={16} />
                  </div>
                )}
              </div>
            </ConfirmationDialog>
          );
        })}
      </div>
    </CustomCard>
  );
};
