import { createDialogFromComponent } from "@/universal_utils/createDialogFromComponentFunction.js";
import { FolderOpen } from "lucide-react";
import React from "react";
import { MoveEntityToChannels } from "./MoveEntityToChannels.js";
import { ListLocations } from "@/types/index.js";
import { useSettings } from "@/state/settings.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { DeenruvUITable } from "@/plugins/types.js";

type RowAction<K extends keyof typeof ListLocations> = NonNullable<
  DeenruvUITable<K>["rowActions"]
>[number];

export const EntityChannelManagementRowAction = <
  K extends keyof typeof ListLocations,
>(): RowAction<K>[] => {
  const channel = useSettings((state) => state.selectedChannel);
  return [
    {
      icon: <FolderOpen size={16} />,
      label: "Przenieś do kanałów",
      canShow: () => channel?.code === DEFAULT_CHANNEL_CODE,
      onClick: async ({ row, refetch }) => {
        try {
          const result = await createDialogFromComponent(MoveEntityToChannels, {
            items: [row.original],
          });
          const input = {
            channelId: result.channelId,
            collectionIds: result.ids,
          };
          const { assignCollectionsToChannel } = await apiClient("mutation")({
            assignCollectionsToChannel: [{ input }, { id: true }],
          });
          if (!assignCollectionsToChannel) {
            throw new Error("Failed to assign collections to channel");
          }
          refetch();
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
      onClick: async ({ row, refetch }) => {
        try {
          const result = await createDialogFromComponent(MoveEntityToChannels, {
            items: [row.original],
          });
          const input = {
            channelId: result.channelId,
            collectionIds: result.ids,
          };
          const { assignCollectionsToChannel } = await apiClient("mutation")({
            assignCollectionsToChannel: [{ input }, { id: true }],
          });
          if (!assignCollectionsToChannel) {
            throw new Error("Failed to assign collections to channel");
          }
          refetch();
          return { success: "" };
        } catch {
          return { error: "" };
        }
      },
    },
  ];
};
