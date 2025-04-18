import {
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React from "react";
import { translationNS } from "../translation-ns.js";
import { ReplicateRoomStyle } from "../graphql/selectors.js";

export const RoomStyleSelect: React.FC<{
  roomThemes?: ReplicateRoomStyle[];
  onSelect: (newValue: string) => void;
  selectedValue?: string;
}> = ({ roomThemes, onSelect, selectedValue }) => {
  const { t } = useTranslation(translationNS);
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{t("room_style")}</Label>
      <div className="p-2 grid grid-cols-4 gap-4 grid-auto-flow-dense">
        {roomThemes?.map(({ image, label, value }) => (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <div
                  key={value}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary",
                    "transition-transform hover:scale-[1.02]",
                    "w-full h-[75px] p-0.5",
                    selectedValue === value ? "ring-2 ring-primary" : "",
                  )}
                  onClick={() => {
                    if (!image || !label || !value) return;
                    onSelect(value);
                  }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${label} theme preview`}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-semibold">{t(label as string)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
