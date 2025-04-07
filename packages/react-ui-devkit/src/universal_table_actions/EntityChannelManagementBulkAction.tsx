import { createDialogFromComponent } from "@/universal_utils/createDialogFromComponentFunction.js";
import { FolderOpen } from "lucide-react";
import React from "react";
import { MoveEntityToChannels } from "./MoveEntityToChannels.js";
import { ListLocations } from "@/types/index.js";
import { useSettings } from "@/state/settings.js";
import { DEFAULT_CHANNEL_CODE } from "@/consts/defaultChannel.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { DeenruvUITable } from "@/plugins/types.js";

type BulkAction<K extends keyof typeof ListLocations> = NonNullable<
  DeenruvUITable<K>["bulkActions"]
>[number];

export const EntityChannelManagementBulkAction = <
  K extends keyof typeof ListLocations,
>(): BulkAction<K>[] => {
  const channel = useSettings((state) => state.selectedChannel);
  return [
    {
      icon: <FolderOpen size={16} />,
      label: "Przenieś do kanałów",
      canShow: () => channel?.code === DEFAULT_CHANNEL_CODE,
      onClick: async ({ data }) => {
        try {
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
