import React from "react";

import { usePluginStore } from "@/plugins/plugin-context";
import { Renderer } from "@/components/core";
import { DetailLocationID, DetailLocationSidebarID } from "@/types";
import { Button } from "@/components";
import { toast } from "sonner";
import { CopyIcon, PlugZap } from "lucide-react";

export const DetailViewMarker = ({
  position,
  tab,
}: {
  position?: DetailLocationID | DetailLocationSidebarID;
  tab?: string;
}) => {
  const { viewMarkers, openDropdown, setOpenDropdown } = usePluginStore();

  const code = `const DeenruvUIPlugin = createDeenruvUIPlugin({
    extensions: [{
        id: "my-extension",
        surface: "${position}",${tab ? `\n        tab: "${tab}",` : ""}
        order: 10,
        component: YourComponent,
    }],
});`;

  const highlightedCode = code.replace(
    /(surface: ")([^"]*)(")/g,
    `$1<span class="text-green-500 font-bold">$2</span>$3`,
  );

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (!position) return null;
  return (
    <>
      {viewMarkers ? (
        <div className="relative z-50 flex flex-col gap-4">
          <Button
            className="rounded-md"
            size="icon"
            variant="outline"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <PlugZap size={16} />
          </Button>
          {openDropdown && (
            <div className="bg-secondary absolute left-8 top-8 flex min-w-96 flex-col gap-2 rounded-md p-4 shadow-2xl">
              <p className="max-w-sm text-sm">
                Create a new component using the extensions API
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
            </div>
          )}
        </div>
      ) : null}
      <Renderer position={position} tab={tab} />
    </>
  );
};
