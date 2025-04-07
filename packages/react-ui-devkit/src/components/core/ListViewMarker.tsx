import React from "react";

import { usePluginStore } from "@/plugins/plugin-context";
import { LocationKeys } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CopyIcon, PlugZap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover.js";
import { Button } from "../atoms/button.js";
import { toast } from "sonner";

export const ListViewMarker = ({
  column,
  position,
}: {
  column: ColumnDef<any, any>;
  position: LocationKeys;
}) => {
  const { viewMarkers } = usePluginStore();

  const code = `const DeenruvUIPlugin = createPlugin({
    tables: [{
        id: "${position}",
        bulkActions: [],
        columns: [{
            id: "${column.id?.includes("customFields") ? column.id?.replace("_", ".") : column.id}",
        }],
    }],
});`;
  const highlightedCode = code.replace(
    /(id: )([^,]*)/g,
    `$1<span class="text-green-500 font-bold">$2</span>`,
  );
  const copyCode = () => {
    try {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  if (
    !viewMarkers ||
    (column.id && ["actions", "select-id"].includes(column.id))
  )
    return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-1">
          <PlugZap className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <p className="max-w-sm text-sm">
          Create a new component using following code
        </p>
        <div className="bg-card relative rounded-md p-4">
          <pre
            className="whitespace-pre-wrap text-xs leading-4 text-gray-200"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={copyCode}
            className="absolute right-2 top-2"
          >
            <CopyIcon size={16} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
